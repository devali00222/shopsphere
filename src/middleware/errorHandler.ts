import { Request, Response, NextFunction } from 'express';
import { AppError } from '../infra/errors';
import { logger } from '../infra/logger';
import { Prisma } from '@prisma/client';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.constructor.name, message: err.message });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                return res.status(409).json({ error: 'ConflictError', message: 'A record with the same unique value already exists' });
            case 'P2003':
                return res.status(400).json({ error: 'ForeignKeyConstraintError', message: 'A foreign key constraint failed' });
            case 'P2025':
                return res.status(404).json({ error: 'NotFoundError', message: 'The requested record was not found' });
        }
    }
    logger.error({ err }, 'unhandled error');
    return res.status(500).json({ error: 'Internal Server Error', message: 'An unexpected error occurred' });
}