import type { Metadata } from "next";
import { Press_Start_2P, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/_core/navbar/Navbar";
import Footer from "@/components/_core/footer/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Ribbons from "@/components/ui/Ribbons";
import CustomCursor from "@/components/ui/CustomCursor";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "College Symposium 2025",
  description: "Official website for College Symposium 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col ${pressStart2P.variable} ${ibmPlexMono.variable}`}>
        <CustomCursor />
        <Ribbons
          baseThickness={15}
          colors={['#ff0000']}
          speedMultiplier={0.5}
          maxAge={500}
          enableFade={false}
          enableShaderEffect={true}
        />
        <SmoothScroll>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}