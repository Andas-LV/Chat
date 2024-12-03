import {Router} from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/index.js';
import {createMessage, getMessages, deleteMessage} from "../service/messages.js";

const prisma = new PrismaClient();
export const messagesRouter = Router();

messagesRouter.use(authenticateToken);

messagesRouter.get('/:conversationId', async (req, res) => {
    await getMessages(req, res)
});

messagesRouter.post('/', async (req, res) => {
    await createMessage(req, res)
});

messagesRouter.delete('/:messageId', async (req, res) => {
    await deleteMessage(req, res)
});
