import { model, Schema } from "mongoose";

export interface IShopModel extends Document {
  name: string;
  email: string;
  password: string;
  status: "active" | "inactive";
  verify: boolean;
  roles: string[];
}

const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "Shops";

const shopSchema: Schema<IShopModel> = new Schema<IShopModel>(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export default model<IShopModel>(DOCUMENT_NAME, shopSchema);
