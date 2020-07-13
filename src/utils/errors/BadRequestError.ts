import status from 'http-status';
import AppError from './AppError';

class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, status.BAD_REQUEST);
  }
}

export default BadRequestError;
