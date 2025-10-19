import pidusage from 'pidusage';
import os from 'os';

let restarting = false;
let lastRestartTs = 0;
const RESTART_COOLDOWN_MS = 5 * 60 * 1000;

export const cpuMonitor = ({ thresholdPercent = 70, checkIntervalMs = 5000 } = {}) => {
  setInterval(async () => {
    try {
      const stats = await pidusage(process.pid); 
      const cpuPercent = stats.cpu; 

      if (cpuPercent > thresholdPercent && !restarting) {
        const now = Date.now();
        if (now - lastRestartTs < RESTART_COOLDOWN_MS) return; 
        restarting = true;
        lastRestartTs = now;
        console.warn(`CPU ${cpuPercent.toFixed(1)}% > ${thresholdPercent}%. Initiating graceful restart...`);

        try {
          process.exit(1);
        } catch (e) {
          process.exit(1);
        }
      } else if (cpuPercent <= thresholdPercent) {
        restarting = false;
      }
    } catch (err) {
      console.error('CPU monitor error:', err);
    }
  }, checkIntervalMs);
};
