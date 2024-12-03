import { defineStore } from 'pinia';
import { ref } from 'vue';
import { messagesService } from '../services/messages.service';
import type { Message, SendMessage } from '../types/Chat';

export const useMessagesStore = defineStore('messages', () => {
    const messages = ref<Message[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const getRoomMessages = async (roomId: number) => {
        loading.value = true;
        error.value = null;
        try {
            messages.value = await messagesService.getRoomMessages(roomId);
        } catch (err) {
            error.value = 'Не удалось загрузить сообщения';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const createMessage = async (message: SendMessage) => {
        error.value = null;
        try {
            const newMessage = await messagesService.createMessage(message);
            messages.value.push(newMessage);
            return newMessage;
        } catch (err) {
            error.value = 'Не удалось отправить сообщение';
            console.error(err);
            throw err;
        }
    };

    const deleteMessage = async (messageId: number) => {
        error.value = null;
        try {
            await messagesService.deleteMessage(messageId);
            messages.value = messages.value.filter(message => message.id !== messageId);
        } catch (err) {
            error.value = 'Не удалось удалить сообщение';
            console.error(err);
            throw err;
        }
    };

    return {
        messages,
        loading,
        error,
        getRoomMessages,
        createMessage,
        deleteMessage,
    };
});
