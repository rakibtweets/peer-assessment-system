import mongoose, { Schema, models, model, Document } from 'mongoose';

// Interface for Member document
export interface IMember extends Document {
  bdNo: string;
  bupNo: string;
  rank: string;
  name: string;
  branch: string;
  batchId: mongoose.Types.ObjectId;
  averageMarks: number;
  submissionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Member document
const memberSchema = new Schema<IMember>(
  {
    bdNo: {
      type: String,
      required: true,
      unique: true
    },
    bupNo: {
      type: String,
      required: true,
      unique: true
    },
    rank: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    branch: {
      type: String,
      required: true
    },
    batchId: {
      type: Schema.Types.ObjectId,
      ref: 'Batch',
      required: true
    },
    averageMarks: {
      type: Number,
      default: 0
    },
    submissionCount: {
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

const Member = models.Member || model('Member', memberSchema);

export default Member;
