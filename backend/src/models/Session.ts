import { Schema, model, Document } from 'mongoose';

export interface ISession extends Document {
  userId: Schema.Types.ObjectId;
  token: string;
  deviceInfo: string;
  ipAddress: string;
  isValid: boolean;
  expiresAt: Date;
}

const SessionSchema = new Schema<ISession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  token: { type: String, required: true, unique: true },
  deviceInfo: { type: String, required: true },
  ipAddress: { type: String, required: true },
  isValid: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL index
}, {
  timestamps: true,
});

export const Session = model<ISession>('Session', SessionSchema);
