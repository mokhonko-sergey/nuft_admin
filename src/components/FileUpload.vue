<template>
  <div class="md-layout md-alignment-center md-size-100">
    <div class="md-layout-item md-size-100 custom__md-layout-item">
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
        <span v-if="isMultiple">Choose files</span>
        <span v-else>Choose file</span>
      </md-button>
    </div>
    <div
      class="md-layout-item md-size-100 custom__md-layout-item"
      v-if="filesSrc.length > 0"
    >
      <div
        class="image-preview-item"
        v-for="(fileSrc, index) in filesSrc"
        :key="index"
      >
        <md-button
          class="md-icon-button md-dense md-danger custom__md-icon-button"
          @click="removePic(index)"
        >
          <md-icon>close</md-icon>
        </md-button>
        <img :src="fileSrc" alt="image" class="img-preview" />
        <md-field>
          <md-icon>description</md-icon>
          <label>Description</label>
          <md-input v-model="files[index].description"></md-input>
        </md-field>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isMultiple: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    files: [],
    filesSrc: []
  }),

  computed: {
    isShowButton() {
      if (this.isMultiple) {
        return true;
      }
      if (this.files.length === 0) {
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
          this.filesSrc.push(reader.result);
        };
        reader.readAsDataURL(files[i]);
      }
      files.forEach(element => {
        this.files.push({ file: element, description: "" });
      });
    },

    removePic(index) {
      this.filesSrc.splice(index, 1);
      this.files.splice(index, 1);
    }
  },

  watch: {
    files: {
      deep: true,
      handler(value){
        this.$emit("selected-files", value);
      }
    }
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

.image-preview-item {
  position: relative;
  width: 250px;
  margin: 10px;
}

.img-preview {
  height: 250px;
  width: auto;
}

.custom__md-icon-button {
  margin: 0;
  position: absolute;
  top: 0;
  right: 0;
}
</style>
