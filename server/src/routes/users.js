import { Router } from 'express';
import { authenticateToken } from '../middleware/index.js';
import {getAllUsersExceptMe, getUserMe, updateUserMe, uploadAvatar} from "../service/user.js";
import { upload } from "../utils/uploadAvatar.js";
import multer from 'multer';

const router = Router();

router.use(authenticateToken)

router.get('/all', async (req, res) => {
    await getAllUsersExceptMe(req, res);
});

router.get('/me', async (req, res) => {
    await getUserMe(req, res);
});

router.patch('/me', async (req, res) => {
    await updateUserMe(req, res);
});

router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
    await uploadAvatar(req, res)
});

router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(400).json({ error: 'File upload error' });
    }
    next(error);
});
export const userRouter = router;
