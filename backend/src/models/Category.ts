import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  level: number;
  createdBy?: Schema.Types.ObjectId;
  parentCategory?: Schema.Types.ObjectId | null;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    description: String,

    image: String,

    displayOrder: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

    level: {
      type: Number,
      default: 0
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null
    }
  },
  {
    timestamps: true
  }
);

CategorySchema.index(
  {
    name: 1,
    parentCategory: 1
  },
  {
    unique: true
  }
);

CategorySchema.index({ parentCategory: 1 });
CategorySchema.index({ isDeleted: 1 });
CategorySchema.index({ isActive: 1 });

export const Category = model<ICategory>(
  "Category",
  CategorySchema
);
