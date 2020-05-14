<template>
  <div class="md-layout md-alignment-top-right">
    <div class="md-layout-item md-size-75">
      <nav v-if="pages > 1">
        <ul>
          <li
            :class="[currentPage == item ? 'active' : '']"
            v-for="item in pages"
            :key="item"
            @click.prevent="startAt(item)"
          >
            {{ item }}
          </li>
        </ul>
      </nav>
    </div>
    <div class="md-layout-item md-item-filter">
      <select v-model="itemsOnPage" name="items" id="items">
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  </div>
</template>

<script>
import { eventBus } from "../../main";
export default {
  props: {
    pages: {
      type: Number
    }
  },
  data: () => ({
    currentPage: 1,
    itemsOnPage: 25
  }),
  computed: {},
  methods: {
    startAt(page) {
      const start = parseInt(this.itemsOnPage) * (page - 1);
      this.$emit("pageQuery", this.itemsOnPage, start);
      this.currentPage = page;
    }
  },
  watch: {
    itemsOnPage: function() {
      this.startAt(1);
    }
  }
};
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;

  list-style: none;

  li {
    display: inline-block;
    padding: 0 5px;
    margin-right: 3px;
    border-radius: 3px;
    color: #111 !important;
    cursor: pointer;

    &:hover {
      box-shadow: 0 14px 26px -12px rgba(244, 67, 54, 0.42),
        0 4px 23px 0px rgba(0, 0, 0, 0.12),
        0 8px 10px -5px rgba(244, 67, 54, 0.2);
      color: #fff !important;
      background: linear-gradient(60deg, #66bb6a, #43a047);
    }
  }

  li.active {
    background: linear-gradient(60deg, #66bb6a, #43a047);
    color: #fff !important;
  }
}

.md-item-filter {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  select {
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    width: 100px;
    height: 29px;
    border-radius: 3px;
    border: 1px solid #43a047;
    color: #000000;

    option {
      font-size: 16px;
    }
  }
}
</style>
