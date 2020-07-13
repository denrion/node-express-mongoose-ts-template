import { RequestHandler } from 'express';
import { Params, ParamsDictionary } from 'express-serve-static-core';

//  returns RequestHandler<any> because
// typescript complains about types not matching in userRotues
// only happens if using route(param) and chaining methods
// works on get('/:id') and similar methods
const catchAsync = <P extends Params = ParamsDictionary>(
  fn: RequestHandler<P>
): RequestHandler<any> => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
