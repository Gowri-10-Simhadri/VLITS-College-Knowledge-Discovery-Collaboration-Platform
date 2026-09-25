import express from 'express';
import { dataStore } from '../data/store.js';

const router = express.Router();

// Helper to extract all datasets and college lab resources
const getAllResources = async () => {
  const { projects } = await dataStore.getProjects({}, '-createdAt', 1, 100);
  
  const resources = [
    {
      _id: 'res_lab_nvidia',
      name: 'NVIDIA DGX A100 AI Compute Cluster',
      type: 'Lab Infrastructure',
      category: 'Computing Cluster',
      description: 'High-performance GPU cluster featuring 4x NVIDIA A100 80GB GPUs reserved for deep learning model training, computer vision benchmarks, and LLM fine-tuning.',
      domain: 'AI & Machine Learning',
      location: 'CSE Department - Advanced AI & Robotics Research Lab (Lab 402)',
      accessLevel: 'Students & Faculty with approved capstone proposals',
      documentationUrl: 'https://developer.nvidia.com/dgx-a100',
      technologies: ['PyTorch', 'TensorFlow', 'CUDA', 'Docker', 'Kubernetes'],
      relatedProjects: projects.filter(p => p.domain === 'AI & Machine Learning' || p.techStack?.includes('PyTorch')).slice(0, 3)
    },
    {
      _id: 'res_lab_iot',
      name: 'VLITS Smart IoT & Embedded Systems Workbench',
      type: 'Lab Infrastructure',
      category: 'Hardware Workbench',
      description: 'Equipped with ESP32-S3 modules, Raspberry Pi 4 Model B, LoRaWAN gateways, digital storage oscilloscopes, logic analyzers, and multi-sensor environmental testbeds.',
      domain: 'Internet of Things (IoT)',
      location: 'ECE Department - Embedded Systems Innovation Lab (Lab 205)',
      accessLevel: 'Open to ECE, CSE & IT Capstone Teams',
      documentationUrl: 'https://www.espressif.com/en/products/socs/esp32',
      technologies: ['ESP32', 'Raspberry Pi', 'LoRaWAN', 'MQTT', 'C++'],
      relatedProjects: projects.filter(p => p.domain === 'Internet of Things (IoT)' || p.techStack?.includes('ESP32')).slice(0, 3)
    },
    {
      _id: 'res_lab_block',
      name: 'VLITS Decentralized Blockchain Testnet Node',
      type: 'Lab Infrastructure',
      category: 'Blockchain Node',
      description: 'Private Ethereum proof-of-authority testnet cluster and Polygon testnet oracle node for smart contract deployment, academic credential verification, and decentralized audit trials.',
      domain: 'Blockchain & Web3',
      location: 'IT Department - Distributed Systems Center (Lab 308)',
      accessLevel: 'All registered VLITS students & researchers',
      documentationUrl: 'https://ethereum.org/en/developers/docs/',
      technologies: ['Solidity', 'Hardhat', 'Ethers.js', 'IPFS'],
      relatedProjects: projects.filter(p => p.domain === 'Blockchain & Web3' || p.techStack?.includes('Solidity')).slice(0, 3)
    }
  ];

  const seenDatasets = new Set();
  projects.forEach((p, pIdx) => {
    p.datasets?.forEach((ds, dIdx) => {
      const cleanName = (ds.name || '').trim();
      if (!cleanName || seenDatasets.has(cleanName.toLowerCase())) return;
      seenDatasets.add(cleanName.toLowerCase());

      const dsId = `dataset_${p._id}_${dIdx}`;
      resources.push({
        _id: dsId,
        name: cleanName,
        type: 'Dataset',
        category: 'Open Academic Dataset',
        description: ds.description || `Curated high-resolution dataset benchmarked for ${p.domain} research, preprocessing pipelines, and evaluation metrics in the ${p.title} project.`,
        domain: p.domain || 'Computer Science & Engineering',
        sourceUrl: ds.url && ds.url.startsWith('http') ? ds.url : 'https://www.kaggle.com/datasets',
        format: ds.format || 'CSV / JSON / HDF5 / Image TAR',
        size: ds.size || '1.2 GB - 15,000+ Annotated Samples',
        technologies: p.techStack || ['Python', 'Pandas'],
        relatedProjects: [
          { _id: p._id, title: p.title, domain: p.domain, year: p.year, thumbnail: p.thumbnail }
        ]
      });
    });
  });

  return resources;
};

// GET /api/resources - List all datasets and college lab resources
router.get('/', async (req, res) => {
  try {
    const { type, domain, search } = req.query;
    let resources = await getAllResources();

    if (type && type !== 'All Types') {
      resources = resources.filter(r => r.type.toLowerCase() === type.toLowerCase());
    }

    if (domain && domain !== 'All Domains') {
      resources = resources.filter(r => r.domain.toLowerCase() === domain.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      resources = resources.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.domain.toLowerCase().includes(q) ||
        r.technologies?.some(t => t.toLowerCase().includes(q))
      );
    }

    return res.json({
      total: resources.length,
      resources
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return res.status(500).json({ message: 'Failed to fetch resources and datasets.' });
  }
});

// GET /api/resources/:id - Single resource/dataset detail
router.get('/:id', async (req, res) => {
  try {
    const resources = await getAllResources();
    const resource = resources.find(r => r._id === req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource or dataset not found in college catalog.' });
    }

    return res.json(resource);
  } catch (error) {
    console.error('Error fetching resource detail:', error);
    return res.status(500).json({ message: 'Failed to fetch resource detail.' });
  }
});

export default router;
