<template>
  <drop-down
    labelSearchPlaceholder="Пошук"
    labelTitle="Нічого не вибрано"
    labelNotFound="Не знайдено:"
    textProp="title"
    table="gallery"
    :allowDelete="false"
    :showCount="false"
    v-model="selectedValue"
  />
</template>
<script>
import DropDown from "@/components/Dropdown/index.vue";
export default {
  name: "edit-profile-form",
  data() {
    return {
      selectedValue: null
    };
  },
  components: {
    DropDown
  }
};
</script>
<style></style>
