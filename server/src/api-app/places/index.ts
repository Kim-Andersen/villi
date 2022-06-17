import httpStatus from 'http-status';
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import { uniq } from 'lodash';
import db from '../../database';
import { Place, PlaceCreation, PlaceUpdate } from '../../shared/types';
import photoService from './photoService';
import { validatePlaceCreation, validatePlaceUpdate } from './schemas';

function sanitizePlaceId(placeId: string): number {
  return Number(placeId);
}

const router = new Router({
  prefix: '/places'
});

router.get('/', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  try {
    const res = await db.query(`SELECT *, ST_AsGeoJSON(location)::json->'coordinates' as coordinates FROM places ORDER BY id ASC`);
    ctx.body = { places: res.rows };
    ctx.status = httpStatus.OK;
    await next();
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    } else {
      console.log(err);
    }
  }
});

router.post('/', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  const placeCreation = <Partial<Place>>ctx.request.body as PlaceCreation;

  const valid = validatePlaceCreation(placeCreation);
  if (!valid) {
    ctx.status = httpStatus.BAD_REQUEST;
    ctx.body = validatePlaceCreation.errors;
    return await next();
  }

  const query = `
    INSERT INTO places(name,description,street_name,street_number,postal_code,city,location)
    VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
  const { name, description, street_name, street_number, postal_code, city, coordinates } = placeCreation;
  const params = [
    name ?? 'New place',
    description ?? '',
    street_name ?? '',
    street_number ?? '0',
    postal_code ?? '',
    city ?? '',
    coordinates ? `POINT(${coordinates[0]} ${coordinates[1]})` : `POINT(46.5281434 6.6089567)`
  ];

  try {
    const result = await db.query(query, params);
    ctx.body = result.rows[0];
    ctx.status = httpStatus.CREATED;
  } catch (err) {
    if (err instanceof Error) {
      ctx.body = { error: err.stack };
      console.log(err.stack);
    } else {
      console.log(err);
      ctx.body = { error: err };
    }
  }
  
  await next();
});

router.put('/:placeId', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  const placeId = sanitizePlaceId(ctx.params.placeId);
  const placeUpdate = ctx.request.body.place as PlaceUpdate;

  const valid = validatePlaceUpdate(placeUpdate);
  if (!valid) {
    ctx.status = httpStatus.BAD_REQUEST;
    ctx.body = validatePlaceUpdate.errors;
    return await next();
  }

  const columnValues: Array<{ column: keyof PlaceUpdate | 'location', value: string }> = [];
  columnValues.push({ column: 'name', value: placeUpdate.name });
  columnValues.push({ column: 'description', value: placeUpdate.description });
  columnValues.push({ column: 'street_name', value: placeUpdate.street_name });
  columnValues.push({ column: 'street_number', value: placeUpdate.street_number });
  columnValues.push({ column: 'postal_code', value: placeUpdate.postal_code });
  columnValues.push({ column: 'city', value: placeUpdate.city });
  if (placeUpdate.coordinates) {
    columnValues.push({ column: 'location', value: `POINT(${placeUpdate.coordinates[0]} ${placeUpdate.coordinates[1]})` });
  }

  const sets = columnValues.map((x, index) => `"${x.column}"=$${index+1}`).join(',');
  const params = columnValues.map(x => x.value);
  const query = `UPDATE places SET ${sets}, "updated_at"=NOW() WHERE id = ${placeId}`;

  console.log('query', query);
  console.log('params', params);
  
  await db.query(query, params);
  
  ctx.body = placeUpdate;
  ctx.status = httpStatus.OK;
  await next();
});

router.delete('/:placeId', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  const placeId = sanitizePlaceId(ctx.params.placeId);

  try {
    const result = await db.query(`DELETE FROM places WHERE id = ${placeId}`);
    if (result.rowCount === 1) {
      ctx.status = httpStatus.OK;
      ctx.body = { status: httpStatus.OK, message: `Place id ${placeId} was deleted.` };
    } else {
      ctx.status = httpStatus.NOT_FOUND;
      ctx.body = { status: httpStatus.NOT_FOUND, message: `Place id ${placeId} not found.` };
    }
  } catch (err) {
    console.log(`Failed to delete place id ${placeId}`, err);
    ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
  }
  await next();
});

/**
 * Add photos to a place.
 */
router.post(
  '/:placeId/photos', 
  koaBody({ multipart: true, formidable: { uploadDir: './uploads' } }), 
  async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  const placeId = sanitizePlaceId(ctx.params.placeId);

  if (ctx.request.files === undefined || ctx.request.files.file === undefined) {
    ctx.status = httpStatus.BAD_REQUEST;
    ctx.body = { error: { message: 'No file found.' } };
    return await next();  
  };

  const filePath = (ctx.request.files.file as any).filepath;
  const contentType = (ctx.request.files.file as any).mimetype;

  try {
    const photo = await photoService.addPhoto({ bucket: 'villi-photos', filePath, contentType, sizes: ['sm', 'md'] });
    await db.query(`INSERT INTO place_photos(place_id, photo_id) VALUES($1,$2)`, [placeId, photo.id])
    ctx.status = httpStatus.OK;
    ctx.body = photo;
  } catch (error) {
    console.log(`Failed to add photo to place id ${placeId}`, error);
    ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
  }

  await next();
});

router.get('/:placeId/photos', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  const placeId = sanitizePlaceId(ctx.params.placeId);
  const query = `
    select p.id, p.created_at, p.key, p.bucket, p.type, to_json(p.sizes) as sizes
    from photos p inner join place_photos pp on pp.photo_id = p.id 
    where pp.place_id = ${placeId}`;
  const result = await db.query(query);

  ctx.body = result.rows;
  ctx.status = httpStatus.OK;
  await next();
});

router.delete('/:placeId/photos/:photoId', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  // const placeId = sanitizePlaceId(ctx.params.placeId);
  const photoId = Number(ctx.params.photoId);
  const deleted = await photoService.deletePhoto(photoId);

  if (deleted) {
    ctx.status = httpStatus.OK;
  } else {
    ctx.status = httpStatus.NOT_FOUND;
  }
  ctx.body = {};
  await next();
});

router.get('/:placeId/types', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  const placeId = sanitizePlaceId(ctx.params.placeId);

  const query = `
    SELECT top.id
    FROM types_of_places top INNER JOIN place_types pt on pt.type_id = top.id 
    WHERE pt.place_id = ${placeId}`;
  const result = await db.query(query);
  ctx.body = result.rows;
  ctx.status = httpStatus.OK;
  await next();
});

router.post('/:placeId/types', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  const placeId = sanitizePlaceId(ctx.params.placeId);
  const types = uniq(ctx.request.body.types) as number[];

  await db.transaction([
    {
      query: `DELETE FROM place_types WHERE place_id = ${placeId}`
    },
    {
      query: `INSERT INTO place_types (place_id, type_id) VALUES ${types.map(id => `(${placeId}, ${id})`)}`
    }
  ])

  ctx.body = {};
  ctx.status = httpStatus.OK;
  await next();
});

export default router;