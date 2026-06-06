import { describe, expect, it } from "vitest";
import {
  isUrlLike,
  isValidUrl,
  normalizeCertificationLinks,
  normalizeUrl,
  toClickableHref,
} from "@/lib/urlValidation";

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

  it("trims whitespace before validation", () => {
    expect(isValidUrl("  linkedin.com/in/example  ")).toBe(true);
    expect(normalizeUrl("  github.com/example  ")).toBe("https://github.com/example");
  });

  it("rejects malformed URLs", () => {
    expect(isValidUrl("not a url")).toBe(false);
    expect(isValidUrl("http://")).toBe(false);
    expect(isValidUrl("")).toBe(false);
  });

  it("normalizes multiline certification links", () => {
    const result = normalizeCertificationLinks(
      "credly.com/badges/abc\n  github.com/example  ",
    );
    expect(result).toBe("https://credly.com/badges/abc\nhttps://github.com/example");
  });

  it("rejects invalid certification link lines", () => {
    expect(normalizeCertificationLinks("valid.com/cert\nnot valid")).toBeNull();
  });

  it("detects URL-like admin values and builds clickable hrefs", () => {
    expect(isUrlLike("linkedin.com/in/example")).toBe(true);
    expect(toClickableHref("linkedin.com/in/example")).toBe("https://linkedin.com/in/example");
    expect(toClickableHref("https://github.com/example")).toBe("https://github.com/example");
  });
});
