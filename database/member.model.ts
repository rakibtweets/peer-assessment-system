import mongoose, { Schema, models, model, Document } from 'mongoose';

// Interface for Member document
export interface IMember extends Document {
  bdNo: string;
  rank: string;
  name: string;
  branch: string;
  batchId: mongoose.Types.ObjectId;
  averageMarks: number;
  submissionCount: number;
  submissionStatus: {
    batchId: mongoose.Types.ObjectId;
    completed: boolean;
    submittedAt: Date;
  }[];
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
    submissionStatus: [
      {
        batchId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Batch',
          required: true
        },
        completed: { type: Boolean, default: false },
        submittedAt: { type: Date, default: null }
      }
    ],
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
