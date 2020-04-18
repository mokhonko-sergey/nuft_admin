<template>
  <div class="md-layout-item md-size-100">
    <!-- Button for create new user -->
    <actions-tab @active-dialog="dialogForNewUser"></actions-tab>

    <nav-tabs-card>
      <template slot="content">
        <span class="md-nav-tabs-title">Users:</span>
        <md-tabs class="md-success" md-alignment="left">
          <!-- List Of Active Users -->
          <md-tab id="tab-home" md-label="Active" md-icon="face">
            <nav-tabs-table
              :data="activeUsers"
              @active-dialog="dialoForEditUserData"
              @delete-user="deleteUser"
              @block-user="blockUser"
            />
          </md-tab>
          <!-- List Of Blocked Users -->
          <md-tab id="tab-pages" md-label="Blocked" md-icon="block">
            <nav-tabs-table
              :data="blockedUsers"
              @active-dialog="dialoForEditUserData"
              @delete-user="deleteUser"
              @block-user="blockUser"
            />
          </md-tab>
        </md-tabs>
      </template>
    </nav-tabs-card>

    <dialog-window
      :title="dialogWindowTitle"
      :isDialog="isActiveDialog"
      :action="actionFunction"
      :loading="isLoading"
      v-model="user"
      @close-window="closeDialogWindow"
    />
  </div>
</template>

<script>
import NavTabsCard from "./NavTabsCard";
import NavTabsTable from "./NavTabsTable";
import ActionsTab from "./ActionsTab";
import DialogWindow from "./DialogWindow";
import FirebaseApi from "@/services/firebase-api";
const {
  getAllUsers,
  delUser,
  updateUserInfo,
  createNewUser
} = new FirebaseApi();
export default {
  components: {
    NavTabsCard,
    NavTabsTable,
    ActionsTab,
    DialogWindow
  },
  data: () => ({
    isLoading: false,
    isActiveDialog: false,
    user: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      disabled: false
    },
    users: [],
    action: "create"
  }),
  computed: {
    activeUsers() {
      return this.users.filter(el => el.disabled === false);
    },
    blockedUsers() {
      return this.users.filter(el => el.disabled === true);
    },
    token() {
      return this.$store.getters.getUser.token;
    },
    actionFunction() {
      return this.action === "create" ? this.createUser : this.updateUser;
    },
    dialogWindowTitle() {
      if (this.action === "create") {
        return "New User";
      }

      return "Update User Info";
    }
  },
  methods: {
    async getUsers() {
      const result = await getAllUsers(this.token);
      this.users = result;
    },

    async deleteUser(id) {
      const result = await delUser(id, this.token);
      if (result.success) {
        this.notifyVue(result.message, "done", "success");
        this.getUsers();
        return;
      }
      this.notifyVue(result.message, "warning", "danger");
    },

    async blockUser(data) {
      const newUserData = {
        uid: data.uid,
        email: data.email,
        disabled: !data.disabled
      };

      try {
        const result = await updateUserInfo(this.token, newUserData);
        if (result.success) {
          this.notifyVue(result.message, "done", "success");
          this.getUsers();
          return;
        }
        this.notifyVue(result.message, "warning", "danger");
      } catch (err) {
        console.log(err);
      }
    },

    async createUser() {
      this.isLoading = true;
      try {
        const query = await createNewUser(this.token, this.user);

        if (query.success) {
          this.isLoading = false;
          this.cleanFormFields();
          this.isActiveDialog = false;
          this.notifyVue(query.message, "done", "success");
          this.getUsers();
          return;
        }

        this.notifyVue(query.message, "warning", "danger");
        this.isLoading = false;
      } catch (err) {
        console.log(err);
        this.isLoading = false;
      }
    },

    async updateUser() {
      this.isLoading = true;
      try {
        const query = await updateUserInfo(this.token, this.user);

        if (query.success) {
          this.isLoading = false;
          this.isActiveDialog = false;
          this.cleanFormFields();
          this.notifyVue(query.message, "done", "success");
          this.getUsers();
          return;
        }

        this.isLoading = false;
        this.notifyVue(query.message, "warning", "danger");
      } catch (err) {
        console.log(err);
        this.isLoading = false;
      }
    },

    dialogForNewUser() {
      this.action = "create";
      this.isActiveDialog = !this.isActiveDialog;
    },

    dialoForEditUserData(value) {
      this.user = value;
      this.action = "edit";
      this.isActiveDialog = !this.isActiveDialog;
    },

    closeDialogWindow(event) {
      this.isActiveDialog = event;
      this.cleanFormFields();
    },

    cleanFormFields() {
      this.user = {
        name: null,
        email: null,
        password: null,
        confirmPassword: null,
        disabled: false
      };
    },

    notifyVue(
      message,
      icon,
      type,
      verticalAlign = "top",
      horizontalAlign = "right"
    ) {
      this.$notify({ message, icon, horizontalAlign, verticalAlign, type });
    }
  },
  created() {
    this.getUsers();
  }
};
</script>
