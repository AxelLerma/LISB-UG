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
      className={`mb-10 relative ${className ?? ""}`}
    >
      <h2
        className="font-montserrat text-2xl md:text-3xl font-bold text-ug-navy tracking-tight mb-3"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-ug-text-secondary text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
      <div
        className="w-full h-[4px] bg-ug-gold mt-6 rounded-full"
      />
    </div>
  );
}