import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Radar,
  Layers,
  GitBranch,
  Gauge,
  FileSearch,
  Lightbulb,
  NotebookPen,
  ListTree,
  ScrollText,
  BadgeCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TallyEmbed } from "@/components/forms/TallyEmbed";
import ThreatLensConsole from "@/components/solutions/ThreatLensConsole";
import ScrollReveal from "@/components/scroll/ScrollReveal";
import { THREATLENS_URL, externalLinkProps } from "@/lib/links";

const valuePoints = [
  {
    icon: Radar,
    title: "Investigate realistic scenarios",
    desc: "Work fresh, generated incidents across identity, endpoint, email, and cloud — no two sessions the same.",
  },
  {
    icon: Layers,
    title: "Analyze telemetry and evidence",
    desc: "Pivot through logs, alerts, and threat intelligence to separate real signal from planted decoys.",
  },
  {
    icon: GitBranch,
    title: "Practice response decisions",
    desc: "Build a timeline, choose containment actions, and classify the verdict the way a real SOC does.",
  },
  {
    icon: Gauge,
    title: "Build measurable skill",
    desc: "Findings are scored against hidden ground truth, with feedback that tracks technique mastery over time.",
  },
];

const workflow = [
  { icon: FileSearch, label: "Evidence review" },
  { icon: Lightbulb, label: "Hypothesis" },
  { icon: NotebookPen, label: "Investigation notes" },
  { icon: ListTree, label: "Timeline" },
  { icon: ScrollText, label: "Findings & verdict" },
  { icon: BadgeCheck, label: "Automated scoring" },
];

const ThreatLens = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="section-padding border-b border-white/5 pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="badge-accent-frame mb-6 inline-flex rounded-full bg-black px-4 py-1.5">
                <span className="text-[#BDC4C6]">ClickBox Solutions</span>
                <span aria-hidden className="text-muted-foreground/50">
                  /
                </span>
                ThreatLens
              </div>
              <h1 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-5xl">
                Learn cybersecurity by <span className="text-gradient">investigating real threats</span>.
              </h1>
              <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
                ThreatLens is an interactive investigation platform for people building a career in
                security operations. Analyze evidence, explore telemetry, make response decisions,
                and submit your findings inside a workspace modelled on a real SOC — then get
                structured feedback and scoring.
              </p>

              <div className="mt-9 flex flex-wrap gap-3 md:gap-4">
                <a
                  href={THREATLENS_URL}
                  {...externalLinkProps}
                  className="group inline-flex items-center gap-2 rounded-md border border-[rgba(189,196,198,0.4)] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_32px_-8px_rgba(255,255,255,0.25)] transition-all hover:bg-[#E5E5E5] hover:border-[rgba(189,196,198,0.55)]"
                >
                  Explore ThreatLens
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="#threatlens-teams"
                  className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/10"
                >
                  For teams &amp; institutions
                </a>
              </div>

              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6">
                {[
                  "Realistic scenarios",
                  "Telemetry analysis",
                  "Response decisions",
                  "Structured scoring",
                ].map((chip) => (
                  <li
                    key={chip}
                    className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#BDC4C6]"
                  >
                    <span aria-hidden className="h-1 w-1 rounded-full bg-[#BDC4C6]" />
                    {chip}
                  </li>
                ))}
              </ul>
            </div>

            <ThreatLensConsole />
          </div>
        </div>
      </section>

      {/* What you can do */}
      <section className="section-padding border-b border-white/5">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-12 max-w-2xl">
            <p className="section-label mb-3">Inside ThreatLens</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              An investigation workspace, not another video course.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Every scenario puts you in the analyst's seat with live security events, threat
              intelligence, and the tools to reach a defensible verdict.
            </p>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valuePoints.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.06} className="glass-card p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md icon-accent-wrap">
                  <v.icon className="h-5 w-5 text-[#FFFFFF]" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
              </ScrollReveal>
            ))}
          </div>

          {/* Workflow strip */}
          <ScrollReveal delay={0.1} className="mt-10 rounded-xl border border-[rgba(189,196,198,0.22)] bg-white/[0.02] p-6">
            <p className="micro-label mb-5">The investigation flow</p>
            <ol className="flex flex-col gap-4 md:flex-row md:items-center md:gap-2">
              {workflow.map((step, i) => (
                <li key={step.label} className="flex items-center gap-2 md:flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03]">
                      <step.icon className="h-4 w-4 text-[#BDC4C6]" strokeWidth={1.75} />
                    </div>
                    <span className="text-sm font-medium text-foreground md:text-[13px] lg:text-sm">
                      {step.label}
                    </span>
                  </div>
                  {i < workflow.length - 1 && (
                    <ArrowRight
                      aria-hidden
                      className="ml-auto hidden h-4 w-4 shrink-0 text-muted-foreground/40 md:block"
                    />
                  )}
                </li>
              ))}
            </ol>
          </ScrollReveal>

          <div className="mt-10">
            <a
              href={THREATLENS_URL}
              {...externalLinkProps}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              See the full product experience
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Teams & institutions inquiry */}
      <section id="threatlens-teams" className="section-padding scroll-mt-28">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="section-label mb-3 inline-block">For Teams &amp; Institutions</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              ThreatLens for your organization
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Using ThreatLens for cybersecurity training, workforce development, education, or a
              partnership? Tell us about your team and we'll help you get set up with rosters,
              assignments, and progress reporting.
            </p>
          </div>

          <TallyEmbed formId="81r5Jr" height={200} title="ThreatLens for organizations" />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Just want to try it yourself?{" "}
            <a
              href={THREATLENS_URL}
              {...externalLinkProps}
              className="font-semibold text-foreground underline-offset-4 hover:underline"
            >
              Explore ThreatLens
            </a>
            .
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThreatLens;
