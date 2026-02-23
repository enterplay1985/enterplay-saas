import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Enterplay Solutions · Panel de Control",
  description: "Panel de control de Enterplay Solutions.",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}