import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ADMIN_PASSWORD_HINT,
  validateAdminPassword,
} from "@/lib/adminPasswordPolicy";
import logo from "@/assets/clickbox-logo.jpeg";

const AdminResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({});

  const blockClipboard = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const validation = validateAdminPassword(password);
    if (!validation.valid) {
      setFieldErrors({
        password: `Password must include: ${validation.errors.join(", ")}.`,
      });
      return;
    }

    if (password !== confirm) {
      setFieldErrors({ confirm: "Passwords do not match." });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      toast.error("Password update failed", { description: error.message });
      return;
    }

    toast.success("Password updated", {
      description: "Your admin password has been reset. Please sign in again.",
    });
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  const inputClass = (field: keyof typeof fieldErrors) =>
    `w-full rounded-lg border bg-background/60 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ${
      fieldErrors[field]
        ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/30"
        : "border-white/10 focus:border-primary/50 focus:ring-primary/30"
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(0_0%_3%)] px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.10),transparent_60%)]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <img
            src={logo}
            alt="ClickBox"
            className="h-14 w-14 rounded-xl object-cover ring-2 ring-primary/20"
          />
          <div>
            <p className="font-heading text-xl font-bold text-foreground">Set New Password</p>
            <p className="text-xs text-muted-foreground">Choose a strong password for your admin account</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="glass-card space-y-5 p-8" noValidate>
          <p className="text-xs text-muted-foreground">{ADMIN_PASSWORD_HINT}</p>

          <div>
            <label
              htmlFor="new-password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              New password
            </label>
            <input
              id="new-password"
              type="password"
              required
              autoComplete="new-password"
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onCopy={blockClipboard}
              onCut={blockClipboard}
              onPaste={blockClipboard}
              className={inputClass("password")}
            />
            {fieldErrors.password && (
              <p className="mt-1.5 text-xs text-red-400" role="alert">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              autoComplete="new-password"
              maxLength={128}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onCopy={blockClipboard}
              onCut={blockClipboard}
              onPaste={blockClipboard}
              className={inputClass("confirm")}
            />
            {fieldErrors.confirm && (
              <p className="mt-1.5 text-xs text-red-400" role="alert">
                {fieldErrors.confirm}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {submitting ? "Updating…" : "Update password"}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            <Link to="/admin/login" className="text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminResetPassword;
