import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/clickbox-logo.jpeg";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/#services" },
  { label: "About", path: "/about" },
  { label: "Resources", path: "/resources" },
  { label: "Product", path: "/product" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Hide when scrolling down past threshold, show when scrolling up
      if (y > 120 && y > lastY) setHidden(true);
      else setHidden(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (path: string) => {
    setMobileOpen(false);
    if (path.startsWith("/#")) {
      const id = path.replace("/#", "");
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = path;
      }
    }
  };

  const fellowshipBtn =
    "rounded-md border border-white/10 bg-secondary/80 px-5 py-2 text-sm font-semibold text-secondary-foreground backdrop-blur transition-all hover:bg-muted";

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-500 ease-out ${
        scrolled
          ? "border-white/10 bg-background/80 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "border-white/5 bg-background/50 backdrop-blur-xl"
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 ease-out ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3"
        >
          <img
            src={logo}
            alt="ClickBox"
            width={56}
            height={56}
            className={`rounded-lg object-cover ring-1 ring-white/10 transition-all duration-500 ease-out ${
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

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => handleNavClick(link.path)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link to="/internship" className={fellowshipBtn}>
            Fellowship
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/5 bg-background/95 px-6 pb-6 pt-4 backdrop-blur-xl md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => handleNavClick(link.path)}
              className="block py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/internship"
            onClick={() => setMobileOpen(false)}
            className={`mt-3 flex items-center justify-center ${fellowshipBtn}`}
          >
            Fellowship
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
