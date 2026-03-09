import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import teamPrince from "@/assets/team-prince.jpg";
import teamVictor from "@/assets/team-victor.jpg";
import teamIsaac from "@/assets/team-isaac.jpg";
import teamKunmi from "@/assets/team-kunmi.jpg";

const members = [
  { img: teamPrince, name: "Prince Oruma", role: "Chief Operating Officer", bio: "A security engineer and tech entrepreneur driving ClickBox's operational strategy. With deep expertise in vulnerability management and risk mitigation, Prince blends cybersecurity with innovation — building scalable solutions that empower organizations to thrive securely in the digital age." },
  { img: teamVictor, name: "Victor Steven Igbinedion", role: "Chief Technology Officer", bio: "A penetration tester and AI enthusiast focused on advancing defensive security through automation and AI-driven detection. Victor architects scalable security solutions that shift organizations from reactive monitoring to adaptive, intelligence-led cyber defense." },
  { img: teamIsaac, name: "Isaac Udumeighe", role: "Chief Technology Officer", bio: "A cybersecurity professional specializing in security operations and threat-driven defense. Isaac designs detection, response, and resilience capabilities — from Zero Trust architecture to phishing defense strategy — helping organizations proactively defend against sophisticated threats." },
  { img: teamKunmi, name: "Kunmi Olugbemi", role: "Chief Information Security Officer", bio: "An information security professional specializing in risk management, data protection, and security governance. Kunmi strengthens governance frameworks and delivers targeted awareness programmes — building resilient security cultures that align with regulatory requirements and business objectives." },
];

const Team = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="section-padding pt-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-16 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Our People</p>
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-5xl">
            Meet the Team
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The minds behind ClickBox — combining deep technical expertise with strategic vision to build a more secure digital world.
          </p>
        </motion.div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, i) => (
            <motion.div
              key={member.name}
              className="group"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: "easeOut" }}
            >
              <div className="aspect-square overflow-hidden rounded-lg border border-border">
                <img
                  src={member.img}
                  alt={member.name}
                  className="h-full w-full object-cover grayscale transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground">{member.name}</h3>
              {member.role && <p className="mt-1 text-sm text-primary">{member.role}</p>}
              {member.bio && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{member.bio}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Team;
