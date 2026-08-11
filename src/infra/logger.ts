import pino from 'pino';

/**
 * Structured (JSON) logging from day one, even though request-ID tracing
 * is officially a Month 6 task. Retrofitting logging later means rewriting
 * every console.log across the codebase - cheaper to start clean.
 */
const isDev = process.env.NODE_ENV === 'development';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  // With `exactOptionalPropertyTypes: true`, an explicit `transport: undefined`
  // is a type error - pino's option type wants the key omitted entirely, not
  // present-but-undefined. So we only add the key when we actually mean to.
  ...(isDev ? { transport: { target: 'pino-pretty', options: { colorize: true } } } : {}),
});
