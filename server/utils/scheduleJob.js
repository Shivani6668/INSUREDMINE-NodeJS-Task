import cron from 'node-cron';
import Message from '../models/Message.js';

export const scheduleMessage = ({ day, time, message }) => {
  const [hour, minute] = time.split(':');
  cron.schedule(`${minute} ${hour} * * ${day}`, async () => {
    await Message.create({ message, scheduledAt: new Date() });
    console.log('Message inserted into DB');
  });
};
