<template>
    <div class="md-layout-item md-size-100">
        <nav-tabs-card>
          <template slot="content">
            <span class="md-nav-tabs-title">Users:</span>
            <md-tabs class="md-success" md-alignment="left">
              
              <md-tab id="tab-home" md-label="Active" md-icon="face">
                <nav-tabs-table :data='activeUsers'></nav-tabs-table>
              </md-tab>

              <md-tab id="tab-pages" md-label="Blocked" md-icon="block">
                <nav-tabs-table :data="blockedUsers"></nav-tabs-table>
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
const { getAllUsers } = new FirebaseApi();
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
      }
    },
    methods: {
      async getUsers(){
        const { token } = this.$store.getters.getUser;
        const result = await getAllUsers(token);
        this.users = result;
      }
    },
    created(){
      this.getUsers();
    }
}
</script>