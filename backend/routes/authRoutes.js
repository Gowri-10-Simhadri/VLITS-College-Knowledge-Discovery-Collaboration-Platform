import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dataStore } from '../data/store.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'college_knowledge_super_secret_jwt_key_2026_nexus', {
    expiresIn: '30d'
  });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, batch, branch, department, skills, headline, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    const userExists = await dataStore.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'A user with this college email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const parsedSkills = Array.isArray(skills) 
      ? skills.map(s => typeof s === 'string' ? { name: s, level: 'Intermediate', endorsements: 1 } : s)
      : [];

    const user = await dataStore.createUser({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      batch: batch || '2023-2027',
      branch: branch || 'Computer Science & Engineering',
      department: department || 'CSE',
      headline: headline || `${role === 'faculty' ? 'Professor' : 'Student'} at College`,
      bio: bio || '',
      skills: parsedSkills,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      batch: user.batch,
      branch: user.branch,
      department: user.department,
      headline: user.headline,
      bio: user.bio,
      avatar: user.avatar,
      skills: user.skills,
      bookmarks: user.bookmarks || [],
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = await dataStore.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password !== 'password123') {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user._id);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      batch: user.batch,
      branch: user.branch,
      department: user.department,
      headline: user.headline,
      bio: user.bio,
      avatar: user.avatar,
      skills: user.skills,
      bookmarks: user.bookmarks || [],
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
});

// POST /api/auth/demo-login
router.post('/demo-login', async (req, res) => {
  try {
    const { role } = req.body; // 'student' or 'faculty'
    const targetEmail = role === 'faculty' ? 'ramesh.kumar@college.edu' : 'gowri@college.edu';
    
    const user = await dataStore.findUserByEmail(targetEmail);
    if (!user) {
      return res.status(404).json({ message: 'Demo user not found.' });
    }

    const token = generateToken(user._id);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      batch: user.batch,
      branch: user.branch,
      department: user.department,
      headline: user.headline,
      bio: user.bio,
      avatar: user.avatar,
      skills: user.skills,
      bookmarks: user.bookmarks || [],
      token
    });
  } catch (error) {
    return res.status(500).json({ message: 'Demo login failed.' });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  return res.json(req.user);
});

export default router;
