import 'dotenv-safe/config';
import Koa from 'koa';
import logger from 'koa-logger';
import mount from 'koa-mount';
import { apiApp } from './api-app';
import db from './database';
import { getEnvVar } from './environment';
import { webApp } from './web-app';

const serverApp = new Koa();
serverApp.use(logger());
serverApp.use(mount('/', webApp)); // Start with the "/" route so it doesn't catch all routes.
serverApp.use(mount('/api', apiApp));

async function startServer() {
  // Test database connection.
  try {
    await db.testConnection();
    console.log('✅  Connected to database');
  } catch (error) {
    console.error('Failed to connect to database:');
    console.error(error);
    process.exit(1);
  }

  // All good, ready to listen to incoming requests.
  const port = getEnvVar('PORT');
  serverApp.listen(port, () => console.log(`✅  Server started on port ${port}`));
}

startServer();