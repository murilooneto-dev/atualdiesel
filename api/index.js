import { createApp } from '../backend/dist/create-app.js';

let cachedExpressApp;

async function getExpressApp() {
  if (!cachedExpressApp) {
    const app = await createApp();
    await app.init();
    cachedExpressApp = app.getHttpAdapter().getInstance();
  }
  return cachedExpressApp;
}

export default async function handler(req, res) {
  const expressApp = await getExpressApp();
  expressApp(req, res);
}
