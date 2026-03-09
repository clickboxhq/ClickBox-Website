import { Link } from "react-router-dom";
import logo from "@/assets/clickbox-logo.jpeg";

const Footer = () => (
  <footer className="border-t border-border bg-background">
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="ClickBox" className="h-8 w-8 rounded-md object-cover" />
            <span className="font-heading text-lg font-bold text-foreground">ClickBox</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Helping organizations build securely in an evolving digital landscape.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold text-foreground mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/#services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Services</Link>
            <Link to="/#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link>
            <Link to="/product" className="text-sm text-muted-foreground hover:text-primary transition-colors">Product</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold text-foreground mb-4">Contact</h4>
          <p className="text-sm text-muted-foreground">info@clickbox.ng</p>
        </div>
      </div>
      <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ClickBox Information Technology Ltd. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
