import { buildApp } from './app.js';

const DEFAULT_PORT = 3001;
const DEFAULT_HOST = '127.0.0.1';

function readPort(value: string | undefined): number {
  if (value === undefined || value.trim() === '') return DEFAULT_PORT;

  const port = Number(value);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`neteisingas PORT "${value}" (turi būti sveikas skaičius 0–65535)`);
  }

  return port;
}

let port = DEFAULT_PORT;
try {
  port = readPort(process.env.PORT);
} catch (error) {
  console.error(`goods-import-api: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const host = process.env.HOST?.trim() || DEFAULT_HOST;
const app = await buildApp();

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  app.log.info({ signal }, 'Stabdomas API');
  await app.close();
  process.exit(0);
};

process.once('SIGINT', () => {
  void shutdown('SIGINT');
});
process.once('SIGTERM', () => {
  void shutdown('SIGTERM');
});

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
