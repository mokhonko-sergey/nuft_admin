import * as firebase from 'firebase';
export default {
    state: {
        user: {}
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
        }
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
        async checkUserToken({ state }){
            const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${state.user.token}`);

            const options = {
                method: 'GET',
                headers: myHeaders,
            };
            
            try{
                const query = await fetch('https://us-central1-nuft-kebop.cloudfunctions.net/auth/auth', options);
                const result = await query.json();
                return result.authenticated;
            }catch(err){
                return false;
            }
        }
    },
    getters: {
        getUserToken: state => {
            return state.user.token;
        }
    }
}