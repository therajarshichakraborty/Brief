import type { Metadata, Viewport } from "next";
import { DM_Sans, Newsreader, Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";
import localFont from "next/font/local";
import { THEME_COLORS, THEME_INIT_SCRIPT } from "@/lib/theme-script";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali-sans",
  preload: false,
});

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali-serif",
  preload: false,
});

const fontVariables = [
  dmSans.variable,
  newsreader.variable,
  geistMono.variable,
  notoSansBengali.variable,
  notoSerifBengali.variable,
].join(" ");

export const metadata: Metadata = {
  title: { default: "Brief", template: "%s · Brief" },
  description: "Every story that matters, summarised.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${fontVariables} bg-background font-sans`}>{children}</body>
    </html>
  );
}
