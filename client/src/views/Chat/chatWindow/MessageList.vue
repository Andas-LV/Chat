<template>
  <div v-if="selectedChat && selectedChat.id" class="messages" ref="messagesContainer">
    <div
        v-for="message in allMessages"
        @click="handleMessageClick(message)"
        class="message"
        :key="message.id"
        :class="{
        user: message.senderId === userStore.user?.id,
        other: message.senderId !== userStore.user?.id
      }"
    >
      <div class="message-content">{{ message.content }}</div>

      <div class="message-time">
        {{ formatDateForChat(message.timestamp) }}
      </div>

      <div v-if="message.senderId === userStore.user?.id" class="delete-option" :class="{ 'show': selectedMessage === message }">
        <button @click.stop="deleteMessage(message)">
          Удалить
          <span class="basketIcon" v-html="deleteBasket"></span>
        </button>
      </div>

    </div>
  </div>

  <div v-else class="no-chat-selected">
    <p>Выберите чат слева, чтобы начать общение</p>
  </div>
</template>

<script setup lang="ts">
import { formatDateForChat } from '../../../helpers/formatTime.ts';
import type { Message } from '../../../types/Chat'
import { deleteBasket } from '../../../assets/svg'
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { offMessage, onMessage } from "../../../socket/service.ts";
import { useChatStore } from "../../../store/ChatStore.ts";
import { useMessagesStore } from "../../../store/MessagesStore.ts";
import { useUserStore } from "../../../store/UserStore.ts";

const chatStore = useChatStore();
const userStore = useUserStore()
const messagesStore = useMessagesStore();

const selectedChat = computed(() => chatStore.chatRoom);
const messages = computed(() => messagesStore.messages);
const messagesContainer = ref<HTMLElement | null>(null);

const allMessages = computed(() => {
  const chatMessages = selectedChat.value?.message_set || [];
  const newMessages = messages.value.filter(
    (message) => message.conversationId === selectedChat.value?.id
  );
  return [...chatMessages, ...newMessages].reduce((unique, message) => {
    if (!unique.some((m) => m.id === message.id)) {
      unique.push(message);
    }
    return unique;
  }, [] as Message[]);
});


const selectedMessage = ref<Message | null>(null);

const handleMessageClick = (message: Message) => {
  if (message.senderId === userStore.user?.id) {
    selectedMessage.value = selectedMessage.value === message ? null : message;
  }
};

const deleteMessage = (message: Message) => {
  console.log('Selected message for deletion:', message.content);

  messagesStore.deleteMessage(message.id)

  messagesStore.messages = messagesStore.messages.filter(
      (m) => m.id !== message.id
  );

  selectedMessage.value = null;
};


const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: 'smooth',
    });
  }
};

const subscribeToMessages = () => {
  onMessage((message: Message) => {
    console.log('Новое сообщение:', message);
    if (message.conversationId === selectedChat.value?.id) {
      messagesStore.messages.push(message);
    }
  });
};

const unsubscribeFromMessages = () => {
  offMessage();
};

onMounted(async () => {
  subscribeToMessages();
  await nextTick();
  scrollToBottom();
});

onUnmounted(() => {
  console.log('Отписка от сообщений');
  unsubscribeFromMessages();
});


watch(allMessages, async () => {
  await nextTick();
  scrollToBottom();
});
</script>

<style scoped>
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f4f7f9;
  height: 100%;
  min-height: 0;
}

.message {
  position: relative;
  max-width: 70%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.message.user {
  align-self: flex-end;
  background-color: #2c658a;
  color: white;
  margin-left: auto;
  width: fit-content;
  border-radius: 10px 10px 0 10px;
}

.message.user .message-time {
  color: #b2b2b2;
}

.message.other {
  background-color: #e6e6e6;
  color: #333;
  width: fit-content;
  max-width: 500px;
  border-radius: 10px 10px 10px 0;
}

.message-time {
  font-size: 0.8em;
  color: #888;
  text-align: right;
  margin-top: 8px;
}

.no-chat-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f4f7f9;
  color: #666;
  font-size: 1.2em;
}

.delete-option {
  position: absolute;
  top: 20%;
  right: 105%;
  background-color: #9d3b39;
  color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  padding: 5px 10px;
  border-radius: 5px;
  display: none;
}

.delete-option.show {
  display: block;
}

.delete-option button {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 16px;
  background: none;
  border: none;
  cursor: pointer;
}
</style>