<template>
  <div class="md-layout md-alignment-center md-size-100">
    <div class="md-layout-item md-size-100 custom__md-layout-item">
      <custom-files-upload-input :isMultiple="isMultiple" v-model="files" />
    </div>
    <photo-preview
      :filesUrl="filesSrc"
      @delete-image="index => files.splice(index, 1)"
    />
  </div>
</template>

<script>
import CustomFilesUploadInput from "./CustomFilesUploadInput";
import PhotoPreview from "./PhotoPreview";
export default {
  name: "FilesUpload",
  props: {
    isMultiple: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    files: []
  }),

  computed: {
    filesSrc() {
      return this.files.map(el => el.url);
    }
  },

  watch: {
    files: {
      deep: true,
      handler() {
        this.isMultiple
          ? this.$emit("choosed-files", this.files)
          : this.$emit("choosed-files", this.files[0]);
      }
    }
  },

  components: {
    CustomFilesUploadInput,
    PhotoPreview
  }
};
</script>

<style lang="scss" scoped>
.custom__md-layout-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 10px;
}
</style>
