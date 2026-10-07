import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ورود به حساب | لایت CRM",
  description: "ورود به فضای کاری لایت CRM جهت مدیریت مشتریان، سفارش‌ها و فاکتورها.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
