import axios from 'axios'
import { type Rooms } from '../types/Chat.ts'
import { useUserStore } from '../store/UserStore';
import {computed} from "vue";

const userStore = useUserStore();

class ChatService {
    baseUrl: string
    token = localStorage.getItem('token')
    userId = computed(() => userStore.user?.id)
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    async createRoom(receiverId: number): Promise<Rooms> {
        const { data } = await axios.post(`${this.baseUrl}/rooms/`, {
                receiverId: receiverId
            }, {
            headers: {
                Authorization: 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        })
        return data
    }


    async getUserRooms(): Promise<Rooms[]> {
        const { data } = await axios.get(`${this.baseUrl}/rooms/`, {
            headers: {
                Authorization: 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        })
        return data
    }

    async getRoomById(roomId: number) {
        const { data } = await axios.get(`${this.baseUrl}/rooms/${roomId}`, {
            headers: {
                Authorization: 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        })
        return data
    }
}

export const chatService = new ChatService(import.meta.env.VITE_BACKEND_URL)
