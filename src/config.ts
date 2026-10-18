// ---------------------------------------------------------------------------
// Site configuration: the single source of truth for every piece of content.
//
// Every optional field (marked `?`) can be deleted or left unset and the UI
// that depends on it disappears. Nothing in the comments below is rendered.
// Lines marked "TODO(owner)" are facts only the owner knows; fill them in or
// leave them unset.
// ---------------------------------------------------------------------------

export interface Cta {
  label: string;
  href: string;
}

export interface Stat {
  /** Short figure, rendered large in a monospace face, e.g. "0.99". */
  value: string;
  /** What the figure means, e.g. "Deepfake classifier AUC". */
  label: string;
}

export interface ProjectImage {
  /** Path relative to public/, e.g. "/ProjectPics/App/Home.png". A sibling
   *  .webp with the same name is picked up automatically if it exists. */
  src: string;
  /** Describes what the screenshot shows (screen-reader text). */
  alt: string;
  /** Optional visible caption under the image in the gallery. */
  caption?: string;
}

export interface ProjectLinks {
  /** Public source repository. */
  repo?: string;
  /** Live demo / deployed app. */
  demo?: string;
  /** Report, paper or dissertation PDF. */
  report?: string;
  /** External video walkthrough (YouTube etc). Local videos go in details.videoUrl. */
  video?: string;
}

export interface CaseStudy {
  problem?: string;
  approach?: string;
  result?: string;
  /** "What I'd do differently" */
  lessons?: string;
}

export interface ProjectSection {
  heading: string;
  body?: string;
  bullets?: string[];
}

export interface Project {
  /** Enables the /projects/[slug] case-study page. */
  slug?: string;
  name: string;
  /** Short eyebrow above the title, e.g. "AI security research". */
  category?: string;
  /** Short description for the home page card. */
  description: string;
  /** External link used only when there is no slug. */
  link?: string;
  skills?: string[];
  /** Your personal role, e.g. "Solo: design, build and evaluation". */
  role?: string;
  /** e.g. "Oct 2024 - Apr 2025" */
  timeframe?: string;
  /** e.g. "Solo" or "Team of 4" */
  team?: string;
  /** Headline figures shown on the card and detail page. Use real numbers only. */
  stats?: Stat[];
  links?: ProjectLinks;
  /** How screenshots are framed: a browser window (desktop UI) or a phone. */
  frame?: "browser" | "phone";
  /** Ordered stages for a simple flow diagram on the detail page. */
  flow?: string[];
  caseStudy?: CaseStudy;
  details?: {
    fullDescription?: string;
    highlights?: string[];
    sections?: ProjectSection[];
    /** First image is the cover. For phone frames the first two are shown. */
    images?: ProjectImage[];
    /** Local .mp4 (relative to public/) or an embeddable video URL. */
    videoUrl?: string;
    /** Poster image for the video (relative to public/). */
    videoPoster?: string;
  };
}

export interface Experience {
  company: string;
  title: string;
  dateRange: string;
  bullets: string[];
  skills?: string[];
}

export interface Education {
  school: string;
  degree: string;
  dateRange?: string;
  achievements?: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface SiteConfig {
  name: string;
  title: string;
  /** Used for the <meta name="description"> and social previews. */
  description: string;
  /** Optional override for the accent fill colour (buttons, focus rings).
   *  Must give at least 4.5:1 with white text. Leave unset for Apple blue. */
  accentColor?: string;
  /** Short availability line in the hero, e.g. "Open to security architecture roles". */
  availability?: string;
  /** e.g. "London, UK" */
  location?: string;
  /** Path or URL to a CV PDF (put the file in public/, e.g. "/cv.pdf"). */
  cvUrl?: string;
  hero?: {
    eyebrow?: string;
    lede?: string;
    primaryCta?: Cta;
    secondaryCta?: Cta;
    /** Show the current role and company in the hero. They are read from the
     *  experience entry whose dateRange contains "Present" (no duplication).
     *  Defaults to true; set false to hide. */
    showCurrentRole?: boolean;
  };
  /** Public profile links. There is deliberately no email field: the address
   *  is never rendered. Messages arrive through the contact form instead. */
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  contact?: {
    heading?: string;
    body?: string;
    /** POST endpoint for the contact form. The form renders only when set.
     *  "/api/contact" is the Cloudflare Pages Function in functions/api/contact.ts
     *  (recipient and API key live in Cloudflare env vars, never in the repo). */
    formEndpoint?: string;
    /** Optional Cloudflare Turnstile site key (public). When set, the form shows
     *  the Turnstile widget and loads its script; set TURNSTILE_SECRET in
     *  Cloudflare so the function verifies it. Leave unset to disable. */
    turnstileSiteKey?: string;
  };
  aboutMe?: string;
  skills?: SkillGroup[];
  projects?: Project[];
  experience?: Experience[];
  education?: Education[];
}

export const siteConfig: SiteConfig = {
  name: "Aadil Ghani",
  title: "Security Architect | AI & Application Security",
  description:
    "Portfolio of Muhammad Aadil Ghani — Security Architect specialising in AI & application security: LLM threat modelling, adversarial ML, and DevSecOps.",

  // accentColor: unset -> Apple blue (#0071e3). The previous value #3b82f6
  // only reaches 3.68:1 with white text, which fails WCAG AA for buttons.

  // TODO(owner): one line on what you are open to, e.g. "Open to ... roles".
  // availability: "",
  // TODO(owner): e.g. "London, UK" (only if you want it public).
  // location: "",
  // TODO(owner): add your CV to public/ (e.g. public/cv.pdf) and set "/cv.pdf".
  // cvUrl: "",

  hero: {
    eyebrow: "Security Architect · AI & Application Security",
    lede: "Securing LLM and agentic systems in regulated environments.",
    primaryCta: { label: "View work", href: "#projects" },
    secondaryCta: { label: "Get in touch", href: "#contact" },
    // Current role/company come from the "Present" experience entry below.
  },

  social: {
    linkedin: "https://www.linkedin.com/in/aadil-ghani/",
    github: "https://github.com/Aadil29",
  },

  contact: {
    heading: "Let's talk.",
    body: "Questions about AI security, threat modelling or any of the work above are welcome.",
    formEndpoint: "/api/contact",
    // turnstileSiteKey: "0x4AAAAAAA...", // optional spam check, see README
  },

  aboutMe:
    "Security architect at Starling Bank, working full-time on STRIDE threat modelling, secure design reviews, and secure-by-design work on agent capabilities. I joined through the graduate scheme, with rotations across security operations and IAM engineering before moving into security architecture. I hold an Integrated Masters in Computer Science with Cybersecurity, and my focus is securing LLM and agentic systems in regulated environments.",

  // Condensed to what the projects and experience below actually show.
  skills: [
    {
      category: "AI security",
      items: [
        "LLM Threat Modelling",
        "Prompt Injection",
        "OWASP LLM Top 10",
        "Deepfake Detection",
        "Speaker Verification",
        "PyTorch",
      ],
    },
    {
      category: "Cloud & DevSecOps",
      items: ["AWS", "Terraform", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Argo CD", "SonarQube", "Trivy"],
    },
    {
      category: "Languages & testing",
      items: ["Python", "Go", "JavaScript", "Burp Suite"],
    },
  ],

  projects: [
    {
      slug: "voice-authentication-deepfake",
      name: "Voice Authentication System with Audio Deepfake Detection",
      category: "AI security research",
      description:
        "Security research into voice biometrics under adversarial and real-world conditions. A CNN deepfake classifier scored AUC=0.99 on held-out test data, but speaker verification that hit 5.18% EER in-distribution collapsed to 76.84% EER under distribution shift — a case study in how voice authentication fails outside the lab.",
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
      stats: [
        { value: "0.99", label: "Deepfake classifier AUC" },
        { value: "5.18%", label: "Speaker EER, in-distribution" },
        { value: "76.84%", label: "Speaker EER, under shift" },
      ],
      frame: "browser",
      flow: [
        "Passphrase transcription (Whisper)",
        "Speaker verification (ECAPA-TDNN)",
        "Deepfake detection (CNN)",
      ],
      // TODO(owner): role, timeframe, team. The demo video credits this as a
      // final-year project; say so here if you want it shown.
      // role: "",
      // timeframe: "",
      // team: "",
      // TODO(owner): repo / report (dissertation PDF) links if shareable.
      // links: { repo: "", report: "" },
      // TODO(owner): optional case-study fields (problem/approach/result/lessons).
      // caseStudy: { lessons: "" },
      details: {
        fullDescription:
          "A browser-based voice authentication system built as a vehicle for security research into the robustness of voice biometrics against spoofing and distribution shift. Users register voice samples and authenticate via live passphrase transcription (OpenAI Whisper), speaker verification (ECAPA-TDNN), and a deepfake classifier combining convolutional and dense neural networks across ten audio features (AUC=0.99). The more interesting result was adversarial: while the deepfake detector performed strongly on in-distribution test data, speaker verification that achieved 5.18% equal error rate under matched conditions degraded to 76.84% EER once evaluated under realistic distribution shift — evidence that headline lab metrics can badly overstate real-world security.",
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
        images: [
          {
            src: "/ProjectPics/AudioDeepFakeDetection/SignInVoiceIdBeforeRecording.png",
            alt: "Voice authentication dialog asking the user to say a passphrase, with a Start Recording button",
            caption: "Sign in: say the passphrase",
          },
          {
            src: "/ProjectPics/AudioDeepFakeDetection/SignInFormPassessAllChecks.png",
            alt: "Voice authentication result showing the transcribed passphrase, a passphrase match, a similarity score and a deepfake check of No",
            caption: "Sign in: all checks passed",
          },
          {
            src: "/ProjectPics/AudioDeepFakeDetection/SignUpFormOtpSentAfterSignUpButton.png",
            alt: "Sign-up form asking for the 6-digit verification code sent by email",
            caption: "Sign up: email verification code",
          },
          {
            src: "/ProjectPics/AudioDeepFakeDetection/SignUpFormListenToSample2Recording.png",
            alt: "Voice registration dialog, sample 2 of 3, with playback and re-record controls",
            caption: "Sign up: voice sample 2 of 3",
          },
          {
            src: "/ProjectPics/AudioDeepFakeDetection/SignUpFormVoiceRegSample3BeforeRecord.png",
            alt: "Voice registration dialog, sample 3 of 3, ready to record",
            caption: "Sign up: voice sample 3 of 3",
          },
          {
            src: "/ProjectPics/AudioDeepFakeDetection/DeepfakeDetectionDecision.png",
            alt: "Audio deepfake detection page with an uploaded WAV file classified as bonafide",
            caption: "Deepfake detection: bonafide result",
          },
          {
            src: "/ProjectPics/AudioDeepFakeDetection/DeepfakeDetectionStats.png",
            alt: "Deepfake detection statistics dialog with total, bonafide and spoof upload counts",
            caption: "Deepfake detection statistics",
          },
        ],
        videoUrl: "/ProjectPics/AudioDeepFakeDetection/AudioDeepfakeVideo_web.mp4",
        videoPoster: "/ProjectPics/AudioDeepFakeDetection/DeepfakeDetectionDecision.webp",
      },
    },
    {
      slug: "owasp-juice-shop",
      name: "OWASP Juice Shop Security Evaluation",
      category: "Penetration testing",
      description:
        "Structured penetration test of OWASP Juice Shop, with each finding formally mapped to Common Criteria Security Functional Requirements — 10 vulnerabilities identified, exploited, and documented to CC Part 3 assurance structure with a video demonstration.",
      skills: ["OWASP Juice Shop", "Kali Linux", "Common Criteria", "Burp Suite"],
      stats: [{ value: "10", label: "Vulnerabilities exploited and mapped to CC SFRs" }],
      // TODO(owner): role, timeframe, team, and the report PDF if it can be published.
      // links: { report: "" },
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
        videoUrl: "/ProjectPics/SecurityAudit/JuiceShopVideo_web.mp4",
        videoPoster: "/ProjectPics/SecurityAudit/JuiceShopVideo_poster.webp",
      },
    },
    {
      slug: "cloud-native-devsecops",
      name: "Cloud-Native DevSecOps Pipeline",
      category: "DevSecOps",
      description:
        "Built a cloud-native application on AWS using end-to-end DevSecOps practices — Terraform, Docker, EKS, Jenkins, GitHub Actions, SonarQube, Trivy, Argo CD, Prometheus, and Grafana.",
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
      flow: [
        "Terraform provisions AWS",
        "Docker images",
        "CI: Jenkins + GitHub Actions",
        "Security gates: Dependency-Check, Trivy, SonarQube",
        "GitOps deploy to EKS (Argo CD)",
        "Monitoring: Prometheus, Grafana, CloudWatch",
      ],
      // TODO(owner): repo link, which application was deployed, and any measured
      // results (e.g. findings fixed, build times). Add architecture/pipeline
      // screenshots under public/ and list them in details.images.
      // links: { repo: "" },
      details: {
        fullDescription:
          "Built a cloud-native application on AWS using end-to-end DevSecOps practices. Provisioned infrastructure with Terraform, containerised with Docker, and orchestrated on Amazon EKS with Kubernetes. Implemented CI/CD pipelines using Jenkins and GitHub Actions with integrated security scanning — OWASP Dependency-Check, Trivy for container vulnerabilities, and SonarQube for static analysis. Deployed using Argo CD and GitOps principles. Monitoring via Prometheus and Grafana, with CloudWatch for AWS-level observability.",
        highlights: [
          "End-to-end infrastructure as code with Terraform — VPC, EKS cluster, IAM roles, S3 buckets",
          "Jenkins + GitHub Actions pipelines with security gates: OWASP Dependency-Check, Trivy, SonarQube",
          "GitOps delivery via Argo CD — declarative, auditable deployments",
          "Full observability stack: Prometheus metrics, Grafana dashboards, CloudWatch alarms",
        ],
      },
    },
    {
      slug: "ev-charging-system",
      name: "EV Charging Management System",
      category: "Full-stack app",
      description:
        "Full-stack EV charging platform with real-time location, booking, scheduling, and payment — Firebase Auth, Google Maps API, cloud billing dashboard, deployed on AWS with SSL/TLS.",
      skills: ["Next.js", "React", "JavaScript", "AWS", "Firebase", "Google Maps API"],
      frame: "phone",
      // TODO(owner): live URL / repo, solo or team and your part, timeframe.
      // Confirm "real-time", "load balancing, auto-scaling" before publishing those
      // claims. The Payments screenshot shows a card form in TEST MODE.
      // links: { demo: "", repo: "" },
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
          { src: "/ProjectPics/EVchargingStation/HomePage.jpg", alt: "Home screen with shortcuts to the map, community chat and booking reservation", caption: "Home" },
          { src: "/ProjectPics/EVchargingStation/MapChargerLocations.jpg", alt: "Map with charger locations marked by pins and a location search box", caption: "Charger map" },
          { src: "/ProjectPics/EVchargingStation/ChargingPortDetails.jpg", alt: "Charging port details listing chargers and their booking counts", caption: "Charging port details" },
          { src: "/ProjectPics/EVchargingStation/ChargerAvailabilityCalendar.jpg", alt: "Charger availability calendar with a date picker and available time slots", caption: "Charger availability" },
          { src: "/ProjectPics/EVchargingStation/BookingReservationTimeSlots.jpg", alt: "Booking reservation screen: choose a date, a charger and a time slot", caption: "Booking time slots" },
          { src: "/ProjectPics/EVchargingStation/Payments.jpg", alt: "Card payment form in test mode", caption: "Payment" },
          { src: "/ProjectPics/EVchargingStation/AnalyticsDashboard.jpg", alt: "Analytics dashboard with peak charging times and energy consumption charts", caption: "Analytics dashboard" },
          { src: "/ProjectPics/EVchargingStation/CreateAccountForm.jpg", alt: "Create account form with name, email, phone and password fields", caption: "Create account" },
          { src: "/ProjectPics/EVchargingStation/ForgotPasswordScreen.jpg", alt: "Forgot password screen for sending a password reset email", caption: "Forgot password" },
          { src: "/ProjectPics/EVchargingStation/NavBar.jpg", alt: "Side navigation menu: home, map, analytics dashboard, station management, community chat, booking reservation and login", caption: "Navigation menu" },
        ],
      },
    },
  ],

  experience: [
    {
      company: "Starling Bank",
      title: "Security Architect",
      dateRange: "May 2026 - Present",
      bullets: [
        "Produce STRIDE threat models for integration projects and lead secure design reviews",
        "Contribute to secure coding standards and secure-by-design guidance",
        "Perform security reviews of agent capabilities, embedding secure-by-design into new functionality",
      ],
    },
    {
      company: "Starling Bank",
      title: "IAM Engineer",
      dateRange: "Jan 2026 - May 2026",
      bullets: [
        "Worked primarily in Go, building and extending internal CLI tooling used by IAM analysts for identity and access workflows",
        "Developed infrastructure as code using Terraform for IAM platform projects",
      ],
    },
    {
      company: "Starling Bank",
      title: "SOC Analyst",
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
      // TODO(owner): dates, classification, final-year project, modules, awards.
      // dateRange: "",
      // achievements: [],
    },
  ],
};
