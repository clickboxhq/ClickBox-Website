import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Loader2, ShieldCheck } from "lucide-react";
import { useAuth, isSignInRateLimited } from "@/hooks/useAuth";
import { toast } from "sonner";
import { sanitizeEmail } from "@/lib/inputSanitization";
import logo from "@/assets/clickbox-logo.jpeg";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [rateLimited, setRateLimited] = useState(isSignInRateLimited());

  useEffect(() => {
    setRateLimited(isSignInRateLimited());
  }, []);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate("/admin", { replace: true });
  }, [loading, user, isAdmin, navigate]);

  useEffect(() => {
    const reason = (location.state as { reason?: string } | null)?.reason;
    if (reason === "idle_timeout") {
      toast.info("Session expired", {
        description: "You were signed out automatically due to inactivity.",
      });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (isSignInRateLimited()) {
      setRateLimited(true);
      toast.error("Too many attempts", {
        description: "Please wait 15 minutes before trying again.",
      });
      return;
    }

    const safeEmail = sanitizeEmail(email);
    const errors: { email?: string; password?: string } = {};
    if (!safeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
      errors.email = "Please enter a valid email address";
    }
    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    const { error } = await signIn(safeEmail, password);
    setSubmitting(false);

    if (error) {
      setRateLimited(isSignInRateLimited());
      toast.error("Sign in failed", { description: error });
      return;
    }
    navigate("/admin", { replace: true });
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
        {/* Branding */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <img
            src={logo}
            alt="ClickBox"
            className="h-14 w-14 rounded-xl object-cover ring-2 ring-primary/20 shadow-lg shadow-primary/10"
          />
          <div>
            <p className="font-heading text-xl font-bold text-foreground">ClickBox Admin</p>
            <p className="text-xs text-muted-foreground">
              Restricted access — authorized personnel only
            </p>
          </div>
        </div>

        {rateLimited && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/8 p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <p className="text-sm text-red-300">
              Too many failed attempts. Please wait 15 minutes, or contact{" "}
              <a href="mailto:info@useclickbox.com" className="underline">
                info@useclickbox.com
              </a>
              .
            </p>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          className="glass-card space-y-5 p-8"
          noValidate
          autoComplete="on"
        >
          <div className="flex items-center gap-3 border-b border-white/8 pb-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-base font-semibold text-foreground">
                Sign in to your account
              </h1>
              <p className="text-xs text-muted-foreground">Enter your credentials to continue</p>
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={rateLimited}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "admin-email-error" : undefined}
              className={inputClass("email")}
            />
            {fieldErrors.email && (
              <p id="admin-email-error" className="mt-1.5 text-xs text-red-400" role="alert">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              minLength={6}
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={rateLimited}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? "admin-pw-error" : undefined}
              className={inputClass("password")}
            />
            {fieldErrors.password && (
              <p id="admin-pw-error" className="mt-1.5 text-xs text-red-400" role="alert">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || rateLimited}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Admin accounts are provisioned internally.{" "}
            <a href="mailto:info@useclickbox.com" className="text-primary hover:underline">
              Contact your system administrator.
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
