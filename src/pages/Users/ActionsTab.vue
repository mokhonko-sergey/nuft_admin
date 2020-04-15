<template>
    <div>
        <md-button class="md-primary" @click="openDialogWindow()">
            <md-icon>add</md-icon>
            Add new user
        </md-button>
    </div>
</template>

<script>
import { eventBus } from '../../main';
export default {
    methods: {
        openDialogWindow(){
            eventBus.$emit('showUserWindow');
        }
    }
}
</script>