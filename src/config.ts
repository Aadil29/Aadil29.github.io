export const siteConfig = {
  name: "Aadil Ghani",
  title: "Security Architect | AI & Application Security",
  description:
    "Portfolio of Muhammad Aadil Ghani — Security Architect specialising in AI & application security: LLM threat modelling, adversarial ML, and DevSecOps.",
  accentColor: "#3b82f6",

  social: {
    email: "mohammadghani2003@gmail.com",
    linkedin: "https://www.linkedin.com/in/aadil-ghani/",
    github: "https://github.com/Aadil29",
  },

  // Set to a URL to show a blog link in the footer, or leave empty string to hide it

  aboutMe:
    "Security architect at Starling Bank, currently on the Security Architecture rotation of the graduate scheme — STRIDE threat modelling, secure design reviews, and secure-by-design work on agent capabilities — after rotations across security operations and IAM engineering. I hold an Integrated Masters in Computer Science with Cybersecurity, and my focus is securing LLM and agentic systems in regulated environments.",

  skills: [
    {
      category: "AI Security",
      items: [
        "LLM Threat Modelling",
        "Prompt Injection",
        "OWASP LLM Top 10",
        "PyTorch",
        "Speaker Verification",
        "Deepfake Detection",
      ],
    },
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
      slug: "voice-authentication-deepfake",
      name: "Voice Authentication System with Audio Deepfake Detection",
      description:
        "Security research into voice biometrics under adversarial and real-world conditions. A CNN deepfake classifier scored AUC=0.99 on held-out test data, but speaker verification that hit 5.18% EER in-distribution collapsed to 76.84% EER under distribution shift — a case study in how voice authentication fails outside the lab.",
      link: "",
      skills: [
        "Adversarial ML",
        "Deepfake Detection",
        "Speaker Verification",
        "PyTorch",
        "Python",
        "OpenAI Whisper",
        "Librosa",
        "FastAPI",
      ],
      details: {
        // Full writeup shown on the detail page — go as deep as you like
        fullDescription:
          "A browser-based voice authentication system built as a vehicle for security research into the robustness of voice biometrics against spoofing and distribution shift. Users register voice samples and authenticate via live passphrase transcription (OpenAI Whisper), speaker verification (ECAPA-TDNN), and a deepfake classifier combining convolutional and dense neural networks across ten audio features (AUC=0.99). The more interesting result was adversarial: while the deepfake detector performed strongly on in-distribution test data, speaker verification that achieved 5.18% equal error rate under matched conditions degraded to 76.84% EER once evaluated under realistic distribution shift — evidence that headline lab metrics can badly overstate real-world security.",
        // Key achievements / things to call out
        highlights: [
          "Deepfake classifier (CNN + dense layers over 10 audio features) reached AUC=0.99 on held-out test data",
          "Speaker verification EER of 5.18% in-distribution collapsed to 76.84% under distribution shift — the core security finding",
          "Three-layer authentication: passphrase transcription → speaker identity → deepfake detection",
          "OTP delivery and secure session management via a FastAPI backend",
        ],
        sections: [
          {
            heading: "The security question",
            body:
              "Voice authentication is increasingly used as a factor in high-assurance settings, so the research question was not 'can a model detect deepfakes' but 'does it hold up when the input no longer looks like the training data'. Reported AUC/EER figures are almost always measured in-distribution, which is exactly the condition an attacker will avoid.",
          },
          {
            heading: "Robustness under distribution shift",
            body:
              "Speaker verification was evaluated both in-distribution and under a shifted evaluation set. The equal error rate rose from 5.18% to 76.84% — from near-usable to worse than a coin toss for the imposter/genuine decision. This is the headline result: a model can look production-ready on paper and still provide effectively no security once conditions change.",
          },
          {
            heading: "System design",
            body:
              "The end-to-end system chains three checks: Whisper transcribes a live passphrase, an ECAPA-TDNN model verifies speaker identity against registered samples, and the CNN deepfake classifier scores the audio. A FastAPI backend handles OTP delivery and secure session management.",
          },
        ],
        // Image paths relative to the public/ folder — e.g. "/projects/devsecops/architecture.png"
        images: [
          "/ProjectPics/AudioDeepFakeDetection/SignInVoiceIdBeforeRecording.png",
          "/ProjectPics/AudioDeepFakeDetection/SignInFormPassessAllChecks.png",
          "/ProjectPics/AudioDeepFakeDetection/SignUpFormOtpSentAfterSignUpButton.png",
          "/ProjectPics/AudioDeepFakeDetection/SignUpFormListenToSample2Recording.png",
          "/ProjectPics/AudioDeepFakeDetection/SignUpFormVoiceRegSample3BeforeRecord.png",
          "/ProjectPics/AudioDeepFakeDetection/DeepfakeDetectionDecision.png",
          "/ProjectPics/AudioDeepFakeDetection/DeepfakeDetectionStats.png",
        ],
        // YouTube embed URL or direct video URL — leave empty to hide
        videoUrl: "/ProjectPics/AudioDeepFakeDetection/AudioDeepfakeVideo_web.mp4",
        // Link to public repo or live demo — leave empty to hide
        repoUrl: "",
      },
    },
    {
      slug: "owasp-juice-shop",
      name: "OWASP Juice Shop Security Evaluation",
      description:
        "Structured penetration test of OWASP Juice Shop, with each finding formally mapped to Common Criteria Security Functional Requirements — 10 vulnerabilities identified, exploited, and documented to CC Part 3 assurance structure with a video demonstration.",
      link: "",
      skills: ["OWASP Juice Shop", "Kali Linux", "Common Criteria", "Burp Suite"],
      details: {
        fullDescription:
          "A structured penetration test of OWASP Juice Shop evaluated against Common Criteria Security Functional Requirements (SFRs). Rather than an ad-hoc bug hunt, each of the 10 vulnerabilities was exploited and then mapped to the specific SFR it violated, with documented rationale — bringing formal evaluation rigour to a web application assessment. Delivered as a video demonstration and a formal evaluation report structured to CC Part 3 assurance requirements.",
        highlights: [
          "10 vulnerabilities identified and exploited: SQL injection, XSS, broken authentication, IDOR, and more",
          "Each finding mapped to specific Common Criteria SFR violations with formal rationale",
          "Evaluation report structured to CC Part 3 assurance requirements",
          "Video walkthrough demonstrating each exploit end-to-end",
        ],
        sections: [
          {
            heading: "Methodology",
            body:
              "Testing was scoped against Common Criteria Security Functional Requirements and carried out from Kali Linux using Burp Suite as the primary proxy/intercept tool. Each vulnerability was treated as evidence against a specific SFR class (identification & authentication, user data protection, access control), so findings could be argued formally rather than just listed.",
          },
          {
            heading: "Representative exploit chains",
            bullets: [
              "SQL injection at the login form used to bypass authentication and reach an administrative account — a direct violation of the identification & authentication SFRs.",
              "Cross-site scripting used to execute attacker-controlled script in another user's session, breaking the user-data-protection assumptions.",
              "Insecure direct object reference (IDOR) allowing access to another user's basket/data by manipulating identifiers, violating access-control SFRs.",
            ],
          },
          {
            heading: "Formal documentation",
            body:
              "Findings were compiled into an evaluation report modelled on Common Criteria Part 3 assurance requirements: each exploited vulnerability was tied to the SFR it defeated, with a rationale explaining why the observed behaviour constituted a failure of that requirement. Mapping web-app pentest findings to CC SFRs is uncommon at this level and was the point of the exercise — practising formal security evaluation, not just exploitation.",
          },
        ],
        images: [],
        videoUrl: "/ProjectPics/SecurityAudit/JuiceShopVideo_web.mp4",
        repoUrl: "",
      },
    },
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
      dateRange: "May 2026 - Present",
      bullets: [
        "Third rotation of the security graduate scheme, focused on security architecture",
        "Produce STRIDE threat models for integration projects and lead secure design reviews",
        "Contribute to secure coding standards and secure-by-design guidance",
        "Perform security reviews of agent capabilities, embedding secure-by-design into new functionality",
      ],
    },
    {
      company: "Starling Bank",
      title: "IAM Engineer (Graduate)",
      dateRange: "Jan 2026 - May 2026",
      bullets: [
        "Worked primarily in Go, building and extending internal CLI tooling used by IAM analysts for identity and access workflows",
        "Developed infrastructure as code using Terraform for IAM platform projects",
      ],
    },
    {
      company: "Starling Bank",
      title: "SOC Analyst (Graduate)",
      dateRange: "Sept 2025 - Jan 2026",
      bullets: [
        "Conducted incident research mapped to the MITRE ATT&CK framework, producing reports that fed into downstream detection and response work",
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
