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
        @filters-change="val => (filters = val)"
        @open-dialog="showUploadDialog()"
        @delete-item="delPic"
        v-model="images"
      />
    </div>
    <intersect @enter="fetchContent()" v-if="images.lenght > 0">
      <div></div>
    </intersect>
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
    table: "gallery",
    filters: {},
    timeout: null
  }),
  computed: {
    token() {
      return this.$store.getters.getUser.token;
    },
    isEnd() {
      return this.items > this.images.length;
    }
  },
  watch: {
    filters: {
      deep: true,
      handler(val) {
        clearTimeout(this.timeout);
        this.images = [];
        this.timeout = setTimeout(() => {
          this.fetchContent({
            q: this.filters.q,
            c: this.filters.c,
            timestart: this.filters?.range?.start.getTime(),
            timeend: this.filters?.range?.end.getTime()
          });
        }, 500);
      }
    }
  },
  methods: {
    showUploadDialog() {
      this.activeUpload = !this.activeUpload;
    },

    async fetchPics({ items, start, q, c, timestart, timeend }) {
      const params = {
        ...(_.isNumber(items) && { items }),
        ...(_.isNumber(start) && { start }),
        ...(!_.isEmpty(q) && { q }),
        ...(!_.isEmpty(c) && { c: c.id }),
        ...(_.isNumber(timestart) && { timestart }),
        ...(_.isNumber(timeend) && { timeend })
      };

      const result = await getPics(params);
      this.items = result.сountOfItems;
      return result;
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
      const query = await this.fetchPics({ items: i, start: 0 });
      query.success && this.updateList(query.data, true);
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
        const query = await this.fetchPics({
          items: this.itemsOnPage,
          start: this.images.length,
          q: this.filters.q,
          c: this.filters.c,
          timestart: this.filters?.range?.start.getTime(),
          timeend: this.filters?.range?.end.getTime()
        });
        query.success && this.updateList(query.data);
      } else {
        if (this.isEnd) {
          const query = await this.fetchPics({
            items: this.itemsOnPage,
            start: this.images.length,
            q: this.filters.q,
            c: this.filters.c,
            timestart: this.filters?.range?.start.getTime(),
            timeend: this.filters?.range?.end.getTime()
          });
          query.success && this.updateList(query.data);
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
  async created() {
    const query = await this.fetchPics({
      items: this.itemsOnPage,
      start: this.images.length,
      q: this.filters.q,
      c: this.filters.c,
      timeend: this.filters.timeend,
      timestart: this.filters.timestart
    });
    query.success && this.updateList(query.data);
  },
  components: {
    Upload,
    ShowPics,
    Intersect,
    loading: MainLoading
  }
};
</script>
