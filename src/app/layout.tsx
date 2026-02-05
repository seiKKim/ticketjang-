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
  title: "티켓장 | 상품권 자동매입 서비스",
  description: "365일 24시간 상품권 즉시 매입, 5분 내 입금",
};

import { Header } from "@/components/Header";
import { FooterWrapper } from "@/components/FooterWrapper";

import { DialogProvider } from "@/context/DialogContext";
import GlobalDialog from "@/components/ui/GlobalDialog";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-slate-950`}
      >
        <DialogProvider>
          <GlobalDialog />
          <div className="mobile-container flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <FooterWrapper />
          </div>
        </DialogProvider>
      </body>
    </html>
  );
}
