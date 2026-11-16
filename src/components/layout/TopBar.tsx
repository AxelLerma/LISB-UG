import React from "react";

const topBarLinks = [
  { label: "Portal UG", href: "https://www.ugto.mx/" },
  { label: "Campus / División", href: "#divisiones" },
  { label: "Investigación", href: "#investigacion" },
  { label: "Directorio", href: "#directorio" },
];

export function TopBar() {
  return (
    <div className="bg-ug-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-6">
          <div className="flex items-center gap-4 text-xs font-medium tracking-wider">
            {topBarLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-ug-light hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs font-medium tracking-wider">
            <a
              href="https://www.ugto.mx/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ug-light hover:text-white transition-colors"
              aria-label="Portal UG (abre en nueva pestaña)"
            >
              ugto.mx
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}