import status from 'http-status';
import AppError from './AppError';

class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, status.UNAUTHORIZED);
  }
}

export default UnauthorizedError;
