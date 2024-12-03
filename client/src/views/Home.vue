<script setup lang="ts">
import { onMounted } from 'vue'
import Header from '../components/Header.vue'
import ChatView from '../views/Chat/ChatView.vue'
import { useUserStore } from '../store/UserStore';

const userStore = useUserStore()

onMounted(() => {
  userStore.getUserMe()
});
</script>

<template>
  <div class="home-container">
    <Header/>
    <ChatView/>
  </div>
</template>

<style lang="scss">
.home-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-content: space-between;
  min-height: 100dvh;
  min-width: 100dvw;
}
</style>