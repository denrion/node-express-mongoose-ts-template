import status from 'http-status';
import AppError from './AppError';

class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, status.INTERNAL_SERVER_ERROR);
  }
}

export default InternalServerError;
