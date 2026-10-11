import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/Icons";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <Link href="/" className="group flex items-center gap-3 text-lg font-medium tracking-tight text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold italic text-primary-foreground transition-transform group-hover:rotate-12">F</span>
          Fares Hamza
        </Link>
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Designed & built with intent · Cairo, Egypt</p>
        <div className="flex items-center gap-5 text-muted-foreground">
          <a href="mailto:farishamza426@gmail.com" aria-label="Email" className="transition-colors hover:text-primary"><Mail size={17} /></a>
          <a href="https://github.com/Fares426" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-colors hover:text-primary"><Github size={17} /></a>
          <a href="https://www.linkedin.com/in/faris-hamza-a81321267" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-primary"><Linkedin size={17} /></a>
          <a href="#home" aria-label="Back to top" className="ml-2 transition-colors hover:text-primary"><ArrowUpRight size={18} /></a>
        </div>
      </div>
    </footer>
  );
}
