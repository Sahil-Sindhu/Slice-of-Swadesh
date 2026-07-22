import { Schema, model, Document } from "mongoose";

export interface IReview extends Document {
  user?: Schema.Types.ObjectId;
  userName: string;
  avatar?: string;
  rating: number;
  comment: string;
  language?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  userName: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    default: "English"
  }
}, {
  timestamps: true
});

export const Review = model<IReview>("Review", ReviewSchema);
