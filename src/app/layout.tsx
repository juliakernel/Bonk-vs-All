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
  title: "Bonk vs All - Game Chiến Đấu Huyền Thoại",
  description: "Trò chơi chiến đấu huyền thoại với Bonk - Hãy thử thách kỹ năng của bạn trong các trận đấu epic với các đối thủ mạnh mẽ. Game kết hợp skill click và hold-release combo để tạo nên những trận chiến đầy kịch tính.",
  keywords: ["bonk", "game", "chiến đấu", "skill click", "combo", "trò chơi", "việt nam"],
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
    title: "Bonk vs All - Game Chiến Đấu Huyền Thoại",
    description: "Trò chơi chiến đấu huyền thoại với Bonk - Thử thách kỹ năng trong các trận đấu epic!",
    url: 'https://bonk-vs-all.vercel.app',
    siteName: 'Bonk vs All',
    images: [
      {
        url: '/imgs/BONK.png',
        width: 1200,
        height: 630,
        alt: 'Bonk vs All Game',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bonk vs All - Game Chiến Đấu Huyền Thoại",
    description: "Trò chơi chiến đấu huyền thoại với Bonk - Thử thách kỹ năng trong các trận đấu epic!",
    images: ['/imgs/BONK.png'],
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
    apple: '/imgs/BONK.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
