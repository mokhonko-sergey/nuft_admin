<template>
  <dialog-window :showDialog="isActive" :title="title">
    <template slot="content">
      <h1>Dialog</h1>
    </template>
    <template slot="actions">
      <md-button @click="$emit('close-dialog')">
        Close
      </md-button>
      <md-button class="md-success">
        Save
      </md-button>
    </template>
  </dialog-window>
</template>

<script>
import DialogWindow from "@/components/Dialog";
export default {
  props: {
    isActive: Boolean,
    title: String
  },
  components: {
    DialogWindow
  }
};
</script>
