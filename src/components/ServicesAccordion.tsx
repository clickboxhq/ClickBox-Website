import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  UserCheck,
  FileCheck,
  Search,
  BookOpen,
  Lock,
  Activity,
  Plus,
  type LucideIcon,
} from "lucide-react";

type Service = {
  icon: LucideIcon;
  title: string;
  summary: string;
  details: string[];
};

const services: Service[] = [
  {
    icon: Activity,
    title: "SOC as a Service (SOCaaS)",
    summary: "24/7 monitoring, detection, and incident response.",
    details: [
      "Round-the-clock alert triage and threat detection",
      "Incident response support with documented playbooks",
      "Continuous visibility into your security posture",
    ],
  },
  {
    icon: BookOpen,
    title: "Cybersecurity Training",
    summary: "Equip your team to recognize and respond to threats effectively.",
    details: [
      "Role-based curricula for executives, engineers, and front-line staff",
      "Practical labs, phishing simulations, and live tabletop exercises",
      "Measurable outcomes through assessments and progress tracking",
    ],
  },
  {
    icon: UserCheck,
    title: "Social Engineering Awareness",
    summary: "Detect manipulation tactics and prevent human-layer breaches.",
    details: [
      "Targeted phishing, vishing, and smishing simulations",
      "Behavioural baselines with department-level reporting",
      "Reinforcement campaigns that reduce click-through over time",
    ],
  },
  {
    icon: FileCheck,
    title: "Data Protection & Compliance",
    summary: "Ensure your organization meets data protection requirements.",
    details: [
      "Data classification, mapping, and lifecycle controls",
      "Privacy impact assessments and policy frameworks",
      "Continuous alignment with evolving regulatory expectations",
    ],
  },
  {
    icon: Shield,
    title: "ISO 27001 Guidance",
    summary: "Align your ISMS with internationally recognized standards.",
    details: [
      "Gap analysis against ISO 27001:2022 controls",
      "ISMS scoping, risk treatment plans, and Statement of Applicability",
      "Audit-readiness support and ongoing programme governance",
    ],
  },
  {
    icon: Search,
    title: "Vulnerability Management & Penetration Testing (VAPT)",
    summary:
      "Identify, assess, prioritize, and remediate vulnerabilities while validating security controls through comprehensive penetration testing and security assessments.",
    details: [
      "Network, web, API, and cloud configuration testing",
      "OWASP-aligned methodology with manual + automated coverage",
      "Risk-based prioritization with executive-grade remediation roadmaps",
    ],
  },
  {
    icon: Lock,
    title: "Security Auditing",
    summary: "Comprehensive assessments of your security posture.",
    details: [
      "Control reviews against your chosen framework",
      "Policy, process, and technical configuration audits",
      "Independent findings with practical remediation roadmaps",
    ],
  },
];

const ServicesAccordion = ({ variant = "dark" }: { variant?: "dark" | "light" }) => {
  const [open, setOpen] = useState<number | null>(null);
  const isLight = variant === "light";

  const cardClass = isLight
    ? "rounded-xl border border-neutral-200 bg-neutral-50 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md"
    : "glass-card transition-all duration-300";

  return (
    <div className="space-y-3">
      {services.map((s, i) => {
        const isOpen = open === i;
        return (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={`overflow-hidden ${cardClass} ${
              isOpen ? "border-primary/40" : ""
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center gap-5 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20">
                <s.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-heading text-base md:text-lg font-semibold ${
                    isLight ? "text-neutral-900" : "text-foreground"
                  }`}
                >
                  {s.title}
                </h3>
                <p
                  className={`mt-1 text-sm line-clamp-1 ${
                    isLight ? "text-neutral-600" : "text-muted-foreground"
                  }`}
                >
                  {s.summary}
                </p>
              </div>
              <Plus
                className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div
                    className={`border-t px-6 py-5 pl-[5.25rem] ${
                      isLight ? "border-neutral-200" : "border-white/5"
                    }`}
                  >
                    <ul
                      className={`space-y-2.5 text-sm leading-relaxed ${
                        isLight ? "text-neutral-600" : "text-muted-foreground"
                      }`}
                    >
                      {s.details.map((d) => (
                        <li key={d} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ServicesAccordion;
