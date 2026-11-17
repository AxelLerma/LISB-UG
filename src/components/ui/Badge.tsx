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
    "inline-flex items-center gap-1.5 max-w-full break-words rounded-full px-3 py-1 text-xs font-semibold leading-tight uppercase tracking-wider transition-colors";

  const variants: Record<string, string> = {
    default: "bg-ug-navy text-white dark:bg-ug-institutional",
    secondary: "bg-ug-institutional text-white dark:bg-ug-institutional",
    outline:
      "border border-ug-gold bg-transparent text-ug-navy dark:text-ug-ink dark:border-ug-gold/60",
    tech: "bg-ug-tech/10 text-ug-tech border border-ug-tech/20 dark:bg-ug-sky/10 dark:text-ug-sky dark:border-ug-sky/30",
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className ?? ""}`}
      {...props}
    />
  );
}