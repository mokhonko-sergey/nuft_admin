<template>
   <div class="md-layout-item md-size-100" >
        <md-card class="md-card-plain">
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
            <loading v-if="isLoad"/>
            <div class="image-container" v-for="img in images" :key="img.id" v-else>
                <md-button class="md-fab md-btn-fab md-danger custom__md-btn" @click="delPic(img.filename)">
                    <md-icon>delete_outline</md-icon>
                </md-button>
                <img :src="img.url" :alt='img.description' class='image-container__img'/>
                <div class="overlay-desc" v-if="img.description">
                    <div class="overlay-desc__text">
                        {{ img.description }}
                    </div>
                </div>
            </div>
          </md-card-content>
        </md-card>
        <pagination :pages="pages" @pageQuery="ifChangePage"></pagination>
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
        isLoad: false,
        itemsOnPage: 25,
        startAt: null,
        items: null,
        images: []
    }),
    computed: {
        pages(){
            return Math.ceil(this.items / this.itemsOnPage);
        }
    },
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
                
                this.fetchPics(this.itemsOnPage, this.startAt);
            }else{
                this.notifyVue(res.message, "warning", "danger");
            }
            this.isLoad = false;
        },

        ifChangePage(itemsOnPage, startAt){
            this.itemsOnPage = itemsOnPage;
            this.startAt = startAt;

            this.fetchPics(itemsOnPage, startAt);
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
    .custom__md-layout-item {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .images-content{
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    .image-container {
        position: relative;
        width: 200px;
        height: 200px;
        border-radius: 3px;
        margin: 10px 5px;
        overflow: hidden;

        img {
            position: absolute;
            left: 50%;
            top: 50%;
            height: 100%;
            width: auto;
            -webkit-transform: translate(-50%,-50%);
                -ms-transform: translate(-50%,-50%);
                    transform: translate(-50%,-50%);
        }
        
        &__img {
            transition: .5s ease;
            object-fit:cover;
        }

        
        .overlay-desc {
            width: 100%;
            height: 100%;
            background-color: rgba($color: #000000, $alpha: 0.7);
            transition: .5s ease;
            opacity: 0;
            
            position: absolute;
            top: 0%;
            left: 0%;
            text-align: center;
            text-transform: uppercase;
            font-size: 18px;
            color: white;

            &__text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                -ms-transform: translate(-50%, -50%);
            }
        }
        
        &:hover .overlay-desc {
            opacity: 1;
        }
        
        .custom__md-btn {
            margin: 0;
            position: absolute;
            top: 3px;
            right: 3px;
        }
    }


    
</style>