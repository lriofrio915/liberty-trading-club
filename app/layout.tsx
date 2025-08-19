// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Mejora el comportamiento de carga de fuentes
  variable: "--font-inter", // Opcional: para usar variable CSS
});

export const metadata = {
  title: "Estrategia de Trading Intradía",
  description: "Un Enfoque Integrado Macro-Técnico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white text-gray-900`}
        suppressHydrationWarning
      >
        <Navbar />

        <main className="min-h-screen pt-16 sm:pt-20">{children}</main>
      </body>
    </html>
  );
}
