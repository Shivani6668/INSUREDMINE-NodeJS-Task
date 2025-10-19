import mongoose from 'mongoose';

const lobSchema = new mongoose.Schema({
  category_name: String,
});

export default mongoose.model('LOB', lobSchema);
