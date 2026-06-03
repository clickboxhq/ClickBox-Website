import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type SubmitResult = { ok: true } | { ok: false; message: string };

type FormShellProps = {
  children: (state: { submitting: boolean; submitted: boolean }) => ReactNode;
  onSubmit: (data: FormData) => Promise<SubmitResult>;
  successTitle?: string;
  successMessage?: string;
};

// ---- Client-side rate limiting (per browser, per form-shell instance) ----
const RATE_KEY = "clickbox:form-submit:last";
const RATE_MIN_INTERVAL_MS = 5_000;

const isRateLimited = () => {
  try {
    const last = Number(sessionStorage.getItem(RATE_KEY) || 0);
    return Date.now() - last < RATE_MIN_INTERVAL_MS;
  } catch {
    return false;
  }
};

const markSubmitted = () => {
  try {
    sessionStorage.setItem(RATE_KEY, String(Date.now()));
  } catch {
    // ignore
  }
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
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot
    if ((fd.get("website") as string)?.length) return;

    if (isRateLimited()) {
      toast.error("Please wait a moment", {
        description: "You're submitting too quickly. Try again in a few seconds.",
      });
      return;
    }

    setSubmitting(true);
    const res = await onSubmit(fd);
    setSubmitting(false);

    if (res.ok === true) {
      markSubmitted();
      setSubmitted(true);
      toast.success(successTitle, { description: successMessage });
      form.reset();
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
    <form onSubmit={handle} className="glass-card p-6 md:p-8 space-y-5" noValidate>
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

export const fieldClass =
  "w-full rounded-md border border-white/10 bg-background/50 backdrop-blur px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition";

export const Label = ({ children, required }: { children: ReactNode; required?: boolean }) => (
  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
    {children}
    {required && <span className="text-primary"> *</span>}
  </label>
);

// ---- Sanitization helpers ----
const clean = (v: FormDataEntryValue | null, max = 2000) =>
  String(v ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "") // strip control chars
    .trim()
    .slice(0, max);

const nullable = (v: string) => (v ? v : null);

// ---- Mirror to Google Sheets (non-blocking) ----
const mirrorToSheets = async (
  tab: "fellowship" | "product" | "contact",
  row: Record<string, unknown>,
) => {
  try {
    await supabase.functions.invoke("mirror-to-sheets", { body: { tab, row } });
  } catch {
    // Silent — Sheets mirror is non-critical; primary storage is the database.
  }
};

// ---- Schemas ----
const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(40).optional().nullable(),
  company: z.string().trim().max(150).optional().nullable(),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(5, "Message is too short").max(5000),
});

const productSchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(150),
  email: z.string().trim().email().max(255),
  product_interest: z.string().trim().min(1).max(200),
  message: z.string().trim().min(5).max(5000),
});

const fellowshipSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  linkedin: z.string().trim().url("Enter a valid LinkedIn URL").max(300),
  resume_url: z.string().trim().url().max(500).optional().nullable(),
  preferred_pathway: z.string().trim().min(1).max(120),
  certifications: z.string().trim().max(1000).optional().nullable(),
  certification_links: z.string().trim().max(2000).optional().nullable(),
  relevant_experience: z.string().trim().max(2000).optional().nullable(),
  motivation: z.string().trim().min(10, "Tell us a bit more").max(2000),
  portfolio: z.string().trim().url().max(500).optional().nullable(),
});

const firstError = (e: z.ZodError) =>
  e.issues[0]?.message ?? "Please review the highlighted fields.";

export const submitContact = async (fd: FormData): Promise<SubmitResult> => {
  const parsed = contactSchema.safeParse({
    name: clean(fd.get("name"), 120),
    email: clean(fd.get("email"), 255),
    phone: nullable(clean(fd.get("phone"), 40)),
    company: nullable(clean(fd.get("company"), 150)),
    subject: clean(fd.get("subject"), 200),
    message: clean(fd.get("message"), 5000),
  });
  if (!parsed.success) return { ok: false, message: firstError(parsed.error) };

  const { error } = await supabase.from("contact_submissions").insert(parsed.data as never);
  if (error) return { ok: false, message: error.message };
  await mirrorToSheets("contact", parsed.data);
  return { ok: true };
};

export const submitProduct = async (fd: FormData): Promise<SubmitResult> => {
  const parsed = productSchema.safeParse({
    name: clean(fd.get("name"), 120),
    company: clean(fd.get("company"), 150),
    email: clean(fd.get("email"), 255),
    product_interest: clean(fd.get("product_interest"), 200),
    message: clean(fd.get("message"), 5000),
  });
  if (!parsed.success) return { ok: false, message: firstError(parsed.error) };

  const { error } = await supabase.from("product_inquiries").insert(parsed.data as never);
  if (error) return { ok: false, message: error.message };
  await mirrorToSheets("product", parsed.data);
  return { ok: true };
};

export const submitFellowship = async (fd: FormData): Promise<SubmitResult> => {
  const parsed = fellowshipSchema.safeParse({
    full_name: clean(fd.get("full_name"), 120),
    email: clean(fd.get("email"), 255),
    linkedin: clean(fd.get("linkedin"), 300),
    resume_url: nullable(clean(fd.get("resume_url"), 500)),
    preferred_pathway: clean(fd.get("preferred_pathway"), 120),
    certifications: nullable(clean(fd.get("certifications"), 1000)),
    certification_links: nullable(clean(fd.get("certification_links"), 2000)),
    relevant_experience: nullable(clean(fd.get("relevant_experience"), 2000)),
    motivation: clean(fd.get("motivation"), 2000),
    portfolio: nullable(clean(fd.get("portfolio"), 500)),
  });
  if (!parsed.success) return { ok: false, message: firstError(parsed.error) };

  const { error } = await supabase.from("fellowship_applications").insert(parsed.data as never);
  if (error) return { ok: false, message: error.message };
  await mirrorToSheets("fellowship", parsed.data);
  return { ok: true };
};
