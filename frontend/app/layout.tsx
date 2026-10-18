import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
export const metadata: Metadata = { title: "Nóva — Tienda online", description: "Descubre productos seleccionados en nuestra tienda online." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body><CartProvider><Header/><main>{children}</main><footer className="site-footer"><div><span className="footer-brand">nóva.</span><span>Una experiencia de compra simple y segura.</span></div><span>Proyecto académico FSJ35 · Next.js + Laravel + Stripe</span></footer></CartProvider></body></html>;
}