<template>
   <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100" >
        <md-card class="md-card-plain">
          <md-card-header data-background-color="green">
            <h4 class="title">Table on Plain Background</h4>
            <p class="category">Here is a subtitle for this table</p>
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
        <!-- <pagination></pagination> -->
      </div>
</template>

<script>
import FirebaseApi from '../../services/firebase-api';
import { eventBus } from "../../main";
// import Pagination from "./Pagination";

const { getPics, delPicture } = new FirebaseApi();

export default {
    data: () => ({
        itemsOnPage: 5,
        images: []
    }),
    methods: {
        async fetchPics () {
            const result = await getPics(this.itemsOnPage, 0);
            this.images = result.data;
        },

        async delPic(name) {
            const res = await delPicture(name);
            if(res.success){
                const index = this.images.findIndex((el) => el.filename === name);
                this.images.splice(index, 1);
                this.notifyVue(res.message, "done", "success");
                this.fetchPics();
            }else{
                this.notifyVue(res.message, "warning", "danger");
            }
        },

        notifyVue(message, icon, type, verticalAlign='top', horizontalAlign="right") {
            this.$notify({ message, icon, horizontalAlign, verticalAlign, type});
        }
    },
    created () {
        eventBus.$on('updatePics', () => {
            this.fetchPics();
        });
        this.fetchPics();
    },
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
</style>