type EnvironmentVariable = 'PORT' | 'DATABASE_URL';

export const getEnvVar = (name: EnvironmentVariable): string => {
  if (process.env[name]) {
    return process.env[name] as string;
  } else {
    console.error(`Undefiend process environement variable: "${name}"`);
    process.exit(1);
  }
}