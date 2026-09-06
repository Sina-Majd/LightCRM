import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LightCRM — The Simple CRM for Every Business",
  description:
    "Manage companies, customers, orders, invoices, and reports in one clean, easy-to-use CRM built for every business.",
  keywords: [
    "simple crm",
    "customer management",
    "order tracking",
    "invoicing software",
    "small business crm",
    "freelancer crm",
    "agency crm",
    "business reports",
  ],
  icons: {
    icon: "/lightcrm-emblem.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased bg-[#09090b] text-zinc-100 selection:bg-cyan-500/30 selection:text-white`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#09090b] text-zinc-100 overflow-x-hidden"
      >
        {children}
      </body>
    </html>
  );
}
