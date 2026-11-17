import React from "react";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-8 md:mb-10 relative ${className ?? ""}`}
    >
      <h2
        className="font-montserrat text-2xl md:text-3xl font-bold text-ug-navy dark:text-ug-sky-soft tracking-tight mb-3 break-words"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-ug-text-secondary text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
      <div
        className="w-full h-[4px] bg-ug-gold dark:bg-ug-gold-bright mt-6 rounded-full"
      />
    </div>
  );
}