# Villi
## Travis CI

A `NC_DEPLOY_TOKEN` environment variable must be added to Travis environment variables.
This is used to [deploy builds to Nodechef](https://www.nodechef.com/docs/node/deploy).

## Database

### Seeds

Seeds are database queries that insert data.
Each seed is defiend in a `.sql` file in the `server/seeds` directory.

`server/seeds/seeds.json` defines which seeds to execute when running `npm run seed` in the `server` directory.