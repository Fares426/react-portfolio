"use client";

import { ArrowUpRight, Award, GraduationCap } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { DecryptedText } from "@/components/ui/DecryptedText";

export function Education() {
  return (
    <section id="education" className="section-rule bg-muted/20 py-32 lg:py-48">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <FadeIn className="grid gap-10 lg:grid-cols-[0.3fr_1fr] lg:gap-20">
          <div>
            <DecryptedText 
              text="04 / FOUNDATION" 
              animateOn="view" 
              speed={40} 
              maxIterations={10} 
              className="section-number pt-3" 
            />
          </div>
          <h2 className="max-w-3xl text-5xl font-medium leading-[0.95] tracking-[-0.06em] text-foreground md:text-7xl">
            Learning that keeps the work honest.
          </h2>
        </FadeIn>
        <StaggerContainer delayChildren={0.2} staggerChildren={0.15} className="mt-24 border-t border-border">
          <StaggerItem className="grid gap-8 border-b border-border py-9 lg:grid-cols-[0.3fr_1fr_auto] lg:items-start lg:gap-20">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-primary">2026 / Degree</span>
            <div>
              <div className="mb-4 flex items-center gap-3 text-muted-foreground"><GraduationCap size={19} /><span className="text-sm">Egyptian E-Learning University</span></div>
              <h3 className="text-2xl font-medium tracking-tight text-foreground md:text-4xl">B.Sc. — Faculty of Computers and Information</h3>
            </div>
            <span className="text-sm font-medium text-foreground">3.74 / 4.0</span>
          </StaggerItem>
          <StaggerItem className="grid gap-8 border-b border-border py-9 lg:grid-cols-[0.3fr_1fr_auto] lg:items-start lg:gap-20">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-primary">2024—25 / Diploma</span>
            <div>
              <div className="mb-4 flex items-center gap-3 text-muted-foreground"><Award size={19} /><span className="text-sm">Route Academy</span></div>
              <h3 className="text-2xl font-medium tracking-tight text-foreground md:text-4xl">Frontend Web Development Diploma (React.js)</h3>
            </div>
            <ArrowUpRight size={20} className="text-muted-foreground" />
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
