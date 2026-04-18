import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
  title: "resumepro — ai resume analyzer that actually tells you what's wrong",
  description: "deterministic ats scoring, ai-powered suggestions, ats-clean pdf export. free forever.",
  openGraph: {
    title: "resumepro",
    description: "the resume tool that actually tells you what's wrong",
    type: "website",
    url: "https://resumepro.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "resumepro",
    description: "the resume tool that actually tells you what's wrong",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
