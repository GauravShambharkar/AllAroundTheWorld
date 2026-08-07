import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
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
  title: "All Around The World — Music Genre Explorer",
  description: "Explore music genres around the globe by region and map",
  openGraph: {
    title: "All Around The World — Music Genre Explorer",
    description: "Explore music genres around the globe by region and map",
    images: [
      {
        url: "/preview.png/",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
    siteName: "All Around The World — Music Genre Explorer",
    url: "https://aatwgenres.vercel.app",
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
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
