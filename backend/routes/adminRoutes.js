import express from 'express';
import { dataStore } from '../data/store.js';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Skill } from '../models/Skill.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { getDbStatus } from '../config/db.js';

const router = express.Router();

// GET /api/admin/stats - System health & ecosystem analytics
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const { projects } = await dataStore.getProjects({}, '-createdAt', 1, 500);
    const users = await dataStore.getUsers();
    const graph = await dataStore.getKnowledgeGraph();

    const verifiedProjects = projects.filter(p => p.badge?.includes('Verified') || p.isFeatured);
    const students = users.filter(u => u.role === 'student');
    const faculty = users.filter(u => u.role === 'faculty');

    const totalReviews = projects.reduce((acc, p) => acc + (p.reviews?.length || 0), 0);

    return res.json({
      overview: {
        totalProjects: projects.length,
        verifiedProjects: verifiedProjects.length,
        totalUsers: users.length,
        studentsCount: students.length,
        facultyCount: faculty.length,
        graphNodes: graph.nodes.length,
        graphEdges: graph.links.length,
        totalReviews
      },
      dbStatus: getDbStatus()
    });
  } catch (error) {
    console.error('Error generating admin analytics:', error);
    return res.status(500).json({ message: 'Failed to fetch admin statistics.' });
  }
});

// GET /api/admin/users - List all users for management
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await dataStore.getUsers();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

// PATCH /api/admin/users/:id/role - Update user role
router.patch('/users/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['student', 'faculty', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be student, faculty, or admin.' });
    }

    const updated = await dataStore.updateUser(req.params.id, { role });
    if (!updated) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({
      success: true,
      message: `User ${updated.name} role updated to ${role}.`,
      user: updated
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update user role.' });
  }
});

// PATCH /api/admin/projects/:id/verify - Toggle verified/featured badge
router.patch('/projects/:id/verify', protect, adminOnly, async (req, res) => {
  try {
    const { isVerified, badge } = req.body;
    const project = await dataStore.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const { isConnected } = getDbStatus();
    const newBadge = badge || (isVerified ? '🛡️ Faculty Verified Capstone' : '⭐ Student Project');

    if (isConnected) {
      try {
        const p = await Project.findById(req.params.id);
        if (p) {
          p.isFeatured = isVerified !== undefined ? isVerified : !p.isFeatured;
          p.badge = newBadge;
          await p.save();
          return res.json({
            success: true,
            message: `Project ${p.title} verification updated.`,
            project: p.toObject()
          });
        }
      } catch (err) {}
    }

    project.isFeatured = isVerified !== undefined ? isVerified : !project.isFeatured;
    project.badge = newBadge;

    return res.json({
      success: true,
      message: `Project ${project.title} verification updated.`,
      project
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update project status.' });
  }
});

// DELETE /api/admin/projects/:id - Remove project
router.delete('/projects/:id', protect, adminOnly, async (req, res) => {
  try {
    const { isConnected } = getDbStatus();
    if (isConnected) {
      try {
        await Project.findByIdAndDelete(req.params.id);
      } catch (err) {}
    }

    return res.json({
      success: true,
      message: 'Project removed from knowledge repository.'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to remove project.' });
  }
});

export default router;
