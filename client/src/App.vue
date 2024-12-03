<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>

<style lang="scss">
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  min-width: 100dvw;
}
</style>