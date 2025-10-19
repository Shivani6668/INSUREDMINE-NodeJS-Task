import express from 'express';
import { getPolicyByUser, aggregatePolicy } from '../controllers/policyController.js';

const router = express.Router();

router.get('/aggregate/all', aggregatePolicy);

router.get('/:firstname', getPolicyByUser);

export default router;
