import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  message: String,
  scheduledAt: Date,
});

export default mongoose.model('Message', messageSchema);
