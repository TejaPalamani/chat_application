import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profile: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
    },
    userCreatedAt: {
      type: Date,
      immutable: true,
      default: Date.now,
    },
  },
  { Timestamp: true }
);

UserSchema.methods.validationFunction = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.createHashPassword = async function (originalPassword) {
  hashedpass = await bcrypt.hash(originalPassword, 10);
  this.password = hashedpass;
};

export const User = mongoose.model('User', UserSchema);
