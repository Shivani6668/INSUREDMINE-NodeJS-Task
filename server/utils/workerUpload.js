import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runWorker = (filePath) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, 'csvWorker.js'), {
      workerData: { filePath },
    });

    worker.on('message', (msg) => {
      console.log('Worker message:', msg);
      resolve(msg); 
    });

    worker.on('error', (err) => {
      console.error('Worker error:', err);
      reject(err);
    });

    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
};
