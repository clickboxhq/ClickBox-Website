import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type NavDropdownItem = {
  label: string;
  path: string;
  /** Optional supporting line rendered under the label (e.g. for product menus). */
  description?: string;
};

type Props = {
  label: string;
  items: NavDropdownItem[];
  onNavigate?: () => void;
  mobile?: boolean;
  isActive?: boolean;
};

const isItemActive = (path: string, pathname: string, search: string): boolean => {
  const [itemPath, itemQuery] = path.split("?");
  if (pathname !== itemPath && !pathname.startsWith(itemPath + "/")) return false;
  if (!itemQuery) return pathname === itemPath || pathname.startsWith(itemPath + "/");
  const params = new URLSearchParams(itemQuery);
  const current = new URLSearchParams(search);
  for (const [key, value] of params.entries()) {
    if (current.get(key) !== value) return false;
  }
  return true;
};

const NavDropdown = ({ label, items, onNavigate, mobile = false, isActive = false }: Props) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const childActive = items.some((item) =>
    isItemActive(item.path, location.pathname, location.search),
  );
  const active = isActive || childActive;

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (mobile) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.relatedTarget as Node)) {
        setOpen(false);
      }
    };
    const root = rootRef.current;
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    root?.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      root?.removeEventListener("focusout", onFocusOut);
    };
  }, [mobile]);

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  if (mobile) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02]">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`flex w-full items-center justify-between px-4 py-3.5 text-[15px] font-medium transition-colors ${
            active ? "text-foreground" : "text-muted-foreground"
          }`}
          aria-expanded={open}
        >
          {label}
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-white/[0.06]"
            >
              <ul className="py-1">
                {items.map((item) => {
                  const itemActive = isItemActive(item.path, location.pathname, location.search);
                  return (
                    <li key={item.label}>
                      <Link
                        to={item.path}
                        onClick={close}
                        aria-current={itemActive ? "page" : undefined}
                        className={`block px-5 py-3 transition-colors ${
                          itemActive
                            ? "text-foreground"
                            : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                        }`}
                      >
                        <span className="block text-sm font-medium">{item.label}</span>
                        {item.description && (
                          <span className="mt-0.5 block text-xs leading-snug text-muted-foreground/70">
                            {item.description}
                          </span>
                        )}
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
      role="listitem"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${
          active ? "text-foreground" : "text-muted-foreground hover:text-primary"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {active && (
        <span className="absolute -bottom-[14px] left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full nav-accent-indicator" />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-[calc(100%+0.75rem)] z-50 min-w-[15rem] overflow-hidden rounded-md border border-[rgba(189,196,198,0.18)] bg-[#000000] py-2 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          >
            <ul role="menu" aria-label={label}>
              {items.map((item) => {
                const itemActive = isItemActive(item.path, location.pathname, location.search);
                return (
                  <li key={item.label} role="none">
                    <Link
                      to={item.path}
                      onClick={close}
                      role="menuitem"
                      aria-current={itemActive ? "page" : undefined}
                      className={`block px-5 py-3 transition-colors ${
                        itemActive
                          ? "bg-white/[0.03] text-foreground"
                          : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm font-medium">
                        {item.label}
                        {itemActive && (
                          <span className="h-1 w-1 rounded-full bg-primary" aria-hidden />
                        )}
                      </span>
                      {item.description && (
                        <span className="mt-0.5 block max-w-[15rem] text-xs leading-snug text-muted-foreground/70">
                          {item.description}
                        </span>
                      )}
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

export default NavDropdown;
