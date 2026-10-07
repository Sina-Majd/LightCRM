import type { Metadata } from "next";
import { Vazirmatn, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-fa",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "لایت CRM — CRM ساده برای هر کسب‌وکار",
  description:
    "مشتریان، سفارش‌ها، فاکتورها و گزارش‌ها را در یک CRM تمیز و ساده مدیریت کنید.",
  keywords: [
    "CRM فارسی",
    "مدیریت مشتری",
    "پیگیری سفارش",
    "فاکتور",
    "CRM کسب‌وکار",
  ],
  icons: {
    icon: "/light-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={`${vazirmatn.variable} ${geistMono.variable} h-full antialiased bg-white text-zinc-950 selection:bg-blue-600/15 selection:text-blue-950`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-screen flex-col bg-white text-zinc-950"
      >
        {children}
        <Toaster position="bottom-left" closeButton dir="rtl" />
      </body>
    </html>
  );
}
