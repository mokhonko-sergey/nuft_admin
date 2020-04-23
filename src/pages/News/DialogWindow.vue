<template>
  <dialog-window :showDialog="isActive" :title="title">
    <template slot="content">
      <md-field>
        <label>Title</label>
        <md-input v-model="value.title"></md-input>
      </md-field>
      <md-field>
        <label>Textarea</label>
        <md-textarea v-model="value.content" md-counter="80"></md-textarea>
      </md-field>
      <md-switch v-model="value.visible" class="md-primary">Visible</md-switch>
    </template>
    <template slot="actions">
      <md-button @click="$emit('close-dialog')">
        Close
      </md-button>
      <md-button class="md-success" @click="action">
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
    title: String,
    action: {
      type: Function,
      required: true
    },
    value: {
      type: Object,
      default() {
        return {
          title: "",
          content: "",
          visible: ""
        };
      },
      loading: {
        type: Boolean,
        default: false
      }
    }
  },
  watch: {
    value: {
      deep: true,
      handler(value) {
        this.$emit("input", value);
      }
    }
  },
  components: {
    DialogWindow
  }
};
</script>
