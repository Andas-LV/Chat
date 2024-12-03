<script lang="ts" setup>
import LoginForm from '../components/forms/LoginForm.vue'
</script>

<template>
    <div class="login-wrapper">
        <LoginForm/>
    </div>
</template>

<style lang="scss" scoped>
.login-wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('/auth-background.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    color: white;
    min-height: 100dvh;
    width: 100dvw;
}
</style>
