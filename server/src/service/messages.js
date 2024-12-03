import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getMessages(req, res) {
    const { conversationId } = req.params;

    try {
        const room = await prisma.room.findUnique({
            where: { id: parseInt(conversationId) },
            include: {
                initiator: true,
                receiver: true,
            },
        });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        if (room.initiatorId !== req.user.id && room.receiverId !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Обновляем поле isSeen для всех сообщений текущего пользователя
        await prisma.message.updateMany({
            where: {
                conversationId: parseInt(conversationId),
                senderId: {
                    not: req.user.id, // Помечаем только чужие сообщения
                },
                isSeen: false, // Обновляем только непрочитанные
            },
            data: { isSeen: true },
        });

        // Получаем сообщения комнаты
        const messages = await prisma.message.findMany({
            where: { conversationId: parseInt(conversationId) },
            orderBy: { timestamp: 'asc' },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
}


export async function createMessage (req, res) {
    const { content, conversationId } = req.body;

    try {
        // Проверяем существование комнаты
        const room = await prisma.room.findUnique({
            where: { id: parseInt(conversationId) },
            include: {
                initiator: true,
                receiver: true,
            },
        });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        if (
            room.initiatorId !== req.user.id &&
            room.receiverId !== req.user.id
        ) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Создаём сообщение
        const message = await prisma.message.create({
            data: {
                content,
                senderId: req.user.id,
                conversationId: parseInt(conversationId),
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

        res.status(201).json(message);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Failed to create message' });
    }
}

export async function deleteMessage(req, res) {
    const { messageId } = req.params;

    try {
        const message = await prisma.message.findUnique({
            where: { id: parseInt(messageId) },
        });

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Только отправитель сообщения может его удалить
        if (message.senderId !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await prisma.message.delete({
            where: { id: parseInt(messageId) },
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
}
