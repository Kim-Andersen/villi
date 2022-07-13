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
import { pool } from './database';
import { webApp } from './web-app';

if (!existsSync(config.uploadDir)) {
  mkdirSync(config.uploadDir);
}

const serverApp = new Koa();

serverApp.use(logger());
serverApp.use(cors());
serverApp.use(koaBody());
serverApp.use(mount('/public', serveStatic(config.publicDir)));
serverApp.use(mount('/admin', serveStatic(normalize(join(config.publicDir, '/admin-app')))));
serverApp.use(mount('/', webApp)); // Start with the "/" route so it doesn't catch all routes.
serverApp.use(mount('/api', apiApp));


async function startServer() {
  // Test database connection.
  try {
    console.log(`Connecting to database...`);
    await pool.query(`SELECT NOW()`);
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