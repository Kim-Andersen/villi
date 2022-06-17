import httpStatus from 'http-status';
import Koa from 'koa';
import Router from 'koa-router';
import fetch from 'node-fetch';
import { envVar } from '../../environment';
import { GeoAutocompleteResult } from '../../shared/types';
import { geocode } from './geocode';
import { LocationIQAutocompleteResult } from './types';

const router = new Router({
  prefix: '/geo'
});

router.get('/autocomplete', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  const query = ctx.query['query'] as string;
  const params = new URLSearchParams({
    key: envVar('GEOCODER_API_KEY'),
    q: query,
  });
  const url = `https://api.locationiq.com/v1/autocomplete.php?${params}`;
  console.log('url', url);
  
  try {
    const results = await fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json() as Promise<LocationIQAutocompleteResult[]>;
        }
        throw response;
      })
      .then(results => {
        return results.map(r => ({
          name: r.address.name,
          street_name: r.address.road,
          street_number: r.address.house_number,
          city: r.address.city,
          state: r.address.state,
          postal_code: r.address.postcode,
          country: r.address.country,
          coordinates: [Number(r.lat), Number(r.lon)]
        } as GeoAutocompleteResult))
      });
    ctx.body = results;
    ctx.status = httpStatus.OK
  } catch(error) {
    console.log(`Geo autocomplete request failed`, error);
    ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
  }

  await next();
});

router.get('/code', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  const query = ctx.query['query'] as string;
  const geocodeResults = await geocode(query);
  
  try {
    ctx.body = geocodeResults;
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

export default router;