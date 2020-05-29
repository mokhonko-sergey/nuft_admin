<template>
  <drop-down
    labelSearchPlaceholder="Пошук"
    labelTitle="Нічого не вибрано"
    labelNotFound="Не знайдено:"
    textProp="title"
    :options="categories"
    :actions="{ add, update, del }"
    v-model="selectedValue"
  />
</template>
<script>
import DropDown from "@/components/Dropdown/index.vue";
import { Categories } from "@/services";
const {
  getCategories,
  delCategory,
  addCategory,
  updateCategory
} = new Categories();
export default {
  name: "edit-profile-form",
  data() {
    return {
      categories: [],
      table: "films",
      selectedValue: null
    };
  },
  computed: {
    token() {
      return this.$store.getters.getUser.token;
    }
  },
  methods: {
    async getCategories(table) {
      const query = await getCategories(table);
      this.categories = query.success ? query.data : [];
    },
    async add(val) {
      await addCategory({ table: this.table, title: val }, this.token);
      await this.getCategories(this.table);
    },
    async update(val) {
      const { title, count, id } = val;
      await updateCategory(
        { table: this.table, id },
        { title, count },
        this.token
      );
      await this.getCategories(this.table);
    },
    async del(val) {
      await delCategory({ table: this.table, id: val }, this.token);
      await this.getCategories(this.table);
    }
  },
  components: {
    DropDown
  },
  async created() {
    await this.getCategories(this.table);
  }
};
</script>
<style></style>
