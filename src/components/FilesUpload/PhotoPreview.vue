<template>
  <div class="md-layout md-alignment-center md-size-100">
    <div
      class="image-preview-item"
      v-for="(photo, index) in value"
      :key="index"
    >
      <md-button
        class="md-icon-button md-dense md-danger custom__md-icon-button"
        @click="removePic(index)"
      >
        <md-icon>close</md-icon>
      </md-button>
      <img :src="photo.url" alt="image" class="img-preview" />
      <md-field v-show="isDescription">
        <md-icon>description</md-icon>
        <label>Description</label>
        <md-input v-model="value[index].description"></md-input>
      </md-field>
    </div>
  </div>
</template>

<script>
export default {
  name: "PhotoPreview",
  props: {
    isDescription: {
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

  methods: {
    removePic(index) {
      this.value.splice(index, 1);
    }
  },

  watch: {
    value: {
      deep: true,
      handler(value) {
        this.$emit("input", value);
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
