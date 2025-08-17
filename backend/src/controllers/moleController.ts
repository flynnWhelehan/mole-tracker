import { Request, Response } from 'express';
import * as moleService from '../services/moleService.js';
import { HttpError } from '../types/index.js';

export async function getAllMoles(req: Request, res: Response): Promise<void> {
  try {
    const moles = await moleService.getAllMoles();
    res.json(moles);
  } 
  catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
}

export async function getMole(req: Request, res: Response): Promise<void> {
  try {
    const { moleId } = req.params;
    if (!moleId) {
      res.status(400).json({ message: 'Mole ID is required' });
      return;
    }
    const mole = await moleService.getMole(moleId);
    res.json(mole);
  } 
  catch (err) {
    const error = err as HttpError;
    res.status(error.status || 500).json({ message: error.message });
  }
}

export async function getMoleObservations(req: Request, res: Response): Promise<void> {
  try {
    const { moleId } = req.params;
    if (!moleId) {
      res.status(400).json({ message: 'Mole ID is required' });
      return;
    }
    const { observations } = await moleService.getMoleHistory(moleId);
    res.json({ moleId, observations });
  } 
  catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
}

export async function getMoleObservation(req: Request, res: Response): Promise<void> {
  try {
    const { moleId, observationId } = req.params;
    if (!moleId || !observationId) {
      res.status(400).json({ message: 'Mole ID and Observation ID are required' });
      return;
    }
    const data = await moleService.getMoleObservation(moleId, observationId);
    res.json(data);
  } catch (err) {
    const error = err as HttpError;
    res.status(error.status || 500).json({ message: error.message });
  }
}

export async function getAllMolesAndObservations(req: Request, res: Response): Promise<void> {
  try {
    const data = await moleService.getMolesWithObservations();
    res.json(data);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
}

export async function getMolesWithObservations(req: Request, res: Response): Promise<void> {
  try {
    const data = await moleService.getMolesWithObservations();
    res.json(data);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
}

export async function getMoleHistory(req: Request, res: Response): Promise<void> {
  try {
    const { moleId } = req.params;
    if (!moleId) {
      res.status(400).json({ message: 'Mole ID is required' });
      return;
    }
    const data = await moleService.getMoleHistory(moleId);
    res.json(data);
  } 
  catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
}

export async function createMoleObservation(req: Request, res: Response): Promise<void> {
  try {
    const result = await moleService.createMoleObservation(req.body);
    res.status(201).json(result);
  } 
  catch (err) {
    const error = err as HttpError;
    res.status(error.status || 400).json({ message: error.message });
  }
}

export async function deleteMole(req: Request, res: Response): Promise<void> {
  try {
    const { moleId } = req.params;
    if (!moleId) {
      res.status(400).json({ message: 'Mole ID is required' });
      return;
    }
    const result = await moleService.deleteMole(moleId);
    res.json(result);
  } 
  catch (err) {
    const error = err as HttpError;
    res.status(error.status || 500).json({ message: error.message });
  }
}

export async function deleteMoleObservation(req: Request, res: Response): Promise<void> {
  try {
    const { moleId, observationId } = req.params;
    if (!moleId || !observationId) {
      res.status(400).json({ message: 'Mole ID and Observation ID are required' });
      return;
    }
    const result = await moleService.deleteMoleObservation(moleId, observationId);
    res.json(result);
  } 
  catch (err) {
    const error = err as HttpError;
    res.status(error.status || 500).json({ message: error.message });
  }
}

export async function deleteAllMoles(req: Request, res: Response): Promise<void> {
  try {
    const result = await moleService.deleteAllMoles();
    res.json(result);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
}
