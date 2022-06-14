import HttpStatus from 'http-status';
import Koa from 'koa';
import Router from 'koa-router';
import db from '../../database';
import { Place, PlaceCreation, PlaceUpdate } from '../../shared/types';
import { validatePlaceCreation, validatePlaceUpdate } from './schemas';

const router = new Router({
  prefix: '/places'
});

router.get('/', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  try {
    const res = await db.query(`SELECT *, ST_AsGeoJSON(location)::json->'coordinates' as coordinates FROM places ORDER BY id ASC`);
    ctx.body = { places: res.rows };
    ctx.status = HttpStatus.OK;
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
    ctx.status = HttpStatus.BAD_REQUEST;
    ctx.body = validatePlaceUpdate.errors;
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
    ctx.status = HttpStatus.CREATED;
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
  const placeId = Number(ctx.params.placeId);
  const placeUpdate = ctx.request.body.place as PlaceUpdate;

  const valid = validatePlaceUpdate(placeUpdate);
  if (!valid) {
    ctx.status = HttpStatus.BAD_REQUEST;
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
  ctx.status = HttpStatus.OK;
  await next();
});

router.delete('/:placeId', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  const placeId = Number(ctx.params.placeId);

  try {
    const result = await db.query(`DELETE FROM places WHERE id = ${placeId}`);
    if (result.rowCount === 1) {
      ctx.status = HttpStatus.OK;
      ctx.body = { status: HttpStatus.OK, message: `Place id ${placeId} was deleted.` };
    } else {
      ctx.status = HttpStatus.NOT_FOUND;
      ctx.body = { status: HttpStatus.NOT_FOUND, message: `Place id ${placeId} not found.` };
    }
  } catch (err) {
    console.log(`Failed to delete place id ${placeId}`, err);
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
  }
  await next();
});

export default router;