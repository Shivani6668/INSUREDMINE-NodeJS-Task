import mongoose from 'mongoose';

const carrierSchema = new mongoose.Schema({
  company_name: String,
});

export default mongoose.model('Carrier', carrierSchema);
