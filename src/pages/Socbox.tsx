import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Activity,
  Shield,
  Search,
  Bell,
  Bug,
  Globe,
  Server,
  FileCheck,
  Zap,
  Layers,
  BarChart3,
  ListChecks,
  LineChart,
  Building2,
  Landmark,
  HeartPulse,
  GraduationCap,
  Users,
  Briefcase,
  Cloud,
  Lock,
  Eye,
  ShieldCheck,
  Clock,
  Cpu,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/scroll/ScrollReveal";

const capabilities = [
  { icon: Cpu, title: "AI Threat Detection", desc: "Machine learning models surface anomalies and attacker behaviour across your environment in real time." },
  { icon: Bell, title: "Incident Management", desc: "A unified queue for triage, assignment, and resolution with full audit history." },
  { icon: Activity, title: "Security Monitoring", desc: "24/7 telemetry from endpoints, network, identity, and cloud correlated in one pane." },
  { icon: Bug, title: "Vulnerability Management", desc: "Continuous discovery, risk-based prioritisation, and remediation tracking." },
  { icon: Globe, title: "Threat Intelligence", desc: "Curated global feeds enriched with context, actor profiles, and IOCs." },
  { icon: Server, title: "Asset Visibility", desc: "Dynamic inventory of every device, workload, and identity across hybrid estates." },
  { icon: FileCheck, title: "Compliance Reporting", desc: "Evidence-ready reports mapped to ISO 27001, SOC 2, PCI DSS, and GDPR." },
  { icon: Zap, title: "Automated Response", desc: "Deterministic playbooks contain threats in seconds without waiting on analysts." },
  { icon: Search, title: "Investigation Workbench", desc: "Timeline reconstruction, entity graphs, and query tools purpose-built for analysts." },
  { icon: BarChart3, title: "Security Analytics", desc: "Behavioural baselines and long-window analytics reveal slow, low-signal attacks." },
  { icon: ListChecks, title: "Playbooks", desc: "Reusable, versioned workflows for detection, containment, and communications." },
  { icon: LineChart, title: "Executive Dashboards", desc: "Board-ready views of risk posture, SLA performance, and coverage." },
];

const workflow = [
  { icon: Layers, title: "Collect Data", desc: "Ingest telemetry from endpoints, cloud, identity, network, and SaaS." },
  { icon: Activity, title: "Normalize Events", desc: "Parse and unify events into a common schema for correlation." },
  { icon: Eye, title: "Detect Threats", desc: "AI and rule-based detections identify malicious activity." },
  { icon: Bell, title: "Prioritize Alerts", desc: "Risk scoring cuts noise so analysts focus on what matters." },
  { icon: Search, title: "Investigate", desc: "Rich context, timelines, and entity graphs accelerate root cause." },
  { icon: Zap, title: "Automate Response", desc: "Playbooks contain, isolate, and remediate at machine speed." },
  { icon: FileCheck, title: "Generate Reports", desc: "Auditable evidence for executives, regulators, and customers." },
];

const audiences = [
  { icon: Building2, title: "Startups" },
  { icon: Briefcase, title: "SMEs" },
  { icon: Server, title: "Enterprises" },
  { icon: Landmark, title: "Financial Institutions" },
  { icon: HeartPulse, title: "Healthcare" },
  { icon: Shield, title: "Government" },
  { icon: GraduationCap, title: "Educational Institutions" },
  { icon: Users, title: "MSSPs" },
];

const useCases = [
  { icon: Clock, title: "24/7 Security Monitoring", desc: "Continuous coverage across every asset, every hour." },
  { icon: Eye, title: "Insider Threat Detection", desc: "Behavioural analytics surface risky user and account activity." },
  { icon: Lock, title: "Ransomware Detection", desc: "Early kill-chain detection stops encryption before impact." },
  { icon: Cloud, title: "Cloud Security Monitoring", desc: "Unified visibility across AWS, Azure, and Google Cloud." },
  { icon: FileCheck, title: "Compliance Monitoring", desc: "Continuous control validation for global frameworks." },
  { icon: LineChart, title: "Executive Reporting", desc: "Clear posture and risk narratives for leadership." },
  { icon: Bug, title: "Vulnerability Prioritization", desc: "Focus remediation on exploitable, business-critical risk." },
  { icon: Zap, title: "Incident Response", desc: "Playbook-driven containment and recovery workflows." },
];

const benefits = [
  "Faster investigations",
  "AI-assisted analysis",
  "Reduced alert fatigue",
  "Centralized visibility",
  "Automated workflows",
  "Faster incident response",
  "Better compliance",
  "Improved security posture",
];

const faqs = [
  { q: "What is SOCBOX?", a: "SOCBOX is ClickBox's AI-powered Security Operations platform that unifies monitoring, detection, investigation, and response in a single workspace." },
  { q: "Who is it designed for?", a: "Security teams at startups, SMEs, enterprises, MSSPs, and regulated organisations who need mature SecOps without scaling headcount linearly." },
  { q: "Does SOCBOX integrate with existing security tools?", a: "Yes. SOCBOX ingests telemetry from EDR, SIEM, cloud providers, identity, email, and network tools through native and API-based connectors." },
  { q: "Can it automate incident response?", a: "Yes. Versioned playbooks orchestrate containment, enrichment, ticketing, and notifications with human-in-the-loop controls." },
  { q: "Is it cloud-based?", a: "SOCBOX is delivered as a cloud-native platform with optional hybrid collectors for on-premise data sources." },
  { q: "How do I request a demo?", a: "Use the Request a Demo button on this page or reach us via the Contact page. Our team will schedule a tailored walkthrough." },
];

const Socbox = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="section-padding relative overflow-hidden border-b border-white/5 pt-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 10%, hsl(var(--primary) / 0.18), transparent 60%), radial-gradient(50% 45% at 85% 30%, hsl(var(--primary) / 0.12), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl text-center">
          <ScrollReveal>
            <div className="badge-accent-frame mb-6 inline-flex items-center gap-2 rounded-full bg-[#131211] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              ClickBox Solutions
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <h1 className="font-heading text-5xl font-bold tracking-tight text-foreground md:text-7xl">
              SOC<span className="text-gradient">BOX</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="mt-4 font-heading text-lg text-primary md:text-xl">
              AI-Powered Security Operations Platform
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-muted-foreground">
              SOCBOX is ClickBox's intelligent Security Operations platform built to help
              organizations detect, investigate, and respond to cyber threats faster using
              automation and AI.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-md border border-[rgba(208,201,195,0.4)] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-[#007A48]"
              >
                Request a Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#what-is-socbox"
                className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-white/10"
              >
                Learn More
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* What is SOCBOX */}
      <section id="what-is-socbox" className="section-padding border-b border-white/5">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-5">
          <ScrollReveal className="md:col-span-2">
            <p className="section-label mb-3">What is SOCBOX</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              A unified Security Operations platform.
            </h2>
          </ScrollReveal>
          <ScrollReveal className="space-y-5 text-muted-foreground md:col-span-3" delay={0.1}>
            <p className="leading-relaxed">
              SOCBOX is ClickBox's flagship Security Operations platform that unifies security
              monitoring, threat detection, incident investigation, vulnerability management, and
              AI-assisted response into a single platform.
            </p>
            <p className="leading-relaxed">
              It helps organizations reduce alert fatigue, accelerate investigations, and improve
              security operations — without increasing analyst workload. Every signal, every
              incident, every response lives in one workspace built for modern SecOps.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Why SOCBOX exists */}
      <section className="section-padding border-b border-white/5">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal className="mb-12 max-w-2xl">
            <p className="section-label mb-3">Why SOCBOX Exists</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Modern security teams are drowning in noise.
            </h2>
          </ScrollReveal>
          <div className="grid gap-6 md:grid-cols-2">
            <ScrollReveal className="glass-card rounded-2xl p-8">
              <h3 className="mb-4 font-heading text-xl font-semibold text-foreground">
                The Problem
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  "Security teams are overwhelmed with alerts.",
                  "Organizations use too many disconnected security tools.",
                  "Incident response is slow and manual.",
                  "Analysts spend too much time investigating false positives.",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive/70" />
                    {t}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal className="glass-card rounded-2xl p-8" delay={0.1}>
              <h3 className="mb-4 font-heading text-xl font-semibold text-foreground">
                The SOCBOX Approach
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {[
                  "AI triage collapses noise into prioritised, actionable incidents.",
                  "One platform for detection, investigation, and response.",
                  "Automated playbooks contain threats in seconds, not hours.",
                  "Centralised visibility across endpoints, cloud, identity, and network.",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {t}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="section-padding border-b border-white/5">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-12 max-w-2xl">
            <p className="section-label mb-3">Core Capabilities</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Everything a modern SOC needs.
            </h2>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c, i) => (
              <motion.article
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                className="glass-card group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary/15">
                  <c.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* How SOCBOX works */}
      <section className="section-padding border-b border-white/5">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal className="mb-14 max-w-2xl">
            <p className="section-label mb-3">How SOCBOX Works</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              From raw signal to resolved incident.
            </h2>
          </ScrollReveal>
          <ol className="relative space-y-6 md:space-y-8">
            <span className="absolute left-[27px] top-2 bottom-2 hidden w-px bg-gradient-to-b from-primary/40 via-white/10 to-transparent md:block" />
            {workflow.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="relative flex items-start gap-5"
              >
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-background text-primary shadow-[0_8px_24px_rgba(0,109,62,0.18)]">
                  <step.icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <div className="glass-card flex-1 rounded-2xl p-5">
                  <div className="flex items-baseline gap-3">
                    <span className="micro-label text-primary">Step {String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Who it's built for */}
      <section className="section-padding border-b border-white/5">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-12 max-w-2xl">
            <p className="section-label mb-3">Who It's Built For</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Built for teams of every scale.
            </h2>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {audiences.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: (i % 4) * 0.05 }}
                className="glass-card group flex items-center gap-3 rounded-xl p-4 transition-all hover:border-primary/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                  <a.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <span className="font-heading text-sm font-semibold text-foreground">
                  {a.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section-padding border-b border-white/5">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-12 max-w-2xl">
            <p className="section-label mb-3">Use Cases</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Deployed where security matters most.
            </h2>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((u, i) => (
              <motion.article
                key={u.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                className="glass-card rounded-2xl p-6"
              >
                <u.icon className="mb-4 h-6 w-6 text-primary" strokeWidth={1.75} />
                <h3 className="font-heading text-base font-semibold text-foreground">{u.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{u.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Why organizations choose SOCBOX */}
      <section className="section-padding border-b border-white/5">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal className="mb-12 max-w-2xl">
            <p className="section-label mb-3">Why Choose SOCBOX</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Outcomes that compound.
            </h2>
          </ScrollReveal>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {benefits.map((b, i) => (
              <motion.div
                key={b}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: (i % 4) * 0.05 }}
                className="glass-card flex items-center gap-3 rounded-xl px-4 py-3"
              >
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm font-medium text-foreground">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product screenshots */}
      <section className="section-padding border-b border-white/5">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal className="mb-12 max-w-2xl">
            <p className="section-label mb-3">Inside SOCBOX</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              A workspace designed for analysts.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              A quick look at the SOCBOX analyst experience — from live threat monitoring to
              guided investigations.
            </p>
          </ScrollReveal>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { label: "Threat Overview", title: "Live SOC dashboard", render: () => <PreviewDashboard /> },
              { label: "Incidents", title: "Triage queue", render: () => <PreviewIncidents /> },
              { label: "Investigation", title: "Entity graph", render: () => <PreviewGraph /> },
              { label: "Automation", title: "Response playbook", render: () => <PreviewPlaybook /> },
            ].map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: (i % 2) * 0.08 }}
                className="glass-card group relative aspect-[16/10] overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
              >
                <div
                  className="absolute inset-0 opacity-80"
                  style={{
                    background:
                      "radial-gradient(60% 60% at 30% 20%, hsl(var(--primary) / 0.18), transparent 65%), linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0))",
                  }}
                />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                      <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
                    </div>
                    <span className="micro-label text-primary/80">{p.label}</span>
                  </div>
                  <div className="relative flex-1 overflow-hidden p-4">{p.render()}</div>
                  <div className="border-t border-white/5 px-4 py-2">
                    <p className="font-heading text-xs text-muted-foreground">{p.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding border-b border-white/5">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal className="mb-12 max-w-2xl">
            <p className="section-label mb-3">FAQ</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Frequently Asked Questions
            </h2>
          </ScrollReveal>
          <div className="space-y-3">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={f.q}
                  className="glass-card overflow-hidden rounded-xl transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-heading text-base font-semibold text-foreground">
                      {f.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-primary transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="border-t border-white/5 px-6 py-5 text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 30%, hsl(var(--primary) / 0.22), transparent 65%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Modern Security Operations. Powered by AI.
              <br />
              <span className="text-gradient">Built by ClickBox.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted-foreground">
              Discover how SOCBOX helps security teams detect threats faster, investigate smarter,
              and respond with confidence.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-md border border-[rgba(208,201,195,0.4)] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-[#007A48]"
              >
                Book a Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-white/10"
              >
                Contact Sales
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Socbox;
