<template>
  <div class="md-layout-item md-size-100">
    <nav-tabs-card>
      <template slot="content">
        <md-card-header data-background-color="green">
          <div class="md-layout md-size-100">
            <div class="md-layout-item md-size-75 md-xsmall-size-100">
              <h4 class="title">All News</h4>
              <p class="category">Here is a subtitle for this table</p>
            </div>
            <div class="md-layout-item md-size-25 md-xsmall-size-100">
              <md-button class="md-primary" @click="openDialogForNewRecord()">
                <md-icon> note_add</md-icon>
                Add news
              </md-button>
            </div>
          </div>
        </md-card-header>
        <md-card-content>
          <nav-tabs-table
            :data="news"
            :cells="{
              Title: 'title',
              'Created Time': 'created'
            }"
            @edit-item="openDialogForEditRecord"
            @toggle-visible-item="toggleVisible"
            @delete-item="deleteItem"
          />
          <loading v-show="isMainLoading" />
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
import { MainLoading } from "../../components/Loading";
import FirebaseApi from "@/services/firebase-api";
const { getNews, deleteNews, editNews, createNews } = new FirebaseApi();
export default {
  components: {
    NavTabsCard,
    NavTabsTable,
    DialogWindow,
    loading: MainLoading
  },
  data: () => ({
    isActiveDialog: false,
    itemsOnPage: 10,
    news: [],
    selectedItem: {},
    count: null,
    selectedAction: "create",
    isLoading: false,
    isMainLoading: false
  }),
  computed: {
    token() {
      return this.$store.getters.getUser.token;
    },
    computedAction() {
      return this.selectedAction == "create"
        ? this.createRecord
        : this.editRecord;
    }
  },
  methods: {
    async getAllNews(startAt, count) {
      this.isMainLoading = true;
      const result = await getNews(startAt, count);
      this.isMainLoading = false;
      this.news = result.data;
      this.count = result.newsCount;
    },

    async createRecord() {
      this.isLoading = true;
      try {
        const query = await createNews(this.selectedItem, this.token);
        if (query.success) {
          this.isLoading = false;
          this.notifyVue(query.message, "done", "success");
          await this.getAllNews(0, this.itemsOnPage);
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
      this.isLoading = true;
      try {
        const query = await editNews(id, newData, this.token);
        if (query.success) {
          this.isLoading = false;
          this.notifyVue(query.message, "done", "success");
          await this.getAllNews(0, this.itemsOnPage);
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
        this.notifyVue(result.message, "done", "success");
      } else {
        this.notifyVue(result.message, "warning", "danger");
      }
      this.getAllNews(0, this.itemsOnPage);
    },

    async toggleVisible(item) {
      const newData = {
        ...item,
        visible: !item.visible
      };

      try {
        const query = await editNews(item.id, newData, this.token);
        if (query.success) {
          this.notifyVue(query.message, "done", "success");
          await this.getAllNews(0, this.itemsOnPage);
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
    }
  },
  created() {
    this.getAllNews(0, this.itemsOnPage);
  }
};
</script>
