import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  name: String,
});

export default mongoose.model('Account', accountSchema);
