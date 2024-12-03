import { Router } from 'express';
import { loginService, registerService } from "../service/auth.js";

const router = Router();

router.post('/register', async (req, res) => {
    await registerService(req, res)
});

router.post('/login', async (req, res) => {
    await loginService(req, res)
});

export const authRouter = router;