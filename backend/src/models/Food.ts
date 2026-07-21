import { Schema, model, Document } from "mongoose";

export type FoodType = "Veg" | "NonVeg" | "Vegan" | "Jain" | "Egg";
export type FoodStatus = "Draft" | "Published" | "Archived";

export interface IFoodImage {
  url: string;
  alt?: string;
}

export interface IFood extends Document {
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  category: Schema.Types.ObjectId;
  subCategory?: Schema.Types.ObjectId | null;
  images: IFoodImage[];
  foodType: FoodType;
  isAvailable: boolean;
  preparationTime: number; // in minutes
  isFeatured: boolean;
  isBestSeller: boolean;
  status: FoodStatus;
  displayOrder: number;
  tags: string[];
  rating: number;
  ratingCount: number;
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  isDeleted: boolean;
  variants?: any[];
}

const FoodSchema = new Schema<IFood>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: "" }
      }
    ],
    foodType: {
      type: String,
      enum: ["Veg", "NonVeg", "Vegan", "Jain", "Egg"],
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: Number,
      required: true,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Published",
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for search and indexing
FoodSchema.index({ name: "text", description: "text", tags: "text" });

FoodSchema.index({ category: 1 });
FoodSchema.index({ foodType: 1 });
FoodSchema.index({ isAvailable: 1 });
FoodSchema.index({ isFeatured: 1 });
FoodSchema.index({ isBestSeller: 1 });
FoodSchema.index({ status: 1 });

FoodSchema.virtual("variants", {
  ref: "FoodVariant",
  localField: "_id",
  foreignField: "food"
});

FoodSchema.set("toJSON", {
  virtuals: true
});

FoodSchema.set("toObject", {
  virtuals: true
});

export const Food = model<IFood>("Food", FoodSchema);
