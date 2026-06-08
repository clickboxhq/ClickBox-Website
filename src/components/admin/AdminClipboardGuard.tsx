import { useEffect, type ReactNode } from "react";
import { toast } from "sonner";

const NOTICE = "Copying and pasting is disabled in the ClickBox Admin Portal.";
const NOTICE_COOLDOWN_MS = 2500;

/** Fields where paste/selection must remain usable for admin work. */
const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return target.isContentEditable;
};

type Props = { children: ReactNode };

/**
 * Applies clipboard and selection restrictions across admin routes.
 * Editable fields (inputs, textareas) remain usable for notes and search.
 */
const AdminClipboardGuard = ({ children }: Props) => {
  useEffect(() => {
    let lastNotice = 0;

    const notify = () => {
      const now = Date.now();
      if (now - lastNotice < NOTICE_COOLDOWN_MS) return;
      lastNotice = now;
      toast.info(NOTICE, { duration: 2200 });
    };

    const blockClipboard = (e: ClipboardEvent) => {
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
      notify();
    };

    const blockPaste = (e: ClipboardEvent) => {
      // Login fields handle their own paste blocking; allow paste in admin notes/search.
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
      notify();
    };

    const blockContextMenu = (e: MouseEvent) => {
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
      notify();
    };

    const blockSelectStart = (e: Event) => {
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
    };

    document.addEventListener("copy", blockClipboard);
    document.addEventListener("cut", blockClipboard);
    document.addEventListener("paste", blockPaste);
    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("selectstart", blockSelectStart);

    return () => {
      document.removeEventListener("copy", blockClipboard);
      document.removeEventListener("cut", blockClipboard);
      document.removeEventListener("paste", blockPaste);
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("selectstart", blockSelectStart);
    };
  }, []);

  return (
    <div className="admin-portal-shell min-h-screen select-none">{children}</div>
  );
};

export default AdminClipboardGuard;
