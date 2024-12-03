<template>
  <v-container class="fill-height" fluid>
    <v-row class="d-flex justify-center align-center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12 transparent">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-card-text>
                <div class="text-center display-1 white--text mb-4">Login</div>
                <v-form>
                  <v-text-field
                    v-model="username"
                    label="Username"
                    name="username"
                    prepend-icon="mdi-account"
                    type="text"
                    color="white"
                    dark
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    color="white"
                    dark
                  ></v-text-field>
                  <v-checkbox
                    v-model="rememberMe"
                    label="Remember me"
                    color="white"
                    dark
                  ></v-checkbox>
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex flex-column">
                <v-btn color="primary" @click="login">Login</v-btn>

                <v-card-text class="w-100 d-flex justify-space-between align-center">
                  <button class="text-blue">Forgot password?</button>
                  <button class="text-blue" @click="goToPage('register')">Register</button>
                </v-card-text>               
              </v-card-actions>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/UserStore';

const router = useRouter()
const userStore = useUserStore()
const step = ref(1);
const username = ref('');
const password = ref('');
const rememberMe = ref(false);

const goToPage = (route: string) => {
  router.push(`/${route}`)
}

const login = async() => {
  const payload = {
    username: username.value,
    password: password.value
  }
  try{
    await userStore.login(payload)
    await router.push('/')
  } catch(e){
    console.error(e)
  }
  
};
</script>

<style scoped>
.transparent {
  background-color: rgba(245, 255, 249, 0.3) !important;
  backdrop-filter: blur(10px);
}
.v-card {
  border-radius: 16px;
}
</style>