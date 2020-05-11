<template>
  <div class="md-layout md-alignment-center md-size-100">
    <div class="md-layout-item md-size-100 custom__md-layout-item">
      <custom-files-upload-input :isMultiple="isMultiple" v-model="files" />
    </div>
    <photo-preview
      :filesUrl="filesUrl"
      @delete-image="index => filesUrl.splice(index, 1)"
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
    },
    filesUrl: { //here ?
      type: Array,
      default() {
        return [];
      }
    }
  },

  data: () => ({
    files: [] //here ?
  }),

  watch: {
    filesUrl: {
      handler(value) {
        this.isMultiple
          ? this.$emit("choosed-files", value) // here ?
          : this.$emit("choosed-files", value[0]); //here ?
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
