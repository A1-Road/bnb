import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/layout/Navigation";
import { ConnectionStatus } from "@/components/common/ConnectionStatus";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LINE-Telegram Bridge",
  description: "Bridge messages between LINE and Telegram",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <main className="min-h-screen bg-tg-theme-bg text-tg-theme-text pb-16">
          {children}
        </main>
        <Navigation />
        <ConnectionStatus isConnected={true} />
      </body>
    </html>
  );
}
