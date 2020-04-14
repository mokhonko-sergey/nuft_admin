import * as firebase from 'firebase';
import FirebaseApi from '@/services/firebase-api';
const { isAuthorized } = new FirebaseApi();
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
        setUser(state, payload){
            const { userId, token, refreshToken, expired } = payload;
            state.user = {
                userId,
                token,
                refreshToken,
                expired
            };
        },
    },
    actions: {
        async signIn ({ commit }, {email, pass}){
            try{
                const loginQyery = await firebase.auth().signInWithEmailAndPassword(email, pass);
                const user = loginQyery.user;
                const userResult = await user.getIdTokenResult();

                const userData = {
                    userId: user.uid,
                    token: userResult.token,
                    refreshToken: user.refreshToken,
                    expired: userResult.expirationTime,
                };
                
                commit('setUser', userData);
                
                return {
                    success: true,
                    message: "User is loged in"
                };
            }catch(err){
                return {
                    success: false,
                    message: err.message
                };
            }
        },
        //unused
        async checkUserToken({ state }){
            try{
                const query = await isAuthorized(state.user.token);
                return query.authenticated;
            }catch(err){
                return false;
            }
        }
    },
    getters: {
        getUser: state => {
            return state.user;
        }
    }
}