interface IAppConfig {
  port: string | number;
}

interface IDbConfig {
  host: string | undefined;
  port: string | number;
  name: string;
  username: string | undefined;
  password: string | undefined;
}

interface IEnvConfig {
  app: IAppConfig;
  db: IDbConfig;
}

interface IConfig {
  dev: IEnvConfig;
  prod: IEnvConfig;
}

const dev: IEnvConfig = {
  app: {
    port: process.env.DEV_APP_PORT || 3056,
  },
  db: {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || "dbDev",
    username: process.env.DEV_MONGODB_USERNAME,
    password: process.env.DEV_MONGODB_PASSWORD,
  },
};

const prod: IEnvConfig = {
  app: {
    port: process.env.PROD_APP_PORT || 3030,
  },
  db: {
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT || 27017,
    name: process.env.PROD_DB_NAME || "dbProd",
    username: process.env.PROD_MONGODB_USERNAME,
    password: process.env.PROD_MONGODB_PASSWORD,
  },
};

const config: IConfig = { dev, prod };
const env: string = process.env.NODE_ENV || "dev";
// @ts-ignore
export default config[env];
