import { Schema, models, model, Document } from 'mongoose';

// Interface for Batch document
export interface IBatch extends Document {
  name: string;
  description?: string;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Batch document
const batchSchema = new Schema<IBatch>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String
    },
    memberCount: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Batch = models.Batch || model('Batch', batchSchema);

export default Batch;
