import { Router } from 'express';
import { getAllMoles, getAllMolesAndObservations, getMole, getMoleHistory, getMoleObservation, createMoleObservation, deleteAllMoles, deleteMole, deleteMoleObservation } from '../controllers/moleController.js';

const router = Router();

// Get all moles (with latest observations)
router.get('/', getAllMoles);

// Get all moles and all observations (observations nested inside each mole)
router.get('/all', getAllMolesAndObservations);

// Get full history of a mole (mole + observations)
router.get('/:moleId/history', getMoleHistory);

// Get specific observation for a mole
router.get('/:moleId/observations/:observationId', getMoleObservation);

// Get specific mole
router.get('/:moleId', getMole);

// Create new mole or add observation to existing mole (if mole ID supplied)
router.post('/', createMoleObservation);

// Delete all moles and all observations (bulk)
router.delete('/', deleteAllMoles);

// Delete specific mole with its observations
router.delete('/:moleId', deleteMole);

// Delete specific observation from a mole
router.delete('/:moleId/observations/:observationId', deleteMoleObservation);

export default router;
