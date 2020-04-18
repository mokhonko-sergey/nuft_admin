<template>
  <div>
    <md-table>
      <md-table-row>
        <md-table-head>Email</md-table-head>
        <md-table-head>Name</md-table-head>
        <md-table-head>Last auth time</md-table-head>
        <md-table-head>Actions</md-table-head>
      </md-table-row>

      <md-table-row slot="md-table-row" v-for="item in data" :key="item.uid">
        <md-table-cell>{{ item.email }}</md-table-cell>
        <md-table-cell>{{ item.displayName }}</md-table-cell>
        <md-table-cell>{{ item.metadata.lastSignInTime }}</md-table-cell>

        <md-table-cell>
          <md-button
            class="md-just-icon md-simple md-primary"
            @click="openDialog(item)"
          >
            <md-icon>edit</md-icon>
            <md-tooltip md-direction="top">Edit</md-tooltip>
          </md-button>
          <md-button
            class="md-just-icon md-simple md-default"
            @click="$emit('block-user', item)"
          >
            <md-icon>block</md-icon>
            <md-tooltip md-direction="top">Block</md-tooltip>
          </md-button>
          <md-button
            class="md-just-icon md-simple md-danger"
            @click="$emit('delete-user', item.uid)"
          >
            <md-icon>close</md-icon>
            <md-tooltip md-direction="top">Delete</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import { eventBus } from "../../main";
export default {
  name: "nav-tabs-table",
  props: {
    data: Array
  },
  data() {
    return {
      selected: [],
      items: this.data
    };
  },
  methods: {
    openDialog(item) {
      this.$emit("active-dialog", item);
    }
  }
};
</script>
