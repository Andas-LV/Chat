import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createRoom(req, res){
    const { receiverId } = req.body;

    try {
        const initiator = req.user;

        if (!initiator) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (initiator.id === receiverId) {
            return res.status(400).json({ error: 'Cannot create a room with yourself' });
        }

        const existingRoom = await prisma.room.findFirst({
            where: {
                OR: [
                    { initiatorId: initiator.id, receiverId },
                    { initiatorId: receiverId, receiverId: initiator.id },
                ],
            },
        });

        if (existingRoom) {
            return res.status(400).json({ error: 'Room already exists' });
        }

        const room = await prisma.room.create({
            data: {
                initiatorId: initiator.id,
                receiverId,
            },
            include: {
                initiator: true,
                receiver: true,
            },
        });

        res.status(201).json(room);
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Failed to create room' });
    }
}

export async function getRooms(req, res) {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const rooms = await prisma.room.findMany({
            where: {
                OR: [{ initiatorId: user.id }, { receiverId: user.id }],
            },
            include: {
                initiator: { select: { id: true, username: true, avatarUrl: true } },
                receiver: { select: { id: true, username: true, avatarUrl: true } },
                messages: {
                    take: 1,
                    orderBy: { timestamp: 'desc' },
                },
            },
        });

        const sortedRooms = rooms.map((room) => {
            const unReaded = room.messages.reduce((count, message) => {
                return count + (message.senderId !== user.id && !message.isSeen ? 1 : 0);
            }, 0);

            return {
                ...room,
                unReaded,
            };
        }).sort((a, b) => {
            const timeA = a.messages[0]?.timestamp ? new Date(a.messages[0].timestamp).getTime() : 0;
            const timeB = b.messages[0]?.timestamp ? new Date(b.messages[0].timestamp).getTime() : 0;
            return timeB - timeA;
        });

        const formattedRooms = sortedRooms.map((room) => ({
            id: room.id,
            initiator: room.initiator,
            receiver: room.receiver,
            last_message: room.messages[0] || null,
            unReaded: room.unReaded,
        }));

        res.json(formattedRooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
}

export async function getRoomById(req, res){
    const { roomId } = req.params;

    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const room = await prisma.room.findUnique({
            where: { id: parseInt(roomId, 10) },
            include: {
                initiator: { select: { id: true, username: true, avatarUrl: true} },
                receiver: { select: { id: true, username: true, avatarUrl: true} },
                messages: {
                    orderBy: { timestamp: 'asc' },
                },
            },
        });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        if (room.initiatorId !== user.id && room.receiverId !== user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({
            id: room.id,
            initiator: room.initiator,
            receiver: room.receiver,
            message_set: room.messages,
        });
    } catch (error) {
        console.error('Error fetching room details:', error);
        res.status(500).json({ error: 'Failed to fetch room details' });
    }
}