import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pinoHttp from 'pino-http';

import { loadEnv } from './infra/env';
import { logger } from './infra/logger';

const env = loadEnv();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

// Health check - used by CI/CD and the cloud deploy in Month 6.
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Module routers get mounted here as they're built:
// app.use('/v1/users', usersRouter);
// app.use('/v1/products', productsRouter);
// app.use('/v1/orders', ordersRouter);

app.listen(env.PORT, () => {
  logger.info(`ShopSphere listening on port ${env.PORT} (${env.NODE_ENV})`);
});
