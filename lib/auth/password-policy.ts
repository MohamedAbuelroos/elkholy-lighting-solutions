export function getPasswordValidationError(password: string): string | null {
  if (
    password.length < 12 ||
    password.length > 64 ||
    !/[a-z]/i.test(password) ||
    !/[0-9]/.test(password)
  ) {
    return "كلمة المرور يجب أن تكون بين 12 و64 حرفًا، وتتضمن حروفًا إنجليزية وأرقامًا.";
  }

  if (new TextEncoder().encode(password).length > 72) {
    return "كلمة المرور طويلة جدًا. استخدم كلمة مرور أقصر.";
  }

  return null;
}
