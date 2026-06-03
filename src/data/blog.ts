export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  category:
    | "Threat Intelligence"
    | "Compliance"
    | "Industry Trends"
    | "Best Practices"
    | "Company News"
    | "Product Updates"
    | "Fellowship";
  author: string;
  authorRole: string;
  publishedAt: string; // ISO
  readTime: number; // minutes
  featured?: boolean;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "modernizing-soc-operations",
    title: "Modernizing SOC Operations for the Cloud-First Era",
    excerpt:
      "Why traditional SOC models struggle with cloud-native attack surfaces — and how SOCaaS bridges the gap.",
    body: [
      "Modern enterprises operate across distributed cloud workloads, SaaS platforms, and remote endpoints. Traditional Security Operations Centers were never designed for this surface area.",
      "A modern SOCaaS engagement focuses on detection engineering, automation, and continuous tuning — not just alert volume. The result is faster mean-time-to-detect and mean-time-to-respond, with measurable risk reduction.",
      "This article outlines five pillars we apply across every ClickBox SOCaaS deployment: telemetry coverage, detection-as-code, response playbooks, threat intelligence enrichment, and continuous validation.",
    ],
    category: "Best Practices",
    author: "Isaac Udumeighe",
    authorRole: "Chief Technology Officer",
    publishedAt: "2026-05-22T09:00:00.000Z",
    readTime: 6,
    featured: true,
  },
  {
    slug: "iso-27001-readiness-roadmap",
    title: "An ISO/IEC 27001:2022 Readiness Roadmap That Actually Works",
    excerpt:
      "A pragmatic, phase-by-phase roadmap for organizations preparing for ISO 27001 certification without the typical 12-month overhead.",
    body: [
      "ISO 27001 readiness fails when it's treated as a documentation exercise. We approach it as an operational maturity program.",
      "Phase one focuses on scoping and stakeholder alignment. Phase two delivers the risk treatment plan and the Statement of Applicability. Phase three operationalizes controls and prepares for the certification audit.",
      "Done right, organizations achieve certification in six to nine months while strengthening real-world resilience — not just passing an audit.",
    ],
    category: "Compliance",
    author: "Kunmi Olugbemi",
    authorRole: "Chief Information Security Officer",
    publishedAt: "2026-05-14T09:00:00.000Z",
    readTime: 8,
  },
  {
    slug: "ai-driven-phishing-defense",
    title: "Defending Against AI-Driven Phishing at Scale",
    excerpt:
      "Generative AI has industrialized social engineering. Here's how defensive teams are adapting their detection and response playbooks.",
    body: [
      "Adversaries are using LLMs to generate hyper-personalized phishing campaigns at scale. Traditional content filters miss most of these messages.",
      "We're seeing measurable success with behavioral baselines, identity-aware mail flow analysis, and adaptive user training that responds to live threat patterns.",
      "This post explains the layered defenses we recommend and the metrics we track to demonstrate reduced human-layer risk.",
    ],
    category: "Threat Intelligence",
    author: "Victor Steven Igbinedion",
    authorRole: "Chief Technology Officer",
    publishedAt: "2026-05-06T09:00:00.000Z",
    readTime: 7,
    featured: true,
  },
  {
    slug: "vapt-vs-pentest-what-changed",
    title: "VAPT vs Penetration Testing — What Actually Changed",
    excerpt:
      "Vulnerability Management and Penetration Testing are converging. Here's what enterprise security leaders need to know.",
    body: [
      "Treating vulnerability management and penetration testing as separate disciplines creates blind spots. The modern VAPT model unifies discovery, validation, prioritization, and remediation.",
      "We walk through how our VAPT engagements deliver a single risk-ranked backlog the security team can actually act on — instead of two disconnected reports.",
    ],
    category: "Industry Trends",
    author: "Prince Oruma",
    authorRole: "Chief Operating Officer",
    publishedAt: "2026-04-28T09:00:00.000Z",
    readTime: 5,
  },
  {
    slug: "clickbox-fellowship-cohort-2026",
    title: "Introducing the ClickBox Cybersecurity Fellowship — Cohort 2026",
    excerpt:
      "Ten fellows. Five specialized pathways. Applications open in June. Here's what makes the program different.",
    body: [
      "The ClickBox Cybersecurity Fellowship is a highly selective, hands-on career development program for the next generation of cybersecurity professionals.",
      "Fellows specialize in one of five pathways — SOC Analyst, Security Engineering, Penetration Testing, Vulnerability Management, or Governance, Risk & Compliance — and graduate with portfolio-ready project experience.",
    ],
    category: "Fellowship",
    author: "ClickBox Team",
    authorRole: "Editorial",
    publishedAt: "2026-04-15T09:00:00.000Z",
    readTime: 4,
  },
  {
    slug: "data-protection-essentials",
    title: "Data Protection Essentials Every Growing Company Should Have",
    excerpt:
      "A practical checklist for organizations building data protection capabilities before they're forced to.",
    body: [
      "Data protection isn't only for regulated industries. As organizations scale, customer trust and operational resilience depend on getting the basics right early.",
      "We outline the foundational controls — data classification, encryption-in-transit and at-rest, access governance, retention policies — and how to implement them without overwhelming small teams.",
    ],
    category: "Best Practices",
    author: "Kunmi Olugbemi",
    authorRole: "Chief Information Security Officer",
    publishedAt: "2026-04-02T09:00:00.000Z",
    readTime: 6,
  },
];

export const categories = [
  "All",
  "Threat Intelligence",
  "Compliance",
  "Industry Trends",
  "Best Practices",
  "Company News",
  "Product Updates",
  "Fellowship",
] as const;
