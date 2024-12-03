import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { authRouter } from './routes/auth.js';
import { messagesRouter } from './routes/messages.js';
import {userRouter} from "./routes/users.js";
import { authenticateSocket } from './middleware/index.js';
import {swaggerSpec} from './swagger.js'
import swaggerUi from 'swagger-ui-express'
import {roomsRouter} from "./routes/rooms.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 8000;
const origins = process.env.CLIENT_URL || "http://localhost:5173"
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: origins,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
    },
});

app.use(cors({
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE'],
    credentials: true,
}));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/rooms', roomsRouter)
app.use('/messages', messagesRouter);

io.use(authenticateSocket);

io.on('connection', (socket) => {
    console.log('User connected:', socket?.user.id);

    socket.on('joinRoom', async (roomId) => {
        try {
            const room = await prisma.room.findUnique({
                where: { id: parseInt(roomId) },
            });

            if (!room || (room.initiatorId !== socket.user.id && room.receiverId !== socket.user.id)) {
                return socket.emit('error', { message: 'Access denied' });
            }

            socket.join(roomId);
            console.log(`User ${socket.user.id} joined room ${roomId}`);
        } catch (error) {
            console.error('Error joining room:', error);
            socket.emit('error', { message: 'Failed to join room' });
        }
    });


    socket.on('message', async (data) => {
        const { content, conversationId } = data;

        try {
            // Сохранение сообщения в базе данных
            const message = await prisma.message.create({
                data: {
                    content,
                    senderId: socket.user.id,
                    conversationId,
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
            });

            // Трансляция сообщения другим участникам комнаты
            io.to(conversationId).emit('message', message);
            console.log('Message sent:', message);
        } catch (error) {
            console.error('Error saving message:', error);
            socket.emit('error', { message: 'Failed to send message' });

        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket?.user.id);
    });
});



httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});