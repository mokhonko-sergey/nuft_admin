<template>
  <div>
    <md-table>
      <md-table-row>
        <md-table-head v-for="key of Object.keys(cells)" :key="key">
          {{ key }}
        </md-table-head>
        <md-table-head>Actions</md-table-head>
      </md-table-row>
      <md-table-row v-for="(item, index) of data" :key="index">
        <md-table-cell v-for="(cell, index) in cells" :key="index">{{
          item[cell]
        }}</md-table-cell>

        <md-table-cell>
          <md-button
            class="md-just-icon md-simple md-primary"
            @click="$emit('edit-item', item.id)"
          >
            <md-icon>edit</md-icon>
            <md-tooltip md-direction="top">Edit</md-tooltip>
          </md-button>
          <md-button
            class="md-just-icon md-simple md-primary"
            @click="$emit('hide-item', item.id)"
          >
            <md-icon>visibility</md-icon>
            <md-tooltip md-direction="top">Hide</md-tooltip>
          </md-button>
          <md-button
            class="md-just-icon md-simple md-danger"
            @click="$emit('delete-item', item.id)"
          >
            <md-icon>delete</md-icon>
            <md-tooltip md-direction="top">Delete</md-tooltip>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
export default {
  name: "nav-tabs-table",
  props: {
    data: Array,
    cells: Object
  }
};
</script>
