import { Link } from "react-router-dom";
import {
  Building2,
  Rocket,
  Cloud,
  Repeat,
  TrendingUp,
  Users,
  Search,
  Target,
  Wrench,
  Handshake,
  Clock,
  DollarSign,
  Eye,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesAccordion from "@/components/ServicesAccordion";
import CertificationsMarquee from "@/components/CertificationsMarquee";
import PremiumCTA from "@/components/PremiumCTA";
import ServicesFaq from "@/components/ServicesFaq";
import ScrollReveal from "@/components/scroll/ScrollReveal";
import CountUpStat from "@/components/scroll/CountUpStat";
import HowItWorksScroll from "@/components/scroll/HowItWorksScroll";
import SecurityArchitectureScroll from "@/components/scroll/SecurityArchitectureScroll";
import EngagementTimeline from "@/components/scroll/EngagementTimeline";

const audiences = [
  {
    icon: Building2,
    title: "Regulated Industries",
    desc: "Organizations operating under strict regulatory and compliance requirements.",
  },
  {
    icon: Rocket,
    title: "Startups & Growth Companies",
    desc: "Businesses requiring enterprise-grade cybersecurity without enterprise-level costs.",
  },
  {
    icon: Cloud,
    title: "Cloud-First Businesses",
    desc: "Organizations running modern infrastructure across cloud environments and distributed teams.",
  },
  {
    icon: Repeat,
    title: "Organizations in Transition",
    desc: "Businesses undergoing digital transformation, expansion, mergers, acquisitions, or technology modernization.",
  },
  {
    icon: TrendingUp,
    title: "Mid-Market Organizations",
    desc: "Companies looking to scale cybersecurity capabilities as they grow.",
  },
  {
    icon: Users,
    title: "Resource-Constrained Teams",
    desc: "Organizations that need additional cybersecurity expertise and support without increasing internal headcount.",
  },
];

const approach = [
  {
    n: "01",
    icon: Search,
    title: "Current State Discovery",
    desc: "We begin by understanding your business environment, security posture, risk exposure, compliance obligations, and operational challenges to establish a clear baseline.",
  },
  {
    n: "02",
    icon: Target,
    title: "Business Alignment",
    desc: "We align cybersecurity initiatives with your business goals, risk tolerance, and growth objectives to ensure security supports the organization rather than slows it down.",
  },
  {
    n: "03",
    icon: Wrench,
    title: "Solution Delivery",
    desc: "We design and implement targeted cybersecurity solutions that address identified risks while improving resilience, visibility, and operational efficiency.",
  },
  {
    n: "04",
    icon: Repeat,
    title: "Continuous Improvement",
    desc: "We continuously monitor outcomes, refine controls, strengthen processes, and adapt security strategies to evolving threats and business requirements.",
  },
];

const whyPartner = [
  {
    icon: Target,
    title: "Business-Aligned Security",
    desc: "We ensure every security recommendation supports business priorities, risk management objectives, and long-term growth.",
  },
  {
    icon: Users,
    title: "Experienced Professionals",
    desc: "Our team combines practical cybersecurity expertise with real-world experience across risk management, compliance, security operations, and testing.",
  },
  {
    icon: Clock,
    title: "Rapid Deployment",
    desc: "We help organizations strengthen security quickly through efficient implementation, expert guidance, and proven methodologies.",
  },
  {
    icon: DollarSign,
    title: "Cost-Effective Security",
    desc: "Access enterprise-grade cybersecurity services without the complexity and cost of building a large internal security team.",
  },
  {
    icon: Eye,
    title: "Continuous Monitoring",
    desc: "Benefit from ongoing visibility, monitoring, and proactive threat management through our security operations capabilities.",
  },
  {
    icon: Handshake,
    title: "Trusted Partnership",
    desc: "We focus on long-term relationships built on transparency, reliability, accountability, and measurable outcomes.",
  },
];

const engagementMilestones = [
  {
    year: "Week 1",
    title: "Discovery & scoping",
    desc: "We learn your environment, stakeholders, and priorities to define a focused engagement plan.",
  },
  {
    year: "Weeks 2–4",
    title: "Assessment & alignment",
    desc: "Risk and posture are evaluated alongside business goals to shape a practical security roadmap.",
  },
  {
    year: "Month 2+",
    title: "Delivery & integration",
    desc: "Controls, processes, and tooling are implemented with clear ownership and measurable outcomes.",
  },
  {
    year: "Ongoing",
    title: "Partnership & evolution",
    desc: "Continuous monitoring, refinement, and strategic guidance as your organization grows.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PremiumCTA asHero />

      <section className="section-padding border-t border-black/5 bg-white">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-3xl">
            <div className="mb-6 inline-block rounded-full border border-neutral-200 bg-neutral-100 px-4 py-1.5 text-xs font-medium text-neutral-600">
              Cybersecurity Consulting
            </div>
            <h2 className="font-heading text-4xl font-bold leading-tight text-neutral-900 md:text-5xl lg:text-6xl">
              We don't just secure systems —{" "}
              <span className="text-gradient">we help organizations build securely.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">
              Practical, enterprise-focused cybersecurity services that combine technical expertise
              with strategic risk management.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#services"
                className="rounded-md border border-[rgba(189,196,198,0.4)] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-[#1D4358] hover:border-[rgba(189,196,198,0.55)]"
              >
                Our Services
              </a>
              <Link
                to="/product"
                className="rounded-md border border-neutral-200 bg-neutral-50 px-6 py-3 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-100"
              >
                Explore Our Product
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <HowItWorksScroll steps={approach} />

      <section id="services" className="section-padding border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal className="mb-12 max-w-2xl">
            <p className="section-label mb-3">
              What We Do
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Enterprise-Focused Security Services
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              We deliver practical security services and build tailored solutions for your organization.
            </p>
          </ScrollReveal>
          <ServicesAccordion />
        </div>
      </section>

      <section className="section-padding border-t border-black/5 bg-white">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-12 max-w-2xl">
            <p className="section-label mb-3">
              Who We Serve
            </p>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">
              Our Services Are Ideal For
            </h2>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((a, i) => (
              <ScrollReveal key={a.title} delay={i * 0.06} className="glass-card-dark rounded-xl p-8 transition-all duration-300">
                <a.icon className="mb-4 h-8 w-8 text-primary" strokeWidth={1.5} />
                <h3 className="font-heading text-lg font-semibold text-foreground">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding relative overflow-hidden border-t border-white/5">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, hsl(var(--primary) / 0.12), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl">
          <ScrollReveal className="mb-12 max-w-2xl text-center md:mx-auto">
            <p className="section-label mb-3">
              By The Numbers
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Measurable impact across every engagement.
            </h2>
          </ScrollReveal>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <CountUpStat value={8} suffix="+" label="Industry certifications" />
            <CountUpStat value={4} label="Core engagement phases" />
            <CountUpStat value={24} suffix="/7" label="SOC monitoring coverage" />
            <CountUpStat value={100} suffix="%" label="Business-aligned delivery" />
          </div>
        </div>
      </section>

      <SecurityArchitectureScroll />

      <section className="section-padding border-t border-black/5 bg-white">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-12 max-w-2xl">
            <p className="section-label mb-3">
              Certifications & Expertise
            </p>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">
              Industry-recognized credentials backing every engagement.
            </h2>
            <p className="mt-4 leading-relaxed text-neutral-600">
              Our team combines industry-recognized certifications, practical cybersecurity
              experience, and business-focused expertise to deliver solutions that help organizations
              strengthen security, manage risk, and operate with confidence.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <CertificationsMarquee variant="light" />
          </ScrollReveal>
        </div>
      </section>

      <EngagementTimeline milestones={engagementMilestones} />

      <section className="section-padding border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="mb-12 max-w-2xl">
            <p className="section-label mb-3">
              Why Partner With ClickBox
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Intelligent cybersecurity that helps you build securely.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Delivering intelligent cybersecurity solutions that help organizations build securely.
            </p>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyPartner.map((w, i) => (
              <ScrollReveal key={w.title} delay={i * 0.06} className="glass-card p-8">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md icon-accent-wrap">
                  <w.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <ServicesFaq />

      <Footer />
    </div>
  );
};

export default Index;
