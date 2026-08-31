import 'dotenv/config';
import { createApp } from './app';
import { logger } from './infra/logger';
import { loadEnv } from './infra/env';

const env = loadEnv();
const app = createApp();



app.listen(env.PORT, () => {
  logger.info(`ShopSphere listening on port ${env.PORT} (${env.NODE_ENV})`);
});
