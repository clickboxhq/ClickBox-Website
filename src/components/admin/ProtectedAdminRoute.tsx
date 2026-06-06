import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIdleSessionTimeout } from "@/hooks/useIdleSessionTimeout";
import SessionTimeoutModal from "@/components/admin/SessionTimeoutModal";
import { Loader2 } from "lucide-react";

const ProtectedAdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();
  const { showWarning, stayLoggedIn, logoutNow } = useIdleSessionTimeout({
    enabled: !!user && isAdmin,
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">Access denied</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          Your account does not have administrator access. Contact a ClickBox admin if you believe
          this is a mistake.
        </p>
      </div>
    );
  }

  return (
    <>
      {children}
      <SessionTimeoutModal
        open={showWarning}
        onStayLoggedIn={stayLoggedIn}
        onLogout={logoutNow}
      />
    </>
  );
};

export default ProtectedAdminRoute;
