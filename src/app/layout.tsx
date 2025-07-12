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
  title: "Bonk vs All - Epic Battle Game",
  description: "Epic battle game featuring Bonk - Test your skills in legendary fights against powerful opponents. Combines skill click and hold-release combos for intense battles.",
  keywords: ["bonk", "game", "battle", "skill click", "combo", "fighting game", "web game"],
  authors: [{ name: "Bonk vs All Team" }],
  creator: "Bonk vs All Team",
  publisher: "Bonk vs All",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bonk-vs-all.vercel.app'),
  openGraph: {
    title: "Bonk vs All - Epic Battle Game",
    description: "Epic battle game featuring Bonk - Test your skills in legendary fights against powerful opponents!",
    url: 'https://bonk-vs-all.vercel.app',
    siteName: 'Bonk vs All',
    images: [
      {
        url: '/imgs/logo.png',
        width: 1200,
        height: 630,
        alt: 'Bonk vs All Game',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bonk vs All - Epic Battle Game",
    description: "Epic battle game featuring Bonk - Test your skills in legendary fights against powerful opponents!",
    images: ['/imgs/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/imgs/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
