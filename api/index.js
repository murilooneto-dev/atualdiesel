import serverless from 'serverless-http';
import { createApp } from '../backend/dist/create-app.js';

let cachedHandler;

async function getHandler() {
  if (!cachedHandler) {
    console.log('[DIAG] getHandler: calling createApp()');
    const app = await createApp();
    console.log('[DIAG] getHandler: createApp() resolved, calling app.init()');
    await app.init();
    console.log('[DIAG] getHandler: app.init() resolved, wrapping with serverless-http');
    cachedHandler = serverless(app.getHttpAdapter().getInstance());
    console.log('[DIAG] getHandler: serverless-http wrap complete');
  }
  return cachedHandler;
}

export default async function handler(req, res) {
  console.log('[DIAG] handler: invoked for', req.method, req.url);
  const serverlessHandler = await getHandler();
  console.log('[DIAG] handler: got serverlessHandler, invoking it');
  const result = await serverlessHandler(req, res);
  console.log('[DIAG] handler: serverlessHandler resolved');
  return result;
}
