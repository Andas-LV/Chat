<script lang="ts" setup>
import RegisterForm from '../components/forms/RegisterForm.vue'
</script>

<template>
    <div class="register-wrapper">
        <RegisterForm/>
    </div>
</template>

<style lang="scss" scoped>
.register-wrapper{
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