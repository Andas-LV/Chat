<template>
  <div class="chat-window">
    <ChatHeader />
    <MessageList />
    <MessageInput />
  </div>
</template>

<script setup lang="ts">
import ChatHeader from "./ChatHeader.vue";
import MessageList from "./MessageList.vue";
import MessageInput from "./MessageInput.vue";
</script>

<style scoped>
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
}
</style>
