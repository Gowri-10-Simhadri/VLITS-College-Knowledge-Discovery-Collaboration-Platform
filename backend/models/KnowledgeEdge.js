import mongoose from 'mongoose';

const knowledgeEdgeSchema = new mongoose.Schema({
  sourceType: { 
    type: String, 
    required: true,
    enum: ['Project', 'Student', 'Faculty', 'Skill', 'Technology', 'Dataset', 'ResearchPaper', 'Problem']
  },
  sourceId: { type: String, required: true },
  sourceName: { type: String, required: true },
  
  targetType: { 
    type: String, 
    required: true,
    enum: ['Project', 'Student', 'Faculty', 'Skill', 'Technology', 'Dataset', 'ResearchPaper', 'Problem', 'Solution']
  },
  targetId: { type: String, required: true },
  targetName: { type: String, required: true },
  
  relationship: { 
    type: String, 
    required: true,
    enum: [
      'USES_TECH',
      'REQUIRES_SKILL',
      'HAS_SKILL',
      'WORKED_ON',
      'SUPERVISED',
      'UTILIZES_DATASET',
      'CITED_PAPER',
      'FACED_PROBLEM',
      'SOLVED_WITH',
      'EXTENDS_PROJECT',
      'COLLABORATED_WITH'
    ]
  },
  weight: { type: Number, default: 1.0 },
  metadata: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

export const KnowledgeEdge = mongoose.models.KnowledgeEdge || mongoose.model('KnowledgeEdge', knowledgeEdgeSchema);
