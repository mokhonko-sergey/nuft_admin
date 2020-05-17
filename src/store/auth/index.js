import * as firebase from "firebase";
import {
  setPersistenceLocal,
  setPersistenceSession,
  clearPersistence
} from "./persistence";
import { Auth } from "@/services/index";
const { signIn, refreshToken } = new Auth();
export default {
  state: {
    user: {
      userId: null,
      token: null,
      refreshToken: null,
      expired: null
    }
  },
  mutations: {
    setUser(state, payload) {
      const { userId, token, refreshToken, expired } = payload;
      state.user = {
        userId,
        token,
        refreshToken,
        expired
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

        const { idToken, refreshToken, localId, expiresIn } = query.data;
        const userData = {
          userId: localId,
          token: idToken,
          refreshToken,
          expired: Date.now() + parseInt(expiresIn)
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
    async signOut({ commit }) {
      await firebase.auth().signOut();
      clearPersistence();
      commit("setUser", {
        userId: null,
        token: null,
        refreshToken: null,
        expired: null
      });
    }
  },
  getters: {
    getUser: state => {
      return state.user;
    }
  }
};
