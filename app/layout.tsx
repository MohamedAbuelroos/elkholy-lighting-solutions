import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Alexandria } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: "variable",
  variable: "--font-alexandria",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elkholy Lighting Solutions",
  description: "حلول الإضاءة الذكية والتشطيبات الكهربائية الحديثة",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${alexandria.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
