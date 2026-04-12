/**
 * Minimal email format check: non-empty local part, `@`, domain with a dot (e.g. `user@mail.com`).
 * Does not guarantee full RFC compliance — only typical user input.
 */
const MINIMAL_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmailFormat(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return false;
  return MINIMAL_EMAIL.test(trimmed);
}

export type MinLengthErrorOptions = {
  /** When the string is empty (after trim) */
  empty?: string;
  /** When length is below the minimum */
  tooShort?: string;
};

/**
 * Validates minimum character count (string length after `trim`).
 * @returns error message text, or `null` if length is sufficient.
 */
export function minLengthError(
  value: string,
  minLength: number,
  options?: MinLengthErrorOptions,
): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return options?.empty ?? "Заполните поле";
  }
  if (trimmed.length < minLength) {
    return (
      options?.tooShort ??
      `Введите не менее ${minLength} символов (сейчас ${trimmed.length})`
    );
  }
  return null;
}

/**
 * New password rules after reset link: ≥8 characters, at least one letter and one digit.
 * Length is checked on trimmed string; letter/digit classes use the trimmed value.
 */
export function newPasswordResetPolicyError(password: string): string | null {
  const t = password.trim();
  if (t.length === 0) return "Введите пароль";
  if (t.length < 8) return "Минимум 8 символов";
  if (!/\p{L}/u.test(t)) return "Пароль должен содержать букву";
  if (!/\d/.test(t)) return "Пароль должен содержать цифру";
  return null;
}
