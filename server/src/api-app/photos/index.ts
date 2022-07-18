import debug from 'debug';
import httpStatus from 'http-status';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import config from '../../config';
import { photoService } from '../../services';
import { entityPhotoInputSchema, entityType, parseId, PhotoId } from '../../shared';

const log = debug('/vendors');

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

  log('upload photo', { filePath, content_type });

  ctx.body = await photoService.addPhoto(filePath, { content_type });
  ctx.status = httpStatus.OK;
});

/**
 * Get photos for an entity.
 */
router.get('/:entity_type/:entity_id', async (ctx: Koa.Context) => {
  const entity_type = entityType.parse(ctx.params.entity_type);
  const entity_id = parseId<number>(ctx.params.entity_id);

  ctx.body = await photoService.findAllEntityPhotos(entity_type, entity_id);
  ctx.status = httpStatus.OK;
});

router.post('/:entity_type/:entity_id/:photo_id', async (ctx: Koa.Context) => {
  const entity_type = entityType.parse(ctx.params.entity_type);
  const entity_id = parseId<number>(ctx.params.entity_id);
  const photo_id = parseId<PhotoId>(ctx.params.photo_id);
  const input = entityPhotoInputSchema.parse({ entity_type, entity_id, photo_id });
  ctx.body = await photoService.addPhotoToEntity(input);
  ctx.status = httpStatus.OK;
});

router.delete('/:entity_type/:entity_id/:photo_id', async (ctx: Koa.Context) => {
  const entity_type = entityType.parse(ctx.params.entity_type);
  const entity_id = parseId<number>(ctx.params.entity_id);
  const photo_id = parseId<PhotoId>(ctx.params.photo_id);
  const input = entityPhotoInputSchema.parse({ entity_type, entity_id, photo_id });
  await photoService.removePhotoFromEntity(input)
  ctx.body = {};
  ctx.status = httpStatus.OK;
});

export default router;