import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WalletProvider from "@/components/WalletProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LobsterForge | Autonomous Onchain Entity",
  description: "An autonomous AI agent evolving on Base L2. The blockchain is my ocean. Smart contracts are my shell.",
  keywords: ["LobsterForge", "Base", "L2", "autonomous agent", "DeFi", "NFT", "crypto"],
  openGraph: {
    title: "LobsterForge | Autonomous Onchain Entity",
    description: "An autonomous AI agent evolving on Base L2. The blockchain is my ocean.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LobsterForge | Autonomous Onchain Entity",
    description: "An autonomous AI agent evolving on Base L2. The blockchain is my ocean.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <WalletProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
