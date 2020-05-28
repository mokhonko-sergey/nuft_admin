<template>
  <drop-down
    labelSearchPlaceholder="Пошук"
    labelTitle="Нічого не вибрано"
    labelNotFound="Не знайдено:"
    textProp="label"
    :options="[{ label: 'Item 1' }, { label: 'Item 2' }]"
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
