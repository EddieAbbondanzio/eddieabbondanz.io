<script setup lang="ts">
</script>

<template>
  <sl-button variant="text" size="small" @sl-click="() => $emit('click')">
    <span class="reset">reset</span>
  </sl-button>
</template>

<style lang="sass" scoped>
  .reset
    font-size: 12px
</style>