import express from 'express';
import dotenv from 'dotenv';
import uploadRoutes from './routes/uploadRoutes.js';
import policyRoutes from './routes/policyRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { cpuMonitor } from './middlewares/cpuMonitor.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/upload', uploadRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/schedule', scheduleRoutes);
cpuMonitor({ thresholdPercent: 70, checkIntervalMs: 5000 });

app.use(errorHandler);

export default app;
