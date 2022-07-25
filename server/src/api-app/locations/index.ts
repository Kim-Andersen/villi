import debug from 'debug';
import httpStatus from 'http-status';
import Koa from 'koa';
import Router from 'koa-router';
import { pick } from 'lodash';
import { locationService, photoService } from '../../services';
import { entityPhotoInputSchema, LocationId, locationInputSchema, LocationSearch, locationSearchSchema, parseId, PhotoId } from '../../shared';

const log = debug('/locations');

const router = new Router({
  prefix: '/locations'
});

router.get('/', async (ctx: Koa.Context) => { 
  const search: LocationSearch = await locationSearchSchema.parse(pick(ctx.query, [
    'id',
    'name', 
    'description', 
    'street_name', 
    'street_number', 
    'postal_code', 
    'city', 
    'country'
  ]));
  log('get locations', { search });
  ctx.body = await locationService.findLocations(search);
  ctx.status = httpStatus.CREATED;
});

router.post('/', async (ctx: Koa.Context) => {
  const input = await locationInputSchema.parseAsync(ctx.request.body);
  log('create location', { input });
  ctx.body = await locationService.createLocation(input);
  ctx.status = httpStatus.CREATED;
});

router.put('/:locationId', async (ctx: Koa.Context) => {
  const locationId = parseId<LocationId>(ctx.params.locationId);
  const input = await locationInputSchema.parseAsync(ctx.request.body);
  log('update location', { input });
  ctx.body = await locationService.updateLocation(locationId, input);
  ctx.status = httpStatus.CREATED;
});

router.get('/:locationId', async (ctx: Koa.Context) => {
  const locationId = parseId<LocationId>(ctx.params.locationId);
  log('get location', { locationId });
  const location = await locationService.getLocationById(locationId);
  if (location) {
    ctx.body = location;
    ctx.status = httpStatus.OK;
  } else {
    ctx.body = {};
    ctx.status = httpStatus.NOT_FOUND;
  }
});

router.delete('/:locationId', async (ctx: Koa.Context) => {
  const locationId = parseId<LocationId>(ctx.params.locationId);
  log('delete location', { locationId });
  await locationService.deleteLocation(locationId);
  ctx.body = {};
  ctx.status = httpStatus.OK;
});

router.get('/:locationId/photos', async (ctx: Koa.Context) => {
  const locationId = parseId<LocationId>(ctx.params.locationId);
  log('get location photos', { locationId });

  ctx.body = await photoService.findAllLocationPhotos(locationId);
  ctx.status = httpStatus.OK;
});

router.post('/:locationId/photos/:photoId', async (ctx: Koa.Context) => {
  const input = entityPhotoInputSchema.parse({ 
    location_id: parseId<LocationId>(ctx.params.locationId),
    photo_id: parseId<PhotoId>(ctx.params.photoId)
  });
  log('add vendor photo', { input });

  ctx.body = await photoService.addPhotoToEntity(input);
  ctx.status = httpStatus.OK;
});

router.delete('/:locationId/photos/photoId', async (ctx: Koa.Context) => {
  const input = entityPhotoInputSchema.parse({ 
    location_id: parseId<LocationId>(ctx.params.locationId),
    photo_id: parseId<PhotoId>(ctx.params.photoId)
  });
  log('remove vendor photo', { input });

  await photoService.removePhotoFromEntity(input);
  ctx.body = {};
  ctx.status = httpStatus.OK;
});

export default router;