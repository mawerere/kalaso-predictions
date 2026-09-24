import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://kalasopredictions.com"),
  title: "Kalaso Predictions — Free Football Betting Tips & Live Scores",
  description: "Kalaso predictions provides free, researched daily football betting tips, banker predictions, live match synchronization, and accumulator calculator.",
  keywords: ["Kalaso predictions", "football tips", "betting tips", "free football predictions", "banker tips", "Katambula", "Uganda football betting", "live scores"],
  openGraph: {
    title: "Kalaso Predictions — Free Football Betting Tips",
    description: "Daily researched football predictions, live score synchronization, and packages. 25+ Only.",
    url: "https://kalasopredictions.com",
    siteName: "Kalaso Predictions",
    images: [
      {
        url: "/images/hero-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Kalaso Predictions Football Tips",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-teal-500 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloatingButton />
        </AuthProvider>
      </body>
    </html>
  );
}
