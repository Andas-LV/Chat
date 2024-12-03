import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

export const socket = io(SOCKET_URL, {
    withCredentials: true, // Если нужно передавать куки
    auth: {
        token: localStorage.getItem('token'),
    },
});