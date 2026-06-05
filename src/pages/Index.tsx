import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — Premium building CTA */}
      <PremiumCTA asHero />

      {/* Consulting Hero */}
      <section className="section-padding border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-6 inline-block rounded-full border border-white/10 bg-secondary/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              Cybersecurity Consulting
            </div>
            <h2 className="font-heading text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              We don't just secure systems —{" "}
              <span className="text-gradient">we help organizations build securely.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Practical, enterprise-focused cybersecurity services that combine technical expertise
              with strategic risk management.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#services"
                className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                Our Services
              </a>
              <Link
                to="/product"
                className="rounded-md border border-white/10 bg-secondary/80 px-6 py-3 text-sm font-semibold text-secondary-foreground backdrop-blur transition-all hover:bg-muted"
              >
                Explore Our Product
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services — accordion */}
      <section id="services" className="section-padding border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              What We Do
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Enterprise-Focused Security Services
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Tap any service to explore the practical capabilities we deliver.
            </p>
          </div>
          <ServicesAccordion />
        </div>
      </section>

      {/* Who We Serve */}
      <section className="section-padding border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Who We Serve
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Our Services Are Ideal For
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="glass-card p-8"
              >
                <a.icon className="mb-4 h-8 w-8 text-primary" strokeWidth={1.5} />
                <h3 className="font-heading text-lg font-semibold text-foreground">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section-padding border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Our Approach
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              A practical methodology for measurable outcomes.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              A business-aligned methodology for delivering measurable cybersecurity outcomes.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {approach.map((a, i) => (
              <motion.div
                key={a.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card p-8 relative"
              >
                <span className="absolute right-6 top-6 font-heading text-3xl font-bold text-primary/20">
                  {a.n}
                </span>
                <a.icon className="mb-4 h-8 w-8 text-primary" strokeWidth={1.5} />
                <h3 className="font-heading text-lg font-semibold text-foreground">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Expertise */}
      <section className="section-padding border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Certifications & Expertise
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Industry-recognized credentials backing every engagement.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our team combines industry-recognized certifications, practical cybersecurity
              experience, and business-focused expertise to deliver solutions that help organizations
              strengthen security, manage risk, and operate with confidence.
            </p>
          </div>
          <CertificationsMarquee />
        </div>
      </section>

      {/* Why Partner */}
      <section className="section-padding border-t border-white/5">

        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Why Partner With ClickBox
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Intelligent cybersecurity that helps you build securely.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Delivering intelligent cybersecurity solutions that help organizations build securely.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyPartner.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="glass-card p-8"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20 mb-4">
                  <w.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PremiumCTA />

      <Footer />
    </div>
  );
};

export default Index;
