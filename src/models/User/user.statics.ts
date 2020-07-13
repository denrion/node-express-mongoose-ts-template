import { IUserModel } from './user.types';

export function findByEmail(this: IUserModel, email: string) {
  return this.findOne({ email });
}

// export function findByUsername(this: IUserModel, username: string) {
//   return this.findOne({ username });
// }
