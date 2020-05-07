<template>
  <dialog-window :showDialog="isActive" :title="title">
    <template slot="content">
      <md-field>
        <label>Title</label>
        <md-input v-model="value.title"></md-input>
      </md-field>

      <!-- Upload File  -->
      <files-upload
        :isMultiple="false"
        @choosed-files="data => (value.photo = data)"
      />
      <!-- <div class="preview-container">
        <img
          v-if="!value.isNew"
          :src="value.photo.url"
          class="img-preview"
          title="Foto Title"
        />
      </div> -->

      <md-field>
        <label>Textarea</label>
        <md-textarea v-model="value.content" md-counter="80"></md-textarea>
      </md-field>
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
import FilesUpload from "@/components/FilesUpload";
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
        return {
          title: "",
          content: "",
          visible: true,
          photo: ""
        };
      }
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    value: {
      deep: true,
      handler(value) {
        this.$emit("input", value);
      }
    },
    files: function() {
      this.value.photo = this.files[0];
    }
  },

  components: {
    DialogWindow,
    loading: MiniLoading,
    FilesUpload
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
