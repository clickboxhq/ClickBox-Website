export const MIN_ADMIN_PASSWORD_LENGTH = 12;

const HAS_UPPER = /[A-Z]/;
const HAS_LOWER = /[a-z]/;
const HAS_NUMBER = /\d/;
const HAS_SPECIAL = /[^A-Za-z0-9]/;

export type PasswordValidationResult = {
  valid: boolean;
  errors: string[];
};

/** Validates admin password complexity (used on reset / set-password flows). */
export function validateAdminPassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < MIN_ADMIN_PASSWORD_LENGTH) {
    errors.push(`At least ${MIN_ADMIN_PASSWORD_LENGTH} characters`);
  }
  if (!HAS_UPPER.test(password)) errors.push("One uppercase letter");
  if (!HAS_LOWER.test(password)) errors.push("One lowercase letter");
  if (!HAS_NUMBER.test(password)) errors.push("One number");
  if (!HAS_SPECIAL.test(password)) errors.push("One special character");

  return { valid: errors.length === 0, errors };
}

export const ADMIN_PASSWORD_HINT =
  "Minimum 12 characters with uppercase, lowercase, a number, and a special character.";
