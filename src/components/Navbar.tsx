import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/clickbox-logo.jpeg";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/#services" },
  { label: "About", path: "/about" },
  { label: "Team", path: "/team" },
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
            className="rounded-md border border-white/10 bg-secondary/80 px-5 py-2.5 text-sm font-semibold text-secondary-foreground backdrop-blur transition-all hover:bg-muted hover:border-primary/40"
          >
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
            className="mt-3 block rounded-md border border-white/10 bg-secondary px-5 py-2.5 text-center text-sm font-semibold text-secondary-foreground"
          >
            Fellowship
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
