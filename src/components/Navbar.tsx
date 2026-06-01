import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/clickbox-logo.jpeg";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/#services" },
  { label: "About", path: "/#about" },
  { label: "Team", path: "/team" },
  { label: "Product", path: "/product" },
  { label: "Contact", path: "/contact" },
  { label: "Fellowship", path: "/internship" },
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3">
          <img src={logo} alt="ClickBox" className="h-10 w-10 rounded-md object-cover" />
          <span className="font-heading text-xl font-bold text-foreground">ClickBox</span>
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
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            Fellowship
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 pb-6 pt-4 md:hidden">
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
            to="/product"
            onClick={() => setMobileOpen(false)}
            className="mt-3 block rounded-md bg-primary px-5 py-2.5 text-center text-sm font-semibold text-primary-foreground"
          >
            Join Waitlist
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
