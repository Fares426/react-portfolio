"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useSpring } from "framer-motion";

export function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [activeSection, setActiveSection] = React.useState("");
    const isClickNavigatingRef = React.useRef(false);
    const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const prefersReducedMotion = useReducedMotion();
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.2 });

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);

        const sectionIds = ["about", "skills", "projects", "education", "contact"];

        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolled(scrollY > 20);

            // If user just clicked a nav link, let that section remain active during smooth scroll
            if (isClickNavigatingRef.current) return;

            // In Hero (top of page)
            if (scrollY < 160) {
                setActiveSection("");
                return;
            }

            // Near bottom of page
            const isAtBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 60;
            if (isAtBottom) {
                const contactEl = document.getElementById("contact");
                if (contactEl && contactEl.getBoundingClientRect().top < window.innerHeight) {
                    setActiveSection("contact");
                } else {
                    setActiveSection("education");
                }
                return;
            }

            // Focal line in viewport for active section (35% down the viewport)
            const focalLine = window.innerHeight * 0.35;

            // Find section that covers the focal line
            for (const id of sectionIds) {
                const el = document.getElementById(id);
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                if (rect.top <= focalLine && rect.bottom > focalLine) {
                    setActiveSection(id);
                    return;
                }
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
        };
    }, []);

    const handleNavClick = (href: string) => {
        const id = href.replace(/^#/, "");
        setActiveSection(id);
        setIsMobileMenuOpen(false);
        isClickNavigatingRef.current = true;
        if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = setTimeout(() => {
            isClickNavigatingRef.current = false;
        }, 850);
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const navLinks = [
        { name: "About", href: "#about" },
        { name: "Skills", href: "#skills" },
        { name: "Projects", href: "#projects" },
        { name: "Education", href: "#education" },
    ];

    return (
        <header className="fixed inset-x-0 top-1.5 z-50 px-2 sm:top-3 sm:px-4 md:top-4 md:px-6" aria-label="Main navigation">
            <motion.div className="fixed left-0 right-0 top-0 z-[60] h-0.5 origin-left bg-primary" style={{ scaleX: progress }} />
            <div className={`floating-navbar mx-auto max-w-5xl px-2.5 sm:px-5 ${isScrolled ? "floating-navbar-scrolled" : ""}`}>
                <div className="flex h-11 items-center justify-between sm:h-14 md:h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link
                            href="/"
                            onClick={() => {
                                setActiveSection("");
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="flex items-center gap-1.5 text-sm font-bold tracking-tight text-foreground group sm:gap-2 sm:text-xl md:text-2xl"
                        >
                            <span className="brand-gradient flex h-7 w-7 items-center justify-center rounded-md text-xs font-black text-primary-foreground shadow-sm transition-transform duration-300 group-hover:rotate-12 sm:h-8 sm:w-8 sm:text-sm md:h-9 md:w-9 md:text-base">
                                F
                            </span>
                            <span>Hamza</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center space-x-1 md:flex" aria-label="Primary navigation">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => handleNavClick(link.href)}
                                className={`nav-link relative rounded-full px-3.5 py-2.5 text-[0.8rem] font-semibold tracking-wide ${activeSection === link.href.slice(1) ? "nav-link-active text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                {activeSection === link.href.slice(1) && (
                                    <motion.span
                                        layoutId="active-nav-link"
                                        className="absolute inset-0 -z-10 rounded-full bg-muted"
                                        transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: "easeOut" }}
                                    />
                                )}
                                <span className="relative z-10">{link.name}</span>
                            </Link>
                        ))}

                        <div className="h-4 w-px bg-border mx-2" />

                        <Link
                            href="#contact"
                            onClick={() => handleNavClick("#contact")}
                            className="brand-button ml-3 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                        >
                            Contact
                        </Link>

                        {mounted && (
                            <button
                                onClick={toggleTheme}
                                className="ml-2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                aria-label="Toggle theme"
                            >
                                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        )}
                    </nav>

                    {/* Mobile Menu Controls */}
                    <div className="flex items-center gap-1 md:hidden">
                        {mounted && (
                            <button
                                onClick={toggleTheme}
                                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                aria-label="Toggle theme"
                            >
                                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                            </button>
                        )}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-navigation"
                            aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={prefersReducedMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
                        id="mobile-navigation"
                        className="mobile-menu-panel absolute inset-x-2 top-[calc(100%+0.35rem)] overflow-hidden rounded-xl p-1.5 md:hidden"
                    >
                        <div className="space-y-0.5">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 + i * 0.04 }}
                                >
                                    <Link
                                        href={link.href}
                                        className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeSection === link.href.slice(1) ? "bg-muted text-foreground" : "text-muted-foreground"}`}
                                        onClick={() => handleNavClick(link.href)}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.22 }}
                            >
                                <Link
                                    href="#contact"
                                    className="mt-2 block rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    onClick={() => handleNavClick("#contact")}
                                >
                                    Contact Me
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
