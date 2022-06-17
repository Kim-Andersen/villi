# Villi server

## Environement Variables
- `PORT`: server port.
- `DATABASE_URL`: Postgres database connection string.
- `GEOCODER_API_KEY`: used with the `node-geocoder` module.

Nodechef Object Storage credentials:
- `NC_OBJECT_STORAGE_KEY`
- `NC_OBJECT_STORAGE_SECRET_KEY`
- `NC_OBJECT_STORAGE_ENDPOINT`

## Scripts

- `npm run migrate up` will run any database migrations.