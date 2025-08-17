import { Schema, model } from 'mongoose';
import { IMoleObservationDocument } from '../types/index.js';

// Individual observation/photo of the mole
const moleObservationSchema = new Schema<IMoleObservationDocument>({
  moleId: { type: String, required: true }, // Links to parent mole
  observationNumber: { type: Number, required: true }, // Version number (1, 2, 3...)

  // User-provided data for this observation
  imageDate: { type: Date, required: true },
  imageLink: { type: String, required: true }, // Stored as a standardized filename
  originalFilename: { type: String, required: true }, // Original upload filename
  notes: { type: String },
  userRisk: { type: Number, min: 1, max: 5 },

  // AI Analysis Results
  aiRisk: { type: Number, min: 1, max: 5 },
  aiConfidence: { type: Number, min: 0, max: 1 },
  aiRecommendation: { type: String, enum: ['monitor', 'see_doctor', 'urgent'] },

  loggedAt: { type: Date, default: Date.now }
});

// Compound index to ensure unique observation numbers per mole
moleObservationSchema.index({ moleId: 1, observationNumber: 1 }, { unique: true });

export const MoleObservation = model<IMoleObservationDocument>('MoleObservation', moleObservationSchema);
