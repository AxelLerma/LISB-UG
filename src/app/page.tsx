import { Hero } from "@/components/sections/Hero";
import { Pillars } from "@/components/sections/Pillars";
import { Projects } from "@/components/sections/Projects";
import { Publications } from "@/components/sections/Publications";
import { Infrastructure } from "@/components/sections/Infrastructure";
import { Team } from "@/components/sections/Team";
import { CustomSections } from "@/components/sections/CustomSections";
import { ClientContact } from "@/components/sections/ClientContact";

// Server Component: sin "use client" y sin `export const dynamic`.
// El <LabProvider> y el <Footer> ya están en app/layout.tsx.
// Los datos se cargan en el cliente (LabProvider → useEffect → /api/lab),
// por eso la página se puede prerenderizar sin problemas en `next build`.
// Las "Secciones Extra" creadas desde el panel admin se dibujan entre el
// Equipo y el Contacto, en el orden en que aparecen en el editor.
export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Pillars />
      <Projects />
      <Publications />
      <Infrastructure />
      <Team />
      <CustomSections />
      <ClientContact />
    </main>
  );
}