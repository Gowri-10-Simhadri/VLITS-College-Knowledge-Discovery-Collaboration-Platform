import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, default: 'General' },
  description: { type: String, default: '' },
  icon: { type: String, default: 'Code' },
  color: { type: String, default: '#6366f1' },
  projectCount: { type: Number, default: 0 },
  studentCount: { type: Number, default: 0 },
  relatedSkills: [{ type: String }]
});

export const Skill = mongoose.models.Skill || mongoose.model('Skill', skillSchema);
