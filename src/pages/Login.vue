<template>
    <div class="container-layout">
        <form class="login-form" @submit.prevent="login()">
            <md-card>
                <md-card-header data-background-color="green">
                    <h4 class="title">Sign In</h4>
                    <p class="category">Enter your email address and password.</p>
                </md-card-header>
                <md-card-content>
                    <div class="md-layout">
                        <div class="md-layout-item md-size-100">
                            <md-field>
                                <label>Email</label>
                                <md-input v-model="email" type='email'></md-input>
                                <span class="md-error">There is an error</span>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-size-100">
                            <md-field>
                                <label>Password</label>
                                <md-input v-model="password" type="password" required></md-input>
                                <span class="md-error">There is an error</span>
                            </md-field>
                        </div>
                    </div>
                    <div class="md-layout-item md-size-100 text-right">
                        <md-button class="md-raised md-success" type='submit'>Sign in</md-button>
                    </div>
                </md-card-content>
            </md-card>
        </form>
    </div>
</template>

<script>
import * as firebase from 'firebase';
export default {
    data: () => ({
        isLoading: false,
        email: null,
        password: null
    }),
    methods: {
        login() {
            this.$store.dispatch('signIn', {email: this.email, pass: this.password})
                .then(data => {
                    if(data.success)
                        this.password = this.email = null;
                }).catch(err => {
                    console.log(err);
                })
        } 
    }
}
</script>


<style lang="scss">
.container-layout {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-form{
    width: 100%;
    max-width: 500px;
}
</style>
