import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cairo } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Elkholy Lighting Solutions",
  description: "حلول الإضاءة الذكية والتشطيبات الكهربائية الحديثة",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
