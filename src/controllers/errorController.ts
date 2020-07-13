import colors from 'colors';
import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import ResponseStatus from '../constants/ResponseStatus';
import AppError from '../utils/errors/AppError';
import BadRequestError from '../utils/errors/BadRequestError';
import UnauthorizedError from '../utils/errors/UnauthorizedError';

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || status.INTERNAL_SERVER_ERROR;
  err.status = err.status || ResponseStatus.ERROR;

  let error = { ...err, message: err.message };

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    else if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    else if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    else if (err.name === 'JsonWebTokenError') error = handleJWTError();
    else if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  console.error(colors.red('ERROR 💥 %s'), err);

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      // Programming or other unknown error: don`t leak the error detals
    }

    // 1) Log error: for DEVS
    console.error(colors.red('ERROR 💥 %s'), err);

    // 2) Send generic message: for CLIENT
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      status: ResponseStatus.ERROR,
      message: 'Something went very wrong',
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }

  console.error(colors.red('ERROR 💥 %s'), err);

  // 2) Send generic message: for CLIENT
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Server error, please try again later',
  });
};

// Handle specific error functions
const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new BadRequestError(message);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new BadRequestError(message);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((error: any) => error.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new BadRequestError(message);
};

const handleJWTError = () => new UnauthorizedError('Invalid token. Please log in again.');

const handleJWTExpiredError = () =>
  new UnauthorizedError('JWT token expired. Please log in again.');

export default globalErrorHandler;
