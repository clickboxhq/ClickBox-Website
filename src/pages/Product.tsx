import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import productHero from "@/assets/product-hero.jpeg";
import { TallyEmbed } from "@/components/forms/TallyEmbed";

const Product = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="section-padding border-b border-white/5 pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="badge-accent-frame mb-6 inline-block rounded-full bg-[#0D2028] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
                PhishBox Ai
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
              <p className="mt-4 text-sm font-medium text-[#53B5E0]">
                No complex setup. No cybersecurity degree required. Just smart protection made
                simple.
              </p>
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <img
                src={productHero}
                alt="PhishBox Ai — ClickBox phishing detection"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="section-label mb-3">Get In Touch</p>
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
