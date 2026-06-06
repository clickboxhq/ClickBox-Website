import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Inbox,
  Users,
  Briefcase,
  LogOut,
  Search,
  Download,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  Star,
  Mail,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { isUrlLike, toClickableHref } from "@/lib/urlValidation";
import logo from "@/assets/clickbox-logo.jpeg";

type TabKey = "fellowship" | "product" | "contact";

const TABS: { key: TabKey; label: string; icon: typeof Users; table: string }[] = [
  { key: "fellowship", label: "Fellowship", icon: Users, table: "fellowship_applications" },
  { key: "product", label: "Product", icon: Briefcase, table: "product_inquiries" },
  { key: "contact", label: "Contact", icon: Inbox, table: "contact_submissions" },
];

const STATUSES = ["all", "new", "reviewed", "contacted", "shortlisted"] as const;
type StatusFilter = (typeof STATUSES)[number];

type Row = Record<string, unknown> & {
  id: string;
  created_at: string;
  status?: string | null;
  notes?: string | null;
};

const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "—";

const renderFieldValue = (key: string, value: unknown) => {
  if (value === null || value === undefined || value === "") return "—";
  if (key.endsWith("_at") || key === "created_at") return fmtDate(String(value));

  const text = String(value);

  if (key === "certification_links") {
    const lines = text.split(/\r?\n/).filter(Boolean);
    return (
      <span className="space-y-1">
        {lines.map((line, index) => (
          <span key={`${line}-${index}`} className="block">
            {isUrlLike(line) ? (
              <a
                href={toClickableHref(line)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {line}
              </a>
            ) : (
              line
            )}
          </span>
        ))}
      </span>
    );
  }

  if (isUrlLike(text)) {
    return (
      <a
        href={toClickableHref(text)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline break-all"
      >
        {text}
      </a>
    );
  }

  return text;
};

const statusBadge = (s?: string | null) => {
  const base = "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider";
  switch (s) {
    case "shortlisted":
      return `${base} bg-primary/15 text-primary ring-1 ring-primary/30`;
    case "contacted":
      return `${base} bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30`;
    case "reviewed":
      return `${base} bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30`;
    default:
      return `${base} bg-secondary text-muted-foreground ring-1 ring-white/10`;
  }
};

const toCsv = (rows: Row[]) => {
  if (rows.length === 0) return "";
  const keys = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  return [keys.join(","), ...rows.map((r) => keys.map((k) => escape(r[k])).join(","))].join("\n");
};

const PAGE_SIZE = 20;

const AdminDashboard = () => {
  const { signOut, user } = useAuth();
  const [tab, setTab] = useState<TabKey>("fellowship");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Row | null>(null);
  const [drawerNotes, setDrawerNotes] = useState("");
  const [drawerSaving, setDrawerSaving] = useState(false);

  const activeTable = TABS.find((t) => t.key === tab)!.table;

  useEffect(() => {
    setPage(0);
    setSelected(null);
    setLoading(true);
    supabase
      .from(activeTable as never)
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error("Failed to load", { description: error.message });
        setRows((data as Row[]) || []);
        setLoading(false);
      });
  }, [activeTable]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (status !== "all" && (r.status ?? "new") !== status) return false;
      if (!q) return true;
      return Object.values(r).some((v) =>
        v === null || v === undefined ? false : String(v).toLowerCase().includes(q),
      );
    });
  }, [rows, query, status]);

  const pageRows = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const writeAudit = async (action: string, target_id: string, payload: Record<string, unknown>) => {
    await supabase.from("admin_audit_log").insert({
      actor_id: user?.id,
      action,
      target_table: activeTable,
      target_id,
      payload,
    } as never);
  };

  const setStatusOn = async (row: Row, next: string) => {
    const updates: Record<string, unknown> = { status: next };
    if (next === "reviewed") updates.reviewed_at = new Date().toISOString();
    if (next === "contacted") updates.contacted_at = new Date().toISOString();
    if (next === "shortlisted") updates.shortlisted_at = new Date().toISOString();

    const { error } = await supabase.from(activeTable as never).update(updates as never).eq("id", row.id);
    if (error) return toast.error("Update failed", { description: error.message });
    await writeAudit("status_change", row.id, { from: row.status ?? "new", to: next });
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, ...updates } : r)));
    if (selected?.id === row.id) setSelected({ ...row, ...updates });
    toast.success(`Marked as ${next}`);
  };

  const saveNotes = async () => {
    if (!selected) return;
    setDrawerSaving(true);
    const { error } = await supabase
      .from(activeTable as never)
      .update({ notes: drawerNotes } as never)
      .eq("id", selected.id);
    setDrawerSaving(false);
    if (error) return toast.error("Save failed", { description: error.message });
    await writeAudit("notes_update", selected.id, {});
    setRows((rs) => rs.map((r) => (r.id === selected.id ? { ...r, notes: drawerNotes } : r)));
    toast.success("Notes saved");
  };

  const deleteRow = async (row: Row) => {
    if (!confirm("Delete this submission permanently? This cannot be undone.")) return;
    const { error } = await supabase.from(activeTable as never).delete().eq("id", row.id);
    if (error) return toast.error("Delete failed", { description: error.message });
    await writeAudit("delete", row.id, { snapshot: row });
    setRows((rs) => rs.filter((r) => r.id !== row.id));
    if (selected?.id === row.id) setSelected(null);
    toast.success("Submission deleted");
  };

  const exportCsv = () => {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clickbox-${tab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderSummary = (r: Row): { primary: string; secondary: string } => {
    if (tab === "fellowship")
      return { primary: String(r.full_name ?? ""), secondary: String(r.preferred_pathway ?? "") };
    if (tab === "product")
      return { primary: String(r.name ?? ""), secondary: String(r.company ?? "") };
    return { primary: String(r.name ?? ""), secondary: String(r.subject ?? "") };
  };

  const openDrawer = (r: Row) => {
    setSelected(r);
    setDrawerNotes(String(r.notes ?? ""));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/admin" className="flex items-center gap-3">
            <img src={logo} alt="ClickBox" className="h-9 w-9 rounded-md object-cover ring-1 ring-white/10" />
            <div>
              <p className="font-heading text-sm font-semibold text-foreground">ClickBox Admin</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Submissions portal
              </p>
            </div>
          </Link>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-secondary/80 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </aside>

        {/* Main */}
        <main className="space-y-4">
          <div className="glass-card flex flex-wrap items-center gap-3 p-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
                placeholder="Search by any field…"
                className="w-full rounded-md border border-white/10 bg-background/50 py-2 pl-9 pr-3 text-sm focus:border-primary/50 focus:outline-none"
              />
            </div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as StatusFilter);
                setPage(0);
              }}
              className="rounded-md border border-white/10 bg-background/50 px-3 py-2 text-sm capitalize focus:border-primary/50 focus:outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All statuses" : s}
                </option>
              ))}
            </select>
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-secondary/80 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>

          <div className="glass-card overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center p-16">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : pageRows.length === 0 ? (
              <div className="p-16 text-center text-sm text-muted-foreground">
                No submissions match your filters.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b border-white/10 bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Detail</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((r) => {
                    const s = renderSummary(r);
                    return (
                      <tr
                        key={r.id}
                        onClick={() => openDrawer(r)}
                        className="cursor-pointer border-b border-white/5 transition hover:bg-secondary/40"
                      >
                        <td className="px-4 py-3 font-medium text-foreground">{s.primary}</td>
                        <td className="px-4 py-3 text-muted-foreground">{s.secondary}</td>
                        <td className="px-4 py-3">
                          <span className={statusBadge(r.status as string)}>{(r.status as string) ?? "new"}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{fmtDate(r.created_at)}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRow(r);
                            }}
                            className="text-muted-foreground hover:text-red-400"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {filtered.length > PAGE_SIZE && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Page {page + 1} of {totalPages} · {filtered.length} total
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="rounded-md border border-white/10 px-3 py-1 disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  className="rounded-md border border-white/10 px-3 py-1 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-white/10 bg-background"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Submission</p>
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  {renderSummary(selected).primary}
                </h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* Status chips */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { v: "reviewed", label: "Mark reviewed", Icon: Clock },
                    { v: "contacted", label: "Mark contacted", Icon: Mail },
                    { v: "shortlisted", label: "Shortlist", Icon: Star },
                    { v: "new", label: "Reset", Icon: CheckCircle2 },
                  ].map(({ v, label, Icon }) => (
                    <button
                      key={v}
                      onClick={() => setStatusOn(selected, v)}
                      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition ${
                        (selected.status ?? "new") === v
                          ? "border-primary/40 bg-primary/15 text-primary"
                          : "border-white/10 bg-secondary/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" /> {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* All fields */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Details
                </p>
                <dl className="space-y-2 rounded-md border border-white/10 bg-secondary/20 p-4 text-sm">
                  {Object.entries(selected)
                    .filter(([k]) => !["notes", "updated_at"].includes(k))
                    .map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[140px_1fr] gap-3">
                        <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                          {k.replace(/_/g, " ")}
                        </dt>
                        <dd className="break-words text-foreground">{renderFieldValue(k, v)}</dd>
                      </div>
                    ))}
                </dl>
              </div>

              {/* Notes */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Internal notes
                </p>
                <textarea
                  rows={5}
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  placeholder="Add a note for the team…"
                  className="w-full rounded-md border border-white/10 bg-background/50 px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                />
                <button
                  onClick={saveNotes}
                  disabled={drawerSaving}
                  className="mt-2 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
                >
                  {drawerSaving && <Loader2 className="h-3 w-3 animate-spin" />}
                  Save notes
                </button>
              </div>

              <button
                onClick={() => deleteRow(selected)}
                className="inline-flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete submission
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
