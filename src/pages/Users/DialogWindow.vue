/* eslint-disable prettier/prettier */
<template>
  <add-new-user :showDialog.sync="isDialog" :title="title">
    <!-- Form -->
    <template slot="content">
      <div class="md-layout">
        <div class="md-layout-item md-size-100">
          <md-field>
            <label for="rules">Права користувача</label>
            <md-select v-model="value.displayName" name="rules" id="rules">
              <md-option value="admin">Адміністратор</md-option>
              <md-option value="user">Модератор</md-option>
            </md-select>
          </md-field>
        </div>
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>Email</label>
            <md-input v-model="value.email" type="email"></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>Пароль</label>
            <md-input v-model="value.password" type="password"></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-size-100">
          <md-field>
            <label>Підтвердження пароля</label>
            <md-input
              v-model="value.confirmPassword"
              type="password"
            ></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-size-100">
          <md-checkbox v-model="value.disabled">Заблокувати</md-checkbox>
        </div>
      </div>
    </template>
    <!-- Actions Buttons -->
    <template slot="actions">
      <md-button class="md-raised" @click="closeDialog()">
        Відміна
      </md-button>
      <md-button class="md-raised md-success" @click="action()">
        <loading v-if="loading" />
        <span v-else>Зберегти</span>
      </md-button>
    </template>
  </add-new-user>
</template>

<script>
import Dialog from "@/components/Dialog";
import { MiniLoading } from "@/components/Loading";
export default {
  name: "dialog-users",
  components: {
    AddNewUser: Dialog,
    loading: MiniLoading
  },
  props: {
    action: {
      type: Function,
      required: true
    },
    value: {
      type: Object,
      default() {
        return {
          displayName: null,
          email: null,
          password: null,
          confirmPassword: null,
          disabled: false
        };
      }
    },
    title: String,
    loading: {
      type: Boolean,
      default: false
    },
    isDialog: Boolean
  },
  watch: {
    value: {
      deep: true,
      handler(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit("close-window", false);
    }
  }
};
</script>
