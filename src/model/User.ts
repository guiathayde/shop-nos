/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcryptjs';
import { Document, Schema, model } from 'mongoose';
import validator from 'validator';

const { isEmail } = validator;

interface User extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  validatePassword(password: string): Promise<boolean>;
}

const schema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      validate: [isEmail, 'invalid email'],
      index: { unique: true },
    },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  {
    versionKey: false,
  },
);

schema.pre<User>('save', async function save(next) {
  const user = this as User;

  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(8);
    user.password = await bcrypt.hash(user.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

schema.methods.validatePassword = async function validatePassword(
  pass: string,
) {
  return bcrypt.compare(pass, this.password);
};

export const UserModel = model<User>('users', schema);
