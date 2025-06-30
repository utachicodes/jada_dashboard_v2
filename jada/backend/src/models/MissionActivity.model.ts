import mongoose, { Schema, Document } from 'mongoose';

export interface MissionActivityInterface extends Document {
  mission: mongoose.Types.ObjectId;
  date: Date;
  flightHours: number;
  status: 'planned' | 'in-progress' | 'completed' | 'aborted';
  createdAt: Date;
  updatedAt: Date;
}

const MissionActivitySchema: Schema = new Schema<MissionActivityInterface>(
  {
    mission: {
      type: Schema.Types.ObjectId,
      ref: 'Mission',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    flightHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['planned', 'in-progress', 'completed', 'aborted'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MissionActivityModel = mongoose.model<MissionActivityInterface>('MissionActivity', MissionActivitySchema);