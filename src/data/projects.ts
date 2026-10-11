export type Project = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  image?: string;
  badge?: string;
  category?: string;
  role?: string;
  year?: string;
  slug?: string;
  highlights?: string[];
  metrics?: { label: string; value: string };
};

export const projects: Project[] = [
  {
    id: "ecommerce",
    title: "E-Commerce Web Application",
    category: "Storefront & Catalog",
    role: "Frontend Engineer",
    year: "2025",
    slug: "e-commerce-app.vercel.app",
    description: "A production-grade e-commerce storefront with a responsive product catalog, instant faceted filtering, persistent cart lifecycle, and simulated checkout flow.",
    technologies: ["Next.js", "TypeScript", "Context API", "Tailwind CSS", "REST APIs"],
    highlights: ["Stateful Cart & Checkout", "Faceted Search & Categories", "Responsive Layout"],
    metrics: { label: "Performance", value: "98/100" },
    liveUrl: "https://e-commerce-app-five-green.vercel.app/",
    githubUrl: "https://github.com/Fares426/e-commerce-app",
    image: "/images/ecommerce.png",
  },
  {
    id: "socialapp",
    title: "Meetra",
    category: "Social Network",
    role: "Frontend Engineer",
    year: "2025",
    slug: "meetra-social-app.vercel.app",
    description: "An interactive social network platform with JWT token authentication, real-time post authoring, likes counter, and responsive user feed navigation.",
    technologies: ["React.js", "Context API", "Bootstrap", "REST APIs"],
    highlights: ["JWT Token Handshake", "Interactive Post Stream", "Responsive Feeds"],
    metrics: { label: "Architecture", value: "SPA / React" },
    liveUrl: "https://meetra-social-app.vercel.app/",
    githubUrl: "https://github.com/Fares426/Social-App",
    image: "/images/meetra.png",
  },
  {
    id: "weatherapp",
    title: "Atmos",
    category: "Weather Intelligence",
    role: "Frontend Developer",
    year: "2024",
    slug: "atmos-weather-app.vercel.app",
    description: "Real-time meteorological forecast application querying live telemetry, multi-day predictions, and geolocation conditions via WeatherAPI with graceful degradation.",
    technologies: ["JavaScript (ES6+)", "Bootstrap 5", "WeatherAPI", "Async/Await"],
    highlights: ["Live Telemetry & Radar", "3-Day Hourly Forecasts", "Error Boundary Handling"],
    metrics: { label: "API Latency", value: "<150ms" },
    liveUrl: "https://atmos-weather-app-sigma-puce.vercel.app/",
    githubUrl: "https://github.com/Fares426/atmos-weatherApp",
    image: "/images/atmos.png",
  },
  {
    id: "bookmarkmanager",
    title: "Bookmarker",
    category: "Productivity Tool",
    role: "Frontend Developer",
    year: "2024",
    slug: "bookmark-manager.vercel.app",
    description: "A fast, browser-based bookmark workspace featuring client-side persistence, real-time regex URL validation, instant keyword search, and site launching.",
    technologies: ["JavaScript", "Bootstrap 5", "Local Storage API", "Form Validation"],
    highlights: ["LocalStorage Persistence", "Strict Regex URL Guard", "Instant Filter & Jump"],
    metrics: { label: "Client Storage", value: "Zero Delay" },
    liveUrl: "https://bookmark-manager-three-xi.vercel.app/",
    githubUrl: "https://github.com/Fares426/bookmarkManager",
    image: "/images/bookmarker.png",
  },
  {
    id: "waste2taste",
    title: "Waste2Taste — A Food Rescue Platform",
    category: "Capstone Project",
    role: "Lead Frontend Architecture",
    year: "2026",
    slug: "waste2taste.org",
    badge: "Graduation Project",
    featured: true,
    description: "A community food rescue platform connecting surplus food donors (restaurants, bakeries, venues) with non-profit shelters to minimize food waste and support families in need.",
    technologies: ["React.js", "Next.js", "TypeScript", "Context API", "Tailwind CSS"],
    highlights: ["Surplus Matching Flow", "Donor & Recipient Portals", "Accessible Mobile-First UI"],
    metrics: { label: "Graduation", value: "Capstone 2026" },
    liveUrl: "https://github.com/YouSry3/Waste2Taste",
    githubUrl: "https://github.com/YouSry3/Waste2Taste",
    image: "/images/image.png",
  },
];
