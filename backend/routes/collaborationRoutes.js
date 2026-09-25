import express from 'express';
import { CollaborationRequest } from '../models/CollaborationRequest.js';
import { User } from '../models/User.js';
import { dataStore } from '../data/store.js';
import { protect } from '../middleware/authMiddleware.js';
import { getDbStatus } from '../config/db.js';

const router = express.Router();

// In-memory store fallback if MongoDB Atlas is briefly offline
let inMemoryRequests = [
  {
    _id: 'collab_seed_1',
    senderId: 'user_std_01',
    senderName: 'Venkata Sai Teja M.',
    senderEmail: 'saiteja.vignan@gmail.com',
    senderRole: 'student',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    recipientId: 'user_std_02',
    recipientName: 'Lakshmi Priya K.',
    recipientEmail: 'lakshmi.priya@vignanlara.edu',
    recipientRole: 'student',
    projectTitle: 'Smart Autonomous Irrigation System',
    message: 'Hi Lakshmi! We are scaling up our IoT sensor array with solar panels and LoRaWAN gateways. Would love your hardware & embedded systems expertise!',
    status: 'pending',
    responseNote: '',
    createdAt: new Date(Date.now() - 3600000 * 24)
  },
  {
    _id: 'collab_seed_2',
    senderId: 'user_std_03',
    senderName: 'Rohit Varma G.',
    senderEmail: 'rohit.varma@vignanlara.edu',
    senderRole: 'student',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    recipientId: 'user_std_01',
    recipientName: 'Venkata Sai Teja M.',
    recipientEmail: 'saiteja.vignan@gmail.com',
    recipientRole: 'student',
    projectTitle: 'AI Drone Forest Surveillance',
    message: 'Hello Teja! Can we integrate your YOLOv8 edge inference pipeline into our quadcopter thermal video stream?',
    status: 'accepted',
    responseNote: 'Great idea Rohit! Let us sync up in the AI Lab this Thursday.',
    createdAt: new Date(Date.now() - 3600000 * 48)
  }
];

// POST /api/collaborations - Dispatch a new collaboration request
router.post('/', protect, async (req, res) => {
  try {
    const { recipientId, projectTitle, message } = req.body;

    if (!recipientId || !projectTitle || !message) {
      return res.status(400).json({ message: 'Recipient ID, Project Title, and Message are required.' });
    }

    const recipient = await dataStore.findUserById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient user not found in college directory.' });
    }

    const newRequest = {
      _id: `collab_${Date.now()}`,
      senderId: req.user._id,
      senderName: req.user.name,
      senderEmail: req.user.email,
      senderRole: req.user.role || 'student',
      senderAvatar: req.user.avatar || '',
      recipientId: recipient._id,
      recipientName: recipient.name,
      recipientEmail: recipient.email,
      recipientRole: recipient.role || 'student',
      projectTitle,
      message,
      status: 'pending',
      responseNote: '',
      createdAt: new Date()
    };

    const { isConnected } = getDbStatus();
    if (isConnected) {
      try {
        const created = await CollaborationRequest.create(newRequest);
        return res.status(201).json({
          success: true,
          message: `Collaboration invite sent to ${recipient.name}!`,
          collaboration: created
        });
      } catch (err) {
        console.error('Atlas error saving collaboration request:', err.message);
      }
    }

    inMemoryRequests.unshift(newRequest);
    return res.status(201).json({
      success: true,
      message: `Collaboration invite sent to ${recipient.name}!`,
      collaboration: newRequest
    });
  } catch (error) {
    console.error('Error dispatching collaboration request:', error);
    return res.status(500).json({ message: 'Failed to dispatch collaboration request.' });
  }
});

// GET /api/collaborations/my - Get incoming & outgoing collaboration requests for authenticated user
router.get('/my', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email;

    const { isConnected } = getDbStatus();
    if (isConnected) {
      try {
        const requests = await CollaborationRequest.find({
          $or: [
            { recipientId: userId },
            { recipientEmail: userEmail },
            { senderId: userId },
            { senderEmail: userEmail }
          ]
        }).sort({ createdAt: -1 }).lean();

        const incoming = requests.filter(r => r.recipientId === userId || r.recipientEmail === userEmail);
        const outgoing = requests.filter(r => r.senderId === userId || r.senderEmail === userEmail);

        return res.json({ incoming, outgoing, all: requests });
      } catch (err) {
        console.error('Atlas error fetching collaborations:', err.message);
      }
    }

    const incoming = inMemoryRequests.filter(r => r.recipientId === userId || r.recipientEmail === userEmail);
    const outgoing = inMemoryRequests.filter(r => r.senderId === userId || r.senderEmail === userEmail);

    return res.json({ incoming, outgoing, all: inMemoryRequests });
  } catch (error) {
    console.error('Error fetching user collaborations:', error);
    return res.status(500).json({ message: 'Failed to fetch collaboration invites.' });
  }
});

// PATCH /api/collaborations/:id - Accept / Reject request
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status, responseNote } = req.body;
    if (!['accepted', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be accepted, rejected, or pending.' });
    }

    const { isConnected } = getDbStatus();
    if (isConnected) {
      try {
        const request = await CollaborationRequest.findById(req.params.id);
        if (!request) {
          return res.status(404).json({ message: 'Collaboration request not found.' });
        }

        // Verify recipient permission
        if (request.recipientId !== req.user._id && request.recipientEmail !== req.user.email && req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Unauthorized to respond to this request.' });
        }

        request.status = status;
        if (responseNote !== undefined) request.responseNote = responseNote;
        await request.save();

        return res.json({
          success: true,
          message: `Collaboration request has been marked as ${status}.`,
          collaboration: request
        });
      } catch (err) {
        console.error('Atlas error updating collaboration request:', err.message);
      }
    }

    const reqIdx = inMemoryRequests.findIndex(r => r._id === req.params.id);
    if (reqIdx === -1) {
      return res.status(404).json({ message: 'Collaboration request not found.' });
    }

    inMemoryRequests[reqIdx].status = status;
    if (responseNote !== undefined) inMemoryRequests[reqIdx].responseNote = responseNote;

    return res.json({
      success: true,
      message: `Collaboration request has been marked as ${status}.`,
      collaboration: inMemoryRequests[reqIdx]
    });
  } catch (error) {
    console.error('Error updating collaboration request:', error);
    return res.status(500).json({ message: 'Failed to update collaboration request.' });
  }
});

export default router;
