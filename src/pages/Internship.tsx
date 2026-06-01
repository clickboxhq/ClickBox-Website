import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    skills: ["Cloud security", "Security automation", "Infrastructure hardening", "Tooling"],
    outcomes: ["Security Engineer", "Cloud Security Engineer", "DevSecOps Engineer"],
  },
  {
    icon: Target,
    title: "Penetration Testing",
    overview:
      "Reconnaissance, vulnerability discovery, web application testing, reporting, and offensive security methodologies.",
    skills: ["Recon & enumeration", "Web app testing", "Exploitation basics", "Reporting"],
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
    skills: ["ISO 27001", "Risk assessment", "Policy writing", "Audit support"],
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

const audience = [
  "Students and recent graduates",
  "Career switchers transitioning into cybersecurity",
  "Self-taught cybersecurity enthusiasts",
  "Early-career IT professionals",
  "Individuals passionate about information security",
];

const requiredEligibility = [
  "Minimum age of 18 years",
  "Basic cybersecurity knowledge",
  "Basic networking knowledge",
  "Access to a laptop",
  "Reliable internet connection",
  "Interest in one of the fellowship pathways",
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
  { stage: "Application", detail: "Submit via the ClickBox Fellowship Portal", month: "June" },
  { stage: "Assessment", detail: "Aptitude + pathway-specific technical assessment", month: "June" },
  { stage: "Review", detail: "Applications evaluated by the ClickBox team", month: "June" },
  { stage: "Interview", detail: "Top candidates invited for a virtual interview", month: "June" },
  { stage: "Final Selection", detail: "Top 10 candidates receive fellowship offers", month: "End of June" },
  { stage: "Onboarding", detail: "Orientation and program kickoff", month: "July" },
];

const timeline = [
  {
    month: "June",
    items: ["Applications open", "Assessment phase", "Candidate review", "Interviews", "Final selection"],
  },
  {
    month: "July",
    items: ["Fellowship onboarding", "Program kickoff"],
  },
  {
    month: "July – September",
    items: [
      "Hands-on projects",
      "Mentorship sessions",
      "Practical security exercises",
      "Technical workshops",
      "Career development sessions",
    ],
  },
  {
    month: "September",
    items: ["Program completion", "Fellowship certification", "Alumni network access"],
  },
];

const faqs = [
  {
    q: "Is this fellowship paid?",
    a: "The fellowship is a career development program focused on practical experience, mentorship, and exposure.",
  },
  {
    q: "Do I need certifications to apply?",
    a: "No. Certifications are not required, but credentials such as Security+, ISC2 CC, or the Google Cybersecurity Certificate are considered an advantage.",
  },
  {
    q: "Can students apply?",
    a: "Yes. Students, recent graduates, career switchers, and self-taught learners are all encouraged to apply.",
  },
  {
    q: "Is prior experience required?",
    a: "Foundational cybersecurity knowledge is expected, but professional experience is not required. Curiosity and commitment matter most.",
  },
  {
    q: "How many fellows are selected?",
    a: "Only 10 fellows are selected per cohort through a competitive selection process.",
  },
  {
    q: "How long is the program?",
    a: "The fellowship runs from July through September, with applications and selection taking place in June.",
  },
  {
    q: "Will I receive a certificate?",
    a: "Yes. Fellows who successfully complete the program receive an official ClickBox Cybersecurity Fellowship certificate and join the alumni network.",
  },
];

const Internship = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="section-padding relative overflow-hidden pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="mx-auto max-w-7xl relative">
          <motion.div {...fadeUp} className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              <Shield className="h-3.5 w-3.5" />
              ClickBox Cybersecurity Fellowship · Cohort 2026
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
              Launch Your Cybersecurity Career With{" "}
              <span className="text-gradient">Real-World Experience.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Join the ClickBox Cybersecurity Fellowship and gain hands-on experience, mentorship, and
              practical exposure across multiple cybersecurity career pathways.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#apply"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                Apply Now <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#overview"
                className="rounded-md border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-all hover:bg-muted"
              >
                Learn More
              </a>
            </div>

            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { value: "10", label: "Fellows per cohort" },
                { value: "June", label: "Applications" },
                { value: "Jul – Sep", label: "Program duration" },
                { value: "5", label: "Career pathways" },
                { value: "Competitive", label: "Selection process" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-border bg-card p-5 text-center"
                >
                  <p className="font-heading text-lg font-bold text-primary">{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section id="overview" className="section-padding border-t border-border">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                Program Overview
              </p>
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                Develop Practical Cybersecurity Skills Through Real-World Experience.
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The ClickBox Cybersecurity Fellowship is a highly selective, hands-on career
                development program designed for aspiring cybersecurity professionals seeking
                practical experience, mentorship, and exposure to real-world security operations.
              </p>
              <p>
                Unlike traditional training programs that focus solely on theory, the fellowship
                provides participants with opportunities to work on practical projects, industry-
                relevant scenarios, and collaborative security initiatives that reflect modern
                cybersecurity environments.
              </p>
              <p>
                Our mission is to help bridge the cybersecurity skills gap by developing the next
                generation of cybersecurity professionals across Africa.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pathways */}
      <section id="pathways" className="section-padding border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Fellowship Tracks
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Five specialized cybersecurity pathways.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pathways.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" as const }}
                className="group flex flex-col rounded-lg border border-border bg-card p-8 transition-all hover:border-primary/30 hover:border-glow"
              >
                <p.icon className="mb-4 h-8 w-8 text-primary" strokeWidth={1.5} />
                <h3 className="font-heading text-lg font-semibold text-card-foreground">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.overview}</p>

                <div className="mt-6 space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Skills Learned
                    </p>
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      {p.skills.map((s) => (
                        <li key={s} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Career Outcomes
                    </p>
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      {p.outcomes.map((o) => (
                        <li key={o} className="flex items-start gap-2">
                          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Program Benefits
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              What you'll get as a ClickBox Fellow.
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
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/30"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <b.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium text-card-foreground">{b.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Should Apply */}
      <section className="section-padding border-t border-border">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2">
          <motion.div {...fadeUp}>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Who Should Apply
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Built for those serious about cybersecurity.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              We welcome applications from:
            </p>
            <ul className="mt-4 space-y-2">
              {audience.map((a) => (
                <li key={a} className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fadeUp} className="space-y-4 rounded-lg border border-border bg-card p-8">
            <p className="text-muted-foreground leading-relaxed">
              Applicants should have completed foundational cybersecurity learning such as
              Introduction to Cybersecurity, Security Fundamentals, or equivalent self-study.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Candidates should possess a basic understanding of cybersecurity concepts, networking
              fundamentals, and common cyber threats.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Above all, we are looking for candidates who demonstrate curiosity, commitment,
              professionalism, accountability, and a strong willingness to learn.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="section-padding border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Eligibility Requirements
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Minimum eligibility.
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div {...fadeUp} className="rounded-lg border border-border bg-card p-8">
              <h3 className="font-heading text-lg font-semibold text-card-foreground">Required</h3>
              <ul className="mt-4 space-y-2">
                {requiredEligibility.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fadeUp} className="rounded-lg border border-border bg-card p-8">
              <h3 className="font-heading text-lg font-semibold text-card-foreground">
                Preferred (Not Required)
              </h3>
              <ul className="mt-4 space-y-2">
                {preferredEligibility.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Selection Process */}
      <section className="section-padding border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Selection Process
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Six competitive stages.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Only the top candidates advance through each stage — and only 10 fellows are selected.
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
                className="rounded-lg border border-border bg-card p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-heading text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {s.month}
                  </p>
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-card-foreground">
                  {s.stage}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Program Timeline
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              From application to alumni.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {timeline.map((t, i) => (
              <motion.div
                key={t.month}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-lg border border-border bg-card p-6"
              >
                <div className="flex items-center gap-2 text-primary">
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

      {/* FAQ */}
      <section className="section-padding border-t border-border">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              FAQ
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Frequently asked questions.
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <motion.details
                key={f.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="group rounded-lg border border-border bg-card p-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4">
                  <span className="font-heading text-base font-semibold text-card-foreground">
                    {f.q}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="section-padding border-t border-border">
        <div className="mx-auto max-w-4xl">
          <motion.div {...fadeUp} className="text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Apply Now
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Begin your cybersecurity journey with ClickBox.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Applications are reviewed competitively and spaces are limited. Only 10 fellows will be
              selected for each cohort.
            </p>
          </motion.div>

          <motion.form
            {...fadeUp}
            className="mt-12 grid gap-5 rounded-lg border border-border bg-card p-8 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = "mailto:info@useclickbox.com?subject=ClickBox Cybersecurity Fellowship Application";
            }}
          >
            <div className="md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Full Name
              </label>
              <input
                required
                type="text"
                className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <input
                required
                type="email"
                className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                LinkedIn Profile
              </label>
              <input
                type="url"
                className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Resume (link)
              </label>
              <input
                type="url"
                className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="Link to your resume"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Preferred Pathway
              </label>
              <select
                required
                className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">Select a pathway</option>
                {pathways.map((p) => (
                  <option key={p.title}>{p.title}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Certifications
              </label>
              <input
                type="text"
                className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="e.g. Security+, Google Cybersecurity Certificate"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Why do you want to join?
              </label>
              <textarea
                required
                rows={4}
                maxLength={1000}
                className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="Tell us about your goals and why this fellowship is right for you"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Relevant Experience
              </label>
              <textarea
                rows={3}
                maxLength={1000}
                className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="Projects, labs, internships, or self-study"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Portfolio / GitHub Link
              </label>
              <input
                type="url"
                className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="https://github.com/..."
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                Submit Application <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Prefer email? Reach us directly at{" "}
            <a href="mailto:info@useclickbox.com" className="text-primary hover:underline">
              info@useclickbox.com
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Internship;
