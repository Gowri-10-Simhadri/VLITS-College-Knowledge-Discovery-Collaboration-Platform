import mongoose from 'mongoose';

const collaborationRequestSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  senderId: { type: String, required: true, index: true },
  senderName: { type: String, required: true },
  senderEmail: { type: String, required: true },
  senderRole: { type: String, default: 'student' },
  senderAvatar: { type: String, default: '' },
  
  recipientId: { type: String, required: true, index: true },
  recipientName: { type: String, required: true },
  recipientEmail: { type: String, required: true },
  recipientRole: { type: String, default: 'student' },
  
  projectTitle: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending',
    index: true
  },
  responseNote: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

export const CollaborationRequest = mongoose.models.CollaborationRequest || mongoose.model('CollaborationRequest', collaborationRequestSchema);
