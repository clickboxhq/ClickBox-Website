import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What industries does ClickBox support?",
    a: "We work across regulated industries, financial services, healthcare, technology, SaaS, manufacturing, retail, and the public sector — anywhere security, compliance, and resilience are mission-critical.",
  },
  {
    q: "Do you work with startups?",
    a: "Yes. We help startups and growth-stage companies build enterprise-grade security foundations without the cost and overhead of standing up a large internal team.",
  },
  {
    q: "Do you offer compliance support?",
    a: "We support ISO/IEC 27001, SOC 2, GDPR, PCI DSS, and other global frameworks — covering readiness, implementation, evidence collection, and audit support.",
  },
  {
    q: "Can ClickBox help improve our security posture?",
    a: "Yes. We start with a discovery assessment to baseline your current posture, then deliver prioritized, business-aligned improvements across risk, controls, monitoring, and response.",
  },
  {
    q: "What is included in a security consultation?",
    a: "A consultation includes an initial review of your environment, key risks, and objectives, followed by a tailored set of recommendations and a roadmap aligned to your goals.",
  },
  {
    q: "Do you offer ongoing security support?",
    a: "Yes. Through our SOC as a Service, vCISO, and managed engagements we provide continuous monitoring, advisory, and operational support.",
  },
];

const ServicesFaq = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section-padding border-t border-black/5 bg-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 max-w-2xl">
          <p className="section-label mb-3">FAQ</p>
          <h2 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 leading-relaxed text-neutral-600">
            Answers to the questions we hear most often about ClickBox cybersecurity services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="glass-card-dark overflow-hidden rounded-xl transition-all duration-300"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
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
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-white/5 px-6 py-5 text-sm leading-relaxed text-muted-foreground">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesFaq;
