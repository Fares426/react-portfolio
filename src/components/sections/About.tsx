"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Compass, Layers3, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FadeIn } from "@/components/ui/motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { Magnet } from "@/components/ui/Magnet";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const principles = [
  {
    number: "01",
    label: "INTENT & REDUCTION",
    title: "Find the signal",
    text: "I start with the sharpest version of the problem, then systematically remove everything that competes for attention. When the unnecessary is cut away, the core interface communicates with effortless clarity.",
    icon: Compass,
  },
  {
    number: "02",
    label: "SYSTEMS & CADENCE",
    title: "Shape the system",
    text: "A good interface is a living system: strict design tokens, responsive rhythm, fluid physics, and generous room for content to breathe. Components are predictable, accessible building blocks.",
    icon: Layers3,
  },
  {
    number: "03",
    label: "TACTILE POLISH",
    title: "Make it memorable",
    text: "The final layer is feeling — the small, considered details, responsive transitions, and quiet moments of delight that make digital products feel handcrafted rather than merely assembled.",
    icon: Sparkles,
  },
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 2D Scroll-Triggered Card Elevation Stagger
      const cards = sectionRef.current?.querySelectorAll(".about-principle-card");
      if (cards?.length) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current?.querySelector(".about-grid"),
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
      id="about" 
      className="section-rule relative overflow-hidden bg-background py-32 lg:py-52"
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <FadeIn className="grid gap-12 lg:grid-cols-[0.3fr_1fr] lg:gap-20">
          <div>
            <DecryptedText
              text="01 / ABOUT"
              animateOn="view"
              speed={40}
              maxIterations={10}
              className="section-number pt-3"
            />
          </div>
          <div>
            <p className="max-w-5xl text-4xl font-medium leading-[0.98] tracking-[-0.06em] text-foreground sm:text-6xl lg:text-[6.5rem]">
              I build interfaces that make complex things feel <span className="brand-gradient italic">obvious.</span>
            </p>
            <div className="mt-12 flex flex-col gap-8 border-t border-border pt-8 sm:flex-row sm:items-start sm:justify-between">
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                I&apos;m Fares Hamza, a frontend developer with a computer science foundation and a bias toward clarity. I turn product ideas into responsive, accessible experiences that people can understand quickly and enjoy using.
              </p>
              <Magnet padding={20} magnetStrength={3}>
                <a href="#projects" className="editorial-link inline-flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-foreground">
                  See the work <ArrowUpRight size={15} className="text-primary" />
                </a>
              </Magnet>
            </div>
          </div>
        </FadeIn>

        {/* Editorial Architectural Triptych with 2D GSAP Scroll Trigger & React Bits Spotlight */}
        <div className="about-grid mt-28 grid border-y border-border lg:grid-cols-3">
          {principles.map(({ number, label, title, text, icon: Icon }, idx) => (
            <div
              key={number}
              className={`editorial-card about-principle-card group relative min-h-[22rem] ${
                idx !== principles.length - 1 ? "border-b border-border lg:border-b-0 lg:border-r" : ""
              }`}
            >
              <SpotlightCard 
                className="flex h-full flex-col justify-between p-8 sm:p-10 lg:p-12"
                spotlightColor="rgba(209, 123, 79, 0.12)"
                spotlightSize={360}
              >
                {/* Card Top */}
                <div>
                  <div className="mb-14 flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold tracking-wider text-primary">{number}</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-all duration-500 group-hover:-translate-y-1 group-hover:border-primary/50 group-hover:text-primary">
                      <Icon size={19} strokeWidth={1.5} />
                    </div>
                  </div>

                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground/70">
                    {label}
                  </span>
                  <h3 className="mt-2 text-2xl font-medium tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:text-3xl">
                    {title}
                  </h3>
                </div>

                {/* Card Bottom */}
                <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-[0.93rem]">
                  {text}
                </p>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
