import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface ISubmission extends Document {
  batchId: Schema.Types.ObjectId; // Reference to the Batch
  marker: Schema.Types.ObjectId; // Reference to the Member who is marking
  markerBdNo: string; // The BD number of the marker
  recipient: Schema.Types.ObjectId; // Reference to the Member being marked
  recipientBDNo: string;
  marks: number;
  submitted: Date;
}

export const submissionSchema = new Schema<ISubmission>(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true
    },
    marker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true
    },
    markerBdNo: {
      type: String,
      required: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true
    },
    recipientBDNo: {
      type: String,
      required: true
    },
    marks: {
      type: Number,
      required: true
    },
    submitted: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Submission =
  models.Submission || model<ISubmission>('Submission', submissionSchema);

export default Submission;
