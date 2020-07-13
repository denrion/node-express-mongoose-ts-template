import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../../constants/ENV';
import { IUserDocument } from './user.types';

export const isCorrectPassword = async (candidatePassword: string, userPassword: string) =>
  await bcrypt.compare(candidatePassword, userPassword);

export function signToken(this: IUserDocument) {
  return jwt.sign({ id: this.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Check if password was changed after the JWT token was sent
export function isPasswordChangedAfter(this: IUserDocument, JWTTimestamp: Date) {
  if (this.passwordChangedAt) {
    const changedTimestamp = +this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < new Date(changedTimestamp);
  }

  return false;
}

export function createPasswordResetToken(this: IUserDocument) {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  return resetToken;
}
