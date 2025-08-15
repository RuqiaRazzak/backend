import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, maxlength: 500 },
  link: { type: String }
});

const userProfileSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 80 },
  email: { type: String, required: true },
  skills: [{ type: String, maxlength: 30 }],
  projects: [projectSchema],
  github: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }
});

export default mongoose.model('UserProfile', userProfileSchema);
