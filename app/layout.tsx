import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "NEXUS // Next-Gen Gaming Hub",
  description:
    "Explore the next frontier of AAA gaming titles, dark fantasy epics, high-speed anti-gravity racers, and cybernetic tactical shooters.",
  keywords: ["gaming", "video games", "action rpg", "cyberpunk", "dark fantasy", "nexus hub"],
  authors: [{ name: "Nexus Gaming Team" }],
  openGraph: {
    title: "NEXUS // Next-Gen Gaming Hub",
    description: "Explore the next frontier of AAA gaming titles and immersive worlds.",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full w-full overflow-x-hidden flex flex-col bg-[#08090e] text-[#f1f3f9] selection:bg-cyan-400 selection:text-black">
        <Navbar />
        <main className="flex-1 flex flex-col w-full overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
