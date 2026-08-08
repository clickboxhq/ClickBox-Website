import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Set once the ClickBox certificate template + recipient workflow exists in
// Certifier (see project notes) — e.g. VITE_CERTIFIER_URL=https://clickbox.certifier.io/...
const CERTIFIER_URL = import.meta.env.VITE_CERTIFIER_URL as string | undefined;

const Certificate = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="section-padding relative flex min-h-[80vh] items-center overflow-hidden pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="badge-accent-frame mb-7 inline-flex rounded-full bg-black px-4 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-white" />
            Certificate Portal
          </div>

          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
            ClickBox Internship Certificate
          </h1>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
            Your journey with ClickBox deserves to be recognized.
          </p>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground md:text-lg">
            Generate your official ClickBox Internship Certificate through our certificate platform.
          </p>

          <div className="mt-10">
            {CERTIFIER_URL ? (
              <a
                href={CERTIFIER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-md border border-[rgba(189,196,198,0.4)] bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-[#E5E5E5]"
              >
                Generate Your Certificate{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            ) : (
              <div className="glass-card mx-auto max-w-sm rounded-xl p-5 text-sm text-muted-foreground">
                Certificate generation opens soon. Check back shortly, or reach out at{" "}
                <a href="mailto:info@useclickbox.com" className="text-white underline-offset-4 hover:underline">
                  info@useclickbox.com
                </a>
                .
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Certificate;
