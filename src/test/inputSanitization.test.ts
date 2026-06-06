import { describe, expect, it } from "vitest";
import { sanitizeEmail, sanitizePhone, sanitizeText } from "@/lib/inputSanitization";

describe("inputSanitization", () => {
  it("strips control characters and HTML tags from text", () => {
    expect(sanitizeText("<b>Hello</b> World")).toBe("Hello World");
    expect(sanitizeText("Hello\u0000World")).toBe("HelloWorld");
  });

  it("normalizes email input", () => {
    expect(sanitizeEmail("  Test@Example.COM  ")).toBe("test@example.com");
  });

  it("restricts phone input to safe characters", () => {
    expect(sanitizePhone("+1 (555) 123-4567<script>")).toBe("+1 (555) 123-4567");
    expect(sanitizePhone("   ")).toBeNull();
  });
});
