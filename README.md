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
| Name | Description |
| -------- | ----------- |
| `PORT`   | Server port |
| `HOST`   | Server host (ex "http://villi-4983.nodechef.com" or http://localhost") |
| `DATABASE_URL`   | Postgres database connection string |
| `NC_OBJECT_STORAGE_ACCESS_KEY` | Nodechef Object Storage access key |
| `NC_OBJECT_STORAGE_SECRET_KEY` | Nodechef Object Storage secret key |
| `NC_OBJECT_STORAGE_ENDPOINT` | Nodechef Object Storage endpoint |
| `JWT_SECRET_KEY` | |
| `EMAIL_HOST` | |
| `EMAIL_PORT` | |
| `EMAIL_USER` | |
| `EMAIL_PASSWORD` | |

### Travis CI

A `NC_DEPLOY_TOKEN` environment variable must be added to Travis environment variables.
This is used to [deploy builds to Nodechef](https://www.nodechef.com/docs/node/deploy).

## Sending mails in development
[Ethereal](https://ethereal.email/) allows us to send mails as normal. However they are never delivered but instead available as [messages at Ethereal](https://ethereal.email/messages).

The credentials for logging into Ethereal are defined in the `EMAIL_USER` and `EMAIL_PASSWORD` enviroment variables in the `.env` file.

## Admin app

### Proxy

In order to be able to do `fetch(/api/places)` and because the development server API is running on a different port,
the `proxy` field in the `package.json` file proxies such requests to the correct port:

```json
"proxy": "http://localhost:3001"
```

Learn more:
https://create-react-app.dev/docs/proxying-api-requests-in-development/




