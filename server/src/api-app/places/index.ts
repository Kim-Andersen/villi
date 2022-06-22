import httpStatus from 'http-status';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import config from '../../config';
import { placePhotosRepo, placesRepo, placeTypesRepo } from '../../database/repositories';
import { BadRequestError } from '../../errors';
import { placeSearchService, placeService } from '../../services';
import { Location, PlaceCreation, PlaceUpdate, TypeOfPlaceId } from '../../shared/types';
import { parsePhotoId, parsePlaceId } from '../utils/parsers';
import { validatePlaceCreation, validatePlaceTypesUpdate, validatePlaceUpdate } from './schemas';

const commaSeparatedCoordinatesRegex = new RegExp(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/);

const router = new Router({
  prefix: '/places'
});

/**
 * Search nearby places.
 * 
 * Ex: Search places near latitude 46.53288741 and longitude 6.612212468, within a radius of 1000 meters:
 * /places/nearbysearch?location=46.53288741,6.612212468&radius=1000
 */
router.get('/nearbysearch', async (ctx: Koa.Context) => {
  // Validate "location" query parameter.
  if (!commaSeparatedCoordinatesRegex.test((String(ctx.query.location)))) {
    ctx.throw(new BadRequestError(`Missing or invalid location parameter ${ctx.query.location}. Required format: location=[latitude],[longitude].`));
  }

  // Validate location "radius" parameter.
  const radius = Number(ctx.query.radius);
  if (isNaN(radius) || radius < 1000 || radius > 50000) {
    ctx.throw(new BadRequestError(`Missing or invalid radius parameter ${ctx.query.radius}. Must be an integer between 1000 and 50000.`));
  }
  
  ctx.assert(typeof ctx.query.location === 'string');
  ctx.assert(typeof radius === 'number');

  const latLng = ctx.query.location.split(',');
  const location: Location = {
    latitude: Number.parseFloat(latLng[0]),
    longitude: Number.parseFloat(latLng[1])
  };
  

  ctx.body = await placeSearchService.nearby(location, radius);
  ctx.status = httpStatus.OK;
});

router.get('/', async (ctx: Koa.Context) => {
  ctx.body = await placesRepo.findPlaces();
  ctx.status = httpStatus.OK;
});

router.post('/', async (ctx: Koa.Context, next: Koa.Next) => {
  const placeCreation = ctx.request.body.place as PlaceCreation;
  
  if (!validatePlaceCreation(placeCreation)) {
    ctx.throw(new BadRequestError('Missing or invalid values', { validationErrors: validatePlaceCreation.errors }));
  }

  ctx.body = await placeService.create(placeCreation);
  ctx.status = httpStatus.CREATED;
});

router.put('/:placeId', async (ctx: Koa.Context) => {
  const placeUpdate = ctx.request.body.place as PlaceUpdate;

  if (!validatePlaceUpdate(placeUpdate)) {
    ctx.throw(new BadRequestError('Place update error', { validationErrors: validatePlaceUpdate.errors }));
  }

  ctx.body = await placeService.update(placeUpdate);
  ctx.status = httpStatus.OK;
});

router.delete('/:placeId', async (ctx: Koa.Context) => {
  await placeService.delete(parsePlaceId(ctx.params.placeId));
  ctx.status = httpStatus.OK;  
  ctx.body = {};
});

router.post(
  '/:placeId/photos', 
  koaBody({ multipart: true, formidable: { uploadDir: config.uploadDir } }), 
  async (ctx: Koa.Context) => {
  const placeId = parsePlaceId(ctx.params.placeId);

  if (ctx.request.files === undefined || ctx.request.files.file === undefined) {
    ctx.throw(new BadRequestError('No file in request'));
  };

  const filePath = (ctx.request.files.file as any).filepath;
  const contentType = (ctx.request.files.file as any).mimetype;

  ctx.body = await placeService.addPhoto(placeId, filePath, contentType);
  ctx.status = httpStatus.OK;
});

router.get('/:placeId/photos', async (ctx: Koa.Context) => {
  ctx.body = await placePhotosRepo.findForPlace(parsePlaceId(ctx.params.placeId));
  ctx.status = httpStatus.OK;
});

router.delete('/:placeId/photos/:photoId', async (ctx: Koa.Context) => {
  ctx.body = await placeService.deletePhoto(parsePlaceId(ctx.params.placeId), parsePhotoId(ctx.params.photoId));
  ctx.status = httpStatus.OK;
});

router.get('/:placeId/types', async (ctx: Koa.Context) => {
  ctx.body = await placeTypesRepo.findByPlace(parsePlaceId(ctx.params.placeId));
  ctx.status = httpStatus.OK;
});

router.put('/:placeId/types', async (ctx: Koa.Context) => {
  if (!validatePlaceTypesUpdate(ctx.request.body)) {
    throw new BadRequestError('Place update error', { validationErrors: validatePlaceTypesUpdate.errors });
  }
  
  const types = ctx.request.body.types as TypeOfPlaceId[];
  await placeTypesRepo.upsertForPlace(parsePlaceId(ctx.params.placeId), types);
  
  ctx.status = httpStatus.OK;
  ctx.body = {};
});

router.get('/types', async (ctx: Koa.Context) => {
  ctx.body = await placeTypesRepo.find();
  ctx.status = httpStatus.OK;
});

export default router;