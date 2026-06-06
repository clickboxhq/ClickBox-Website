import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  open: boolean;
  onStayLoggedIn: () => Promise<void>;
  onLogout: () => Promise<void>;
};

const SessionTimeoutModal = ({ open, onStayLoggedIn, onLogout }: Props) => {
  const [busy, setBusy] = useState<"stay" | "logout" | null>(null);

  const handleStay = async () => {
    setBusy("stay");
    await onStayLoggedIn();
    setBusy(null);
  };

  const handleLogout = async () => {
    setBusy("logout");
    await onLogout();
    setBusy(null);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="border-white/10 bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading">Session expiring soon</AlertDialogTitle>
          <AlertDialogDescription>
            Your session will expire soon due to inactivity.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={busy !== null}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-secondary/80 px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60"
          >
            {busy === "logout" && <Loader2 className="h-4 w-4 animate-spin" />}
            Log Out
          </button>
          <button
            type="button"
            onClick={() => void handleStay()}
            disabled={busy !== null}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {busy === "stay" && <Loader2 className="h-4 w-4 animate-spin" />}
            Stay Logged In
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SessionTimeoutModal;
