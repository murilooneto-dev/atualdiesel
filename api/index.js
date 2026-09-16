import serverless from 'serverless-http';
import { createApp } from '../backend/dist/create-app.js';

let cachedHandler;

async function getHandler() {
  if (!cachedHandler) {
    const app = await createApp();
    await app.init();
    cachedHandler = serverless(app.getHttpAdapter().getInstance());
  }
  return cachedHandler;
}

export default async function handler(req, res) {
  const serverlessHandler = await getHandler();
  return serverlessHandler(req, res);
}
