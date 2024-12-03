import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, Login } from '../types/User'
import { authService } from '../services/auth.service'
import { userService } from '../services/user.service'

export const useUserStore = defineStore('userStore', () => {
    const users = ref<User[]>([])
    const user = ref<User | null>(null)
    const isAuthenticated = ref(false)

    const login = async (body: Login) => {
        try {
            user.value = await authService.login(body)
            isAuthenticated.value = true
        } catch (error) {
            throw new Error('Unauthorized 401')
        }
    }

    const getAllUsers = async () => {
        try {
            users.value = await userService.getAllUsers()
            isAuthenticated.value = true
        } catch (error) {
            throw new Error('Unauthorized 401')
        }
    }

    const getUserMe = async () => {
        try {
            user.value = await userService.getUserMe()
            isAuthenticated.value = true
        } catch (error) {
            throw new Error('Unauthorized 401')
        }
    }

    const uploadAvatar = async(avatarFile: File) => {
        try {
            user.value!.avatarUrl = await userService.uploadAvatar(avatarFile)
            await getUserMe()
        } catch(e) {
            console.error(e)
        }
    }

    const logout = () => {
        try {
            authService.logout()
            user.value = null
        } catch(e) {
            console.error(e)
        }
    }

    return {
        user,
        users,
        isAuthenticated,
        getAllUsers,
        uploadAvatar,
        login,
        getUserMe,
        logout
    }
})
