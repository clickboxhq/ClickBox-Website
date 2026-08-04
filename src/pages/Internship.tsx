import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Eye,
  Wrench,
  Target,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Users,
  Briefcase,
  GraduationCap,
  Award,
  Network,
  Sparkles,
  ArrowRight,
  Calendar,
  Trophy,
  ClipboardList,
  ChevronDown,
  Layers,
  Compass,
  Rocket,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TallyEmbed } from "@/components/forms/TallyEmbed";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const pathways = [
  {
    icon: Eye,
    title: "SOC Analyst",
    overview:
      "Monitor, detect, investigate, and respond to security events using modern security tools and operational workflows.",
    skills: ["SIEM operations", "Threat detection", "Incident response", "Log analysis"],
    outcomes: ["SOC Analyst (Tier 1/2)", "Threat Detection Engineer", "Incident Responder"],
  },
  {
    icon: Wrench,
    title: "Security Engineering",
    overview:
      "Security architecture, cloud security fundamentals, automation, security tooling, and defensive engineering practices.",
    skills: ["Cloud security", "Security automation", "Infrastructure hardening", "Security tooling"],
    outcomes: ["Security Engineer", "Cloud Security Engineer", "DevSecOps Engineer"],
  },
  {
    icon: Target,
    title: "Penetration Testing",
    overview:
      "Reconnaissance, vulnerability discovery, web application testing, reporting, and offensive security methodologies.",
    skills: ["Recon & enumeration", "Web app testing", "Exploitation fundamentals", "Security reporting"],
    outcomes: ["Junior Penetration Tester", "Application Security Tester", "Red Team Analyst"],
  },
  {
    icon: AlertTriangle,
    title: "Vulnerability Management",
    overview:
      "How organizations identify, assess, prioritize, and remediate vulnerabilities across infrastructure and applications.",
    skills: ["Vulnerability scanning", "Risk prioritization", "Patch coordination", "Reporting"],
    outcomes: ["Vulnerability Analyst", "Security Operations Analyst", "Risk Analyst"],
  },
  {
    icon: FileCheck,
    title: "Governance, Risk & Compliance",
    overview:
      "Risk management, security frameworks, auditing, compliance requirements, security policies, and regulatory obligations.",
    skills: ["ISO 27001", "Risk assessment", "Policy development", "Audit support"],
    outcomes: ["GRC Analyst", "Compliance Analyst", "Security Auditor"],
  },
];

const benefits = [
  { icon: Briefcase, label: "Hands-on cybersecurity projects" },
  { icon: Shield, label: "Real-world security scenarios" },
  { icon: Users, label: "Technical mentorship" },
  { icon: GraduationCap, label: "Career coaching" },
  { icon: ClipboardList, label: "Portfolio development" },
  { icon: Network, label: "Professional networking" },
  { icon: Sparkles, label: "Technical workshops" },
  { icon: Award, label: "Completion certificate" },
  { icon: Trophy, label: "Future opportunities with ClickBox" },
];

const requiredEligibility = [
  "Minimum age of 18 years",
  "Basic cybersecurity knowledge",
  "Basic networking knowledge",
  "Access to a laptop",
  "Reliable internet connection",
  "Interest in one of the internship pathways",
];

const preferredEligibility = [
  "CompTIA Security+",
  "ISC2 Certified in Cybersecurity (CC)",
  "Google Cybersecurity Certificate",
  "Cisco Cybersecurity Certifications",
  "TryHackMe experience",
  "Hack The Box experience",
  "LetsDefend experience",
];

const selectionStages = [
  { stage: "Application", detail: "Submit via the ClickBox Internship Portal", month: "June" },
  { stage: "Assessment", detail: "Aptitude + pathway-specific technical assessment", month: "June" },
  { stage: "Review", detail: "Applications evaluated by the ClickBox team", month: "June" },
  { stage: "Interview", detail: "Top candidates invited for a virtual interview", month: "June" },
  { stage: "Final Selection", detail: "Top 10 candidates receive internship offers", month: "End of June" },
  { stage: "Onboarding", detail: "Orientation and program kickoff", month: "July" },
];

const timeline = [
  { month: "June", items: ["Applications open", "Assessment phase", "Candidate review", "Interviews", "Final selection"] },
  { month: "July", items: ["Internship onboarding", "Program kickoff"] },
  { month: "July – September", items: ["Hands-on projects", "Mentorship sessions", "Practical security exercises", "Technical workshops", "Career development sessions"] },
  { month: "September", items: ["Program completion", "Internship certification", "Alumni network access"] },
];

// Learning Journey — Phase 1 weeks
const phase1Weeks = [
  {
    n: "Week 1",
    title: "Internship Onboarding & Cybersecurity Foundations",
    activities: ["Program Orientation", "Meet the ClickBox Team", "Professional Development Session", "Cybersecurity Foundations", "Networking Session"],
    focus: ["Security Fundamentals", "Cyber Threat Landscape", "Cybersecurity Career Paths", "Professional Communication"],
  },
  {
    n: "Week 2",
    title: "Security Operations & Threat Monitoring",
    activities: ["Security Monitoring", "Alert Investigation", "Log Analysis", "Incident Escalation"],
    focus: ["SIEM Fundamentals", "Event Monitoring", "Threat Detection", "SOC Operations"],
  },
  {
    n: "Week 3",
    title: "Governance, Risk & Compliance",
    activities: ["Risk Assessments", "Compliance Fundamentals", "Security Auditing", "Security Policies"],
    focus: ["Governance", "Risk Management", "ISO 27001 Concepts", "Compliance"],
  },
  {
    n: "Week 4",
    title: "Vulnerability Management & Security Testing",
    activities: ["Vulnerability Identification", "Risk Prioritization", "Vulnerability Scanning", "Security Reporting"],
    focus: ["Vulnerability Management", "Risk Analysis", "Security Assessments", "Remediation Planning"],
  },
  {
    n: "Week 5",
    title: "Penetration Testing Fundamentals",
    activities: ["Reconnaissance", "Enumeration", "Web Application Testing", "OWASP Top 10"],
    focus: ["Offensive Security", "Web Security", "Application Security", "Security Reporting"],
  },
  {
    n: "Week 6",
    title: "Security Engineering & Cloud Security",
    activities: ["Cloud Security Fundamentals", "Identity & Access Management", "Security Automation", "Infrastructure Security"],
    focus: ["Security Engineering", "Cloud Security", "IAM", "Security Architecture"],
  },
];

// Internship outcomes removed per latest content update


const faqs = [
  { q: "Is this internship paid?", a: "The internship is a career development program focused on practical experience, mentorship, and exposure." },
  { q: "Do I need certifications to apply?", a: "No. Certifications are not required, but credentials such as Security+, ISC2 CC, or the Google Cybersecurity Certificate are considered an advantage." },
  { q: "Can students apply?", a: "Yes. Students, recent graduates, career switchers, and self-taught learners are all encouraged to apply." },
  { q: "Is prior experience required?", a: "Foundational cybersecurity knowledge is expected, but professional experience is not required. Curiosity and commitment matter most." },
  { q: "How many interns are selected?", a: "Only 10 interns are selected per cohort through a competitive selection process." },
  { q: "How long is the program?", a: "The internship runs from July through September, with applications and selection taking place in June." },
  { q: "Will I receive a certificate?", a: "Yes. Interns who successfully complete the program receive an official ClickBox Cybersecurity Internship certificate and join the alumni network." },
];

const WeekCard = ({
  w,
  i,
  open,
  onToggle,
}: {
  w: typeof phase1Weeks[number];
  i: number;
  open: boolean;
  onToggle: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: i * 0.05 }}
      className="glass-card overflow-hidden"
    >
      <button onClick={onToggle} className="w-full text-left px-6 py-5 flex items-center gap-5" aria-expanded={open}>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md icon-accent-wrap font-heading text-xs font-bold text-[#53B5E0]">
          {String(i + 1).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0">
          <p className="micro-label">{w.n}</p>
          <h4 className="mt-1 font-heading text-base font-semibold text-foreground">{w.title}</h4>
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-[#53B5E0] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid gap-6 border-t border-white/5 px-6 py-5 sm:grid-cols-2">
              <div>
                <p className="micro-label mb-2">Activities</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {w.activities.map((a) => (
                    <li key={a} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#53B5E0]" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="micro-label mb-2">Focus Areas</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {w.focus.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FaqItem = ({
  q,
  a,
  open,
  onToggle,
  i,
  variant = "dark",
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
  i: number;
  variant?: "dark" | "light";
}) => {
  const cardClass =
    variant === "light"
      ? "glass-card-dark overflow-hidden rounded-xl transition-all duration-300"
      : "glass-card overflow-hidden";

  return (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.3, delay: i * 0.04 }}
    className={cardClass}
  >
    <button onClick={onToggle} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={open}>
      <span className="font-heading text-base font-semibold text-foreground">{q}</span>
      <ChevronDown className={`h-4 w-4 shrink-0 text-[#53B5E0] transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="border-t border-white/5 px-6 py-5 text-sm leading-relaxed text-muted-foreground">{a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
  );
};

const Internship = () => {
  const [openWeek, setOpenWeek] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="section-padding relative overflow-hidden pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="mx-auto max-w-7xl relative">
          <motion.div {...fadeUp} className="max-w-4xl">
            <div className="badge-accent-frame mb-6 rounded-full bg-[#0D2028] px-4 py-1.5 backdrop-blur">
              <Shield className="h-3.5 w-3.5 text-[#53B5E0]" />
              ClickBox Cybersecurity Internship · Cohort 2026
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
              Launch Your Cybersecurity Career With{" "}
              <span className="text-gradient">Real-World Experience.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Join the ClickBox Cybersecurity Internship and gain hands-on experience, mentorship, and
              practical exposure across multiple cybersecurity career pathways.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#apply" className="inline-flex items-center gap-2 rounded-md border border-[rgba(189,196,198,0.4)] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-[#1D4358] hover:border-[rgba(189,196,198,0.55)]">
                Apply Now <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#overview" className="rounded-md border border-white/10 bg-secondary/80 px-6 py-3 text-sm font-semibold text-secondary-foreground backdrop-blur transition-all hover:bg-muted">
                Learn More
              </a>
            </div>

            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { value: "10", label: "Interns per cohort" },
                { value: "June", label: "Applications" },
                { value: "Jul – Sep", label: "Program duration" },
                { value: "5", label: "Career pathways" },
                { value: "Competitive", label: "Selection process" },
              ].map((s) => (
                <div key={s.label} className="glass-card p-5 text-center">
                  <p className="font-heading text-lg font-bold text-[#53B5E0]">{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section id="overview" className="section-padding border-t border-black/5 bg-white">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="section-label mb-3">Program Overview</p>
              <h2 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">
                Develop Practical Cybersecurity Skills Through Real-World Experience.
              </h2>
            </div>
            <div className="space-y-4 leading-relaxed text-neutral-600">
              <p>The ClickBox Cybersecurity Internship is a highly selective, hands-on career development program designed for aspiring cybersecurity professionals seeking practical experience, mentorship, and exposure to real-world security operations.</p>
              <p>Unlike traditional training programs that focus solely on theory, the internship provides participants with opportunities to work on practical projects, industry-relevant scenarios, and collaborative security initiatives that reflect modern cybersecurity environments.</p>
              <p>Our mission is to help bridge the cybersecurity skills gap by developing the next generation of cybersecurity professionals.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Internship Learning Journey */}
      <section className="section-padding border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="mb-12 max-w-3xl">
            <p className="section-label mb-3">
              Internship Learning Journey
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-5xl">
              12-Week Internship Experience
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              From foundational cybersecurity concepts to practical project experience, the
              internship is designed to help participants build job-relevant skills while gaining
              exposure to multiple cybersecurity disciplines and real-world security operations.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              The internship combines structured technical learning, mentorship, practical
              exercises, collaborative projects, and career development activities designed around
              modern cybersecurity career pathways.
            </p>
          </motion.div>

          {/* Phase pills */}
          <div className="mb-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: Layers, label: "Phase 1", title: "Foundation & Technical Development", weeks: "Weeks 1–6" },
              { icon: Compass, label: "Phase 2", title: "Career Pathway Specialization", weeks: "Weeks 7–10" },
              { icon: Rocket, label: "Phase 3", title: "Practical Experience & Capstone", weeks: "Weeks 11–12" },
            ].map((p) => (
              <div key={p.label} className="glass-card p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md icon-accent-wrap">
                    <p.icon className="h-5 w-5 text-[#53B5E0]" />
                  </div>
                  <div>
                    <p className="micro-label">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.weeks}</p>
                  </div>
                </div>
                <p className="mt-4 font-heading text-sm font-semibold text-foreground">{p.title}</p>
              </div>
            ))}
          </div>

          {/* Phase 1 timeline */}
          <div className="mb-6">
            <p className="micro-label">Phase 1 · Weeks 1–6</p>
            <h3 className="mt-2 font-heading text-2xl font-bold text-foreground">Foundation & Technical Development</h3>
          </div>
          <div className="space-y-3">
            {phase1Weeks.map((w, i) => (
              <WeekCard
                key={w.n}
                w={w}
                i={i}
                open={openWeek === i}
                onToggle={() => setOpenWeek(openWeek === i ? null : i)}
              />
            ))}
          </div>

          {/* Phase 2 */}
          <div className="mt-16 mb-6">
            <p className="micro-label">Phase 2 · Weeks 7–10</p>
            <h3 className="mt-2 font-heading text-2xl font-bold text-foreground">Career Pathway Specialization</h3>
            <p className="mt-3 max-w-3xl text-muted-foreground leading-relaxed">
              Participants focus on their selected cybersecurity pathway through practical
              assignments, mentorship, simulations, and guided learning.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pathways.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="glass-card flex flex-col p-8"
              >
                <p.icon className="mb-4 h-8 w-8 text-[#53B5E0]" strokeWidth={1.5} />
                <h4 className="font-heading text-lg font-semibold text-foreground">{p.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.overview}</p>
                <div className="mt-5 space-y-4 text-sm">
                  <div>
                    <p className="micro-label">Skills Learned</p>
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      {p.skills.map((s) => (
                        <li key={s} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#53B5E0]" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="micro-label">Career Outcomes</p>
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      {p.outcomes.map((o) => (
                        <li key={o} className="flex items-start gap-2">
                          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#53B5E0]" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Phase 3 */}
          <div className="mt-16 mb-6">
            <p className="micro-label">Phase 3 · Weeks 11–12</p>
            <h3 className="mt-2 font-heading text-2xl font-bold text-foreground">Practical Experience & Capstone</h3>
            <p className="mt-3 max-w-3xl text-muted-foreground leading-relaxed">
              Participants apply their learning through collaborative projects, simulations,
              practical exercises, and real-world cybersecurity scenarios.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-card p-8">
              <p className="micro-label">Activities</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {["Security Projects", "Team Collaboration", "Security Exercises", "Technical Presentations", "Career Development Sessions"].map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#53B5E0]" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-8">
              <p className="micro-label">Capstone Project</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Each intern completes and presents a cybersecurity project aligned with their
                selected pathway. The capstone demonstrates practical skills, critical thinking,
                technical communication, and professional development gained throughout the
                internship.
              </p>
            </div>
          </div>

          {/* Internship Outcomes section removed */}

        </div>
      </section>

      {/* Pathways (overview) */}
      <section id="pathways" className="section-padding border-t border-black/5 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="section-label mb-3">Internship Tracks</p>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">
              Five specialized cybersecurity pathways.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pathways.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="glass-card-dark rounded-xl p-8 transition-all duration-300"
              >
                <p.icon className="mb-4 h-8 w-8 text-[#53B5E0]" strokeWidth={1.5} />
                <h3 className="font-heading text-lg font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.overview}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="section-label mb-3">Program Benefits</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              What you'll get as a ClickBox Intern.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card flex items-center gap-4 p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md icon-accent-wrap">
                  <b.icon className="h-5 w-5 text-[#53B5E0]" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium text-foreground">{b.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="section-padding border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="section-label mb-3">Eligibility Requirements</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">Minimum eligibility.</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div {...fadeUp} className="glass-card p-8">
              <h3 className="font-heading text-lg font-semibold text-foreground">Required</h3>
              <ul className="mt-4 space-y-2">
                {requiredEligibility.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#53B5E0]" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fadeUp} className="glass-card p-8">
              <h3 className="font-heading text-lg font-semibold text-foreground">Preferred (Not Required)</h3>
              <ul className="mt-4 space-y-2">
                {preferredEligibility.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#53B5E0]" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding border-t border-black/5 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="section-label mb-3">Program Timeline</p>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">From application to alumni.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {timeline.map((t, i) => (
              <motion.div
                key={t.month}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card-dark rounded-xl p-6 transition-all duration-300"
              >
                <div className="flex items-center gap-2 text-[#53B5E0]">
                  <Calendar className="h-4 w-4" />
                  <p className="font-heading text-sm font-semibold">{t.month}</p>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {t.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Selection Process */}
      <section className="section-padding border-t border-black/5 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="section-label mb-3">Selection Process</p>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">Six competitive stages.</h2>
            <p className="mt-4 leading-relaxed text-neutral-600">
              Only the top candidates advance through each stage — and only 10 interns are selected.
            </p>
          </div>
          <ol className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {selectionStages.map((s, i) => (
              <motion.li
                key={s.stage}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card-dark rounded-xl p-6 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-heading text-sm font-bold text-[#53B5E0]">
                    {i + 1}
                  </span>
                  <p className="micro-label">{s.month}</p>
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{s.stage}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Apply — moved ABOVE FAQ */}
      <section id="apply" className="section-padding border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <motion.div {...fadeUp} className="text-center">
            <p className="section-label mb-3">Apply Now</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Begin your cybersecurity journey with ClickBox.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Applications are reviewed competitively and spaces are limited. Only 10 interns will be
              selected for each cohort.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="mt-12">
            <TallyEmbed
              formId="Ek6Y6r"
              height={1912}
              title="Begin your cybersecurity journey with ClickBox."
            />
          </motion.div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Need support? Reach us directly at{" "}
            <a href="mailto:info@useclickbox.com" className="text-[#53B5E0] hover:underline">
              info@useclickbox.com
            </a>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding border-t border-black/5 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <p className="section-label mb-3">FAQ</p>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">
              Frequently asked questions.
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <FaqItem
                key={f.q}
                q={f.q}
                a={f.a}
                i={i}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                variant="light"
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Internship;
