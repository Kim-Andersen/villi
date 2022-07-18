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
      accessKey: getEnvVar('NC_OBJECT_STORAGE_ACCESS_KEY'),
      secretAccessKey: getEnvVar('NC_OBJECT_STORAGE_SECRET_KEY'),
      endpoint: getEnvVar('NC_OBJECT_STORAGE_ENDPOINT')
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