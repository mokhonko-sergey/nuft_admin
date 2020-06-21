<template>
  <dialog-window :showDialog="isActive" :title="title">
    <template slot="content">
      <md-field>
        <label>Заголовок</label>
        <md-input v-model="value.title"></md-input>
      </md-field>

      <drop-down
        labelSearchPlaceholder="Пошук"
        labelTitle="Виберіть категорію для новини"
        labelNotFound="Не знайдено"
        textProp="title"
        :table="table"
        v-model="value.category"
      />

      <br /><br />

      <vue-editor v-model="value.content" />

      <md-switch v-model="value.visible" class="md-primary">
        Відображати запис
      </md-switch>
    </template>
    <template slot="actions">
      <md-button @click="$emit('close-dialog')">
        Закрити
      </md-button>
      <md-button class="md-success" @click="action">
        <loading v-if="isLoading" />
        <span v-else>Зберегти</span>
      </md-button>
    </template>
  </dialog-window>
</template>

<script>
import DialogWindow from "@/components/Dialog";
import { MiniLoading } from "@/components/Loading";
import { VueEditor } from "vue2-editor";
import DropDown from "@/components/Dropdown/index.vue";
export default {
  name: "DialogWindowForNews",
  props: {
    isActive: Boolean,
    title: String,
    action: {
      type: Function,
      required: true
    },
    table: [String, Number],
    value: {
      type: Object,
      default() {
        return {};
      }
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    files: []
  }),

  computed: {
    filesArr() {
      if (this.value.hasOwnProperty("photo")) {
        const item = this.value.photo;
        return Array.isArray(item) ? item : [item];
      }
      return [];
    }
  },

  watch: {
    value: {
      deep: true,
      handler(val) {
        this.files = this.filesArr;
        this.$emit("input", val);
      }
    },
    files: {
      deep: true,
      handler(val) {
        this.value.photo = val;
      }
    }
  },

  components: {
    DialogWindow,
    loading: MiniLoading,
    VueEditor,
    DropDown
  }
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
