import { describe, expect, it } from "vitest";
import { formatZodError } from "@/lib/formErrors";
import {
  isUrlLike,
  isValidUrl,
  normalizeUrl,
  sanitizeUrlInput,
  validateCertificationLinks,
} from "@/lib/urlValidation";
import { z } from "zod";

describe("urlValidation", () => {
  it("accepts URLs with https protocol", () => {
    expect(isValidUrl("https://linkedin.com/in/example")).toBe(true);
    expect(normalizeUrl("https://linkedin.com/in/example")).toBe("https://linkedin.com/in/example");
  });

  it("accepts URLs with http protocol", () => {
    expect(isValidUrl("http://github.com/example")).toBe(true);
    expect(normalizeUrl("http://github.com/example")).toBe("http://github.com/example");
  });

  it("accepts URLs without protocol and normalizes to https", () => {
    expect(isValidUrl("linkedin.com/in/example")).toBe(true);
    expect(normalizeUrl("linkedin.com/in/example")).toBe("https://linkedin.com/in/example");
    expect(normalizeUrl("github.com/example")).toBe("https://github.com/example");
    expect(normalizeUrl("portfolio.com")).toBe("https://portfolio.com");
  });

  it("trims whitespace and trailing punctuation from pasted URLs", () => {
    expect(isValidUrl("  linkedin.com/in/example  ")).toBe(true);
    expect(sanitizeUrlInput("github.com/example,")).toBe("github.com/example");
    expect(normalizeUrl("  github.com/example.  ")).toBe("https://github.com/example");
  });

  it("rejects malformed and dangerous URLs", () => {
    expect(isValidUrl("not a url")).toBe(false);
    expect(isValidUrl("http://")).toBe(false);
    expect(isValidUrl("")).toBe(false);
    expect(isValidUrl("javascript:alert(1)")).toBe(false);
    expect(isValidUrl("data:text/html,test")).toBe(false);
  });

  it("validates multiline certification links with line numbers", () => {
    const result = validateCertificationLinks(
      "credly.com/badges/abc\n  github.com/example  ",
    );
    expect(result).toEqual({
      ok: true,
      value: "https://credly.com/badges/abc\nhttps://github.com/example",
    });
  });

  it("reports the failing certification link line", () => {
    const result = validateCertificationLinks("valid.com/cert\nnot valid");
    expect(result).toEqual({ ok: false, line: 2, invalidValue: "not valid" });
  });

  it("detects URL-like admin values and builds clickable hrefs", () => {
    expect(isUrlLike("linkedin.com/in/example")).toBe(true);
    expect(normalizeUrl("linkedin.com/in/example")).toBe("https://linkedin.com/in/example");
  });
});

describe("formErrors", () => {
  it("maps zod issues to labeled field errors", () => {
    const schema = z.object({
      linkedin: z.string().min(1, "LinkedIn Profile: Please enter a valid URL"),
    });
    const parsed = schema.safeParse({ linkedin: "" });
    if (parsed.success) throw new Error("expected failure");

    const result = formatZodError(parsed.error);
    expect(result.fieldErrors.linkedin).toContain("LinkedIn Profile");
    expect(result.message).toContain("LinkedIn Profile");
  });
});
