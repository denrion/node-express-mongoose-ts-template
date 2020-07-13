import { RequestHandler } from 'express';

enum FILTER_TYPE {
  REQ_PARAMS = 'params',
  REQ_USER = 'user',
}

// Used as a middelware to filter db results
// Use FILTER_TYPE.REQ_PARAMS when getting results connected to the resource id specified as a path variable
// Use FILTER_TYPE.REQ_USER for filtering results connected to the currently logged in user
// it sets the filter on req.dbFilter field which is later accessed in the handlerFactory.getAll function
const setFindFilterFromRequest = (
  fieldToSet: string = '',
  reqField: FILTER_TYPE = FILTER_TYPE.REQ_PARAMS,
  key: string = ''
): RequestHandler => (req, res, next) => {
  // @ts-ignore
  const value = req[reqField][key];
  req.dbFilter = value ? { [fieldToSet]: value } : {};

  next();
};

export default setFindFilterFromRequest;
