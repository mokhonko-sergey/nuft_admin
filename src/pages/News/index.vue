<template>
  <div class="md-layout-item md-size-100">
    <nav-tabs-card>
      <template slot="content">
        <md-card-header data-background-color="green">
          <div class="md-layout md-size-100 md-alignment-center">
            <div class="md-layout-item md-size-25 md-xsmall-size-100">
              <h4 class="title">List of news</h4>
              <p>Create, update, delete.</p>
            </div>
            <div class="md-layout-item md-size-50 md-xsmall-size-100">
              <md-autocomplete
                class="search__input"
                v-model="searchValue"
                :md-options="employees"
              >
                <label>Search...</label>
              </md-autocomplete>
            </div>
            <div class="md-layout-item md-size-25 md-xsmall-size-100 allign">
              <!-- flex -->
              <md-button class="md-primary" @click="openDialogForNewRecord()">
                <md-icon> note_add</md-icon>
                Add news
              </md-button>
            </div>
          </div>
        </md-card-header>
        <md-card-content>
          <nav-tabs-table
            :data="transformNewsData"
            :cells="{
              Title: 'title',
              'Created Time': 'created',
              'Updated Time': 'updated'
            }"
            @edit-item="openDialogForEditRecord"
            @toggle-visible-item="toggleVisible"
            @delete-item="deleteItem"
            @download-more="downloadMore"
          />
          <main-loading v-if="isMainLoading" />
          <div class="more-block" v-if="isMore">
            <md-button class="md-success" @click="downloadMore">
              <loading v-if="isLoading" />
              <span v-else>Show More</span>
            </md-button>
          </div>
        </md-card-content>
      </template>
    </nav-tabs-card>
    <dialog-window
      title="Add Post"
      :isActive="isActiveDialog"
      :action="computedAction"
      :isLoading="isLoading"
      @close-dialog="closeDialog()"
      v-model="selectedItem"
    />
  </div>
</template>

<script>
import { NavTabsCard, NavTabsTable } from "@/components";
import DialogWindow from "./DialogWindow";
import { MiniLoading, MainLoading } from "../../components/Loading";
import FirebaseApi from "@/services/firebase-api";
const { getNews, deleteNews, editNews, createNews, search } = new FirebaseApi();
export default {
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
    transformNewsData() {
      return this.news.map(el => {
        return {
          ...el,
          created: this.transformTime(el.created),
          updated: this.transformTime(el.updated)
        };
      });
    },
    isMore() {
      return this.news.length < this.count;
    }
  },
  methods: {
    async getNews(startAt, count) {
      return await getNews(startAt, count);
    },

    async createRecord() {
      this.isLoading = true;
      try {
        const query = await createNews(this.selectedItem, this.token);
        if (query.success) {
          this.isLoading = false;

          const news = await this.getNews(0, 1);
          this.news.splice(0, 0, news.data[0]);

          this.notifyVue(query.message, "done", "success");
          this.closeDialog();
          return;
        }
        this.isLoading = false;
        this.notifyVue(query.message, "warning", "danger");
      } catch (err) {
        this.isLoading = false;
        console.error(err);
      }
    },

    async editRecord() {
      const { id } = this.selectedItem;
      const newData = {
        ...this.selectedItem
      };
      const index = this.news.findIndex(el => el.id === id);
      this.isLoading = true;
      try {
        const query = await editNews(id, newData, this.token);
        if (query.success) {
          const updatedRecord = await this.getNews(index, 1);
          this.news.splice(index, 1, updatedRecord.data[0]);

          this.isLoading = false;
          this.notifyVue(query.message, "done", "success");
          this.closeDialog();
          return;
        }
        this.isLoading = false;
        this.notifyVue(query.message, "warning", "danger");
      } catch (err) {
        this.isLoading = false;
        console.error(err);
      }
    },

    async deleteItem(id) {
      const result = await deleteNews(id, this.token);
      if (result.success) {
        const index = this.news.findIndex(el => el.id === id);
        this.news.splice(index, 1);
        this.count = this.count - 1;

        this.notifyVue(result.message, "done", "success");
      } else {
        this.notifyVue(result.message, "warning", "danger");
        return;
      }

      if (this.isMore) {
        const newsArr = await this.getNews(this.news.length, 1);
        this.news.push(newsArr[0]);
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
          const news = await this.getNews(index, 1);
          this.news.splice(index, 1, news.data[0]);

          this.notifyVue(query.message, "done", "success");
          return;
        }

        this.notifyVue(query.message, "warning", "danger");
      } catch (err) {
        console.error(err);
      }
    },

    openDialogForNewRecord() {
      this.selectedAction = "create";
      this.selectedItem = {};
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
        next = await this.getNews(startItem, this.itemsOnPage);
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
        return new Date(time).toLocaleDateString("ua-UA", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      }

      return;
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
        data: [{ title: query.message }]
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
    const news = await this.getNews(0, this.itemsOnPage);
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
</style>
