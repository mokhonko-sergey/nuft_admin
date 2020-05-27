<template>
  <div class="md-layout-item md-size-100">
    <!-- Button for create new user -->
    <actions-tab @active-dialog="dialogForNewUser"></actions-tab>

    <nav-tabs-card>
      <template slot="content">
        <!-- <span class="md-nav-tabs-title"></span> -->
        <md-tabs class="md-success" md-alignment="left">
          <!-- List Of Active Users -->
          <md-tab id="tab-home" md-label="Активні" md-icon="face">
            <nav-tabs-table
              :data="activeUsers"
              @active-dialog="dialoForEditUserData"
              @delete-user="deleteUser"
              @block-user="blockUser"
            />
          </md-tab>
          <!-- List Of Blocked Users -->
          <md-tab id="tab-pages" md-label="Заблоковані" md-icon="block">
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
import { RESPONSE_MESSAGES } from "./messages";
import { Users } from "@/services/index";
const { getAllUsers, delUser, updateUserInfo, createNewUser } = new Users();

export default {
  name: "users",
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
        return "Новий користувач";
      }

      return "Оновити інформацію про користувача";
    }
  },
  methods: {
    async getUsers() {
      const query = await getAllUsers(this.token);
      this.users = query.success ? query.result : [];
    },

    async deleteUser(id) {
      const result = await delUser(id, this.token);
      if (result.success) {
        this.notifyVue(RESPONSE_MESSAGES.SUCCESS.DELETED, "done", "success");
        this.getUsers();
        return;
      }
      this.notifyVue(RESPONSE_MESSAGES.REJECT.NOT_DELETED, "warning", "danger");
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
          const message = data.disabled
            ? RESPONSE_MESSAGES.SUCCESS.UNBLOKED
            : RESPONSE_MESSAGES.SUCCESS.BLOKED;
          this.notifyVue(message, "done", "success");
          this.getUsers();
          return;
        }
        this.notifyVue(RESPONSE_MESSAGES.REJECT.NOT_BLOCK, "warning", "danger");
      } catch (err) {
        this.notifyVue(
          `${RESPONSE_MESSAGES.REJECT.ERROR} ${err.message}`,
          "warning",
          "danger"
        );
      }
    },

    async createUser() {
      const validatePasswords = this.checkPassword(
        this.user.password,
        this.user.confirmPassword
      );

      if (!validatePasswords.success) {
        this.notifyVue(validatePasswords.message, "warning", "warning");
        return;
      }

      this.isLoading = true;

      try {
        const query = await createNewUser(this.token, this.user);

        if (query.success) {
          this.isLoading = false;
          this.cleanFormFields();
          this.isActiveDialog = false;
          this.notifyVue(RESPONSE_MESSAGES.SUCCESS.NEW_USER, "done", "success");
          this.getUsers();
          return;
        }

        this.notifyVue(
          `${RESPONSE_MESSAGES.REJECT.NOT_NEW_USER} ${query.message}`,
          "warning",
          "danger"
        );
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        this.notifyVue(
          `${RESPONSE_MESSAGES.REJECT.ERROR} ${err.message}`,
          "warning",
          "danger"
        );
      }
    },

    async updateUser() {
      if (this.user.password) {
        const validatePasswords = this.checkPassword(
          this.user.password,
          this.user.confirmPassword
        );

        if (!validatePasswords.success) {
          this.notifyVue(validatePasswords.message, "warning", "warning");
          return;
        }
      }

      this.isLoading = true;

      try {
        const query = await updateUserInfo(this.token, this.user);

        if (query.success) {
          this.isLoading = false;
          this.isActiveDialog = false;
          this.cleanFormFields();
          this.notifyVue(RESPONSE_MESSAGES.SUCCESS.UPDATED, "done", "success");
          this.getUsers();
          return;
        }

        this.isLoading = false;
        this.notifyVue(
          `${RESPONSE_MESSAGES.REJECT.NOT_UPDATED} ${query.message}`,
          "warning",
          "danger"
        );
      } catch (err) {
        this.isLoading = false;
        this.notifyVue(
          `${RESPONSE_MESSAGES.REJECT.ERROR} ${err.message}`,
          "warning",
          "danger"
        );
      }
    },

    dialogForNewUser() {
      this.action = "create";
      this.isActiveDialog = !this.isActiveDialog;
    },

    dialoForEditUserData(value) {
      this.user = Object.assign({}, value);
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

    checkPassword(pass1, pass2) {
      if (!pass1)
        return {
          success: false,
          message: RESPONSE_MESSAGES.REJECT.EMPTY_PASS
        };

      if (pass1 !== pass2)
        return {
          success: false,
          message: RESPONSE_MESSAGES.REJECT.PASS_NOT_MATCHED
        };

      return { success: true };
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
  async created() {
    await this.getUsers();
  }
};
</script>
