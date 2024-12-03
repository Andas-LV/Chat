import type {Message, SendMessage} from "../types/Chat.ts";
import {socket} from "./index.ts";

export const joinRoom = async (roomId: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        socket.emit('joinRoom', roomId, (response: any) => {
            if (response?.error) {
                console.error('Error joining room:', response.error);
                reject(response.error);
            } else {
                console.log(`Joined room ${roomId}`);
                resolve(response);
            }
        });
    });
};

// Отправка сообщения
export const sendMessage = async (message: SendMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        socket.emit('message', message, (response: any) => {
            if (response?.error) {
                console.error('Error sending message:', response.error);
                reject(response.error);
            } else {
                console.log('Message sent successfully:', response);
                resolve(response);
            }
        });
    });
};

export const onMessage = (callback: (message: Message) => void): void => {
    socket.on('message', callback);
};

export const offMessage = (): void => {
    socket.off('message');
};

socket.on('error', (error: Error) => {
    console.error('Socket error:', error);
});

socket.on('disconnect', () => {
    console.warn('Disconnected from server');
});
