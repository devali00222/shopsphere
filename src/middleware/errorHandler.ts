import {Request, Response, NextFunction} from 'express';
import {AppError} from '../infra/errors';
import{logger} from '../infra/logger';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
    if(err instanceof AppError){
        return res.status(err.statusCode).json({error:err.constructor.name, message: err.message});
    }
    logger.error({err},'unhandled error');
    return res.status(500).json({error: 'Internal Server Error', message: 'An unexpected error occurred'});
}