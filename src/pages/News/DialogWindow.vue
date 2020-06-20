<template>
  <dialog-window :showDialog="isActive" :title="title">
    <template slot="content">
      <md-field>
        <label>Заголовок</label>
        <md-input v-model="value.title"></md-input>
      </md-field>

      <div class="card-content">
        <!-- Upload File  -->
        <div class="row row-1">
          <div class="photo-contaier">
            <custom-files-upload-input :isMultiple="false" v-model="files" />
            <photo-preview v-model="files" :isDescription="false" />
          </div>
          <md-switch v-model="value.visible" class="md-primary">
            Відображати запис
          </md-switch>
        </div>

        <!-- Editor -->
        <div class="row row-2">
          <drop-down
            labelSearchPlaceholder="Пошук"
            labelTitle="Виберіть категорію для новини"
            labelNotFound="Не знайдено"
            textProp="title"
            :table="table"
            v-model="value.category"
          />

          <hr />

          <md-field>
            <label>Короткий опис новини</label>
            <md-textarea v-model="value.description"></md-textarea>
          </md-field>

          <hr />

          <vue-editor v-model="value.content" />
        </div>
      </div>
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
import { CustomFilesUploadInput, PhotoPreview } from "@/components/FilesUpload";
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
    CustomFilesUploadInput,
    PhotoPreview,
    VueEditor,
    DropDown
  }
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
