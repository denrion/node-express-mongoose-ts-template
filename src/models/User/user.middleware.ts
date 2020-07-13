import bcrypt from 'bcryptjs';
import { HookNextFunction } from 'mongoose';
import { IUserDocument } from './user.types';

// ******************* DOCUMENT MIDDLEWARE ****************** /
export async function hashPassword(this: IUserDocument, next: HookNextFunction) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
}

export function validatePasswordConfirm(
  this: IUserDocument & { passwordConfirm: string },
  next: HookNextFunction
) {
  if (!this.passwordConfirm)
    this.invalidate('passwordConfirm', 'Please provide a password confirmation');
  else if (this.passwordConfirm.length < 8)
    this.invalidate('passwordConfirm', 'Password must contain at least 8 characters');
  else if (this.passwordConfirm.length > 50)
    this.invalidate('passwordConfirm', 'Password must not contain more than 50 characters');
  else if (!this.passwordConfirm.match(/^[a-zA-Z0-9]+(?:[_-]?[a-zA-Z0-9])*$/)) {
    this.invalidate(
      'passwordConfirm',
      'Password can only contain letters, numbers, underscores and dashes'
    );
  } else if (this.password !== this.passwordConfirm) {
    this.invalidate('passwordConfirm', 'Passwords do not match');
  }

  next();
}

export function updatePaswordChangedAt(this: IUserDocument, next: HookNextFunction) {
  if (!this.isModified('password') || this.isNew) return next();

  // Add -1000, because saving to DB is sometimes slower than sending JWT
  this.passwordChangedAt = new Date(Date.now() - 1000);

  next();
}

// ******************** QUERY MIDDLEWARE ******************* //

// **************** AGGREGATION MIDDLEWARE **************** //
