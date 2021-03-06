<template>
  <div
    v-on-clickaway="hideDropdown"
    @keyup.esc="onEscape"
    @keydown.up.prevent="typeAheadUp"
    @keydown.down.prevent="typeAheadDown"
    @keydown.enter.prevent="typeAheadSelect"
    class="v-select"
    :class="{ disabled: disabled }"
  >
    <button @click="toggle" type="button" class="v-select-toggle">
      <div>{{ title }}</div>
      <div class="arrow-down"></div>
    </button>
    <div v-show="show" class="v-dropdown-container">
      <!-- search -->
      <div class="v-bs-searchbox">
        <div class="v-bs-searchbox__coll">
          <input
            :placeholder="labelSearchPlaceholder"
            class="form-control"
            type="text"
            v-model.trim="searchValue"
          />
        </div>
        <div>
          <md-button
            class="md-fab md-mini md-info md-btn-fab v-bs-searchbox__btn"
            :disabled="isDisableAddBtn"
            @click="add"
            v-if="searchValue.length > 0 && allowAdd"
          >
            <md-icon>add</md-icon>
            <md-tooltip md-direction="top">Додати</md-tooltip>
          </md-button>
        </div>
      </div>
      <ul>
        <li v-show="filteredOptions.length === 0" class="v-dropdown-item">
          {{ labelNotFound }} "{{ searchValue }}"
        </li>
        <li
          v-if="showDefaultOption"
          class="v-dropdown-item disabled default-option"
        >
          {{ labelTitle }}
        </li>

        <!-- ITEM -->
        <li
          v-for="(option, index) in filteredOptions"
          :key="`v-select-${index}`"
          class="v-dropdown-item"
          :class="{
            selected: isSelectedOption(option, index),
            disabled: option[disabledProp]
          }"
        >
          <v-option
            :data="option"
            :textProp="textProp"
            :allowEdit="allowEdit"
            :allowDelete="allowDelete"
            :showCount="showCount"
            @save-item="save"
            @delete-item="del"
            @select-option="onSelect(option, index)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import VSelect from "@alfsnd/vue-bootstrap-select";
import VOption from "./Option";
import { Categories } from "@/services";
const {
  getCategories,
  delCategory,
  addCategory,
  updateCategory
} = new Categories();
export default {
  name: "vselect-drop-down",
  extends: VSelect,
  props: {
    table: [String, Number],
    allowAdd: {
      type: Boolean,
      default: true
    },
    allowEdit: {
      type: Boolean,
      default: true
    },
    allowDelete: {
      type: Boolean,
      default: true
    },
    showCount: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    loadedOptions: []
  }),
  computed: {
    filteredOptions() {
      if (this.searchValue.length > 0) {
        return this.loadedOptions.filter(item => {
          if (typeof item === "object") {
            return (
              item[this.textProp]
                .toLowerCase()
                .indexOf(this.searchValue.toLowerCase()) !== -1
            );
          } else {
            return (
              item.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1
            );
          }
        });
      }
      return this.loadedOptions;
    },
    title() {
      return this.selectedValue !== null &&
        this.selectedValue.hasOwnProperty(this.textProp)
        ? this.getOptionLabel(this.selectedValue)
        : this.labelTitle;
    },
    token() {
      return this.$store.getters.getUser.token;
    },
    isDisableAddBtn() {
      const arr = this.filteredOptions.map(el =>
        el[this.textProp].toLowerCase()
      );
      return arr.includes(this.searchValue.toLowerCase());
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        const index = this.loadedOptions.findIndex(op =>
          this.isEqualOption(op, newVal)
        );
        this.onSelect(newVal, index);
      }
    }
  },
  methods: {
    async getCategories(table) {
      const query = await getCategories(table);
      this.loadedOptions = query.success ? query.data : [];
    },
    async add() {
      await addCategory(
        { table: this.table, title: this.searchValue },
        this.token
      );
      await this.getCategories(this.table);
    },
    async save(val) {
      const { title, count, id } = val;
      await updateCategory(
        { table: this.table, id },
        { title, count },
        this.token
      );
      await this.getCategories(this.table);
    },
    async del(val) {
      if (!window.confirm("Ви впевнені?")) {
        return;
      }
      await delCategory({ table: this.table, id: val }, this.token);
      await this.getCategories(this.table);
    }
  },
  async created() {
    await this.getCategories(this.table);
    const index = this.loadedOptions.findIndex(op => op.id === this.value);
    this.onSelect(this.loadedOptions[index], index);
  },
  components: {
    VOption
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
input {
  width: 100%;
}
ul {
  font-size: 12px;
  color: #424242;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  padding: 0px;
  margin: 2px 0px 0px 0px;
}
.v-select {
  position: relative;
  width: 100%;
  height: 30px;
  cursor: pointer;
  &.disabled {
    cursor: not-allowed;
    .v-select-toggle {
      background-color: #f8f9fa;
      border-color: #f8f9fa;
      opacity: 0.65;
      cursor: not-allowed;
      &:focus {
        outline: 0 !important;
      }
    }
  }
}
.v-select-toggle {
  display: flex;
  justify-content: space-between;
  user-select: none;
  padding: 0.375rem 0.75rem;
  color: #212529;
  background-color: #f8f9fa;
  border-color: #d3d9df;
  width: 100%;
  text-align: right;
  white-space: nowrap;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 12px;
  font-family: inherit, sans-serif;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: background-color, border-color, box-shadow, 0.15s ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: #e2e6ea;
    border-color: #dae0e5;
  }
}
.arrow-down {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 0.255em;
  margin-top: 7px;
  vertical-align: 0.255em;
  content: "";
  border-top: 0.3em solid;
  border-right: 0.3em solid transparent;
  border-bottom: 0;
  border-left: 0.3em solid transparent;
}
.v-dropdown-container {
  position: absolute;
  width: 100%;
  background: red;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border-radius: 0.25rem;
  border: 1px solid rgba(0, 0, 0, 0.15);
  z-index: 1000;

  // search box
  .v-bs-searchbox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 8px;

    &__coll {
      width: 100%;
      margin-right: 10px;
    }

    .form-control {
      display: block;
      width: 100%;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      color: #495057;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid #ced4da;
      border-bottom: 0 !important;
      border-radius: 0.25rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }
  }
}
.v-dropdown-item {
  text-decoration: none;
  line-height: 25px;
  padding: 0.5rem 1.25rem;
  user-select: none;
  &:hover:not(.default-option) {
    background-color: #f8f9fa;
  }
  &.disabled {
    color: #9a9b9b;
  }
  &.selected {
    background-color: #007bff;
    color: #fff;
    &:hover {
      background-color: #007bff;
      color: #fff;
    }
  }
  &.disabled {
    cursor: not-allowed;
    &:hover {
      background-color: #fff;
    }
  }
}

.md-tooltip {
  z-index: 9999;
}

.md-button {
  margin: 0;
  height: 30px !important;
  width: 30px !important;
  min-width: 0 !important;
}
</style>
