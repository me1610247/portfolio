"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ── Terminal Typewriter ──────────────────────────────────────────────────────
function Typewriter({ text, speed = 45, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); onDone?.(); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return <span>{displayed}<span className="terminal-cursor">█</span></span>;
}

// ── Splash Screen ────────────────────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone: () => void }) {
  const lines = [
    { text: "$ Initializing portfolio...", delay: 0 },
    { text: "> Loading modules: [PHP] [Laravel] [Node.js] [MySQL]", delay: 900 },
    { text: "> Connecting to server...", delay: 1800 },
    { text: "> Status: 200 OK", delay: 2700 },
    { text: "$ Welcome to Mohamed Emad's portfolio.", delay: 3400 },
  ];
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    lines.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
        if (i === lines.length - 1) setTimeout(() => setDone(true), 1200);
      }, line.delay);
    });
  }, []);

  useEffect(() => { if (done) setTimeout(onDone, 600); }, [done]);

  return (
    <motion.div
      className="splash-screen"
      animate={done ? { opacity: 0, scale: 1.04 } : { opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <MatrixRain />
      <div className="splash-terminal">
        <div className="terminal-bar">
          <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
          <span className="terminal-title">bash — portfolio.sh</span>
        </div>
        <div className="terminal-body">
          {lines.map((line, i) =>
            visibleLines.includes(i) ? (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                className={`terminal-line ${line.text.startsWith(">") ? "line-info" : "line-cmd"}`}>
                {line.text}
              </motion.div>
            ) : null
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Matrix Rain ──────────────────────────────────────────────────────────────
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.floor(canvas.width / 20);
    const drops = Array(cols).fill(1);
    const chars = "アカサタナハマヤラワABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{}[]<>/\\|";
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.95 ? "#ffffff" : "#00ff41";
        ctx.font = "14px monospace";
        ctx.fillText(char, i * 20, y * 20);
        drops[i] = y > canvas.height / 20 && Math.random() > 0.975 ? 0 : y + 1;
      });
    };
    const id = setInterval(draw, 40);
    return () => clearInterval(id);
  }, []);
  return <canvas ref={canvasRef} className="matrix-canvas" />;
}

// ── Reveal wrapper ───────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

// ── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="section-header">
      <span className="section-label">{label}</span>
      <h2 className="section-title">{title}</h2>
      <div className="section-line" />
    </div>
  );
}

// ── Skills Data ──────────────────────────────────────────────────────────────
const skills = [
  { name: "PHP", level: 90, color: "#7c3aed" },
  { name: "Laravel", level: 90, color: "#f9322c" },
  { name: "MySQL", level: 85, color: "#00758f" },
  { name: "Node.js", level: 30, color: "#68a063" },
  { name: "REST APIs", level: 88, color: "#00ff41" },
  { name: "API Integrations", level: 80, color: "#d9262a" },
  { name: "Docker", level: 50, color: "#2496ed" },
  { name: "Git", level: 85, color: "#f05032" },
];

const techBadges = ["PHP", "Laravel", "Node.js", "MySQL", "Api Integration", "Third-party Services", "REST API", "Sanctum", "Git", "Nginx"];

// ── Projects Data ────────────────────────────────────────────────────────────
const projects = [
  {
    id: "01", name: "Zefaaf Platform",
    desc: "A global platform connecting young men and women across Europe and the Arab world for Islamic marriage, making the process secure and culturally appropriate.",
    tags: ["Laravel", "MySQL", "AI", "Integrations"], status: "Production-Longterm",
  },
  {
    id: "02", name: "Amlood",
    desc: "Saudi-based mental health platform, designed for psychiatric clinics to manage patient records, appointments, and therapy sessions.",
    tags: ["Laravel", "MySQL"], status: "Production",
  },
  {
    id: "03", name: "Riyadh Supplies",
    desc: "Saudi-based full-stack web application for Toyota and Nexus car parts distribution, built with Laravel Blade, covering inventory, orders, and customer management.",
    tags: ["Laravel", "Blade", "MySQL"], status: "Production",
  },
  {
    id: "04", name: "LeadUp",
    desc: "A SaaS-like project management system tailored for agencies, enabling team collaboration, project tracking, and client management.",
    tags: ["Laravel", "MySQL", "Tailwind CSS"], status: "Production",
  },
];

// ── Experience Data ──────────────────────────────────────────────────────────
const experience = [
  {
    year: "10/2025 – Present", role: "Backend Developer", company: "Tech flow",
    desc: "Building scalable Laravel APIs for clients across various industries.",
  },
  {
    year: "6/2025 – 10/2025", role: "Backend Developer", company: "SyncPoint EG",
    desc: "Developed and maintained RESTful APIs, optimized database queries, and implemented caching strategies.",
  },
  {
    year: "2024 – 2025", role: "Fullstack Developer", company: "Software Agency",
    desc: "Learned backend fundamentals, built CRUD applications, and contributed to client projects using Laravel.",
  },
];

const navLinks = ["about", "skills", "projects", "experience", "contact"];

// ── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeSection, setActiveSection] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);

  // ── Scroll spy ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = () => {
      const offsets = navLinks.map((id) => {
        const el = document.getElementById(id);
        if (!el) return { id, top: Infinity };
        return { id, top: Math.abs(el.getBoundingClientRect().top - 80) };
      });
      const closest = offsets.reduce((a, b) => (a.top < b.top ? a : b));
      setActiveSection(closest.id);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ── Close drawer on resize ───────────────────────────────────────────────
  useEffect(() => {
    const handler = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // ── mailto contact form ──────────────────────────────────────────────────
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMsg, setFormMsg] = useState("");
  const handleContact = () => {
    const subject = encodeURIComponent(`Portfolio contact from ${formName}`);
    const body = encodeURIComponent(`Name: ${formName}\nEmail: ${formEmail}\n\n${formMsg}`);
    window.location.href = `mailto:moh661324@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --green: #00ff41;
          --green-dim: #00c832;
          --green-dark: #003b0f;
          --bg: #050a05;
          --bg2: #080e08;
          --card: #0b120b;
          --border: #1a2e1a;
          --text: #c8d6c8;
          --muted: #5a7a5a;
          --white: #e8f5e8;
        }

        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--text); font-family: 'Space Grotesk', sans-serif; overflow-x: hidden; }

        /* ── Splash ── */
        .splash-screen { position: fixed; inset: 0; z-index: 100; background: #000; display: flex; align-items: center; justify-content: center; }
        .matrix-canvas { position: absolute; inset: 0; opacity: 0.35; }
        .splash-terminal {
          position: relative; z-index: 2;
          width: min(680px, 92vw);
          background: rgba(0,0,0,0.88);
          border: 1px solid var(--green);
          border-radius: 10px;
          box-shadow: 0 0 60px rgba(0,255,65,0.25), 0 0 120px rgba(0,255,65,0.08);
          overflow: hidden;
        }
        .terminal-bar { background: #111; padding: 10px 16px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #1a2e1a; }
        .dot { width: 12px; height: 12px; border-radius: 50%; }
        .dot.red { background: #ff5f57; }
        .dot.yellow { background: #febc2e; }
        .dot.green { background: #28c840; }
        .terminal-title { margin-left: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #5a7a5a; }
        .terminal-body { padding: 24px; min-height: 200px; }
        .terminal-line { font-family: 'JetBrains Mono', monospace; font-size: 14px; margin-bottom: 12px; line-height: 1.5; }
        .line-cmd { color: var(--green); }
        .line-info { color: #7aff9a; padding-left: 16px; }
        .terminal-cursor { animation: blink 0.8s step-end infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* ── Nav ── */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          background: rgba(5,10,5,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          padding: 0 32px;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo { font-family: 'JetBrains Mono', monospace; color: var(--green); font-size: 15px; font-weight: 700; letter-spacing: 1px; }
        .nav-links { display: flex; gap: 4px; }
        .nav-link {
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          color: var(--muted); text-decoration: none;
          padding: 6px 14px; border-radius: 4px;
          transition: all 0.2s; border: 1px solid transparent;
        }
        .nav-link:hover, .nav-link.active { color: var(--green); border-color: var(--green-dark); background: rgba(0,255,65,0.05); }

        /* ── Hamburger ── */
        .hamburger {
          display: none;
          flex-direction: column; justify-content: center; align-items: center;
          gap: 5px; width: 40px; height: 40px; cursor: pointer;
          background: none; border: 1px solid var(--border); border-radius: 6px;
          padding: 8px;
        }
        .hamburger span {
          display: block; width: 20px; height: 2px;
          background: var(--green); border-radius: 2px;
          transition: all 0.3s;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── Mobile Drawer ── */
        .mobile-drawer {
          position: fixed; top: 64px; left: 0; right: 0; z-index: 49;
          background: rgba(5,10,5,0.98);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          padding: 20px 24px;
          display: flex; flex-direction: column; gap: 4px;
          transform: translateY(-110%);
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .mobile-drawer.open { transform: translateY(0); }
        .mobile-nav-link {
          font-family: 'JetBrains Mono', monospace; font-size: 14px;
          color: var(--muted); text-decoration: none;
          padding: 12px 16px; border-radius: 6px;
          transition: all 0.2s; border: 1px solid transparent;
          display: flex; align-items: center; gap: 10px;
        }
        .mobile-nav-link::before { content: '>'; color: var(--green); opacity: 0.5; }
        .mobile-nav-link:hover, .mobile-nav-link.active { color: var(--green); background: rgba(0,255,65,0.05); border-color: var(--green-dark); }
        .mobile-nav-link.active::before { opacity: 1; }

        /* ── Layout ── */
        main { padding-top: 64px; }
        section { padding: 100px 32px; max-width: 1100px; margin: 0 auto; }

        /* ── Section Header ── */
        .section-header { margin-bottom: 56px; }
        .section-label { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--green); letter-spacing: 3px; text-transform: uppercase; }
        .section-title { font-size: clamp(28px, 4vw, 42px); font-weight: 700; color: var(--white); margin-top: 8px; line-height: 1.15; }
        .section-line { width: 48px; height: 2px; background: var(--green); margin-top: 16px; box-shadow: 0 0 8px var(--green); }

        /* ── Hero ── */
        .hero { min-height: 100vh; display: flex; align-items: center; padding: 0 32px; max-width: 1100px; margin: 0 auto; position: relative; }
        .hero-tag { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--green); border: 1px solid var(--green-dark); background: rgba(0,255,65,0.05); padding: 6px 14px; border-radius: 4px; margin-bottom: 24px; }
        .hero-name { font-size: clamp(42px, 7vw, 88px); font-weight: 700; color: var(--white); line-height: 1; letter-spacing: -2px; }
        .hero-name span { color: var(--green); text-shadow: 0 0 30px rgba(0,255,65,0.4); }
        .hero-role { font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 2vw, 22px); color: var(--muted); margin-top: 20px; }
        .hero-role em { color: var(--green); font-style: normal; }
        .hero-desc { max-width: 520px; margin-top: 24px; font-size: 17px; line-height: 1.7; color: #7a9a7a; }
        .hero-btns { display: flex; gap: 16px; margin-top: 40px; flex-wrap: wrap; }
        .btn-primary {
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
          padding: 12px 28px; border-radius: 5px;
          background: var(--green); color: #000; font-weight: 700;
          text-decoration: none; border: none; cursor: pointer;
          transition: all 0.2s; letter-spacing: 1px; display: inline-block;
        }
        .btn-primary:hover { background: #00c832; box-shadow: 0 0 24px rgba(0,255,65,0.4); transform: translateY(-1px); }
        .btn-outline {
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
          padding: 12px 28px; border-radius: 5px;
          background: transparent; color: var(--green); font-weight: 500;
          text-decoration: none; border: 1px solid var(--green);
          cursor: pointer; transition: all 0.2s; letter-spacing: 1px; display: inline-block;
        }
        .btn-outline:hover { background: rgba(0,255,65,0.07); box-shadow: 0 0 20px rgba(0,255,65,0.15); }
        .hero-grid-bg { position: absolute; inset: 0; background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 48px 48px; opacity: 0.4; pointer-events: none; z-index: -1; mask-image: radial-gradient(ellipse 70% 80% at 80% 50%, black 0%, transparent 70%); }

        /* ── About ── */
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
        .about-left { display: flex; flex-direction: column; gap: 24px; }

        /* ── Profile Photo ── */
        .profile-photo-wrap {
          position: relative; align-self: center;
          width: 180px; height: 180px;
        }
        .profile-photo-wrap::before {
          content: '';
          position: absolute; inset: -3px;
          border-radius: 50%;
          background: conic-gradient(var(--green) 0%, transparent 60%, var(--green) 100%);
          animation: spin 8s linear infinite;
          z-index: 0;
        }
        .profile-photo-wrap::after {
          content: '';
          position: absolute; inset: 3px;
          border-radius: 50%;
          background: var(--bg);
          z-index: 1;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .profile-photo {
          position: relative; z-index: 2;
          width: 100%; height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          filter: grayscale(20%) contrast(1.05);
        }
        .profile-photo-placeholder {
          position: relative; z-index: 2;
          width: 100%; height: 100%;
          border-radius: 50%;
          background: var(--card);
          border: 2px solid var(--border);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: var(--muted);
        }
        .profile-photo-placeholder svg { opacity: 0.4; }
        .profile-glow {
          position: absolute; inset: -20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,255,65,0.12) 0%, transparent 70%);
          z-index: 0;
          pointer-events: none;
        }

        .about-terminal { background: var(--card); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; box-shadow: 0 0 40px rgba(0,255,65,0.05); }
        .about-terminal-body { padding: 24px; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 2; }
        .at-key { color: var(--muted); }
        .at-val { color: var(--green); }
        .at-str { color: #7aff9a; }
        .at-num { color: #ffcc44; }
        .about-text p { font-size: 16px; line-height: 1.8; color: #7a9a7a; margin-bottom: 16px; }
        .about-text p strong { color: var(--white); }

        /* ── Skills ── */
        .skills-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; }
        .skill-bar-item { margin-bottom: 20px; }
        .skill-bar-top { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .skill-name { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--white); }
        .skill-pct { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--muted); }
        .skill-track { height: 5px; background: var(--border); border-radius: 99px; overflow: hidden; }
        .skill-fill { height: 100%; border-radius: 99px; }
        .badges-title { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--muted); letter-spacing: 2px; margin-bottom: 20px; text-transform: uppercase; }
        .badges { display: flex; flex-wrap: wrap; gap: 10px; }
        .badge { font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 6px 14px; border-radius: 4px; border: 1px solid var(--border); color: var(--text); background: var(--card); transition: all 0.2s; cursor: default; }
        .badge:hover { border-color: var(--green); color: var(--green); background: rgba(0,255,65,0.05); }

        /* ── Projects ── */
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
        .project-card { background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 28px; position: relative; overflow: hidden; transition: all 0.3s; cursor: default; }
        .project-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,255,65,0.04) 0%, transparent 60%); opacity: 0; transition: opacity 0.3s; }
        .project-card:hover { border-color: rgba(0,255,65,0.35); transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,255,65,0.08); }
        .project-card:hover::before { opacity: 1; }
        .project-id { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--green); opacity: 0.5; margin-bottom: 12px; letter-spacing: 2px; }
        .project-name { font-size: 20px; font-weight: 600; color: var(--white); margin-bottom: 12px; }
        .project-desc { font-size: 14px; line-height: 1.7; color: #6a8a6a; margin-bottom: 20px; }
        .project-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .project-tag { font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 3px 10px; border-radius: 3px; background: var(--green-dark); color: var(--green); }
        .project-status { font-family: 'JetBrains Mono', monospace; font-size: 11px; display: flex; align-items: center; gap: 6px; }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px var(--green); }
        .status-dot.progress { background: #ffcc44; box-shadow: 0 0 6px #ffcc44; }

        /* ── Timeline ── */
        .timeline { position: relative; padding-left: 32px; }
        .timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, var(--green), transparent); }
        .timeline-item { position: relative; padding-bottom: 48px; }
        .timeline-dot { position: absolute; left: -36px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: var(--green); box-shadow: 0 0 10px var(--green); border: 2px solid var(--bg); }
        .tl-year { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--green); margin-bottom: 8px; letter-spacing: 1px; }
        .tl-role { font-size: 18px; font-weight: 600; color: var(--white); }
        .tl-company { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--muted); margin-top: 4px; }
        .tl-desc { font-size: 14px; line-height: 1.7; color: #6a8a6a; margin-top: 12px; max-width: 520px; }

        /* ── Contact ── */
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
        .contact-intro { font-size: 16px; line-height: 1.8; color: #7a9a7a; margin-bottom: 32px; }
        .contact-links { display: flex; flex-direction: column; gap: 14px; }
        .contact-link { display: flex; align-items: center; gap: 14px; text-decoration: none; color: var(--text); font-size: 15px; transition: color 0.2s; padding: 14px 18px; border: 1px solid var(--border); border-radius: 8px; background: var(--card); }
        .contact-link:hover { color: var(--green); border-color: rgba(0,255,65,0.35); background: rgba(0,255,65,0.04); }
        .contact-link-icon { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--green); min-width: 80px; }
        .contact-form { display: flex; flex-direction: column; gap: 16px; }
        .form-input, .form-textarea {
          width: 100%; background: var(--card); border: 1px solid var(--border); border-radius: 6px;
          padding: 13px 16px; color: var(--white); font-family: 'Space Grotesk', sans-serif; font-size: 15px;
          outline: none; transition: border-color 0.2s;
        }
        .form-input:focus, .form-textarea:focus { border-color: rgba(0,255,65,0.5); box-shadow: 0 0 0 3px rgba(0,255,65,0.05); }
        .form-textarea { resize: vertical; min-height: 130px; }
        .form-input::placeholder, .form-textarea::placeholder { color: var(--muted); }

        /* ── Footer ── */
        footer { border-top: 1px solid var(--border); padding: 32px; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--muted); }
        footer span { color: var(--green); }

        /* ── Glow orb ── */
        .glow-orb { position: fixed; pointer-events: none; z-index: 0; border-radius: 50%; filter: blur(120px); opacity: 0.07; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          nav { padding: 0 16px; }
          .nav-links { display: none; }
          .hamburger { display: flex; }

          section { padding: 72px 20px; }
          .hero { padding: 80px 20px 60px; min-height: auto; }
          .hero-name { font-size: clamp(38px, 10vw, 64px); letter-spacing: -1px; }
          .hero-desc { font-size: 15px; }
          .hero-btns { gap: 12px; }
          .btn-primary, .btn-outline { padding: 11px 20px; font-size: 12px; }

          .about-grid { grid-template-columns: 1fr; gap: 32px; }
          .about-left { flex-direction: column; align-items: center; }
          .profile-photo-wrap { width: 140px; height: 140px; }

          .skills-layout { grid-template-columns: 1fr; gap: 40px; }

          .projects-grid { grid-template-columns: 1fr; }

          .contact-grid { grid-template-columns: 1fr; gap: 40px; }

          .timeline { padding-left: 24px; }
          .timeline-dot { left: -28px; }

          .section-header { margin-bottom: 40px; }
        }

        @media (max-width: 480px) {
          .hero-name { font-size: clamp(34px, 12vw, 52px); }
          .hero-role { font-size: 13px; word-break: break-word; }
          .about-terminal-body { font-size: 11px; padding: 16px; }
          .tl-role { font-size: 16px; }
        }
      `}</style>

      <AnimatePresence>
        {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      </AnimatePresence>

      {!showSplash && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>

          {/* Ambient orbs */}
          <div className="glow-orb" style={{ width: 600, height: 600, background: "#00ff41", top: "10%", left: "-10%" }} />
          <div className="glow-orb" style={{ width: 400, height: 400, background: "#00cc33", bottom: "20%", right: "-5%" }} />

          {/* ── NAV ── */}
          <nav>
            <div className="nav-logo">&gt; ME.dev</div>
            <div className="nav-links">
              {navLinks.map((link) => (
                <a key={link} href={`#${link}`} className={`nav-link ${activeSection === link ? "active" : ""}`}>
                  {link}
                </a>
              ))}
            </div>
            <button
              className={`hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </nav>

          {/* ── MOBILE DRAWER ── */}
          <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link}`}
                className={`mobile-nav-link ${activeSection === link ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {link}
              </a>
            ))}
          </div>

          {/* ── HERO ── */}
          <div className="hero" id="hero">
            <div className="hero-grid-bg" />
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <div className="hero-tag">$ Available</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h1 className="hero-name">Mohamed<br /><span>Emad</span></h1>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <p className="hero-role">&gt; <em>Backend Developer</em> // API Architect</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <p className="hero-desc">
                  I build robust, scalable server-side systems. Specializing in <strong style={{ color: "#c8d6c8" }}>Laravel</strong> APIs, database design, and backend architecture that powers great products.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="hero-btns">
                <a href="#projects" className="btn-primary">View Projects</a>
                <a href="#contact" className="btn-outline">Contact Me</a>
              </motion.div>
            </div>
          </div>

          {/* ── ABOUT ── */}
          <section id="about">
            <Reveal><SectionHeader label="// 01" title="About Me" /></Reveal>
            <div className="about-grid">
              <div className="about-left">
                {/* ── PROFILE PHOTO — replace src with your actual image path ── */}
                <Reveal delay={0.05}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div className="profile-photo-wrap">
                      <div className="profile-glow" />
                      {/*
                        Replace the placeholder below with:
                        <img src="/your-photo.jpg" alt="Mohamed Emad" className="profile-photo" />

                        Put your photo in the /public folder of your Next.js project,
                        then use src="/your-photo.jpg"
                      */}
                      {/* <div className="profile-photo-placeholder">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00ff41" strokeWidth="1.5">
                          <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                        <span>add photo</span>
                      </div> */}
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  <div className="about-terminal">
                    <div className="terminal-bar">
                      <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
                      <span className="terminal-title">me.json</span>
                    </div>
                    <div className="about-terminal-body">
                      <div><span className="at-key">{"{"}</span></div>
                      <div>&nbsp;&nbsp;<span className="at-key">"name"</span>: <span className="at-str">"Mohamed Emad"</span>,</div>
                      <div>&nbsp;&nbsp;<span className="at-key">"role"</span>: <span className="at-str">"Backend Developer"</span>,</div>
                      <div>&nbsp;&nbsp;<span className="at-key">"location"</span>: <span className="at-str">"Egypt 🇪🇬"</span>,</div>
                      <div>&nbsp;&nbsp;<span className="at-key">"experience"</span>: <span className="at-num">~2</span>,</div>
                      <div>&nbsp;&nbsp;<span className="at-key">"stack"</span>: [</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="at-str">"PHP"</span>, <span className="at-str">"Laravel"</span>,</div>
                      <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="at-str">"Node.js"</span>, <span className="at-str">"MySQL"</span></div>
                      <div>&nbsp;&nbsp;],</div>
                      <div>&nbsp;&nbsp;<span className="at-key">"open_to_work"</span>: <span className="at-val">true</span></div>
                      <div><span className="at-key">{"}"}</span></div>
                    </div>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.2}>
                <div className="about-text" style={{ paddingTop: 8 }}>
                  <p>Hey! I'm <strong>Mohamed Emad</strong>, a backend developer based in Egypt with a passion for building clean, efficient, and scalable server-side applications.</p>
                  <p>I specialize in <strong>Laravel</strong> for crafting powerful APIs and backend systems, with working knowledge of <strong>Node.js</strong> for real-time services. I care deeply about clean code, good database design, and APIs that developers actually enjoy using.</p>
                  <p>When I'm not building backends, I'm exploring system design, reading about distributed systems, or contributing to open-source projects.</p>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ── SKILLS ── */}
          <section id="skills">
            <Reveal><SectionHeader label="// 02" title="Skills & Stack" /></Reveal>
            <div className="skills-layout">
              <Reveal delay={0.1}>
                <div>
                  {skills.map((s, i) => <SkillBar key={s.name} skill={s} index={i} />)}
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div>
                  <div className="badges-title">// Technologies I work with</div>
                  <div className="badges">
                    {techBadges.map((b) => (
                      <motion.div key={b} className="badge" whileHover={{ scale: 1.05 }}>{b}</motion.div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ── PROJECTS ── */}
          <section id="projects">
            <Reveal><SectionHeader label="// 03" title="Projects" /></Reveal>
            <div className="projects-grid">
              {projects.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.1}>
                  <div className="project-card">
                    <div className="project-id">PROJECT_{p.id}</div>
                    <div className="project-name">{p.name}</div>
                    <div className="project-desc">{p.desc}</div>
                    <div className="project-tags">
                      {p.tags.map((t) => <span key={t} className="project-tag">{t}</span>)}
                    </div>
                    <div className="project-status">
                      <span className={`status-dot ${p.status === "In Progress" ? "progress" : ""}`} />
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: p.status === "In Progress" ? "#ffcc44" : "var(--green)" }}>{p.status}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── EXPERIENCE ── */}
          <section id="experience">
            <Reveal><SectionHeader label="// 04" title="Experience" /></Reveal>
            <div className="timeline">
              {experience.map((e, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <div className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="tl-year">{e.year}</div>
                    <div className="tl-role">{e.role}</div>
                    <div className="tl-company">@ {e.company}</div>
                    <div className="tl-desc">{e.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>


          {/* ── CONTACT ── */}
          <section id="contact">
            <Reveal><SectionHeader label="// 05" title="Contact" /></Reveal>
            <div className="contact-grid">
              <Reveal delay={0.1}>
                <div>
                  <p className="contact-intro">
                    I'm currently open to freelance projects and part-time opportunities. Have a backend challenge? Let's build something great together.
                  </p>
                  <div className="contact-links">
                    <a href="mailto:moh661324@gmail.com" className="contact-link">
                      <span className="contact-link-icon">[email]</span>
                      <span>moh661324@gmail.com</span>
                    </a>
                    <a
                      href="https://wa.me/201003276440"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link"
                    >
                      <span className="contact-link-icon">[whatsapp]</span>
                      <span>Chat on WhatsApp</span>
                    </a>
                    <a href="https://linkedin.com/in/mohameddakroury" target="_blank" rel="noopener noreferrer" className="contact-link">
                      <span className="contact-link-icon">[linkedin]</span>
                      <span>in/mohameddakroury</span>
                    </a>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="contact-form">
                  <input
                    className="form-input" placeholder="Your name"
                    value={formName} onChange={(e) => setFormName(e.target.value)}
                  />
                  <input
                    className="form-input" placeholder="Your email" type="email"
                    value={formEmail} onChange={(e) => setFormEmail(e.target.value)}
                  />
                  <textarea
                    className="form-textarea" placeholder="Your message..."
                    value={formMsg} onChange={(e) => setFormMsg(e.target.value)}
                  />
                  <button className="btn-primary" style={{ alignSelf: "flex-start" }} onClick={handleContact}>
                    $ send_message()
                  </button>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer>
            <p>Designed & built by <span>Mohamed Emad</span> · {new Date().getFullYear()}</p>
          </footer>

        </motion.div>
      )}
    </>
  );
}

// ── Skill Bar Component ───────────────────────────────────────────────────────
function SkillBar({ skill, index }: { skill: typeof skills[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div className="skill-bar-item" ref={ref}>
      <div className="skill-bar-top">
        <span className="skill-name">{skill.name}</span>
        <span className="skill-pct">{skill.level}%</span>
      </div>
      <div className="skill-track">
        <motion.div
          className="skill-fill"
          style={{ background: skill.color, boxShadow: `0 0 8px ${skill.color}60` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1.2, delay: index * 0.08, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}