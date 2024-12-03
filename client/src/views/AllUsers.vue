<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useUserStore } from '../store/UserStore';
import {useChatStore} from "../store/ChatStore.ts";
import {useRouter} from "vue-router";

const userStore = useUserStore();
const chatStore = useChatStore()
const router = useRouter()

const allUsers = computed(() => userStore.users);

const goToPage = (route: string) => {
  router.push(`/${route}`)
}

const createRoom = async (id: number) => {
  const answer = await chatStore.createRoom(id);
  console.log("Answer:" + answer)
  goToPage('/')
}

onMounted(async () => {
  await userStore.getAllUsers();
});
</script>

<template>
  <div class="users-page">
    <div class="users-container">
      <h1>Список пользователей</h1>
      <div class="users-grid">
        <div v-for="user in allUsers" :key="user.id" class="user-card">
          <img :src="user.avatarUrl || '/user.png'" alt="Avatar" class="avatar" />
          <div class="user-info">
            <h2 class="username">{{ user.username }}</h2>
            <p class="email">{{ user.email }}</p>
          </div>
          <button class="createRoom" @click="createRoom(user.id)">
            Создать чат
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1{
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.users-page{
  background-color: #1e1f22;
  color: white;
  height: 100dvh;
}

.users-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #37373a;
  border-radius: 10px;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.user-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.avatar {
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center;
}

.user-info {
  padding: 15px;
  text-align: center;
}

.username {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 10px 0;
}

.email {
  font-size: 14px;
  color: #666;
}

.createRoom {
  background-color: #2c658a;
  color: #ffffff;
  width: 90%;
  padding: 10px;
  border-radius: 10px;
  margin: 10px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
}
</style>
