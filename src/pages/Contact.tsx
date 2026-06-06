import { Mail, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FormField,
  FormShell,
  fieldClass,
  submitContact,
} from "@/components/forms/FormShell";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="section-padding pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
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
                  <Mail className="mt-1 h-5 w-5 text-primary" strokeWidth={1.5} />
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
                  <MapPin className="mt-1 h-5 w-5 text-primary" strokeWidth={1.5} />
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

            <FormShell
              onSubmit={submitContact}
              successTitle="Message sent"
              successMessage="Thanks — our team will respond shortly."
            >
              {({ fieldErrors }) => (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField name="name" label="Name" required error={fieldErrors.name}>
                      <input required maxLength={120} autoComplete="name" />
                    </FormField>
                    <FormField name="email" label="Email" required error={fieldErrors.email}>
                      <input type="email" required maxLength={255} autoComplete="email" />
                    </FormField>
                    <FormField name="phone" label="Phone" error={fieldErrors.phone}>
                      <input maxLength={40} autoComplete="tel" inputMode="tel" />
                    </FormField>
                    <FormField name="company" label="Company" error={fieldErrors.company}>
                      <input maxLength={150} autoComplete="organization" />
                    </FormField>
                  </div>
                  <FormField name="subject" label="Subject" required error={fieldErrors.subject}>
                    <input required maxLength={200} />
                  </FormField>
                  <FormField name="message" label="Message" required error={fieldErrors.message}>
                    <textarea required rows={5} maxLength={5000} />
                  </FormField>
                </>
              )}
            </FormShell>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
