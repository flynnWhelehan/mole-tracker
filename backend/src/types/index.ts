import { Document, Types } from 'mongoose';

// Base interfaces for the data structures
export interface IMole {
  userId: string;
  moleId: string;
  bodyLocation?: string;
  discoveredDate?: Date;
  currentRisk?: number;
  currentAiRisk?: number;
  latestObservationId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMoleObservation {
  moleId: string;
  observationNumber: number;
  imageDate: Date;
  imageLink: string;
  originalFilename: string;
  notes?: string;
  userRisk?: number;
  
  // AI Analysis Results (for future use)
  aiRisk?: number;
  aiConfidence?: number;
  aiRecommendation?: 'monitor' | 'see_doctor' | 'urgent';
  
  loggedAt: Date;
}

// Mongoose document interfaces
export interface IMoleDocument extends IMole, Document {}
export interface IMoleObservationDocument extends IMoleObservation, Document {}

// API Request payload
export interface CreateMoleObservationPayload {
  moleId?: string;
  imageDate: Date;
  imageLink: string;
  notes?: string;
  userRisk?: number;
}

// HTTP Error with status
export interface HttpError extends Error {
  status: number;
}
