import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ساخت حساب رایگان | لایت CRM",
  description: "شروع دوره آزمایشی ۱۴ روزه رایگان لایت CRM بدون نیاز به کارت بانکی.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
