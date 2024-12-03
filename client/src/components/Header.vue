<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/UserStore';
import { authService } from '../services/auth.service';
import { people } from '../assets/svg.ts'
import Profile from "./Profile.vue";

const router = useRouter()

const userStore = useUserStore()

const userInfo = computed(() => userStore.user)

const goToPage = (route: string) => {
  router.push(`/${route}`)
}

const logout = () => {
  authService.logout()
}
</script>

<template>
  <div class="header">
    <h2 v-show="userInfo" @click="goToPage('allUsers')">
      <span v-html="people"></span>
      Все пользователи
    </h2>

    <div v-if="!userInfo" class="btns">
      <button @click="goToPage('login')" class="login-btn">Login</button> |
      <button @click="goToPage('register')" class="register-btn">Register</button>
    </div>

    <div v-else class="userInfo">
      <Profile/>

      <h3>{{ userInfo.username }}</h3>

      <v-btn @click="logout">Выйти</v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  position: absolute;
  left: 10px;
}

.header{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  background-color:#20282E;
  width: 100%;
  height: 80px;
}

.btns, .userInfo{
  display: flex;
  align-items:center;
  color: white;
  gap: 15px;
}

.login-btn{
  padding: 10px 20px;
  background-color: #D9D9D9;
  border-radius:5px;
  color: #686a6c;
  border: 1px;
  transition: .3s ease-in-out;

  &:hover{
    background-color: #878c93;
    color:#D9D9D9 ;
  }
}
</style>