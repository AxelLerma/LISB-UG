import React from "react";

export interface RichTextProps {
  text: string;
  className?: string;
}

// Texto simple con soporte de **negritas**, para que quien edita no necesite HTML.
export function RichText({ text, className }: RichTextProps) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.length > 4 && part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="text-ug-navy font-semibold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </span>
  );
}