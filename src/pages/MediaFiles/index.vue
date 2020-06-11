<template>
  <div class="content">
    <div class="md-layout">
      <upload
        @close-dialog="showUploadDialog()"
        @update-list-of-images="updateAfterUpload"
        :isActive="activeUpload"
        :table="table"
      />
      <show-pics
        @open-dialog="showUploadDialog()"
        @delete-item="delPic"
        v-model="images"
      />
    </div>
    <intersect @enter="fetchContent()"><div></div></intersect>
    <loading v-if="isLoad" />
  </div>
</template>

<script>
import Upload from "./Upload";
import ShowPics from "./ShowPics";
import Intersect from "vue-intersect";
import { MainLoading } from "@/components/Loading/index.js";

import { Gallery } from "@/services/index";
const { getPics, delPicture } = new Gallery();

import { Categories } from "@/services/index";
const { updateCount } = new Categories();

export default {
  name: "media-files",
  data: () => ({
    activeUpload: false,
    isLoad: false,
    itemsOnPage: 15,
    images: [],
    items: null,
    table: "gallery"
  }),
  computed: {
    token() {
      return this.$store.getters.getUser.token;
    },
    isEnd() {
      return this.items > this.images.length;
    }
  },
  methods: {
    showUploadDialog() {
      this.activeUpload = !this.activeUpload;
    },

    async fetchPics(itemsOnPage, startAt) {
      const result = await getPics(itemsOnPage, startAt);
      this.items = result.сountOfItems;
      return result.data;
    },

    updateList(arr, isReverse = false) {
      arr.forEach(el => {
        if (isReverse) {
          this.images.unshift(el);
        } else {
          this.images.push(el);
        }
      });
    },

    async updateAfterUpload(i) {
      const data = await this.fetchPics(i, 0);
      this.updateList(data, true);
    },

    async delPic({ name, category }) {
      if (!window.confirm("Ви дійсно бажаєте видалити зображення?")) return;
      const res = await delPicture(name);
      if (res.success) {
        const index = this.images.findIndex(el => el.filename === name);
        this.images.splice(index, 1);
        this.items = this.items - 1;

        if (category) {
          await updateCount({
            id: category,
            table: this.table,
            action: "remove",
            token: this.token
          });
        }

        this.notifyVue("Видалено", "done", "success");
      } else {
        this.notifyVue("Сталася помилка", "warning", "danger");
      }
    },

    async fetchContent() {
      this.isLoad = !this.isLoad;
      if (this.images.length === 0) {
        const data = await this.fetchPics(this.itemsOnPage, this.images.length);
        this.updateList(data);
      } else {
        if (this.isEnd) {
          const data = await this.fetchPics(
            this.itemsOnPage,
            this.images.length
          );
          this.updateList(data);
        }
      }
      this.isLoad = !this.isLoad;
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
  components: {
    Upload,
    ShowPics,
    Intersect,
    loading: MainLoading
  }
};
</script>
