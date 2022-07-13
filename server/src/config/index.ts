import 'dotenv/config';
import { join, normalize } from 'path';

export default {
  port: Number(getEnvVar('PORT')),
  publicDir: normalize(join(__dirname, '..', 'public')),
  uploadDir: normalize(join(__dirname, '..', 'uploads')),
  postgres: {
    connectionString: getEnvVar('DATABASE_URL')
  },
  nodechef: {
    objectStorage: {
      accessKey: getEnvVar('NC_OBJECT_STORAGE_KEY'),
      secretAccessKey: getEnvVar('NC_OBJECT_STORAGE_SECRET_KEY'),
      endpoint: getEnvVar('NC_OBJECT_STORAGE_ENDPOINT'),
      region: 'eu-west-1'
    }
  },
  locationiq: {
    apiKey: getEnvVar('LOCATIONIQ_API_KEY')
  },
  google: {
    maps: {
      apiKey: getEnvVar('GOOGLE_MAPS_API_KEY')
    }
  }
};

function getEnvVar(name: string): string {
  if (process.env[name]) {
    return process.env[name] as string;
  } else {
    console.error(`Missing required environement variable: "${name}"`);
    process.exit(1);
  }
}