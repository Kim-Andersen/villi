# Villi

## Server
### Server folder structure

```
server
  ├── deploy                    # Server production build to deploy to hosting environment
  ├── migrations                # Database migrations
  ├── seeds                     # Database seeds
  ├── public                    # Public server folder
  └── src
      ├── shared                # Symlinked folder pointing to shared/src in the root of the repo.
      ├── api-app               # API server app
      ├── web-app               # Web app
      ├── config                # Environment variables and configuration related stuff
      ├── queue                 # Queue tasks
      ├── jobs                  # Scheduled jobs
      ├── database              # Database stuff
      │   └── repositories      # Repositories handling queries
      ├── services              # Business logic 💼
      ├── uploads               # Uploaded files
      └── server.ts             # Server entry point
```

### Server scripts

- `npm run migrate [up|down]` runs database migrations.
- `npm run migrate seed` runs database seeds.

### Database
#### Seeds

Seeds are database queries that insert seed data.

Each seed is defiend in a `.sql` file in the `server/seeds` directory and must be added to `server/seeds/seeds.json` in order to get executed when running `npm run seed` in the `server` directory.

## Environement Variables
- `PORT`: server port.
- `DATABASE_URL`: Postgres database connection string.
- `GEOCODER_API_KEY`: used with the `node-geocoder` module.

Nodechef Object Storage credentials:
- `NC_OBJECT_STORAGE_KEY`
- `NC_OBJECT_STORAGE_SECRET_KEY`
- `NC_OBJECT_STORAGE_ENDPOINT`


### Travis CI

A `NC_DEPLOY_TOKEN` environment variable must be added to Travis environment variables.
This is used to [deploy builds to Nodechef](https://www.nodechef.com/docs/node/deploy).