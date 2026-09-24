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
    if (projectCount === 0) {
      console.log(`🌱 [MongoDB Atlas] Database is empty. Seeding initial capstones, users & knowledge graph...`);
      
      // Seed Users
      await User.deleteMany({});
      await User.insertMany(sampleUsers);
      console.log(`✓ Seeded ${sampleUsers.length} Users into Atlas`);

      // Seed Skills
      await Skill.deleteMany({});
      await Skill.insertMany(sampleSkills);
      console.log(`✓ Seeded ${sampleSkills.length} Skills into Atlas`);

      // Seed Projects
      await Project.deleteMany({});
      await Project.insertMany(initialProjects);
      console.log(`✓ Seeded ${initialProjects.length} Capstone Projects into Atlas`);

      // Seed Knowledge Edges
      const edges = generateEdgesFromProjects(initialProjects, sampleUsers);
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
      console.log(`✓ Seeded ${formattedEdges.length} Knowledge Graph Edges into Atlas`);

      console.log(`✨ [MongoDB Atlas] Database initialization and seeding complete!`);
    } else {
      console.log(`ℹ️ [MongoDB Atlas] Found ${projectCount} existing projects in Atlas cluster.`);
    }
  } catch (err) {
    console.error(`⚠️ [MongoDB Atlas Seed Warning]:`, err.message);
  }
}
