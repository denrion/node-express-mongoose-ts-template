import { IUserDocument } from '../../models/User/user.types';

declare module 'express-serve-static-core' {
  export interface Request {
    user: IUserDocument;
    dbFilter: { [key: string]: string };
  }
}
