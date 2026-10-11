"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  ArrowUpRight, 
  ExternalLink, 
  X, 
  ZoomIn, 
  Utensils, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Leaf, 
  Package, 
  Sparkles,
  HeartHandshake
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, Project } from "@/data/projects";
import { Github } from "@/components/ui/Icons";
import { FadeIn } from "@/components/ui/motion";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ShinyText } from "@/components/ui/ShinyText";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { Magnet } from "@/components/ui/Magnet";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const supportingProjects = projects.filter((p) => !p.featured);
  const graduationProject = projects.find((p) => p.featured) || projects[projects.length - 1];

  const [activeLightbox, setActiveLightbox] = useState<Project | null>(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveLightbox(null);
    };
    if (activeLightbox) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeLightbox]);

  // GSAP Cinematic ScrollTrigger reveals & parallax scrubbing
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Pure 2D entrance for project cards
      const cards = sectionRef.current?.querySelectorAll(".project-card-reveal");
      if (cards?.length) {
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 45,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );

          // Subtle 2D parallax scrub on screenshot
          const img = card.querySelector(".project-img-inner");
          if (img) {
            gsap.to(img, {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            });
          }
        });
      }

      // 2. Pure 2D reveal for graduation capstone
      const capstone = sectionRef.current?.querySelector(".capstone-card-reveal");
      if (capstone) {
        gsap.fromTo(
          capstone,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: capstone,
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
      id="projects" 
      className="section-rule bg-background py-32 lg:py-48"
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <FadeIn className="grid gap-10 lg:grid-cols-[0.3fr_1fr] lg:gap-20">
          <div>
            <DecryptedText 
              text="03 / WORK" 
              animateOn="view" 
              speed={40} 
              maxIterations={10} 
              className="section-number pt-3" 
            />
          </div>
          <div className="flex items-end justify-between gap-8">
            <div>
              <h2 className="max-w-3xl text-5xl font-medium leading-[0.95] tracking-[-0.06em] text-foreground md:text-7xl">
                Selected work, with a <span className="brand-gradient italic">reason.</span>
              </h2>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground">
                A mix of production web applications, interactive software experiments, and a university capstone built around a real-world problem.
              </p>
            </div>
            <span className="hidden font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground/80 lg:block shrink-0">
              05 Projects
            </span>
          </div>
        </FadeIn>

        {/* 2-Column Supporting Projects Grid with GSAP 3D ScrollTrigger & Spotlight */}
        <div className="mt-24 grid border-y border-border md:grid-cols-2">
          {supportingProjects.map((project, index) => (
            <div
              key={project.id}
              className={`editorial-card project-card-reveal group border-b border-border ${
                index % 2 === 0 ? "md:border-r" : ""
              } ${index >= supportingProjects.length - 2 ? "md:border-b-0" : ""}`}
            >
              <SpotlightCard
                className="flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10"
                spotlightColor="rgba(209, 123, 79, 0.1)"
                spotlightSize={380}
              >
                <div>
              {/* Image Frame - 16:10 Desktop Aspect Ratio with Click-to-Zoom & GSAP Parallax */}
              <div 
                onClick={() => setActiveLightbox(project)}
                className="relative aspect-[16/10] overflow-hidden rounded-md border border-border/80 bg-muted/40 cursor-zoom-in transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                role="button"
                tabIndex={0}
                aria-label={`Enlarge screenshot of ${project.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveLightbox(project);
                  }
                }}
              >
                {/* Subtle Top Browser Status Strip */}
                <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between bg-background/85 px-3 py-1.5 backdrop-blur-md border-b border-border/60">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-border" />
                    <span className="h-2 w-2 rounded-full bg-border" />
                    <span className="h-2 w-2 rounded-full bg-border" />
                  </div>
                  <span className="font-mono text-[0.62rem] text-muted-foreground truncate max-w-[160px]">
                    {project.slug || `${project.id}.app`}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[0.58rem] text-primary">
                    <ZoomIn size={11} />
                    <span className="hidden sm:inline">PREVIEW</span>
                  </div>
                </div>

                {/* Screenshot Image with GSAP Parallax Scrub */}
                <div className="relative h-full w-full pt-6 overflow-hidden">
                  {project.image && (
                    <div className="project-img-inner relative h-full w-full">
                      <Image
                        src={project.image}
                        alt={`${project.title} screenshot`}
                        fill
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                </div>

                {/* Corner Project Index */}
                <span className="absolute bottom-3 left-3 z-10 rounded bg-background/80 px-2 py-0.5 font-mono text-xs font-semibold text-foreground backdrop-blur-md border border-border/60">
                  0{index + 1}
                </span>

                {/* Floating Enlarge Indicator on Hover */}
                <span className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1">
                  <span>Enlarge</span>
                  <ZoomIn size={13} />
                </span>
              </div>

              {/* Project Meta & Copy */}
              <div className="pt-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-primary">
                    {project.category || "WEB APPLICATION"}
                  </span>
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground/75">
                    {project.year || "2025"}
                  </span>
                </div>

                <h3 className="mt-2 text-2xl font-medium tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl">
                  {project.title}
                </h3>

                <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground sm:text-[0.94rem]">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <span key={technology} className="editorial-tag">
                      {technology}
                    </span>
                  ))}
                </div>

                {/* Editorial Action Links */}
                <div className="mt-7 flex items-center gap-6 border-t border-border/70 pt-5">
                  {project.liveUrl && (
                    <Magnet padding={15} magnetStrength={3}>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="editorial-link inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-foreground hover:text-primary"
                      >
                        Live Demo <ArrowUpRight size={14} className="text-primary" />
                      </a>
                    </Magnet>
                  )}
                  {project.githubUrl && (
                    <Magnet padding={15} magnetStrength={3}>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="editorial-link inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      >
                        Source Code <Github size={14} />
                      </a>
                    </Magnet>
                  )}
                </div>
              </div>
              </div>
              </SpotlightCard>
            </div>
          ))}
        </div>

        {/* Heroic Graduation Project Centerpiece with GSAP Cinematic Reveal */}
        {graduationProject && (
          <div className="capstone-card-reveal mt-16 sm:mt-24">
            <article className="group grid overflow-hidden border border-border bg-muted/15 lg:grid-cols-[1.25fr_0.75fr]">
              {/* Bespoke Interactive Waste2Taste UI Mockup Canvas */}
              <div className="relative flex flex-col justify-between overflow-hidden border-b border-border bg-background/95 p-4 sm:p-6 lg:aspect-auto lg:border-b-0 lg:border-r">
                {/* Waste2Taste Platform Mockup Component */}
                <Waste2TastePlatformMockup />

                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 font-mono text-[0.65rem] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Real-Time Food Surplus Matching Interface</span>
                  </div>
                  <span className="text-primary font-medium">B.Sc. THESIS SIMULATOR</span>
                </div>
              </div>

              {/* Information Column with React Bits Spotlight */}
              <SpotlightCard 
                className="flex flex-col justify-between p-8 sm:p-10 lg:p-12"
                spotlightColor="rgba(209, 123, 79, 0.12)"
                spotlightSize={450}
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                      B.Sc. Thesis Project • 2026
                    </span>
                    <span className="font-mono text-[0.68rem] text-muted-foreground">
                      Lead Frontend Architecture
                    </span>
                  </div>

                  <h3 className="mt-5 text-3xl font-medium leading-[0.98] tracking-[-0.05em] text-foreground sm:text-5xl">
                    {graduationProject.title}
                  </h3>

                  <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                    {graduationProject.description}
                  </p>

                  {/* Highlights Spec */}
                  <div className="mt-6 space-y-2 rounded-lg border border-border/70 bg-surface/40 p-4 font-mono text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 text-foreground/90 font-medium">
                      <Sparkles size={13} className="text-primary" />
                      <span>Key Architectural Deliverables:</span>
                    </div>
                    <ul className="space-y-1 pl-5 list-disc text-[0.78rem]">
                      <li>Dual-sided donation matching for restaurants & charity shelters</li>
                      <li>Real-time geolocation pickup routing & perishable expiry guards</li>
                      <li>High-contrast responsive UI with zero-dependency accessible design</li>
                    </ul>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {graduationProject.technologies.map((technology) => (
                      <span key={technology} className="editorial-tag">
                        {technology}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-10 flex flex-wrap items-center gap-5 border-t border-border/80 pt-7">
                  {graduationProject.liveUrl && (
                    <Magnet padding={20} magnetStrength={3}>
                      <a
                        href={graduationProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brand-button inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
                      >
                        {graduationProject.liveUrl.includes("github.com") ? (
                          <>
                            View Repository <Github size={15} />
                          </>
                        ) : (
                          <>
                            Explore Project <ArrowUpRight size={15} />
                          </>
                        )}
                      </a>
                    </Magnet>
                  )}
                  {graduationProject.githubUrl && graduationProject.githubUrl !== graduationProject.liveUrl && (
                    <Magnet padding={20} magnetStrength={3}>
                      <a
                        href={graduationProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="editorial-link inline-flex items-center gap-2 py-3.5 font-mono text-xs uppercase tracking-wider text-foreground hover:text-primary"
                      >
                        Source Code <Github size={15} />
                      </a>
                    </Magnet>
                  )}
                </div>
              </SpotlightCard>
            </article>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 sm:p-8 backdrop-blur-xl"
            onClick={() => setActiveLightbox(null)}
          >
            <div 
              className="relative flex max-h-[92vh] max-w-6xl w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/30">
                <div>
                  <span className="font-mono text-xs text-primary uppercase tracking-wider">
                    {activeLightbox.category}
                  </span>
                  <h3 className="text-xl font-medium tracking-tight text-foreground">
                    {activeLightbox.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveLightbox(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                  aria-label="Close image preview"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Fullscreen Image Canvas */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                {activeLightbox.image && (
                  <Image
                    src={activeLightbox.image}
                    alt={`${activeLightbox.title} full interface`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/80 px-6 py-4 bg-background">
                <div className="flex flex-wrap gap-2">
                  {activeLightbox.technologies.map((t) => (
                    <span key={t} className="editorial-tag text-xs">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  {activeLightbox.liveUrl && (
                    <a
                      href={activeLightbox.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brand-button inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold"
                    >
                      {activeLightbox.liveUrl.includes("github.com") ? "View Repository" : "Open Live Demo"} <ExternalLink size={13} />
                    </a>
                  )}
                  {activeLightbox.githubUrl && activeLightbox.githubUrl !== activeLightbox.liveUrl && (
                    <a
                      href={activeLightbox.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-link inline-flex items-center gap-1.5 font-mono text-xs uppercase text-foreground hover:text-primary"
                    >
                      View GitHub <Github size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Bespoke Interactive Waste2Taste UI Mockup
function Waste2TastePlatformMockup() {
  const [claimedId, setClaimedId] = useState<number | null>(null);

  const listings = [
    {
      id: 1,
      title: "Artisan Bakery Surplus",
      donor: "Dokki Artisan Bakes",
      details: "18 Boxes • Fresh Breads & Pastries",
      time: "Available for 45m",
      type: "Bakery",
    },
    {
      id: 2,
      title: "Prepared Catering Trays",
      donor: "Nile Plaza Banquets",
      details: "50 Warm Meals • Rice, Chicken, Veg",
      time: "Urgent: Next 2 Hours",
      type: "Prepared Food",
    },
    {
      id: 3,
      title: "Organic Farm Crates",
      donor: "Zamalek Green Market",
      details: "12 Crates • Fresh Produce",
      time: "Cold storage ready",
      type: "Produce",
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-surface/90 shadow-sm">
      {/* App Bar */}
      <div className="flex items-center justify-between border-b border-border/70 bg-background/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
            <Leaf size={15} />
          </div>
          <div>
            <span className="text-sm font-semibold tracking-tight text-foreground">Waste2Taste</span>
            <span className="hidden sm:inline font-mono text-[0.62rem] text-muted-foreground ml-2">Food Rescue Hub</span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 font-mono text-[0.65rem] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>24 Active Donors</span>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-3 border-b border-border/60 bg-background/50 divide-x divide-border/60 text-center">
        <div className="py-2.5 px-2">
          <div className="font-mono text-xs sm:text-sm font-semibold text-foreground">3,420 kg</div>
          <div className="font-mono text-[0.58rem] sm:text-[0.62rem] text-muted-foreground uppercase">Surplus Saved</div>
        </div>
        <div className="py-2.5 px-2">
          <div className="font-mono text-xs sm:text-sm font-semibold text-emerald-500">1,280</div>
          <div className="font-mono text-[0.58rem] sm:text-[0.62rem] text-muted-foreground uppercase">Meals Given</div>
        </div>
        <div className="py-2.5 px-2">
          <div className="font-mono text-xs sm:text-sm font-semibold text-foreground">98.4%</div>
          <div className="font-mono text-[0.58rem] sm:text-[0.62rem] text-muted-foreground uppercase">Rescue Rate</div>
        </div>
      </div>

      {/* Live Surplus Listings */}
      <div className="p-3 sm:p-4 space-y-2.5">
        <div className="flex items-center justify-between font-mono text-[0.65rem] text-muted-foreground">
          <span className="font-semibold uppercase tracking-wider text-foreground">LIVE SURPLUS FEED</span>
          <span>Cairo / Giza Region</span>
        </div>

        {listings.map((item) => {
          const isClaimed = claimedId === item.id;
          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/60 p-3 transition-colors hover:border-primary/40"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">{item.title}</span>
                  <span className="rounded bg-muted px-1.5 py-0.2 font-mono text-[0.58rem] text-muted-foreground">
                    {item.type}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 font-mono text-[0.62rem] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} className="text-primary" />
                    {item.donor}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package size={10} />
                    {item.details}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <Clock size={10} />
                    {item.time}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setClaimedId(isClaimed ? null : item.id)}
                className={`shrink-0 rounded-md px-3 py-1.5 font-mono text-[0.65rem] font-semibold transition-all ${
                  isClaimed
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "border border-border bg-surface text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {isClaimed ? "✓ Claimed by Shelter" : "Claim for Shelter"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}


