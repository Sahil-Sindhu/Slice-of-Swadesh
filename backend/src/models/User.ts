import { Schema, model, Document } from 'mongoose';
import { hashPassword, comparePassword } from '../utils/password';

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  name: string;
  role: 'customer' | 'admin' | 'chef' | 'manager' | 'cashier' | 'delivery' | 'superadmin';
  phoneNumber?: string;
  avatar?: string;
  loyaltyPoints: number;
  isEmailVerified: boolean;
  oauthProvider: 'local' | 'google';
  addresses: Array<{
    label: 'Home' | 'Office' | 'Other';
    street: string;
    city: string;
    zipCode: string;
    isDefault: boolean;
  }>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  passwordHash: { type: String },
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ['customer', 'admin', 'chef', 'manager', 'cashier', 'delivery', 'superadmin'],
    default: 'customer',
  },
  phoneNumber: { type: String, trim: true },
  avatar: { type: String },
  loyaltyPoints: { type: Number, default: 0 },
  isEmailVerified: { type: Boolean, default: false },
  oauthProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  isDeleted: { type: Boolean, default: false },
  addresses: [{
    label: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' },
    street: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  }],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, {
  timestamps: true,
});

// Pre-save password hashing hook
UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash') || !this.passwordHash) {
    return next();
  }
  try {
    this.passwordHash = await hashPassword(this.passwordHash);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return comparePassword(password, this.passwordHash);
};

export const User = model<IUser>('User', UserSchema);
