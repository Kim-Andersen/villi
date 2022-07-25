import debug from 'debug';
import httpStatus from 'http-status';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import config from '../../config';
import { photoService } from '../../services';

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

export default router;