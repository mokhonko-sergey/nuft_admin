<template>
  <div>
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      accept="image/*"
      @change="selectFiles"
      :multiple="isMultiple"
    />
    <md-button class="md-primary" @click="choseFile()" v-show="isShowButton">
      <md-icon>attach_file</md-icon>
      <span v-if="isMultiple">Обрати файли</span>
      <span v-else>Обрати файл</span>
    </md-button>
  </div>
</template>

<script>
export default {
  name: "CustomFilesUploadInput",
  props: {
    isMultiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },

  computed: {
    isShowButton() {
      if (this.isMultiple) {
        return true;
      }
      if (!this.value || this.value.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  },

  methods: {
    choseFile() {
      this.$refs.fileInput.click();
    },

    selectFiles(e) {
      const files = e.target.files;
      for (let i = 0; files.length > i; i++) {
        const reader = new FileReader();
        reader.onload = e => {
          this.value.push({
            url: reader.result,
            file: files[i]
          });
        };
        reader.readAsDataURL(files[i]);
      }
    }
  },

  watch: {
    value: {
      deep: true,
      handler(value) {
        this.$emit("change", value);
      }
    }
  }
};
</script>
