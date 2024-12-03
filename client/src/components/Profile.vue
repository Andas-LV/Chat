<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '../store/UserStore';

const userStore = useUserStore()
const userInfo = computed(() => userStore.user)
const avatarUrl = computed(() => `${userInfo.value?.avatarUrl}`)

const uploadAvatar = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (e: any) => {
    await userStore.uploadAvatar(e.target.files[0])
  }
  input.click()
}

const deleteAvatar = async () => {

}
</script>

<template>
  <v-menu
      location="end"
      style="padding: 0"
      transition="scale-transition"
  >
    <template v-slot:activator="{ props }">
      <label
          class="user-profile-wrapper"
          v-bind="props"
          for="thumbnail"
      >
        <img
            v-if="userInfo?.avatarUrl"
            :src="avatarUrl"
            alt="Аватар профиля"
            class="user-profile"
        />
        <img
            v-else
            src="/user.png"
            alt="Аватар профиля"
            class="user-profile"
        />
      </label>
    </template>
    <v-list style="padding: 0">
      <v-list-item
          @click="uploadAvatar"
          style="color: #5b9271"
          value="upload-avatar"
      >
        <v-list-item-title class="list-item">
          <v-icon> mdi-upload </v-icon>
          <div style="padding-top: 3px">Загрузить фото</div>
        </v-list-item-title>
      </v-list-item>
      <v-list-item
          @click="deleteAvatar"
          style="color: #d20f0d"
          value="delete-avatar"
      >
        <v-list-item-title class="list-item">
          <v-icon> mdi-delete </v-icon>
          <div style="padding-top: 3px">Удалить фото</div>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>


<style lang="scss">
.user-profile-wrapper{
  display: flex;
  align-items: center;

  & .user-profile{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
}
</style>