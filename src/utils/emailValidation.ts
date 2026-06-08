export function isBasicEmailValid(email: string) {
  const emailParts = email.split('@');

  if (emailParts.length !== 2) {
    return false;
  }

  const [localPart, domain] = emailParts;

  if (!localPart || !domain) {
    return false;
  }

  return domain.includes('.');
}
