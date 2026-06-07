import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  ADMIN_IDLE_TIMEOUT_MS,
  ADMIN_IDLE_WARNING_MS,
  dispatchAdminSessionReset,
} from "@/lib/adminSession";

const ACTIVITY_EVENTS = ["mousedown", "keydown", "touchstart", "scroll"] as const;

type Options = {
  enabled: boolean;
};

export const useIdleSessionTimeout = ({ enabled }: Options) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const showWarningRef = useRef(false);

  const warningTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    showWarningRef.current = showWarning;
  }, [showWarning]);

  const clearTimers = useCallback(() => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    warningTimerRef.current = undefined;
    logoutTimerRef.current = undefined;
  }, []);

  const forceLogout = useCallback(async () => {
    clearTimers();
    setShowWarning(false);
    await signOut();
    navigate("/admin/login", { replace: true, state: { reason: "idle_timeout" } });
  }, [clearTimers, navigate, signOut]);

  const scheduleTimers = useCallback(() => {
    clearTimers();
    setShowWarning(false);
    dispatchAdminSessionReset();

    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
    }, ADMIN_IDLE_TIMEOUT_MS - ADMIN_IDLE_WARNING_MS);

    logoutTimerRef.current = setTimeout(() => {
      void forceLogout();
    }, ADMIN_IDLE_TIMEOUT_MS);
  }, [clearTimers, forceLogout]);

  const stayLoggedIn = useCallback(async () => {
    const { error } = await supabase.auth.refreshSession();
    if (error) {
      await forceLogout();
      return;
    }
    scheduleTimers();
  }, [forceLogout, scheduleTimers]);

  const logoutNow = useCallback(async () => {
    await forceLogout();
  }, [forceLogout]);

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      setShowWarning(false);
      return;
    }

    scheduleTimers();
    return () => clearTimers();
  }, [clearTimers, enabled, scheduleTimers]);

  useEffect(() => {
    if (!enabled) return;

    const onActivity = () => {
      if (showWarningRef.current) return;
      scheduleTimers();
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, onActivity, { passive: true });
    }

    return () => {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, onActivity);
      }
    };
  }, [enabled, scheduleTimers]);

  return {
    showWarning,
    stayLoggedIn,
    logoutNow,
  };
};
