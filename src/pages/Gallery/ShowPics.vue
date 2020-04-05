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
      </div>
</template>

<script>
import { eventBus } from "../../main";
export default {
    data: () => ({
        images: []
    }),
    methods: {
        async fetchPics () {
            const url = 'https://us-central1-nuft-kebop.cloudfunctions.net/gallery';
            const items = 12;
            const start = 0;
            const response = await fetch(`${url}?itemOnPage=${items}&start=${start}`);
            const result = await response.json()
            this.images = result.data;
        },
        async delPic(name) {
            const url = 'https://us-central1-nuft-kebop.cloudfunctions.net/gallery';
            const options = {
                method: "DELETE"
            }

            try{
                const response =  await fetch(`${url}/${name}`, options);
                const res = await response.json();
                if(res.success){
                    this.notifyVue(res.message, "top", "right", "done", "success");
                    const index = this.images.findIndex((el) => el.filename === name);
                    this.images.splice(index, 1);
                }else{
                    this.notifyVue(res.message, "top", "right", "warning", "danger");
                }
            }catch(e){ }
        },
        notifyVue(message, verticalAlign, horizontalAlign, icon, type) {
            this.$notify({ message, icon, horizontalAlign, verticalAlign, type});
        }
    },
    created () {
        eventBus.$on('updatePics', () => {
            this.fetchPics();
        });
        this.fetchPics();
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
</style>