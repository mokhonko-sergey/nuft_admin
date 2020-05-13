<template>
  <dialog-window :showDialog="isActive" :title="title">
    <template slot="content">
      <md-field>
        <label>Title</label>
        <md-input v-model="value.title"></md-input>
      </md-field>

      <!-- Upload File  -->
      <div class="md-layout md-alignment-center md-size-100">
        <div class="md-layout-item md-size-100">
          <custom-files-upload-input :isMultiple="false" v-model="files" />
        </div>

        <div class="md-layout-item md-size-100">
          <photo-preview v-model="files" :isDescription="false" />
        </div>
      </div>
      <vue-editor v-model="value.content" />
      <md-switch v-model="value.visible" class="md-primary">Visible</md-switch>
    </template>
    <template slot="actions">
      <md-button @click="$emit('close-dialog')">
        Close
      </md-button>
      <md-button class="md-success" @click="action">
        <loading v-if="isLoading" />
        <span v-else>Save</span>
      </md-button>
    </template>
  </dialog-window>
</template>

<script>
import DialogWindow from "@/components/Dialog";
import { MiniLoading } from "@/components/Loading";
import { CustomFilesUploadInput, PhotoPreview } from "@/components/FilesUpload";
import { VueEditor } from "vue2-editor";
export default {
  name: "DialogWindowForNews",
  props: {
    isActive: Boolean,
    title: String,
    action: {
      type: Function,
      required: true
    },
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
    // editorSettings: {
    //   modules: {
    //     imageDrop: true,
    //     imageResize: {}
    //   }
    // }
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
    VueEditor
  }
};
</script>

<style lang="scss" scoped>
.preview-container {
  display: flex;
  align-items: center;
  justify-content: center;

  .img-preview {
    width: 250px;
    height: auto;
  }
}
</style>
