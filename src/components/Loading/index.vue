<template>
    <md-progress-spinner class="md-accent" :class="{onDisplay: !isActive}" :md-diameter="20" :md-stroke="3" md-mode="indeterminate" />
</template>

<script>
export default {
    props: {
        isActive: {
            type: Boolean,
            default: true
        }
    }
}
</script>

<style scoped>
.onDisplay {
    display: none;
}
</style>