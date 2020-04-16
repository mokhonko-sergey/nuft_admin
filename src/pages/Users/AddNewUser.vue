<template>
    <add-new-user :showDialog='isActiveDialog' title="Add New User">
        <template slot="content">
            <div class="md-layout">
                <div class="md-layout-item md-size-100">
                    <md-field>
                        <label>User Name</label>
                        <md-input v-model="user.name" type="text"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-field>
                        <label>Email Address</label>
                        <md-input v-model="user.email" type="email"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-field>
                        <label>Password</label>
                        <md-input v-model="user.password" type="password"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-field>
                        <label>Confirm password</label>
                        <md-input v-model="user.confirmPassword" type="password"></md-input>
                    </md-field>
                </div>
                <div class="md-layout-item md-size-100">
                    <md-checkbox v-model="user.disabled">Disable user</md-checkbox>
                </div>
            </div>
        </template>
        <template slot="actions">
            <md-button class="md-raised" @click="isActiveDialog = !isActiveDialog">Cancel</md-button>
            <md-button class="md-raised md-success" @click="createUser()">
                <loading v-if="isLoading"/>
                <span v-else>Create user</span>
            </md-button>
        </template>
    </add-new-user>
</template>

<script>
import Dialog from "@/components/Dialog";
import { MiniLoading } from '@/components/Loading';
import { eventBus } from "../../main";
import FirebaseApi from "@/services/firebase-api"
const { createNewUser } = new FirebaseApi();
export default {
    components: {
        AddNewUser: Dialog,
        loading: MiniLoading
    },
    data: () =>({
        isActiveDialog: false,
        isLoading: false,
        user: {
            name: null,
            email: null,
            password: null,
            confirmPassword: null,
            disabled: false,
        }
    }),
    methods: {
        async createUser(){
            this.isLoading = true;
            try{
                const token = this.$store.getters.getUser.token;
                const user = {  
                                email: this.user.email,
                                password: this.user.password,
                                displayName: this.user.name,
                                disabled: this.user.disabled 
                            };
                            
                const query = await createNewUser(token, user);
                if(query.success){
                    this.isLoading = false;
                    this.cleanFormFields();
                    this.isActiveDialog = false;
                    this.notifyVue(query.message, 'done', 'success');
                    this.$emit('updatelistOfUsers');
                    return;
                }

                this.notifyVue(query.message, 'warning', 'danger');
                this.isLoading = false;
            
            }catch(err){
                console.log(err);
                this.isLoading = false;
            };
        },

        cleanFormFields(){
            this.user = {name: null, email: null, password: null, confirmPassword: null, disabled: false}
        },

        notifyVue(message, icon, type, verticalAlign='top', horizontalAlign='right') {
            this.$notify({ message, icon, horizontalAlign, verticalAlign, type });
        }
    },
    created(){
        eventBus.$on('showUserWindow', () => {
            this.isActiveDialog = !this.isActiveDialog;
        });
    }
}
</script>