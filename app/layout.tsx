import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HiFLY — Your next great escape",
  description: "Discover curated tours and compare flights with Hi-Fly.",
  openGraph: {
    title: "HiFLY — Your next great escape",
    description:
      "One beautiful journey. Curated tours and smarter flight search.",
    images: [
      {
        url: "/hifly-logo.png",
        width: 900,
        height: 780,
        alt: "HiFLY Tours & Flights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HiFLY — Your next great escape",
    description:
      "One beautiful journey. Curated tours and smarter flight search.",
    images: ["/hifly-logo.png"],
  },
  icons: {
    icon: "/hifly-logo.png",
    shortcut: "/hifly-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#064bce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>{children}</body>
    </html>
  );
}
