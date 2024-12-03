<template>
  <div class="chat-container">
    <RoomsNavbar/>
    <ChatWindow />
  </div>
</template>

<script setup lang="ts">
import RoomsNavbar from './RoomsNavbar.vue';
import ChatWindow from './chatWindow/ChatWindow.vue';
</script>

<style scoped>
.chat-container {
  display: flex;
  height: calc(100vh - 80px);
  font-family: Arial, sans-serif;
  background: #f4f7f9;
}
</style>