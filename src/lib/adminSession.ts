/** Admin session inactivity settings — shared by idle lock hook and dashboard timer. */
export const ADMIN_IDLE_TIMEOUT_MS = 10 * 60 * 1000;
export const ADMIN_IDLE_WARNING_MS = 2 * 60 * 1000;

/** Dispatched when admin idle timers reset (activity or stay-logged-in). */
export const ADMIN_SESSION_RESET_EVENT = "clickbox:admin-session-reset";

export const dispatchAdminSessionReset = () => {
  window.dispatchEvent(new CustomEvent(ADMIN_SESSION_RESET_EVENT));
};
