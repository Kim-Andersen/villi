import 'dotenv/config';
import { join, normalize } from 'path';

export default {
  server: {
    port: Number(getEnvVar('PORT')),
    host: getEnvVar('HOST'),
  },
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
  },
  email: {
    host: getEnvVar('EMAIL_HOST'),
    port: Number(getEnvVar('EMAIL_PORT')),
    user: getEnvVar('EMAIL_USER'),
    password: getEnvVar('EMAIL_PASSWORD'),
  },
  auth: {
    jwtSecretKey: getEnvVar('JWT_SECRET_KEY')
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