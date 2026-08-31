import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { logger } from './infra/logger';
import {errorHandler} from './middleware/errorHandler';
import {categoryRouter} from './modules/categories/category.routes';
import {productRouter} from './modules/products/products.routes';
// TODO: import your category and product routers once you've built them

export function createApp() {
    const app = express();
    
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));
// Health check - used by CI/CD and the cloud deploy in Month 6.
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});
app.use('/v1/categories', categoryRouter);
// Module routers get mounted here as they're built:
// app.use('/v1/users', usersRouter);
app.use('/v1/products', productRouter);
// app.use('/v1/orders', ordersRouter);
app.use(errorHandler);
return app;
}