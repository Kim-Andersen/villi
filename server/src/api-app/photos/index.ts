import debug from 'debug';
import { createWriteStream } from 'fs';
import httpStatus from 'http-status';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import fetch from 'node-fetch';
import { join, normalize } from 'path';
import { promisify } from 'util';

import mime from 'mime-types';
import config from '../../config';
import { photoService } from '../../services';
import { entityPhotoInputSchema, entityTypeToIdField, parseId, PhotoId, PhotoSizes } from '../../shared';

const streamPipeline = promisify(require('stream').pipeline);

const log = debug('/photos');

const router = new Router({
  prefix: '/photos'
});

router.post('/', 
  koaBody({ multipart: true, formidable: { uploadDir: config.uploadDir } }), 
  async (ctx: Koa.Context) => {
  
  if ((ctx.request.files === undefined || ctx.request.files.file === undefined) && typeof ctx.request.body.url !== 'string') {
    ctx.status = httpStatus.BAD_REQUEST;
    ctx.body = {
      error: {
        message: 'No file or url in request'
      }
    };
    return;
  };

  let filePath: string;
  let content_type: string;

  if (ctx.request.body.url) {
    log(`downloading photo ${ctx.request.body.url}`);

    const url = ctx.request.body.url;
    const response = await fetch(url);
    if (response.ok) {
      const fileName = url.substring(url.lastIndexOf('/') + 1);
      filePath = normalize(join(config.uploadDir, fileName));
      
      const type = response.headers.get('Content-Type') as string;
      content_type = mime.extension(type) as string;
      await streamPipeline(response.body, createWriteStream(filePath));
    } else {
      ctx.status = httpStatus.BAD_REQUEST;
      ctx.body = {
        error: {
          message: `Failed to download from ${url}`
        }
      };
      return;
    }
  } else {
    filePath = (ctx.request.files?.file as any).filepath;
    content_type = (ctx.request.files?.file as any).mimetype;
  }

  const sizes = JSON.parse(ctx.request.body.sizes) as PhotoSizes;

  log('upload photo', { filePath, content_type, sizes });

  ctx.body = await photoService.addPhoto(filePath, { content_type, sizes });
  ctx.status = httpStatus.OK;
});

router.get('/:entityType/:entityId', async (ctx: Koa.Context) => {
  ctx.body = await photoService.findAllEntityPhotos(ctx.params.entityType, parseId(ctx.params.entityId));
  ctx.status = httpStatus.OK;
});

router.post('/:entityType/:entityId/:photoId', async (ctx: Koa.Context) => {
  const photo_id = parseId<PhotoId>(ctx.params.photoId);
  const entityIdField = entityTypeToIdField(ctx.params.entityType);
  const input = await entityPhotoInputSchema.parseAsync({ photo_id, [entityIdField]: parseId(ctx.params.entityId), ...ctx.request.body });
  log('Add entity photo', input);
  ctx.body = await photoService.addPhotoToEntity(input);
  ctx.status = httpStatus.OK;
});

router.delete('/:entityType/:entityId/:photoId', async (ctx: Koa.Context) => {
  const photo_id = parseId<PhotoId>(ctx.params.photoId);
  const entityIdField = entityTypeToIdField(ctx.params.entityType);
  const input = await entityPhotoInputSchema.parseAsync({ photo_id, [entityIdField]: parseId(ctx.params.entityId), ...ctx.request.body });
  log('Delete entity photo', input);
  await photoService.removePhotoFromEntity(input);
  ctx.body = {};
  ctx.status = httpStatus.OK;
});


export default router;