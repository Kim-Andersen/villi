import debug from 'debug';
import httpStatus from 'http-status';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import config from '../../config';
import { photoService } from '../../services';
import { entityPhotoInputSchema, parseId, PhotoId, PhotoSizes } from '../../shared';

const log = debug('/photos');

const router = new Router({
  prefix: '/photos'
});

router.post('/', 
  koaBody({ multipart: true, formidable: { uploadDir: config.uploadDir } }), 
  async (ctx: Koa.Context) => {
  
  if (ctx.request.files === undefined || ctx.request.files.file === undefined) {
    ctx.status = httpStatus.BAD_REQUEST;
    ctx.body = {
      error: {
        message: 'No file in request'
      }
    };
    return;
  };

  const filePath = (ctx.request.files.file as any).filepath;
  const content_type = (ctx.request.files.file as any).mimetype;
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
  const input = await entityPhotoInputSchema.parseAsync({ photo_id, [ctx.params.entityType]: parseId(ctx.params.entityId), ...ctx.request.body });
  log('Add entity photo', input);
  ctx.body = await photoService.addPhotoToEntity(input);
  ctx.status = httpStatus.OK;
});

router.delete('/:entityType/:entityId/:photoId', async (ctx: Koa.Context) => {
  const photo_id = parseId<PhotoId>(ctx.params.photoId);
  const input = await entityPhotoInputSchema.parseAsync({ photo_id, [ctx.params.entityType]: parseId(ctx.params.entityId) });
  log('Delete entity photo', input);
  await photoService.removePhotoFromEntity(input);
  ctx.body = {};
  ctx.status = httpStatus.OK;
});


export default router;