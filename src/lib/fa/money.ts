export const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function faDigits(value: string | number): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function enDigits(value: string): string {
  if (!value) return "";
  return value
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
}

export function rialToToman(rial: number): number {
  if (!rial || isNaN(rial)) return 0;
  return Math.floor(rial / 10);
}

export function tomanToRial(toman: number): number {
  if (!toman || isNaN(toman)) return 0;
  return Math.round(toman * 10);
}

export function formatNumberFa(num: number): string {
  if (num === null || num === undefined || isNaN(num)) return "۰";
  const parts = Math.round(num).toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "٬");
  return faDigits(parts.join("."));
}

export function formatToman(rial: number, suffix = "تومان"): string {
  const toman = rialToToman(rial);
  const formatted = formatNumberFa(toman);
  return suffix ? `${formatted} ${suffix}` : formatted;
}

export function formatTomanCompact(rial: number): string {
  const toman = rialToToman(rial);
  if (toman >= 1_000_000_000) {
    const val = (toman / 1_000_000_000).toFixed(1).replace(/\.0$/, "");
    return `${faDigits(val)} میلیارد تومان`;
  }
  if (toman >= 1_000_000) {
    const val = (toman / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `${faDigits(val)} میلیون تومان`;
  }
  if (toman >= 1_000) {
    const val = (toman / 1_000).toFixed(0);
    return `${faDigits(val)} هزار تومان`;
  }
  return `${faDigits(toman)} تومان`;
}

export function parseTomanInput(str: string): number {
  if (!str) return 0;
  const normalized = enDigits(str).replace(/[^0-9]/g, "");
  const toman = parseInt(normalized, 10);
  if (isNaN(toman)) return 0;
  return tomanToRial(toman);
}
