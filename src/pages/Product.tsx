import { Shield, FlaskConical, FileBarChart, Brain } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TallyEmbed from "@/components/TallyEmbed";
import { TALLY_FORMS } from "@/config/tally";
import productHero from "@/assets/product-hero.jpeg";

const features = [
  { icon: Shield, title: "Smart Detection Engine", desc: "Instantly flags suspicious emails and links using AI-powered analysis." },
  { icon: FlaskConical, title: "Built-in Sandbox", desc: "Safely detonate and observe phishing payloads in an isolated environment." },
  { icon: FileBarChart, title: "Detailed Reports", desc: "Get clear insights into what's safe, what's not, and why." },
  { icon: Brain, title: "Continuous Learning", desc: "The system adapts to new threats, making detection smarter every day." },
];

const Product = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="section-padding pt-32 border-b border-border">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-block rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground">
                Coming Soon
              </div>
              <h1 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-5xl">
                Stay Ahead of{" "}
                <span className="text-gradient">Phishing Threats</span>
              </h1>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Emails, links, and attachments — one wrong click can cost everything. Our upcoming AI-powered phishing detection tool is designed to protect your organization before threats strike.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                With an intuitive sandbox environment, you can safely test suspicious emails and URLs, see how they behave, and understand their risk level — all without compromising your system.
              </p>
              <p className="mt-4 text-sm font-medium text-primary">
                No complex setup. No cybersecurity degree required. Just smart protection made simple.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <img src={productHero} alt="ClickBox Phishing Detection Tool" className="w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding border-b border-border">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Key Features</p>
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl mb-12">
            What Makes It Different
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/30 hover:border-glow">
                <f.icon className="mb-4 h-8 w-8 text-primary" strokeWidth={1.5} />
                <h3 className="font-heading text-base font-semibold text-card-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tally Form: Inquiries, Demos, Beta Access, Partnerships */}
      <section className="section-padding">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Get In Touch</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Product Inquiries, Demos & Beta Access
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Request a demo, join the beta, or explore a partnership. Submit the form below and our team will follow up.
            </p>
          </div>

          <TallyEmbed
            url={TALLY_FORMS.product ?? undefined}
            title="ClickBox Product Inquiry"
            formName="Product Inquiry"
            minHeight={820}
            placeholderHint="Designed for: product inquiries, demo requests, beta access requests, and partnership requests."
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Product;
