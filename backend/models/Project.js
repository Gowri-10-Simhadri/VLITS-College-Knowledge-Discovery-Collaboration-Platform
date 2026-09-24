import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userRole: { type: String, default: 'student' },
  userAvatar: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const problemSolutionSchema = new mongoose.Schema({
  problem: { type: String, required: true },
  solution: { type: String, required: true },
  approach: { type: String, default: '' },
  tags: [{ type: String }]
});

const projectSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true, index: true },
  tagline: { type: String, default: '' },
  description: { type: String, required: true },
  detailedOverview: { type: String, default: '' },
  domain: { 
    type: String, 
    required: true,
    enum: [
      'Artificial Intelligence & ML',
      'Computer Vision & Image Processing',
      'Natural Language Processing',
      'Internet of Things & Embedded',
      'Web & Mobile App Development',
      'Cyber Security & Cryptography',
      'Blockchain & Web3',
      'Data Science & Big Data',
      'Cloud & DevOps',
      'Smart Agriculture & Environment',
      'Healthcare & Biomedical',
      'Robotics & Automation'
    ],
    index: true 
  },
  year: { type: Number, required: true, default: 2024, index: true },
  batch: { type: String, default: '2020-2024', index: true },
  semester: { type: String, default: '8th Semester / Final Year Capstone' },
  
  techStack: [{ type: String, index: true }],
  skillsRequired: [{ type: String, index: true }],
  
  datasets: [{
    name: { type: String },
    source: { type: String },
    size: { type: String },
    format: { type: String },
    link: { type: String },
    description: { type: String }
  }],

  researchPapers: [{
    title: { type: String },
    authors: { type: String },
    conferenceJournal: { type: String },
    year: { type: Number },
    link: { type: String },
    doi: { type: String }
  }],

  problemsFaced: [problemSolutionSchema],
  lessonsLearned: { type: String, default: '' },
  futureImprovements: { type: String, default: '' },
  keyTakeaways: [{ type: String }],
  
  teamMembers: [{
    name: { type: String, required: true },
    role: { type: String, default: 'Lead Developer' },
    email: { type: String },
    batch: { type: String },
    avatar: { type: String }
  }],

  facultySupervisor: {
    name: { type: String, default: 'Dr. Ramesh Kumar' },
    department: { type: String, default: 'CSE' },
    designation: { type: String, default: 'Associate Professor' },
    email: { type: String, default: 'ramesh.kumar@college.edu' }
  },

  githubLink: { type: String, default: 'https://github.com' },
  liveDemoLink: { type: String, default: '' },
  reportDocLink: { type: String, default: '' },
  presentationLink: { type: String, default: '' },

  thumbnail: { type: String, default: '' },
  screenshots: [{ type: String }],

  views: { type: Number, default: 0 },
  bookmarksCount: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 },

  rating: {
    average: { type: Number, default: 4.5 },
    count: { type: Number, default: 0 }
  },
  reviews: [reviewSchema],

  status: {
    type: String,
    enum: ['Completed', 'Ongoing', 'Extended', 'Archived'],
    default: 'Completed'
  },
  isVerified: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  badge: { type: String, default: 'Best Capstone 2024' },

  extensionOfProjectId: { type: String, default: null },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
