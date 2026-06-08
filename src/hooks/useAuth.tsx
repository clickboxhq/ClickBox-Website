import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthState = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

// Client-side rate limiting (belt-and-suspenders; server enforces real limits)
const RATE_KEY = "clickbox:admin:signin:attempts";
const RATE_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type AttemptRecord = { count: number; windowStart: number };

const getAttempts = (): AttemptRecord => {
  try {
    const raw = sessionStorage.getItem(RATE_KEY);
    if (!raw) return { count: 0, windowStart: Date.now() };
    const rec = JSON.parse(raw) as AttemptRecord;
    if (Date.now() - rec.windowStart > RATE_WINDOW_MS)
      return { count: 0, windowStart: Date.now() };
    return rec;
  } catch {
    return { count: 0, windowStart: Date.now() };
  }
};

const recordAttempt = () => {
  try {
    const rec = getAttempts();
    sessionStorage.setItem(
      RATE_KEY,
      JSON.stringify({ count: rec.count + 1, windowStart: rec.windowStart }),
    );
  } catch {
    /* ignore */
  }
};

const resetAttempts = () => {
  try {
    sessionStorage.removeItem(RATE_KEY);
  } catch {
    /* ignore */
  }
};

export const isSignInRateLimited = (): boolean =>
  getAttempts().count >= MAX_ATTEMPTS;

// Non-blocking auth event logger — calls the log-auth-event Edge Function
async function logAuthEvent(
  event: string,
  email?: string,
  accessToken?: string,
): Promise<void> {
  try {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !anonKey) return;

    let token = accessToken;
    if (!token) {
      const { data: { session } } = await supabase.auth.getSession();
      token = session?.access_token ?? anonKey;
    }

    await fetch(`${url}/functions/v1/log-auth-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        apikey: anonKey,
      },
      body: JSON.stringify({ event, email }),
    });
  } catch {
    /* non-blocking — never throw */
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const checkingRef = useRef(false);

  const checkAdmin = useCallback(async (uid: string | undefined) => {
    if (!uid) {
      setIsAdmin(false);
      return;
    }
    if (checkingRef.current) return;
    checkingRef.current = true;
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    } finally {
      checkingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setTimeout(() => void checkAdmin(s?.user?.id), 0);
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      checkAdmin(s?.user?.id).finally(() => setLoading(false));
    });

    return () => sub.subscription.unsubscribe();
  }, [checkAdmin]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (isSignInRateLimited()) {
      return {
        error:
          "Too many sign-in attempts. Please wait 15 minutes before trying again.",
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      recordAttempt();
      void logAuthEvent("AUTH_FAILED", email);
      return { error: error.message };
    }

    resetAttempts();
    void logAuthEvent("AUTH_LOGIN", email, data.session?.access_token);
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    resetAttempts();
    void logAuthEvent("AUTH_LOGOUT", user?.email);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ session, user, isAdmin, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
