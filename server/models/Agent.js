import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  name: String,
});

export default mongoose.model('Agent', agentSchema);
