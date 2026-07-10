import { motion } from "framer-motion";
import { AlertTriangle, Shield, Activity, Bug, Zap, Check, Clock, User, Server, Globe } from "lucide-react";

const bars = [40, 62, 48, 78, 55, 88, 70, 92, 66, 74, 58, 84];

export const PreviewDashboard = () => (
  <div className="flex h-full flex-col gap-3 text-[10px]">
    <div className="grid grid-cols-3 gap-2">
      {[
        { label: "Active Threats", value: "128", tone: "text-destructive" },
        { label: "Incidents", value: "42", tone: "text-yellow-400" },
        { label: "Resolved", value: "1.2k", tone: "text-primary" },
      ].map((s) => (
        <div key={s.label} className="rounded-md border border-white/10 bg-white/[0.03] p-2">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
          <p className={`font-heading text-lg font-bold ${s.tone}`}>{s.value}</p>
        </div>
      ))}
    </div>
    <div className="flex-1 rounded-md border border-white/10 bg-white/[0.03] p-2">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Threat Velocity · 24h</span>
        <span className="flex items-center gap-1 text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Live
        </span>
      </div>
      <div className="flex h-[calc(100%-14px)] items-end gap-1">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.03 }}
            className="flex-1 rounded-sm bg-gradient-to-t from-primary/70 to-primary/20"
          />
        ))}
      </div>
    </div>
  </div>
);

export const PreviewIncidents = () => {
  const rows = [
    { sev: "Critical", tone: "bg-destructive/20 text-destructive", title: "Ransomware behaviour on WKS-042", icon: Bug, time: "2m" },
    { sev: "High", tone: "bg-yellow-400/20 text-yellow-300", title: "Impossible travel · j.okafor", icon: User, time: "6m" },
    { sev: "Medium", tone: "bg-primary/20 text-primary", title: "Anomalous S3 exfiltration pattern", icon: Server, time: "14m" },
    { sev: "Low", tone: "bg-white/10 text-muted-foreground", title: "Brute force blocked · edge-gw-01", icon: Shield, time: "22m" },
    { sev: "High", tone: "bg-yellow-400/20 text-yellow-300", title: "Phishing cluster detected", icon: AlertTriangle, time: "31m" },
  ];
  return (
    <div className="flex h-full flex-col gap-1.5 text-[10px]">
      {rows.map((r, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
          className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5"
        >
          <r.icon className="h-3 w-3 shrink-0 text-primary" strokeWidth={2} />
          <span className={`rounded px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider ${r.tone}`}>
            {r.sev}
          </span>
          <span className="flex-1 truncate text-foreground/90">{r.title}</span>
          <span className="flex items-center gap-0.5 text-muted-foreground">
            <Clock className="h-2.5 w-2.5" /> {r.time}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export const PreviewGraph = () => {
  const nodes = [
    { x: 50, y: 50, r: 10, label: "User", color: "hsl(var(--primary))" },
    { x: 20, y: 25, r: 6, label: "IP", color: "#facc15" },
    { x: 82, y: 22, r: 6, label: "Host", color: "#f87171" },
    { x: 15, y: 78, r: 6, label: "File", color: "#a78bfa" },
    { x: 85, y: 75, r: 6, label: "Domain", color: "#60a5fa" },
    { x: 50, y: 90, r: 5, label: "Proc", color: "hsl(var(--primary))" },
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [2, 4], [1, 3],
  ];
  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="hsl(var(--primary) / 0.4)"
            strokeWidth={0.3}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
          >
            <circle cx={n.x} cy={n.y} r={n.r + 2} fill={n.color} opacity={0.15} />
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} opacity={0.9} />
            <text
              x={n.x}
              y={n.y + n.r + 3.5}
              textAnchor="middle"
              fontSize={3}
              fill="rgba(255,255,255,0.65)"
              fontFamily="sans-serif"
            >
              {n.label}
            </text>
          </motion.g>
        ))}
      </svg>
      <div className="absolute bottom-0 left-0 rounded-md border border-white/10 bg-black/40 px-2 py-1 text-[9px] text-muted-foreground backdrop-blur">
        <Globe className="mr-1 inline h-2.5 w-2.5 text-primary" /> 6 entities · 7 links
      </div>
    </div>
  );
};

export const PreviewPlaybook = () => {
  const steps = [
    { icon: AlertTriangle, label: "Alert triggered", status: "done" },
    { icon: Activity, label: "Enrich with threat intel", status: "done" },
    { icon: Shield, label: "Isolate endpoint", status: "done" },
    { icon: Zap, label: "Notify on-call analyst", status: "active" },
    { icon: Check, label: "Close incident", status: "pending" },
  ];
  return (
    <div className="flex h-full flex-col justify-between gap-2 text-[10px]">
      <div className="flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Playbook · Ransomware v2.4</span>
        <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[8px] font-semibold uppercase text-primary">Running</span>
      </div>
      <div className="flex-1 space-y-1.5">
        {steps.map((s, i) => {
          const done = s.status === "done";
          const active = s.status === "active";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className={`flex items-center gap-2 rounded-md border px-2 py-1.5 ${
                done
                  ? "border-primary/30 bg-primary/5"
                  : active
                    ? "border-yellow-400/40 bg-yellow-400/5"
                    : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  done ? "bg-primary text-primary-foreground" : active ? "bg-yellow-400/80 text-black" : "bg-white/10 text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : <s.icon className="h-2.5 w-2.5" />}
              </div>
              <span className="flex-1 text-foreground/90">{s.label}</span>
              {active && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-400" />}
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[9px] text-muted-foreground">
        <span>Elapsed 00:00:42</span>
        <span className="text-primary">3 / 5 steps</span>
      </div>
    </div>
  );
};
