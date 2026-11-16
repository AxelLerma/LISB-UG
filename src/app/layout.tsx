import type { Metadata } from "next";
import { Inter, Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminBar } from "@/components/admin/AdminBar";
import { AdminDrawer } from "@/components/admin/AdminDrawer";
import { LabProvider } from "@/context/LabContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Laboratorio de Sistemas Bio-inspirados | Universidad de Guanajuato",
  description:
    "Centro de investigación en Robótica, Electrónica y Neurociencia. Laboratorio de Sistemas Bio-inspirados (LISB-UG).",
  keywords: [
    "LISB-UG",
    "Laboratorio de Sistemas Bio-inspirados",
    "Universidad de Guanajuato",
    "Robótica",
    "Electrónica",
    "Neurociencia",
    "Bio-señales",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable} antialiased`}>
        <LabProvider>
          <TopBar />
          <Navbar />
          {children}
          <Footer />
          <AdminBar />
          <AdminDrawer />
        </LabProvider>
      </body>
    </html>
  );
}