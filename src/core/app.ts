import express, { Application } from 'express';
import setupCommonMiddleware from './setupCommonMiddleware';
import setupErrorMiddleware from './setupErrorMiddleware';
import setupRoutes from './setupRoutes';

const app: Application = express();

// Enable proxies to allow HTTPS over HEROKU
// app.enable('trust proxy');

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: process.env.BODY_PARSER_SIZE_LIMIT }));

// SETUP COMMON MIDDLEWARE FOR SECURITY, RATE LIMITING, DATA SANITIZATION
// PARAMETER POLUTION, COMPRESSION, CORS...
setupCommonMiddleware(app);

// SETUP EXPRESS ROUTES
setupRoutes(app);

// SETUP GLOBAL ERROR HANDLER
// AND CATCH ALL ROUTES HANDLER
setupErrorMiddleware(app);

export default app;
