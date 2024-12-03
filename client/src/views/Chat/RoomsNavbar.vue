<template>
  <div class="chat-list">
    <h2>Чаты</h2>

    <div class="group">
      <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
      <input placeholder="Поиск чата" type="search" v-model="search" class="input">
    </div>

    <div
      v-for="chat in filteredChats"
      :key="chat.id"
      class="chat-item"
      :class="{ active: selectedChat?.id === chat.id }"
      @click="selectChat(chat.id)"
    >
      <div class="room-user">
        <img
            :src="userStore.user?.id === chat.receiver.id ? chat.initiator?.avatarUrl || '/user.png' : chat.receiver?.avatarUrl || '/user.png'"
            alt="Аватар профиля"
            class="user-profile"
        />

        <div class="user-info">
          <div class="user-header">
            <h3>
              {{ userStore.user?.id === chat.receiver.id ? chat.initiator.username : chat.receiver.username }}
            </h3>
            <span v-if="chat.unReaded > 0" class="unread-badge">{{ chat.unReaded }}</span>
          </div>
          <p>
            {{ chat.last_message ? chat.last_message.content : 'Сообщений пока нет' }}
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { joinRoom } from '../../socket/service.ts';
import {computed, onMounted, ref, watch} from 'vue'
import { useChatStore } from "../../store/ChatStore.ts";
import {useUserStore} from "../../store/UserStore.ts";
import {useMessagesStore} from "../../store/MessagesStore.ts";

const chatStore = useChatStore()
const userStore = useUserStore()
const messagesStore = useMessagesStore()

const chatRooms = computed(() => chatStore.chatRooms);
const selectedChat = computed(() => chatStore.chatRoom);

const selectChat = async (id: number) => {
  await chatStore.getRoomById(id);
  await messagesStore.getRoomMessages(id)
  await connectToRoom(id)
};

const search = ref('')

const filteredChats = computed(() => {
  return chatRooms.value.filter(chat =>
    chat.receiver.username.toLowerCase().includes(search.value.toLowerCase())
  )
})

const connectToRoom = async (roomId: number) => {
    try {
        const response = await joinRoom(roomId);
        console.log(`Successfully joined room ${roomId}:`, response);
    } catch (error) {
        console.error('Failed to join room:', error);
    }
};

onMounted(async () => {
  await chatStore.getUserRooms();
})

</script>

<style scoped>
.chat-list {
  width: 300px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  background: #fffefb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h2{
    display: flex;
    align-items: center;
    justify-content: start;
    font-size: 22px;
    margin-left: 15px;
    font-weight: 400;
    color: #212121;
    height: 50px;
  }
}

.chat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e7e7e7;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.chat-item:hover {
  background-color: #eef5ff;
}

.chat-item.active {
  background-color: #e6f2ff;
  border-left: 5px solid #025aaf;
  padding-left: 10px;
}

.room-user {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 10px;

  .user-profile {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-info {
    flex: 1;

    .user-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        font-size: 1.1em;
        font-weight: 500;
        color: #333;
      }

      .unread-badge {
        margin-left: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        background-color: #2c6589;
        color: #fff;
        font-size: 0.8em;
        font-weight: bold;
        border-radius: 50%;
        text-align: center;
      }
    }

    p {
      margin: 5px 0 0 0;
      font-size: 0.9em;
      color: #666;
    }
  }
}

.group {
  display: flex;
  line-height: 28px;
  align-items: center;
  position: relative;
  width: 100%;
  padding: 0 12px;
  margin-bottom: 10px;
}

.input {
  width: 100%;
  height: 40px;
  line-height: 28px;
  padding: 0 1rem 0 2.5rem;
  border: 2px solid transparent;
  border-radius: 8px;
  outline: none;
  background-color: white;
  color: #0d0c22;
  transition: .3s ease;
}

.input::placeholder {
  color: #9e9ea7;
}

.input:focus, input:hover {
  outline: none;
  border-color: rgb(224, 224, 224);
  background-color: #fff;
  box-shadow: 0 0 0 4px rgba(147, 147, 147, 0.1);
}

.icon {
  position: absolute;
  left: 1rem;
  fill: #9e9ea7;
  width: 1rem;
  height: 1rem;
}

</style>
