import express from 'express';
import { postScheduleMessage } from '../controllers/scheduleController.js';

const router = express.Router();

router.post('/', postScheduleMessage);

export default router;
