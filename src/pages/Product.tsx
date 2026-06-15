import { Shield, FlaskConical, FileBarChart, Brain } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import productHero from "@/assets/product-hero.jpeg";
import { TallyEmbed } from "@/components/forms/TallyEmbed";

const features = [
  {
    icon: Shield,
    title: "Smart Detection Engine",
    desc: "Instantly flags suspicious emails and links using AI-powered analysis.",
  },
  {
    icon: FlaskConical,
    title: "Built-in Sandbox",
    desc: "Safely detonate and observe phishing payloads in an isolated environment.",
  },
  {
    icon: FileBarChart,
    title: "Detailed Reports",
    desc: "Get clear insights into what's safe, what's not, and why.",
  },
  {
    icon: Brain,
    title: "Continuous Learning",
    desc: "The system adapts to new threats, making detection smarter every day.",
  },
];

const Product = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="section-padding pt-32 border-b border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-block rounded-full border border-white/10 bg-secondary/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
                Coming Soon
              </div>
              <h1 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-5xl">
                Stay Ahead of <span className="text-gradient">Phishing Threats</span>
              </h1>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                Emails, links, and attachments — one wrong click can cost everything. Our upcoming
                AI-powered phishing detection tool is designed to protect your organization before
                threats strike.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                With an intuitive sandbox environment, you can safely test suspicious emails and
                URLs, see how they behave, and understand their risk level — all without
                compromising your system.
              </p>
              <p className="mt-4 text-sm font-medium text-primary">
                No complex setup. No cybersecurity degree required. Just smart protection made
                simple.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <img
                src={productHero}
                alt="ClickBox Phishing Detection Tool"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding border-b border-black/5 bg-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Key Features
          </p>
          <h2 className="mb-12 font-heading text-3xl font-bold text-neutral-900 md:text-4xl">
            What Makes It Different
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass-card-dark rounded-xl p-6 transition-all duration-300"
              >
                <f.icon className="mb-4 h-8 w-8 text-primary" strokeWidth={1.5} />
                <h3 className="font-heading text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Get In Touch
            </p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Product Inquiries, Demos & Beta Access
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Request a demo, join the beta, or explore a partnership. Submit the form below and our
              team will follow up.
            </p>
          </div>

          <TallyEmbed
            formId="81r5Jr"
            height={200}
            title="Product Inquiries, Demos & Beta Access"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Product;
