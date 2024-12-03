import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { chatService } from '../services/chat.service'
import type { Room, Rooms } from '../types/Chat'

export const useChatStore = defineStore('chat', () => {
    const chatRooms = ref<Rooms[]>([])
    const chatRoom = ref<Room | null>(null)

    const createRoom = async (receiverId: number) => {
        try {
            const data = await chatService.createRoom(receiverId)
            chatRooms.value.push(data)
            return data
        } catch (err) {
            return err
        }
    }

    const getUserRooms = async () => {
        try {
            chatRooms.value = await chatService.getUserRooms()
        } catch (err) {
            return err
        }
    }

    const getRoomById = async(id: number)=> {
        try {
            const data = await chatService.getRoomById(id)
            chatRoom.value = data
            return data
        } catch (err) {
            return err
        }
    }

    const lastChatRoom = computed(() => {
        return chatRooms.value.length > 0 ? chatRooms.value[chatRooms.value.length - 1] : null
    })

    return {
        chatRooms,
        chatRoom,
        lastChatRoom,
        getRoomById,
        getUserRooms,
        createRoom,
    }
})