import { supabase } from "@/integrations/supabase/client";

export const RESUME_BUCKET = "fellowship-resumes";
export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const ALLOWED_EXTENSIONS = new Set(["pdf", "doc", "docx"]);

const sanitizeFilename = (name: string): string => {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
  return base.slice(0, 120) || "resume";
};

const getExtension = (filename: string): string | null => {
  const parts = filename.toLowerCase().split(".");
  if (parts.length < 2) return null;
  return parts.pop() ?? null;
};

export const validateResumeFile = (
  file: File,
): { ok: true } | { ok: false; message: string } => {
  if (!file || file.size === 0) {
    return { ok: false, message: "Resume: Please upload your resume (PDF or Word, max 5MB)" };
  }

  if (file.size > MAX_RESUME_BYTES) {
    return { ok: false, message: "Resume: File must be 5MB or smaller" };
  }

  const extension = getExtension(file.name);
  if (!extension || !ALLOWED_EXTENSIONS.has(extension)) {
    return { ok: false, message: "Resume: Only PDF, DOC, and DOCX files are accepted" };
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    return { ok: false, message: "Resume: Only PDF, DOC, and DOCX files are accepted" };
  }

  return { ok: true };
};

export const uploadResumeFile = async (
  file: File,
): Promise<{ ok: true; path: string } | { ok: false; message: string }> => {
  const validation = validateResumeFile(file);
  if (!validation.ok) return validation;

  const extension = getExtension(file.name)!;
  const safeName = sanitizeFilename(file.name.replace(/\.[^.]+$/, ""));
  const path = `${crypto.randomUUID()}/${Date.now()}-${safeName}.${extension}`;

  const { error } = await supabase.storage.from(RESUME_BUCKET).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    return {
      ok: false,
      message: `Resume: Upload failed — ${error.message}`,
    };
  }

  return { ok: true, path };
};

export const isStoredResumePath = (value: string): boolean =>
  !/^https?:\/\//i.test(value.trim()) && value.includes("/");

export const getResumeSignedUrl = async (path: string, expiresIn = 3600): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from(RESUME_BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
};

export const deleteStoredResume = async (path: string): Promise<void> => {
  if (!isStoredResumePath(path)) return;
  await supabase.storage.from(RESUME_BUCKET).remove([path]);
};

export const resumeDisplayName = (path: string): string => {
  const filename = path.split("/").pop() ?? path;
  return filename.replace(/^\d+-/, "");
};
