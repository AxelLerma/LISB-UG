"use client";

import React from "react";
import { useLab } from "@/context/LabContext";
import { isExternalLink } from "@/lib/labHelpers";

export function TopBar() {
  const { labData } = useLab();
  const settings = labData?.settings;

  return (
    <div className="bg-ug-navy dark:bg-ug-slate text-white border-b border-transparent dark:border-ug-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-8 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium tracking-wider overflow-x-auto whitespace-nowrap min-w-0">
            {(settings?.topBarLinks ?? []).map((link) => (
              <a
                key={link.id}
                href={link.href}
                {...(isExternalLink(link.href)
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-slate-200 hover:text-white dark:hover:text-ug-gold-bright transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          {settings && settings.topBarRightLabel && (
            <div className="flex items-center gap-4 text-xs font-medium tracking-wider shrink-0">
              <a
                href={settings.topBarRightHref}
                {...(isExternalLink(settings.topBarRightHref)
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-slate-200 hover:text-white dark:hover:text-ug-gold-bright transition-colors"
              >
                {settings.topBarRightLabel}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}