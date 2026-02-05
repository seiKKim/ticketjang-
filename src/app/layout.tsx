import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "당당상품권 자동매입 서비스",
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
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-slate-50 dark:bg-slate-950">
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
