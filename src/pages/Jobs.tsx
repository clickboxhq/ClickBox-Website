import { motion } from "framer-motion";
import { Briefcase, Bell } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const Jobs = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="section-padding pt-32">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div {...fadeUp}>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5 text-[#FFFFFF]" />
            Careers at ClickBox
          </span>
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-5xl">Jobs</h1>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="glass-card mt-10 flex flex-col items-center gap-5 rounded-2xl px-8 py-16 md:px-16"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
            <Bell className="h-6 w-6 text-[#FFFFFF]" />
          </div>
          <h2 className="font-heading text-xl font-semibold text-foreground md:text-2xl">
            Open positions will be published here soon.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            We're building ClickBox's next chapter. Full-time and experienced-hire roles will be
            listed here as they open. In the meantime, our{" "}
            <Link to="/internship" className="text-[#FFFFFF] underline-offset-4 hover:underline">
              Internship program
            </Link>{" "}
            is open for applications.
          </p>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Jobs;
