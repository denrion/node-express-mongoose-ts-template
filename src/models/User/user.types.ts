import { Document, DocumentQuery, Model } from 'mongoose';
import Role from '../../constants/Role';

interface IUser {
  email: string;
  password: string;
  passwordConfirm: string;
  role?: Role;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  isActive?: boolean;
}

export interface IUserDocument extends IUser, Document {
  isCorrectPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
  signToken: (this: IUserDocument) => string;
  createPasswordResetToken: (this: IUserDocument) => string;
  isPasswordChangedAfter: (this: IUserDocument, JWTTimestamp: Date) => boolean;
}

export interface IUserModel extends Model<IUserDocument> {
  findByEmail: (
    this: IUserModel,
    email: string
  ) => DocumentQuery<IUserDocument | null, IUserDocument, {}>;
}

export interface ISignupUserInput {
  email: IUser['email'];
  password: IUser['password'];
  passwordConfirm: IUser['passwordConfirm'];
}

export interface ILoginCredentials {
  email: IUser['email'];
  password: IUser['password'];
}

export interface IForgottenPasswordInput {
  email: IUser['email'];
}

export interface IResetPasswordInput {
  password: IUser['password'];
  passwordConfirm: IUser['passwordConfirm'];
}

export interface IUpdateMyPasswordInput {
  oldPassword: IUser['password'];
  newPassword: IUser['password'];
  passwordConfirm: IUser['passwordConfirm'];
}
