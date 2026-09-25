import mongoose from 'mongoose';
import dns from 'dns';
import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { KnowledgeEdge } from '../models/KnowledgeEdge.js';
import { initialProjects, sampleUsers, sampleSkills } from '../data/seedData.js';
import { generateEdgesFromProjects } from '../data/store.js';

// Resolve MongoDB SRV records via Google & Cloudflare Public DNS to prevent local Windows ECONNREFUSED
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch (e) {}

let isConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://simhadrilakshmigowri_db_user:dZTEFJqrRinVUhJc@cluster0.m0dngy2.mongodb.net/college_knowledge_discovery?retryWrites=true&w=majority';
  
  try {
    console.log(`[MongoDB Atlas] Connecting to Cloud Cluster: ${mongoURI.split('@')[1] || 'Cluster0'}...`);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000,
    });
    isConnected = true;
    console.log(`✅ [MongoDB Atlas] Successfully Connected! Database Host: ${conn.connection.host}`);
    console.log(`📦 [MongoDB Atlas] Database Name: ${conn.connection.name}`);

    // Auto-seed Atlas database if empty
    await seedAtlasIfEmpty();

  } catch (error) {
    console.error(`❌ [MongoDB Atlas Error] Connection Failed:`, error.message);
  }
};

export const getDbStatus = () => ({
  isConnected,
  isInMemoryFallback: !isConnected
});

async function seedAtlasIfEmpty() {
  try {
    const projectCount = await Project.countDocuments();
    
    // Ensure sample users exist in Atlas
    for (const u of sampleUsers) {
      const exists = await User.findById(u._id);
      if (!exists) {
        await User.create(u);
      }
    }
    console.log(`✓ Synchronized ${sampleUsers.length} Student & Faculty users with Atlas`);

    // Ensure sample skills exist in Atlas
    for (const sk of sampleSkills) {
      const exists = await Skill.findOne({ name: sk.name });
      if (!exists) {
        await Skill.create({
          _id: `skill_${sk.name.toLowerCase().replace(/\s+/g, '_')}`,
          name: sk.name,
          category: sk.category,
          description: sk.description,
          icon: sk.icon,
          color: sk.color,
          relatedTech: sk.relatedTech || []
        });
      }
    }
    console.log(`✓ Synchronized ${sampleSkills.length} Verified Skills with Atlas`);

    // Ensure initial projects exist in Atlas
    for (const p of initialProjects) {
      const exists = await Project.findById(p._id);
      if (!exists) {
        await Project.create(p);
      }
    }
    console.log(`✓ Synchronized ${initialProjects.length} Foundation Capstones with Atlas`);

    // Re-generate Knowledge Edges
    const allProjects = await Project.find({}).lean();
    const allUsers = await User.find({}).lean();
    const edges = generateEdgesFromProjects(allProjects, allUsers);
    
    await KnowledgeEdge.deleteMany({});
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
    console.log(`✓ Generated & Synchronized ${formattedEdges.length} Knowledge Graph Edges into Atlas`);

    console.log(`✨ [MongoDB Atlas] College Knowledge Ecosystem is 100% active and synchronized!`);
  } catch (err) {
    console.error(`⚠️ [MongoDB Atlas Sync Warning]:`, err.message);
  }
}
