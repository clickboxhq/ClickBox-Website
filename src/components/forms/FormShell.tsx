import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type SubmitResult = { ok: true } | { ok: false; message: string };

type FormShellProps = {
  children: (state: { submitting: boolean; submitted: boolean }) => ReactNode;
  onSubmit: (data: FormData) => Promise<SubmitResult>;
  successTitle?: string;
  successMessage?: string;
};


export const FormShell = ({
  children,
  onSubmit,
  successTitle = "Submission received",
  successMessage = "Thanks — we'll be in touch shortly.",
}: FormShellProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Honeypot
    const fd = new FormData(e.currentTarget);
    if ((fd.get("website") as string)?.length) return;

    setSubmitting(true);
    const res = await onSubmit(fd);
    setSubmitting(false);

    if (res.ok) {
      setSubmitted(true);
      toast.success(successTitle, { description: successMessage });
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error("Submission failed", { description: res.message });
    }

  };

  if (submitted) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/30">
          <CheckCircle2 className="h-7 w-7 text-primary" />
        </div>
        <h3 className="font-heading text-xl font-semibold text-foreground">{successTitle}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{successMessage}</p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm text-primary hover:underline"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handle} className="glass-card p-6 md:p-8 space-y-5">
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      {children({ submitting, submitted })}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

// Shared input styles
export const fieldClass =
  "w-full rounded-md border border-white/10 bg-background/50 backdrop-blur px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition";

export const Label = ({ children, required }: { children: ReactNode; required?: boolean }) => (
  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
    {children}
    {required && <span className="text-primary"> *</span>}
  </label>
);

// Submission helpers
export const submitContact = async (fd: FormData) => {
  const payload = {
    name: String(fd.get("name") || "").trim(),
    email: String(fd.get("email") || "").trim(),
    phone: String(fd.get("phone") || "").trim() || null,
    company: String(fd.get("company") || "").trim() || null,
    subject: String(fd.get("subject") || "").trim(),
    message: String(fd.get("message") || "").trim(),
  };
  if (!payload.name || !payload.email || !payload.subject || !payload.message) {
    return { ok: false as const, message: "Please fill in all required fields." };
  }
  const { error } = await supabase.from("contact_submissions").insert(payload);
  if (error) return { ok: false as const, message: error.message };
  return { ok: true as const };
};

export const submitProduct = async (fd: FormData) => {
  const payload = {
    name: String(fd.get("name") || "").trim(),
    company: String(fd.get("company") || "").trim(),
    email: String(fd.get("email") || "").trim(),
    product_interest: String(fd.get("product_interest") || "").trim(),
    message: String(fd.get("message") || "").trim(),
  };
  if (
    !payload.name ||
    !payload.company ||
    !payload.email ||
    !payload.product_interest ||
    !payload.message
  ) {
    return { ok: false as const, message: "Please fill in all required fields." };
  }
  const { error } = await supabase.from("product_inquiries").insert(payload);
  if (error) return { ok: false as const, message: error.message };
  return { ok: true as const };
};

export const submitFellowship = async (fd: FormData) => {
  const payload = {
    full_name: String(fd.get("full_name") || "").trim(),
    email: String(fd.get("email") || "").trim(),
    linkedin: String(fd.get("linkedin") || "").trim(),
    resume_url: String(fd.get("resume_url") || "").trim() || null,
    preferred_pathway: String(fd.get("preferred_pathway") || "").trim(),
    certifications: String(fd.get("certifications") || "").trim() || null,
    certification_links: String(fd.get("certification_links") || "").trim() || null,
    relevant_experience: String(fd.get("relevant_experience") || "").trim() || null,
    motivation: String(fd.get("motivation") || "").trim(),
    portfolio: String(fd.get("portfolio") || "").trim() || null,
  };
  if (
    !payload.full_name ||
    !payload.email ||
    !payload.linkedin ||
    !payload.preferred_pathway ||
    !payload.motivation
  ) {
    return { ok: false as const, message: "Please fill in all required fields." };
  }
  const { error } = await supabase.from("fellowship_applications").insert(payload);
  if (error) return { ok: false as const, message: error.message };
  return { ok: true as const };
};
