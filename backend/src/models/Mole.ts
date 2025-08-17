import { Schema, model } from 'mongoose';
import { IMoleDocument } from '../types/index.js';

// Master mole record - represents a single physical mole
const moleSchema = new Schema<IMoleDocument>({
  userId: { type: String, required: true }, // Future: user system
  moleId: { type: String, required: true, unique: true },
  
  // Mole metadata
  bodyLocation: { type: String }, // Future: coordinates on body model
  discoveredDate: { type: Date },
  
  // Current status (updated with each observation)
  currentRisk: { type: Number, min: 1, max: 5 },
  currentAiRisk: { type: Number, min: 1, max: 5 },
  latestObservationId: { type: Schema.Types.ObjectId, ref: 'MoleObservation' },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Mole = model<IMoleDocument>('Mole', moleSchema);
