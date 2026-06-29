import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CalculadoraMX — Calculadoras legales gratis para México",
  description: "Calcula tu finiquito, pensión alimenticia, pensión IMSS y herencias gratis. Basado en la ley mexicana vigente. Sin registro, resultado inmediato.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7588978072826859"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}