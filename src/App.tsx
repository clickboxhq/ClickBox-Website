import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";
import Index from "./pages/Index";

const Product = lazy(() => import("./pages/Product"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Resources = lazy(() => import("./pages/Resources"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const Internship = lazy(() => import("./pages/Internship"));
const About = lazy(() => import("./pages/About"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const SetupMFA = lazy(() => import("./pages/admin/SetupMFA"));
const VerifyMFA = lazy(() => import("./pages/admin/VerifyMFA"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background" aria-hidden="true">
    <div className="h-1 w-24 overflow-hidden rounded-full bg-white/8">
      <div
        className="h-full w-1/2 rounded-full bg-primary/60 animate-[slide_1.2s_ease-in-out_infinite]"
        style={{ animation: "navLoader 1.2s ease-in-out infinite" }}
      />
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product" element={<Product />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:slug" element={<BlogPostPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/internship" element={<Internship />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/setup-mfa" element={<SetupMFA />} />
              <Route path="/admin/verify-mfa" element={<VerifyMFA />} />
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <CookieConsent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
