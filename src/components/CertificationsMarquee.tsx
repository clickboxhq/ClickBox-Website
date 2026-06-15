import cert1 from "@/assets/certifications/cert-1.jpg";
import cert2 from "@/assets/certifications/cert-2.jpg";
import cert3 from "@/assets/certifications/cert-3.jpg";
import cert4 from "@/assets/certifications/cert-4.jpg";
import cert5 from "@/assets/certifications/cert-5.jpg";
import cert6 from "@/assets/certifications/cert-6.jpg";
import cert7 from "@/assets/certifications/cert-7.jpg";
import cert8 from "@/assets/certifications/cert-8.jpg";

const badges = [
  { src: cert1, alt: "ISO/IEC 27001:2022 Lead Auditor Certified" },
  { src: cert2, alt: "Microsoft Certified: Azure Fundamentals" },
  { src: cert3, alt: "ISACA CISA Certified Information Systems Auditor" },
  { src: cert4, alt: "Google Cloud Certified Associate Cloud Engineer" },
  { src: cert5, alt: "Microsoft Certified: Security, Compliance, and Identity Fundamentals" },
  { src: cert6, alt: "Oracle Cloud Infrastructure Foundations Associate" },
  { src: cert7, alt: "CompTIA Security+ Certified" },
  { src: cert8, alt: "Oracle Cloud Infrastructure AI Foundations Associate" },
];

const CertificationsMarquee = ({ variant = "dark" }: { variant?: "dark" | "light" }) => {
  const isLight = variant === "light";
  const cardClass = isLight
    ? "flex h-32 w-32 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm sm:h-36 sm:w-36 md:h-40 md:w-40"
    : "glass flex h-32 w-32 shrink-0 items-center justify-center rounded-xl p-4 sm:h-36 sm:w-36 md:h-40 md:w-40";

  // Duplicate for seamless loop
  const row = [...badges, ...badges];

  return (
    <div
      className="group relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div
        className="flex w-max gap-6 animate-[marquee_45s_linear_infinite] group-hover:[animation-play-state:paused]"
        aria-label="Industry certifications carousel"
      >
        {row.map((b, i) => (
          <div key={`${b.alt}-${i}`} className={cardClass}>
            <img
              src={b.src}
              alt={b.alt}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsMarquee;
