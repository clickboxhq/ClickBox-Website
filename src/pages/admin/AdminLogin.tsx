import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { sanitizeEmail } from "@/lib/inputSanitization";
import logo from "@/assets/clickbox-logo.jpeg";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, user, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (!loading && user && isAdmin) navigate("/admin", { replace: true });
  }, [loading, user, isAdmin, navigate]);

  useEffect(() => {
    const reason = (location.state as { reason?: string } | null)?.reason;
    if (reason === "idle_timeout") {
      toast.info("Your session has expired", {
        description: "You were signed out due to inactivity. Please sign in again.",
      });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const safeEmail = sanitizeEmail(email);
    const nextErrors: { email?: string; password?: string } = {};

    if (!safeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
      nextErrors.email = "Email: Please enter a valid email address";
    }
    if (password.length < 6) {
      nextErrors.password = "Password: Must be at least 6 characters";
    }
    if (mode === "signup" && password.length < 8) {
      nextErrors.password = "Password: Must be at least 8 characters for new accounts";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      toast.error("Please fix the highlighted fields", {
        description: nextErrors.email ?? nextErrors.password,
      });
      return;
    }

    setSubmitting(true);
    if (mode === "signup") {
      const { error } = await signUp(safeEmail, password);
      setSubmitting(false);
      if (error) {
        toast.error("Sign up failed", { description: error });
        return;
      }
      toast.success("Account created", {
        description: "Check your email to confirm, then ask an existing admin to grant access.",
      });
      setMode("signin");
      return;
    }
    const { error } = await signIn(safeEmail, password);
    setSubmitting(false);
    if (error) {
      toast.error("Sign in failed", { description: error });
      return;
    }
    toast.success("Signed in");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_60%)]" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <img src={logo} alt="ClickBox" className="h-10 w-10 rounded-lg object-cover ring-1 ring-white/10" />
          <span className="font-heading text-xl font-bold text-foreground">ClickBox Admin</span>
        </div>

        <form onSubmit={onSubmit} className="glass-card space-y-5 p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-semibold text-foreground">
                {mode === "signin" ? "Secure access" : "Create admin account"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {mode === "signin"
                  ? "Authorized administrators only."
                  : "New accounts require admin role approval."}
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby={fieldErrors.email ? "admin-email-error" : undefined}
              className={`w-full rounded-md border bg-background/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ${
                fieldErrors.email
                  ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/30"
                  : "border-white/10 focus:border-primary/50 focus:ring-primary/30"
              }`}
            />
            {fieldErrors.email ? (
              <p id="admin-email-error" className="mt-1.5 text-xs text-red-400" role="alert">
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              minLength={6}
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={fieldErrors.password ? true : undefined}
              aria-describedby={fieldErrors.password ? "admin-password-error" : undefined}
              className={`w-full rounded-md border bg-background/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ${
                fieldErrors.password
                  ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/30"
                  : "border-white/10 focus:border-primary/50 focus:ring-primary/30"
              }`}
            />
            {fieldErrors.password ? (
              <p id="admin-password-error" className="mt-1.5 text-xs text-red-400" role="alert">
                {fieldErrors.password}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {submitting
              ? mode === "signin" ? "Signing in…" : "Creating account…"
              : mode === "signin" ? "Sign in" : "Create account"}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
          >
            {mode === "signin"
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Trouble accessing the portal? Contact{" "}
            <a href="mailto:info@useclickbox.com" className="text-primary hover:underline">
              info@useclickbox.com
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
