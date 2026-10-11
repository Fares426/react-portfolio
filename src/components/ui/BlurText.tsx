"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
}

export function BlurText({
  text,
  delay = 0.05,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "-50px",
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold, rootMargin]);

  const defaultFrom =
    direction === "top"
      ? { filter: "blur(12px)", opacity: 0, y: -20 }
      : { filter: "blur(12px)", opacity: 0, y: 20 };

  const defaultTo = { filter: "blur(0px)", opacity: 1, y: 0 };

  if (prefersReducedMotion) {
    return <p className={className}>{text}</p>;
  }

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {elements.map((element, i) => (
        <motion.span
          key={i}
          initial={defaultFrom}
          animate={inView ? defaultTo : defaultFrom}
          transition={{
            duration: 0.55,
            delay: i * delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="inline-block"
        >
          {element}
          {animateBy === "words" && i < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </p>
  );
}
