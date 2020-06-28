<template>
  <div class="filter-bar">
    <div class="filter-bar__item">
      <md-autocomplete v-model="value.q" :md-options="employees">
        <label>Пошук...</label>
      </md-autocomplete>
    </div>
    <div class="filter-bar__item">
      <drop-down
        labelSearchPlaceholder="Пошук"
        labelTitle="Категорія"
        labelNotFound="Не знайдено"
        textProp="title"
        :table="table"
        v-model="value.c"
      />
    </div>
    <div class="filter-bar__item filter-bar__item--datepicker">
      <v-date-picker
        mode="range"
        color="green"
        v-model="value.range"
        :input-props="{
          class: '',
          placeholder: 'Пошук по даті'
        }"
      />
    </div>
  </div>
</template>

<script>
import DropDown from "../Dropdown/";
export default {
  name: "filter-bar",
  props: {
    table: [String, Number],
    value: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data: () => ({
    employees: []
  }),
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.$emit("input", val);
      }
    }
  },
  components: {
    DropDown
  }
};
</script>

<style lang="scss" scoped>
.filter-bar {
  margin: 10px auto;
  padding: 0px 5px 5px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &__item {
    margin-right: 10px;
    width: 100%;
  }

  &__item--datepicker {
    max-width: 250px;
  }

  &__item--actions {
    flex-basis: 500px;
  }
}
</style>
