<template>
    <md-dialog :md-active.sync="showDialog">
        <md-dialog-title>{{ title }}</md-dialog-title>
        <md-dialog-content>
            <slot name="content"></slot>
        </md-dialog-content>
        <md-dialog-actions>
            <slot name="actions"></slot>
        </md-dialog-actions>
  </md-dialog>
</template>

<script>
export default {
    props: {
        title: String,
        showDialog: Boolean
    }
}
</script>