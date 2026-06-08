import { useEffect, type ReactNode } from "react";
import { toast } from "sonner";

const NOTICE = "Copying and pasting is disabled in the ClickBox Admin Portal.";
const NOTICE_COOLDOWN_MS = 2500;

/** Allow clipboard in notes/search textareas only — keeps admin usable. */
const allowsClipboard = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.tagName === "TEXTAREA") return true;
  if (target.tagName === "INPUT") {
    const input = target as HTMLInputElement;
    return input.type === "search" || input.name === "notes" || input.name === "query";
  }
  return target.isContentEditable;
};

type Props = { children: ReactNode };

/**
 * Applies clipboard and selection restrictions across admin routes.
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

    const blockCopyCut = (e: ClipboardEvent) => {
      if (allowsClipboard(e.target)) return;
      e.preventDefault();
      notify();
    };

    const blockPaste = (e: ClipboardEvent) => {
      if (allowsClipboard(e.target)) return;
      e.preventDefault();
      notify();
    };

    const blockContextMenu = (e: MouseEvent) => {
      if (allowsClipboard(e.target)) return;
      e.preventDefault();
      notify();
    };

    const blockSelectStart = (e: Event) => {
      if (allowsClipboard(e.target)) return;
      e.preventDefault();
    };

    document.addEventListener("copy", blockCopyCut);
    document.addEventListener("cut", blockCopyCut);
    document.addEventListener("paste", blockPaste);
    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("selectstart", blockSelectStart);

    return () => {
      document.removeEventListener("copy", blockCopyCut);
      document.removeEventListener("cut", blockCopyCut);
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
