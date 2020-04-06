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
import { MiniLoading } from "@/components/Loading/index.js";
import { eventBus } from "../../main";
import FirebaseApi from "../../services/firebase-api";

const { uploadPicture } = new FirebaseApi();

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
      if (!this.file) {
        this.notifyVue("Choose file please", "warning", "warning");
        return;
      }
      this.isLoad = true;
      const result = await uploadPicture(this.file, this.description);  
      if(result.success){
        const messages = result.messages.join(' ');
        this.notifyVue(messages, "done", "success");
        this.description = this.$refs.file.value = null;
        eventBus.$emit("updatePics");
      }else{
        const messages = result.messages.join(' ');
        this.notifyVue(messages, "warning", "danger");
      }
      this.isLoad = false;
    },

    notifyVue(message, icon, type, verticalAlign='top', horizontalAlign='right') {
      this.$notify({ message, icon, horizontalAlign, verticalAlign, type });
    }
  },
  components: {
    loading: MiniLoading
  }
};
</script>
