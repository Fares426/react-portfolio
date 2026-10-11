"use client";

import { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: "view" | "hover";
}

export function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = true,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]:;?><",
  className = "",
  parentClassName = "",
  encryptedClassName = "opacity-70 text-primary",
  animateOn = "hover",
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrolledIntoView, setIsScrolledIntoView] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let currentIteration = 0;

    const shouldAnimate =
      !prefersReducedMotion &&
      ((animateOn === "hover" && isHovering) ||
        (animateOn === "view" && isScrolledIntoView));

    if (shouldAnimate) {
      const charPool = useOriginalCharsOnly
        ? Array.from(new Set(text.split(""))).filter((c) => c !== " ")
        : characters.split("");

      const getRandomChar = () =>
        charPool[Math.floor(Math.random() * charPool.length)] || "*";

      interval = setInterval(() => {
        setDisplayText(() => {
          return text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";

              if (sequential) {
                let isRevealed = false;
                if (revealDirection === "start") {
                  isRevealed = index < (currentIteration / maxIterations) * text.length;
                } else if (revealDirection === "end") {
                  isRevealed =
                    index >=
                    text.length - (currentIteration / maxIterations) * text.length;
                } else {
                  const center = text.length / 2;
                  const dist = Math.abs(index - center);
                  isRevealed =
                    dist <= (currentIteration / maxIterations) * (text.length / 2);
                }
                if (isRevealed) return char;
              } else {
                if (Math.random() < currentIteration / maxIterations) {
                  return char;
                }
              }

              return getRandomChar();
            })
            .join("");
        });

        currentIteration++;
        if (currentIteration > maxIterations) {
          clearInterval(interval);
          setDisplayText(text);
        }
      }, speed);
    } else {
      setDisplayText(text);
    }

    return () => clearInterval(interval);
  }, [
    isHovering,
    isScrolledIntoView,
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    characters,
    useOriginalCharsOnly,
    animateOn,
    prefersReducedMotion,
  ]);

  useEffect(() => {
    if (animateOn !== "view") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsScrolledIntoView(true);
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [animateOn]);

  return (
    <span
      ref={containerRef}
      className={`inline-block ${parentClassName}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span className={className}>
        {displayText.split("").map((char, i) => {
          const isOriginal = char === text[i] || char === " ";
          return (
            <span
              key={i}
              className={isOriginal ? "" : encryptedClassName}
            >
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
