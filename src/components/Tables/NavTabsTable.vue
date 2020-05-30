<template>
  <div>
    <md-table>
      <md-table-row>
        <md-table-head v-for="(key, index) of cells" :key="index">
          {{ key.cell }}
        </md-table-head>
        <md-table-head>Дії</md-table-head>
      </md-table-row>
      <md-table-row
        v-for="(item, index) of data"
        :key="index"
        :class="{ 'item-hide': !item.visible }"
      >
        <md-table-cell v-for="(cell, index) in cells" :key="index">{{
          cell.function ? cell.function(item[cell.field]) : item[cell.field]
        }}</md-table-cell>

        <md-table-cell>
          <md-button
            class="md-just-icon md-simple md-primary"
            @click="$emit('edit-item', item.id)"
          >
            <md-icon>edit</md-icon>
            <md-tooltip md-direction="top">Редагувати</md-tooltip>
          </md-button>

          <md-button
            class="md-just-icon md-simple md-primary"
            @click="$emit('toggle-visible-item', item)"
          >
            <md-icon v-show="item.visible">visibility</md-icon>
            <md-tooltip md-direction="top" v-show="item.visible">
              В чернетки
            </md-tooltip>
            <md-tooltip md-direction="top" v-show="!item.visible">
              Опублікувати
            </md-tooltip>
            <md-icon v-show="!item.visible">visibility_off</md-icon>
          </md-button>

          <md-button
            class="md-just-icon md-simple md-danger"
            @click="$emit('delete-item', item.id)"
          >
            <md-icon>delete</md-icon>
            <md-tooltip md-direction="top">Видалити</md-tooltip>
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
    cells: Array
  }
};
</script>

<style lang="scss" scoped>
.item-hide {
  background-color: #dadada;
}
</style>
