<template>
  <div class="md-layout-item md-size-100">
    <nav-tabs-card>
      <template slot="content">
        <md-card-header data-background-color="green">
          <div class="md-layout md-size-100 md-alignment-center">
            <div class="md-layout-item md-size-25 md-xsmall-size-100">
              <h4 class="title">Список новин</h4>
              <p>Керуйте новинами, як професіонал.</p>
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
                <md-icon> note_add</md-icon>
                Додати новину
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
              src="./img/sad-face.png"
              alt="Sad emoji"
              class="not-fond-block__emoji"
            />
          </div>
        </div>
        <!-- / NOT FOUND BLOCK -->

        <md-card-content v-else>
          <nav-tabs-table
            :data="news"
            :cells="[
              { cell: 'Назва новини', field: 'title' },
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
import { News, Gallery } from "@/services/index";
import { NEWSMESSAGES } from "./messages";
const {
  getNews,
  deleteNews,
  editNews,
  createNews,
  search,
  uploadTitlePhoto
} = new News();
const { delPicture } = new Gallery();

//Functions
const isItemHasPhoto = item => {
  return item.hasOwnProperty("photo") && item.photo.length > 0;
};

const updateImage = async item => {
  if (isItemHasPhoto(item)) {
    try {
      item.photo[0].hasOwnProperty("file")
        ? await uploadTitlePhoto(item.id, item.photo[0].file)
        : false;
    } catch (err) {
      console.error(err);
      this.notifyVue("Image did not update", "warning", "danger");
    }
  }
  return;
};

const deleteImage = async item => {
  if (item.hasOwnProperty("photo") && item.photo.hasOwnProperty("filename")) {
    const filename = item.photo.filename;
    try {
      await delPicture(filename);
    } catch (err) {
      console.log(err);
    }
  }
};

export default {
  name: "News",
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
    news: [],
    selectedItem: {},
    count: null,
    selectedAction: "create",
    isLoading: false,
    isMainLoading: false,
    searchValue: null,
    employees: [],
    timer: null
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
      return this.news.length < this.count;
    },
    title() {
      if (this.selectedAction === "create") {
        return "Створити новину";
      }
      return "Редагувати новину";
    }
  },
  methods: {
    async createRecord() {
      const {
        title,
        content,
        description,
        visible,
        category
      } = this.selectedItem;
      const catId =
        category !== undefined && category.hasOwnProperty("id")
          ? category.id
          : "";
      this.isLoading = true;
      let query;

      //Create record
      try {
        query = await createNews(
          {
            title,
            content,
            visible,
            category: catId,
            description
          },
          this.token
        );

        if (!query.success) {
          this.notifyVue(NEWSMESSAGES.REJECT.NOT_CREATED, "warning", "danger");
          this.isLoading = true;
          return;
        }
      } catch (err) {
        console.error(err);
        this.notifyVue(NEWSMESSAGES.REJECT.ERROR, "warning", "danger");
        this.isLoading = false;
        return;
      }

      // Upload file
      await updateImage({ ...this.selectedItem, id: query.key });

      this.isLoading = false;
      this.notifyVue(NEWSMESSAGES.SUCCESS.SAVED, "done", "success");
      const news = await getNews(0, 1);
      this.news = [news.data[0], ...this.news];
      this.closeDialog();
    },

    async editRecord() {
      const { id, category } = this.selectedItem;
      const catId =
        category !== undefined && category.hasOwnProperty("id")
          ? category.id
          : category;
      const newData = {
        ...this.selectedItem,
        category: catId
      };

      const index = this.news.findIndex(el => el.id === id);
      const item = this.news[index];
      this.isLoading = true;

      //delete image
      const isNewsHasPhoto = item.hasOwnProperty("photo");
      const isEqualUrl =
        isNewsHasPhoto && isItemHasPhoto(newData)
          ? newData.photo[0].url !== item.photo.url
          : false;

      if (!isItemHasPhoto(newData) && isNewsHasPhoto) {
        await deleteImage(item);
      } else {
        isEqualUrl ? await deleteImage(item) : false;
      }

      //update post
      try {
        const query = await editNews(id, newData, this.token);
        //update image
        await updateImage(this.selectedItem);

        if (query.success) {
          const updatedNewsData = await getNews(index, 1);
          this.news.splice(index, 1, updatedNewsData.data[0]);
          this.notifyVue(NEWSMESSAGES.SUCCESS.UPDATED, "done", "success");
        } else {
          this.notifyVue(NEWSMESSAGES.REJECT.NOT_UPDATED, "warning", "danger");
        }
      } catch (err) {
        this.notifyVue(NEWSMESSAGES.REJECT.ERROR, "warning", "danger");
        console.error(err);
      }

      this.isLoading = false;
      this.closeDialog();
    },

    async deleteItem(id) {
      const index = this.news.findIndex(el => el.id === id);
      const item = this.news[index];
      // delete image
      await deleteImage(item);
      // delete news from DB
      const result = await deleteNews(id, this.token);
      if (result.success) {
        this.news.splice(index, 1);
        this.count = this.count - 1;
        this.notifyVue(NEWSMESSAGES.SUCCESS.DELETED, "done", "success");
      } else {
        this.notifyVue(NEWSMESSAGES.REJECT.NOT_DELETED, "warning", "danger");
        return;
      }

      if (this.isMore) {
        const newsArr = await getNews(this.news.length, 1);
        this.createNewsData(newsArr);
      }
    },

    async toggleVisible(item) {
      const newData = {
        ...item,
        visible: !item.visible
      };
      const index = this.news.findIndex(el => el.id === item.id);

      try {
        const query = await editNews(item.id, newData, this.token);
        if (query.success) {
          this.news.splice(index, 1, newData);

          const message = item.visible
            ? NEWSMESSAGES.SUCCESS.DRAFT
            : NEWSMESSAGES.SUCCESS.PUBLISHED;
          this.notifyVue(message, "done", "success");
          return;
        }

        this.notifyVue(NEWSMESSAGES.REJECT.NOT_DRAFT, "warning", "danger");
      } catch (err) {
        this.notifyVue(NEWSMESSAGES.REJECT.ERROR, "warning", "danger");
        console.error(err);
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
      const item = this.news.find(el => el.id === id);
      this.selectedItem = Object.assign({}, item);
      this.selectedAction = "update";
      this.openDialog();
    },

    async downloadMore() {
      this.isLoading = true;
      const startItem = this.news.length;
      let next;
      if (this.searchValue) {
        next = await search(this.searchValue, startItem, this.itemsOnPage);
      } else {
        next = await getNews(startItem, this.itemsOnPage);
      }
      this.isLoading = false;
      this.createNewsData(next);
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

    categoryName(category) {
      return !_.isUndefined(category) ? category.title : "-";
    },

    async search(value, startAt, count) {
      this.news = [];
      this.isMainLoading = !this.isMainLoading;
      const query = await search(value, startAt, count);
      if (query.success) {
        this.isMainLoading = !this.isMainLoading;
        this.createNewsData(query);
        return;
      }

      this.isMainLoading = !this.isMainLoading;
      this.createNewsData({
        newsCount: 0,
        data: []
      });
    },

    createNewsData(value) {
      this.count = value.newsCount;
      value.data.forEach(el => this.news.push(el));
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
    const news = await getNews(0, this.itemsOnPage);
    this.isMainLoading = false;
    this.createNewsData(news);
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
