import mongoose, { Schema, Document } from 'mongoose';

export interface DroneInterface extends Document {
  droneId: string;
  name: string;
  droneModel: string;
  status: 'Active' | 'Idle' | 'Charging' | 'Maintenance';
  battery: number;
  signal: number;
  location: string;
  sensors: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DroneSchema: Schema = new Schema<DroneInterface>(
  {
    droneId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    droneModel: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Idle', 'Charging', 'Maintenance'],
      default: 'Idle',
    },
    battery: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    signal: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    location: {
      type: String,
      required: true,
    },
    sensors: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

export const DroneModel = mongoose.model<DroneInterface>('Drone', DroneSchema);