"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FadeIn } from "@/components/ui/motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { Magnet } from "@/components/ui/Magnet";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SkillQuadrant {
  number: string;
  label: string;
  discipline: string;
  items: string[];
}

const skillQuadrants: SkillQuadrant[] = [
  {
    number: "01",
    label: "BUILD",
    discipline: "Runtime & Component Architecture",
    items: ["React.js", "Next.js", "TypeScript", "JavaScript (ES6+)", "Vite", "Webpack"],
  },
  {
    number: "02",
    label: "COMPOSE",
    discipline: "Design Systems & Accessibility",
    items: ["Tailwind CSS", "Bootstrap", "HTML5", "CSS3", "Responsive Design", "Accessibility (WCAG AA)"],
  },
  {
    number: "03",
    label: "CONNECT",
    discipline: "State & API Synchronization",
    items: ["REST APIs", "TanStack Query", "Axios", "React Hook Form", "JWT Authentication", "Context API"],
  },
  {
    number: "04",
    label: "SHIP",
    discipline: "Delivery, Tooling & Performance",
    items: ["Git", "GitHub", "CI/CD", "Performance Tuning", "Code Splitting", "Lazy Loading"],
  },
];

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".skill-quadrant-card");
      if (cards?.length) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current?.querySelector(".skills-grid"),
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="skills" 
      className="section-rule bg-muted/15 py-32 lg:py-48"
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <FadeIn className="grid gap-10 lg:grid-cols-[0.3fr_1fr] lg:gap-20">
          <div>
            <DecryptedText 
              text="02 / TOOLKIT" 
              animateOn="view"
              speed={40}
              maxIterations={10}
              className="section-number pt-3" 
            />
          </div>
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <h2 className="max-w-3xl text-5xl font-medium leading-[0.95] tracking-[-0.06em] text-foreground md:text-7xl">
                Tools are only useful when they <span className="brand-gradient italic">disappear.</span>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                A practical stack for turning rough ideas into reliable, high-performing interfaces. Every tool chosen has a clear responsibility.
              </p>
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground/80 shrink-0">
              04 Disciplines
            </span>
          </div>
        </FadeIn>

        {/* Architectural 4-Quadrant Grid with 2D GSAP ScrollTrigger & React Bits Spotlight */}
        <div className="skills-grid mt-24 grid border-t border-border md:grid-cols-2">
          {skillQuadrants.map((group, index) => (
            <div
              key={group.label}
              className={`editorial-card skill-quadrant-card group border-b border-border ${
                index % 2 === 0 ? "md:border-r" : ""
              }`}
            >
              <SpotlightCard
                className="flex h-full flex-col justify-between p-8 sm:p-10 lg:p-12"
                spotlightColor="rgba(209, 123, 79, 0.11)"
                spotlightSize={340}
              >
                <div>
                  <div className="mb-8 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                        {group.number} / {group.label}
                      </span>
                      <p className="mt-1 font-mono text-[0.68rem] tracking-wider text-muted-foreground/75">
                        {group.discipline}
                      </p>
                    </div>
                    <Magnet padding={15} magnetStrength={3}>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-all duration-300 group-hover:border-primary/50 group-hover:text-primary">
                        <ArrowUpRight size={17} />
                      </div>
                    </Magnet>
                  </div>

                  {/* Understated Tactile Tags */}
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="editorial-tag"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
