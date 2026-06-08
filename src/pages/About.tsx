import { motion } from "framer-motion";
import { ShieldCheck, Lightbulb, Award, HeartHandshake } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CertificationsMarquee from "@/components/CertificationsMarquee";

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    desc: "We act with honesty, transparency, and accountability in every engagement.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "We bring forward-thinking approaches and modern tooling to solve evolving security challenges.",
  },
  {
    icon: Award,
    title: "Excellence",
    desc: "We hold ourselves to the highest standards across delivery, quality, and outcomes.",
  },
  {
    icon: HeartHandshake,
    title: "Client Focus",
    desc: "We build long-term partnerships rooted in trust, responsiveness, and measurable value.",
  },
];

const stats = [
  { value: "Enterprise", label: "Grade Security" },
  { value: "ISO 27001", label: "Aligned" },
  { value: "Global", label: "Compliance" },
  { value: "AI-Powered", label: "Platform" },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="section-padding pt-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            About ClickBox
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight text-foreground md:text-6xl">
            Security expertise meets <span className="text-gradient">strategic thinking.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            ClickBox is a cybersecurity company focused on helping organizations strengthen
            their security posture, protect sensitive data, and stay compliant in an evolving
            digital landscape.
          </p>
        </motion.div>

        <motion.div
          className="mt-16 grid gap-12 lg:grid-cols-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Our approach combines technical expertise with strategic risk management to help
              businesses identify vulnerabilities and build resilient systems. We work alongside
              security, engineering, and leadership teams to translate complex risk into clear,
              actionable programs.
            </p>
            <p>
              Whether you are scaling rapidly, modernizing infrastructure, or strengthening your
              security operations, ClickBox is built to be a long-term partner.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.value} className="glass-card p-6 text-center">
                <p className="font-heading text-xl font-bold text-primary">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    <section className="section-padding border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            What Drives Us
          </p>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Our values.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The principles that shape how we work, who we hire, and how we partner with our clients.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass-card group p-6 transition-all hover:border-primary/40 hover:-translate-y-1"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20 transition group-hover:bg-primary/15">
                <v.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="section-padding border-t border-white/5">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-12 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Certifications & Expertise
          </p>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
            Industry-recognized credentials backing every engagement.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Our team combines industry-recognized certifications, practical cybersecurity experience,
            and business-focused expertise to help organizations strengthen security, manage risk,
            and operate with confidence.
          </p>
        </motion.div>
        <CertificationsMarquee />
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
