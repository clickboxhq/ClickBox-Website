/**
 * Centralized Tally embed URLs.
 *
 * When the live Tally form is created, paste the full embed URL
 * (e.g. https://tally.so/embed/xxxxxx?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1)
 * into the matching field below. Leave as `null` to render the
 * production-ready placeholder container.
 */
export const TALLY_FORMS = {
  /** Fellowship application — applicant tracking */
  fellowship: null as string | null,
  /** Product inquiries — demo, beta access, partnership requests */
  product: null as string | null,
  /** Contact form — support and business inquiries */
  contact: null as string | null,
};
