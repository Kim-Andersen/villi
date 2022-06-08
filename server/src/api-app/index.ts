import HttpStatus from 'http-status';
import Koa from 'koa';
import json from 'koa-json';
import logger from 'koa-logger';
import Router from 'koa-router';
import db from '../database';
import { Place } from '../shared/types';
import { geocode } from './geocode';

const app = new Koa();
const router = new Router();

/** Middlewares */
app.use(logger());
app.use(json());

/** Routes */
app.use(router.routes()).use(router.allowedMethods());

router.get('/', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  ctx.body = { message: 'Welcome to the p API!' };
  ctx.status = HttpStatus.OK;
  await next();
});

router.get('/users', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  try {
    const res = await db.query('SELECT * FROM users')
    ctx.body = { users: res.rows };
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

router.get('/places', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  try {
    const res = await db.query('SELECT * FROM places');
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

router.post('/places', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  const place = <Place>ctx.request.body;
  const query = `
  INSERT INTO places(
    name, 
    description, 
    street_name, 
    street_number, 
    postal_code, 
    city, 
    point) 
  VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
  const params = [
    place.name,
    place.description,
    place.street_name,
    place.street_number,
    place.postal_code,
    place.city,
    `${place.point.lat}, ${place.point.lng}`
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

router.get('/geocode', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  const query = ctx.query['query'] as string;
  console.log('getcode query', query);

  const geocodeResults = await geocode(query);
  console.log('geocodeResults', geocodeResults);
  
  
  try {
    ctx.body = geocodeResults;
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

export const apiApp = app;