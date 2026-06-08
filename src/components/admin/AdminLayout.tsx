import type { ReactNode } from "react";
import AdminClipboardGuard from "./AdminClipboardGuard";

/** Wraps all admin routes with portal-level security restrictions. */
const AdminLayout = ({ children }: { children: ReactNode }) => (
  <AdminClipboardGuard>{children}</AdminClipboardGuard>
);

export default AdminLayout;
