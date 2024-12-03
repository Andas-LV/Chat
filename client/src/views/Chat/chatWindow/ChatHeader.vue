<template>
  <div v-if="selectedChat" class="chat-header">
    <div v-if="userStore.user?.id === selectedChat?.receiver.id" class="user-profile-wrapper">
      <img
        :src="selectedChat?.initiator?.avatarUrl || '/user.png'"
        alt="Аватар профиля"
        class="user-profile"
      />

      <h2>{{ selectedChat?.initiator.username }}</h2>

    </div>

    <div v-else class="user-profile-wrapper">
      <img
        :src="selectedChat?.receiver?.avatarUrl || '/user.png'"
        alt="Аватар профиля"
        class="user-profile"
      />

      <h2>{{ selectedChat?.receiver.username }}</h2>
    </div>

    <span @click="openDeleteModal" v-html="deleteBasket"></span>
  </div>

  <ChatRoomDelete
    :chatId="selectedChat?.id!"
    :show-modal="showModal"
    @close="toggleModal"
  />
</template>

<script setup lang="ts">
import { deleteBasket } from '../../../assets/svg'
import ChatRoomDelete from '../../../components/modal/ChatRoomDelete.vue'
import {computed, ref} from 'vue'
import {useChatStore} from "../../../store/ChatStore.ts";
import {useUserStore} from "../../../store/UserStore.ts";

const userStore = useUserStore()
const chatStore = useChatStore()
const selectedChat = computed(() => chatStore.chatRoom);

const showModal = ref(false)

const toggleModal = () => {
  showModal.value = !showModal.value
}

const openDeleteModal = () => {
  if (selectedChat) {
    showModal.value = true
  }
}

</script>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #2c658a;
  color: white;
  font-size: 1.2em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  & span{
    cursor: pointer;
  }

  & .user-profile{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
}

.user-profile-wrapper{
  display: flex;
  gap: 10px;
}
</style>
