<template>
    <div class="container-layout">
        <form class="login-form">
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
                            </md-field>
                        </div>
                        <div class="md-layout-item md-size-100">
                            <md-field>
                                <label>Password</label>
                                <md-input v-model="password" type="password"></md-input>
                            </md-field>
                        </div>
                    </div>
                    <div class="md-layout-item md-size-100 text-right">
                        <md-button class="md-raised md-success">Sign in</md-button>
                    </div>
                </md-card-content>
            </md-card>
        </form>
    </div>
</template>

<script>
export default {
    data: () => ({
        email: null,
        password: null
    }),
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
