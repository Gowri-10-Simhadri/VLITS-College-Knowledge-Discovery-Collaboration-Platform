import jwt from 'jsonwebtoken';
import { dataStore } from '../data/store.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'college_knowledge_super_secret_jwt_key_2026_nexus');
      
      const user = await dataStore.findUserById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'User no longer exists.' });
      }

      req.user = {
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
        bookmarks: user.bookmarks || []
      };
      
      return next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Admin privileges required.' });
};

export const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'college_knowledge_super_secret_jwt_key_2026_nexus');
      const user = await dataStore.findUserById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (e) {}
  }
  next();
};


