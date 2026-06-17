import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shreya Shukla — Full Stack Developer Portfolio" },
      {
        name: "description",
        content:
          "Shreya Shukla — Fresher Full Stack / MERN Developer. Projects, skills, experience, and contact.",
      },
      { property: "og:title", content: "Shreya Shukla — Full Stack Developer" },
      {
        property: "og:description",
        content: "MERN stack developer portfolio — projects, skills, and experience.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: PortfolioPage,
});

/* ============================= Data ============================= */

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certs" },
  { id: "contact", label: "Contact" },
];

const ROLES = ["Full Stack Developer", "MERN Stack Developer", "React Developer"];

const STATS = [
  { label: "Full Stack Projects", value: 6 },
  { label: "Technologies Learned", value: 14 },
  { label: "Certifications", value: 3 },
  { label: "Internship Months", value: 3 },
];

type Skill = { name: string; level: number; cat: "Frontend" | "Backend" | "Database" | "Tools" };
const SKILLS: Skill[] = [
  { name: "HTML5", level: 95, cat: "Frontend" },
  { name: "CSS3", level: 90, cat: "Frontend" },
  { name: "JavaScript", level: 88, cat: "Frontend" },
  { name: "React.js", level: 85, cat: "Frontend" },
  { name: "Node.js", level: 80, cat: "Backend" },
  { name: "Express.js", level: 78, cat: "Backend" },
  { name: "MongoDB", level: 80, cat: "Database" },
  { name: "MySQL", level: 75, cat: "Database" },
  { name: "Git", level: 85, cat: "Tools" },
  { name: "GitHub", level: 85, cat: "Tools" },
  { name: "VS Code", level: 92, cat: "Tools" },
  { name: "Linux", level: 70, cat: "Tools" },
  { name: "REST APIs", level: 82, cat: "Tools" },
];

const SKILL_CATS = ["All", "Frontend", "Backend", "Database", "Tools"] as const;

type Project = {
  title: string;
  description: string;
  tech: string[];
  features: string[];
  demo?: string;
  github?: string;
  accent: string;
};
const PROJECTS: Project[] = [
  {
    title: "Portfolio Website",
    description:
      "Designed and developed a responsive portfolio website showcasing skills, projects, and achievements.",
    tech: ["HTML", "CSS", "JavaScript", "React.js"],
    features: ["Responsive design", "Interactive UI", "Smooth animations"],
    accent: "from-cyan-400 to-indigo-500",
  },
  {
    title: "Blog Post Website",
    description:
      "Full-stack MERN application with role-based authentication and dashboard.",
    tech: ["MongoDB", "Express.js", "React.js", "Node.js"],
    features: ["Authentication", "CRUD Operations", "User Dashboard", "Secure APIs"],
    accent: "from-fuchsia-400 to-pink-500",
  },
  {
    title: "Mental Wellness Health Tracker",
    description:
      "A responsive web application for tracking moods, wellness activities, and daily reflections.",
    tech: ["HTML", "CSS", "JavaScript", "React.js"],
    features: ["Mood Tracking", "Wellness Analytics", "Daily Reflections", "Responsive Design"],
    accent: "from-emerald-400 to-cyan-500",
  },
];

const EDUCATION = [
  {
    title: "Bachelor of Computer Applications",
    place: "Maharishi University of Information Technology",
    when: "2023 – 2026",
  },
  { title: "Intermediate", place: "Cosmopolitan Inter College", when: "2023" },
  { title: "High School", place: "Shanti Public Higher Secondary School", when: "2021" },
];

const CERTS = [
  { title: "Node.js", by: "Scaler" },
  { title: "JavaScript", by: "Scaler" },
  { title: "PHP & MySQL", by: "Spoken Tutorial, IIT Bombay" },
];

const FLOATING_TECHS = ["React", "JS", "Node", "Mongo", "Git"];

/* ============================= Hooks ============================= */

function useTypewriter(words: string[], speed = 90, pause = 1400) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = words[i % words.length];
    if (!del && text === word) {
      const t = setTimeout(() => setDel(true), pause);
      return () => clearTimeout(t);
    }
    if (del && text === "") {
      setDel(false);
      setI((v) => v + 1);
      return;
    }
    const t = setTimeout(
      () => setText(del ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
      del ? speed / 2 : speed,
    );
    return () => clearTimeout(t);
  }, [text, del, i, words, speed, pause]);

  return text;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal, .skill-bar");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useActiveSection() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);
  return active;
}

function useCounter(target: number, run: boolean, duration = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return v;
}

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "dark" | "light" | null) ?? "dark";
    setTheme(saved);
    document.documentElement.classList.toggle("light", saved === "light");
  }, []);
  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("light", next === "light");
      localStorage.setItem("theme", next);
      return next;
    });
  };
  return { theme, toggle };
}

/* ============================= Page ============================= */

function PortfolioPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Loader done={loaded} />
      {loaded && <PortfolioBody />}
    </>
  );
}

function PortfolioBody() {
  useReveal();
  const active = useActiveSection();

  // scroll progress
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="relative min-h-screen text-foreground">
      <div ref={progressRef} className="scroll-progress" />
      <Cursor />
      <Particles />
      <Nav active={active} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Certifications />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

/* ============================= Loader ============================= */

function Loader({ done }: { done: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center bg-background transition-opacity duration-700 ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-transparent border-t-[oklch(0.78_0.18_195)] border-r-[oklch(0.72_0.22_320)]" />
          <div className="absolute inset-3 grid place-items-center rounded-full glass">
            <span className="font-display text-xl font-bold gradient-text">SS</span>
          </div>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Loading portfolio…
        </p>
      </div>
    </div>
  );
}

/* ============================= Cursor ============================= */

function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let x = 0, y = 0, rx = 0, ry = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (dot.current) {
        dot.current.style.left = x + "px";
        dot.current.style.top = y + "px";
      }
    };
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ring.current) {
        ring.current.style.left = rx + "px";
        ring.current.style.top = ry + "px";
      }
      raf = requestAnimationFrame(tick);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, .tilt, [data-cursor='hover']")) {
        ring.current?.classList.add("hover");
      } else {
        ring.current?.classList.remove("hover");
      }
    };
    let raf = requestAnimationFrame(tick);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);
  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}

/* ============================= Particles ============================= */

function Particles() {
  const items = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        size: 4 + Math.random() * 10,
        x: Math.random() * 100,
        y: Math.random() * 100,
        d: 8 + Math.random() * 10,
        delay: Math.random() * -10,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDuration: `${p.d}s`,
            animationDelay: `${p.delay}s`,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
}

/* ============================= Nav ============================= */

function Nav({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
        <a href="#home" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--grad-hero)] font-display text-sm font-bold text-background">
            SS
          </span>
          <span className="hidden font-display text-base font-semibold sm:block">
            Shreya<span className="text-[oklch(0.78_0.18_195)]">.</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className={`relative rounded-lg px-3 py-2 text-sm transition-colors hover:text-foreground ${
                  active === n.id ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {n.label}
                {active === n.id && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded bg-[image:var(--grad-hero)]" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-base transition-colors hover:bg-white/10"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <a
            href="/Shreya_Shukla_Resume.pdf"
            download
            className="hidden rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/10 md:inline-block"
          >
            ↓ Resume
          </a>
          <a
            href="#contact"
            className="hidden rounded-xl bg-[image:var(--grad-hero)] px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-[1.03] md:inline-block"
          >
            Hire Me
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5">
            <span className={`h-0.5 w-5 bg-foreground transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-foreground transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 bg-foreground transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {open && (
        <div className="glass mx-auto mt-2 max-w-6xl rounded-2xl p-3 md:hidden">
          <ul className="grid gap-1">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  onClick={() => setOpen(false)}
                  href={`#${n.id}`}
                  className={`block rounded-lg px-3 py-2 text-sm ${
                    active === n.id ? "bg-white/5 text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

/* ============================= Hero ============================= */

function Hero() {
  const typed = useTypewriter(ROLES);
  return (
    <section id="home" className="section-pad relative pt-36">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div className="reveal">
          <p className="heading-eyebrow">Hello, world — I'm</p>
          <h1 className="mt-3 font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl md:text-7xl">
            Shreya <span className="gradient-text">Shukla</span>
          </h1>
          <div className="mt-5 flex items-center gap-2 font-mono text-lg text-muted-foreground sm:text-xl">
            <span className="text-[oklch(0.78_0.18_195)]">{">"}</span>
            <span className="text-foreground">{typed}</span>
            <span className="inline-block h-5 w-[2px] animate-blink bg-[oklch(0.78_0.18_195)]" />
          </div>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Fresher Full Stack Developer with knowledge of HTML, CSS, JavaScript, React.js,
            Node.js, Express.js, MongoDB, and MySQL. Passionate about building responsive web
            apps, REST APIs, and solving real-world problems through technology.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="group inline-flex items-center gap-2 rounded-xl bg-[image:var(--grad-hero)] px-5 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.03] glow"
            >
              ↓ Download Resume
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/10"
            >
              View Projects →
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              Contact Me
            </a>
          </div>
        </div>

        <div className="reveal relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-white/15" />
          <div className="absolute inset-6 animate-pulse-ring rounded-full bg-[image:var(--grad-hero)] opacity-30 blur-2xl" />
          <div className="glass absolute inset-8 grid place-items-center rounded-full">
            <span className="font-display text-7xl font-black gradient-text">SS</span>
          </div>
          {FLOATING_TECHS.map((t, i) => {
            const angle = (i / FLOATING_TECHS.length) * Math.PI * 2;
            const r = 46;
            const x = 50 + Math.cos(angle) * r;
            const y = 50 + Math.sin(angle) * r;
            return (
              <div
                key={t}
                className="glass absolute -translate-x-1/2 -translate-y-1/2 animate-float rounded-2xl px-3 py-2 font-mono text-xs font-semibold"
                style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.4}s` }}
              >
                {t}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================= About ============================= */

function About() {
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setSeen(true),
      { threshold: 0.3 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="section-pad relative">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="01 — About" title="A quick learner building for the web" />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="reveal space-y-5 text-muted-foreground">
            <p>
              I'm Shreya Shukla, a fresher Full Stack Developer pursuing my BCA at Maharishi
              University. My career objective is simple: build software that's fast,
              accessible, and genuinely useful.
            </p>
            <p>
              I love taking an idea from a Figma sketch to a deployed MERN application —
              writing clean React components on the frontend, designing REST APIs on the
              backend, and shipping with Git/GitHub.
            </p>
            <ul className="grid gap-2 pt-2 text-sm">
              {[
                "Passionate about responsive, modern web UI",
                "Quick learner who enjoys picking up new stacks",
                "Strong problem-solving and debugging mindset",
                "Comfortable across MERN, MySQL, and REST APIs",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.18_195)]" />
                  <span className="text-foreground/85">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div ref={ref} className="reveal grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} run={seen} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, run }: { label: string; value: number; run: boolean }) {
  const v = useCounter(value, run);
  return (
    <div className="glass tilt rounded-2xl p-5 transition-transform hover:-translate-y-1">
      <div className="font-display text-4xl font-black gradient-text">{v}+</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

/* ============================= Skills ============================= */

function Skills() {
  const [filter, setFilter] = useState<(typeof SKILL_CATS)[number]>("All");
  const filtered = SKILLS.filter((s) => filter === "All" || s.cat === filter);

  return (
    <section id="skills" className="section-pad relative">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="02 — Skills" title="My toolbox" />
        <div className="mt-8 flex flex-wrap gap-2">
          {SKILL_CATS.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                filter === c
                  ? "border-transparent bg-[image:var(--grad-hero)] text-background glow"
                  : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <div
              key={s.name}
              className="glass group reveal rounded-2xl p-5 transition-all hover:-translate-y-1 hover:glow"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">{s.name}</h3>
                <span className="font-mono text-xs text-[oklch(0.78_0.18_195)]">{s.level}%</span>
              </div>
              <div className="mt-3 skill-bar" style={{ ["--w" as never]: `${s.level}%` }}>
                <span />
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {s.cat}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================= Experience ============================= */

function Experience() {
  return (
    <section id="experience" className="section-pad relative">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="03 — Experience" title="Where I've built things" />
        <div className="relative mt-12 pl-8">
          <div className="absolute left-2 top-0 h-full w-px bg-gradient-to-b from-[oklch(0.78_0.18_195)] via-[oklch(0.72_0.22_320)] to-transparent" />
          <TimelineItem
            when="May 2025 – July 2025"
            title="Full Stack Developer Intern"
            place="Infoseek Software System"
            bullets={[
              "Developed full-stack web applications using React.js, Node.js, Express.js and MongoDB.",
              "Integrated REST APIs across services and the React frontend.",
              "Improved UI/UX responsiveness across mobile and desktop.",
              "Worked in an Agile environment with sprint planning and code reviews.",
              "Used Git and GitHub for version control and team collaboration.",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  when,
  title,
  place,
  bullets,
}: {
  when: string;
  title: string;
  place: string;
  bullets: string[];
}) {
  return (
    <div className="reveal relative">
      <span className="absolute -left-[27px] top-2 grid h-4 w-4 place-items-center rounded-full bg-[image:var(--grad-hero)] glow">
        <span className="h-1.5 w-1.5 rounded-full bg-background" />
      </span>
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-xl font-bold">{title}</h3>
          <span className="font-mono text-xs text-[oklch(0.78_0.18_195)]">{when}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{place}</p>
        <ul className="mt-4 grid gap-2 text-sm text-foreground/85">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[oklch(0.72_0.22_320)]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ============================= Projects ============================= */

function Projects() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Project | null>(null);

  const filtered = PROJECTS.filter(
    (p) =>
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.tech.join(" ").toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <section id="projects" className="section-pad relative">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="04 — Projects" title="Selected work" />

        <div className="mt-8 flex justify-end">
          <div className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm">
            <span className="text-muted-foreground">🔎</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects or tech…"
              className="w-56 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.title} project={p} onOpen={() => setOpen(p)} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-12 text-center text-sm text-muted-foreground">
              No matching projects.
            </p>
          )}
        </div>
      </div>

      {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateY(-4px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="tilt reveal glass group relative overflow-hidden rounded-2xl p-6"
    >
      <div
        className={`absolute inset-x-0 -top-20 h-40 bg-gradient-to-br ${project.accent} opacity-20 blur-3xl transition-opacity group-hover:opacity-40`}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-[oklch(0.78_0.18_195)]">Project</span>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-sm">
            {"</>"}
          </span>
        </div>
        <h3 className="mt-3 font-display text-xl font-bold">{project.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-foreground/80"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={onOpen}
            className="rounded-lg bg-[image:var(--grad-hero)] px-3 py-1.5 text-xs font-semibold text-background"
          >
            View Details
          </button>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold hover:bg-white/5"
          >
            Live Demo
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold hover:bg-white/5"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass animate-reveal relative w-full max-w-2xl rounded-2xl p-8"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/15 hover:bg-white/5"
          aria-label="Close"
        >
          ✕
        </button>
        <span className="font-mono text-xs text-[oklch(0.78_0.18_195)]">Project Details</span>
        <h3 className="mt-2 font-display text-3xl font-black gradient-text">{project.title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

        <div className="mt-6">
          <h4 className="text-sm font-semibold">Tech Stack</h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold">Key Features</h4>
          <ul className="mt-2 grid gap-1.5 text-sm text-foreground/85">
            {project.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-[oklch(0.72_0.22_320)]" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex gap-2">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="rounded-lg bg-[image:var(--grad-hero)] px-4 py-2 text-sm font-semibold text-background"
          >
            Live Demo
          </a>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

/* ============================= Education ============================= */

function Education() {
  return (
    <section id="education" className="section-pad relative">
      <div className="mx-auto max-w-4xl">
        <SectionHeading eyebrow="05 — Education" title="Academic journey" />
        <div className="relative mt-12 pl-8">
          <div className="absolute left-2 top-0 h-full w-px bg-gradient-to-b from-[oklch(0.72_0.22_320)] via-[oklch(0.78_0.18_195)] to-transparent" />
          {EDUCATION.map((e) => (
            <div key={e.title} className="reveal relative mb-6">
              <span className="absolute -left-[27px] top-2 grid h-4 w-4 place-items-center rounded-full bg-[image:var(--grad-hero)] glow">
                <span className="h-1.5 w-1.5 rounded-full bg-background" />
              </span>
              <div className="glass rounded-2xl p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-bold">{e.title}</h3>
                  <span className="font-mono text-xs text-[oklch(0.78_0.18_195)]">{e.when}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{e.place}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================= Certifications ============================= */

function Certifications() {
  const [open, setOpen] = useState<(typeof CERTS)[number] | null>(null);
  return (
    <section id="certifications" className="section-pad relative">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="06 — Certifications" title="Continuous learning" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CERTS.map((c) => (
            <button
              key={c.title}
              onClick={() => setOpen(c)}
              className="glass reveal group rounded-2xl p-6 text-left transition-all hover:-translate-y-1 hover:glow"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[image:var(--grad-hero)] text-background">
                  ★
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Certificate
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.by}</p>
              <p className="mt-4 text-xs text-[oklch(0.78_0.18_195)] opacity-0 transition-opacity group-hover:opacity-100">
                Preview →
              </p>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass animate-reveal w-full max-w-lg rounded-2xl p-8 text-center"
          >
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-[image:var(--grad-hero)] text-3xl text-background">
              ★
            </div>
            <h3 className="mt-5 font-display text-2xl font-black gradient-text">{open.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Issued by {open.by}</p>
            <p className="mt-5 text-xs text-muted-foreground">
              This certificate verifies the completion of coursework and assessments.
            </p>
            <button
              onClick={() => setOpen(null)}
              className="mt-6 rounded-lg bg-[image:var(--grad-hero)] px-4 py-2 text-sm font-semibold text-background"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ============================= Achievements ============================= */

function Achievements() {
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0.4,
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const c1 = useCounter(1, seen);

  return (
    <section id="achievements" className="section-pad relative">
      <div ref={ref} className="mx-auto max-w-5xl">
        <div className="glass gradient-border relative overflow-hidden rounded-3xl p-8 sm:p-12">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[image:var(--grad-hero)] opacity-20 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
            <div className="grid h-24 w-24 place-items-center rounded-2xl bg-[image:var(--grad-hero)] text-5xl text-background animate-float">
              🏆
            </div>
            <div>
              <p className="heading-eyebrow">Achievement</p>
              <h3 className="mt-2 font-display text-2xl font-black sm:text-3xl">
                Smart India Hackathon — Top Selected Team (Internal Round)
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Team <span className="text-foreground">Haven Ventures</span> — selected in the
                internal round of Smart India Hackathon (SIH).
              </p>
            </div>
            <div className="text-center">
              <div className="font-display text-6xl font-black gradient-text">{c1}</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Hackathon Win
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================= Contact ============================= */

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (form.message.trim().length < 10) errs.message = "Message must be at least 10 characters";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="section-pad relative">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="07 — Contact" title="Let's build something together" />
        <div className="mt-10 grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <ContactItem icon="✉" label="Email" value="shuklashreya731@gmail.com" href="mailto:shuklashreya731@gmail.com" />
            <ContactItem icon="☎" label="Phone" value="+91 63875 53114" href="tel:+916387553114" />
            <ContactItem
              icon="in"
              label="LinkedIn"
              value="linkedin.com/in/shreya-shukla-612894304"
              href="https://linkedin.com/in/shreya-shukla-612894304"
            />
            <ContactItem icon="GH" label="GitHub" value="github.com/shreya-shukla" href="https://github.com/" />
            <div className="glass mt-6 flex items-center gap-3 rounded-2xl p-4">
              {["Li", "GH", "X", "Ig"].map((s) => (
                <a
                  key={s}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-xs font-bold transition-colors hover:bg-white/10"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={submit} className="glass reveal rounded-2xl p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                error={errors.name}
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                error={errors.email}
              />
            </div>
            <div className="mt-4">
              <Field
                label="Subject"
                value={form.subject}
                onChange={(v) => setForm({ ...form, subject: v })}
                error={errors.subject}
              />
            </div>
            <div className="mt-4">
              <Field
                label="Message"
                textarea
                value={form.message}
                onChange={(v) => setForm({ ...form, message: v })}
                error={errors.message}
              />
            </div>
            <button
              type="submit"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[image:var(--grad-hero)] px-5 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.02] glow"
            >
              Send Message →
            </button>
            {sent && (
              <div className="animate-reveal mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                ✓ Thanks! Your message has been received. I'll reply soon.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="glass group flex items-center gap-4 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:glow"
    >
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-[image:var(--grad-hero)] font-bold text-background">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
    </a>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  error?: string;
}) {
  const [focus, setFocus] = useState(false);
  const float = focus || value.length > 0;
  return (
    <label className="relative block">
      <span
        className={`pointer-events-none absolute left-4 transition-all ${
          float
            ? "top-1 text-[10px] font-mono uppercase tracking-widest text-[oklch(0.78_0.18_195)]"
            : "top-3.5 text-sm text-muted-foreground"
        }`}
      >
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          rows={5}
          className={`w-full rounded-xl border bg-white/5 px-4 pb-3 pt-6 text-sm outline-none transition-colors ${
            error ? "border-red-400/60" : "border-white/10 focus:border-[oklch(0.78_0.18_195)]"
          }`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className={`w-full rounded-xl border bg-white/5 px-4 pb-2 pt-6 text-sm outline-none transition-colors ${
            error ? "border-red-400/60" : "border-white/10 focus:border-[oklch(0.78_0.18_195)]"
          }`}
        />
      )}
      {error && <span className="mt-1 block text-xs text-red-300">{error}</span>}
    </label>
  );
}

/* ============================= Footer ============================= */

function Footer() {
  return (
    <footer className="relative border-t border-white/5 px-5 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--grad-hero)] font-display text-sm font-bold text-background">
              SS
            </span>
            <span className="font-display text-base font-semibold">Shreya Shukla</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Full Stack / MERN developer crafting modern web experiences.
          </p>
        </div>
        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-[oklch(0.78_0.18_195)]">
            Quick Links
          </h4>
          <ul className="mt-3 grid grid-cols-2 gap-1 text-sm text-muted-foreground">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="hover:text-foreground">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-[oklch(0.78_0.18_195)]">
            Connect
          </h4>
          <div className="mt-3 flex gap-2">
            {["Li", "GH", "X", "Ig"].map((s) => (
              <a
                key={s}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-xs font-bold hover:bg-white/10"
              >
                {s}
              </a>
            ))}
          </div>
          <a
            href="#home"
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs hover:bg-white/5"
          >
            ↑ Back to top
          </a>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-6xl border-t border-white/5 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Shreya Shukla — Designed & built with ♥ using React.
      </div>
    </footer>
  );
}

/* ============================= Helpers ============================= */

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="reveal max-w-2xl">
      <p className="heading-eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl md:text-5xl">
        {title.split(" ").map((w, i, arr) =>
          i === arr.length - 1 ? (
            <span key={i} className="gradient-text">
              {" "}
              {w}
            </span>
          ) : (
            <span key={i}>{i === 0 ? "" : " "}{w}</span>
          ),
        )}
      </h2>
    </div>
  );
}
