import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'faculty', 'admin'], 
    default: 'student' 
  },
  batch: { type: String, default: '2023-2027' },
  branch: { type: String, default: 'Computer Science & Engineering' },
  department: { type: String, default: 'CSE' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  headline: { type: String, default: 'Student & Tech Enthusiast' },
  skills: [{
    name: { type: String },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' },
    endorsements: { type: Number, default: 1 }
  }],
  interests: [{ type: String }],
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  portfolio: { type: String, default: '' },
  bookmarks: [{ type: String }],
  recentlyViewed: [{ type: String }],
  rating: {
    average: { type: Number, default: 4.8 },
    count: { type: Number, default: 12 }
  },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
