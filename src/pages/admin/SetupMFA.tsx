import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldCheck, KeyRound, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from "qrcode.react";
import logo from "@/assets/clickbox-logo.jpeg";

export function SetupMFA() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"enroll" | "verify" | "done">("enroll");
  const [factorId, setFactorId] = useState("");
  const [qrUri, setQrUri] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function startEnrollment() {
    setLoading(true);
    setError("");
    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: "totp",
    });
    setLoading(false);
    if (enrollError) {
      setError(enrollError.message);
      return;
    }
    setFactorId(data.id);
    setQrUri(data.totp.qr_code);
    setSecretKey(data.totp.secret);
    setStep("verify");
  }

  async function verifyEnrollment() {
    setLoading(true);
    setError("");

    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId });
    if (challengeError) {
      setError(challengeError.message);
      setLoading(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code: code.trim(),
    });

    setLoading(false);
    if (verifyError) {
      setError("Invalid code — please check your authenticator and try again.");
      return;
    }

    setStep("done");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(0_0%_3%)] px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.10),transparent_60%)]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <img src={logo} alt="ClickBox" className="h-14 w-14 rounded-xl object-cover ring-2 ring-primary/20" />
          <div>
            <p className="font-heading text-xl font-bold text-foreground">Two-Factor Authentication</p>
            <p className="text-xs text-muted-foreground">Secure your admin account with TOTP</p>
          </div>
        </div>

        {step === "enroll" && (
          <div className="glass-card space-y-6 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
              <KeyRound className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">Set up authenticator</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                You'll need Google Authenticator, Authy, or any TOTP app. Click below to generate your QR code.
              </p>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="button"
              onClick={() => void startEnrollment()}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Generate QR Code
            </button>
          </div>
        )}

        {step === "verify" && (
          <div className="glass-card space-y-6 p-8">
            <div className="text-center">
              <h2 className="font-heading text-lg font-semibold text-foreground">Scan QR Code</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Scan with your authenticator app, then enter the 6-digit code.
              </p>
            </div>

            {qrUri && (
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-lg bg-white p-3">
                  <QRCodeSVG value={qrUri} size={180} />
                </div>
                <details className="w-full text-center">
                  <summary className="cursor-pointer text-xs text-muted-foreground hover:text-primary">
                    Can't scan? Enter key manually
                  </summary>
                  <p className="mt-2 break-all rounded-md bg-white/5 p-2 text-xs font-mono text-muted-foreground">
                    {secretKey}
                  </p>
                </details>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full rounded-lg border border-white/10 bg-background/60 px-4 py-2.5 text-center text-lg tracking-widest text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="button"
              onClick={() => void verifyEnrollment()}
              disabled={loading || code.length < 6}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Verify and activate MFA
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="glass-card p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/30">
              <CheckCircle2 className="h-7 w-7 text-green-400" />
            </div>
            <h2 className="font-heading text-lg font-semibold text-foreground">MFA Activated</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account is now protected with two-factor authentication.
            </p>
            <button
              type="button"
              onClick={() => void navigate("/admin", { replace: true })}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <ShieldCheck className="h-4 w-4" />
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SetupMFA;
