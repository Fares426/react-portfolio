"use client";

import * as React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

/**
 * ShinyText (React Bits)
 * Subtle luxury light-sweep shimmer across typography.
 */
export function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = "",
}: ShinyTextProps) {
  return (
    <span
      className={`inline-block ${
        disabled
          ? ""
          : "animate-shiny-text bg-[length:200%_100%] bg-clip-text text-transparent"
      } ${className}`}
      style={{
        backgroundImage: disabled
          ? undefined
          : "linear-gradient(120deg, currentColor 20%, var(--primary) 50%, currentColor 80%)",
        animationDuration: `${speed}s`,
        WebkitBackgroundClip: disabled ? undefined : "text",
      }}
    >
      {text}
    </span>
  );
}
