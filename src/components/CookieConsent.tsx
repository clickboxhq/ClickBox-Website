import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "clickbox:cookie-consent:v1";

type Prefs = {
  essential: true;
  analytics: boolean;
  performance: boolean;
  decidedAt: string;
};

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [managing, setManaging] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [performance, setPerformance] = useState(true);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = setTimeout(() => setVisible(true), 600);
        return () => clearTimeout(t);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (prefs: Omit<Prefs, "decidedAt" | "essential">) => {
    const data: Prefs = { essential: true, ...prefs, decidedAt: new Date().toISOString() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6">
      <div
        role="dialog"
        aria-label="Cookie preferences"
        className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-background/85 p-5 backdrop-blur-xl shadow-[0_24px_60px_-20px_hsl(0_0%_0%/0.7)] sm:p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md icon-accent-wrap">
            <Cookie className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-base font-semibold text-foreground">
              We value your privacy
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              We use cookies to operate this site, analyse traffic, and improve performance. You can
              accept all or manage your preferences. Read our{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>

            {managing && (
              <div className="mt-4 space-y-2 rounded-lg border border-white/5 bg-secondary/40 p-3 text-sm">
                <label className="flex items-center justify-between gap-3 opacity-70">
                  <span>
                    <span className="font-medium text-foreground">Essential</span> — Required
                  </span>
                  <input type="checkbox" checked readOnly className="h-4 w-4 accent-primary" />
                </label>
                <label className="flex items-center justify-between gap-3 cursor-pointer">
                  <span className="font-medium text-foreground">Analytics</span>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                </label>
                <label className="flex items-center justify-between gap-3 cursor-pointer">
                  <span className="font-medium text-foreground">Performance</span>
                  <input
                    type="checkbox"
                    checked={performance}
                    onChange={(e) => setPerformance(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                </label>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={() => save({ analytics: true, performance: true })}
                className="rounded-md border border-[rgba(208,201,195,0.4)] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition duration-300 hover:bg-[#007A48] hover:border-[rgba(208,201,195,0.55)]"
              >
                Accept Cookies
              </button>
              {!managing ? (
                <button
                  onClick={() => setManaging(true)}
                  className="rounded-md border border-white/10 bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-muted transition"
                >
                  Manage Preferences
                </button>
              ) : (
                <button
                  onClick={() => save({ analytics, performance })}
                  className="rounded-md border border-white/10 bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-muted transition"
                >
                  Save Preferences
                </button>
              )}
              <button
                onClick={() => save({ analytics: false, performance: false })}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
              >
                Reject non-essential
              </button>
            </div>
          </div>
          <button
            onClick={() => save({ analytics: false, performance: false })}
            aria-label="Dismiss"
            className="ml-2 shrink-0 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
