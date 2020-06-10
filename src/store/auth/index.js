import * as firebase from "firebase";
import {
  setPersistenceLocal,
  setPersistenceSession,
  getPersistence,
  clearPersistence,
  isRemember
} from "./persistence";
import { Auth } from "@/services/index";
const { signIn, refreshToken } = new Auth();
export default {
  state: {
    user: {
      userId: null,
      token: null,
      refreshToken: null,
      expired: null,
      role: null
    }
  },
  mutations: {
    setUser(state, payload) {
      const { userId, token, refreshToken, expired, role } = payload;
      state.user = {
        userId,
        token,
        refreshToken,
        expired,
        role
      };
    }
  },
  actions: {
    async signIn({ commit }, { email, pass, persistence = false }) {
      try {
        const query = await signIn(email, pass);
        if (!query.success)
          return {
            success: false,
            message: query.message
          };

        const {
          idToken,
          refreshToken,
          localId,
          expiresIn,
          displayName
        } = query.data;

        const userData = {
          userId: localId,
          token: idToken,
          refreshToken,
          expired: Date.now() + parseInt(expiresIn) * 1000,
          role: displayName
        };

        commit("setUser", userData);

        persistence
          ? setPersistenceLocal(userData)
          : setPersistenceSession(userData);

        return {
          success: true,
          message: "User sign in"
        };
      } catch (err) {
        return {
          success: false,
          message: err.message
        };
      }
    },

    signOut({ commit }) {
      clearPersistence();
      commit("setUser", {});
    },

    checkPersistence({ commit }) {
      const data = JSON.parse(getPersistence());
      data ? commit("setUser", data) : commit("setUser", {});
    },

    async updateTokens({ commit }, token) {
      const { role } = JSON.parse(getPersistence());
      const res = await refreshToken(token);
      const data = {
        userId: res.data.user_id,
        token: res.data.access_token,
        refreshToken: res.data.refresh_token,
        expired: Date.now() + parseInt(res.data.expires_in) * 1000,
        role
      };
      if (res.success) {
        commit("setUser", data);
        isRemember() ? setPersistenceLocal(data) : setPersistenceSession(data);
      }
    }
  },
  getters: {
    getUser: state => {
      return state.user;
    },
    isAdmin: state => {
      return state.user.role === "admin";
    }
  }
};
