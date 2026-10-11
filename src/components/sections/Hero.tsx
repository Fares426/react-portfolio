"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Download, FileText, Code2, Layers, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { AnimatedRibbons } from "@/components/ui/AnimatedRibbons";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { Magnet } from "@/components/ui/Magnet";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const technologies = [
  "JavaScript (ES6+)", "TypeScript", "React.js", "Next.js", "Redux", "Redux Toolkit",
  "React Router", "Context API", "Tailwind CSS", "Bootstrap", "HTML5", "CSS3",
  "Responsive Design", "Accessibility", "TanStack Query", "Axios", "React Hook Form",
  "JWT Authentication", "REST APIs", "Vite", "Webpack", "Git", "GitHub", "CI/CD",
  "C#", "SQL Server", "Agile / Scrum", "Component Architecture", "Performance Optimization",
  "Code Splitting", "Lazy Loading",
];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const portraitWrapperRef = useRef<HTMLDivElement>(null);
  const portraitCardRef = useRef<HTMLDivElement>(null);
  const sat1Ref = useRef<HTMLDivElement>(null);
  const sat2Ref = useRef<HTMLDivElement>(null);
  const sat3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // 1. Kinetic headline 2D words reveal
      if (!prefersReduced && headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".hero-kinetic-word");
        gsap.fromTo(
          words,
          {
            yPercent: 110,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.15,
          }
        );
      }

      // 2. Idle Organic 2D Floating for Satellite Badges
      if (!prefersReduced) {
        if (sat1Ref.current) {
          gsap.to(sat1Ref.current, {
            y: "+=8",
            duration: 2.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
        }
        if (sat2Ref.current) {
          gsap.to(sat2Ref.current, {
            y: "-=9",
            duration: 3.2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: 0.4,
          });
        }
        if (sat3Ref.current) {
          gsap.to(sat3Ref.current, {
            y: "+=7",
            duration: 2.8,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: 0.8,
          });
        }
      }

      // 3. 2D Interactive Cursor Tracking
      const card = portraitCardRef.current;
      const hero = heroRef.current;
      const sat1 = sat1Ref.current;
      const sat2 = sat2Ref.current;
      const sat3 = sat3Ref.current;

      if (!card || !hero || prefersReduced) return;

      const moveX = gsap.quickTo(card, "x", { duration: 0.5, ease: "power2.out" });
      const moveY = gsap.quickTo(card, "y", { duration: 0.5, ease: "power2.out" });

      const sat1X = sat1 ? gsap.quickTo(sat1, "x", { duration: 0.65, ease: "power2.out" }) : null;
      const sat1Y = sat1 ? gsap.quickTo(sat1, "y", { duration: 0.65, ease: "power2.out" }) : null;

      const sat2X = sat2 ? gsap.quickTo(sat2, "x", { duration: 0.75, ease: "power2.out" }) : null;
      const sat2Y = sat2 ? gsap.quickTo(sat2, "y", { duration: 0.75, ease: "power2.out" }) : null;

      const sat3X = sat3 ? gsap.quickTo(sat3, "x", { duration: 0.6, ease: "power2.out" }) : null;
      const sat3Y = sat3 ? gsap.quickTo(sat3, "y", { duration: 0.6, ease: "power2.out" }) : null;

      const onMouseMove = (e: MouseEvent) => {
        const rect = hero.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        moveX(normX * 14);
        moveY(normY * 14);

        if (sat1X && sat1Y) {
          sat1X(normX * 24);
          sat1Y(normY * 20);
        }
        if (sat2X && sat2Y) {
          sat2X(-normX * 20);
          sat2Y(-normY * 24);
        }
        if (sat3X && sat3Y) {
          sat3X(normX * 16);
          sat3Y(-normY * 16);
        }
      };

      const onMouseLeave = () => {
        moveX(0);
        moveY(0);
        if (sat1X && sat1Y) {
          sat1X(0);
          sat1Y(0);
        }
        if (sat2X && sat2Y) {
          sat2X(0);
          sat2Y(0);
        }
        if (sat3X && sat3Y) {
          sat3X(0);
          sat3Y(0);
        }
      };

      hero.addEventListener("mousemove", onMouseMove);
      hero.addEventListener("mouseleave", onMouseLeave);

      // 4. Pure 2D Scroll-Driven Parallax with GSAP ScrollTrigger
      gsap.to(card, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      return () => {
        hero.removeEventListener("mousemove", onMouseMove);
        hero.removeEventListener("mouseleave", onMouseLeave);
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative flex min-h-[calc(100svh-5rem)] items-center overflow-hidden py-24 lg:py-32" 
      id="home"
    >
      {/* Background decoration */}
      <div className="hero-glow pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col-reverse items-center justify-between gap-14 lg:flex-row lg:gap-10">

          {/* Text Content */}
          <div className="flex-1">
            <StaggerContainer
              className="text-center lg:text-left"
              delayChildren={0.15}
              staggerChildren={0.12}
            >
              <StaggerItem className="mb-7 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_var(--accent)]" />
                <DecryptedText 
                  text="Available for thoughtful digital work" 
                  animateOn="view"
                  speed={35}
                  maxIterations={12}
                  className="font-mono text-xs tracking-widest text-muted-foreground"
                />
              </StaggerItem>

              <StaggerItem>
                <h1 
                  ref={headlineRef}
                  className="mb-7 max-w-4xl text-5xl font-semibold leading-[0.88] tracking-[-0.07em] text-foreground sm:text-7xl lg:text-[7.8rem]"
                >
                  <span className="inline-block overflow-hidden pb-1 align-bottom">
                    <span className="hero-kinetic-word inline-block">I</span>
                  </span>{" "}
                  <span className="inline-block overflow-hidden pb-1 align-bottom">
                    <span className="hero-kinetic-word inline-block">turn</span>
                  </span>{" "}
                  <span className="inline-block overflow-hidden pb-1 align-bottom">
                    <span className="hero-kinetic-word inline-block">ideas</span>
                  </span>{" "}
                  <span className="inline-block overflow-hidden pb-1 align-bottom">
                    <span className="hero-kinetic-word inline-block">into</span>
                  </span>{" "}
                  <span className="inline-block overflow-hidden pb-1 align-bottom">
                    <span className="hero-kinetic-word brand-gradient inline-block italic">feeling.</span>
                  </span>
                </h1>
              </StaggerItem>

              <StaggerItem>
                <p className="mb-9 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  I&apos;m Fares Hamza — a frontend developer crafting fast, expressive products with React, Next.js, and TypeScript.
                </p>
              </StaggerItem>

              <StaggerItem className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Magnet padding={25} magnetStrength={3}>
                  <Link
                    href="#projects"
                    className="brand-button group flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 font-semibold sm:w-auto"
                  >
                    View My Work
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Magnet>

                <Magnet padding={20} magnetStrength={3}>
                  <Link
                    href="#contact"
                    className="editorial-link inline-block w-full py-4 text-center font-medium text-foreground sm:w-auto sm:px-4"
                  >
                    Contact Me
                  </Link>
                </Magnet>
              </StaggerItem>

              <StaggerItem className="mt-10 flex items-center justify-center gap-6 text-sm font-medium text-muted-foreground lg:justify-start">
                <a href="/Fares-Hamza-CV.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors group">
                  <FileText size={16} className="group-hover:text-primary transition-colors" />
                  View Resume
                </a>
                <a href="/Fares-Hamza-CV.pdf" download="Fares-Hamza-CV.pdf" className="flex items-center gap-2 hover:text-foreground transition-colors group">
                  <Download size={16} className="group-hover:text-primary transition-colors" />
                  Download CV
                </a>
              </StaggerItem>
            </StaggerContainer>
          </div>

          {/* Photo Area with 2D Depth & Reactive GSAP Satellites */}
          <div
            ref={portraitWrapperRef}
            className="hero-photo-halo relative flex w-full max-w-md flex-1 justify-center lg:max-w-none lg:justify-end"
          >
            <div 
              ref={portraitCardRef}
              className="group relative h-72 w-72 sm:h-96 sm:w-96 lg:h-[30rem] lg:w-[30rem] transition-shadow duration-500"
            >
              {/* Orbits */}
              <div className="hero-orbit absolute -inset-3 rounded-[42%] rotate-12 transition-transform duration-700 group-hover:rotate-45" />
              <div className="hero-orbit absolute inset-4 rounded-[38%] -rotate-12 opacity-60 transition-transform duration-700 group-hover:-rotate-45" />
              
              {/* Portrait Frame */}
              <div className="hero-photo-frame absolute inset-8 overflow-hidden rounded-full bg-muted ring-1 ring-border/80 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                <Image
                  src="/images/fares-hamza.jpg"
                  alt="Fares Hamza"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 400px"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f4f4f5'/%3E%3Cpath d='M200 120a40 40 0 1 0 0 80 40 40 0 0 0 0-80zm0 100c-44 0-80 30-80 80v20h160v-20c0-50-36-80-80-80z' fill='%23a1a1aa'/%3E%3C/svg%3E";
                  }}
                />
              </div>

              {/* Reactive Satellite 1: Top Right - React · Next.js */}
              <div
                ref={sat1Ref}
                className="pointer-events-none absolute -top-3 right-0 z-20 flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3.5 py-2 text-xs font-semibold text-foreground shadow-lg backdrop-blur-md sm:-top-5 sm:right-4"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <Code2 size={13} className="text-primary" />
                <span>React · Next.js</span>
              </div>

              {/* Reactive Satellite 2: Bottom Left - TypeScript & Systems */}
              <div
                ref={sat2Ref}
                className="pointer-events-none absolute -bottom-4 -left-2 z-20 flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3.5 py-2 text-xs font-semibold text-foreground shadow-lg backdrop-blur-md sm:-bottom-6 sm:-left-6"
              >
                <Layers size={13} className="text-primary" />
                <span>TypeScript &amp; Systems</span>
              </div>

              {/* Reactive Satellite 3: Top Left - Motion & Craft */}
              <div
                ref={sat3Ref}
                className="pointer-events-none absolute top-12 -left-4 z-20 hidden items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3 py-1.5 font-mono text-[0.68rem] font-medium uppercase tracking-wider text-muted-foreground shadow-lg backdrop-blur-md sm:flex"
              >
                <Sparkles size={11} className="text-primary" />
                <span>Motion &amp; Craft</span>
              </div>

              {/* Explore Indicator */}
              <div className="absolute -bottom-6 right-6 z-10 flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md">
                <ArrowDown size={13} className="text-primary animate-bounce" />
                <span>Explore</span>
              </div>
            </div>
          </div>

        </div>
        <AnimatedRibbons />
        <div className="tech-marquee" aria-label="Technologies and practices">
          <div className="tech-marquee-track">
            {[...technologies, ...technologies].map((technology, index) => (
              <span key={`${technology}-${index}`} className="tech-marquee-item">
                {technology}
                <span className="tech-marquee-dot" aria-hidden="true">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
