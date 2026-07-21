import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import NavDropdown from "@/components/NavDropdown";
import logo from "@/assets/clickbox-logo.jpeg";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/#services" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const solutionsItems = [
  { label: "SOCBOX", path: "/socbox" },
];

const resourcesItems = [
  { label: "Blog", path: "/resources?group=Blog" },
  { label: "Insights", path: "/resources?group=Insights" },
  { label: "Threat Intelligence", path: "/resources?group=Threat Intelligence" },
  { label: "Updates", path: "/resources?group=Updates" },
  { label: "Fellowship News", path: "/resources?group=Fellowship News" },
];

const SPRING = { stiffness: 180, damping: 22, mass: 0.95 };

const isActivePath = (linkPath: string, pathname: string): boolean => {
  if (linkPath === "/") return pathname === "/";
  if (linkPath.startsWith("/#")) return pathname === "/";
  return pathname === linkPath || pathname.startsWith(linkPath + "/");
};

const NavLink = ({
  link,
  pathname,
  onClick,
  mobile = false,
}: {
  link: { label: string; path: string };
  pathname: string;
  onClick: (path: string) => void;
  mobile?: boolean;
}) => {
  const active = isActivePath(link.path, pathname);
  return (
    <div className="relative" role="listitem">
      <Link
        to={link.path}
        onClick={() => onClick(link.path)}
        aria-current={active ? "page" : undefined}
        className={
          mobile
            ? `block rounded-xl px-4 py-3.5 text-[15px] font-medium transition-colors ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:bg-white/[0.04] hover:text-primary"
              }`
            : `text-sm font-medium transition-colors ${
                active ? "text-foreground" : "text-muted-foreground hover:text-primary"
              }`
        }
      >
        {link.label}
      </Link>
      {active && (
        <motion.span
          layoutId={mobile ? "nav-mobile-active" : "nav-desktop-active"}
          className={
            mobile
              ? "absolute bottom-2 left-4 right-4 h-px nav-accent-indicator-mobile"
              : "absolute -bottom-[14px] left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full nav-accent-indicator"
          }
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
  const [mobileScrolled, setMobileScrolled] = useState(false);
  const [mobilePeek, setMobilePeek] = useState(false);
  const location = useLocation();
  const lastY = useRef(0);

  const effectiveCompact = isDesktop && compact;

  const maxWidthMV = useMotionValue(1280);
  const logoInsetMV = useMotionValue(0);
  const fellowshipInsetMV = useMotionValue(0);
  const paddingMV = useMotionValue(12);
  const mobileOffsetMV = useMotionValue(0);
  const mobileLogoScaleMV = useMotionValue(1);

  const springMaxWidth = useSpring(maxWidthMV, SPRING);
  const springLogoInset = useSpring(logoInsetMV, SPRING);
  const springFellowshipInset = useSpring(fellowshipInsetMV, SPRING);
  const springPadding = useSpring(paddingMV, SPRING);
  const springMobileOffset = useSpring(mobileOffsetMV, SPRING);
  const springMobileLogoScale = useSpring(mobileLogoScaleMV, SPRING);

  useEffect(() => {
    if (isDesktop) {
      maxWidthMV.set(effectiveCompact ? 900 : 1280);
      logoInsetMV.set(effectiveCompact ? 18 : 0);
      fellowshipInsetMV.set(effectiveCompact ? -18 : 0);
      paddingMV.set(effectiveCompact ? 8 : 12);
    } else {
      maxWidthMV.set(1280);
      logoInsetMV.set(0);
      fellowshipInsetMV.set(0);
      paddingMV.set(mobileScrolled ? 8 : 12);
      mobileLogoScaleMV.set(mobileScrolled ? 0.88 : 1);
      mobileOffsetMV.set(mobilePeek ? -6 : 0);
    }
  }, [
    effectiveCompact,
    isDesktop,
    mobileScrolled,
    mobilePeek,
    maxWidthMV,
    logoInsetMV,
    fellowshipInsetMV,
    paddingMV,
    mobileLogoScaleMV,
    mobileOffsetMV,
  ]);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    setIsDesktop(mql.matches);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      setScrolled(y > 24);

      if (window.innerWidth >= 768) {
        if (y <= 20) setCompact(false);
        else if (delta > 0) setCompact(true);
        else if (delta < 0) setCompact(false);
      } else {
        setMobileScrolled(y > 16);
        if (delta > 8 && y > 80) setMobilePeek(true);
        else if (delta < -4) setMobilePeek(false);
      }

      lastY.current = y;
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

  const desktopShadow = effectiveCompact
    ? "shadow-[0_10px_52px_rgba(0,0,0,0.48)]"
    : scrolled
      ? "shadow-[0_4px_40px_rgba(0,0,0,0.35)]"
      : "shadow-none";

  const mobileShadow = mobileScrolled
    ? "shadow-[0_8px_32px_rgba(0,0,0,0.42)]"
    : "shadow-[0_2px_16px_rgba(0,0,0,0.2)]";

  return (
    <motion.nav
      role="navigation"
      aria-label="Main navigation"
      style={!isDesktop ? { y: springMobileOffset } : undefined}
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-500 ${
        isDesktop
          ? `${desktopShadow} ${
              effectiveCompact
                ? "border-white/10 bg-background/88 backdrop-blur-2xl"
                : scrolled
                  ? "border-white/10 bg-background/92 backdrop-blur-2xl"
                  : "border-transparent bg-transparent backdrop-blur-sm"
            }`
          : `${mobileShadow} ${
              mobileScrolled
                ? "border-white/12 bg-background/92 backdrop-blur-2xl"
                : "border-transparent bg-transparent backdrop-blur-sm"
            }`
      }`}
    >
      <motion.div
        style={{
          maxWidth: isDesktop ? springMaxWidth : undefined,
          paddingTop: springPadding,
          paddingBottom: springPadding,
        }}
        className={`relative mx-auto flex w-full items-center px-6 ${isDesktop ? "" : "max-w-none"}`}
      >
        {/* Logo */}
        <motion.div
          style={{
            x: isDesktop ? springLogoInset : 0,
            scale: !isDesktop ? springMobileLogoScale : 1,
          }}
          className="relative z-20 shrink-0 origin-left"
        >
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
              className={`rounded-lg object-cover ring-1 ring-white/10 transition-all duration-500 group-hover:ring-primary/30 ${
                isDesktop
                  ? effectiveCompact
                    ? "h-9 w-9 md:h-10 md:w-10"
                    : scrolled
                      ? "h-9 w-9 md:h-10 md:w-10"
                      : "h-12 w-12 md:h-14 md:w-14"
                  : mobileScrolled
                    ? "h-9 w-9"
                    : "h-11 w-11"
              }`}
            />
            <span
              className={`font-heading font-bold tracking-tight text-foreground transition-all duration-500 ${
                isDesktop
                  ? effectiveCompact || scrolled
                    ? "text-base md:text-lg"
                    : "text-xl md:text-2xl"
                  : mobileScrolled
                    ? "text-base"
                    : "text-lg"
              }`}
            >
              ClickBox
            </span>
          </Link>
        </motion.div>

        {/* Desktop/tablet — centered nav group (fixed relative spacing) */}
        <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
          <div className="flex items-center gap-7" role="list">
            {navLinks.slice(0, 3).map((link) => (
              <NavLink
                key={link.label}
                link={link}
                pathname={location.pathname}
                onClick={handleNavClick}
              />
            ))}
            <NavDropdown
              label="Solutions"
              items={solutionsItems}
              onNavigate={() => handleNavClick("/product")}
              isActive={location.pathname === "/product"}
            />
            <NavDropdown
              label="Resources"
              items={resourcesItems}
              onNavigate={() => handleNavClick("/resources")}
              isActive={location.pathname.startsWith("/resources")}
            />
            {navLinks.slice(3).map((link) => (
              <NavLink
                key={link.label}
                link={link}
                pathname={location.pathname}
                onClick={handleNavClick}
              />
            ))}
          </div>
        </div>

        {/* Fellowship — desktop/tablet only */}
        <motion.div
          style={{ x: isDesktop ? springFellowshipInset : 0 }}
          className="relative z-20 hidden shrink-0 md:block"
        >
          <Link to="/internship" className={fellowshipBtn}>
            Careers
          </Link>
        </motion.div>

        {/* Mobile menu toggle */}
        <button
          className="relative z-20 ml-auto flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-foreground backdrop-blur-sm transition hover:bg-white/[0.08] md:hidden"
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
                <X size={20} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Menu size={20} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.div>

      {/* Mobile — premium floating menu panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="absolute left-4 right-4 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-white/10 bg-background/95 shadow-[0_24px_64px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:hidden"
              aria-label="Mobile navigation"
            >
              <div className="space-y-1 p-3" role="list">
                {navLinks.slice(0, 3).map((link) => (
                  <NavLink
                    key={link.label}
                    link={link}
                    pathname={location.pathname}
                    onClick={handleNavClick}
                    mobile
                  />
                ))}
                <NavDropdown
                  label="Solutions"
                  items={solutionsItems}
                  onNavigate={() => setMobileOpen(false)}
                  mobile
                  isActive={location.pathname === "/product"}
                />
                <NavDropdown
                  label="Resources"
                  items={resourcesItems}
                  onNavigate={() => setMobileOpen(false)}
                  mobile
                  isActive={location.pathname.startsWith("/resources")}
                />
                {navLinks.slice(3).map((link) => (
                  <NavLink
                    key={link.label}
                    link={link}
                    pathname={location.pathname}
                    onClick={handleNavClick}
                    mobile
                  />
                ))}
              </div>
              <div className="border-t border-white/8 p-3">
                <Link
                  to="/internship"
                  onClick={() => setMobileOpen(false)}
                  className={`flex w-full items-center justify-center ${fellowshipBtn} py-3`}
                >
                  Careers
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
