import Koa from 'koa';
import logger from 'koa-logger';
import mount from 'koa-mount';
import serveStatic from 'koa-static';
import { join, normalize } from 'path';
import { apiApp } from './api-app';
import db from './database';
import { envVar } from './environment';
import { webApp } from './web-app';

const publicDir = normalize(join(__dirname, 'public'));
const serverApp = new Koa();
serverApp.use(logger());
serverApp.use(serveStatic(publicDir));
serverApp.use(mount('/', webApp)); // Start with the "/" route so it doesn't catch all routes.
serverApp.use(mount('/api', apiApp));
serverApp.use(mount('/admin', serveStatic(normalize(join(publicDir, '/admin-app')))));

async function startServer() {
  // Test database connection.
  try {
    console.log(`Connecting to database...`);
    await db.testConnection();
    console.log('✅  Connected to database');
  } catch (error) {
    console.error('Failed to connect to database:');
    console.error(error);
    process.exit(1);
  }

  // All good, ready to listen to incoming requests.
  const port = envVar('PORT');
  serverApp.listen(port, () => console.log(`✅  Server started on port ${port}`));
}

startServer();