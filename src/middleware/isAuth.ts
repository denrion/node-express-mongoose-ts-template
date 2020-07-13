import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import JWTTokenPayload from '../@types/JWTTokenPayload';
import { JWT_SECRET } from '../constants/ENV';
import User from '../models/User/user.model';
import catchAsync from '../utils/catchAsync';
import UnauthorizedError from '../utils/errors/UnauthorizedError';

const isAuth = catchAsync(async (req, res, next) => {
  const token = getTokenFromAuthHeader(req) || getTokenFromCookie(req);

  if (!token) return next(new UnauthorizedError('Not authenticated. Please log in to get access'));

  const decoded = (await promisify(jwt.verify)(token, JWT_SECRET)) as JWTTokenPayload;

  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(new UnauthorizedError('The user, to whom this token belongs, no longer exists.'));

  // Check if user changed password after the token was issued
  if (currentUser.isPasswordChangedAfter(decoded.iat))
    return next(new UnauthorizedError('The password was recently changed! Please log in again.'));

  // place current user on the request object
  req.user = currentUser;

  // GRANT ACCESS TO THE PROTECTED ROUTE
  next();
});

const getTokenFromAuthHeader = (req: Request) => {
  return req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : undefined;
};

const getTokenFromCookie = (req: Request) => req.cookies.jwt;

export default isAuth;
