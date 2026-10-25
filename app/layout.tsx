import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Alexandria } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { siteConfig } from "@/config/site";

import "./globals.css";

const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: "variable",
  variable: "--font-alexandria",
  display: "swap",
});

const socialImage = {
  url: "/images/elkholy-social.jpg",
  width: 1200,
  height: 630,
  alt: siteConfig.nameAr,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: siteConfig.name,
  description: siteConfig.description,

  applicationName: siteConfig.name,

  openGraph: {
    title: siteConfig.nameAr,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: "ar_EG",
    type: "website",
    images: [socialImage],
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.nameAr,
    description: siteConfig.description,
    images: [socialImage],
  },

  manifest: "/manifest.webmanifest",

  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon-96x96.png",
        type: "image/png",
        sizes: "96x96",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  appleWebApp: {
    capable: true,
    title: "الخولي",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070b",
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
