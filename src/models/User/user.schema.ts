import mongoose from 'mongoose';
import Role from '../../constants/Role';
import sanitizeMongooseFields from '../../utils/mongoose/sanitizeMongooseFields';
import sanitizeSpecifiedFields from '../../utils/mongoose/sanitizeSpecifiedFields';
import {
  createPasswordResetToken,
  isCorrectPassword,
  isPasswordChangedAfter,
  signToken,
} from './user.methods';
import { hashPassword, updatePaswordChangedAt, validatePasswordConfirm } from './user.middleware';
import { findByEmail } from './user.statics';
import { IUserDocument } from './user.types';

const UserSchema = new mongoose.Schema(
  {
    // username: {
    //   type: String,
    //   required: [true, 'This field is required'],
    //   unique: true,
    //   trim: true,
    //   lowercase: true,
    //   minlength: [2, 'Username must contain at least 2 characters'],
    //   maxlength: [30, 'Username must not contain more than 30 characters'],
    //   match: [
    //     /^[a-zA-Z0-9]+(?:[_-]?[a-zA-Z0-9])*$/,
    //     'Username can only contain letters, numbers, underscores and dashes',
    //   ],
    // },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
      required: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must contain at least 8 characters'],
      maxlength: [50, 'Password must not contain more than 50 characters'],
      match: [
        /^[a-zA-Z0-9]+(?:[_-]?[a-zA-Z0-9])*$/,
        'Password can only contain letters, numbers, underscores and dashes',
      ],
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
  }
);

// ************************ VIRTUALS ************************ // - add types to schema
UserSchema.virtual('passwordConfirm')
  .get(function (this: IUserDocument & { _passwordConfirm: string }) {
    return this._passwordConfirm;
  })
  .set(function (this: IUserDocument & { _passwordConfirm: string }, value: string) {
    this._passwordConfirm = value;
  });

// ******************* DOCUMENT MIDDLEWARE ****************** //
UserSchema.pre('save', hashPassword);
UserSchema.pre('validate', validatePasswordConfirm);
UserSchema.pre('save', updatePaswordChangedAt);

// ******************** QUERY MIDDLEWARE ******************* //

// **************** AGGREGATION MIDDLEWARE **************** //

// ******************* INSTANCE METHONDS ******************* //
UserSchema.methods.isCorrectPassword = isCorrectPassword;
UserSchema.methods.signToken = signToken;
UserSchema.methods.isPasswordChangedAfter = isPasswordChangedAfter;
UserSchema.methods.createPasswordResetToken = createPasswordResetToken;

// ******************** STATIC METHODS ******************** //
UserSchema.statics.findByEmail = findByEmail;
// UserSchema.statics.findByUsername = findByUsername;

// ************************ PLUGINS *********************** //
UserSchema.plugin(sanitizeMongooseFields);
UserSchema.plugin(sanitizeSpecifiedFields, [
  'password',
  'passwordConfirm',
  'passwordChangedAt',
  'passwordResetToken',
  'passwordResetExpires',
  'isActive',
]);

export default UserSchema;
