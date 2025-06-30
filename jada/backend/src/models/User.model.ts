import mongoose, { Schema, Document } from 'mongoose';

export interface UserInterface extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin'; 
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<UserInterface>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, 
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);


export const UserModel = mongoose.model<UserInterface>('User', UserSchema);