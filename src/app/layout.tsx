import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";

export const metadata: Metadata = {
  title: "ATHLETIX — Gear Up. Game On.",
  description: "Premium sports gear for every athlete. Shop sportswear, footwear, equipment, and accessories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
