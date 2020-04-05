<template>
  <md-card>
    <md-card-header :data-background-color="dataBackgroundColor">
      <h4 class="title">Upload Files</h4>
      <p class="category">Choose file for upload to store</p>
    </md-card-header>
    <md-card-content>
      <div class="md-layout">
        <div class="md-layout-item md-small-size-100 md-size-50">
          <input type="file" ref="file" v-on:change="selectFile()" />
        </div>
        <div class="md-layout-item md-small-size-100 md-size-50">
          <md-field>
            <md-icon>description</md-icon>
            <label>Description</label>
            <md-input v-model="description" />
          </md-field>
        </div>
        <div class="md-layout-item text-center">
          <md-button class="md-primary" @click="upload()">
            <span v-if="!isLoad">Upload</span>
            <loading :isActive="isLoad" />
          </md-button>
        </div>
      </div>
    </md-card-content>
  </md-card>
</template>

<script>
import Loading from "@/components/Loading";
import { eventBus } from "../../main";
export default {
  name: "file-upload-form",
  props: {
    dataBackgroundColor: {
      type: String,
      default: "green"
    }
  },
  data() {
    return {
      isLoad: false,
      file: null,
      description: null
    };
  },
  methods: {
    selectFile(e) {
      this.file = this.$refs.file.files[0];
    },
    async upload() {
      const url = "https://us-central1-nuft-kebop.cloudfunctions.net/gallery";
      if (!this.file) {
        this.notifyVue("Choose file please", "top", "right", "warning", "warning");
        return;
      }
      this.isLoad = true;
      const formdata = new FormData();
      formdata.append("file", this.file);

      const requestOptions = {
        method: "POST",
        body: formdata
      };
      try {
        const response = await fetch(
          `${url}?description=${this.description}`,
          requestOptions
        );
        const result = await response.json();
        this.isLoad = false;
        if (result.success)
          this.notifyVue(result.messages[0], "top", "right", "done", "success");
        
        eventBus.$emit("updatePics");
      } catch (err) {
        this.isLoad = false;
        this.notifyVue("Can't upload file", "top", "right", "warning", "danger");
      }
      this.description = this.$refs.file.value = null;
      return;
    },
    notifyVue(message, verticalAlign, horizontalAlign, icon, type) {
      this.$notify({ message, icon, horizontalAlign, verticalAlign, type });
    }
  },
  components: {
    Loading
  }
};
</script>
