import status from 'http-status';
import AppError from './AppError';

class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, status.FORBIDDEN);
  }
}

export default ForbiddenError;
