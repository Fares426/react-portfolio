"use client";

import { FormEvent, useState } from "react";
import { Mail, Send } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/Icons";
import { FadeIn } from "@/components/ui/motion";
import { DecryptedText } from "@/components/ui/DecryptedText";
import { Magnet } from "@/components/ui/Magnet";

export function Contact() {
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setStatus("idle");
    setErrorMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.get("name"), email: formData.get("email"), message: formData.get("message") }),
      });
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? "Unable to send message");
      }
      form.reset();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to send message");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section id="contact" className="section-rule bg-background py-32 lg:py-48">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <FadeIn className="grid gap-10 lg:grid-cols-[0.3fr_1fr] lg:gap-20">
          <div>
            <DecryptedText 
              text="05 / CONTACT" 
              animateOn="view" 
              speed={40} 
              maxIterations={10} 
              className="section-number pt-3" 
            />
          </div>
          <div>
            <h2 className="max-w-5xl text-5xl font-medium leading-[0.9] tracking-[-0.07em] text-foreground md:text-8xl">Let&apos;s make the next screen count.</h2>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6">
              <a href="mailto:farishamza426@gmail.com" className="editorial-link inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><Mail size={15} /> Email me</a>
              <a href="https://github.com/Fares426" target="_blank" rel="noopener noreferrer" className="editorial-link inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><Github size={15} /> GitHub</a>
              <a href="https://www.linkedin.com/in/faris-hamza-a81321267" target="_blank" rel="noopener noreferrer" className="editorial-link inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><Linkedin size={15} /> LinkedIn</a>
            </div>
          </div>
        </FadeIn>

        <div className="mt-24 grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <FadeIn direction="right" className="flex flex-col justify-between border-t border-border pt-6">
            <p className="max-w-sm text-lg leading-relaxed text-muted-foreground">Have a product, a rough idea, or a problem worth solving? Send it over. I&apos;ll get back to you with a clear next step.</p>
            <div className="mt-16 hidden items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-primary lg:flex"><span className="h-2 w-2 rounded-full bg-primary" /> Open to opportunities</div>
          </FadeIn>
          <FadeIn delay={0.15} className="border-t border-border pt-6">
            <div className="mb-9">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-medium tracking-tight text-foreground">Tell me about the project</h3>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">Usually replies within 1–2 days</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A name, email, and a few words about what you&apos;re making is enough to start.</p>
            </div>
            <form className="space-y-9" onSubmit={handleSubmit}>
              <div className="grid gap-8 sm:grid-cols-2">
                <label className="text-sm font-medium text-foreground">Name <span className="text-primary">*</span><input type="text" name="name" minLength={2} required placeholder="Your name" autoComplete="name" className="mt-3 w-full border-b border-border bg-transparent pb-3 text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary" /></label>
                <label className="text-sm font-medium text-foreground">Email <span className="text-primary">*</span><input type="email" name="email" required placeholder="you@example.com" autoComplete="email" className="mt-3 w-full border-b border-border bg-transparent pb-3 text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary" /></label>
              </div>
              <label className="block text-sm font-medium text-foreground">Message <span className="text-primary">*</span><textarea name="message" minLength={10} rows={4} required placeholder="What are you building, and how can I help?" className="mt-3 w-full resize-none border-b border-border bg-transparent pb-3 text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary" /></label>
              <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
                <p aria-live="polite" className="text-sm text-muted-foreground">{status === "success" && "Message sent — thank you."}{status === "error" && (errorMessage || "Something went wrong.")}</p>
                <Magnet padding={20} magnetStrength={3}>
                  <button type="submit" disabled={isSending} className="brand-button group inline-flex items-center gap-3 rounded-full px-7 py-4 font-semibold">{isSending ? "Sending..." : "Start a conversation"}<Send size={16} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></button>
                </Magnet>
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
