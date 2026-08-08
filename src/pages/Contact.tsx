import { Mail, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TallyEmbed } from "@/components/forms/TallyEmbed";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="section-padding pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <p className="section-label mb-3">
                Get in Touch
              </p>
              <h1 className="font-heading text-3xl font-bold text-foreground md:text-5xl">
                Contact Us
              </h1>
              <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
                Have a question about our services, need a security consultation, or want to learn
                more about our upcoming phishing detection tool? We'd love to hear from you.
              </p>

              <div className="mt-12 space-y-6">
                <div className="glass-card flex items-start gap-4 p-5">
                  <Mail className="mt-1 h-5 w-5 text-[#FFFFFF]" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Email</p>
                    <a
                      href="mailto:info@useclickbox.com"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      info@useclickbox.com
                    </a>
                  </div>
                </div>
                <div className="glass-card flex items-start gap-4 p-5">
                  <MapPin className="mt-1 h-5 w-5 text-[#FFFFFF]" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Location</p>
                    <p className="text-sm text-muted-foreground">Global</p>
                  </div>
                </div>
              </div>

              <p className="mt-12 text-xs text-muted-foreground">
                Need support? Reach us directly at{" "}
                <a
                  href="mailto:info@useclickbox.com"
                  className="text-primary hover:underline"
                >
                  info@useclickbox.com
                </a>
              </p>
            </div>

            <TallyEmbed
              formId="44Odpr"
              height={1051}
              title="Contact Us"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
