# 🎓 Vignan's Lara College Knowledge Discovery & Collaboration Platform (VLITS Living Memory)

[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20Glassmorphism-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![JWT Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-FF4F8B)](https://jwt.io/)

A digital **Living Knowledge Memory and Discovery System** designed for **Vignan's Lara Institute of Technology & Science (VLITS)**.

Instead of student capstone projects and research disappearing when batches graduate, this platform **captures, connects, preserves, and reuses** the accumulated knowledge of students, faculty, projects, datasets, research papers, and technical hurdles over multiple years.

---

## 🌟 Core Problem It Solves

- **Graduation Knowledge Drain**: When senior students graduate, their source code, dataset links, and hard-earned solutions to complex bugs are lost.
- **Repetitive Work**: Incoming juniors often spend months solving the same challenges or building duplicate basic projects from scratch.
- **Siloed Research**: Students struggle to find which professors specialize in their target domain and which peers have matching complementary skills.

### 💡 The Solution: Multi-Hop Knowledge Discovery

When a student searches an idea like:
> *"I want to build an AI-based traffic accident detection system"*

The system executes a multi-hop traversal over the college knowledge graph to reveal:
1. **Similar Capstones**: Real-Time Traffic Accident Detection (Batch 2020-2024).
2. **Reusable Datasets**: Campus Junction & Urban Roadway Crash Dataset (14.2 GB).
3. **Cited Research Papers**: IEEE Transactions on Intelligent Transportation Systems publications.
4. **Documented Pitfalls & Solved Bugs**: Headlight glare fix via CLAHE gamma normalization, edge inference latency reduction from 450ms to 42ms via TensorRT INT8 quantization.
5. **Supervising Faculty Mentors**: Dr. Ramesh Kumar (Vision AI Lab).
6. **Student Collaborators**: Peers with verified skills in Computer Vision, PyTorch, and React.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 18, Vite | Component UI, fast HMR, responsive SPA |
| **Styling** | Tailwind CSS v3 | Glassmorphism design (`backdrop-filter: blur(16px)`), deep navy `#070913` |
| **State Management** | Zustand | Lightweight store for auth, bookmarks, and compare matrix |
| **Icons & Motion** | Lucide React, Framer Motion, Canvas-Confetti | Micro-animations and celebratory particle bursts |
| **Backend** | Node.js, Express.js | REST API, static asset server, SPA catch-all |
| **Database** | MongoDB Atlas (Cloud) | Multi-entity schemas (Projects, Users, Skills, KnowledgeEdges) |
| **Auth** | JSON Web Tokens (JWT) + Bcrypt | Secure role-based auth (Student / Faculty) with one-click demo login |

---

## 🛒 Amazon & Flipkart UX Patterns Implemented

- ⭐ **Star Ratings (1–5) & Reviews**: Verified peer feedback and notes on code/dataset reuse.
- ❤️ **Wishlist / Saved Capstones (`/bookmarks`)**: One-click bookmarking of projects and datasets.
- ⚖️ **Side-by-Side Comparison Matrix (`/compare`)**: Compare up to 3 projects side-by-side across architectures, datasets, and solved hurdles.
- 🔍 **Autocomplete Search Bar**: Real-time suggestion dropdown.
- 🏷️ **Multi-Facet Filter Sidebar**: Filter by Research Domain, Academic Year, Batch, and Tech Stack.
- 📱 **Mobile-First UX**: Responsive layouts with sticky **Mobile Bottom Navigation Bar** (`Home`, `Discover`, `Publish`, `Graph`, `Mentors`).

---

## 🚀 Quick Start & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Gowri-10-Simhadri/VLITS-College-Knowledge-Discovery-Collaboration-Platform.git
cd VLITS-College-Knowledge-Discovery-Collaboration-Platform
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory (see `backend/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/college_knowledge_discovery?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### 3. Install Dependencies & Start

#### Backend:
```bash
cd backend
npm install
node server.js
```
*API runs on `http://localhost:5000`*

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```
*Web App runs on `http://localhost:3000`*

---

## 📁 Project Structure

```
VLITS-College-Knowledge-Discovery-Collaboration-Platform/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas cloud connection & auto-seed
│   ├── data/
│   │   ├── seedData.js           # Pre-seeded capstones, datasets & faculty
│   │   └── store.js              # Knowledge graph traversal & data layer
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT protection & token verification
│   ├── models/
│   │   ├── User.js               # Student & Faculty profiles
│   │   ├── Project.js            # Capstone projects & knowledge capture matrix
│   │   ├── Skill.js              # Skill ontology
│   │   └── KnowledgeEdge.js      # Graph relationship edges
│   ├── routes/
│   │   ├── authRoutes.js         # Register, Login, Demo accounts
│   │   ├── projectRoutes.js      # Projects CRUD, Reviews, Wishlist, Compare
│   │   ├── searchRoutes.js       # AI discovery engine & path generator
│   │   ├── graphRoutes.js        # Topology nodes, links & stats
│   │   └── userRoutes.js         # Collaborator matching & profiles
│   ├── server.js                 # Unified Express API & Web Server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js         # Axios instance with adaptive routing & JWT
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Glassmorphism header + autocomplete
│   │   │   ├── MobileBottomNav.jsx # Mobile navigation bar
│   │   │   ├── ProjectCard.jsx   # E-commerce style project card
│   │   │   ├── KnowledgePathVisualizer.jsx # Multi-hop discovery chain
│   │   │   ├── CompareDrawer.jsx # Floating comparison bar
│   │   │   └── AuthModal.jsx     # One-click demo login modal
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Hero search, live stats & domain browser
│   │   │   ├── Discover.jsx      # Multi-tab discovery with filter sidebar
│   │   │   ├── ProjectDetail.jsx # Knowledge capture matrix & reviews
│   │   │   ├── KnowledgeGraph.jsx # Interactive topology explorer
│   │   │   ├── SubmitProject.jsx # 4-step capstone publishing wizard
│   │   │   ├── Compare.jsx       # Side-by-side comparison table
│   │   │   ├── Collaborators.jsx # Student & faculty talent directory
│   │   │   ├── Bookmarks.jsx     # Wishlist of saved capstones
│   │   │   └── Profile.jsx       # Student & faculty portfolio
│   │   ├── store/
│   │   │   ├── useAuthStore.js   # User state & bookmarks
│   │   │   └── useCompareStore.js# Compare list state
│   │   ├── App.jsx               # Main React router
│   │   └── index.css             # Glassmorphism design tokens
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🌐 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status & college metadata |
| `GET` | `/api/discover?q=...` | Multi-hop knowledge discovery engine |
| `GET` | `/api/projects` | List projects with filters, sort, and pagination |
| `GET` | `/api/projects/:id` | Single project with related capstones |
| `POST` | `/api/projects` | Publish new capstone with knowledge capture |
| `POST` | `/api/projects/:id/reviews` | Submit star rating and written review |
| `POST` | `/api/projects/:id/bookmark` | Toggle saved wishlist |
| `GET` | `/api/graph` | Fetch all knowledge graph nodes and edges |
| `GET` | `/api/graph/stats` | College knowledge metrics and reuse index |
| `GET` | `/api/users/collaborators` | Filter students by skills for teaming |
| `POST` | `/api/auth/demo-login` | One-click student or faculty login |

---

## 🚢 Deployment Guide

### Deploying to Render / Railway / Heroku (Full-Stack Single Service)
1. Set the Root Directory to repository root.
2. Build Command: `npm run build`
3. Start Command: `npm start`
4. Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Secret key for JWT signing
   - `NODE_ENV`: `production`

---

## 📄 License
MIT License &copy; 2026 Gowri Simhadri — Vignan's Lara Institute of Technology & Science (VLITS).
