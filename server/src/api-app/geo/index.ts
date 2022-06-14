import HttpStatus from 'http-status';
import Koa from 'koa';
import Router from 'koa-router';
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

  return fetch(`https://api.locationiq.com/v1/autocomplete.php?${params}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then((results: LocationIQAutocompleteResult[]) => {
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
});

router.get('/code', async (ctx: Koa.Context, next: () => Promise<unknown>) => {
  const query = ctx.query['query'] as string;
  const geocodeResults = await geocode(query);
  
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

export default router;