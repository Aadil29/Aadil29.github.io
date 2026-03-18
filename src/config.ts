export const siteConfig = {
  name: "Aadil Ghani",
  title: "DevSecOps & Security Engineer",
  description:
    "Portfolio of Muhammad Aadil Ghani — DevSecOps & Security Engineer",
  accentColor: "#3b82f6",

  social: {
    email: "mohammadghani2003@gmail.com",
    linkedin: "https://linkedin.com/in/YOUR_LINKEDIN",
    github: "https://github.com/Aadil29",
  },

  // Set to a URL to show a blog link in the footer, or leave empty string to hide it

  aboutMe:
    "Security analyst at Starling Bank, working across security operations and identity infrastructure. I hold an Integrated Masters in Computer Science with Cybersecurity and I'm driven by building secure, automated systems — with a particular focus on DevSecOps.",

  skills: [
    {
      category: "Languages",
      items: ["Python", "Go", "Java", "JavaScript"],
    },
    {
      category: "Infra & Cloud",
      items: ["AWS", "EKS", "EC2", "S3", "IAM", "CloudWatch", "Docker", "Kubernetes", "Terraform"],
    },
    {
      category: "Security",
      items: ["Wireshark", "Nmap", "SonarQube", "Trivy", "Burp Suite", "OWASP Tools", "Hydra", "John the Ripper"],
    },
    {
      category: "CI/CD",
      items: ["Jenkins", "GitHub Actions", "TeamCity", "Argo CD"],
    },
  ],

  projects: [
    {
      slug: "cloud-native-devsecops",
      name: "Cloud-Native DevSecOps Pipeline",
      // Short description shown on the homepage card
      description:
        "Built a cloud-native application on AWS using end-to-end DevSecOps practices — Terraform, Docker, EKS, Jenkins, GitHub Actions, SonarQube, Trivy, Argo CD, Prometheus, and Grafana.",
      link: "",
      skills: [
        "AWS",
        "Terraform",
        "Docker",
        "Kubernetes",
        "Jenkins",
        "GitHub Actions",
        "SonarQube",
        "Trivy",
        "OWASP Dependency-Check",
        "Argo CD",
        "Prometheus",
        "Grafana",
      ],
      details: {
        // Full writeup shown on the detail page — go as deep as you like
        fullDescription:
          "Built a cloud-native application on AWS using end-to-end DevSecOps practices. Provisioned infrastructure with Terraform, containerised with Docker, and orchestrated on Amazon EKS with Kubernetes. Implemented CI/CD pipelines using Jenkins and GitHub Actions with integrated security scanning — OWASP Dependency-Check, Trivy for container vulnerabilities, and SonarQube for static analysis. Deployed using Argo CD and GitOps principles. Monitoring via Prometheus and Grafana, with CloudWatch for AWS-level observability.",
        // Key achievements / things to call out
        highlights: [
          "End-to-end infrastructure as code with Terraform — VPC, EKS cluster, IAM roles, S3 buckets",
          "Jenkins + GitHub Actions pipelines with security gates: OWASP Dependency-Check, Trivy, SonarQube",
          "GitOps delivery via Argo CD — declarative, auditable deployments",
          "Full observability stack: Prometheus metrics, Grafana dashboards, CloudWatch alarms",
        ],
        // Image paths relative to the public/ folder — e.g. "/projects/devsecops/architecture.png"
        images: [
          // "/projects/devsecops/architecture.png",
          // "/projects/devsecops/pipeline.png",
        ],
        // YouTube embed URL or direct video URL — leave empty to hide
        videoUrl: "",
        // Link to public repo or live demo — leave empty to hide
        repoUrl: "",
      },
    },
    {
      slug: "voice-authentication-deepfake",
      name: "Voice Authentication System with Audio Deepfake Detection",
      description:
        "Browser-based voice authentication with ML deepfake detection — OpenAI Whisper transcription, ECAPA-TDNN speaker verification, and a CNN classifier achieving AUC=0.99 across ten audio features.",
      link: "",
      skills: [
        "Python",
        "PyTorch",
        "TensorFlow",
        "FastAPI",
        "OpenAI Whisper",
        "Librosa",
        "Scikit-learn",
      ],
      details: {
        fullDescription:
          "Designed and built a browser-based voice authentication system with integrated ML-based deepfake detection. Users register voice samples and authenticate via live passphrase transcription (OpenAI Whisper), speaker verification (ECAPA-TDNN), and a deepfake classifier combining convolutional and dense neural networks across ten audio features (AUC=0.99). Includes OTP delivery, secure session management, and a FastAPI backend.",
        highlights: [
          "Three-layer authentication: passphrase transcription → speaker identity → deepfake detection",
          "ECAPA-TDNN speaker verification model fine-tuned on registered voice samples",
          "CNN+dense deepfake classifier across 10 audio features — AUC of 0.99 on test set",
          "OTP delivery and secure session management via FastAPI backend",
        ],
        images: [
          "/ProjectPics/AudioDeepFakeDetection/SignInVoiceIdBeforeRecording.png",
          "/ProjectPics/AudioDeepFakeDetection/SignInFormPassessAllChecks.png",
          "/ProjectPics/AudioDeepFakeDetection/SignUpFormOtpSentAfterSignUpButton.png",
          "/ProjectPics/AudioDeepFakeDetection/SignUpFormListenToSample2Recording.png",
          "/ProjectPics/AudioDeepFakeDetection/SignUpFormVoiceRegSample3BeforeRecord.png",
          "/ProjectPics/AudioDeepFakeDetection/DeepfakeDetectionDecision.png",
          "/ProjectPics/AudioDeepFakeDetection/DeepfakeDetectionStats.png",
        ],
        videoUrl: "/ProjectPics/AudioDeepFakeDetection/AudioDeepfakeVideo_web.mp4",
        repoUrl: "",
      },
    },
    {
      slug: "owasp-juice-shop",
      name: "OWASP Juice Shop Security Evaluation",
      description:
        "Structured penetration test of OWASP Juice Shop mapped to Common Criteria SFRs — 10 vulnerabilities identified, exploited, and formally documented with a video demonstration.",
      link: "",
      skills: ["OWASP Juice Shop", "Kali Linux", "Common Criteria", "Burp Suite"],
      details: {
        fullDescription:
          "Conducted a structured penetration test of OWASP Juice Shop against Common Criteria Security Functional Requirements (SFRs). Identified and exploited 10 vulnerabilities, mapping each to specific SFR violations with documented rationale. Delivered a video demonstration and formal evaluation report.",
        highlights: [
          "10 vulnerabilities identified and exploited: SQL injection, XSS, broken auth, IDOR, and more",
          "Each finding mapped to specific Common Criteria SFR violations with formal rationale",
          "Video walkthrough produced demonstrating each exploit end-to-end",
          "Formal evaluation report structured to CC Part 3 assurance requirements",
        ],
        images: [],
        videoUrl: "/ProjectPics/SecurityAudit/JuiceShopVideo_web.mp4",
        repoUrl: "",
      },
    },
    {
      slug: "ev-charging-system",
      name: "EV Charging Management System",
      description:
        "Full-stack EV charging platform with real-time location, booking, scheduling, and payment — Firebase Auth, Google Maps API, cloud billing dashboard, deployed on AWS with SSL/TLS.",
      link: "",
      skills: ["Next.js", "React", "JavaScript", "AWS", "Firebase", "Google Maps API"],
      details: {
        fullDescription:
          "Built a full-stack EV charging management system with real-time charger location, booking, scheduling, and payment processing. Implemented Firebase Auth for secure user authentication, Google Maps API integration, cloud-based billing, and a real-time analytics dashboard. Deployed on AWS with scalable architecture, load balancing, and SSL/TLS encryption.",
        highlights: [
          "Real-time charger availability and booking via Google Maps API integration",
          "Firebase Auth for secure user authentication and session management",
          "Cloud-based billing and payment processing with real-time analytics dashboard",
          "AWS deployment: load balancing, auto-scaling, SSL/TLS termination",
        ],
        images: [
          "/ProjectPics/EVchargingStation/HomePage.jpg",
          "/ProjectPics/EVchargingStation/MapChargerLocations.jpg",
          "/ProjectPics/EVchargingStation/ChargingPortDetails.jpg",
          "/ProjectPics/EVchargingStation/ChargerAvailabilityCalendar.jpg",
          "/ProjectPics/EVchargingStation/BookingReservationTimeSlots.jpg",
          "/ProjectPics/EVchargingStation/Payments.jpg",
          "/ProjectPics/EVchargingStation/AnalyticsDashboard.jpg",
          "/ProjectPics/EVchargingStation/CreateAccountForm.jpg",
          "/ProjectPics/EVchargingStation/ForgotPasswordScreen.jpg",
          "/ProjectPics/EVchargingStation/NavBar.jpg",
        ],
        videoUrl: "",
        repoUrl: "",
      },
    },
  ],

  experience: [
    {
      company: "Starling Bank",
      title: "Security Architect (Graduate)",
      dateRange: "May 2025 - Sept 2025",
      bullets: [
        "Rotation focused on security architecture and threat modelling",
      ],
    },
    {
      company: "Starling Bank",
      title: "IAM Engineer (Graduate)",
      dateRange: "Jan 2025 - Apr 2025",
      bullets: [
        "Built CLI tooling in Go to support identity and access management workflows",
        "Developed infrastructure as code using Terraform for IAM platform projects",
      ],
    },
    {
      company: "Starling Bank",
      title: "SecOps Analyst (Graduate)",
      dateRange: "Sept 2024 - Jan 2025",
      bullets: [
        "Performed threat hunting, alert triage, and incident response across the security operations function",
        "Contributed to a Kubernetes surge week, gaining hands-on experience with container orchestration in a production environment",
      ],
    },
  ],

  education: [
    {
      school: "City St George's, University of London",
      degree: "Integrated Masters in Computer Science with Cybersecurity (MSci)",
      dateRange: "",
      achievements: [],
    },
  ],
};
