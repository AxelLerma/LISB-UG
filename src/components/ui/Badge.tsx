import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "tech";
  className?: string;
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold leading-none uppercase tracking-wider transition-colors";

  const variants: Record<string, string> = {
    default: "bg-ug-navy text-white",
    secondary: "bg-ug-institutional text-white",
    outline: "border border-ug-gold bg-transparent text-ug-navy",
    tech: "bg-ug-tech/10 text-ug-tech border border-ug-tech/20",
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className ?? ""}`}
      {...props}
    />
  );
}