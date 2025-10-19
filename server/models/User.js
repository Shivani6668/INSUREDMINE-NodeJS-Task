import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstname: { type: String, index: true },
  dob: Date,
  address: String,
  phone: String,
  state: String,
  zip: String,
  email: { type: String, unique: true, index: true },
  gender: String,
  userType: String,
});

export default mongoose.model('User', userSchema);
