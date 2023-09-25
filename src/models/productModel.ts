import { model, Schema } from "mongoose";
import slugify from "slugify";
import { type IShopModel } from "./shopModel";

interface IProductAttributes extends Document {
  manufacturer?: string;
  brand?: string;
  model?: string;
  size?: string;
  color?: string;
  material?: string;
  product_shop: Schema.Types.ObjectId | IShopModel; // Adjust this type as per your Shop schema
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductModel extends Document {
  product_name: string;
  product_thumb: string;
  product_description?: string;
  product_slug?: string;
  product_price: number;
  product_quantity: number;
  product_type: "Electronics" | "Clothing" | "Furniture";
  product_shop: Schema.Types.ObjectId | IShopModel;
  product_attributes: IProductAttributes;
  product_ratings: number;
  product_variants: string[];
  isDraft: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema: Schema<IProductModel> = new Schema<IProductModel>(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: String,
    product_slug: String,
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    product_ratings: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    product_variants: {
      type: [String],
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
);

// Create index for searching
productSchema.index({ product_name: "text", product_description: "text" });

// Model middleware
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

const electronicSchema: Schema<IProductAttributes> =
  new Schema<IProductAttributes>(
    {
      manufacturer: {
        type: String,
        required: true,
      },
      model: String,
      color: String,
      product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    },
    {
      collection: "Electronics",
      timestamps: true,
    },
  );

const clothingSchema: Schema<IProductAttributes> =
  new Schema<IProductAttributes>(
    {
      brand: {
        type: String,
        required: true,
      },
      size: String,
      material: String,
      product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    },
    {
      collection: "Clothing",
      timestamps: true,
    },
  );

const furnitureSchema: Schema<IProductAttributes> =
  new Schema<IProductAttributes>(
    {
      brand: {
        type: String,
        required: true,
      },
      size: String,
      material: String,
      product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    },
    {
      collection: "Furniture",
      timestamps: true,
    },
  );

export const product = model<IProductModel>(DOCUMENT_NAME, productSchema);
export const electronic = model<IProductAttributes>(
  "Electronics",
  electronicSchema,
);
export const clothing = model<IProductAttributes>("Clothing", clothingSchema);
export const furniture = model<IProductAttributes>(
  "Furniture",
  furnitureSchema,
);
