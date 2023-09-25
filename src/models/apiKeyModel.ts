import mongoose, { Schema } from "mongoose";

interface IApiKeyModel extends Document {
  key: string;
  status: boolean;
  permissions: string[];
}

const DOCUMENT_NAME = "Apikey";
const COLLECTION_NAME = "Apikeys";

const apiKeySchema: Schema<IApiKeyModel> = new Schema<IApiKeyModel>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  },
);

export default mongoose.model<IApiKeyModel>(DOCUMENT_NAME, apiKeySchema);
