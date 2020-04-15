<template>
  <div>
    <md-table>
      <md-table-row
        slot="md-table-row"
        v-for="item in data"
        :key="item.uid"
      >
        <md-table-cell>
          <md-button class="md-just-icon md-simple md-primary">
            <md-icon>edit</md-icon>
            <md-tooltip md-direction="top">Edit</md-tooltip>
          </md-button>
          <md-button class="md-just-icon md-simple md-default">
            <md-icon>block</md-icon>
            <md-tooltip md-direction="top">Block</md-tooltip>
          </md-button>
          <md-button class="md-just-icon md-simple md-danger">
            <md-icon>close</md-icon>
            <md-tooltip md-direction="top">Close</md-tooltip>
          </md-button>
        </md-table-cell>

        <md-table-cell>{{ item.email }}</md-table-cell>
        <md-table-cell>{{ item.metadata.lastSignInTime }}</md-table-cell>
        <md-table-cell>{{ item.uid }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
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
    // onSelect: function(items) {
    //   this.selected = items;
    // }
  }
};
</script>
