<template>
  <md-dialog :md-active.sync="isActive">
    <md-dialog-title>Upload File</md-dialog-title>
      <md-dialog-content>
          <div class="md-layout md-alignment-center md-size-100">
              <div class="md-layout-item md-alignment-space-between md-size-100">
                <div class="md-layout md-alignment-center md-size-100">
                  <div class="md-layout-item md-size-100 custom__md-layout-item">
                    <input type='file' ref="fileInput" style='display: none' accept="image/*" @change="selectFile"/>
                    <md-button class="md-primary" @click="choseFile()">
                      <md-icon>attach_file</md-icon>
                      Choose file
                    </md-button>
                  </div>
                  <div class="md-layout-item md-size-100 custom__md-layout-item" v-if="fileSrc">
                    <img :src='fileSrc' alt='images' class="img-preview"/>
                  </div>
                </div>
                  
              </div>
              <div class="md-layout-item md-size-100">
                  <md-field>
                      <md-icon>description</md-icon>
                      <label>Description</label>
                      <md-textarea md-autogrow></md-textarea>
                  </md-field>
              </div>
          </div>
      </md-dialog-content>
      <md-dialog-actions>
          <md-button class="md-default" @click="closeDialog()">
            <md-icon>close</md-icon>
            Close
          </md-button>
          <md-button class="md-success" @click="upload()">
            <loading :isActive='uploading'/>
            <span v-if="!uploading">
              <md-icon>save</md-icon>
              Save
            </span>
          </md-button>
      </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { MiniLoading } from "@/components/Loading/index.js";
import { eventBus } from "../../main";
import FirebaseApi from "../../services/firebase-api";

const { uploadPicture } = new FirebaseApi();

export default {
  props: {
    isActive: Boolean
  },
  data() {
    return {
      uploading: false,
      file: null,
      fileSrc: null,
      description: null
    };
  },
  methods: {
    choseFile() {
      this.$refs.fileInput.click();
    },
    selectFile(e) {
      const file = event.target.files[0];
			const reader = new FileReader();
			reader.onload = e => {
				this.fileSrc = reader.result;
			}
			reader.readAsDataURL(file);
			this.file = file;
    },
    closeDialog(){
      this.clearData();
      this.$emit('closeDialog')
    },
    async upload() {
      if(!this.file){
        this.notifyVue("Choose file, please!", "warning", "danger");
        return;
      }
      this.uploading = true;
      const result = await uploadPicture(this.file, this.description);  
      if(result.success){
        const messages = result.messages.join(' ');
        this.clearData();
        eventBus.$emit("updatePics");
        this.notifyVue(messages, "done", "success");
      }else{
        const messages = result.messages.join(' ');
        this.notifyVue(messages, "warning", "danger");
      }
      this.uploading = false;
      this.$emit('closeDialog')
      return;
    },

    clearData() {
      this.description = this.file = this.fileSrc = this.$refs.fileInput.value = null;
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

<style lang="scss" scoped>
.img-preview {
  width: auto;
  height: auto;
  max-height: 300px;
  max-width: 300px;
}

.custom__md-layout-item{
  text-align: center;
  margin-bottom: 10px;
}

</style>
