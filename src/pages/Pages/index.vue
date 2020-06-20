<template>
  <div class="md-layout-item md-size-100">
    <nav-tabs-card>
      <template slot="content">
        <md-card-header data-background-color="green">
          <div class="md-layout md-size-100 md-alignment-center">
            <div class="md-layout-item md-size-25 md-xsmall-size-100">
              <h4 class="title">Список сторінок</h4>
              <p>Керуйте сторінками, як професіонал.</p>
            </div>
            <div class="md-layout-item md-size-50 md-xsmall-size-100">
              <md-autocomplete
                class="search__input"
                v-model="searchValue"
                :md-options="employees"
              >
                <label>Пошук...</label>
              </md-autocomplete>
            </div>
            <div class="md-layout-item md-size-25 md-xsmall-size-100 allign">
              <md-button class="md-primary" @click="openDialogForNewRecord()">
                <md-icon>note_add</md-icon>Додати сторінку
              </md-button>
            </div>
          </div>
        </md-card-header>

        <!-- NOT FOUND BLOCK -->
        <div class="not-fond-block" v-if="count === 0">
          <div class="row">
            <h2>УПС... Нічого не знайдено</h2>
          </div>
          <div class="row">
            <img
              src="../News/img/sad-face.png"
              alt="Sad emoji"
              class="not-fond-block__emoji"
            />
          </div>
        </div>
        <!-- / NOT FOUND BLOCK -->

        <md-card-content v-else>
          <nav-tabs-table
            :data="pages"
            :cells="[
              { cell: 'Назва сторінки', field: 'title' },
              {
                cell: 'Категорія',
                field: 'category',
                function: categoryName
              },
              {
                cell: 'Час створення',
                field: 'created',
                function: transformTime
              }
            ]"
            @edit-item="openDialogForEditRecord"
            @toggle-visible-item="toggleVisible"
            @delete-item="deleteItem"
            @download-more="downloadMore"
          />
          <main-loading v-if="isMainLoading" />
          <div class="more-block" v-if="isMore">
            <md-button class="md-success" @click="downloadMore">
              <loading v-if="isLoading" />
              <span v-else>Більше новин</span>
            </md-button>
          </div>
        </md-card-content>
      </template>
    </nav-tabs-card>
    <!-- Dialog Window -->
    <dialog-window
      :title="title"
      :isActive="isActiveDialog"
      :action="computedAction"
      :isLoading="isLoading"
      :table="table"
      @close-dialog="closeDialog()"
      v-model="selectedItem"
    />
  </div>
</template>

<script>
import _ from "lodash";

import { NavTabsCard, NavTabsTable } from "@/components";
import DialogWindow from "./DialogWindow";
import { MiniLoading, MainLoading } from "../../components/Loading";
import { Pages, Categories } from "@/services/index";
import { NEWSMESSAGES } from "./messages";
const { getPages, deletePage, editPage, createPage, search } = new Pages();
const { updateCount, getCategories } = new Categories();

export default {
  name: "Pages",
  components: {
    NavTabsCard,
    NavTabsTable,
    DialogWindow,
    loading: MiniLoading,
    MainLoading
  },
  data: () => ({
    isActiveDialog: false,
    startAt: 0,
    itemsOnPage: 10,
    pages: [],
    categories: null,
    selectedItem: {},
    count: null,
    selectedAction: "create",
    isLoading: false,
    isMainLoading: false,
    searchValue: null,
    employees: [],
    timer: null,
    table: "pages"
  }),
  computed: {
    token() {
      return this.$store.getters.getUser.token;
    },
    computedAction() {
      return this.selectedAction == "create"
        ? this.createRecord
        : this.editRecord;
    },
    isMore() {
      return this.pages.length < this.count;
    },
    title() {
      if (this.selectedAction === "create") {
        return "Створити сторінку";
      }
      return "Редагувати сторінку";
    }
  },
  methods: {
    async createRecord() {
      const { title, content, visible, category } = this.selectedItem;
      const catId =
        category !== undefined && category.hasOwnProperty("id")
          ? category.id
          : "";
      this.isLoading = true;
      let query;

      //Create record
      try {
        query = await createPage(
          {
            title,
            content,
            visible,
            category: catId
          },
          this.token
        );

        if (!query.success) {
          this.notifyVue(NEWSMESSAGES.REJECT.NOT_CREATED, "warning", "danger");
          this.isLoading = true;
          return;
        }
      } catch (err) {
        this.notifyVue(NEWSMESSAGES.REJECT.ERROR, "warning", "danger");
        this.isLoading = false;
        return;
      }

      await updateCount({
        id: catId,
        table: this.table,
        token: this.token,
        action: "new"
      });

      this.isLoading = false;
      this.notifyVue(NEWSMESSAGES.SUCCESS.SAVED, "done", "success");

      this.pages = [];
      this.isMainLoading = true;
      const pages = await getPages(0, this.itemsOnPage);
      this.isMainLoading = false;
      this.createPagesData(pages);

      this.closeDialog();
    },

    async editRecord() {
      const { id, category } = this.selectedItem;
      //get ID of new category
      const catId =
        category !== undefined && category.hasOwnProperty("id")
          ? category.id
          : category;
      const newData = {
        ...this.selectedItem,
        category: catId
      };

      const index = this.pages.findIndex(el => el.id === id);
      const item = this.pages[index];
      //get ID of old category
      const oldCategory = item.category;
      const oldCatId =
        oldCategory !== undefined && oldCategory.hasOwnProperty("id")
          ? oldCategory.id
          : oldCategory;
      this.isLoading = true;

      //update post
      try {
        const query = await editPage(id, newData, this.token);

        if (query.success) {
          const updatedPageData = await getPages(index, 1);
          this.pages.splice(index, 1, updatedPageData.data[0]);

          if (catId !== oldCatId) {
            await updateCount({
              id: catId,
              oldId: oldCatId,
              table: this.table,
              token: this.token,
              action: "update"
            });
          }

          this.notifyVue(NEWSMESSAGES.SUCCESS.UPDATED, "done", "success");
        } else {
          this.notifyVue(NEWSMESSAGES.REJECT.NOT_UPDATED, "warning", "danger");
        }
      } catch (err) {
        this.notifyVue(NEWSMESSAGES.REJECT.ERROR, "warning", "danger");
      }

      this.isLoading = false;
      this.closeDialog();
    },

    async deleteItem(id) {
      if (!window.confirm("Ви дійсно бажаєте видалити запис?")) return;

      const index = this.pages.findIndex(el => el.id === id);
      const item = this.pages[index];
      //find category
      const { category } = item;
      const catId =
        category !== undefined && category.hasOwnProperty("id")
          ? category.id
          : category;

      const result = await deletePage(id, this.token);
      if (result.success) {
        this.pages.splice(index, 1);
        this.count = this.count - 1;

        await updateCount({
          id: catId,
          table: this.table,
          token: this.token,
          action: "remove"
        });

        this.notifyVue(NEWSMESSAGES.SUCCESS.DELETED, "done", "success");
      } else {
        this.notifyVue(NEWSMESSAGES.REJECT.NOT_DELETED, "warning", "danger");
        return;
      }

      if (this.isMore) {
        const pagesArr = await getPages(this.pages.length, 1);
        this.createPagesData(pagesArr);
      }
    },

    async toggleVisible(item) {
      const newData = {
        ...item,
        visible: !item.visible
      };
      const index = this.pages.findIndex(el => el.id === item.id);

      try {
        const query = await editPage(item.id, newData, this.token);
        if (query.success) {
          this.pages.splice(index, 1, newData);

          const message = item.visible
            ? NEWSMESSAGES.SUCCESS.DRAFT
            : NEWSMESSAGES.SUCCESS.PUBLISHED;
          this.notifyVue(message, "done", "success");
          return;
        }

        this.notifyVue(NEWSMESSAGES.REJECT.NOT_DRAFT, "warning", "danger");
      } catch (err) {
        this.notifyVue(NEWSMESSAGES.REJECT.ERROR, "warning", "danger");
      }
    },

    openDialogForNewRecord() {
      this.selectedAction = "create";
      this.selectedItem = {
        visible: true
      };
      this.openDialog();
    },

    openDialogForEditRecord(id) {
      const item = this.pages.find(el => el.id === id);
      this.selectedItem = Object.assign({}, item);
      this.selectedAction = "update";
      this.openDialog();
    },

    async downloadMore() {
      this.isLoading = true;
      const startItem = this.pages.length;
      let next;
      if (this.searchValue) {
        next = await search(this.searchValue, startItem, this.itemsOnPage);
      } else {
        next = await getPages(startItem, this.itemsOnPage);
      }
      this.isLoading = false;
      this.createPagesData(next);
    },

    openDialog() {
      this.isActiveDialog = !this.isActiveDialog;
    },

    closeDialog() {
      this.isActiveDialog = !this.isActiveDialog;
    },

    notifyVue(
      message,
      icon,
      type,
      verticalAlign = "top",
      horizontalAlign = "right"
    ) {
      this.$notify({ message, icon, horizontalAlign, verticalAlign, type });
    },

    transformTime(time) {
      if (time) {
        return new Date(time).toLocaleDateString("ukr", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      }

      return;
    },

    categoryName(el) {
      return !_.isUndefined(el) ? el.title : "-";
    },

    async search(value, startAt, count) {
      this.pages = [];
      this.isMainLoading = !this.isMainLoading;
      const query = await search(value, startAt, count);
      if (query.success) {
        this.isMainLoading = !this.isMainLoading;
        this.createPagesData(query);
        return;
      }

      this.isMainLoading = !this.isMainLoading;
      this.createPagesData({
        newsCount: 0,
        data: []
      });
    },

    createPagesData(value) {
      this.count = value.newsCount;
      value.data.forEach(el => this.pages.push(el));
    }
  },
  watch: {
    searchValue: {
      handler(value) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.search(value, 0, this.itemsOnPage);
        }, 500);
      }
    }
  },
  async created() {
    this.isMainLoading = true;
    const pages = await getPages(0, this.itemsOnPage);
    this.isMainLoading = false;
    this.createPagesData(pages);
  }
};
</script>

<style lang="scss" scoped>
.more-block {
  width: 100%;
  text-align: center;
  padding: 20px;
}
.md-field .md-input {
  -webkit-text-fill-color: #fff !important;
}
.md-field:before {
  background-color: #fff !important;
}
.md-field label {
  color: #fff !important;
}
.allign {
  display: flex;
  align-content: center;
  justify-content: center;
}
.not-fond-block {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  width: 100%;
  padding: 25px;
}
.not-fond-block .row {
  text-align: center;
}
.not-fond-block__emoji {
  width: 100%;
  height: auto;
  max-width: 250px;
}
</style>
