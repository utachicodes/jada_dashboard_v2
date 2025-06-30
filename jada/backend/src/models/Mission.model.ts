import mongoose, { Schema, Document } from 'mongoose';

export interface MissionInterface extends Document {
  name: string;
  status: 'planned' | 'in-progress' | 'completed' | 'aborted';
  location: string;
  drone: mongoose.Types.ObjectId;
  operator: mongoose.Types.ObjectId;
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  startDate: Date;
  endDate: Date;
  description: string;
  assignedDrones: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MissionSchema: Schema = new Schema<MissionInterface>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['planned', 'in-progress', 'completed', 'aborted'],
      default: 'planned',
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    drone: {
      type: Schema.Types.ObjectId,
      ref: 'Drone',
    },
    operator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    assignedDrones: [{
      type: Schema.Types.ObjectId,
      ref: 'Drone',
    }],
  },
  {
    timestamps: true,
  }
);

export const MissionModel = mongoose.model<MissionInterface>('Mission', MissionSchema);