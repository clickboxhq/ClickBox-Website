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
  heroImage?: string;
  tags?: string[];
};

// Group label shown in the Resources filter UI. Maps multiple categories.
export const groupForCategory = (
  c: BlogPost["category"],
): "Blog" | "Insights" | "Updates" | "Fellowship News" | "Threat Intelligence" => {
  if (c === "Fellowship") return "Fellowship News";
  if (c === "Company News" || c === "Product Updates") return "Updates";
  if (c === "Threat Intelligence") return "Threat Intelligence";
  if (c === "Industry Trends") return "Insights";
  return "Blog";
};

export const resourceGroups = [
  "All",
  "Blog",
  "Insights",
  "Threat Intelligence",
  "Updates",
  "Fellowship News",
] as const;

// Unsplash hero images — broadly licensed, topic-aligned.
const IMG = {
  soc: "https://images.unsplash.com/photo-1551808525-51a94da548ce?auto=format&fit=crop&w=1600&q=80",
  iso: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
  phishing: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=1600&q=80",
  vapt: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
  fellowship: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80",
  data: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=80",
  ransomware: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1600&q=80",
  cve: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
  cloud: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
};

export const blogPosts: BlogPost[] = [
  {
    slug: "modernizing-soc-operations",
    title: "Modernizing SOC Operations for the Cloud-First Era",
    excerpt:
      "Why traditional SOC models struggle with cloud-native attack surfaces — and how SOCaaS bridges the gap.",
    body: [
      "Modern enterprises operate across distributed cloud workloads, SaaS platforms, and remote endpoints. Traditional Security Operations Centers were never designed for this surface area — they were built for perimeter-based networks where most assets sat inside a data center under a single set of controls.",
      "Today, the surface area is fragmented. Identity is the new perimeter, telemetry lives across dozens of providers, and adversaries move laterally through misconfigurations rather than perimeter breaches. A SOC that hasn't been modernized for this reality generates more noise, not more signal.",
      "A modern SOCaaS engagement focuses on detection engineering, automation, and continuous tuning — not just alert volume. We measure success in mean-time-to-detect (MTTD), mean-time-to-respond (MTTR), and the proportion of alerts that result in meaningful action. Anything else is theatre.",
      "Five pillars anchor every ClickBox SOCaaS deployment:",
      "1. Telemetry coverage — endpoint, identity, network, cloud control plane, and SaaS audit logs. Gaps in coverage are gaps in detection.",
      "2. Detection-as-code — rules versioned in Git, peer-reviewed, tested against historical data, and continuously improved. Detection logic is engineering, not configuration.",
      "3. Response playbooks — automated triage and containment for the top 80% of recurring incidents, with human escalation for everything else.",
      "4. Threat intelligence enrichment — every alert arrives with actor, campaign, and TTP context so analysts make decisions, not lookups.",
      "5. Continuous validation — purple-team exercises and breach-and-attack simulation to prove detections still fire as the environment evolves.",
      "Each pillar reinforces the others. Telemetry without detection is noise. Detection without response is theatre. Response without validation is hope. Together they form a measurable security operations capability that scales with the business — and one that survives the next architectural shift.",
    ],
    category: "Best Practices",
    author: "ClickBox Team Editorial",
    authorRole: "Editorial Desk",
    publishedAt: "2026-05-22T09:00:00.000Z",
    readTime: 8,
    featured: true,
    heroImage: IMG.soc,
    tags: ["SOC", "SOCaaS", "Detection Engineering"],
  },
  {
    slug: "iso-27001-readiness-roadmap",
    title: "An ISO/IEC 27001:2022 Readiness Roadmap That Actually Works",
    excerpt:
      "A pragmatic, phase-by-phase roadmap for organizations preparing for ISO 27001 certification without the typical 12-month overhead.",
    body: [
      "ISO/IEC 27001:2022 readiness fails when it's treated as a documentation exercise. Organizations spend months drafting policies that nobody operationalizes, then scramble through an audit they could have passed in half the time. We approach readiness as an operational maturity program — certification becomes a byproduct of doing the work properly.",
      "Phase one: scoping and stakeholder alignment. Define the ISMS boundary, identify the asset inventory, map data flows, and align leadership on risk appetite. Most failed programs skip this phase and pay for it later when scope creeps mid-audit.",
      "Phase two: risk treatment plan and Statement of Applicability. We translate the Annex A controls into a working risk register, prioritize treatment based on business impact, and produce an SoA that defenders can actually use as a control inventory — not a compliance artifact.",
      "Phase three: operationalize controls and prepare for the certification audit. Roll out controls in waves, capture evidence as a side effect of normal operations, and run internal audits against the same checklist your external auditor will use.",
      "Common pitfalls we help clients avoid: treating the SoA as static, copy-pasting policies from templates, skipping management review, and failing to prove control effectiveness with evidence.",
      "Done right, organizations achieve certification in six to nine months while strengthening real-world resilience — not just passing an audit. The certificate matters; the security posture matters more.",
    ],
    category: "Compliance",
    author: "ClickBox Team Editorial",
    authorRole: "Editorial Desk",
    publishedAt: "2026-05-14T09:00:00.000Z",
    readTime: 9,
    heroImage: IMG.iso,
    tags: ["ISO 27001", "Compliance", "Audit"],
  },
  {
    slug: "ai-driven-phishing-defense",
    title: "Defending Against AI-Driven Phishing at Scale",
    excerpt:
      "Generative AI has industrialized social engineering. Here's how defensive teams are adapting their detection and response playbooks.",
    body: [
      "Adversaries are using large language models to generate hyper-personalized phishing campaigns at scale. The economics have shifted: what used to cost an attacker hours of research now costs seconds of inference. Traditional content filters that look for misspellings, broken grammar, or known templates miss most of these messages.",
      "We see three distinct evolutions in modern phishing tradecraft: pretexting tailored to a recipient's role and recent activity, real-time conversation hijacking in email and chat, and synthetic voice or video used in business email compromise (BEC) escalations.",
      "Defending against this requires a layered model. Content inspection is necessary but insufficient. We're seeing measurable success with behavioral baselines, identity-aware mail flow analysis, and adaptive user training that responds to live threat patterns instead of static quarterly modules.",
      "Recommended layers: domain authentication (SPF, DKIM, DMARC enforced at p=reject), inbound URL rewriting and sandboxing, identity-bound MFA on every external service, conditional access tied to device posture, and inline coaching that fires the moment a user interacts with a suspicious message.",
      "Metrics that matter: phishing click-through rate by department, time-to-report by user, percentage of reported messages confirmed malicious, and reduction in successful credential harvesting attempts over time. These numbers prove the program is working — or that it needs more investment.",
      "AI-driven attacks demand AI-aware defenses. The teams winning this fight are the ones who treat user behavior as telemetry, not as a training problem.",
    ],
    category: "Threat Intelligence",
    author: "ClickBox Team Editorial",
    authorRole: "Editorial Desk",
    publishedAt: "2026-05-06T09:00:00.000Z",
    readTime: 8,
    featured: true,
    heroImage: IMG.phishing,
    tags: ["Phishing", "AI", "Social Engineering"],
  },
  {
    slug: "vapt-vs-pentest-what-changed",
    title: "VAPT vs Penetration Testing — What Actually Changed",
    excerpt:
      "Vulnerability Management and Penetration Testing are converging. Here's what enterprise security leaders need to know.",
    body: [
      "Treating vulnerability management and penetration testing as separate disciplines creates blind spots. Scanners produce volume; pentests produce narrative. Neither alone gives leadership a defensible picture of exposure.",
      "The modern VAPT model unifies discovery, validation, prioritization, and remediation. Discovery uses authenticated and unauthenticated scanning across infrastructure, applications, cloud, and identity. Validation confirms exploitability with manual testing where it matters most. Prioritization combines CVSS, exploit availability, business context, and threat intelligence into a single ranked backlog.",
      "Remediation is where most programs fail. A risk-ranked backlog only helps if engineering teams can act on it. We integrate VAPT output directly into existing ticketing and change-management workflows so findings move through the same pipeline as feature work.",
      "Our engagements deliver a single risk-ranked backlog the security team can actually act on — instead of two disconnected reports that sit on a shared drive.",
      "Practical advice for leaders: align scanner cadence with deployment cadence, fund continuous testing rather than annual pentests, and measure reduction in mean-time-to-remediate by severity — not the count of scans run.",
    ],
    category: "Industry Trends",
    author: "ClickBox Team Editorial",
    authorRole: "Editorial Desk",
    publishedAt: "2026-04-28T09:00:00.000Z",
    readTime: 7,
    heroImage: IMG.vapt,
    tags: ["VAPT", "Penetration Testing"],
  },
  {
    slug: "clickbox-fellowship-cohort-2026",
    title: "Introducing the ClickBox Cybersecurity Fellowship — Cohort 2026",
    excerpt:
      "Ten fellows. Five specialized pathways. Applications open in June. Here's what makes the program different.",
    body: [
      "The ClickBox Cybersecurity Fellowship is a highly selective, hands-on career development program for the next generation of cybersecurity professionals.",
      "Fellows specialize in one of five pathways — SOC Analyst, Security Engineering, Penetration Testing, Vulnerability Management, or Governance, Risk & Compliance — and graduate with portfolio-ready project experience tied to real engagements.",
      "What makes the program different: every fellow is paired with a senior practitioner mentor, every pathway includes a capstone engagement reviewed by ClickBox leadership, and successful fellows are considered first for full-time roles or partner placements.",
      "Applications open in June. The selection process emphasizes problem-solving, curiosity, and demonstrated learning — not just credentials.",
    ],
    category: "Fellowship",
    author: "ClickBox Team Editorial",
    authorRole: "Editorial Desk",
    publishedAt: "2026-04-15T09:00:00.000Z",
    readTime: 5,
    heroImage: IMG.fellowship,
    tags: ["Fellowship", "Careers"],
  },
  {
    slug: "data-protection-essentials",
    title: "Data Protection Essentials Every Growing Company Should Have",
    excerpt:
      "A practical checklist for organizations building data protection capabilities before they're forced to.",
    body: [
      "Data protection isn't only for regulated industries. As organizations scale, customer trust and operational resilience depend on getting the basics right early — long before a regulator or incident forces the conversation.",
      "Foundational controls: data classification, encryption-in-transit and at-rest, access governance with least privilege, key management, retention and disposal policies, and a documented data processing inventory.",
      "Implementation guidance for small teams: start with a data discovery exercise to find where sensitive data actually lives, then enforce encryption defaults at the storage and transport layers (most cloud providers make this trivial). Layer in identity-bound access and quarterly access reviews.",
      "Common mistakes to avoid: treating data protection as a legal artifact, conflating backup with disaster recovery, ignoring third-party processors, and skipping incident response planning until an incident forces the issue.",
      "Done early, data protection is cheap and operational. Done late, it becomes a board-level project under regulatory pressure.",
    ],
    category: "Best Practices",
    author: "ClickBox Team Editorial",
    authorRole: "Editorial Desk",
    publishedAt: "2026-04-02T09:00:00.000Z",
    readTime: 7,
    heroImage: IMG.data,
    tags: ["Data Protection", "Privacy"],
  },
  // Threat Intelligence pieces
  {
    slug: "ransomware-trends-2026",
    title: "Ransomware Trends Q2 2026 — From Encryption to Extortion-Only",
    excerpt:
      "Ransomware operators are increasingly skipping encryption entirely and monetizing data theft alone. Here's what defenders need to know.",
    body: [
      "Q2 2026 telemetry shows a continued shift away from traditional encryption-based ransomware toward extortion-only campaigns. Operators exfiltrate sensitive data, then demand payment under threat of public disclosure — without ever deploying ransomware binaries on victim networks.",
      "The shift is economically rational for attackers: avoiding encryption sidesteps EDR detection that has become highly effective against ransomware payloads, while preserving the leverage that drives payment.",
      "Active campaigns observed this quarter include high-volume data theft via compromised SaaS OAuth tokens, abuse of legitimate file-transfer tools for staging, and direct-to-leadership extortion that bypasses traditional incident response channels.",
      "Defender priorities: monitor outbound data volumes against established baselines, enforce DLP on sanctioned and unsanctioned cloud storage, audit OAuth grants quarterly, and ensure incident response runbooks include executive-targeted extortion scenarios.",
      "We also recommend tabletop exercises that simulate extortion-only events, including communication with regulators, customers, and the board. Most organizations are prepared to recover from encryption — far fewer are prepared to negotiate disclosure.",
    ],
    category: "Threat Intelligence",
    author: "ClickBox Team Editorial",
    authorRole: "Editorial Desk",
    publishedAt: "2026-05-30T09:00:00.000Z",
    readTime: 7,
    featured: true,
    heroImage: IMG.ransomware,
    tags: ["Ransomware", "Extortion", "Threat Report"],
  },
  {
    slug: "critical-cve-edge-devices-advisory",
    title: "Security Advisory — Critical Vulnerabilities in Edge Devices",
    excerpt:
      "Multiple critical CVEs disclosed this month affect widely deployed edge networking and VPN appliances. Patch immediately.",
    body: [
      "Multiple critical vulnerabilities disclosed this month affect edge devices commonly deployed at the perimeter of enterprise networks, including VPN concentrators, firewalls, and remote-access gateways. Exploitation is unauthenticated in several cases and grants remote code execution.",
      "Affected device classes (general): SSL VPN appliances, perimeter firewalls with management interfaces exposed to the internet, and remote-access gateways using outdated TLS stacks. Vendors have released patches; coordinated disclosure indicates active exploitation in the wild.",
      "Recommended actions: identify exposed management interfaces using external attack surface management, apply vendor patches within 72 hours, rotate VPN credentials and pre-shared keys, review logs for unusual authentication patterns over the past 30 days, and assume compromise where indicators are present.",
      "Longer-term hardening: move management interfaces off the public internet, enforce identity-bound MFA on all edge access, and subscribe to vendor PSIRT advisories so the next critical CVE doesn't go unnoticed.",
      "ClickBox is providing accelerated triage and patch validation support for affected clients. Contact your engagement lead or our security operations team for assistance.",
    ],
    category: "Threat Intelligence",
    author: "ClickBox Team Editorial",
    authorRole: "Editorial Desk",
    publishedAt: "2026-05-18T09:00:00.000Z",
    readTime: 6,
    heroImage: IMG.cve,
    tags: ["CVE", "Advisory", "Vulnerability"],
  },
  {
    slug: "cloud-control-plane-attacks",
    title: "Emerging Threat — Cloud Control-Plane Abuse",
    excerpt:
      "Adversaries are bypassing endpoint defenses by targeting cloud control planes directly. Here's how the campaigns work and how to detect them.",
    body: [
      "A growing class of intrusion bypasses endpoints entirely by targeting cloud control planes — IAM, identity providers, and platform APIs. Once an attacker holds valid credentials or a session token, they operate as a legitimate administrator and leave little forensic trace at the host level.",
      "Common initial access vectors include phished session tokens, leaked CI/CD service-account keys, OAuth consent grants to malicious applications, and credentials harvested from public source-code repositories.",
      "Detection priorities: monitor IAM policy changes, role assumptions across accounts, new federation trusts, unusual API call patterns from new geographies, and creation of long-lived access keys. Cloud-native detection rules belong in detection-as-code repositories alongside endpoint rules.",
      "Containment requires identity-first response: revoke active sessions, rotate keys, disable suspicious roles, audit recently created identities, and review cross-account trust relationships.",
      "The teams handling this best are treating cloud identity logs as primary SOC telemetry — not as an afterthought collected for audit.",
    ],
    category: "Threat Intelligence",
    author: "ClickBox Team Editorial",
    authorRole: "Editorial Desk",
    publishedAt: "2026-05-02T09:00:00.000Z",
    readTime: 7,
    heroImage: IMG.cloud,
    tags: ["Cloud", "Identity", "Detection"],
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
