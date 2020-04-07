<template>
   <div class="md-layout-item md-size-100" >
       <loading v-if="isLoad"/>
        <md-card class="md-card-plain" v-else>
          <md-card-header data-background-color="green">
            <div class="md-layout md-size-100">
                <div class="md-layout-item md-size-75 md-xsmall-size-100">
                    <h4 class="title">Table on Plain Background</h4>
                    <p class="category">Here is a subtitle for this table</p>
                </div>
                <div class="md-layout-item md-size-25 custom__md-layout-item md-xsmall-size-100">
                    <md-button class='md-primary' @click="$emit('dialog')">
                        <md-icon class="md-size-2x">backup</md-icon>
                        Upload Files
                    </md-button>
                </div>
            </div>
          </md-card-header>
          <md-card-content class='images-content'>
            <md-content v-for="img in images" :key="img.id">
                <img :src="img.url" :alt='img.description'/>
                <div class="img-actions">
                    <md-button class="md-fab md-btn-fab md-danger" @click="delPic(img.filename)">
                        <md-icon>delete_outline</md-icon>
                    </md-button>
                </div>
            </md-content>
          </md-card-content>
        </md-card>
        <pagination :items="items" @pageQuery="fetchPics"></pagination>
      </div>
</template>

<script>
import FirebaseApi from '../../services/firebase-api';
import { eventBus } from "../../main";
import Pagination from "./Pagination";
import { MainLoading } from "@/components/Loading/index.js";

const { getPics, delPicture } = new FirebaseApi();

export default {
    data: () => ({
        showDialog: true,
        isLoad: false,
        itemsOnPage: 25,
        startAt: 0,
        items: null,
        images: []
    }),
    methods: {
        async fetchPics (itemsOnPage, startAt) {
            this.isLoad = true;
            const result = await getPics(itemsOnPage, startAt);
            this.images = result.data;
            this.items = result.сountOfItems;
            this.isLoad = false;
        },

        async delPic(name) {
            this.isLoad = true;
            const res = await delPicture(name);
            if(res.success){
                const index = this.images.findIndex((el) => el.filename === name);
                this.images.splice(index, 1);
                this.notifyVue(res.message, "done", "success");
                // this.fetchPics();
            }else{
                this.notifyVue(res.message, "warning", "danger");
            }
            this.isLoad = false;
        },

        notifyVue(message, icon, type, verticalAlign='top', horizontalAlign="right") {
            this.$notify({ message, icon, horizontalAlign, verticalAlign, type});
        }
    },
    created () {
        eventBus.$on('updatePics', () => {
            this.fetchPics(this.itemsOnPage, this.startAt);
        });
        this.fetchPics(this.itemsOnPage, this.startAt);
    },
    components: {
        Pagination,
        loading: MainLoading
    }
}
</script>

<style lang="scss" scoped>
    .images-content{
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }

    .md-content {
        width: 200px;
        height: 200px;
        display: inline-flex;
        justify-content: center;
        align-content: center;
        margin-right: 10px;
        margin-bottom: 10px;
        position: relative;

        img {
            height: 100%;
            width: auto;
        }

        .img-actions {
            position: absolute;
            bottom: 5px;
            left: 5px;

            & .md-button {
                margin: 0 5px 0 0;
            }
        }
    }

    .custom__md-layout-item {
        display: flex;
        align-items: center;
        justify-content: center;

        margin-top: 10px;
    }
</style>