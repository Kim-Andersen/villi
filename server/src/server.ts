import cors from '@koa/cors';
import { existsSync, mkdirSync } from 'fs';
import Koa from 'koa';
import koaBody from 'koa-body';
import logger from 'koa-logger';
import mount from 'koa-mount';
import serveStatic from 'koa-static';
import { join, normalize } from 'path';
import { apiApp } from './api-app';
import config from './config';
import db from './database';
import { webApp } from './web-app';

console.log('process.env.ROOT_URL', process.env.ROOT_URL);
console.log('config.publicDir', config.publicDir);
console.log('config.uploadDir', config.uploadDir);

if (!existsSync(config.uploadDir)) {
  mkdirSync(config.uploadDir);
}

const serverApp = new Koa();

serverApp.use(logger());
serverApp.use(cors());
serverApp.use(koaBody());
serverApp.use(mount('/public', serveStatic(config.publicDir)));
serverApp.use(mount('/', webApp)); // Start with the "/" route so it doesn't catch all routes.
serverApp.use(mount('/api', apiApp));
serverApp.use(mount('/admin/.*/', serveStatic(normalize(join(config.publicDir, '/admin-app')))));

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
  const port = config.port;
  serverApp.listen(port, () => console.log(`✅  Server started on port ${port}`));
}

startServer();