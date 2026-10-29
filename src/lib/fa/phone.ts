import { enDigits } from "./money";

export function normalizePhone(phone: string): string {
  return enDigits(phone).replace(/[^0-9+]/g, "");
}

export function whatsappNumber(phone: string): string {
  const digits = normalizePhone(phone).replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  return digits.startsWith("0") ? `98${digits.slice(1)}` : digits;
}
