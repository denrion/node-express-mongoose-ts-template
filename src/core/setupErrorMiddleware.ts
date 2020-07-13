import { Application } from 'express';
import globalErrorHandler from '../controllers/errorController';
import NotImplementedError from '../utils/errors/NotImplementedError';

const setupErrorMiddleware = (app: Application) => {
  app.all('*', (req, res, next) => {
    next(new NotImplementedError(`Cannot find ${req.originalUrl} on this server!`));
  });

  app.use(globalErrorHandler);
};

export default setupErrorMiddleware;
