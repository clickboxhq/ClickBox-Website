import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/clickbox-logo.jpeg";

export function VerifyMFA() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function verify() {
    setLoading(true);
    setError("");

    const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
    if (listError) {
      setError(listError.message);
      setLoading(false);
      return;
    }

    const totp = factors?.totp?.[0];
    if (!totp) {
      setError("No MFA factor found on this account.");
      setLoading(false);
      return;
    }

    const { data: challenge, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId: totp.id });
    if (challengeError) {
      setError(challengeError.message);
      setLoading(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: totp.id,
      challengeId: challenge.id,
      code: code.trim(),
    });

    setLoading(false);
    if (verifyError) {
      setError("Invalid code. Please try again.");
      return;
    }

    void navigate("/admin", { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(0_0%_3%)] px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.10),transparent_60%)]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <img src={logo} alt="ClickBox" className="h-14 w-14 rounded-xl object-cover ring-2 ring-primary/20" />
          <div>
            <p className="font-heading text-xl font-bold text-foreground">Two-Factor Verification</p>
            <p className="text-xs text-muted-foreground">Enter the code from your authenticator app</p>
          </div>
        </div>

        <div className="glass-card space-y-6 p-8">
          <div className="flex items-center gap-3 border-b border-white/8 pb-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <KeyRound className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-base font-semibold text-foreground">Verification required</h1>
              <p className="text-xs text-muted-foreground">Open your authenticator app to get a code</p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              6-Digit Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && code.length === 6 && void verify()}
              placeholder="000000"
              autoFocus
              className="w-full rounded-lg border border-white/10 bg-background/60 px-4 py-2.5 text-center text-xl tracking-[0.5em] text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="button"
            onClick={() => void verify()}
            disabled={loading || code.length < 6}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Verifying…" : "Verify"}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Issues with your authenticator?{" "}
            <a href="mailto:info@useclickbox.com" className="text-primary hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyMFA;
