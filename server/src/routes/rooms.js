import { Router } from 'express';
import { authenticateToken } from '../middleware/index.js';
import {createRoom, getRoomById, getRooms} from "../service/rooms.js";

const router = Router();

router.use(authenticateToken)

router.post('/', async (req, res) => {
    await createRoom(req, res)
});

router.get('/', async (req, res) => {
    await getRooms(req, res)
});

router.get('/:roomId', async (req, res) => {
    await getRoomById(req, res)
});

export const roomsRouter = router;
