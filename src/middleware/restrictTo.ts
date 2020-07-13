import { RequestHandler } from 'express';
import Role from '../constants/Role';
import ForbiddenError from '../utils/errors/ForbiddenError';

const restictTo = (...roles: Role[]): RequestHandler => (req, res, next) => {
  return !roles.includes(req.user.role!)
    ? next(new ForbiddenError('You do not have permission to perform this action'))
    : next();
};

export default restictTo;
