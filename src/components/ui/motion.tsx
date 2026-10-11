"use client";

import { motion, HTMLMotionProps, useReducedMotion, useScroll, useTransform } from "framer-motion";
import * as React from "react";

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  fullWidth?: boolean;
}

export function FadeIn({ 
  children, 
  delay = 0, 
  direction = "up", 
  fullWidth = false,
  className,
  ...props 
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: { x: 0, y: 0 }
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98], // elegant ease-out
      }}
      className={`${fullWidth ? "w-full" : ""} ${className || ""}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ 
  children, 
  delayChildren = 0.1,
  staggerChildren = 0.1,
  className,
  ...props
}: HTMLMotionProps<"div"> & { delayChildren?: number, staggerChildren?: number }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-5% 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren,
            staggerChildren,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ 
  children, 
  className,
  ...props 
}: HTMLMotionProps<"div">) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={prefersReducedMotion ? false : undefined}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.21, 0.47, 0.32, 0.98],
          }
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScrollScale({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.25], [1, 0.82]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.1]);
  return (
    <motion.div className={className} style={{ scale, opacity }}>
      {children}
    </motion.div>
  );
}
