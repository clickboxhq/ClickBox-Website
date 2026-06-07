import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  Download,
  ExternalLink,
  FileText,
  History,
  Inbox,
  Loader2,
  LogOut,
  Mail,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  TrendingUp,
  Users,
  X,
  XCircle,
  BarChart3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { isUrlLike, toClickableHref } from "@/lib/urlValidation";
import logo from "@/assets/clickbox-logo.jpeg";

// ─── Types ──────────────────────────────────────────────────────────────────

type Section = "overview" | "fellowship" | "product" | "contact" | "audit";

type TableKey = "fellowship" | "product" | "contact";

const TABLE_MAP: Record<TableKey, string> = {
  fellowship: "fellowship_applications",
  product: "product_inquiries",
  contact: "contact_submissions",
};

type Row = Record<string, unknown> & {
  id: string;
  created_at: string;
  status?: string | null;
  notes?: string | null;
};

type AuditRow = {
  id: string;
  actor_id: string | null;
  action: string;
  target_table: string;
  target_id: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
};

const ALL_STATUSES = ["all", "new", "reviewed", "contacted", "shortlisted", "rejected"] as const;
type StatusFilter = (typeof ALL_STATUSES)[number];

// ─── Constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 25;

const STATUS_META: Record<
  string,
  { label: string; dot: string; badge: string }
> = {
  new: {
    label: "New",
    dot: "bg-blue-400",
    badge:
      "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/25",
  },
  reviewed: {
    label: "Reviewed",
    dot: "bg-violet-400",
    badge:
      "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/25",
  },
  contacted: {
    label: "Contacted",
    dot: "bg-orange-400",
    badge:
      "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/25",
  },
  shortlisted: {
    label: "Shortlisted",
    dot: "bg-emerald-400",
    badge:
      "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/25",
  },
  rejected: {
    label: "Rejected",
    dot: "bg-red-400",
    badge: "bg-red-500/10 text-red-400 ring-1 ring-red-500/25",
  },
};

const getStatus = (s?: string | null) =>
  STATUS_META[s ?? "new"] ?? STATUS_META.new;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtDate = (iso?: string | null, opts?: { short?: boolean }) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: opts?.short ? "short" : "medium",
    timeStyle: "short",
  });
};

const fmtRelative = (iso?: string | null) => {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

const toCsv = (rows: Row[]) => {
  if (rows.length === 0) return "";
  const keys = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s =
      v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  return [
    keys.join(","),
    ...rows.map((r) => keys.map((k) => esc(r[k])).join(",")),
  ].join("\n");
};

const downloadBlob = (content: string, filename: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const FIELD_LABELS: Record<string, string> = {
  full_name: "Full Name",
  email: "Email",
  linkedin: "LinkedIn",
  resume_url: "Resume",
  preferred_pathway: "Pathway",
  certifications: "Certifications",
  certification_links: "Cert Links",
  relevant_experience: "Experience",
  motivation: "Motivation",
  portfolio: "Portfolio",
  name: "Name",
  phone: "Phone",
  company: "Company",
  subject: "Subject",
  message: "Message",
  product_interest: "Product Interest",
  id: "ID",
  created_at: "Submitted",
  reviewed_at: "Reviewed",
  contacted_at: "Contacted",
  shortlisted_at: "Shortlisted",
  status: "Status",
};

const labelFor = (k: string) => FIELD_LABELS[k] ?? k.replace(/_/g, " ");

// ─── Sub-components ──────────────────────────────────────────────────────────

const StatusBadge = ({
  status,
  size = "sm",
}: {
  status?: string | null;
  size?: "xs" | "sm";
}) => {
  const meta = getStatus(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wider ${
        size === "xs"
          ? "px-2 py-0.5 text-[10px]"
          : "px-2.5 py-1 text-[11px]"
      } ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  sub?: string;
  accent?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card group flex flex-col gap-3 p-5 transition-all duration-300 hover:border-primary/30"
  >
    <div className="flex items-center justify-between">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          accent ?? "bg-primary/10"
        } ring-1 ring-white/10`}
      >
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <TrendingUp className="h-3.5 w-3.5 text-muted-foreground/40 transition group-hover:text-primary/50" />
    </div>
    <div>
      <p className="font-heading text-2xl font-bold tabular-nums text-foreground">
        {value.toLocaleString()}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      {sub && (
        <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground/60">
          {sub}
        </p>
      )}
    </div>
  </motion.div>
);

const FieldValue = ({ field, value }: { field: string; value: unknown }) => {
  if (value === null || value === undefined || value === "") return <>—</>;

  if (field.endsWith("_at") || field === "created_at")
    return <>{fmtDate(String(value))}</>;

  if (field === "status") return <StatusBadge status={String(value)} />;

  const text = String(value);

  if (field === "resume_url") {
    if (isUrlLike(text))
      return (
        <a
          href={toClickableHref(text)}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1 break-all text-primary hover:underline"
        >
          View Resume
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      );
    return <>{text}</>;
  }

  if (field === "certification_links") {
    const lines = text.split(/\r?\n/).filter(Boolean);
    return (
      <span className="space-y-1">
        {lines.map((line, i) => (
          <span key={i} className="block">
            {isUrlLike(line) ? (
              <a
                href={toClickableHref(line)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 break-all text-primary hover:underline"
              >
                {line} <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            ) : (
              line
            )}
          </span>
        ))}
      </span>
    );
  }

  if (isUrlLike(text))
    return (
      <a
        href={toClickableHref(text)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 break-all text-primary hover:underline"
      >
        {text} <ExternalLink className="h-3 w-3 shrink-0" />
      </a>
    );

  return <>{text}</>;
};

// ─── Detail Drawer ───────────────────────────────────────────────────────────

const DISPLAY_FIELD_ORDER: Record<TableKey, string[]> = {
  fellowship: [
    "full_name", "email", "linkedin", "preferred_pathway", "resume_url",
    "certifications", "certification_links", "relevant_experience",
    "motivation", "portfolio", "status", "created_at", "reviewed_at",
    "contacted_at", "shortlisted_at", "id",
  ],
  product: [
    "name", "email", "company", "product_interest", "message",
    "status", "created_at", "reviewed_at", "contacted_at", "id",
  ],
  contact: [
    "name", "email", "phone", "company", "subject", "message",
    "status", "created_at", "reviewed_at", "contacted_at", "id",
  ],
};

const STATUS_ACTIONS: {
  value: string;
  label: string;
  icon: typeof Clock;
}[] = [
  { value: "reviewed",   label: "Mark reviewed",  icon: Clock },
  { value: "contacted",  label: "Mark contacted",  icon: Mail },
  { value: "shortlisted",label: "Shortlist",       icon: Star },
  { value: "rejected",   label: "Reject",          icon: XCircle },
  { value: "new",        label: "Reset to new",    icon: CheckCircle2 },
];

type DetailDrawerProps = {
  row: Row;
  tableKey: TableKey;
  onClose: () => void;
  onStatusChange: (row: Row, status: string) => Promise<void>;
  onSaveNotes: (row: Row, notes: string) => Promise<void>;
  onDelete: (row: Row) => Promise<void>;
};

const DetailDrawer = ({
  row,
  tableKey,
  onClose,
  onStatusChange,
  onSaveNotes,
  onDelete,
}: DetailDrawerProps) => {
  const [notes, setNotes] = useState(String(row.notes ?? ""));
  const [saving, setSaving] = useState(false);

  const fieldOrder = DISPLAY_FIELD_ORDER[tableKey];
  const orderedEntries = fieldOrder
    .filter((k) => Object.prototype.hasOwnProperty.call(row, k))
    .map((k) => [k, row[k]] as [string, unknown]);

  const handleSave = async () => {
    setSaving(true);
    await onSaveNotes(row, notes);
    setSaving(false);
  };

  const primary =
    (row.full_name as string) ?? (row.name as string) ?? "Submission";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-hidden border-l border-white/8 bg-[hsl(0_0%_5%)]"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-white/8 px-6 py-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <StatusBadge status={row.status as string} />
              <span className="text-xs text-muted-foreground">{fmtDate(row.created_at, { short: true })}</span>
            </div>
            <h2 className="mt-2 font-heading text-xl font-semibold text-foreground truncate">
              {primary}
            </h2>
            {(row.email as string) && (
              <p className="text-sm text-muted-foreground">{String(row.email)}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status actions */}
          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Update Status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUS_ACTIONS.map(({ value, label, icon: Icon }) => {
                const active = (row.status ?? "new") === value;
                return (
                  <button
                    key={value}
                    onClick={() => void onStatusChange(row, value)}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? `border-transparent ${getStatus(value).badge}`
                        : "border-white/8 bg-white/[0.03] text-muted-foreground hover:border-white/15 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Field details */}
          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Submission Details
            </p>
            <div className="space-y-0 rounded-xl border border-white/8 bg-white/[0.02] divide-y divide-white/5">
              {orderedEntries.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[130px_1fr] gap-4 px-4 py-3">
                  <dt className="flex items-start pt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                    {labelFor(k)}
                  </dt>
                  <dd className="break-words text-sm text-foreground/90">
                    <FieldValue field={k} value={v} />
                  </dd>
                </div>
              ))}
            </div>
          </section>

          {/* Notes */}
          <section>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Internal Notes
            </p>
            <textarea
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes for your team…"
              className="w-full resize-none rounded-lg border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
            <button
              onClick={() => void handleSave()}
              disabled={saving}
              className="mt-2 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save notes
            </button>
          </section>

          {/* Danger zone */}
          <section className="rounded-xl border border-red-500/15 bg-red-500/[0.03] p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-red-400/70">
              Danger Zone
            </p>
            <button
              onClick={() => void onDelete(row)}
              className="inline-flex items-center gap-2 rounded-md border border-red-500/25 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete submission permanently
            </button>
          </section>
        </div>
      </motion.aside>
    </div>
  );
};

// ─── Submissions Table View ──────────────────────────────────────────────────

type SubmissionsViewProps = {
  tableKey: TableKey;
  title: string;
  icon: typeof Users;
  adminId: string | undefined;
};

const SubmissionsView = ({
  tableKey,
  title,
  icon: Icon,
  adminId,
}: SubmissionsViewProps) => {
  const tableName = TABLE_MAP[tableKey];
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Row | null>(null);
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  const writeAudit = useCallback(
    async (action: string, targetId: string, payload: Record<string, unknown>) => {
      await supabase.from("admin_audit_log").insert({
        actor_id: adminId,
        action,
        target_table: tableName,
        target_id: targetId,
        payload,
      } as never);
    },
    [adminId, tableName],
  );

  useEffect(() => {
    setLoading(true);
    setPage(0);
    supabase
      .from(tableName as never)
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error("Failed to load data", { description: error.message });
        setRows((data as Row[]) ?? []);
        setLoading(false);
      });
  }, [tableName]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((r) => {
      if (statusFilter !== "all" && (r.status ?? "new") !== statusFilter) return false;
      if (!q) return true;
      return Object.values(r).some((v) =>
        v == null ? false : String(v).toLowerCase().includes(q),
      );
    });
    if (sortDir === "asc") list = [...list].reverse();
    return list;
  }, [rows, query, statusFilter, sortDir]);

  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const handleStatusChange = async (row: Row, next: string) => {
    const updates: Record<string, unknown> = { status: next };
    if (next === "reviewed") updates.reviewed_at = new Date().toISOString();
    if (next === "contacted") updates.contacted_at = new Date().toISOString();
    if (next === "shortlisted") updates.shortlisted_at = new Date().toISOString();
    if (next === "rejected") updates.rejected_at = new Date().toISOString();

    const { error } = await supabase
      .from(tableName as never)
      .update(updates as never)
      .eq("id", row.id);

    if (error) return toast.error("Update failed", { description: error.message });
    await writeAudit("status_change", row.id, { from: row.status ?? "new", to: next });

    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, ...updates } : r)));
    setSelected((s) => (s?.id === row.id ? { ...s, ...updates } : s));
    const meta = getStatus(next);
    toast.success(`Marked as ${meta.label}`);
  };

  const handleSaveNotes = async (row: Row, notes: string) => {
    const { error } = await supabase
      .from(tableName as never)
      .update({ notes } as never)
      .eq("id", row.id);
    if (error) return toast.error("Save failed", { description: error.message });
    await writeAudit("notes_update", row.id, {});
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, notes } : r)));
    setSelected((s) => (s?.id === row.id ? { ...s, notes } : s));
    toast.success("Notes saved");
  };

  const handleDelete = async (row: Row) => {
    if (!confirm("Permanently delete this submission? This cannot be undone.")) return;
    const { error } = await supabase.from(tableName as never).delete().eq("id", row.id);
    if (error) return toast.error("Delete failed", { description: error.message });
    await writeAudit("delete", row.id, { snapshot: row });
    setRows((rs) => rs.filter((r) => r.id !== row.id));
    setSelected(null);
    toast.success("Submission deleted");
  };

  const exportCsv = () => {
    const csv = toCsv(filtered);
    downloadBlob(
      csv,
      `clickbox-${tableKey}-${new Date().toISOString().slice(0, 10)}.csv`,
      "text/csv;charset=utf-8",
    );
  };

  const getPrimary = (r: Row) => {
    if (tableKey === "fellowship") return String(r.full_name ?? "");
    return String(r.name ?? "");
  };

  const getSecondary = (r: Row) => {
    if (tableKey === "fellowship") return String(r.preferred_pathway ?? "");
    if (tableKey === "product") return String(r.company ?? "");
    return String(r.subject ?? "");
  };

  const getTertiary = (r: Row) => String(r.email ?? "");

  const statusCounts = useMemo(
    () =>
      Object.fromEntries(
        ["new", "reviewed", "contacted", "shortlisted", "rejected"].map((s) => [
          s,
          rows.filter((r) => (r.status ?? "new") === s).length,
        ]),
      ),
    [rows],
  );

  return (
    <div className="flex h-full flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-white/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-semibold text-foreground">
              {title}
            </h1>
            <p className="text-xs text-muted-foreground">
              {rows.length} total · {statusCounts.new ?? 0} new
            </p>
          </div>
        </div>
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-xs font-medium text-foreground hover:bg-white/[0.06] transition"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      {/* Status quick-filters */}
      <div className="flex flex-wrap items-center gap-2">
        {ALL_STATUSES.map((s) => {
          const active = statusFilter === s;
          const count = s === "all" ? rows.length : (statusCounts[s] ?? 0);
          const meta = s === "all" ? null : getStatus(s);
          return (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(0); }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
                active
                  ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {meta && (
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
              )}
              {s === "all" ? "All" : meta?.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${active ? "bg-primary/20" : "bg-white/8"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search + sort bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            placeholder="Search submissions…"
            className="w-full rounded-lg border border-white/8 bg-white/[0.03] py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
          className="inline-flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition"
          aria-label="Toggle sort direction"
        >
          <Clock className="h-3.5 w-3.5" />
          {sortDir === "desc" ? "Newest first" : "Oldest first"}
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden rounded-xl border border-white/8 bg-white/[0.02]">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : pageRows.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3 text-muted-foreground">
            <ClipboardList className="h-8 w-8 opacity-30" />
            <p className="text-sm">No submissions match your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-left">
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Applicant
                  </th>
                  <th className="hidden px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 md:table-cell">
                    Details
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Status
                  </th>
                  <th className="hidden px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 lg:table-cell">
                    Submitted
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pageRows.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="group cursor-pointer transition-colors hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{getPrimary(r)}</p>
                      <p className="text-xs text-muted-foreground">{getTertiary(r)}</p>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {getSecondary(r)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status as string} size="xs" />
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">
                      {fmtRelative(r.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); void handleDelete(r); }}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground/50 hover:text-red-400 transition"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {page * PAGE_SIZE + 1}–
            {Math.min((page + 1) * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/8 disabled:opacity-30 hover:bg-white/5 transition"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="tabular-nums">
              {page + 1} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/8 disabled:opacity-30 hover:bg-white/5 transition"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <DetailDrawer
            key={selected.id}
            row={selected}
            tableKey={tableKey}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
            onSaveNotes={handleSaveNotes}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Overview Section ────────────────────────────────────────────────────────

type AllCounts = {
  total: number;
  new: number;
  reviewed: number;
  contacted: number;
  shortlisted: number;
  rejected: number;
};

const OverviewSection = ({ adminEmail }: { adminEmail?: string }) => {
  const [counts, setCounts] = useState<AllCounts>({
    total: 0, new: 0, reviewed: 0, contacted: 0, shortlisted: 0, rejected: 0,
  });
  const [recent, setRecent] = useState<(Row & { _table: TableKey })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tables: TableKey[] = ["fellowship", "product", "contact"];
    Promise.all(
      tables.map((t) =>
        supabase
          .from(TABLE_MAP[t] as never)
          .select("id, created_at, status, full_name, name, email, preferred_pathway, company, subject")
          .order("created_at", { ascending: false })
          .limit(50)
          .then(({ data }) =>
            ((data as Row[]) ?? []).map((r) => ({ ...r, _table: t })),
          ),
      ),
    ).then((results) => {
      const all = results.flat() as (Row & { _table: TableKey })[];
      const totals: AllCounts = {
        total: all.length,
        new: all.filter((r) => (r.status ?? "new") === "new").length,
        reviewed: all.filter((r) => r.status === "reviewed").length,
        contacted: all.filter((r) => r.status === "contacted").length,
        shortlisted: all.filter((r) => r.status === "shortlisted").length,
        rejected: all.filter((r) => r.status === "rejected").length,
      };
      setCounts(totals);
      setRecent(
        all
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(0, 8),
      );
      setLoading(false);
    });
  }, []);

  const STAT_CARDS = [
    { icon: BarChart3, label: "Total Submissions", value: counts.total, sub: "All time" },
    { icon: AlertCircle, label: "New — Pending Review", value: counts.new, sub: "Requires action", accent: "bg-blue-500/10" },
    { icon: Clock, label: "Reviewed", value: counts.reviewed, sub: "In progress", accent: "bg-violet-500/10" },
    { icon: Mail, label: "Contacted", value: counts.contacted, sub: "Engaged", accent: "bg-orange-500/10" },
    { icon: Star, label: "Shortlisted", value: counts.shortlisted, sub: "High priority", accent: "bg-emerald-500/10" },
    { icon: XCircle, label: "Rejected", value: counts.rejected, sub: "Closed", accent: "bg-red-500/10" },
  ];

  const TABLE_LABELS: Record<TableKey, string> = {
    fellowship: "Fellowship",
    product: "Product Inquiry",
    contact: "Contact",
  };

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Platform Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as{" "}
            <span className="font-medium text-foreground/80">{adminEmail}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/8 px-3 py-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">System Online</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="mb-4 font-heading text-base font-semibold text-foreground">
          Recent Submissions
        </h2>
        <div className="rounded-xl border border-white/8 overflow-hidden">
          {recent.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No submissions yet.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Name</th>
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 md:table-cell">Type</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Status</th>
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 lg:table-cell">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recent.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">
                        {String(r.full_name ?? r.name ?? "—")}
                      </p>
                      <p className="text-xs text-muted-foreground">{String(r.email ?? "")}</p>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {TABLE_LABELS[r._table]}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status as string} size="xs" />
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">
                      {fmtRelative(r.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Audit Log Section ───────────────────────────────────────────────────────

const AuditLogSection = () => {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("admin_audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (error) toast.error("Failed to load audit log", { description: error.message });
        setRows((data as AuditRow[]) ?? []);
        setLoading(false);
      });
  }, []);

  const ACTION_META: Record<string, { label: string; icon: typeof Activity; color: string }> = {
    status_change: { label: "Status changed", icon: Activity, color: "text-blue-400" },
    notes_update:  { label: "Notes updated",  icon: FileText, color: "text-violet-400" },
    delete:        { label: "Submission deleted", icon: Trash2, color: "text-red-400" },
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-white/10">
          <History className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-semibold text-foreground">
            Audit Log
          </h1>
          <p className="text-xs text-muted-foreground">
            All admin actions — last 100 events
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/8 overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
            No audit events recorded yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Action</th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 md:table-cell">Table</th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 lg:table-cell">Details</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((r) => {
                const meta = ACTION_META[r.action] ?? {
                  label: r.action,
                  icon: Activity,
                  color: "text-muted-foreground",
                };
                const ActionIcon = meta.icon;
                return (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-2 font-medium ${meta.color}`}>
                        <ActionIcon className="h-3.5 w-3.5" />
                        {meta.label}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                      {r.target_table?.replace(/_/g, " ")}
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      {r.payload && r.action === "status_change" ? (
                        <span className="text-xs text-muted-foreground">
                          {String((r.payload as Record<string, unknown>).from ?? "")} →{" "}
                          <StatusBadge
                            status={String((r.payload as Record<string, unknown>).to ?? "")}
                            size="xs"
                          />
                        </span>
                      ) : r.target_id ? (
                        <span className="font-mono text-[10px] text-muted-foreground/60">
                          {r.target_id.slice(0, 8)}…
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {fmtRelative(r.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ─── Session Timer ───────────────────────────────────────────────────────────

const IDLE_MS = 30 * 60 * 1000;

const SessionTimer = () => {
  const [remaining, setRemaining] = useState(IDLE_MS);
  const resetAt = useRef(Date.now());

  useEffect(() => {
    const bump = () => { resetAt.current = Date.now(); };
    const events = ["mousedown", "keydown", "touchstart", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));

    const tick = setInterval(() => {
      setRemaining(Math.max(0, IDLE_MS - (Date.now() - resetAt.current)));
    }, 1_000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      clearInterval(tick);
    };
  }, []);

  const mins = Math.floor(remaining / 60_000);
  const secs = Math.floor((remaining % 60_000) / 1_000);
  const warning = remaining < 5 * 60_000;

  return (
    <span
      title="Session time remaining"
      className={`hidden items-center gap-1.5 text-xs tabular-nums sm:flex ${
        warning ? "animate-pulse text-orange-400" : "text-muted-foreground/55"
      }`}
    >
      <Clock className="h-3 w-3 shrink-0" />
      {mins}:{secs.toString().padStart(2, "0")}
    </span>
  );
};

// ─── Main Dashboard ──────────────────────────────────────────────────────────

const NAV_ITEMS: {
  id: Section;
  label: string;
  icon: typeof Users;
  badge?: string;
}[] = [
  { id: "overview",   label: "Overview",       icon: BarChart3 },
  { id: "fellowship", label: "Fellowship",      icon: Users },
  { id: "product",    label: "Product Inquiries", icon: Briefcase },
  { id: "contact",    label: "Contact Requests", icon: Inbox },
  { id: "audit",      label: "Audit Log",       icon: History },
];

const AdminDashboard = () => {
  const { signOut, user } = useAuth();
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const handleNav = (id: Section) => {
    setSection(id);
    setSidebarOpen(false);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex min-h-screen bg-[hsl(0_0%_3%)]">
      {/* ── Sidebar ── */}
      <>
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-white/6 bg-[hsl(0_0%_4%)] transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-white/6 px-5 py-5">
            <img
              src={logo}
              alt="ClickBox"
              className="h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ring-primary/25 shadow-sm shadow-primary/10"
            />
            <div className="min-w-0">
              <p className="font-heading text-sm font-bold text-foreground leading-none">
                ClickBox
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                Admin Portal
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = section === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNav(id)}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition ${
                      active ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground/70"
                    }`}
                  />
                  {label}
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User + logout */}
          <div className="border-t border-white/6 p-4">
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary uppercase ring-1 ring-primary/20">
                {(user?.email?.[0] ?? "A").toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">
                  {user?.email ?? "Admin"}
                </p>
                <p className="text-[10px] text-muted-foreground">Administrator</p>
              </div>
            </div>
            <button
              onClick={() => void signOut()}
              className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/[0.04] hover:text-foreground transition"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign out
            </button>
            <Link
              to="/"
              className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-muted-foreground/60 hover:text-muted-foreground transition"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              View website
            </Link>
          </div>
        </aside>
      </>

      {/* ── Main column ── */}
      <div className="flex min-w-0 flex-1 flex-col lg:ml-60">
        {/* Top bar */}
        <header
          ref={topRef}
          className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-white/6 bg-[hsl(0_0%_3%)]/90 px-5 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            <span className="font-heading text-sm font-semibold text-foreground capitalize">
              {NAV_ITEMS.find((n) => n.id === section)?.label ?? "Admin"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <SessionTimer />
            <div className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 md:flex">
              <img
                src={logo}
                alt="ClickBox"
                className="h-5 w-5 rounded-md object-cover ring-1 ring-primary/20"
              />
              <span className="text-xs font-medium text-muted-foreground">
                {user?.email}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {section === "overview" && <OverviewSection adminEmail={user?.email} />}
              {section === "fellowship" && (
                <SubmissionsView
                  tableKey="fellowship"
                  title="Fellowship Applications"
                  icon={Users}
                  adminId={user?.id}
                />
              )}
              {section === "product" && (
                <SubmissionsView
                  tableKey="product"
                  title="Product Inquiries"
                  icon={Briefcase}
                  adminId={user?.id}
                />
              )}
              {section === "contact" && (
                <SubmissionsView
                  tableKey="contact"
                  title="Contact Requests"
                  icon={Inbox}
                  adminId={user?.id}
                />
              )}
              {section === "audit" && <AuditLogSection />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
