import cors from '@koa/cors';
import { existsSync, mkdirSync } from 'fs';
import Koa from 'koa';
import koaBody from 'koa-body';
import logger from 'koa-logger';
import mount from 'koa-mount';
import serveStatic from 'koa-static';
import { join, normalize } from 'path';
import { apiApp } from './api-app';
import s3Helper from './api-app/places/s3Helper';
import db from './database';
import { envVar } from './environment';
import { webApp } from './web-app';

const uploadDir = normalize(join(__dirname, 'uploads'));
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

const publicDir = normalize(join(__dirname, 'public'));
const serverApp = new Koa();

// serverApp.use(bodyParser({ jsonLimit: '3mb' }));
serverApp.use(logger());
serverApp.use(cors());
serverApp.use(koaBody());
serverApp.use(serveStatic(publicDir));
serverApp.use(mount('/', webApp)); // Start with the "/" route so it doesn't catch all routes.
serverApp.use(mount('/api', apiApp));
serverApp.use(mount('/admin', serveStatic(normalize(join(publicDir, '/admin-app')))));

async function startServer() {
  s3Helper.ensureBucket('villi-photos');

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