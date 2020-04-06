<template>
   <div class="md-layout md-gutter md-alignment-top-right">
        <div class="md-layout-item md-size-75">
            <button class='btn' @click="startAt(item)" v-for="item in pages" :key="item">{{ item }}</button>
        </div>
        <div class="md-layout-item">
            <md-field>
                <md-select v-model="itemsOnPage" name="items" id="items">
                    <md-option value="10">10</md-option>
                    <md-option value="25">25</md-option>
                    <md-option value="50">50</md-option>
                    <md-option value="100">100</md-option>
                </md-select>
            </md-field>
        </div>
   </div>
</template>

<script>
import { eventBus } from "../../main";
export default {
    props: {
        items: {
            type: Number
        }
    },
    data: () => ({
        itemsOnPage: 25,
    }),
    computed: {
        pages() {
            return Math.ceil(this.items / this.itemsOnPage);
        },
    },
    methods: {
        startAt(page){
            const start = parseInt(this.itemsOnPage) * (page-1);
            this.$emit('pageQuery', this.itemsOnPage, start);
        }
    },
    watch: {
        itemsOnPage: function () {
            this.startAt(1)
        }
    }
}
</script>

<style lang="scss" scoped>
.btn {
    background-color: white;
}
</style>