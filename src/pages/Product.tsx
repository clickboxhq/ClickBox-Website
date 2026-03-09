import { useState } from "react";
import { Shield, FlaskConical, FileBarChart, Brain, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import productHero from "@/assets/product-hero.jpeg";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const features = [
  { icon: Shield, title: "Smart Detection Engine", desc: "Instantly flags suspicious emails and links using AI-powered analysis." },
  { icon: FlaskConical, title: "Built-in Sandbox", desc: "Safely detonate and observe phishing payloads in an isolated environment." },
  { icon: FileBarChart, title: "Detailed Reports", desc: "Get clear insights into what's safe, what's not, and why." },
  { icon: Brain, title: "Continuous Learning", desc: "The system adapts to new threats, making detection smarter every day." },
];

const describOptions = ["Individual / Personal user", "Small business owner", "Tech startup / company", "IT / Security professional", "Educational institution", "Other"];
const protectionOptions = ["No tool — we rely on awareness", "Use built-in email protection (e.g., Gmail, Outlook filters)", "Use a third-party security solution", "Have an internal security team", "Other"];
const phishingExpOptions = ["Yes, multiple times", "Yes, once", "Not sure", "No"];
const interestOptions = ["Yes, definitely", "Maybe — depends on the price", "Not sure yet"];
const subscriptionOptions = ["Monthly Subscription", "Annual Subscription", "Either works, depending on cost"];
const featureOptions = [
  "Real-time phishing detection", "Browser/email integration", "Built-in Sandbox (Automatic blocking/quarantine)",
  "Reporting dashboard", "Threat intelligence updates", "User awareness & alerts",
  "Clean and intuitive UI/UX experience", "Team security score or metrics",
];

const Product = () => {
  const [form, setForm] = useState({
    name: "", email: "", country: "", describes: "", protection: "", phishingExp: "",
    interest: "", subscription: "", features: [] as string[], joinWaitlist: "", consent: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (field: string, value: string | boolean | string[]) => setForm((p) => ({ ...p, [field]: value }));

  const toggleFeature = (f: string) => {
    setForm((p) => ({
      ...p,
      features: p.features.includes(f) ? p.features.filter((x) => x !== f) : [...p.features, f],
    }));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.country || !form.describes || !form.protection || !form.phishingExp || !form.interest || !form.subscription || !form.features.length || !form.joinWaitlist || !form.consent) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("waitlist_submissions").insert({
      full_name: form.name,
      email: form.email,
      country: form.country,
      describes: form.describes,
      protection: form.protection,
      phishing_experience: form.phishingExp,
      interest: form.interest,
      subscription: form.subscription,
      features: form.features,
      join_waitlist: form.joinWaitlist,
      consent: form.consent,
    });
    setLoading(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
    toast.success("You've been added to the waitlist!");
  };

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

      {/* Waitlist Form */}
      <section className="section-padding">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Join Our Waitlist</p>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Get Early Access
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Be among the first to experience this next-generation phishing defense tool. Enter your details below to get early access, updates, and exclusive launch offers.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              For information about our privacy practices, check out our{" "}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-lg border border-primary/30 bg-card p-12 text-center border-glow">
              <CheckCircle className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="font-heading text-2xl font-bold text-foreground">You're on the list!</h3>
              <p className="mt-2 text-muted-foreground">We'll be in touch with updates and early access details.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Text inputs */}
              <FormField label="What's your full name?" required>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="John Doe"
                />
              </FormField>

              <FormField label="What's your email address?" required>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="john@company.com"
                />
              </FormField>

              <FormField label="Which country are you currently based in?" required>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Nigeria"
                />
              </FormField>

              {/* Radio groups */}
              <RadioGroup label="Which of these best describes you?" options={describOptions} value={form.describes} onChange={(v) => update("describes", v)} />
              <RadioGroup label="How do you currently protect yourself or your organization from phishing attacks?" options={protectionOptions} value={form.protection} onChange={(v) => update("protection", v)} />
              <RadioGroup label="Have you or your organization experienced a phishing attack before?" options={phishingExpOptions} value={form.phishingExp} onChange={(v) => update("phishingExp", v)} />
              <RadioGroup label="Would you be interested in a tool that automatically detects and blocks phishing attempts in real-time — with detailed reports and recommendations?" options={interestOptions} value={form.interest} onChange={(v) => update("interest", v)} />
              <RadioGroup label="How would you prefer to subscribe to this kind of tool?" options={subscriptionOptions} value={form.subscription} onChange={(v) => update("subscription", v)} />

              {/* Checkboxes - features */}
              <FormField label="What features would you find most useful?" required>
                <div className="space-y-2">
                  {featureOptions.map((f) => (
                    <label key={f} className="flex cursor-pointer items-center gap-3 rounded-md border border-input bg-secondary px-4 py-3 text-sm text-foreground transition-colors hover:border-primary/40">
                      <input
                        type="checkbox"
                        checked={form.features.includes(f)}
                        onChange={() => toggleFeature(f)}
                        className="h-4 w-4 rounded border-input accent-primary"
                      />
                      {f}
                    </label>
                  ))}
                </div>
              </FormField>

              <RadioGroup label="Would you like to join our waitlist for early access when the tool launches?" options={["Yes", "No"]} value={form.joinWaitlist} onChange={(v) => update("joinWaitlist", v)} />

              {/* Consent */}
              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-input bg-secondary px-4 py-4 text-sm text-foreground transition-colors hover:border-primary/40">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
                />
                <span className="text-muted-foreground leading-relaxed">
                  I agree that my data is being collected solely for research and communication about this phishing detection project. My information will not be shared, sold, or used for any other purpose.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit & Join Waitlist"}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FormField = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-foreground">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    {children}
  </div>
);

const RadioGroup = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) => (
  <FormField label={label} required>
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors ${
            value === opt ? "border-primary bg-accent/20 text-foreground" : "border-input bg-secondary text-foreground hover:border-primary/40"
          }`}
        >
          <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${value === opt ? "border-primary" : "border-muted-foreground"}`}>
            {value === opt && <div className="h-2 w-2 rounded-full bg-primary" />}
          </div>
          {opt}
        </label>
      ))}
    </div>
  </FormField>
);

export default Product;
