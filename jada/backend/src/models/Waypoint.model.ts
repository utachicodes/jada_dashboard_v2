import mongoose, { Schema, Document } from 'mongoose';

export interface WaypointInterface extends Document {
  mission: mongoose.Types.ObjectId;
  waypointId: number;
  latitude: string;
  longitude: string;
  altitude: string;
  action: 'Photo Capture' | 'Video Recording' | 'Surveillance' | 'Delivery';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const WaypointSchema: Schema = new Schema<WaypointInterface>(
  {
    mission: {
      type: Schema.Types.ObjectId,
      ref: 'Mission',
      required: true,
    },
    waypointId: {
      type: Number,
      required: true,
    },
    latitude: {
      type: String,
      required: true,
      trim: true,
    },
    longitude: {
      type: String,
      required: true,
      trim: true,
    },
    altitude: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
      type: String,
      enum: ['Photo Capture', 'Video Recording', 'Surveillance', 'Delivery'],
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


WaypointSchema.index({ mission: 1, waypointId: 1 }, { unique: true });

export const WaypointModel = mongoose.model<WaypointInterface>('Waypoint', WaypointSchema);