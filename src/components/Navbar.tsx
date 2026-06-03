import { useState } from "react";
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
  const location = useLocation();

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
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
            className="h-12 w-12 md:h-14 md:w-14 rounded-lg object-cover ring-1 ring-white/10"
          />
          <span className="font-heading text-xl md:text-2xl font-bold tracking-tight text-foreground">
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
          <Link
            to="/internship"
            className="group relative inline-flex items-center gap-2 rounded-md border border-primary/30 bg-gradient-to-b from-muted to-secondary px-5 py-2.5 text-sm font-semibold text-foreground shadow-[0_1px_0_0_hsl(0_0%_100%/0.08)_inset,0_8px_24px_-12px_hsl(var(--primary)/0.5)] transition-all hover:border-primary/60 hover:shadow-[0_1px_0_0_hsl(0_0%_100%/0.12)_inset,0_10px_28px_-10px_hsl(var(--primary)/0.7)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
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
            className="mt-3 flex items-center justify-center gap-2 rounded-md border border-primary/30 bg-gradient-to-b from-muted to-secondary px-5 py-2.5 text-sm font-semibold text-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
            Fellowship
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
