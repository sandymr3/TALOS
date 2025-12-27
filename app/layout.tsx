import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/_core/navbar/Navbar";
import Footer from "@/components/_core/footer/Footer";

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
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}