import { describe, expect, it } from "vitest";
import { isStoredResumePath, validateResumeFile } from "@/lib/resumeUpload";

const mockFile = (name: string, type: string, size: number) =>
  new File([new Uint8Array(size)], name, { type });

describe("resumeUpload", () => {
  it("accepts valid PDF files", () => {
    const result = validateResumeFile(mockFile("resume.pdf", "application/pdf", 1024));
    expect(result.ok).toBe(true);
  });

  it("accepts valid Word files by extension when MIME is empty", () => {
    const result = validateResumeFile(mockFile("resume.docx", "", 1024));
    expect(result.ok).toBe(true);
  });

  it("rejects unsupported file types", () => {
    const result = validateResumeFile(mockFile("resume.exe", "application/octet-stream", 1024));
    expect(result.ok).toBe(false);
  });

  it("rejects files larger than 5MB", () => {
    const result = validateResumeFile(mockFile("resume.pdf", "application/pdf", 6 * 1024 * 1024));
    expect(result.ok).toBe(false);
  });

  it("detects stored resume paths", () => {
    expect(isStoredResumePath("uuid-123/170000-resume.pdf")).toBe(true);
    expect(isStoredResumePath("https://example.com/resume.pdf")).toBe(false);
  });
});
