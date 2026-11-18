import type { Metadata } from "next";
import { Inter, Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminBar } from "@/components/admin/AdminBar";
import { AdminDrawer } from "@/components/admin/AdminDrawer";
import { LabProvider } from "@/context/LabContext";
import { ThemeProvider } from "@/context/ThemeContext";

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

// Se ejecuta en el <head>, ANTES de pintar la página. El modo claro es SIEMPRE
// el tema por defecto: solo se activa la clase `dark` en <html> si la persona
// eligió manualmente el modo oscuro (guardado en localStorage). Se ignora a
// propósito la preferencia del sistema (prefers-color-scheme). La clave
// "lisb-theme" debe ser la misma que THEME_STORAGE_KEY en
// src/context/ThemeContext.tsx (no se importa aquí porque ese archivo es un
// módulo de cliente).
const THEME_INIT_SCRIPT = `(function(){try{document.documentElement.classList.toggle("dark",localStorage.getItem("lisb-theme")==="dark");}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: el script del <head> cambia la clase de <html>
    // antes de que React hidrate. Es intencional.
    <html lang="es" className={inter.className} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className={`${inter.variable} ${montserrat.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-white text-[#1E293B] dark:bg-[#090D16] dark:text-[#F8FAFC] transition-colors duration-200`}
      >
        {/* ThemeProvider debe envolver TODO lo que use useTheme() (el Navbar). */}
        <ThemeProvider>
          <LabProvider>
            <TopBar />
            <Navbar />
            {children}
            <Footer />
            <AdminBar />
            <AdminDrawer />
          </LabProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}