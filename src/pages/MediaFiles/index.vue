<template>
      <div class="content">
        <div class="md-layout">
            <show-pics @dialog='showUploadDialog()'/>
            <upload @closeDialog='showUploadDialog()' :isActive='activeUpload'/>
        </div>
      </div>
</template>

<script>
import Upload from './Upload';
import ShowPics from './ShowPics';

export default {
    data: () => ({
        activeUpload: false
    }),
    methods: {
        showUploadDialog() {
            this.activeUpload = !this.activeUpload;
        }
    },
    components: {
        Upload,
        ShowPics
    }
}
</script>