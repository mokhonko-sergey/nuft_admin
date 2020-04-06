<template>
    <div class="md-layout-item md-layout-item--loader">
        <md-progress-spinner class="md-accent" :md-diameter="60" :md-stroke="3" md-mode="indeterminate" />
    </div>
</template>

<style scoped>
.md-layout-item--loader {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 300px;
}
</style>