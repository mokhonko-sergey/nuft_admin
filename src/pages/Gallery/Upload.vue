<template>
  <md-dialog :md-active.sync="isActive">
    <md-dialog-title>Upload Files</md-dialog-title>
      <md-dialog-content>
          <div class="md-layout md-alignment-center md-size-100">
              <div class="md-layout-item md-alignment-space-between md-size-100">
                <div class="md-layout md-alignment-center md-size-100">
                  <div class="md-layout-item md-size-100 custom__md-layout-item">
                    <input type='file' ref="fileInput" style='display: none'/>
                    <md-button class="md-primary" @click="choseFile()">
                        Choose file
                        <md-icon>attach_file</md-icon>
                    </md-button>
                  </div>
                  <div class="md-layout-item md-size-100 custom__md-layout-item">
                    <img src='https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80' alt='images' class="img-preview"/>
                  </div>
                </div>
                  
              </div>
              <div class="md-layout-item md-size-100">
                  <md-field>
                      <md-icon>description</md-icon>
                      <label>Textarea with Autogrow</label>
                      <md-textarea md-autogrow></md-textarea>
                  </md-field>
              </div>
          </div>
      </md-dialog-content>
      <md-dialog-actions>
          <md-button class="md-default" @click="$emit('closeDialog')">Close</md-button>
          <md-button class="md-success" @click="$emit('closeDialog')">Save</md-button>
      </md-dialog-actions>
  </md-dialog>
</template>

<script>
// import { MiniLoading } from "@/components/Loading/index.js";
import { eventBus } from "../../main";
import FirebaseApi from "../../services/firebase-api";

const { uploadPicture } = new FirebaseApi();

export default {
  props: {
    isActive: Boolean
  },
  data() {
    return {
      // isActive: true,
      isLoad: false,
      file: null,
      description: null
    };
  },
  methods: {
    selectFile(e) {
      this.file = this.$refs.fileInput.files[0];
    },
    choseFile() {
      this.$refs.fileInput.click();
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
    // loading: MiniLoading
  }
};
</script>

<style lang="scss" scoped>
.img-preview {
  max-height: 300px;
  width: auto;
}

.custom__md-layout-item{
  text-align: center;
  margin-bottom: 10px;
}

</style>
