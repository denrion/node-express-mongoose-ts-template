// Used as a middleware to set a body field equal
// to a user id pulled from the jwt token

import { RequestHandler } from 'express';

// e.g used to connect a current logged in user to a created resource
const setBodyFieldFromAuthUser = (fieldName: string = ''): RequestHandler => (req, res, next) => {
  if (!req.body[fieldName]) req.body[fieldName] = req.user.id;
  next();
};

export default setBodyFieldFromAuthUser;
