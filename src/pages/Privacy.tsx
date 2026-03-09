import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="section-padding pt-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-foreground md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: March 2026</p>

        <div className="mt-12 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              ClickBox Information Technology Ltd ("ClickBox", "we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p className="mb-2">We may collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full name and email address</li>
              <li>Country of residence</li>
              <li>Organizational role and type</li>
              <li>Information about your current security practices</li>
              <li>Feature preferences and product feedback</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Process waitlist registrations and provide early access</li>
              <li>Communicate product updates and launch information</li>
              <li>Improve our products and services</li>
              <li>Conduct research to better understand user needs</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">4. Data Protection</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. We comply with the Nigerian Data Protection Regulation (NDPR) and follow industry best practices for data security.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">5. Data Sharing</h2>
            <p>
              We do not sell, trade, or share your personal information with third parties for marketing purposes. Your data is collected solely for research and communication about our products and services.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">6. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent at any time</li>
              <li>Lodge a complaint with the relevant data protection authority</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at{" "}
              <a href="mailto:info@useclickbox.com" className="text-primary hover:underline">info@useclickbox.com</a>.
            </p>
          </section>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Privacy;
