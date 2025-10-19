import { scheduleMessage } from '../utils/scheduleJob.js';
 import { asyncHandler } from '../middlewares/asyncHandler.js';
export const postScheduleMessage = asyncHandler(async (req, res) => {
  const { message, day, time } = req.body;
  if (!message || !time) return res.status(400).json({ message: 'message and time required' });

  const saved = await scheduleMessage({ message, day, time });
  res.json({ message: 'Message scheduled successfully', scheduledId: saved._id });
});
