type EnvironmentVariable = 'PORT' | 'DATABASE_URL' | 'GEOCODER_API_KEY';

export const envVar = (name: EnvironmentVariable): string => {
  if (process.env[name]) {
    return process.env[name] as string;
  } else {
    console.error(`Undefiend process environement variable: "${name}"`);
    process.exit(1);
  }
}