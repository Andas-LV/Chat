import axios from 'axios'
import { type User } from '../types/User'

class UserService {
    baseUrl: string
    token = localStorage.getItem('token')

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    async getAllUsers(): Promise<User[]> {
        const { data } = await axios.get(`${this.baseUrl}/user/all/`, {
            headers: {
                Authorization: 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        })
        return data
    }

    async getUserMe(): Promise<User> {
        const { data } = await axios.get(`${this.baseUrl}/user/me/`, {
            headers: {
                Authorization: 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        })
        return data
    }

    async uploadAvatar(avatarFile: File) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const { data } = await axios.post(`${this.baseUrl}/user/upload-avatar/`, formData, {
            headers: {
                Authorization: 'Bearer ' + this.token,
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    }
}

export const userService = new UserService(import.meta.env.VITE_BACKEND_URL)
