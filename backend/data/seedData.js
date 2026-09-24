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
        name: "Aditya Sharma",
        role: "Computer Vision Lead & Model Optimization",
        email: "aditya.s@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Sneha Reddy",
        role: "Backend & Edge Deployment Engineer",
        email: "sneha.r@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Rahul Verma",
        role: "Frontend Dashboard & Geolocation Integrator",
        email: "rahul.v@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
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
    bookmarksCount: 94,
    likesCount: 188,
    rating: { average: 4.9, count: 28 },
    reviews: [
      {
        userId: "user_02",
        userName: "Pooja Hegde (Batch 2025)",
        userRole: "student",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        rating: 5,
        comment: "This project helped our team reuse the CLAHE preprocessing logic for our night-time drone surveillance capstone! Incredible documentation.",
        createdAt: new Date("2024-11-10")
      }
    ],
    status: "Completed",
    isVerified: true,
    isFeatured: true,
    badge: "🏆 1st Prize — National Smart City Hackathon 2024"
  },
  {
    _id: "proj_02",
    title: "AgroVision: Deep Learning Crop Disease Diagnosis & Fertilizer Recommendation App",
    tagline: "Mobile-first agricultural health assistant with offline leaf pathology analysis for rural farmers",
    description: "An AI mobile application capable of identifying 38 distinct plant diseases across 14 crop species using mobile camera snapshots. Features multilingual voice prompts, offline TensorFlow Lite inference, and soil-specific organic remedy schedules.",
    detailedOverview: "Built using EfficientNet-B4 trained on PlantVillage along with 5,000 localized crop images collected from the Regional Agriculture University farm. Integrated with an expert decision tree backend for stage-wise fungicide, biopesticide, and N-P-K nutrient dosage prescriptions.",
    domain: "Smart Agriculture & Environment",
    year: 2023,
    batch: "2019-2023",
    semester: "8th Semester Capstone",
    techStack: ["TensorFlow", "TensorFlow Lite", "Flutter", "Python", "Flask", "SQLite", "Scikit-Learn"],
    skillsRequired: ["Mobile AI", "Transfer Learning", "Agronomy Data Analysis", "Flutter", "Edge Quantization"],
    datasets: [
      {
        name: "PlantVillage + Regional South Indian Paddy Dataset",
        source: "PlantVillage Open Dataset + College Agritech Lab",
        size: "8.4 GB (62,000 images)",
        format: "JPEG / JPG",
        link: "https://github.com/spMohanty/PlantVillage-Dataset",
        description: "Standard plant pathology images supplemented with local paddy blast and tomato curl virus samples."
      }
    ],
    researchPapers: [
      {
        title: "Lightweight Convolutional Architectures for Low-Power Edge Agricultural Diagnosis",
        authors: "Dr. Ananya Sen, Vikram Patel",
        conferenceJournal: "Springer Journal of Agricultural Informatics",
        year: 2023,
        link: "https://link.springer.com/article/agrovision",
        doi: "10.1007/s41870-023-01449-x"
      }
    ],
    problemsFaced: [
      {
        problem: "Farmers in rural regions frequently lose internet connectivity in open fields.",
        solution: "Converted PyTorch model to an optimized 8-bit quantized TensorFlow Lite model under 18MB that executes completely on-device in 80ms.",
        approach: "Post-training integer quantization (PTQ).",
        tags: ["Offline AI", "TFLite", "Mobile Optimization"]
      },
      {
        problem: "Direct sunlight caused specular highlights on waxy leaves, misleading the neural network.",
        solution: "Applied color-space augmentation (HSV shift + Random Shadow Generation) during training.",
        approach: "Albumentations data augmentation library.",
        tags: ["Data Augmentation", "HSV", "Robustness"]
      }
    ],
    lessonsLearned: "Field testing with actual end users (farmers) revealed that voice navigation in local regional languages was 5x more effective than typed text.",
    futureImprovements: "Integrate multispectral satellite imagery (Sentinel-2) for automated macro-level crop stress prediction over 100-acre zones.",
    keyTakeaways: [
      "Offline inference is essential for real-world agricultural adoption.",
      "HSV data augmentation fixes outdoor sun reflection issues."
    ],
    teamMembers: [
      {
        name: "Vikram Patel",
        role: "Deep Learning & Model Training Lead",
        email: "vikram.p@college.edu",
        batch: "2019-2023",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Meera Krishnan",
        role: "Flutter Mobile Developer & UI/UX",
        email: "meera.k@college.edu",
        batch: "2019-2023",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
      }
    ],
    facultySupervisor: {
      name: "Dr. Ananya Sen",
      department: "Information Technology",
      designation: "Associate Professor, Applied AI Lab",
      email: "ananya.sen@college.edu"
    },
    githubLink: "https://github.com/college-agri/agro-vision-mobile",
    liveDemoLink: "https://agrovision.college.edu",
    reportDocLink: "https://docs.college.edu/capstone/2023/agrovision-report.pdf",
    presentationLink: "https://slides.college.edu/2023/agrovision.pdf",
    thumbnail: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop&q=80"
    ],
    views: 1890,
    bookmarksCount: 142,
    likesCount: 260,
    rating: { average: 4.8, count: 41 },
    reviews: [
      {
        userId: "user_03",
        userName: "Karan Johar (Batch 2026)",
        userRole: "student",
        userAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        rating: 5,
        comment: "We used their dataset to build our automated pesticide spraying drone. Outstanding work!",
        createdAt: new Date("2024-08-14")
      }
    ],
    status: "Completed",
    isVerified: true,
    isFeatured: true,
    badge: "🌟 Best Social Impact Project 2023"
  },
  {
    _id: "proj_03",
    title: "CertiChain: Tamper-Proof Academic Credential Verification on Ethereum & IPFS",
    tagline: "Decentralized cryptographic credential issuance and instant one-click QR verification portal",
    description: "A decentralized public credential ledger that allows universities to mint tamper-proof ERC-721 soulbound diploma NFTs with IPFS metadata, enabling employers to verify student degrees instantly without contacting the registrar.",
    detailedOverview: "Built with Solidity smart contracts on Polygon PoS layer 2 for negligible gas fees. Encrypted diploma PDFs stored on Pinata IPFS. Includes a high-performance verification web scanner with Merkle-proof authentication.",
    domain: "Blockchain & Web3",
    year: 2024,
    batch: "2020-2024",
    semester: "8th Semester Capstone",
    techStack: ["Solidity", "Hardhat", "Polygon", "IPFS", "Ethers.js", "Next.js", "Tailwind CSS", "Node.js"],
    skillsRequired: ["Smart Contracts", "Cryptography", "Solidity", "Web3 Integration", "IPFS Storage"],
    datasets: [
      {
        name: "Synthetic University Student Record Dataset",
        source: "College Registrar Mock Vault",
        size: "450 MB (10,000 JSON certificates)",
        format: "JSON + SHA256 hashes",
        link: "https://github.com/college-web3/certichain-dataset",
        description: "Anonymized academic transcripts, grade point averages, and digital signatures."
      }
    ],
    researchPapers: [
      {
        title: "Zero-Knowledge Proofs for Privacy-Preserving Academic Verifications on Layer-2 Blockchains",
        authors: "Dr. S. K. Nair, Tanmay Joshi",
        conferenceJournal: "ACM Conference on Information Security and Cryptography",
        year: 2024,
        link: "https://dl.acm.org/doi/certichain-zkp",
        doi: "10.1145/3588965.3589888"
      }
    ],
    problemsFaced: [
      {
        problem: "Ethereum mainnet gas fees made batch minting 2,000 graduation certificates cost over $1,500.",
        solution: "Migrated to Polygon Layer-2 and implemented ERC-1155 batch minting smart contract, reducing total cost for 2,000 certificates to less than $0.40.",
        approach: "ERC-1155 batch transfer with EIP-712 typed signature authentication.",
        tags: ["Gas Optimization", "Layer 2", "Polygon"]
      }
    ],
    lessonsLearned: "Do not store personal identifiable information (PII) on-chain. Store only cryptographic salted hashes of the document.",
    futureImprovements: "Add Zero-Knowledge (zk-SNARK) verification so students can prove they graduated with a GPA > 3.5 without revealing their exact transcript.",
    keyTakeaways: [
      "Layer-2 batch minting reduces credential issuance cost by 99.9%.",
      "Soulbound non-transferable token standards prevent credential resale."
    ],
    teamMembers: [
      {
        name: "Tanmay Joshi",
        role: "Smart Contract Architect",
        email: "tanmay.j@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Anjali Gupta",
        role: "Full-Stack Web3 Developer",
        email: "anjali.g@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80"
      }
    ],
    facultySupervisor: {
      name: "Dr. S. K. Nair",
      department: "Information Science & Engineering",
      designation: "Professor & Cryptography Chair",
      email: "sk.nair@college.edu"
    },
    githubLink: "https://github.com/college-web3/certichain-dapp",
    liveDemoLink: "https://certichain.college.edu",
    reportDocLink: "https://docs.college.edu/capstone/2024/certichain.pdf",
    presentationLink: "https://slides.college.edu/2024/certichain-deck.pdf",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80"
    ],
    views: 1120,
    bookmarksCount: 88,
    likesCount: 145,
    rating: { average: 4.7, count: 19 },
    reviews: [],
    status: "Completed",
    isVerified: true,
    isFeatured: false,
    badge: "⚡ Polygon Devpost Grant Winner"
  },
  {
    _id: "proj_04",
    title: "NeuroPulse: EEG-Based Real-Time Epileptic Seizure Prediction & Alert Wearable",
    tagline: "Biomedical neural network predicting seizure onset 15 minutes before physical symptoms occur",
    description: "A wearable headband prototype equipped with 8-channel EEG electrodes that stream continuous brainwave telemetry to a mobile app. Uses 1D Convolutional LSTM neural networks to classify pre-ictal spikes and trigger automated caregiver alerts.",
    detailedOverview: "Trained on the CHB-MIT Scalp EEG database containing over 800 hours of continuous multi-channel recordings. Achieved 94.2% sensitivity with a false alert rate of only 0.12 per hour.",
    domain: "Healthcare & Biomedical",
    year: 2024,
    batch: "2020-2024",
    semester: "8th Semester Capstone",
    techStack: ["PyTorch", "MNE-Python", "TensorFlow", "Raspberry Pi", "Flutter", "Bluetooth BLE", "Scipy"],
    skillsRequired: ["Biomedical Signal Processing", "EEG Analysis", "LSTM Networks", "Wearable Hardware", "BLE"],
    datasets: [
      {
        name: "CHB-MIT Scalp EEG Database",
        source: "PhysioNet / Harvard Medical School",
        size: "42.5 GB (916 hours)",
        format: "EDF (European Data Format)",
        link: "https://physionet.org/content/chbmit/1.0.0/",
        description: "Standard clinical EEG telemetry recording pediatric subjects with intractable seizures."
      }
    ],
    researchPapers: [
      {
        title: "Pre-ictal Phase Detection via Wavelet Scattering Transform and Bi-LSTM",
        authors: "Dr. Geeta Pillai, Rohit Nair",
        conferenceJournal: "IEEE Transactions on Biomedical Engineering",
        year: 2024,
        link: "https://ieeexplore.ieee.org/document/neuropulse-tbme",
        doi: "10.1109/TBME.2024.3218765"
      }
    ],
    problemsFaced: [
      {
        problem: "Movement artifacts (blinking, jaw clenching) corrupted raw EEG channels with huge voltage spikes.",
        solution: "Integrated Independent Component Analysis (ICA) and Butterworth bandpass filters (0.5Hz - 45Hz) in real time.",
        approach: "Real-time sliding window FastICA filter implementation in C++ / Scipy.",
        tags: ["EEG Artifacts", "FastICA", "Butterworth Filter"]
      }
    ],
    lessonsLearned: "Signal-to-noise ratio in biomedical sensors requires analog shielding before applying digital filters.",
    futureImprovements: "Design custom ASIC PCB to reduce headband power consumption to less than 20mW for 48-hour battery longevity.",
    keyTakeaways: [
      "FastICA removes ocular and muscular artifacts with 98% accuracy.",
      "1D-CNN + LSTM architecture is optimal for sequential time-series biosignals."
    ],
    teamMembers: [
      {
        name: "Rohit Nair",
        role: "Biomedical Hardware & DSP Engineer",
        email: "rohit.n@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Shreya Sen",
        role: "Deep Learning Signal Processing Lead",
        email: "shreya.s@college.edu",
        batch: "2020-2024",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      }
    ],
    facultySupervisor: {
      name: "Dr. Geeta Pillai",
      department: "Electronics & Communication",
      designation: "Professor, Biomedical Instruments Lab",
      email: "geeta.pillai@college.edu"
    },
    githubLink: "https://github.com/college-bio/neuropulse-eeg",
    liveDemoLink: "",
    reportDocLink: "https://docs.college.edu/capstone/2024/neuropulse.pdf",
    presentationLink: "https://slides.college.edu/2024/neuropulse.pdf",
    thumbnail: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop&q=80"
    ],
    views: 1640,
    bookmarksCount: 110,
    likesCount: 215,
    rating: { average: 5.0, count: 32 },
    reviews: [],
    status: "Completed",
    isVerified: true,
    isFeatured: true,
    badge: "🩺 IEEE Biomedical Innovation Excellence"
  },
  {
    _id: "proj_05",
    title: "EchoBhasha: Indic Multilingual Speech-to-Text & Regional Dialect Translator",
    tagline: "Fine-tuned Whisper model for low-resource Indian languages with vernacular context understanding",
    description: "An open-source voice AI platform supporting real-time speech transcription, dialect translation, and conversational voice queries across Hindi, Telugu, Tamil, Bengali, and Marathi with code-mixed (Hinglish) understanding.",
    detailedOverview: "Fine-tuned OpenAI Whisper-Large-v3 on 1,200 hours of crowdsourced regional audio collected from collegiate language societies and All India Radio podcasts. Features an acoustic accent adaptation module.",
    domain: "Natural Language Processing",
    year: 2023,
    batch: "2019-2023",
    semester: "8th Semester Capstone",
    techStack: ["PyTorch", "HuggingFace Transformers", "OpenAI Whisper", "FastAPI", "React", "WebRTC", "Docker"],
    skillsRequired: ["NLP", "Speech Recognition", "ASR Fine-Tuning", "Transformer Models", "Audio Processing"],
    datasets: [
      {
        name: "IndicSpeech & College Vernacular Audio Corpus",
        source: "AI4Bharat & College Linguistic Society",
        size: "34.0 GB (1,200 audio hours)",
        format: "WAV 16kHz & JSON transcripts",
        link: "https://ai4bharat.iitm.ac.in/indicspeech",
        description: "Multi-speaker speech datasets covering 12 Indian languages with noisy background ambient recordings."
      }
    ],
    researchPapers: [
      {
        title: "Acoustic Representation Fine-Tuning for Code-Mixed Indian Vernacular Speech",
        authors: "Dr. K. V. S. Murthy, Karthik Sundaram",
        conferenceJournal: "Interspeech Conference Proceedings",
        year: 2023,
        link: "https://interspeech2023.org/echobhasha",
        doi: "10.21437/Interspeech.2023-1044"
      }
    ],
    problemsFaced: [
      {
        problem: "Frequent switching between English and native language (code-mixing) caused standard ASR to fail.",
        solution: "Built a phoneme-level language identification (LID) front-end classifier before routing audio tokens to the decoder.",
        approach: "Hybrid CTC/Attention transformer with byte-level BPE tokenizer.",
        tags: ["Code-Mixing", "LID", "Tokenizer"]
      }
    ],
    lessonsLearned: "Audio normalization and silence trimming using WebRTC VAD reduced training duration by 40%.",
    futureImprovements: "Implement zero-shot voice cloning in translated target languages.",
    keyTakeaways: [
      "Phoneme-level tokenization resolves Hinglish / Tanglish code-mixing errors.",
      "VAD pre-filtering saves significant compute during transcription."
    ],
    teamMembers: [
      {
        name: "Karthik Sundaram",
        role: "Speech AI & Transformer Architect",
        email: "karthik.s@college.edu",
        batch: "2019-2023",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
      },
      {
        name: "Divya Rao",
        role: "Dataset Curator & Linguistic Pipeline Lead",
        email: "divya.r@college.edu",
        batch: "2019-2023",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      }
    ],
    facultySupervisor: {
      name: "Dr. K. V. S. Murthy",
      department: "Computer Science",
      designation: "Professor, Speech and Language Technology Lab",
      email: "kvs.murthy@college.edu"
    },
    githubLink: "https://github.com/college-nlp/echo-bhasha",
    liveDemoLink: "https://echobhasha.college.edu",
    reportDocLink: "https://docs.college.edu/capstone/2023/echobhasha.pdf",
    presentationLink: "https://slides.college.edu/2023/echobhasha.pdf",
    thumbnail: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&auto=format&fit=crop&q=80"
    ],
    views: 1350,
    bookmarksCount: 92,
    likesCount: 174,
    rating: { average: 4.8, count: 24 },
    reviews: [],
    status: "Completed",
    isVerified: true,
    isFeatured: true,
    badge: "🗣️ AI4India Best Language Innovation"
  },
  {
    _id: "proj_06",
    title: "VoltGrid: IoT-Based Smart Campus Energy Optimization & Microgrid Load Balancer",
    tagline: "Autonomous energy monitoring and predictive HVAC/lighting shedder reducing campus power bills by 28%",
    description: "A distributed IoT network of 120 ESP32 smart power meters installed across college academic blocks, hostels, and laboratories. Collects sub-second wattage, reactive power, and harmonic distortion to balance solar PV microgrids with grid power.",
    detailedOverview: "Leverages MQTT broker over local Wi-Fi mesh, feeding an InfluxDB time-series database. An XGBoost model predicts peak load surges 1 hour in advance and dynamically toggles non-essential air conditioning loads to avoid surge tariff penalties.",
    domain: "Internet of Things & Embedded",
    year: 2024,
    batch: "2020-2024",
    semester: "8th Semester Capstone",
    techStack: ["ESP32", "C++", "FreeRTOS", "MQTT", "InfluxDB", "Grafana", "Python", "XGBoost", "React"],
    skillsRequired: ["IoT Firmware", "Embedded C++", "Time-Series Forecasting", "Microgrids", "MQTT"],
    datasets: [
      {
        name: "Campus 3-Year 15-Minute Power Consumption Telemetry",
        source: "Campus Substation Scada & VoltGrid Nodes",
        size: "1.2 GB (2.4 Million data points)",
        format: "CSV & InfluxDB Line Protocol",
        link: "https://github.com/college-iot/voltgrid-dataset",
        description: "Phase voltages, current, active/reactive power, ambient temperature, and academic calendar occupancy logs."
      }
    ],
    researchPapers: [
      {
        title: "Predictive Microgrid Peak Load Shaving using Ensemble Tree Estimators",
        authors: "Dr. P. Rajan, Varun Chandra",
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
    bio: "Passionate about Machine Learning, Computer Vision, and Building scalable full-stack knowledge platforms.",
    headline: "AI Researcher & Full-Stack Engineer | 3rd Year CSE",
    skills: [
      { name: "Computer Vision", level: "Advanced", endorsements: 14 },
      { name: "Deep Learning", level: "Advanced", endorsements: 12 },
      { name: "React.js", level: "Expert", endorsements: 20 },
      { name: "Node.js", level: "Advanced", endorsements: 15 },
      { name: "Python", level: "Expert", endorsements: 22 },
      { name: "MongoDB", level: "Advanced", endorsements: 11 }
    ],
    interests: ["Computer Vision", "Autonomous Systems", "Graph Databases", "Cloud Computing"],
    github: "https://github.com/gowrisimhadri",
    linkedin: "https://linkedin.com/in/gowrisimhadri",
    portfolio: "https://gowrisimhadri.dev",
    bookmarks: ["proj_01", "proj_02", "proj_04"],
    recentlyViewed: ["proj_01", "proj_02", "proj_03", "proj_04", "proj_05", "proj_06"],
    rating: { average: 4.9, count: 16 }
  },
  {
    _id: "user_faculty_01",
    name: "Dr. Ramesh Kumar",
    email: "ramesh.kumar@college.edu",
    password: "$2a$10$YourHashedPasswordHereOrAutoBcrypt",
    role: "faculty",
    batch: "Faculty",
    branch: "Computer Science & Engineering",
    department: "CSE",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    bio: "Head of Vision AI Research Center. Guiding undergraduate and postgraduate thesis on Edge Vision & Intelligent Transport.",
    headline: "Professor & Chair of AI Research Lab",
    skills: [
      { name: "Computer Vision", level: "Expert", endorsements: 85 },
      { name: "Deep Learning", level: "Expert", endorsements: 92 },
      { name: "Edge AI", level: "Expert", endorsements: 64 },
      { name: "Pattern Recognition", level: "Expert", endorsements: 71 }
    ],
    interests: ["Vision Transformers", "Autonomous Driving", "Medical Imaging", "Edge Optimization"],
    github: "https://github.com/dr-ramesh-ai",
    linkedin: "https://linkedin.com/in/dr-ramesh-kumar",
    bookmarks: ["proj_01"],
    recentlyViewed: ["proj_01"],
    rating: { average: 5.0, count: 48 }
  }
];

export const sampleSkills = [
  { name: "Computer Vision", category: "AI & ML", description: "Image and video understanding, object detection, segmentation", icon: "Eye", color: "#6366f1" },
  { name: "Deep Learning", category: "AI & ML", description: "Neural network architectures, PyTorch, TensorFlow", icon: "Brain", color: "#8b5cf6" },
  { name: "Natural Language Processing", category: "AI & ML", description: "Transformers, LLMs, Text generation, Speech-to-Text", icon: "MessageSquare", color: "#ec4899" },
  { name: "Edge AI", category: "AI & ML", description: "TensorRT, TFLite, ONNX, Low-power neural inference", icon: "Cpu", color: "#06b6d4" },
  { name: "React.js", category: "Web Development", description: "Modern React hooks, component architecture, state management", icon: "Code", color: "#3b82f6" },
  { name: "Node.js & Express", category: "Web Development", description: "REST APIs, asynchronous microservices, authentication", icon: "Server", color: "#10b981" },
  { name: "Smart Contracts & Solidity", category: "Blockchain", description: "EVM protocols, ERC tokens, DeFi & Soulbound logic", icon: "ShieldCheck", color: "#f59e0b" },
  { name: "IoT & Embedded C++", category: "IoT", description: "ESP32, FreeRTOS, MQTT, Sensor integration", icon: "Radio", color: "#f43f5e" }
];
