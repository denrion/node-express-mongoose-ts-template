import { model } from 'mongoose';
import UserSchema from './user.schema';
import { IUserDocument, IUserModel } from './user.types';

const User = model<IUserDocument, IUserModel>('User', UserSchema);

export default User;
