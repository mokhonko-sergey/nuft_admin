<template>
  <div class="content">
    <div class="md-layout">
      <upload @closeDialog="showUploadDialog()" :isActive="activeUpload" />
      <show-pics @dialog="showUploadDialog()" v-model="images" />
    </div>
    <intersect @enter="fetchContent()"><div></div></intersect>
  </div>
</template>

<script>
import Upload from "./Upload";
import ShowPics from "./ShowPics";
import Intersect from "vue-intersect";

import { Gallery } from "@/services/index";
const { getPics, delPicture } = new Gallery();

export default {
  name: "media-files",
  data: () => ({
    activeUpload: false,
    isLoad: false,
    itemsOnPage: 15,
    images: [],
    items: null
  }),
  computed: {
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
      result.data.forEach(el => {
        this.images.push(el);
      });
      this.items = result.сountOfItems;
    },
    async delPic(name) {
      if (!window.confirm("Ви дійсно бажаєте видалити зображення?")) return;
      const res = await delPicture(name);
      if (res.success) {
        const index = this.images.findIndex(el => el.filename === name);
        this.images.splice(index, 1);
        this.notifyVue("Файл видалено", "done", "success");
        if (this.lastImageOnPage < this.items - 1) {
          this.fetchPics(1, this.lastImageOnPage + 1);
        }
      } else {
        this.notifyVue("Сталася помилка при видаленні", "warning", "danger");
      }
    },

    async fetchContent() {
      if (this.images.length === 0) {
        await this.fetchPics(this.itemsOnPage, this.images.length);
      } else {
        if (this.isEnd)
          await this.fetchPics(this.itemsOnPage, this.images.length);
      }
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
    Intersect
  }
};
</script>
