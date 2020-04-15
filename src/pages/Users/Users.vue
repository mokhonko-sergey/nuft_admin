<template>
    <div class="md-layout-item md-size-100">
        <nav-tabs-card>
          <template slot="content">
            <span class="md-nav-tabs-title">Users:</span>
            <md-tabs class="md-success" md-alignment="left">
              
              <md-tab id="tab-home" md-label="Active" md-icon="face">
                <nav-tabs-table :data='activeUsers' @del="deleteUser"></nav-tabs-table>
              </md-tab>

              <md-tab id="tab-pages" md-label="Blocked" md-icon="block">
                <nav-tabs-table :data="blockedUsers" @del="deleteUser"></nav-tabs-table>
              </md-tab>

            </md-tabs>
          </template>
        </nav-tabs-card>
      </div>
</template>

<script>
import NavTabsCard from "./NavTabsCard";
import NavTabsTable from "./NavTabsTable";
import FirebaseApi from '@/services/firebase-api';
const { getAllUsers, delUser } = new FirebaseApi();
export default {
    components: {
        NavTabsCard,
        NavTabsTable
    },
    data: () => ({
      users: []
    }),
    computed: {
      activeUsers(){
        return this.users.filter(el => el.disabled === false);
      },
      blockedUsers(){
        return this.users.filter(el => el.disabled === true);
      },
      token(){
        return this.$store.getters.getUser.token;
      }
    },
    methods: {
      async getUsers(){
        const result = await getAllUsers(this.token);
        this.users = result;
      },
      
      async deleteUser(id){   
        const result = await delUser(id, this.token);
        if(result.success){
          this.notifyVue(result.message, 'done', 'success');
          this.getUsers();
          return;
        }
        this.notifyVue(result.message, 'warning', 'danger');
      },

      notifyVue(message, icon, type, verticalAlign='top', horizontalAlign='right') {
        this.$notify({ message, icon, horizontalAlign, verticalAlign, type });
      }
    },
    created(){
      this.getUsers();
    }
}
</script>