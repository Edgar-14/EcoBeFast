import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BeFast",
  description: "Bienvenido a BeFast",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} flex flex-col h-full bg-white text-befast-text relative`}>
        {/* Glass blur overlay global */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-white backdrop-blur-2xl -z-10" />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
