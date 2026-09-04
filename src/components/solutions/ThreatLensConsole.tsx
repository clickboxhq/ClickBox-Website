import { motion } from "framer-motion";
import {
  LayoutGrid,
  Bell,
  ShieldAlert,
  Fingerprint,
  MonitorSmartphone,
  Mail,
  Cloud,
  Search,
} from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * On-brand static preview of the ThreatLens SOC investigation console.
 *
 * Not a screenshot — a hand-built representation using the ClickBox design
 * tokens so it sits naturally inside the site. Decorative: the whole block is
 * exposed to assistive tech as a single labelled image.
 */

const railItems = [
  { icon: LayoutGrid, label: "Overview" },
  { icon: Bell, label: "Alerts", badge: "12" },
  { icon: ShieldAlert, label: "Incidents", active: true },
  { icon: Fingerprint, label: "Identity" },
  { icon: MonitorSmartphone, label: "Endpoints" },
  { icon: Mail, label: "Email" },
  { icon: Cloud, label: "Cloud" },
];

const stats = [
  { label: "Open incidents", value: "7" },
  { label: "Alerts triaged", value: "1,942" },
  { label: "Cases closed", value: "34" },
  { label: "Median time to verdict", value: "11m" },
];

const alerts = [
  {
    id: "ALR-9F31",
    severity: "Critical",
    title: "Impossible travel + MFA fatigue",
    source: "Identity · Entra ID",
    age: "2m",
  },
  {
    id: "ALR-9F28",
    severity: "High",
    title: "Credential access via LSASS read",
    source: "Endpoint · EDR",
    age: "6m",
  },
  {
    id: "ALR-9F17",
    severity: "Medium",
    title: "Anomalous S3 bucket policy change",
    source: "Cloud · AWS CloudTrail",
    age: "21m",
  },
];

const severityStyles: Record<string, string> = {
  Critical: "border-[#D40019]/50 text-[#FF5A6E] bg-[#D40019]/10",
  High: "border-[rgba(189,196,198,0.45)] text-foreground bg-white/[0.06]",
  Medium: "border-white/10 text-muted-foreground bg-white/[0.03]",
};

const ThreatLensConsole = () => {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      role="img"
      aria-label="Preview of the ThreatLens investigation console: an incident queue with severity-ranked alerts, live SOC metrics, linked evidence mapped to MITRE ATT&CK techniques, and suggested response actions awaiting analyst approval."
      className="glass-card overflow-hidden rounded-xl border-[rgba(189,196,198,0.22)]"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#0A0A0A] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <div className="mx-auto flex items-center gap-2 rounded-md border border-white/[0.06] bg-black/60 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#BDC4C6]" />
          <span className="font-mono text-[11px] text-muted-foreground">
            threatlensapp.com/console
          </span>
        </div>
      </div>

      <div className="flex">
        {/* Icon rail */}
        <nav
          aria-hidden="true"
          className="flex shrink-0 flex-col items-center gap-1 border-r border-white/[0.06] bg-[#080808] px-2 py-3"
        >
          {railItems.map(({ icon: Icon, label, badge, active }) => (
            <span
              key={label}
              title={label}
              className={`relative flex h-8 w-8 items-center justify-center rounded-md ${
                active ? "bg-white/[0.08] text-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {badge && (
                <span className="absolute -right-1 -top-1 rounded bg-[#D40019]/20 px-1 text-[9px] font-semibold leading-tight text-[#FF5A6E]">
                  {badge}
                </span>
              )}
            </span>
          ))}
        </nav>

        {/* Main column */}
        <div className="min-w-0 flex-1 p-3.5 sm:p-4">
          {/* Query bar */}
          <div className="mb-3.5 flex items-center gap-2 rounded-md border border-white/[0.07] bg-black/40 px-3 py-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <span className="truncate font-mono text-[11px] text-muted-foreground">
              entity:sarah.chen severity:&gt;=high last:24h
            </span>
          </div>

          {/* Stat row */}
          <div className="mb-3.5 grid grid-cols-2 gap-2">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-md border border-white/[0.06] bg-white/[0.02] p-2.5"
              >
                <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
                  {s.label}
                </p>
                <p className="mt-1 font-heading text-base font-bold text-[#FFFFFF]">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Alert queue */}
          <div className="space-y-2">
            {alerts.map((a) => (
              <div
                key={a.id}
                className="rounded-md border border-white/[0.06] bg-white/[0.02] p-2.5"
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span
                    className={`rounded border px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider ${severityStyles[a.severity]}`}
                  >
                    {a.severity}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/70">{a.id}</span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground/70">
                    {a.age}
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] font-medium leading-snug text-foreground">
                  {a.title}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{a.source}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evidence / response panel */}
      <aside
        aria-hidden="true"
        className="grid gap-4 border-t border-white/[0.06] bg-[#080808] p-4 sm:grid-cols-2"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
            Linked evidence
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Session token reused from a new ASN within 6 minutes of an MFA prompt storm.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {["T1078", "T1110.003", "T1621"].map((t) => (
              <span
                key={t}
                className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-px font-mono text-[10px] text-[#BDC4C6]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
            Suggested response
          </p>
          <ul className="mt-2 space-y-1.5">
            {["Revoke active sessions", "Quarantine host WIN-4821", "Page on-call analyst"].map(
              (r) => (
                <li key={r} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#BDC4C6]" />
                  <span>{r}</span>
                </li>
              ),
            )}
          </ul>
          <p className="mt-3 font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">
            Awaiting analyst approval
          </p>
        </div>
      </aside>
    </motion.div>
  );
};

export default ThreatLensConsole;
