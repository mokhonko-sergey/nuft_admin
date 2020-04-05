<template>
      <div class="content">
        <div class="md-layout">
            <upload />
            <show-pics />
        </div>
      </div>
</template>

<script>
import Upload from './Upload';
import ShowPics from './ShowPics';
export default {
    components: {
        Upload,
        ShowPics
    }
}
</script>