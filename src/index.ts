import * as dotenv from 'dotenv';
import * as assetsServer from './contentServer';
import * as factory from './pictureFactory';
import * as server from './server';

dotenv.config();

const PAGE_LENGTH = Number(process.env.PAGE_LENGTH);
const PORT = Number(process.env.PORT);
const WIDTH = Number(process.env.WIDTH);
const HEIGHT = Number(process.env.HEIGHT);
const ASSETS_SERVER_URL = process.env.ASSETS_SERVER_URL!;
const ASSETS_SERVER_PORT = Number(process.env.ASSETS_SERVER_PORT);

const main = async () => {
  await factory.init(PAGE_LENGTH, {
    viewport: { width: WIDTH, height: HEIGHT }
  });
  assetsServer.run(ASSETS_SERVER_PORT);
  server.run(PORT, ASSETS_SERVER_URL);
};

main();
