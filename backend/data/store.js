import bcrypt from 'bcryptjs';
import { initialProjects, sampleUsers, sampleSkills } from './seedData.js';
import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { KnowledgeEdge } from '../models/KnowledgeEdge.js';
import { getDbStatus } from '../config/db.js';

// In-Memory Fallback State (for resilience if offline)
let inMemoryProjects = JSON.parse(JSON.stringify(initialProjects));
let inMemoryUsers = JSON.parse(JSON.stringify(sampleUsers));
let inMemorySkills = JSON.parse(JSON.stringify(sampleSkills));
let inMemoryEdges = [];

export const generateEdgesFromProjects = (projects, users) => {
  const edges = [];
  
  projects.forEach(p => {
    // Project -> Tech
    p.techStack?.forEach(tech => {
      edges.push({
        id: `e_${p._id}_${tech}`,
        source: p._id,
        sourceName: p.title,
        sourceType: 'Project',
        target: `tech_${tech.toLowerCase().replace(/\s+/g, '_')}`,
        targetName: tech,
        targetType: 'Technology',
        relationship: 'USES_TECH'
      });
    });

    // Project -> Skill
    p.skillsRequired?.forEach(skill => {
      edges.push({
        id: `e_${p._id}_${skill}`,
        source: p._id,
        sourceName: p.title,
        sourceType: 'Project',
        target: `skill_${skill.toLowerCase().replace(/\s+/g, '_')}`,
        targetName: skill,
        targetType: 'Skill',
        relationship: 'REQUIRES_SKILL'
      });
    });

    // Student -> Project
    p.teamMembers?.forEach(member => {
      edges.push({
        id: `e_${member.name}_${p._id}`,
        source: `student_${member.name.toLowerCase().replace(/\s+/g, '_')}`,
        sourceName: member.name,
        sourceType: 'Student',
        target: p._id,
        targetName: p.title,
        targetType: 'Project',
        relationship: 'WORKED_ON'
      });
    });

    // Faculty -> Project
    if (p.facultySupervisor?.name) {
      edges.push({
        id: `e_fac_${p.facultySupervisor.name}_${p._id}`,
        source: `faculty_${p.facultySupervisor.name.toLowerCase().replace(/\s+/g, '_')}`,
        sourceName: p.facultySupervisor.name,
        sourceType: 'Faculty',
        target: p._id,
        targetName: p.title,
        targetType: 'Project',
        relationship: 'SUPERVISED'
      });
    }

    // Project -> Dataset
    p.datasets?.forEach((ds, idx) => {
      edges.push({
        id: `e_ds_${p._id}_${idx}`,
        source: p._id,
        sourceName: p.title,
        sourceType: 'Project',
        target: `dataset_${ds.name.toLowerCase().replace(/\s+/g, '_').slice(0, 20)}`,
        targetName: ds.name,
        targetType: 'Dataset',
        relationship: 'UTILIZES_DATASET'
      });
    });

    // Project -> Research Paper
    p.researchPapers?.forEach((rp, idx) => {
      edges.push({
        id: `e_rp_${p._id}_${idx}`,
        source: p._id,
        sourceName: p.title,
        sourceType: 'Project',
        target: `paper_${idx}_${p._id}`,
        targetName: rp.title,
        targetType: 'ResearchPaper',
        relationship: 'CITED_PAPER'
      });
    });
  });

  return edges;
};

inMemoryEdges = generateEdgesFromProjects(inMemoryProjects, inMemoryUsers);

export const dataStore = {
  // Get all projects with filtering, sorting, pagination
  getProjects: async (filter = {}, sort = '-createdAt', page = 1, limit = 12) => {
    const { isConnected } = getDbStatus();
    
    if (isConnected) {
      try {
        const mongoQuery = {};
        if (filter.domain) mongoQuery.domain = filter.domain;
        if (filter.year) mongoQuery.year = Number(filter.year);
        if (filter.batch) mongoQuery.batch = filter.batch;
        if (filter.techStack) mongoQuery.techStack = { $in: Array.isArray(filter.techStack) ? filter.techStack : [filter.techStack] };
        if (filter.q) {
          mongoQuery.$or = [
            { title: { $regex: filter.q, $options: 'i' } },
            { description: { $regex: filter.q, $options: 'i' } },
            { domain: { $regex: filter.q, $options: 'i' } },
            { techStack: { $regex: filter.q, $options: 'i' } },
            { skillsRequired: { $regex: filter.q, $options: 'i' } }
          ];
        }

        let mongoSort = { createdAt: -1 };
        if (sort === 'rating') mongoSort = { 'rating.average': -1 };
        else if (sort === 'views') mongoSort = { views: -1 };
        else if (sort === 'year-desc') mongoSort = { year: -1 };
        else if (sort === 'year-asc') mongoSort = { year: 1 };

        const count = await Project.countDocuments(mongoQuery);
        const projects = await Project.find(mongoQuery)
          .sort(mongoSort)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean();

        return { projects, total: count, pages: Math.ceil(count / limit) };
      } catch (err) {
        console.error('Mongo Atlas query error, falling back to memory:', err.message);
      }
    }

    // Fallback in-memory
    let result = [...inMemoryProjects];

    if (filter.domain) result = result.filter(p => p.domain === filter.domain);
    if (filter.year) result = result.filter(p => p.year === Number(filter.year));
    if (filter.batch) result = result.filter(p => p.batch === filter.batch);
    if (filter.techStack) {
      const techs = Array.isArray(filter.techStack) ? filter.techStack : [filter.techStack];
      result = result.filter(p => p.techStack?.some(t => techs.includes(t)));
    }
    if (filter.q) {
      const q = filter.q.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.domain.toLowerCase().includes(q) ||
        p.techStack?.some(t => t.toLowerCase().includes(q)) ||
        p.skillsRequired?.some(s => s.toLowerCase().includes(q)) ||
        p.problemsFaced?.some(pr => pr.problem.toLowerCase().includes(q) || pr.solution.toLowerCase().includes(q))
      );
    }

    if (sort === 'rating') {
      result.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
    } else if (sort === 'views') {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sort === 'year-desc') {
      result.sort((a, b) => b.year - a.year);
    } else if (sort === 'year-asc') {
      result.sort((a, b) => a.year - b.year);
    } else {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    const total = result.length;
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return {
      projects: paginated,
      total,
      pages: Math.ceil(total / limit)
    };
  },

  // Get project by ID
  getProjectById: async (id) => {
    const { isConnected } = getDbStatus();
    if (isConnected) {
      try {
        const proj = await Project.findById(id);
        if (proj) {
          proj.views = (proj.views || 0) + 1;
          await proj.save();
          return proj.toObject();
        }
      } catch (err) {}
    }

    const proj = inMemoryProjects.find(p => p._id === id);
    if (proj) {
      proj.views = (proj.views || 0) + 1;
    }
    return proj;
  },

  // Create Project
  createProject: async (projectData) => {
    const { isConnected } = getDbStatus();
    const newId = `proj_${Date.now()}`;
    const project = {
      _id: newId,
      ...projectData,
      views: 0,
      bookmarksCount: 0,
      likesCount: 0,
      rating: { average: 5.0, count: 1 },
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (isConnected) {
      try {
        const created = await Project.create(project);
        
        // Generate edges in Atlas
        const edges = generateEdgesFromProjects([created], []);
        const formattedEdges = edges.map(e => ({
          sourceType: e.sourceType,
          sourceId: e.source,
          sourceName: e.sourceName,
          targetType: e.targetType,
          targetId: e.target,
          targetName: e.targetName,
          relationship: e.relationship,
          weight: 1.0
        }));
        await KnowledgeEdge.insertMany(formattedEdges);
        
        return created.toObject();
      } catch (err) {
        console.error('Failed to write project to Mongo Atlas:', err.message);
      }
    }

    inMemoryProjects.unshift(project);
    inMemoryEdges = generateEdgesFromProjects(inMemoryProjects, inMemoryUsers);
    return project;
  },

  // Add Review
  addReview: async (projectId, reviewData) => {
    const { isConnected } = getDbStatus();
    if (isConnected) {
      try {
        const project = await Project.findById(projectId);
        if (project) {
          project.reviews.unshift(reviewData);
          const totalRating = project.reviews.reduce((acc, curr) => acc + curr.rating, 0);
          project.rating = {
            average: Number((totalRating / project.reviews.length).toFixed(1)),
            count: project.reviews.length
          };
          await project.save();
          return project.toObject();
        }
      } catch (err) {}
    }

    const project = inMemoryProjects.find(p => p._id === projectId);
    if (!project) return null;

    if (!project.reviews) project.reviews = [];
    project.reviews.unshift({
      ...reviewData,
      createdAt: new Date()
    });

    const totalRating = project.reviews.reduce((acc, curr) => acc + curr.rating, 0);
    project.rating = {
      average: Number((totalRating / project.reviews.length).toFixed(1)),
      count: project.reviews.length
    };

    return project;
  },

  // Toggle Bookmark
  toggleBookmark: async (userId, projectId) => {
    const { isConnected } = getDbStatus();
    if (isConnected) {
      try {
        const user = await User.findById(userId);
        const project = await Project.findById(projectId);
        if (user && project) {
          const idx = user.bookmarks.indexOf(projectId);
          let bookmarked = false;
          if (idx > -1) {
            user.bookmarks.splice(idx, 1);
            project.bookmarksCount = Math.max(0, (project.bookmarksCount || 1) - 1);
            bookmarked = false;
          } else {
            user.bookmarks.push(projectId);
            project.bookmarksCount = (project.bookmarksCount || 0) + 1;
            bookmarked = true;
          }
          await user.save();
          await project.save();
          return { bookmarked, bookmarks: user.bookmarks, bookmarksCount: project.bookmarksCount };
        }
      } catch (err) {}
    }

    const user = inMemoryUsers.find(u => u._id === userId);
    const project = inMemoryProjects.find(p => p._id === projectId);
    
    if (!user || !project) return { bookmarked: false };

    if (!user.bookmarks) user.bookmarks = [];
    const idx = user.bookmarks.indexOf(projectId);
    let bookmarked = false;

    if (idx > -1) {
      user.bookmarks.splice(idx, 1);
      project.bookmarksCount = Math.max(0, (project.bookmarksCount || 1) - 1);
      bookmarked = false;
    } else {
      user.bookmarks.push(projectId);
      project.bookmarksCount = (project.bookmarksCount || 0) + 1;
      bookmarked = true;
    }

    return { bookmarked, bookmarks: user.bookmarks, bookmarksCount: project.bookmarksCount };
  },

  // Find User by email
  findUserByEmail: async (email) => {
    const { isConnected } = getDbStatus();
    if (isConnected) {
      try {
        const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        if (user) return user.toObject();
      } catch (err) {}
    }
    return inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  // Find User by ID
  findUserById: async (id) => {
    const { isConnected } = getDbStatus();
    if (isConnected) {
      try {
        const user = await User.findById(id);
        if (user) return user.toObject();
      } catch (err) {}
    }
    return inMemoryUsers.find(u => u._id === id);
  },

  // Create User
  createUser: async (userData) => {
    const { isConnected } = getDbStatus();
    const newUser = {
      _id: `user_${Date.now()}`,
      ...userData,
      bookmarks: [],
      recentlyViewed: [],
      skills: userData.skills || [],
      rating: { average: 5.0, count: 1 },
      createdAt: new Date()
    };

    if (isConnected) {
      try {
        const created = await User.create(newUser);
        return created.toObject();
      } catch (err) {
        console.error('Failed to create user in Atlas:', err.message);
      }
    }

    inMemoryUsers.push(newUser);
    return newUser;
  },

  // Update User Profile
  updateUser: async (userId, updateFields) => {
    const { isConnected } = getDbStatus();
    if (isConnected) {
      try {
        const updated = await User.findByIdAndUpdate(
          userId,
          { $set: updateFields },
          { new: true }
        );
        if (updated) return updated.toObject();
      } catch (err) {
        console.error('Failed to update user in Atlas:', err.message);
      }
    }

    const idx = inMemoryUsers.findIndex(u => u._id === userId);
    if (idx !== -1) {
      inMemoryUsers[idx] = { ...inMemoryUsers[idx], ...updateFields };
      return inMemoryUsers[idx];
    }
    return null;
  },

  // Get Users (for collaborator discovery)
  getUsers: async () => {
    const { isConnected } = getDbStatus();
    if (isConnected) {
      try {
        const users = await User.find({}).lean();
        if (users.length > 0) return users;
      } catch (err) {}
    }
    return inMemoryUsers;
  },

  // Get Knowledge Graph nodes and edges directly from Atlas
  getKnowledgeGraph: async () => {
    const { isConnected } = getDbStatus();
    let projects = inMemoryProjects;
    let users = inMemoryUsers;
    let edges = inMemoryEdges;

    if (isConnected) {
      try {
        projects = await Project.find({}).lean();
        users = await User.find({}).lean();
        edges = generateEdgesFromProjects(projects, users);
      } catch (err) {}
    }

    const nodes = [];
    const nodeMap = new Set();

    // Add Projects as nodes
    projects.forEach(p => {
      if (!nodeMap.has(p._id)) {
        nodeMap.add(p._id);
        nodes.push({
          id: p._id,
          name: p.title,
          type: 'Project',
          domain: p.domain,
          year: p.year,
          rating: p.rating?.average || 4.5,
          color: '#6366f1' // Indigo
        });
      }
    });

    // Add Skills as nodes
    sampleSkills.forEach(s => {
      const id = `skill_${s.name.toLowerCase().replace(/\s+/g, '_')}`;
      if (!nodeMap.has(id)) {
        nodeMap.add(id);
        nodes.push({
          id,
          name: s.name,
          type: 'Skill',
          category: s.category,
          color: '#10b981' // Emerald
        });
      }
    });

    // Add Edges and target nodes
    edges.forEach(e => {
      if (!nodeMap.has(e.target)) {
        nodeMap.add(e.target);
        let color = '#a855f7';
        if (e.targetType === 'Technology') color = '#fb923c';
        if (e.targetType === 'Faculty') color = '#f59e0b';
        if (e.targetType === 'Student') color = '#06b6d4';
        if (e.targetType === 'Dataset') color = '#f43f5e';
        if (e.targetType === 'ResearchPaper') color = '#8b5cf6';

        nodes.push({
          id: e.target,
          name: e.targetName,
          type: e.targetType,
          color
        });
      }

      if (!nodeMap.has(e.source)) {
        nodeMap.add(e.source);
        let color = '#06b6d4';
        if (e.sourceType === 'Faculty') color = '#f59e0b';
        if (e.sourceType === 'Project') color = '#6366f1';

        nodes.push({
          id: e.source,
          name: e.sourceName,
          type: e.sourceType,
          color
        });
      }
    });

    return {
      nodes,
      links: edges
    };
  }
};
