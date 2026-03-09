import { Link } from "react-router-dom";
import { Shield, UserCheck, FileCheck, Search, BookOpen, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import teamPrince from "@/assets/team-prince.jpg";
import teamVictor from "@/assets/team-victor.jpg";
import teamIsaac from "@/assets/team-isaac.jpg";
import teamKunmi from "@/assets/team-kunmi.jpg";

const services = [
  { icon: BookOpen, title: "Cybersecurity Training", desc: "Equip your team with the knowledge to recognize and respond to threats effectively." },
  { icon: UserCheck, title: "Social Engineering Awareness", desc: "Train employees to detect manipulation tactics and prevent human-layer breaches." },
  { icon: FileCheck, title: "Data Protection & NDPR Compliance", desc: "Ensure your organization meets Nigerian Data Protection Regulation requirements." },
  { icon: Shield, title: "ISO 27001 Guidance", desc: "Align your information security management system with international standards." },
  { icon: Search, title: "Penetration Testing", desc: "Identify vulnerabilities in your systems before attackers do with real-world simulation." },
  { icon: Lock, title: "Security Auditing", desc: "Comprehensive assessments of your security infrastructure, policies, and procedures." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="section-padding flex min-h-screen items-center pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-6 inline-block rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground">
              Cybersecurity Consulting
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
              We don't just secure systems —{" "}
              <span className="text-gradient">we help organizations build securely.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Practical, enterprise-focused cybersecurity services that combine technical expertise with strategic risk management.
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
                className="rounded-md border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-all hover:bg-muted"
              >
                Explore Our Product
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="section-padding border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">What We Do</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Enterprise-Focused Security Services
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We help businesses identify vulnerabilities, protect sensitive data, and build resilient systems through proven methodologies.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className="group rounded-lg border border-border bg-card p-8 transition-all hover:border-primary/30 hover:border-glow"
              >
                <s.icon className="mb-4 h-8 w-8 text-primary" strokeWidth={1.5} />
                <h3 className="font-heading text-lg font-semibold text-card-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section-padding border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">About ClickBox</p>
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                Security Expertise Meets Strategic Thinking
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                ClickBox Information Technology Ltd is a cybersecurity company focused on helping organizations strengthen their security posture, protect sensitive data, and stay compliant in an evolving digital landscape.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Our approach combines technical expertise with strategic risk management to help businesses identify vulnerabilities and build resilient systems. Beyond services, we're building an AI-powered cybersecurity platform designed to enhance vulnerability detection, threat intelligence, and risk monitoring for modern enterprises.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "Enterprise", label: "Grade Security" },
                { value: "ISO 27001", label: "Aligned" },
                { value: "NDPR", label: "Compliant" },
                { value: "AI-Powered", label: "Platform" },
              ].map((stat) => (
                <div key={stat.value} className="rounded-lg border border-border bg-card p-6 text-center">
                  <p className="font-heading text-xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding border-t border-border">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Ready to Strengthen Your Security?
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Whether you need a security audit, compliance guidance, or want early access to our AI-powered phishing detection tool — we're here to help.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/product"
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Join the Waitlist
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
