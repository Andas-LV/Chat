import axios from 'axios'
import type { SendMessage } from '../types/Chat'

class MessagesService {
    baseUrl: string
    token = localStorage.getItem('token')

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    async getRoomMessages(roomId: number) {
        const { data } = await axios.get(`${this.baseUrl}/messages/${roomId}`, {
            headers: {
                Authorization: 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        })
        return data
    }

    async createMessage(message: SendMessage) {
        const { data } = await axios.post(`${this.baseUrl}/messages/`,
            {content: message.content, conversationId: message.conversationId},{
            headers: {
                Authorization: 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        })
        return data
    }

    async deleteMessage(messageId: number) {
        const { data } = await axios.delete(`${this.baseUrl}/messages/${messageId}`, {
            headers: {
                Authorization: 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        })
        return data
    }

}

export const messagesService = new MessagesService(import.meta.env.VITE_BACKEND_URL)
