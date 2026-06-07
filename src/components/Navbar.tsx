import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import logo from "@/assets/clickbox-logo.jpeg";

const centerNavLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/#services" },
  { label: "About", path: "/about" },
  { label: "Resources", path: "/resources" },
  { label: "Product", path: "/product" },
  { label: "Contact", path: "/contact" },
];

const isActivePath = (linkPath: string, pathname: string): boolean => {
  if (linkPath === "/") return pathname === "/";
  if (linkPath.startsWith("/#")) return pathname === "/";
  return pathname === linkPath || pathname.startsWith(linkPath + "/");
};

const NavLink = ({
  link,
  pathname,
  onClick,
}: {
  link: { label: string; path: string };
  pathname: string;
  onClick: (path: string) => void;
}) => {
  const active = isActivePath(link.path, pathname);
  return (
    <div className="relative" role="listitem">
      <Link
        to={link.path}
        onClick={() => onClick(link.path)}
        aria-current={active ? "page" : undefined}
        className={`text-sm font-medium transition-colors ${
          active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {link.label}
      </Link>
      {active && (
        <motion.span
          layoutId="nav-active-dot"
          className="absolute -bottom-[14px] left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        />
      )}
    </div>
  );
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const location = useLocation();

  const effectiveCompact = isDesktop && compact;

  const maxWidthMV = useMotionValue(1280);
  const springMaxWidth = useSpring(maxWidthMV, {
    stiffness: 260,
    damping: 26,
    mass: 0.9,
  });

  // Subtle inward motion for logo (right) and Fellowship (left) when compact
  const logoInsetMV = useMotionValue(0);
  const fellowshipInsetMV = useMotionValue(0);
  const springLogoInset = useSpring(logoInsetMV, {
    stiffness: 260,
    damping: 26,
    mass: 0.9,
  });
  const springFellowshipInset = useSpring(fellowshipInsetMV, {
    stiffness: 260,
    damping: 26,
    mass: 0.9,
  });

  useEffect(() => {
    maxWidthMV.set(effectiveCompact ? 720 : 1280);
    logoInsetMV.set(effectiveCompact ? 12 : 0);
    fellowshipInsetMV.set(effectiveCompact ? -12 : 0);
  }, [effectiveCompact, maxWidthMV, logoInsetMV, fellowshipInsetMV]);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    setIsDesktop(mql.matches);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);

      if (y <= 20) {
        setCompact(false);
      } else if (y > lastY) {
        setCompact(true);
      } else {
        setCompact(false);
      }

      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = useCallback(
    (path: string) => {
      setMobileOpen(false);
      if (path.startsWith("/#")) {
        const id = path.replace("/#", "");
        if (location.pathname === "/") {
          requestAnimationFrame(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
          });
        } else {
          window.location.href = path;
        }
      }
    },
    [location.pathname],
  );

  const fellowshipBtn =
    "rounded-md border border-white/10 bg-secondary/80 px-5 py-2 text-sm font-semibold text-secondary-foreground backdrop-blur transition-all hover:bg-muted hover:border-primary/20";

  const navShadow = effectiveCompact
    ? "border-white/10 bg-background/85 backdrop-blur-2xl shadow-[0_8px_48px_rgba(0,0,0,0.45)]"
    : scrolled
      ? "border-white/10 bg-background/80 backdrop-blur-2xl shadow-[0_4px_40px_rgba(0,0,0,0.35)]"
      : "border-white/5 bg-background/50 backdrop-blur-xl";

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-colors duration-500 ease-out ${navShadow} relative`}
    >
      {/* Inner strip — width springs on desktop; logo + Fellowship on edges only */}
      <motion.div
        style={isDesktop ? { maxWidth: springMaxWidth } : undefined}
        className={`relative mx-auto flex w-full items-center justify-between px-6 ${
          isDesktop ? "" : "max-w-7xl"
        } ${scrolled ? "py-2" : "py-3"}`}
      >
        {/* Logo — only left element that animates inward when compact */}
        <motion.div style={isDesktop ? { x: springLogoInset } : undefined} className="relative z-20 shrink-0">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-3"
            aria-label="ClickBox — go to home page"
          >
            <img
              src={logo}
              alt="ClickBox"
              width={56}
              height={56}
              className={`rounded-lg object-cover ring-1 ring-white/10 transition-all duration-500 ease-out group-hover:ring-primary/30 ${
                scrolled ? "h-9 w-9 md:h-10 md:w-10" : "h-12 w-12 md:h-14 md:w-14"
              }`}
            />
            <span
              className={`font-heading font-bold tracking-tight text-foreground transition-all duration-500 ease-out ${
                scrolled ? "text-base md:text-lg" : "text-xl md:text-2xl"
              }`}
            >
              ClickBox
            </span>
          </Link>
        </motion.div>

        {/* Fellowship — only right element that animates inward when compact */}
        <motion.div
          style={isDesktop ? { x: springFellowshipInset } : undefined}
          className="relative z-20 hidden shrink-0 md:block"
        >
          <Link to="/internship" className={fellowshipBtn}>
            Fellowship
          </Link>
        </motion.div>

        {/* Mobile toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-white/5 transition md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Menu size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.div>

      {/* Center nav — viewport-locked, never moves with compact/expand */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-full items-center justify-center md:flex"
      >
        <div className="pointer-events-auto flex items-center gap-7" role="list">
          {centerNavLinks.map((link) => (
            <NavLink
              key={link.label}
              link={link}
              pathname={location.pathname}
              onClick={handleNavClick}
            />
          ))}
        </div>
      </div>

      {/* Mobile menu — full width, no compact behaviour */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-t border-white/5 bg-background/98 backdrop-blur-2xl md:hidden"
            aria-label="Mobile navigation"
          >
            <div className="space-y-0.5 px-6 pb-6 pt-3">
              {centerNavLinks.map((link, i) => {
                const active = isActivePath(link.path, location.pathname);
                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2, ease: "easeOut" }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => handleNavClick(link.path)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary/8 text-foreground"
                          : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                      }`}
                    >
                      {link.label}
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: centerNavLinks.length * 0.04,
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className="pt-3"
              >
                <Link
                  to="/internship"
                  onClick={() => setMobileOpen(false)}
                  className={`flex w-full items-center justify-center ${fellowshipBtn}`}
                >
                  Fellowship
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
