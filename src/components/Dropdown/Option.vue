<template>
  <div>
    <div class="v-dropdown-item__content" v-if="isEdit">
      <div class="coll">
        <input
          type="text"
          class="v-dropdown-item__input"
          v-model="newData.label"
        />
      </div>

      <div>
        <md-button class="md-just-icon md-simple md-success" @click="save">
          <md-icon>save</md-icon>
          <md-tooltip md-direction="top">Зберегти</md-tooltip>
        </md-button>
        <md-button class="md-just-icon md-simple" @click="cancel">
          <md-icon>cancel</md-icon>
          <md-tooltip md-direction="top">Відмінити</md-tooltip>
        </md-button>
      </div>
    </div>

    <div
      class="v-dropdown-item__content"
      @click="$emit('select-option')"
      v-else
    >
      <div class="coll">{{ data.label }}</div>

      <div>
        <md-button class="md-just-icon md-simple md-warning" @click.stop="edit">
          <md-icon>edit</md-icon>
          <md-tooltip md-direction="top">Редагувати</md-tooltip>
        </md-button>

        <md-button
          class="md-just-icon md-simple md-danger"
          @click.stop="$emit('delete-item', data.id)"
        >
          <md-icon>delete</md-icon>
          <md-tooltip md-direction="top">Видалити</md-tooltip>
        </md-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "v-option",
  props: ["data"],
  data: () => ({
    isEdit: false,
    newData: {}
  }),
  methods: {
    edit() {
      Object.assign(this.newData, this.data);
      this.isEdit = !this.isEdit;
    },
    save() {
      this.$emit("save-item", this.newData);
      this.isEdit = !this.isEdit;
    },
    cancel() {
      this.isEdit = !this.isEdit;
      this.newData = this.data;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-dropdown-item__content {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .coll {
    width: 90%;
  }

  .v-dropdown-item__input {
    width: 100%;
    border: 1px solid grey;
    border-radius: 5px;
    padding: 5px;
  }
}

.md-tooltip {
  z-index: 9999;
}

.md-button {
  margin: 0;
  height: 30px !important;
  width: 30px !important;
  min-width: 0 !important;
}
</style>
