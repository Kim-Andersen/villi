const config = {
  environment: getEnvVar('NODE_ENV') as 'development' | 'production' | 'test',
  google: {
    maps: {
      apiKey: getEnvVar('REACT_APP_GOOGLE_MAPS_API_KEY')
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
};

export default config;