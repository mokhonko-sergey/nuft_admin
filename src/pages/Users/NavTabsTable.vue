<template>
  <div>
    <md-table>
      <md-table-row>
        <md-table-head>Email</md-table-head>
        <md-table-head>Роль користувача</md-table-head>
        <md-table-head>Дії</md-table-head>
      </md-table-row>

      <md-table-row
        slot="md-table-row"
        v-for="item in trasformData"
        :key="item.uid"
      >
        <md-table-cell>{{ item.email }}</md-table-cell>
        <md-table-cell>{{ item.displayName }}</md-table-cell>
        <md-table-cell>
          <md-button
            class="md-just-icon md-simple md-primary"
            @click="openDialog(item)"
          >
            <md-icon>edit</md-icon>
            <md-tooltip md-direction="top">Редагувати</md-tooltip>
          </md-button>
          <md-button
            class="md-just-icon md-simple md-default"
            v-if="isSameUser(item.uid)"
            @click="$emit('block-user', item)"
          >
            <md-icon>block</md-icon>
            <md-tooltip md-direction="top">Заблокувати</md-tooltip>
          </md-button>
          <md-button
            class="md-just-icon md-simple md-danger"
            v-if="isSameUser(item.uid)"
            @click="$emit('delete-user', item.uid)"
          >
            <md-icon>close</md-icon>
            <md-tooltip md-direction="top">Видалити</md-tooltip>
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
      selected: []
    };
  },
  computed: {
    trasformData() {
      return this.data.map(el => {
        return { ...el, displayName: this.userName(el.displayName) };
      });
    }
  },
  methods: {
    openDialog(item) {
      this.$emit("active-dialog", item);
    },
    userName(name) {
      return name === "admin" ? "Адміністратор" : "Модератор";
    },
    isSameUser(id) {
      return id !== this.$store.getters.getUser.userId;
    }
  }
};
</script>
