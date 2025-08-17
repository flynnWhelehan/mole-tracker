import { Mole } from '../models/Mole.js';
import { MoleObservation } from '../models/MoleObservation.js';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateMoleObservationPayload,
  HttpError,
  IMoleDocument,
  IMoleObservationDocument
} from '../types/index.js';

function httpError(status: number, message: string): HttpError {
  const err = new Error(message) as HttpError;
  err.status = status;
  return err;
}

export async function getAllMoles(): Promise<IMoleDocument[]> {
  return Mole.find().populate('latestObservationId');
}

export async function getMole(moleId: string): Promise<IMoleDocument> {
  const mole = await Mole.findOne({ moleId }).populate('latestObservationId');
  if (!mole) {
    throw httpError(404, 'Mole not found');
  }
  return mole;
}

export async function getMoleHistory(moleId: string) {
  const mole = await Mole.findOne({ moleId });
  if (!mole) {
    throw httpError(404, 'Mole not found');
  }
  const observations = await MoleObservation.find({ moleId }).sort({ observationNumber: 1 });
  return { mole, observations };
}

export async function createMoleObservation(payload: CreateMoleObservationPayload) {
  const { moleId, imageDate, imageLink, notes, userRisk } = payload;
  let targetMoleId = moleId;
  let observationNumber = 1;

  if (!moleId) {
    targetMoleId = uuidv4();
    const newMole = new Mole({
      userId: 'default-user',
      moleId: targetMoleId,
      discoveredDate: imageDate,
      currentRisk: userRisk
    });
    await newMole.save();
  } 
  else {
    const existingMole = await Mole.findOne({ moleId: targetMoleId });
    if (!existingMole) {
      throw httpError(404, `Mole with ID '${targetMoleId}' not found. Use POST without moleId to create a new mole.`);
    }
    const lastObservation = await MoleObservation.findOne({ moleId: targetMoleId }).sort({ observationNumber: -1 });
    observationNumber = lastObservation ? lastObservation.observationNumber + 1 : 1;
  }

  const shortMoleId = targetMoleId!.split('-')[0];
  const fileExtension = imageLink.split('.').pop();
  const formattedImageLink = `uploads/mole_${shortMoleId}_obs_${observationNumber}.${fileExtension}`;

  const observation = new MoleObservation({
    moleId: targetMoleId,
    observationNumber,
    imageDate,
    imageLink: formattedImageLink,
    originalFilename: imageLink,
    notes,
    userRisk
  });

  const savedObservation = await observation.save();

  await Mole.findOneAndUpdate(
    { moleId: targetMoleId },
    {
      latestObservationId: savedObservation._id,
      currentRisk: userRisk,
      updatedAt: new Date()
    }
  );

  return {
    moleId: targetMoleId!,
    observation: savedObservation
  };
}

export async function deleteMole(moleId: string) {
  const mole = await Mole.findOne({ moleId });
  if (!mole) {
    throw httpError(404, 'Mole not found');
  }

  const observations = await MoleObservation.find({ moleId });
  await MoleObservation.deleteMany({ moleId });
  await Mole.deleteOne({ moleId });

  return {
    message: 'Mole and all observations deleted successfully',
    deletedMole: mole,
    deletedObservations: observations.length,
    observationIds: observations.map((obs) => obs._id as import('mongoose').Types.ObjectId)
  };
}

export async function deleteMoleObservation(moleId: string, observationId: string) {
  const mole = await Mole.findOne({ moleId });
  if (!mole) {
    throw httpError(404, 'Mole not found');
  }

  const observation = await MoleObservation.findOne({ _id: observationId, moleId });
  if (!observation) {
    throw httpError(404, 'Observation not found for this mole');
  }

  await MoleObservation.deleteOne({ _id: observationId });

  const remainingObservations = await MoleObservation.find({ moleId }).sort({ observationNumber: -1 });

  if (remainingObservations.length > 0) {
    const latestObservation = remainingObservations[0]!;
    await Mole.findOneAndUpdate(
      { moleId },
      {
        latestObservationId: latestObservation._id,
        currentRisk: latestObservation.userRisk,
        updatedAt: new Date()
      }
    );
  } 
  else {
    await Mole.findOneAndUpdate(
      { moleId },
      {
        latestObservationId: null,
        currentRisk: null,
        updatedAt: new Date()
      }
    );
  }

  return {
    message: 'Observation deleted successfully',
    deletedObservation: observation,
    remainingObservations: remainingObservations.length
  };
}

export async function getMoleObservation(moleId: string, observationId: string) {
  const mole = await Mole.findOne({ moleId });
  if (!mole) {
    throw httpError(404, 'Mole not found');
  }
  const observation = await MoleObservation.findOne({ _id: observationId, moleId });
  if (!observation) {
    throw httpError(404, 'Observation not found for this mole');
  }
  return { moleId, observation };
}

export async function getAllMolesAndObservations() {
  const [moles, observations] = await Promise.all([
    Mole.find().populate('latestObservationId'),
    MoleObservation.find().sort({ moleId: 1, observationNumber: 1 })
  ]);
  return { moles, observations };
}

export async function getMolesWithObservations() {
  const [moles, observations] = await Promise.all([
    Mole.find().lean(),
    MoleObservation.find().sort({ observationNumber: 1 }).lean()
  ]);
  
  const byMoleId = observations.reduce((acc: Record<string, IMoleObservationDocument[]>, obs) => {
    (acc[obs.moleId] ||= []).push(obs);
    return acc;
  }, {});
  
  const result = moles.map((m) => ({ 
    ...m, 
    observations: byMoleId[m.moleId] || [] 
  }));
  
  return { moles: result };
}

export async function deleteAllMoles() {
  const obsResult = await MoleObservation.deleteMany({});
  const moleResult = await Mole.deleteMany({});
  return {
    message: 'All moles and observations deleted successfully',
    deleted: {
      moles: moleResult?.deletedCount ?? 0,
      observations: obsResult?.deletedCount ?? 0
    }
  };
}
