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
            </div>
        </template>
        <template slot="actions">
            <md-button class="md-raised" @click="isActiveDialog = !isActiveDialog">Cancel</md-button>
            <md-button class="md-raised md-success">Create user</md-button>
        </template>
    </add-new-user>
</template>

<script>
//  let {email, password, displayName, phoneNumber, emailVerified, disabled} = req.body;
import Dialog from "@/components/Dialog";
import { eventBus } from "../../main";
export default {
    components: {
        AddNewUser: Dialog
    },
    data: () =>({
        isActiveDialog: false,
        user: {
            name: null,
            email: null,
            password: null,
            confirmPassword: null
        }
    }),
    methods: {
    },
    created(){
        eventBus.$on('showUserWindow', () => {
            this.isActiveDialog = !this.isActiveDialog;
        });
    }
}
</script>