import status from 'http-status';
import AppError from './AppError';

class NotImplementedError extends AppError {
  constructor(message: string) {
    super(message, status.NOT_IMPLEMENTED);
  }
}

export default NotImplementedError;
