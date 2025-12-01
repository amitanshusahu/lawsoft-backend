// Server entrypoint: imports the Express app, creates HTTP server, attaches socket.io (if available), and starts listening.
// require config and app to avoid ESM extension checks in some toolchains
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports

import http from 'http';
import pino from 'pino';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';

// In ESM runtime (package.json "type": "module") `require` is not defined.
// Use dynamic import (top-level await) so this module works under tsx/node ESM.
const configModule = await import('./config/index.js');
const { config } = configModule as any;
const appModule = await import('./app.js');
const app = (appModule as any).default || appModule;

const logger = pino({ level: config.logLevel || 'info' });
const prisma = new PrismaClient();

const server = http.createServer(app);

// Try to attach sockets initializer from ./sockets (optional)
try {
  const socketsModule = await import('./sockets/index.js').catch(() => null);
  const sm: any = socketsModule;
  const init = sm && (sm.initSockets || sm.default || sm.init);
  if (typeof init === 'function') {
    init(server, { logger });
    logger.info('Socket initializer attached');
  }
} catch (err) {
  logger.debug({ err: (err as Error).message }, 'No socket initializer found at ./sockets (optional)');
}

async function start() {
  try {
    await prisma.$connect();
    logger.info('Prisma connected');

    const port = config.port || 4000;
    server.listen(port, () => {
      logger.info({ port }, 'Server listening');
    });
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    await shutdown(1);
  }
}

async function shutdown(code = 0) {
  try {
    logger.info('Shutting down server');
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
      setTimeout(resolve, 5000);
    });
  } catch (err) {
    logger.warn({ err }, 'Error while closing server');
  }

  try {
    await prisma.$disconnect();
    logger.info('Prisma disconnected');
  } catch (err) {
    logger.warn({ err }, 'Error while disconnecting prisma');
  }

  process.exit(code);
}

process.on('SIGINT', () => void shutdown(0));
process.on('SIGTERM', () => void shutdown(0));

// ESM-safe main check
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  // started directly
  await start();
}

export { server, start, shutdown };
export default server;
