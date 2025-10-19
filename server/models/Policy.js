import mongoose from 'mongoose';

const policySchema = new mongoose.Schema({
  policy_number: { type: String, unique: true, index: true },
  policy_start_date: Date,
  policy_end_date: Date,
  policy_category: { type: mongoose.Schema.Types.ObjectId, ref: 'LOB' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model('Policy', policySchema);
