import {Router, Request, Response} from 'express';
import { prisma } from '../../infra/prisma';

export const userRouter = Router();

userRouter.get('/:id', async (req: Request, res: Response) => {
    if (!req.params.id) {
        return res.status(400).json({error: 'Bad Request', message: 'User ID is required'});
    }
    const users = await prisma.user.findUnique({
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
        },
        where: { id: req.params.id },
    });
    return res.status(200).json(users);
});