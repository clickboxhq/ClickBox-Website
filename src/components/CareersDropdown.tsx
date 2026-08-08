import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { NavDropdownItem } from "@/components/NavDropdown";

type Props = {
  items: NavDropdownItem[];
  mobile?: boolean;
  onNavigate?: () => void;
};

const triggerBtn =
  "inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-secondary/80 px-5 py-2 text-sm font-semibold text-secondary-foreground backdrop-blur transition-all hover:bg-muted hover:border-primary/20";

const CareersDropdown = ({ items, mobile = false, onNavigate }: Props) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const active = items.some(
    (item) => location.pathname === item.path || location.pathname.startsWith(item.path + "/"),
  );

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobile) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [mobile]);

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  if (mobile) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`flex w-full items-center justify-center gap-1.5 ${triggerBtn} py-3`}
          aria-expanded={open}
          aria-haspopup="true"
        >
          Careers
          <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <ul className="mt-2 space-y-1 rounded-xl border border-white/[0.06] bg-white/[0.02] py-1">
                {items.map((item) => {
                  const itemActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
                  return (
                    <li key={item.label}>
                      <Link
                        to={item.path}
                        onClick={close}
                        className={`block px-5 py-3 text-center text-sm transition-colors ${
                          itemActive ? "text-foreground" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${triggerBtn} ${active ? "border-[#FFFFFF]/40 text-[#FFFFFF]" : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Careers
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-[calc(100%+0.75rem)] z-50 min-w-[13rem] overflow-hidden rounded-md border border-[rgba(189,196,198,0.18)] bg-[#000000] py-2 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          >
            <ul>
              {items.map((item) => {
                const itemActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
                return (
                  <li key={item.label}>
                    <Link
                      to={item.path}
                      onClick={close}
                      className={`block px-5 py-3 text-sm transition-colors ${
                        itemActive ? "text-foreground" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareersDropdown;
