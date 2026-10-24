// Teléfonos de México: se guardan como 10 dígitos.
export function normalizeMxPhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("52")) digits = digits.slice(2);
  if (digits.length === 13 && digits.startsWith("521")) digits = digits.slice(3);
  return digits.length === 10 ? digits : null;
}

export function formatMxPhone(digits: string): string {
  if (digits.length !== 10) return digits;
  return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
}
