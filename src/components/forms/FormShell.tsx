import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatZodError, type FieldErrors, type ValidationFailure } from "@/lib/formErrors";
import {
  sanitizeEmail,
  sanitizeMultilineText,
  sanitizeOptionalText,
  sanitizePhone,
  sanitizeText,
} from "@/lib/inputSanitization";
import {
  isValidUrl,
  normalizeUrl,
  validateCertificationLinks,
  validateResumeUrl,
} from "@/lib/urlValidation";

type SubmitResult = { ok: true } | { ok: false; message: string; fieldErrors?: FieldErrors };

type FormShellProps = {
  children: (state: {
    submitting: boolean;
    submitted: boolean;
    fieldErrors: FieldErrors;
  }) => ReactNode;
  onSubmit: (data: FormData) => Promise<SubmitResult>;
  successTitle?: string;
  successMessage?: string;
  /** Scroll the success message into view after submit (default: true) */
  scrollOnSuccess?: boolean;
};

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

export const fieldClass =
  "w-full rounded-md border border-white/10 bg-background/50 backdrop-blur px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition";

export const selectFieldClass =
  "w-full appearance-none rounded-md border border-white/10 bg-background/50 backdrop-blur px-4 py-2.5 pr-10 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition cursor-pointer bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat [background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")]";

export const fieldErrorClass =
  "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/30";

export const fileInputClass =
  "block w-full cursor-pointer text-sm text-muted-foreground file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-primary-foreground hover:file:opacity-90";

export const Label = ({
  children,
  required,
  htmlFor,
}: {
  children: ReactNode;
  required?: boolean;
  htmlFor?: string;
}) => (
  <label
    htmlFor={htmlFor}
    className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
  >
    {children}
    {required && <span className="text-primary"> *</span>}
  </label>
);

type FormFieldProps = {
  name: string;
  label: ReactNode;
  required?: boolean;
  error?: string;
  children: ReactElement<{ id?: string; name?: string; className?: string }>;
};

export const FormField = ({ name, label, required, error, children }: FormFieldProps) => {
  const isFileInput = isValidElement(children) && children.props.type === "file";
  const inputClass = isFileInput
    ? [fileInputClass, error ? "rounded-md ring-1 ring-red-500/50" : ""].filter(Boolean).join(" ")
    : [fieldClass, error ? fieldErrorClass : "", children.props.className].filter(Boolean).join(" ");

  const control = isValidElement(children)
    ? cloneElement(children, {
        id: name,
        name,
        className: inputClass,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? `${name}-error` : undefined,
      })
    : children;

  return (
    <div data-field={name}>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      {control}
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export const FormShell = ({
  children,
  onSubmit,
  successTitle = "Submission received",
  successMessage = "Thanks — we'll be in touch shortly.",
  scrollOnSuccess = true,
}: FormShellProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!submitted || !scrollOnSuccess || !successRef.current) return;

    const el = successRef.current;
    const navbarOffset = 96;
    const top = el.getBoundingClientRect().top + window.scrollY - navbarOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [scrollOnSuccess, submitted]);

  const handle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    if ((fd.get("website") as string)?.length) return;

    if (isRateLimited()) {
      toast.error("Please wait a moment", {
        description: "You're submitting too quickly. Try again in a few seconds.",
      });
      return;
    }

    setSubmitting(true);
    setFieldErrors({});

    const res = await onSubmit(fd);
    setSubmitting(false);

    if (res.ok === true) {
      markSubmitted();
      setSubmitted(true);
      toast.success(successTitle, { description: successMessage });
      form.reset();
      return;
    }

    setFieldErrors(res.fieldErrors ?? {});
    toast.error("Submission failed", { description: res.message });

    const firstField = Object.keys(res.fieldErrors ?? {})[0];
    if (firstField) {
      form.querySelector(`[name="${firstField}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (submitted) {
    return (
      <div ref={successRef} className="glass-card p-12 text-center scroll-mt-24">
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
    <form
      onSubmit={handle}
      className="glass-card space-y-5 p-6 md:p-8"
      noValidate
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      {children({ submitting, submitted, fieldErrors })}
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

const optionalUrl = (fieldLabel: string, max: number) =>
  z
    .union([z.string(), z.null(), z.undefined()])
    .transform((v) => {
      const s = sanitizeText(v, max);
      return s ? s : null;
    })
    .superRefine((v, ctx) => {
      if (v === null) return;
      if (!isValidUrl(v)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${fieldLabel}: Please enter a valid URL`,
        });
      }
    })
    .transform((v) => (v === null ? null : normalizeUrl(v).slice(0, max)));

const requiredUrl = (fieldLabel: string, max: number) =>
  z
    .string()
    .transform((v) => sanitizeText(v, max))
    .superRefine((v, ctx) => {
      if (!v) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${fieldLabel}: Please enter a valid URL`,
        });
        return;
      }
      if (!isValidUrl(v)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${fieldLabel}: Please enter a valid URL`,
        });
      }
    })
    .transform((v) => normalizeUrl(v));

const contactSchema = z.object({
  name: z.string().transform((v) => sanitizeText(v, 120)).pipe(z.string().min(1, "Name is required").max(120)),
  email: z
    .string()
    .transform((v) => sanitizeEmail(v))
    .pipe(z.string().email("Email: Please enter a valid email address").max(255)),
  phone: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((v) => sanitizePhone(v, 40)),
  company: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((v) => sanitizeOptionalText(v, 150)),
  subject: z
    .string()
    .transform((v) => sanitizeText(v, 200))
    .pipe(z.string().min(1, "Subject is required").max(200)),
  message: z
    .string()
    .transform((v) => sanitizeMultilineText(v, 5000))
    .pipe(z.string().min(5, "Message: Please enter at least 5 characters").max(5000)),
});

const productSchema = z.object({
  name: z
    .string()
    .transform((v) => sanitizeText(v, 120))
    .pipe(z.string().min(1, "Name is required").max(120)),
  company: z
    .string()
    .transform((v) => sanitizeText(v, 150))
    .pipe(z.string().min(1, "Company is required").max(150)),
  email: z
    .string()
    .transform((v) => sanitizeEmail(v))
    .pipe(z.string().email("Email: Please enter a valid email address").max(255)),
  product_interest: z
    .string()
    .transform((v) => sanitizeText(v, 200))
    .pipe(z.string().min(1, "Product Interest: Please select an option").max(200)),
  message: z
    .string()
    .transform((v) => sanitizeMultilineText(v, 5000))
    .pipe(z.string().min(5, "Message: Please enter at least 5 characters").max(5000)),
});

const fellowshipSchema = z.object({
  full_name: z
    .string()
    .transform((v) => sanitizeText(v, 120))
    .pipe(z.string().min(1, "Full Name is required").max(120)),
  email: z
    .string()
    .transform((v) => sanitizeEmail(v))
    .pipe(z.string().email("Email: Please enter a valid email address").max(255)),
  linkedin: requiredUrl("LinkedIn Profile", 300),
  resume_url: z
    .string()
    .transform((v) => v.trim())
    .superRefine((v, ctx) => {
      const result = validateResumeUrl(v);
      if (!result.valid) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Resume Link: ${result.error}` });
      }
    })
    .transform((v) => {
      const r = validateResumeUrl(v);
      return r.valid ? r.sanitized : v;
    }),
  preferred_pathway: z
    .string()
    .transform((v) => sanitizeText(v, 120))
    .pipe(z.string().min(1, "Preferred Career Pathway: Please select a pathway").max(120)),
  certifications: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((v) => sanitizeOptionalText(v, 1000)),
  certification_links: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((v) => sanitizeOptionalText(v, 2000))
    .superRefine((v, ctx) => {
      if (v === null) return;
      const result = validateCertificationLinks(v);
      if (result.ok) return;
      const preview =
        result.invalidValue.length > 60
          ? `${result.invalidValue.slice(0, 60)}…`
          : result.invalidValue;
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Certification Links (line ${result.line}): Please enter a valid URL — "${preview}"`,
      });
    })
    .transform((v) => {
      if (v === null) return null;
      const result = validateCertificationLinks(v);
      return result.ok ? result.value : null;
    }),
  relevant_experience: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((v) => sanitizeOptionalText(v, 2000)),
  motivation: z
    .string()
    .transform((v) => sanitizeMultilineText(v, 2000))
    .pipe(
      z
        .string()
        .min(10, "Why do you want to join?: Please tell us a bit more (at least 10 characters)")
        .max(2000),
    ),
  portfolio: optionalUrl("Portfolio / GitHub Link", 500),
});

const parseForm = <T,>(schema: z.ZodType<T>, data: unknown): { ok: true; data: T } | ValidationFailure => {
  const parsed = schema.safeParse(data);
  if (parsed.success) return { ok: true, data: parsed.data };
  return formatZodError(parsed.error);
};

export const submitContact = async (fd: FormData): Promise<SubmitResult> => {
  const parsed = parseForm(contactSchema, {
    name: fd.get("name"),
    email: fd.get("email"),
    phone: fd.get("phone"),
    company: fd.get("company"),
    subject: fd.get("subject"),
    message: fd.get("message"),
  });
  if (!parsed.ok) return parsed;

  const { error } = await supabase.from("contact_submissions").insert(parsed.data as never);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
};

export const submitProduct = async (fd: FormData): Promise<SubmitResult> => {
  const parsed = parseForm(productSchema, {
    name: fd.get("name"),
    company: fd.get("company"),
    email: fd.get("email"),
    product_interest: fd.get("product_interest"),
    message: fd.get("message"),
  });
  if (!parsed.ok) return parsed;

  const { error } = await supabase.from("product_inquiries").insert(parsed.data as never);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
};

export const submitFellowship = async (fd: FormData): Promise<SubmitResult> => {
  const parsed = parseForm(fellowshipSchema, {
    full_name: fd.get("full_name"),
    email: fd.get("email"),
    linkedin: fd.get("linkedin"),
    resume_url: fd.get("resume_url"),
    preferred_pathway: fd.get("preferred_pathway"),
    certifications: fd.get("certifications"),
    certification_links: fd.get("certification_links"),
    relevant_experience: fd.get("relevant_experience"),
    motivation: fd.get("motivation"),
    portfolio: fd.get("portfolio"),
  });
  if (!parsed.ok) return parsed;

  const { error } = await supabase.from("fellowship_applications").insert(parsed.data as never);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
};
