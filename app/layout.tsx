import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hi-Fly — Tours & Flights",
  description: "Discover curated tours and compare flights with Hi-Fly.",
  openGraph: {
    title: "Hi-Fly — Tours & Flights",
    description: "One beautiful journey. Curated tours and smarter flight search.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Hi-Fly Tours & Flights" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hi-Fly — Tours & Flights",
    description: "One beautiful journey. Curated tours and smarter flight search.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
        className={`${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
