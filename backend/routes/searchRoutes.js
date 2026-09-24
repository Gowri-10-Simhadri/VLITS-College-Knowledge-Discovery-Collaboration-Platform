import express from 'express';
import { dataStore } from '../data/store.js';

const router = express.Router();

// GET /api/search/suggestions - Autocomplete quick search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q = '' } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json([
        'AI Traffic Accident Detection',
        'Crop Disease Diagnosis using Computer Vision',
        'Epileptic Seizure Prediction EEG',
        'Blockchain Academic Credentials',
        'Smart Campus Energy Optimization IoT',
        'Whisper Multilingual Speech Translation'
      ]);
    }

    const query = q.toLowerCase();
    const all = await dataStore.getProjects({}, '-views', 1, 50);
    const suggestions = new Set();

    all.projects.forEach(p => {
      if (p.title.toLowerCase().includes(query)) suggestions.add(p.title);
      if (p.domain.toLowerCase().includes(query)) suggestions.add(p.domain);
      p.techStack?.forEach(t => {
        if (t.toLowerCase().includes(query)) suggestions.add(t);
      });
      p.skillsRequired?.forEach(s => {
        if (s.toLowerCase().includes(query)) suggestions.add(s);
      });
    });

    return res.json(Array.from(suggestions).slice(0, 8));
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching suggestions.' });
  }
});

// GET /api/discover - The Core College Knowledge Discovery Engine
router.get('/', async (req, res) => {
  try {
    const { q = '' } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Query string `q` is required for knowledge discovery.' });
    }

    const query = q.toLowerCase();
    const allProjectsData = await dataStore.getProjects({}, '-createdAt', 1, 100);
    const allProjects = allProjectsData.projects;
    const allUsers = await dataStore.getUsers();

    // 1. Keyword & Entity Extraction
    const keywords = query.split(/\s+/).filter(w => w.length > 2);
    
    // 2. Score Projects based on semantic relevance
    const scoredProjects = allProjects.map(proj => {
      let score = 0;
      const matchedReasons = [];

      // Title match (high weight)
      if (proj.title.toLowerCase().includes(query)) {
        score += 30;
        matchedReasons.push('Direct title match');
      } else {
        keywords.forEach(kw => {
          if (proj.title.toLowerCase().includes(kw)) {
            score += 10;
            matchedReasons.push(`Title matches "${kw}"`);
          }
        });
      }

      // Domain match
      if (proj.domain.toLowerCase().includes(query) || keywords.some(kw => proj.domain.toLowerCase().includes(kw))) {
        score += 15;
        matchedReasons.push(`Domain: ${proj.domain}`);
      }

      // Tech Stack match
      const matchingTech = proj.techStack?.filter(t => 
        query.includes(t.toLowerCase()) || keywords.some(kw => t.toLowerCase().includes(kw))
      ) || [];
      if (matchingTech.length > 0) {
        score += matchingTech.length * 8;
        matchedReasons.push(`Uses technologies: ${matchingTech.join(', ')}`);
      }

      // Skills match
      const matchingSkills = proj.skillsRequired?.filter(s => 
        query.includes(s.toLowerCase()) || keywords.some(kw => s.toLowerCase().includes(kw))
      ) || [];
      if (matchingSkills.length > 0) {
        score += matchingSkills.length * 8;
        matchedReasons.push(`Requires skills: ${matchingSkills.join(', ')}`);
      }

      // Problems & Lessons match
      proj.problemsFaced?.forEach(pf => {
        if (keywords.some(kw => pf.problem.toLowerCase().includes(kw) || pf.solution.toLowerCase().includes(kw))) {
          score += 12;
          matchedReasons.push(`Solved previous issue: "${pf.problem.slice(0, 50)}..."`);
        }
      });

      return {
        project: proj,
        score,
        matchedReasons
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

    const topProjects = scoredProjects.slice(0, 6).map(item => ({
      ...item.project,
      discoveryScore: item.score,
      matchedReasons: item.matchedReasons
    }));

    // 3. Extract Connected Datasets from relevant projects
    const connectedDatasets = [];
    const datasetSet = new Set();
    topProjects.forEach(p => {
      p.datasets?.forEach(ds => {
        if (!datasetSet.has(ds.name)) {
          datasetSet.add(ds.name);
          connectedDatasets.push({
            ...ds,
            usedInProjectTitle: p.title,
            usedInProjectId: p._id,
            year: p.year
          });
        }
      });
    });

    // 4. Extract Connected Research Papers
    const connectedPapers = [];
    const paperSet = new Set();
    topProjects.forEach(p => {
      p.researchPapers?.forEach(rp => {
        if (!paperSet.has(rp.title)) {
          paperSet.add(rp.title);
          connectedPapers.push({
            ...rp,
            citedInProjectTitle: p.title,
            citedInProjectId: p._id
          });
        }
      });
    });

    // 5. Extract Previous Problems & Solutions
    const previousSolutions = [];
    topProjects.forEach(p => {
      p.problemsFaced?.forEach(pf => {
        previousSolutions.push({
          problem: pf.problem,
          solution: pf.solution,
          approach: pf.approach,
          tags: pf.tags,
          projectTitle: p.title,
          projectId: p._id,
          year: p.year
        });
      });
    });

    // 6. Find Students with Complementary Skills
    const topSkills = Array.from(new Set(topProjects.flatMap(p => p.skillsRequired || [])));
    const matchingStudents = allUsers
      .filter(u => u.role === 'student')
      .map(st => {
        const studentSkills = st.skills?.map(s => s.name.toLowerCase()) || [];
        const matches = topSkills.filter(ts => studentSkills.includes(ts.toLowerCase()));
        return {
          student: st,
          matchCount: matches.length,
          matchingSkills: matches
        };
      })
      .filter(item => item.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 4)
      .map(item => ({
        ...item.student,
        matchedSkills: item.matchingSkills
      }));

    // 7. Find Faculty Supervisors in this domain
    const connectedFaculty = Array.from(
      new Map(topProjects.map(p => [p.facultySupervisor?.name, p.facultySupervisor])).values()
    ).filter(Boolean);

    // 8. Generate Visual Discovery Path
    const primaryProject = topProjects[0];
    const discoveryPath = [
      { step: 1, label: 'Search Idea', value: q, type: 'query' },
      { step: 2, label: 'Domain', value: primaryProject ? primaryProject.domain : 'Cross-Disciplinary AI', type: 'domain' },
      { step: 3, label: 'Related College Project', value: primaryProject ? primaryProject.title : 'None found', type: 'project', id: primaryProject?._id },
      { step: 4, label: 'Core Technology', value: primaryProject?.techStack?.[0] || 'PyTorch', type: 'tech' },
      { step: 5, label: 'College Dataset', value: connectedDatasets[0]?.name || 'Internal Benchmark Data', type: 'dataset' },
      { step: 6, label: 'Faculty Expert', value: primaryProject?.facultySupervisor?.name || 'Dr. Ramesh Kumar', type: 'faculty' },
      { step: 7, label: 'Reusable Opportunity', value: primaryProject?.futureImprovements || 'Extend algorithm to multi-agent edge nodes', type: 'opportunity' }
    ];

    return res.json({
      query: q,
      totalMatches: topProjects.length,
      discoveryPath,
      projects: topProjects,
      datasets: connectedDatasets,
      researchPapers: connectedPapers,
      previousSolutions,
      students: matchingStudents,
      faculty: connectedFaculty,
      suggestedNextSteps: [
        `Review the lessons learned in ${primaryProject?.title || 'related capstones'}`,
        `Explore dataset "${connectedDatasets[0]?.name || 'recommended dataset'}" before starting data collection`,
        `Connect with ${matchingStudents[0]?.name || 'students'} who have hands-on experience in ${topSkills[0] || 'this domain'}`
      ]
    });
  } catch (error) {
    console.error('Discovery Engine Error:', error);
    return res.status(500).json({ message: 'Discovery engine failed to process query.' });
  }
});

export default router;
