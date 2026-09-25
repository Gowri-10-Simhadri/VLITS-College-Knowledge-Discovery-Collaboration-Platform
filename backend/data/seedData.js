export const initialProjects = [
  {
    _id: "proj_01",
    title: "AI-Powered Real-Time Traffic Accident Detection & Emergency Dispatch System",
    tagline: "Vision-based edge computing pipeline for instant crash localization and automated dispatching",
    description: "An automated traffic surveillance system deployed on edge NVIDIA Jetson nodes that analyzes RTSP video streams from college campus and urban junctions to detect collisions, vehicle fires, and anomalies in under 200ms.",
    detailedOverview: "Built as an end-to-end multi-camera tracking system. Utilizes YOLOv8 fine-tuned on custom Indian roadway traffic datasets, combined with DeepSORT for vehicle trajectory tracking and optical flow vectors to recognize sudden decelerations and impacts. Integrates Twilio SMS and SOS geofence alerts directly to campus security and the nearest medical trauma center.",
    domain: "Computer Vision & Image Processing",
    year: 2024,
    batch: "2020-2024",
    semester: "8th Semester / Final Year Capstone",
    techStack: ["PyTorch", "YOLOv8", "OpenCV", "DeepSORT", "FastAPI", "React", "Docker", "NVIDIA TensorRT"],
    skillsRequired: ["Computer Vision", "Deep Learning", "Edge AI", "Embedded Linux", "Object Tracking"],
    datasets: [
      {
        name: "Campus Junction & Urban Roadway Crash Dataset",
        source: "College CCTV Network & Kaggle Road Accidents",
        size: "14.2 GB (32,000 labeled frames)",
        format: "YOLO TXT & MP4",
        link: "https://huggingface.co/datasets/college-traffic-cv",
        description: "Labeled bounding boxes and collision polygon coordinates across daylight, night-time, rain, and fog conditions."
      },
      {
        name: "CADP (Car Accident Detection Dataset)",
        source: "IEEE Dataport",
        size: "6.8 GB",
        format: "VOC XML",
        link: "https://ieee-dataport.org/open-access/cadp",
        description: "Annotated video segments of collision sequences."
      }
    ],
    researchPapers: [
      {
        title: "Spatial-Temporal Graph Convolutional Networks for Traffic Incident Detection",
        authors: "Dr. Ramesh Kumar, Gowri Simhadri, K. Pranav",
        conferenceJournal: "IEEE Transactions on Intelligent Transportation Systems",
        year: 2023,
        link: "https://ieeexplore.ieee.org/document/example-traffic-cv",
        doi: "10.1109/TITS.2023.109283"
      }
    ],
    problemsFaced: [
      {
        problem: "Severe false positive rate at night due to high-beam headlight glare and street reflections.",
        solution: "Implemented Contrast Limited Adaptive Histogram Equalization (CLAHE) and dual IR sensor thresholding before optical flow computation.",
        approach: "Preprocessing filter pipeline in OpenCV with dynamic gamma correction.",
        tags: ["Night Vision", "CLAHE", "Preprocessing"]
      },
      {
        problem: "Inference latency exceeded 450ms per frame on edge Jetson Nano when running raw PyTorch weights.",
        solution: "Quantized the model to INT8 precision using NVIDIA TensorRT and pruned redundant convolution channels, dropping latency to 42ms (24 FPS).",
        approach: "TensorRT post-training quantization with calibration cache.",
        tags: ["TensorRT", "Edge Optimization", "Latency"]
      }
    ],
    lessonsLearned: "Always account for adverse weather conditions and illumination variances early in the dataset collection phase. Edge computing requires strict memory bandwidth budgeting.",
    futureImprovements: "Extend the pipeline to recognize pedestrian near-misses and integrate V2X (Vehicle-to-Everything) beacon broadcasts for oncoming smart vehicles.",
    keyTakeaways: [
      "TensorRT acceleration gives 10x throughput improvement on Jetson hardware.",
      "CLAHE preprocessing eliminates 80% of headlight glare false triggers."
    ],
    teamMembers: [
      {
        name: "Gowri Simhadri",
        role: "Lead Vision AI Engineer",
        email: "gowri@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Aditya Sharma",
        role: "Computer Vision & Model Optimization",
        email: "aditya.s@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Sneha Reddy",
        role: "Backend & Edge Deployment Engineer",
        email: "sneha.r@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
      }
    ],
    facultySupervisor: {
      name: "Dr. Ramesh Kumar",
      department: "Computer Science & Engineering",
      designation: "Professor & Head of Vision AI Lab",
      email: "ramesh.kumar@college.edu"
    },
    githubLink: "https://github.com/college-ai/traffic-crash-detection",
    liveDemoLink: "https://traffic-ai-demo.college.edu",
    reportDocLink: "https://docs.college.edu/capstone/2024/traffic-ai-final.pdf",
    presentationLink: "https://slides.college.edu/2024/traffic-ai.pdf",
    thumbnail: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80"
    ],
    views: 1420,
    bookmarksCount: 88,
    likesCount: 215,
    rating: { average: 4.9, count: 24 },
    reviews: [
      {
        userId: "user_02",
        userName: "Priya Nair",
        userRole: "student",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        rating: 5,
        comment: "We reused your night-time CLAHE preprocessing approach for our drone surveillance capstone! Saved us 3 weeks of debugging.",
        createdAt: new Date("2024-04-12")
      }
    ],
    status: "Completed",
    isVerified: true,
    isFeatured: true,
    badge: "🏆 Best Capstone Award 2024"
  },
  {
    _id: "proj_02",
    title: "AgriVision: Edge AI Multispectral Drone Imaging for Early Crop Disease Diagnosis",
    tagline: "Autonomous drone pipeline diagnosing early bacterial blight and nutrient deficiencies in paddy & chili crops",
    description: "An automated aerial surveying system utilizing DJI Matrice drones fitted with custom raspberry pi multispectral cameras to compute NDVI indexes and predict leaf blight 10 days before visible symptoms appear.",
    detailedOverview: "Addresses high crop yield losses in Andhra Pradesh agricultural belts. Trained Vision Transformers (ViT) on 45,000 drone-captured multispectral images of paddy, cotton, and chili crops. Integrated with LoRaWAN soil moisture gateways across college experimental farms.",
    domain: "Smart Agriculture & Environment",
    year: 2024,
    batch: "2020-2024",
    semester: "8th Semester / Final Year Capstone",
    techStack: ["PyTorch", "Vision Transformers", "Raspberry Pi 4", "QGIS", "Node.js", "MongoDB", "LoRaWAN"],
    skillsRequired: ["Multispectral Imaging", "Remote Sensing", "Computer Vision", "Embedded Systems", "AgriTech"],
    datasets: [
      {
        name: "AP Regional Paddy & Chili Leaf Disease Multispectral Dataset",
        source: "Vignan Experimental Agri-Farm & Guntur APMC",
        size: "22.5 GB",
        format: "GeoTIFF & PNG",
        link: "https://agridata.college.edu/multispectral-ap",
        description: "Calibrated NIR and RedEdge band images annotated with leaf disease severity levels."
      }
    ],
    researchPapers: [
      {
        title: "Transformer-based Early Foliar Disease Classification from UAV Multispectral Telemetry",
        authors: "Dr. K. Swathi, Priya Nair, Varun Teja",
        conferenceJournal: "Springer Journal of Precision Agriculture",
        year: 2024,
        link: "https://link.springer.com/article/10.1007/agri-precision-2024",
        doi: "10.1007/s11119-024-09871-x"
      }
    ],
    problemsFaced: [
      {
        problem: "Wind-induced motion blur during low-altitude UAV flight degraded classification accuracy by 34%.",
        solution: "Integrated a high-speed global shutter camera with inertial gyro-compensated frame alignment in QGIS.",
        approach: "Optical flow stabilization with Kalman filtering.",
        tags: ["Drone Stability", "Motion Blur", "Kalman Filter"]
      }
    ],
    lessonsLearned: "Ground truth soil chemistry testing must be conducted on the same day as aerial drone passes for accurate NDVI correlation.",
    futureImprovements: "Integrate autonomous drone spraying payload triggers based on real-time disease bounding maps.",
    keyTakeaways: [
      "NIR spectral reflectance detects cellular chlorophyll breakdown 10 days before human visual detection.",
      "Global shutter sensors are essential for drone-mounted agricultural vision."
    ],
    teamMembers: [
      {
        name: "Priya Nair",
        role: "AgriTech ML Specialist",
        email: "priya.n@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Varun Teja",
        role: "UAV Flight Controller & Hardware Architect",
        email: "varun.t@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
      }
    ],
    facultySupervisor: {
      name: "Dr. K. Swathi",
      department: "Information Technology",
      designation: "Associate Professor & Drone AI Lab Lead",
      email: "k.swathi@college.edu"
    },
    githubLink: "https://github.com/college-agri/agrivision-drone",
    liveDemoLink: "https://agrivision.college.edu",
    reportDocLink: "https://docs.college.edu/capstone/2024/agrivision.pdf",
    presentationLink: "https://slides.college.edu/2024/agrivision.pdf",
    thumbnail: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop&q=80"
    ],
    views: 1180,
    bookmarksCount: 72,
    likesCount: 180,
    rating: { average: 4.8, count: 19 },
    reviews: [],
    status: "Completed",
    isVerified: true,
    isFeatured: true,
    badge: "🌱 ICAR Agritech Innovation Finalist"
  },
  {
    _id: "proj_03",
    title: "NeuroPulse: Wearable Pre-Ictal Epileptic Seizure Prediction with Edge TinyML",
    tagline: "Low-power EEG wearable device forecasting epileptic onset 15 minutes before physical manifestation",
    description: "A compact 4-channel frontal EEG headband running a quantized Spiking Neural Network (SNN) on an ARM Cortex-M4 microcontroller to alert patients and caretakers up to 15 minutes before seizure onset.",
    detailedOverview: "Designed in collaboration with local teaching hospitals. Features custom active wet-electrode circuitry that filters 50Hz AC powerline interference and ocular EMG artifacts. Processes continuous wavelet transforms (CWT) through an ultra-low power neuromorphic TinyML model consuming under 12mW.",
    domain: "Healthcare & Biomedical",
    year: 2023,
    batch: "2019-2023",
    semester: "8th Semester / Final Year Capstone",
    techStack: ["TinyML", "TensorFlow Lite Micro", "C++", "Python", "BLE 5.2", "Flutter", "ARM Cortex-M4"],
    skillsRequired: ["Biomedical Signal Processing", "TinyML", "Embedded C++", "PCB Design", "Neuromorphic Computing"],
    datasets: [
      {
        name: "CHB-MIT Scalp EEG Seizure Database",
        source: "PhysioNet / Harvard Medical School",
        size: "32 GB (844 hours of multi-channel recording)",
        format: "EDF & CSV",
        link: "https://physionet.org/content/chbmit/1.0.0/",
        description: "Pediatric EEG records containing clinical seizure events with precise seizure annotation markers."
      }
    ],
    researchPapers: [
      {
        title: "Energy-Efficient Spiking Neural Architectures for Wearable Pre-Ictal Seizure Forecasting",
        authors: "Dr. B. Venkatesh, Ananya Sen, K. Harish",
        conferenceJournal: "IEEE Transactions on Biomedical Engineering",
        year: 2023,
        link: "https://ieeexplore.ieee.org/document/neuropulse-tbme",
        doi: "10.1109/TBME.2023.3289104"
      }
    ],
    problemsFaced: [
      {
        problem: "Ocular blink artifacts generated high-amplitude false seizure probability spikes.",
        solution: "Implemented discrete wavelet transform (DWT) baseline cancellation with adaptive threshold filter in firmware.",
        approach: "Real-time DWT Daubechies-4 wavelet decomposition on Cortex-M4 DSP registers.",
        tags: ["DWT", "Artifact Removal", "DSP"]
      }
    ],
    lessonsLearned: "Ultra-low power constraints require moving complex mathematical transformations into hardware DSP instructions rather than floating-point math.",
    futureImprovements: "Implement closed-loop vagus nerve stimulation (VNS) feedback to automatically abort detected pre-ictal events.",
    keyTakeaways: [
      "Continuous Wavelet Transform + TFLite Micro achieves 92.4% seizure prediction sensitivity.",
      "Frontal pole (FP1-FP2) channels provide sufficient pre-ictal synchronization signals."
    ],
    teamMembers: [
      {
        name: "Ananya Sen",
        role: "Biomedical Algorithm Lead",
        email: "ananya.s@college.edu",
        batch: "2019-2023",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "K. Harish",
        role: "Analog Front-End & PCB Hardware Designer",
        email: "harish.k@college.edu",
        batch: "2019-2023",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
      }
    ],
    facultySupervisor: {
      name: "Dr. B. Venkatesh",
      department: "Electronics & Communication",
      designation: "Professor & Biomedical Instrumentation Chair",
      email: "b.venkatesh@college.edu"
    },
    githubLink: "https://github.com/college-biomed/neuropulse-tinyml",
    liveDemoLink: "https://neuropulse.college.edu",
    reportDocLink: "https://docs.college.edu/capstone/2023/neuropulse.pdf",
    presentationLink: "https://slides.college.edu/2023/neuropulse.pdf",
    thumbnail: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop&q=80"
    ],
    views: 1840,
    bookmarksCount: 110,
    likesCount: 290,
    rating: { average: 5.0, count: 32 },
    reviews: [],
    status: "Completed",
    isVerified: true,
    isFeatured: true,
    badge: "🩺 National MedTech Patent Filed"
  },
  {
    _id: "proj_04",
    title: "VeriDegree: Decentralized Academic Credential & Transcript Verification on Ethereum L2",
    tagline: "Zero-knowledge cryptographic verification preventing fraudulent college degree certifications",
    description: "A tamper-proof academic credential issuance platform built on Polygon zkEVM that mints soulbound NFT transcripts and enables employers to instantly verify university certifications with Zero-Knowledge proofs.",
    detailedOverview: "Designed to solve paper certificate forgery. Integrates university student registrar ERP directly with an Ethereum layer-2 smart contract. Issues soulbound (non-transferable ERC-5192) tokens with Merkle proof verification for individual course grades without disclosing the full transcript.",
    domain: "Blockchain & Web3",
    year: 2024,
    batch: "2020-2024",
    semester: "8th Semester / Final Year Capstone",
    techStack: ["Solidity", "Hardhat", "Polygon zkEVM", "Ethers.js", "React", "IPFS", "Tailwind CSS"],
    skillsRequired: ["Smart Contracts", "Cryptography", "Solidity", "Zero-Knowledge Proofs", "Web3.js"],
    datasets: [
      {
        name: "Synthetic University Registrar Gradebook Schema",
        source: "College Internal Registrar Mock Data",
        size: "1.2 GB (50,000 anonymized student transcripts)",
        format: "JSON & IPFS CIDs",
        link: "https://ipfs.io/ipfs/QmExampleVeriDegreeRegistrarHash",
        description: "Anonymized schema of academic marks, course credits, and degree verification hashes."
      }
    ],
    researchPapers: [
      {
        title: "Zero-Knowledge Merkle Trees for Privacy-Preserving Academic Credential Attestation",
        authors: "Dr. S. Manikandan, Karthik Rajan",
        conferenceJournal: "IEEE International Conference on Blockchain (Blockchain 2024)",
        year: 2024,
        link: "https://ieeexplore.ieee.org/document/veridegree-zk",
        doi: "10.1109/Blockchain.2024.104928"
      }
    ],
    problemsFaced: [
      {
        problem: "Gas fees for on-chain batch transcript minting were prohibitive during semester convocation.",
        solution: "Migrated to Polygon zkEVM rollup and implemented Merkle Tree root anchoring where 10,000 student certificates require only a single 32-byte root hash submission.",
        approach: "Off-chain Merkle tree generation in Node.js with on-chain cryptographic proof verification.",
        tags: ["Polygon zkEVM", "Merkle Trees", "Gas Optimization"]
      }
    ],
    lessonsLearned: "Decentralized identity architecture must always protect student PII by ensuring only cryptographic hashes and zero-knowledge commitments touch the public blockchain.",
    futureImprovements: "Integrate W3C Verifiable Credentials (VC) and DID protocols for cross-border international university degree equivalence.",
    keyTakeaways: [
      "Merkle root anchoring reduces on-chain certification cost by 99.8%.",
      "Soulbound ERC-5192 standard effectively stops unauthorized credential transfers."
    ],
    teamMembers: [
      {
        name: "Karthik Rajan",
        role: "Smart Contract Architect",
        email: "karthik.r@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Divya Bharathi",
        role: "Zero-Knowledge Circuit Developer",
        email: "divya.b@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      }
    ],
    facultySupervisor: {
      name: "Dr. S. Manikandan",
      department: "Computer Science & Engineering",
      designation: "Professor of Cyber Security & Blockchain",
      email: "s.manikandan@college.edu"
    },
    githubLink: "https://github.com/college-web3/veridegree-protocol",
    liveDemoLink: "https://veridegree.college.edu",
    reportDocLink: "https://docs.college.edu/capstone/2024/veridegree.pdf",
    presentationLink: "https://slides.college.edu/2024/veridegree.pdf",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80"
    ],
    views: 1310,
    bookmarksCount: 94,
    likesCount: 240,
    rating: { average: 4.8, count: 21 },
    reviews: [],
    status: "Completed",
    isVerified: true,
    isFeatured: true,
    badge: "⛓️ State e-Governance Hackathon Winner"
  },
  {
    _id: "proj_05",
    title: "LaraGPT: Domain-Specific Indic Multilingual Academic Knowledge Retrieval Assistant",
    tagline: "Fine-tuned multilingual LLM RAG engine assisting engineering students in Telugu, Hindi & English",
    description: "A bilingual retrieval-augmented generative AI system fine-tuned on curriculum syllabi, previous 10-year question papers, and lab manuals from JNTUK and Vignan's Lara to answer technical queries in vernacular languages.",
    detailedOverview: "Addresses language barrier difficulties faced by rural engineering students. Implements LangChain and Qdrant vector database with cross-encoder re-ranking. Fine-tuned Mistral-7B with LoRA adapters on bilingual technical glossaries.",
    domain: "Natural Language Processing",
    year: 2024,
    batch: "2020-2024",
    semester: "8th Semester / Final Year Capstone",
    techStack: ["PyTorch", "HuggingFace Transformers", "LangChain", "Qdrant Vector DB", "FastAPI", "React", "LoRA"],
    skillsRequired: ["NLP", "Large Language Models", "Vector Databases", "Prompt Engineering", "RAG Architecture"],
    datasets: [
      {
        name: "VLITS Engineering Syllabus & Indic QA Dataset",
        source: "College Library & Exam Cell Archives",
        size: "4.5 GB (180,000 question-answer pairs in Telugu/English)",
        format: "JSONL & Parquet",
        link: "https://huggingface.co/datasets/vlits-indic-nlp",
        description: "Bilingual engineering textbook excerpts, lab walkthroughs, and annotated exam solutions."
      }
    ],
    researchPapers: [
      {
        title: "Bilingual RAG Architectures for Technical STEM Education in Under-Resourced Indic Dialects",
        authors: "Dr. M. Srinivasa Rao, R. Sandeep, K. Mounika",
        conferenceJournal: "ACM Transactions on Asian and Low-Resource Language Information Processing (TALLIP)",
        year: 2024,
        link: "https://dl.acm.org/doi/10.1145/laragpt-tallip",
        doi: "10.1145/3649281"
      }
    ],
    problemsFaced: [
      {
        problem: "Hallucination when retrieving complex mathematical derivations across Telugu script queries.",
        solution: "Integrated a hybrid BM25 lexical + dense vector search pipeline with a mathematical LaTeX parser fallback.",
        approach: "Reciprocal Rank Fusion (RRF) combining dense embeddings with sparse token matching.",
        tags: ["RAG", "Hybrid Search", "Hallucination Mitigation"]
      }
    ],
    lessonsLearned: "Tokenizers for English models heavily fragment Indic words; custom SentencePiece vocabulary training is mandatory for speed.",
    futureImprovements: "Add real-time speech-to-speech Indic dialect conversation using Whisper fine-tuned on regional accents.",
    keyTakeaways: [
      "Hybrid dense-sparse retrieval eliminates 70% of LLM hallucination in technical derivations.",
      "Custom LoRA fine-tuning provides 4x faster vernacular query processing."
    ],
    teamMembers: [
      {
        name: "R. Sandeep",
        role: "NLP & LLM Fine-Tuning Lead",
        email: "sandeep.r@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "K. Mounika",
        role: "Vector Database & RAG Pipeline Developer",
        email: "mounika.k@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      }
    ],
    facultySupervisor: {
      name: "Dr. M. Srinivasa Rao",
      department: "Artificial Intelligence & Data Science",
      designation: "Professor & Head of NLP Research Group",
      email: "m.srinivasarao@college.edu"
    },
    githubLink: "https://github.com/college-nlp/laragpt-indic-rag",
    liveDemoLink: "https://laragpt.college.edu",
    reportDocLink: "https://docs.college.edu/capstone/2024/laragpt.pdf",
    presentationLink: "https://slides.college.edu/2024/laragpt.pdf",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80"
    ],
    views: 2150,
    bookmarksCount: 145,
    likesCount: 380,
    rating: { average: 4.9, count: 42 },
    reviews: [],
    status: "Completed",
    isVerified: true,
    isFeatured: true,
    badge: "🗣️ AI for Good Education Grant"
  },
  {
    _id: "proj_06",
    title: "VoltGrid: IoT Microgrid Energy Consumption Forecaster with Demand-Response Shaving",
    tagline: "Smart IoT energy monitoring and load-balancing system deployed across college campus buildings",
    description: "A campus-wide intelligent energy management platform connecting 80+ smart IoT meter nodes across academic blocks to forecast peak electricity spikes and automatically shed non-critical HVAC loads.",
    detailedOverview: "Built using custom ESP32 energy metering boards with current transformer (CT) sensors and MQTT brokering. Employs LightGBM time-series regression on 18 months of college power grid telemetry to reduce peak tariff penalties by $14,000 annually.",
    domain: "Internet of Things & Embedded",
    year: 2024,
    batch: "2020-2024",
    semester: "8th Semester / Final Year Capstone",
    techStack: ["ESP32", "C++", "MQTT", "Python", "LightGBM", "InfluxDB", "Grafana", "FastAPI"],
    skillsRequired: ["IoT & Embedded C++", "Time Series Forecasting", "MQTT Protocol", "Power Systems", "InfluxDB"],
    datasets: [
      {
        name: "VLITS 80-Node Smart Campus Power Telemetry Dataset",
        source: "College Campus Electrical Grid (2022-2024)",
        size: "8.9 GB (12 Million 15-second resolution records)",
        format: "InfluxDB Line Protocol & CSV",
        link: "https://iot.college.edu/datasets/campus-power-grid",
        description: "Voltage, current, power factor, and harmonics across CSE, ECE, library, and hostel blocks."
      }
    ],
    researchPapers: [
      {
        title: "Predictive Microgrid Peak Load Shaving using Ensemble Tree Estimators",
        authors: "Dr. P. Rajan, Varun Chandra, Nisha Agarwal",
        conferenceJournal: "IEEE Transactions on Smart Grid",
        year: 2024,
        link: "https://ieeexplore.ieee.org/document/voltgrid-tsg",
        doi: "10.1109/TSG.2024.1102938"
      }
    ],
    problemsFaced: [
      {
        problem: "Wi-Fi packet loss in basement mechanical rooms caused missing time-series gaps.",
        solution: "Programmed ESP32 local SPI flash buffer (LittleFS) that caches readings during disconnects and re-syncs upon reconnect.",
        approach: "Store-and-forward QoS 1 MQTT protocol with timestamp preservation.",
        tags: ["MQTT QoS", "LittleFS", "Reliability"]
      }
    ],
    lessonsLearned: "Hardware installation requires certified electrical isolation (optocouplers) to protect microcontrollers from transient voltage spikes.",
    futureImprovements: "Incorporate battery energy storage system (BESS) degradation modeling into the charge/discharge dispatch algorithm.",
    keyTakeaways: [
      "Predictive load shedding reduced college electricity bills by $14,000/year.",
      "Local SPI flash buffering prevents data loss during Wi-Fi blackouts."
    ],
    teamMembers: [
      {
        name: "Varun Chandra",
        role: "Embedded Firmware & PCB Designer",
        email: "varun.c@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Nisha Agarwal",
        role: "Data Science & Predictive Analytics Lead",
        email: "nisha.a@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
      }
    ],
    facultySupervisor: {
      name: "Dr. P. Rajan",
      department: "Electrical & Electronics",
      designation: "Professor & Director of Energy Center",
      email: "p.rajan@college.edu"
    },
    githubLink: "https://github.com/college-iot/voltgrid-smart-meter",
    liveDemoLink: "https://voltgrid.college.edu",
    reportDocLink: "https://docs.college.edu/capstone/2024/voltgrid.pdf",
    presentationLink: "https://slides.college.edu/2024/voltgrid.pdf",
    thumbnail: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80"
    ],
    views: 980,
    bookmarksCount: 65,
    likesCount: 130,
    rating: { average: 4.6, count: 18 },
    reviews: [],
    status: "Completed",
    isVerified: true,
    isFeatured: false,
    badge: "⚡ Green Campus Sustainability Award"
  },
  {
    _id: "proj_07",
    title: "CyberSentinel: Automated Network Intrusion Detection with Graph Neural Networks",
    tagline: "High-throughput packet graph representation learning capturing APT attacks and ransomware lateral movement",
    description: "An enterprise SIEM network intrusion detection system modeling university campus network flows as heterogeneous temporal graphs to detect zero-day exploits and DDoS attacks.",
    detailedOverview: "Deploys eBPF kernel probes on core Linux edge routers to extract packet flow metadata with zero packet-drop overhead. Constructs temporal graph snapshots evaluated by a Relational Graph Convolutional Network (R-GCN) detecting anomalous lateral movement in real time.",
    domain: "Cyber Security & Cryptography",
    year: 2024,
    batch: "2021-2025",
    semester: "7th Semester Capstone",
    techStack: ["PyTorch Geometric", "eBPF", "Kafka", "Elasticsearch", "React", "Docker", "Python"],
    skillsRequired: ["Network Security", "Graph Neural Networks", "eBPF Kernel Probing", "Threat Detection", "Linux Internals"],
    datasets: [
      {
        name: "CIC-IDS2017 & Campus Lateral Movement Call Trace Dataset",
        source: "Canadian Institute for Cybersecurity & College Data Center",
        size: "18.4 GB",
        format: "PCAP & CSV",
        link: "https://unb.ca/cic/datasets/ids-2017.html",
        description: "Labeled network flows containing benign traffic alongside DoS, PortScan, and Botnet attacks."
      }
    ],
    researchPapers: [
      {
        title: "Heterogeneous Graph Convolutional Telemetry for Real-Time Advanced Persistent Threat Detection",
        authors: "Dr. S. Manikandan, Rajesh Goud, Sai Tarun",
        conferenceJournal: "IEEE Transactions on Information Forensics and Security",
        year: 2024,
        link: "https://ieeexplore.ieee.org/document/cybersentinel-tifs",
        doi: "10.1109/TIFS.2024.1198302"
      }
    ],
    problemsFaced: [
      {
        problem: "10 Gbps peak data center traffic overwhelmed user-space network capture ring buffers.",
        solution: "Implemented eBPF XDP (eXpress Data Path) kernel filters to aggregate packet stats before passing to user space.",
        approach: "XDP kernel-level packet aggregation with zero-copy ring buffers.",
        tags: ["eBPF", "XDP", "High Throughput"]
      }
    ],
    lessonsLearned: "Network flow features must incorporate temporal sequence intervals to differentiate bulk backups from exfiltration attacks.",
    futureImprovements: "Implement automated dynamic firewall BGP routing null-route mitigation via software-defined networking (SDN).",
    keyTakeaways: [
      "eBPF XDP reduces network inspection CPU overhead by 85%.",
      "Graph topology learning catches 98.2% of multi-stage lateral reconnaissance."
    ],
    teamMembers: [
      {
        name: "Rajesh Goud",
        role: "Cyber Security & eBPF Engineer",
        email: "rajesh.g@college.edu",
        batch: "2021-2025",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Sai Tarun",
        role: "Graph ML & SIEM Integrator",
        email: "sai.t@college.edu",
        batch: "2021-2025",
        avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80"
      }
    ],
    facultySupervisor: {
      name: "Dr. S. Manikandan",
      department: "Computer Science & Engineering",
      designation: "Professor of Cyber Security & Blockchain",
      email: "s.manikandan@college.edu"
    },
    githubLink: "https://github.com/college-sec/cybersentinel-ebpf",
    liveDemoLink: "https://cybersentinel.college.edu",
    reportDocLink: "https://docs.college.edu/capstone/2024/cybersentinel.pdf",
    presentationLink: "https://slides.college.edu/2024/cybersentinel.pdf",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80"
    ],
    views: 1040,
    bookmarksCount: 68,
    likesCount: 175,
    rating: { average: 4.7, count: 15 },
    reviews: [],
    status: "Completed",
    isVerified: true,
    isFeatured: false,
    badge: "🛡️ Cyber Defense Excellence Award"
  },
  {
    _id: "proj_08",
    title: "RoboCare: Autonomous Mobile Hospital Disinfection & Material Delivery Bot",
    tagline: "ROS 2 powered autonomous mobile robot (AMR) with LiDAR SLAM and UV-C disinfection arrays",
    description: "An indoor autonomous mobile robot engineered with differential drive, 2D LiDAR SLAM, and RGB-D depth perception to navigate hospital wards, deliver medical equipment, and sterilize operating theaters.",
    detailedOverview: "Built on ROS 2 Humble running on an industrial Ubuntu SBC. Features Nav2 navigation stack with custom costmap layers avoiding dynamic obstacles such as wheelchairs and hospital beds. Controlled via web-based fleet manager.",
    domain: "Robotics & Automation",
    year: 2023,
    batch: "2019-2023",
    semester: "8th Semester / Final Year Capstone",
    techStack: ["ROS 2 Humble", "C++", "Python", "LiDAR", "Nav2", "Gazebo", "React", "WebRTC"],
    skillsRequired: ["Robotics & ROS 2", "SLAM Navigation", "Embedded C++", "Control Systems", "Mechanical CAD"],
    datasets: [
      {
        name: "Hospital Ward 3D PointCloud & 2D Occupancy Grid Maps",
        source: "College Health Center & Guntur General Hospital",
        size: "6.4 GB",
        format: "PCD & ROSBAG2",
        link: "https://robotics.college.edu/datasets/hospital-slam",
        description: "Dense 3D point cloud scans and 2D laser scans across hospital corridors and patient wards."
      }
    ],
    researchPapers: [
      {
        title: "Dynamic Obstacle Costmap Optimization for Autonomous Hospital Mobile Robots in Crowded Corridors",
        authors: "Dr. N. Chandrasekhar, Tejaswini Rao, Manoj Kumar",
        conferenceJournal: "IEEE International Conference on Robotics and Automation (ICRA)",
        year: 2023,
        link: "https://ieeexplore.ieee.org/document/robocare-icra",
        doi: "10.1109/ICRA.2023.1012938"
      }
    ],
    problemsFaced: [
      {
        problem: "Glass doors and reflective polished hospital floors produced severe laser scattering in LiDAR SLAM.",
        solution: "Combined 2D LiDAR with ultrasonic sonar time-of-flight arrays and stereo depth point clouds in sensor fusion filter.",
        approach: "Extended Kalman Filter (EKF) multi-sensor fusion.",
        tags: ["Sensor Fusion", "EKF", "LiDAR SLAM"]
      }
    ],
    lessonsLearned: "Differential drive motor encoders suffer from cumulative odometry drift on smooth vinyl tiles; visual odometry feedback is vital.",
    futureImprovements: "Implement cooperative multi-robot task allocation for coordinated disinfection fleets.",
    keyTakeaways: [
      "Multi-sensor fusion eliminates 95% of transparent glass navigation traps.",
      "Nav2 custom inflation costmaps prevent hallway congestion."
    ],
    teamMembers: [
      {
        name: "Tejaswini Rao",
        role: "Robotics Software Lead & Nav2 Architect",
        email: "tejaswini.r@college.edu",
        batch: "2019-2023",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Manoj Kumar",
        role: "Mechanical Chassis & Motor Control Engineer",
        email: "manoj.k@college.edu",
        batch: "2019-2023",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
      }
    ],
    facultySupervisor: {
      name: "Dr. N. Chandrasekhar",
      department: "Mechanical Engineering",
      designation: "Professor & Robotics Center Coordinator",
      email: "n.chandrasekhar@college.edu"
    },
    githubLink: "https://github.com/college-robotics/robocare-amr",
    liveDemoLink: "https://robocare.college.edu",
    reportDocLink: "https://docs.college.edu/capstone/2023/robocare.pdf",
    presentationLink: "https://slides.college.edu/2023/robocare.pdf",
    thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80"
    ],
    views: 1250,
    bookmarksCount: 82,
    likesCount: 210,
    rating: { average: 4.8, count: 17 },
    reviews: [],
    status: "Completed",
    isVerified: true,
    isFeatured: false,
    badge: "🤖 National Robotics Expo Best Design"
  }
];

export const sampleUsers = [
  {
    _id: "user_01",
    name: "Gowri Simhadri",
    email: "gowri@college.edu",
    password: "$2a$10$YourHashedPasswordHereOrAutoBcrypt",
    role: "student",
    batch: "2023-2027",
    branch: "Computer Science & Engineering",
    department: "CSE",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Passionate about Machine Learning, Computer Vision, and Building scalable full-stack knowledge platforms for educational innovation.",
    headline: "AI Researcher & Full-Stack Engineer | 3rd Year CSE",
    skills: [
      { name: "Computer Vision", level: "Expert", endorsements: 24 },
      { name: "Deep Learning", level: "Advanced", endorsements: 18 },
      { name: "React.js", level: "Expert", endorsements: 28 },
      { name: "Node.js & Express", level: "Advanced", endorsements: 20 },
      { name: "Python", level: "Expert", endorsements: 32 },
      { name: "MongoDB", level: "Advanced", endorsements: 16 }
    ],
    interests: ["Computer Vision", "Autonomous Systems", "Graph Databases", "Cloud Computing", "AI for Social Good"],
    github: "https://github.com/gowrisimhadri",
    linkedin: "https://linkedin.com/in/gowrisimhadri",
    portfolio: "https://gowrisimhadri.dev",
    bookmarks: ["proj_01", "proj_02", "proj_04", "proj_05"],
    recentlyViewed: ["proj_01", "proj_02", "proj_03", "proj_04", "proj_05", "proj_06"],
    rating: { average: 4.9, count: 26 }
  },
  {
    _id: "user_02",
    name: "Priya Nair",
    email: "priya.n@college.edu",
    password: "$2a$10$YourHashedPasswordHereOrAutoBcrypt",
    role: "student",
    batch: "2020-2024",
    branch: "Information Technology",
    department: "IT",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    bio: "AgriTech and remote sensing enthusiast focusing on drone multispectral imagery and precision farming AI models.",
    headline: "Drone AI & Remote Sensing Specialist | IT Final Year",
    skills: [
      { name: "Computer Vision", level: "Advanced", endorsements: 19 },
      { name: "Multispectral Imaging", level: "Expert", endorsements: 22 },
      { name: "PyTorch", level: "Advanced", endorsements: 15 },
      { name: "Python", level: "Expert", endorsements: 25 },
      { name: "QGIS", level: "Advanced", endorsements: 14 }
    ],
    interests: ["Precision Agriculture", "Satellite Telemetry", "Drone ML", "Sustainable Tech"],
    github: "https://github.com/priya-nair-agri",
    linkedin: "https://linkedin.com/in/priya-nair-it",
    portfolio: "https://priyanair.me",
    bookmarks: ["proj_02", "proj_01"],
    recentlyViewed: ["proj_02", "proj_01"],
    rating: { average: 4.8, count: 18 }
  },
  {
    _id: "user_03",
    name: "Karthik Rajan",
    email: "karthik.r@college.edu",
    password: "$2a$10$YourHashedPasswordHereOrAutoBcrypt",
    role: "student",
    batch: "2020-2024",
    branch: "Computer Science & Engineering",
    department: "CSE",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    bio: "Web3 protocol engineer, smart contract auditor, and zero-knowledge cryptography researcher.",
    headline: "Smart Contract Architect & ZK-Researcher | CSE Final Year",
    skills: [
      { name: "Smart Contracts & Solidity", level: "Expert", endorsements: 31 },
      { name: "Cryptography", level: "Advanced", endorsements: 20 },
      { name: "React.js", level: "Advanced", endorsements: 18 },
      { name: "Hardhat", level: "Expert", endorsements: 22 },
      { name: "Polygon zkEVM", level: "Advanced", endorsements: 17 }
    ],
    interests: ["DeFi", "Soulbound Credentials", "zk-SNARKs", "Decentralized Governance"],
    github: "https://github.com/karthik-crypto",
    linkedin: "https://linkedin.com/in/karthik-rajan-web3",
    bookmarks: ["proj_04"],
    recentlyViewed: ["proj_04", "proj_01"],
    rating: { average: 4.9, count: 21 }
  },
  {
    _id: "user_04",
    name: "Ananya Sen",
    email: "ananya.s@college.edu",
    password: "$2a$10$YourHashedPasswordHereOrAutoBcrypt",
    role: "student",
    batch: "2019-2023",
    branch: "Electronics & Communication",
    department: "ECE",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    bio: "Biomedical engineer focusing on wearable EEG biosensors, TinyML on microcontrollers, and neuromorphic edge hardware.",
    headline: "Biomedical Systems & TinyML Developer | VLITS Alum",
    skills: [
      { name: "Edge AI", level: "Expert", endorsements: 29 },
      { name: "Biomedical Signal Processing", level: "Expert", endorsements: 34 },
      { name: "IoT & Embedded C++", level: "Advanced", endorsements: 24 },
      { name: "TensorFlow Lite Micro", level: "Expert", endorsements: 27 }
    ],
    interests: ["Neural Interfaces", "Healthcare Wearables", "Neuromorphic Chips", "DSP"],
    github: "https://github.com/ananya-biomed",
    linkedin: "https://linkedin.com/in/ananya-sen-medtech",
    bookmarks: ["proj_03"],
    recentlyViewed: ["proj_03"],
    rating: { average: 5.0, count: 30 }
  },
  {
    _id: "user_05",
    name: "R. Sandeep",
    email: "sandeep.r@college.edu",
    password: "$2a$10$YourHashedPasswordHereOrAutoBcrypt",
    role: "student",
    batch: "2020-2024",
    branch: "Artificial Intelligence & Data Science",
    department: "AI&DS",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    bio: "NLP specialist working on fine-tuning multilingual Large Language Models, Vector DB retrieval pipelines, and low-resource Indic languages.",
    headline: "NLP & LLM Systems Architect | AI&DS Final Year",
    skills: [
      { name: "Natural Language Processing", level: "Expert", endorsements: 35 },
      { name: "Deep Learning", level: "Advanced", endorsements: 23 },
      { name: "Python", level: "Expert", endorsements: 28 },
      { name: "Vector Databases", level: "Advanced", endorsements: 20 },
      { name: "LangChain", level: "Expert", endorsements: 24 }
    ],
    interests: ["Indic NLP", "RAG Systems", "Multilingual Chatbots", "Transformer Quantization"],
    github: "https://github.com/sandeep-nlp",
    linkedin: "https://linkedin.com/in/sandeep-r-ai",
    bookmarks: ["proj_05", "proj_01"],
    recentlyViewed: ["proj_05"],
    rating: { average: 4.9, count: 28 }
  },
  {
    _id: "user_06",
    name: "Rajesh Goud",
    email: "rajesh.g@college.edu",
    password: "$2a$10$YourHashedPasswordHereOrAutoBcrypt",
    role: "student",
    batch: "2021-2025",
    branch: "Computer Science & Engineering",
    department: "CSE",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    bio: "Network security researcher, eBPF kernel developer, and capture-the-flag (CTF) competitor.",
    headline: "Cyber Security & Linux Kernel Researcher | 4th Year CSE",
    skills: [
      { name: "Network Security", level: "Expert", endorsements: 25 },
      { name: "eBPF Kernel Probing", level: "Advanced", endorsements: 19 },
      { name: "Python", level: "Advanced", endorsements: 21 },
      { name: "Linux Internals", level: "Expert", endorsements: 24 }
    ],
    interests: ["Zero-Day Defense", "SIEM Platforms", "Graph Neural Threat Hunting", "Reverse Engineering"],
    github: "https://github.com/rajesh-goud-sec",
    linkedin: "https://linkedin.com/in/rajesh-goud-cyber",
    bookmarks: ["proj_07"],
    recentlyViewed: ["proj_07", "proj_04"],
    rating: { average: 4.8, count: 16 }
  },
  {
    _id: "user_07",
    name: "Tejaswini Rao",
    email: "tejaswini.r@college.edu",
    password: "$2a$10$YourHashedPasswordHereOrAutoBcrypt",
    role: "student",
    batch: "2021-2025",
    branch: "Mechanical Engineering",
    department: "Mechanical",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    bio: "Robotics engineer passionate about ROS 2 AMR navigation, LiDAR SLAM point-cloud processing, and autonomous delivery vehicles.",
    headline: "Robotics & Autonomous Navigation Lead | Mechanical & Robotics",
    skills: [
      { name: "Robotics & ROS 2", level: "Expert", endorsements: 28 },
      { name: "SLAM Navigation", level: "Expert", endorsements: 26 },
      { name: "IoT & Embedded C++", level: "Advanced", endorsements: 20 },
      { name: "SolidWorks CAD", level: "Advanced", endorsements: 18 }
    ],
    interests: ["Autonomous Mobile Robots", "3D LiDAR SLAM", "Industrial Automation", "Drone Dynamics"],
    github: "https://github.com/tejaswini-robotics",
    linkedin: "https://linkedin.com/in/tejaswini-rao-amr",
    bookmarks: ["proj_08"],
    recentlyViewed: ["proj_08", "proj_01"],
    rating: { average: 4.9, count: 19 }
  },

  // FACULTY MEMBERS
  {
    _id: "user_faculty_01",
    name: "Dr. Ramesh Kumar",
    email: "ramesh.kumar@college.edu",
    password: "$2a$10$YourHashedPasswordHereOrAutoBcrypt",
    role: "faculty",
    batch: "Faculty Mentor",
    branch: "Computer Science & Engineering",
    department: "CSE",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "Head of Vision AI Research Center at Vignan's Lara. Guiding undergraduate and postgraduate capstones in Edge Vision, Intelligent Transportation, and Real-Time TensorRT Pipelines.",
    headline: "Professor & Head of Vision AI Research Center",
    skills: [
      { name: "Computer Vision", level: "Expert", endorsements: 95 },
      { name: "Deep Learning", level: "Expert", endorsements: 92 },
      { name: "Edge AI", level: "Expert", endorsements: 84 },
      { name: "Pattern Recognition", level: "Expert", endorsements: 76 }
    ],
    interests: ["Vision Transformers", "Autonomous Driving", "Edge Computing", "Medical Image Analytics"],
    github: "https://github.com/dr-ramesh-ai",
    linkedin: "https://linkedin.com/in/dr-ramesh-kumar-ai",
    bookmarks: ["proj_01", "proj_02"],
    recentlyViewed: ["proj_01", "proj_02"],
    rating: { average: 5.0, count: 52 }
  },
  {
    _id: "user_faculty_02",
    name: "Dr. K. Swathi",
    email: "k.swathi@college.edu",
    password: "$2a$10$YourHashedPasswordHereOrAutoBcrypt",
    role: "faculty",
    batch: "Faculty Mentor",
    branch: "Information Technology",
    department: "IT",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    bio: "Director of Precision Agriculture & Drone Telemetry Laboratory. Author of 28+ international IEEE/Springer publications on multispectral crop monitoring.",
    headline: "Associate Professor & Precision AgriTech Lab Director",
    skills: [
      { name: "Multispectral Imaging", level: "Expert", endorsements: 88 },
      { name: "Computer Vision", level: "Expert", endorsements: 82 },
      { name: "Remote Sensing", level: "Expert", endorsements: 90 },
      { name: "Machine Learning", level: "Expert", endorsements: 79 }
    ],
    interests: ["UAV Sensor Systems", "Precision Agriculture", "Crop Pathology AI", "Satellite Image Segmentation"],
    github: "https://github.com/dr-swathi-agritech",
    linkedin: "https://linkedin.com/in/dr-k-swathi",
    bookmarks: ["proj_02"],
    recentlyViewed: ["proj_02"],
    rating: { average: 4.9, count: 44 }
  },
  {
    _id: "user_faculty_03",
    name: "Dr. B. Venkatesh",
    email: "b.venkatesh@college.edu",
    password: "$2a$10$YourHashedPasswordHereOrAutoBcrypt",
    role: "faculty",
    batch: "Faculty Mentor",
    branch: "Electronics & Communication",
    department: "ECE",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bio: "Chair of Biomedical Instrumentation & Wearable Edge Systems. Holds 4 patents in non-invasive neural monitoring and EEG wavelet DSP circuits.",
    headline: "Professor & Biomedical Instrumentation Chair",
    skills: [
      { name: "Biomedical Signal Processing", level: "Expert", endorsements: 94 },
      { name: "Edge AI", level: "Expert", endorsements: 89 },
      { name: "IoT & Embedded C++", level: "Expert", endorsements: 91 },
      { name: "Digital Signal Processing", level: "Expert", endorsements: 87 }
    ],
    interests: ["Wearable Biosensors", "Epilepsy Diagnostics", "TinyML Neuromorphics", "Analog Front-End Design"],
    github: "https://github.com/dr-venkatesh-biomed",
    linkedin: "https://linkedin.com/in/dr-b-venkatesh",
    bookmarks: ["proj_03"],
    recentlyViewed: ["proj_03"],
    rating: { average: 5.0, count: 60 }
  },
  {
    _id: "user_faculty_04",
    name: "Dr. S. Manikandan",
    email: "s.manikandan@college.edu",
    password: "$2a$10$YourHashedPasswordHereOrAutoBcrypt",
    role: "faculty",
    batch: "Faculty Mentor",
    branch: "Computer Science & Engineering",
    department: "CSE",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    bio: "Head of Blockchain & Cybersecurity Excellence Center. Guiding research in Zero-Knowledge cryptographic protocols, Layer-2 rollups, and eBPF kernel intrusion detection.",
    headline: "Professor of Cybersecurity & Blockchain Technology",
    skills: [
      { name: "Smart Contracts & Solidity", level: "Expert", endorsements: 92 },
      { name: "Network Security", level: "Expert", endorsements: 96 },
      { name: "Cryptography", level: "Expert", endorsements: 90 },
      { name: "Linux Internals", level: "Expert", endorsements: 85 }
    ],
    interests: ["zk-SNARKs", "Decentralized ID", "Kernel Security", "SIEM Platforms"],
    github: "https://github.com/dr-manikandan-sec",
    linkedin: "https://linkedin.com/in/dr-s-manikandan",
    bookmarks: ["proj_04", "proj_07"],
    recentlyViewed: ["proj_04", "proj_07"],
    rating: { average: 4.9, count: 48 }
  },
  {
    _id: "user_faculty_05",
    name: "Dr. M. Srinivasa Rao",
    email: "m.srinivasarao@college.edu",
    password: "$2a$10$YourHashedPasswordHereOrAutoBcrypt",
    role: "faculty",
    batch: "Faculty Mentor",
    branch: "Artificial Intelligence & Data Science",
    department: "AI&DS",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    bio: "Leading the Indic Language Processing & Multilingual GenAI Research Lab. Specializes in low-resource vernacular NLP, RAG, and Transformer Model Quantization.",
    headline: "Professor & Head of NLP Research Group",
    skills: [
      { name: "Natural Language Processing", level: "Expert", endorsements: 98 },
      { name: "Deep Learning", level: "Expert", endorsements: 94 },
      { name: "Large Language Models", level: "Expert", endorsements: 91 },
      { name: "Python", level: "Expert", endorsements: 96 }
    ],
    interests: ["Indic LLMs", "Retrieval Augmented Generation", "Speech-to-Text", "Knowledge Graphs"],
    github: "https://github.com/dr-srinivasa-nlp",
    linkedin: "https://linkedin.com/in/dr-m-srinivasarao",
    bookmarks: ["proj_05"],
    recentlyViewed: ["proj_05"],
    rating: { average: 5.0, count: 56 }
  },
  {
    _id: "user_faculty_06",
    name: "Dr. P. Rajan",
    email: "p.rajan@college.edu",
    password: "$2a$10$YourHashedPasswordHereOrAutoBcrypt",
    role: "faculty",
    batch: "Faculty Mentor",
    branch: "Electrical & Electronics",
    department: "EEE",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    bio: "Director of Clean Energy & Smart Campus Microgrid Center. Pioneering IoT based energy conservation, load scheduling, and solar battery storage optimization.",
    headline: "Professor & Director of Energy Center",
    skills: [
      { name: "IoT & Embedded C++", level: "Expert", endorsements: 90 },
      { name: "Time Series Forecasting", level: "Expert", endorsements: 86 },
      { name: "Power Systems", level: "Expert", endorsements: 93 },
      { name: "MQTT Protocol", level: "Expert", endorsements: 88 }
    ],
    interests: ["Smart Grid IoT", "Demand Response Algorithms", "Renewable Solar Integration", "Battery Degradation"],
    github: "https://github.com/dr-rajan-energy",
    linkedin: "https://linkedin.com/in/dr-p-rajan",
    bookmarks: ["proj_06"],
    recentlyViewed: ["proj_06"],
    rating: { average: 4.8, count: 38 }
  },

  // ADMIN USER
  {
    _id: "user_admin_01",
    name: "VLITS Knowledge Admin",
    email: "admin@vignanlara.edu",
    password: "$2a$10$YourHashedPasswordHereOrAutoBcrypt",
    role: "admin",
    batch: "Administration",
    branch: "Dean of Research & Innovation",
    department: "Research & Development Cell",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Central Knowledge Archive Administrator for Vignan's Lara Institute of Technology & Science.",
    headline: "Dean of Academic Research & Capstone Verification",
    skills: [
      { name: "Research Administration", level: "Expert", endorsements: 120 },
      { name: "Capstone Verification", level: "Expert", endorsements: 110 }
    ],
    interests: ["Institutional Memory", "Academic Integrity", "Student Mentorship", "Patent Filing"],
    github: "https://github.com/vlits-admin",
    linkedin: "https://linkedin.com/in/vlits-admin",
    bookmarks: [],
    recentlyViewed: [],
    rating: { average: 5.0, count: 100 }
  }
];

export const sampleSkills = [
  { 
    name: "Computer Vision", 
    category: "Artificial Intelligence & ML", 
    description: "Image classification, YOLO object detection, segmentation, and video analytics", 
    icon: "Eye", 
    color: "#6366f1",
    relatedTech: ["PyTorch", "OpenCV", "YOLOv8", "TensorRT", "DeepSORT"]
  },
  { 
    name: "Deep Learning", 
    category: "Artificial Intelligence & ML", 
    description: "Neural network architectures, backpropagation, CNNs, Transformers, and optimization", 
    icon: "Brain", 
    color: "#8b5cf6",
    relatedTech: ["PyTorch", "TensorFlow", "Keras", "CUDA", "Weights & Biases"]
  },
  { 
    name: "Natural Language Processing", 
    category: "Artificial Intelligence & ML", 
    description: "Transformers, LLMs, Indic translation, Speech-to-Text, and Retrieval-Augmented Generation", 
    icon: "MessageSquare", 
    color: "#ec4899",
    relatedTech: ["HuggingFace", "LangChain", "Qdrant", "LoRA", "Whisper"]
  },
  { 
    name: "Edge AI", 
    category: "Artificial Intelligence & ML", 
    description: "Model quantization (INT8/FP16), TensorRT, TFLite Micro, and embedded edge inference", 
    icon: "Cpu", 
    color: "#06b6d4",
    relatedTech: ["NVIDIA TensorRT", "TFLite", "ONNX Runtime", "Jetson Nano", "ESP32"]
  },
  { 
    name: "Multispectral Imaging", 
    category: "Smart Agriculture & Remote Sensing", 
    description: "Narrow-band NIR and RedEdge reflectance indexing (NDVI/NDRE) for precision crop diagnostics", 
    icon: "Layers", 
    color: "#10b981",
    relatedTech: ["QGIS", "GDAL", "OpenCV", "Raspberry Pi Camera", "Rasterio"]
  },
  { 
    name: "Smart Contracts & Solidity", 
    category: "Blockchain & Web3", 
    description: "Ethereum Virtual Machine (EVM), Solidity protocols, ERC standards, and zk-Rollup integration", 
    icon: "ShieldCheck", 
    color: "#f59e0b",
    relatedTech: ["Solidity", "Hardhat", "Polygon zkEVM", "Ethers.js", "IPFS"]
  },
  { 
    name: "IoT & Embedded C++", 
    category: "Internet of Things & Embedded", 
    description: "Microcontroller firmware, FreeRTOS, MQTT telemetry, and low-power sensor interfacing", 
    icon: "Radio", 
    color: "#f43f5e",
    relatedTech: ["ESP32", "FreeRTOS", "MQTT", "LittleFS", "PlatformIO", "InfluxDB"]
  },
  { 
    name: "Robotics & ROS 2", 
    category: "Robotics & Automation", 
    description: "Robot Operating System 2, LiDAR SLAM, Nav2 navigation stack, and sensor fusion", 
    icon: "Compass", 
    color: "#3b82f6",
    relatedTech: ["ROS 2 Humble", "Nav2", "Gazebo", "LiDAR", "TF2", "EKF"]
  },
  { 
    name: "Network Security", 
    category: "Cyber Security & Cryptography", 
    description: "eBPF kernel packet probing, SIEM analysis, intrusion detection, and lateral movement hunting", 
    icon: "Lock", 
    color: "#ef4444",
    relatedTech: ["eBPF", "XDP", "Kafka", "Elasticsearch", "Suricata", "Wireshark"]
  },
  { 
    name: "React.js", 
    category: "Web & Full-Stack Development", 
    description: "Modern component architecture, custom hooks, state management, and glassmorphic UI engineering", 
    icon: "Code", 
    color: "#0284c7",
    relatedTech: ["React 18", "Zustand", "Tailwind CSS", "Vite", "Axios", "Framer Motion"]
  },
  { 
    name: "Node.js & Express", 
    category: "Web & Full-Stack Development", 
    description: "Asynchronous backend microservices, RESTful APIs, JWT authentication, and MongoDB Atlas ODM", 
    icon: "Server", 
    color: "#059669",
    relatedTech: ["Node.js", "Express", "Mongoose", "JWT", "Bcrypt", "Cors"]
  },
  { 
    name: "Biomedical Signal Processing", 
    category: "Healthcare & Biomedical", 
    description: "EEG/ECG wave filtering, Continuous Wavelet Transforms (CWT), and pre-ictal artifact reduction", 
    icon: "Activity", 
    color: "#db2777",
    relatedTech: ["PhysioNet", "PyWavelets", "SciPy", "TensorFlow Lite Micro", "EDF Tools"]
  }
];
