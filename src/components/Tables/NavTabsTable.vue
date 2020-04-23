<template>
  <div>
    <md-table>
      <md-table-row>
        <md-table-head v-for="key of Object.keys(cells)" :key="key">
          {{ key }}
        </md-table-head>
        <md-table-head>Actions</md-table-head>
      </md-table-row>
      <md-table-row
        v-for="(item, index) of data"
        :key="index"
        :class="{ 'item-hide': !item.visible }"
      >
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
            @click="$emit('toggle-visible-item', item)"
          >
            <md-icon v-show="item.visible">visibility</md-icon>
            <md-tooltip md-direction="top" v-show="item.visible">
              Hide
            </md-tooltip>
            <md-tooltip md-direction="top" v-show="!item.visible">
              Show
            </md-tooltip>
            <md-icon v-show="!item.visible">visibility_off</md-icon>
          </md-button>

          <md-button
            class="md-just-icon md-simple md-danger"
            @click="$emit('delete-item', item)"
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

<style lang="scss" scoped>
.item-hide {
  background-color: #dadada;
}
</style>
