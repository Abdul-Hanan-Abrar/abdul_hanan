import { useState, useEffect } from "react";
import heroPhoto from "./imports/WhatsApp_Image_2026-08-28_at_11.53.53_AM.jpeg";
import aboutPhoto from "./imports/WhatsApp_Image_2026-08-28_at_11.52.11_AM.jpeg";
import bizLedgerImg from "./imports/Opera_Snapshot_2026-08-28_172607_BizLedger.html.png";
import qrToolImg from "./imports/Opera_Snapshot_2026-08-28_172707_claude.ai.png";

// ─── External URLs & Dynamic Paths ───────────────────────────────────────────
// Encoded path ensures mobile browsers download correctly without failing on spaces
const RESUME_URL = `${import.meta.env.BASE_URL}Abdul_Hanan%20CV.pdf`;
const PORTFOLIO_URL = "https://github.com/Abdul-Hanan-Abrar";
const LINKEDIN = "https://www.linkedin.com/in/abdul-hanan-abrar-8b6a9140b/";
const EMAIL = "abdulhananabrar941@gmail.com";

// ─── Smart Email Action Dispatcher ────────────────────────────────────────────
// Mobile: triggers native Gmail app via mailto:
// Desktop: opens Gmail web composer directly in a new browser tab
const handleEmailAction = (e?: React.MouseEvent, subject = "", body = "") => {
  if (e) e.preventDefault();
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const encSubject = encodeURIComponent(subject);
  const encBody = encodeURIComponent(body);

  if (isMobile) {
    window.location.href = `mailto:${EMAIL}?subject=${encSubject}&body=${encBody}`;
  } else {
    const composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${encSubject}&body=${encBody}`;
    window.open(composeUrl, "_blank", "noopener,noreferrer");
  }
};

// ─── Color constants ─────────────────────────────────────────────────────────
const C = {
  bg: "#F8F7F4",
  white: "#FFFFFF",
  altBg: "#F1EEE9",
  text: "#161616",
  body: "#3C3C3C",
  muted: "#787878",
  green: "#1D5C3A",
  darkGreen: "#0F3D24",
  lightGreen: "#EBF5EE",
  greenBorder: "#B8DCC3",
  amber: "#C47B2B",
  lightAmber: "#FBF3E8",
  amberBorder: "#E8C99A",
  border: "#E3DED7",
};

// ─── Reusable components ──────────────────────────────────────────────────────
function SectionLabel({ children }: { children: string }) {
  return (
    <span
      className="text-xs font-semibold uppercase tracking-widest"
      style={{ color: C.green }}
    >
      {children}
    </span>
  );
}

function SectionHeading({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <h2
      className="text-3xl sm:text-4xl font-bold mt-2 mb-6"
      style={{ color: light ? "#fff" : C.text }}
    >
      {children}
    </h2>
  );
}

function Tag({ children, green = false }: { children: string; green?: boolean }) {
  return (
    <span
      className="inline-block text-xs font-medium px-3 py-1 rounded-full"
      style={
        green
          ? { background: C.lightGreen, color: C.darkGreen, border: `1px solid ${C.greenBorder}` }
          : { background: C.altBg, color: C.body, border: `1px solid ${C.border}` }
      }
    >
      {children}
    </span>
  );
}

function BtnPrimary({
  children,
  onClick,
  href,
  download,
  target,
}: {
  children: string;
  onClick?: () => void;
  href?: string;
  download?: string | boolean;
  target?: string;
}) {
  const cls =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95 text-center";
  const style = { background: C.green, color: "#fff" };
  if (href) {
    return (
      <a
        href={href}
        download={download}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={cls}
        style={style}
      >
        {children}
      </a>
    );
  }
  return <button onClick={onClick} className={cls} style={style}>{children}</button>;
}

function BtnOutlineAmber({
  children,
  onClick,
  href,
  download,
  target,
}: {
  children: string;
  onClick?: () => void;
  href?: string;
  download?: string | boolean;
  target?: string;
}) {
  const cls =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95 text-center";
  const style = { border: `1.5px solid ${C.amber}`, color: C.amber, background: "transparent" };
  if (href) {
    return (
      <a
        href={href}
        download={download}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={cls}
        style={style}
      >
        {children}
      </a>
    );
  }
  return <button onClick={onClick} className={cls} style={style}>{children}</button>;
}

function BtnOutlineWhite({
  children,
  onClick,
  href,
  target,
}: {
  children: string;
  onClick?: () => void;
  href?: string;
  target?: string;
}) {
  const cls =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-white/10 active:scale-95 text-center";
  const style = { border: "1.5px solid rgba(255,255,255,0.5)", color: "#fff" };
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={cls}
        style={style}
      >
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cls} style={style}>
      {children}
    </button>
  );
}

// ─── Project Modal ────────────────────────────────────────────────────────────
type Project = {
  title: string;
  subtitle: string;
  status: string;
  description: string;
  tags: string[];
  image: string;
  meta?: string;
  fullDescription: string;
};

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,61,36,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: C.white }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full" style={{ background: "#0a0a0a" }}>
          <img
            src={project.image}
            alt={project.title}
            className="w-full object-contain max-h-[50vh]"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg transition-opacity hover:opacity-80"
            style={{ background: "rgba(0,0,0,0.6)" }}
          >
            ×
          </button>
          <span
            className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full"
            style={
              project.status === "Completed"
                ? { background: C.lightGreen, color: C.darkGreen }
                : { background: C.lightAmber, color: C.amber }
            }
          >
            {project.status}
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <h3 className="text-2xl font-bold mb-1" style={{ color: C.text }}>{project.title}</h3>
          <p className="text-sm font-medium mb-4" style={{ color: C.muted }}>{project.subtitle}</p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: C.body }}>{project.fullDescription}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
          {project.meta && (
            <p className="text-xs" style={{ color: C.muted }}>{project.meta}</p>
          )}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: C.green, color: "#fff" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Audio Player Card ────────────────────────────────────────────────────────
function AudioCard({
  title,
  titleUrdu,
  description,
  duration,
  driveId,
}: {
  title: string;
  titleUrdu: string;
  description: string;
  duration: string;
  driveId: string;
}) {
  const [open, setOpen] = useState(false);
  const embedUrl = `https://drive.google.com/file/d/${driveId}/preview`;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md"
      style={{ background: C.white, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-semibold text-sm" style={{ color: C.text }}>{title}</h4>
            <p className="urdu text-sm mt-0.5" style={{ color: C.green }}>{titleUrdu}</p>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{ background: open ? C.darkGreen : C.green }}
            aria-label={open ? "Close player" : `Play ${title}`}
          >
            {open ? (
              <svg width="12" height="14" viewBox="0 0 12 14" fill="white">
                <rect x="0" y="0" width="4" height="14" rx="1" />
                <rect x="8" y="0" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="12" height="14" viewBox="0 0 12 14" fill="white">
                <path d="M1 0.5L11 7L1 13.5V0.5Z" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs" style={{ color: C.muted }}>{description}</p>
        <p className="text-xs" style={{ color: C.muted }}>Duration: {duration}</p>
      </div>

      {open && (
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          <iframe
            src={embedUrl}
            width="100%"
            height="80"
            allow="autoplay"
            style={{ display: "block", border: "none" }}
            title={title}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", topic: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "ai-tutor", label: "AI Tutor" },
    { id: "experience", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "voice", label: "Voice" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const handler = () => {
      const sections = navLinks.map((n) => n.id);
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(id);
          return;
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const projects: Project[] = [
    {
      title: "BizLedger",
      subtitle: "Offline POS & Business Management App for Punjab Retail",
      status: "In Development",
      description:
        "A fully self-contained, offline-first Point-of-Sale and business management application built for small retail shops across Punjab.",
      fullDescription:
        "BizLedger is a fully self-contained, offline-first Point-of-Sale and business management application built for small retail shops across Punjab. It requires no internet connection, no external server, and no monthly fees — everything runs directly in the browser using local storage. The application handles sales tracking, inventory management with low-stock alerts, expense recording, and monthly reporting. It targets over 1.3 million shops in Punjab that currently operate without any digital POS software. Built entirely with HTML5 and JavaScript with zero dependencies.",
      tags: ["HTML5", "JavaScript", "Offline-First", "POS System", "Punjab Retail"],
      image: bizLedgerImg,
      meta: "🏬 1.3M+ target shops · 📴 Zero internet needed",
    },
    {
      title: "QR File Transfer Tool",
      subtitle: "No Internet. No Cable. Just Scan.",
      status: "Completed",
      description:
        "Transfer files from desktop to phone using QR codes — no internet connection and no USB cable required.",
      fullDescription:
        "The QR File Transfer Tool solves a genuinely recurring problem: getting files from a desktop computer to a phone without an internet connection or USB cable. The sender side encodes the file into a QR code displayed on screen. The receiver side, opened on the phone's browser, uses the BarcodeDetector API to scan the QR code via the phone's camera and decode the file. The entire system works over a local hotspot or even offline. Built entirely with vanilla HTML5 and JavaScript, with no server, no upload, and no cloud dependency.",
      tags: ["HTML5", "JavaScript", "BarcodeDetector API", "QR Code", "File Transfer"],
      image: qrToolImg,
    },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `[Portfolio] ${formData.topic} — from ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\nTopic: ${formData.topic}\n\n${formData.message}`;
    handleEmailAction(undefined, subject, body);
    setFormSent(true);
  };

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Navbar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-40"
        style={{
          background: "rgba(248,247,244,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <button
            onClick={() => scrollTo("home")}
            className="text-lg font-bold tracking-tight"
            style={{ color: C.text }}
          >
            Abdul Hanan
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="text-sm font-medium transition-colors"
                style={{ color: activeSection === n.id ? C.green : C.muted }}
              >
                {n.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <BtnOutlineAmber href={RESUME_URL} download="Abdul_Hanan_CV.pdf" target="_blank">Resume</BtnOutlineAmber>
            <BtnPrimary href={PORTFOLIO_URL} target="_blank">Portfolio</BtnPrimary>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-sm font-medium" style={{ color: C.muted }}>LinkedIn ↗</a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className={`block w-5 h-0.5 transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} style={{ background: C.text }} />
            <span className={`block w-5 h-0.5 transition-all ${mobileOpen ? "opacity-0" : ""}`} style={{ background: C.text }} />
            <span className={`block w-5 h-0.5 transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} style={{ background: C.text }} />
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div
            className="lg:hidden px-4 pb-4 pt-2 flex flex-col gap-1"
            style={{ borderTop: `1px solid ${C.border}`, background: "rgba(248,247,244,0.98)" }}
          >
            {navLinks.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="text-left text-sm font-medium py-2.5 px-3 rounded-lg transition-colors"
                style={{
                  color: activeSection === n.id ? C.green : C.body,
                  background: activeSection === n.id ? C.lightGreen : "transparent",
                }}
              >
                {n.label}
              </button>
            ))}
            <div className="flex gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
              <BtnOutlineAmber href={RESUME_URL} download="Abdul_Hanan_CV.pdf" target="_blank">Resume</BtnOutlineAmber>
              <BtnPrimary href={PORTFOLIO_URL} target="_blank">Portfolio</BtnPrimary>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section id="home" className="pt-24 pb-16 sm:pt-28 sm:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-20 items-center">

            {/* Left */}
            <div>
              <span
                className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-5"
                style={{ background: C.lightGreen, color: C.darkGreen, border: `1px solid ${C.greenBorder}` }}
              >
                Faisalabad, Pakistan · BSc Computer Science · 2+ Years Experience
              </span>

              <div className="flex items-center gap-5 sm:gap-8 mb-4">
                <h1
                  className="font-bold leading-none tracking-tight"
                  style={{ color: C.text, fontSize: "clamp(3rem, 7vw, 5.5rem)", lineHeight: 1.0 }}
                >
                  ABDUL<br />HANAN
                </h1>
                <div
                  className="lg:hidden flex-shrink-0 overflow-hidden rounded-full"
                  style={{
                    width: "clamp(90px, 18vw, 160px)",
                    height: "clamp(90px, 18vw, 160px)",
                    border: `3px solid ${C.greenBorder}`,
                    boxShadow: `0 0 0 5px ${C.lightGreen}`,
                    background: C.altBg,
                  }}
                >
                  <img src={heroPhoto} alt="Abdul Hanan" className="w-full h-full object-cover object-top" />
                </div>
              </div>

              <p className="text-base font-medium mb-3" style={{ color: C.green }}>
                AI Urdu Language Tutor · Customer Support & Operations Specialist · Computer Science Student
              </p>

              <p className="urdu text-xl sm:text-2xl mb-4 leading-loose font-semibold" style={{ color: C.green }}>
                اردو زبان میں اے آئی کو سکھانا — میری خاصیت ہے
              </p>

              <p className="text-base leading-relaxed mb-6 max-w-xl" style={{ color: C.body }}>
                Native Urdu speaker with two years of professional bilingual experience — ready to help AI companies
                build systems that truly understand how Urdu is spoken, written and mixed with English in real-life contexts.
              </p>

              <div className="flex flex-wrap gap-3 mb-4">
                <BtnPrimary onClick={() => scrollTo("ai-tutor")}>Explore AI Tutor Work</BtnPrimary>
                <BtnOutlineAmber onClick={() => scrollTo("experience")}>View Experience</BtnOutlineAmber>
                <a
                  href={RESUME_URL}
                  download="Abdul_Hanan_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium px-5 py-2.5 rounded-lg transition-colors hover:opacity-80 inline-flex items-center justify-center"
                  style={{ border: `1.5px solid ${C.border}`, color: C.body }}
                >
                  Download Resume
                </a>
              </div>

              <button
                onClick={() => scrollTo("voice")}
                className="text-sm font-medium transition-opacity hover:opacity-70 block mb-5"
                style={{ color: C.muted }}
              >
                ↓ Listen to Urdu Voice Samples
              </button>

              <div className="flex flex-wrap gap-2">
                {["Urdu — C2", "Punjabi — Fluent", "English — Professional", "AI Urdu Tutor", "Customer Support", "Operations"].map((t) => (
                  <Tag key={t} green>{t}</Tag>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="hidden lg:flex items-center justify-center">
              <div
                className="flex-shrink-0 overflow-hidden rounded-full"
                style={{
                  width: 280,
                  height: 280,
                  border: `4px solid ${C.greenBorder}`,
                  boxShadow: `0 0 0 10px ${C.lightGreen}, 0 12px 48px rgba(29,92,58,0.18)`,
                  background: C.altBg,
                }}
              >
                <img src={heroPhoto} alt="Abdul Hanan" className="w-full h-full object-cover object-top" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── What I Bring ── */}
      <section id="strengths" className="py-12 sm:py-16" style={{ background: C.altBg }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 lg:gap-12 items-start">
            <div className="lg:pt-1">
              <SectionLabel>Core Strengths</SectionLabel>
              <SectionHeading>What I Bring</SectionHeading>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: "🧠", title: "AI Urdu Tutor", desc: "Native Urdu speaker able to train, annotate and evaluate AI language models in authentic Urdu." },
                { icon: "💬", title: "Customer Support", desc: "Clear, respectful bilingual communication with clients via phone, email and WhatsApp." },
                { icon: "⚙️", title: "Operations", desc: "Inventory tracking, record management and operational problem solving — day to day." },
                { icon: "🔍", title: "Problem Solving", desc: "Finding the root cause of a problem instead of just working around it." },
                { icon: "💻", title: "Technology", desc: "BSc CS education with practical skills in Excel, Python and JavaScript." },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-xl p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: C.white, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                >
                  <span className="text-2xl mb-3 block">{c.icon}</span>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: C.text }}>{c.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-16 sm:py-20" style={{ background: C.white }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <div className="flex items-center justify-between gap-6 mb-6">
                <div>
                  <SectionLabel>About Me</SectionLabel>
                  <h2 className="text-3xl sm:text-4xl font-bold mt-2 leading-tight" style={{ color: C.text }}>
                    A Little<br />About Me
                  </h2>
                </div>
                <div
                  className="flex-shrink-0 lg:hidden overflow-hidden rounded-full"
                  style={{
                    width: 100,
                    height: 100,
                    border: `3px solid ${C.greenBorder}`,
                    boxShadow: `0 0 0 4px ${C.lightGreen}`,
                    background: C.altBg,
                  }}
                >
                  <img src={aboutPhoto} alt="Abdul Hanan" className="w-full h-full object-cover object-top" />
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed" style={{ color: C.body }}>
                <p>I'm Abdul Hanan, a BSc Computer Science student based in Faisalabad, Pakistan, with professional experience in customer support and operations at Aptly Pharmaceuticals.</p>
                <p>My experience has taught me that good support is not only about answering questions — it's about understanding the real problem, communicating clearly, keeping accurate records and working with teams to reach a practical solution.</p>
                <p>Beyond my day job, I build software independently — BizLedger, an offline POS system for small Punjab retailers; a QR file-transfer tool; and Python automation scripts that save real time at work.</p>
                <p>I'm particularly comfortable in Urdu and English, and I'm actively looking to contribute to AI language projects where authentic Urdu communication matters.</p>
              </div>

              <blockquote
                className="my-6 pl-4 py-2 text-sm italic font-medium"
                style={{ borderLeft: `3px solid ${C.amber}`, color: C.body }}
              >
                "I'm most comfortable where communication meets problem solving."
              </blockquote>

              <div className="flex flex-wrap gap-3">
                <BtnPrimary onClick={() => scrollTo("ai-tutor")}>AI Tutor Work</BtnPrimary>
                <BtnOutlineAmber href={RESUME_URL} download="Abdul_Hanan_CV.pdf" target="_blank">Download Resume</BtnOutlineAmber>
              </div>
            </div>

            <div className="hidden lg:flex justify-center items-start pt-4">
              <div
                className="overflow-hidden rounded-full"
                style={{
                  width: 260,
                  height: 260,
                  border: `4px solid ${C.greenBorder}`,
                  boxShadow: `0 0 0 8px ${C.lightGreen}, 0 8px 32px rgba(29,92,58,0.14)`,
                  background: C.altBg,
                }}
              >
                <img src={aboutPhoto} alt="Abdul Hanan" className="w-full h-full object-cover object-top" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Tutor ── */}
      <section id="ai-tutor" className="py-16 sm:py-20 relative overflow-hidden" style={{ background: C.darkGreen }}>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10" style={{ background: C.green }} />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10" style={{ background: C.green }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: C.amber }}
              >
                Open to AI & Language Opportunities
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-2 text-white leading-tight">
                Training AI in Urdu —<br />The Right Way
              </h2>
              <p className="urdu text-lg mb-5" style={{ color: "#a7d4b8" }}>
                اردو میں اے آئی کو سکھانا — صحیح طریقے سے
              </p>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#c8dfd2" }}>
                Most AI systems still struggle with authentic, natural Urdu — the kind spoken in homes, offices and on the street in Pakistan. As a native Urdu speaker with professional bilingual experience, I want to help AI companies build systems that truly understand how Urdu is spoken, written and mixed with English in real-life contexts.
              </p>

              <ul className="space-y-2.5 mb-8">
                {[
                  "Native Urdu speaker — natural, idiomatic, regionally authentic",
                  "Professional English fluency for bilingual code-switching training data",
                  "Customer support background — real conversational scenarios, not just text",
                  "Computer Science education — understands AI/ML workflow and requirements",
                  "Voice clarity and tone control — usable for speech and text datasets",
                  "Available for structured, ongoing training collaboration",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: "#c8dfd2" }}>
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: C.amber }} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <BtnPrimary onClick={() => scrollTo("contact")}>Discuss an Opportunity</BtnPrimary>
                <BtnOutlineWhite onClick={() => scrollTo("voice")}>▶ Hear Voice Samples</BtnOutlineWhite>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: "🗣️", title: "Conversation Data", desc: "Natural Urdu dialogues, Q&A pairs and support scenarios for training datasets." },
                { icon: "📝", title: "Text Annotation", desc: "Labelling, correcting and evaluating AI-generated Urdu text for accuracy and naturalness." },
                { icon: "🔤", title: "Code-Switching", desc: "Urdu–English mixed speech — the way Pakistanis actually communicate daily." },
                { icon: "🎙️", title: "Voice Samples", desc: "Recorded Urdu speech in natural, professional and instructional tones for ASR training." },
                { icon: "✅", title: "AI Response Eval", desc: "Reviewing and rating AI-generated Urdu responses for fluency and cultural accuracy." },
                { icon: "📚", title: "Tutoring Scenarios", desc: "Structured Urdu explanations ideal for AI tutor and education products." },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-xl p-4 transition-all duration-200 hover:bg-white/10"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <span className="text-xl mb-2 block">{c.icon}</span>
                  <h4 className="font-semibold text-sm text-white mb-1">{c.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: "#a7c4b5" }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Experience ── */}
      <section id="experience" className="py-16 sm:py-20" style={{ background: C.white }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel>Professional History</SectionLabel>
          <SectionHeading>Professional Experience</SectionHeading>

          <div className="relative pl-6" style={{ borderLeft: `2px solid ${C.greenBorder}` }}>
            <div
              className="absolute -left-2 top-0 w-4 h-4 rounded-full"
              style={{ background: C.green }}
            />
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h3 className="text-xl font-bold" style={{ color: C.text }}>Aptly Pharmaceuticals</h3>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: C.lightGreen, color: C.darkGreen }}
                >
                  Currently Here
                </span>
              </div>
              <p className="font-semibold text-sm mb-1" style={{ color: C.green }}>Customer Support & Operations Specialist</p>
              <div className="flex flex-wrap gap-3 text-xs mb-3" style={{ color: C.muted }}>
                <span>Faisalabad, Pakistan</span>
                <span>·</span>
                <span>June 2024 – Present</span>
              </div>
              <p className="text-sm leading-relaxed max-w-2xl mb-5" style={{ color: C.body }}>
                Working across customer support and operational tasks — helping clients with product-related questions,
                coordinating with internal teams and maintaining accurate operational information.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { icon: "💬", title: "Customer Support", desc: "Answered product-related questions from clients and coordinated with internal teams to resolve issues efficiently." },
                  { icon: "📂", title: "Client Records", desc: "Maintained written records of customer cases and interactions to keep information organized and accessible." },
                  { icon: "📦", title: "Inventory Tracking", desc: "Maintained live Excel-based inventory tracking across major pharmaceutical product lines." },
                  { icon: "✅", title: "Data Validation", desc: "Added validation rules to reduce stock discrepancies and improve data accuracy site-wide." },
                  { icon: "📊", title: "Reporting Fix", desc: "Identified and fixed a DD/MM vs MM/DD date-format issue that was silently breaking monthly reports." },
                  { icon: "⚙️", title: "Process Improvement", desc: "Built Excel tools that reduced manual work and improved efficiency in monthly reporting workflows." },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="rounded-xl p-4 transition-all hover:shadow-md hover:-translate-y-0.5 duration-200"
                    style={{ background: C.bg, border: `1px solid ${C.border}` }}
                  >
                    <span className="text-lg mb-2 block">{c.icon}</span>
                    <h4 className="font-semibold text-xs mb-1" style={{ color: C.text }}>{c.title}</h4>
                    <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{c.desc}</p>
                  </div>
                ))}
              </div>

              <div
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full"
                style={{ background: C.lightGreen, color: C.darkGreen }}
              >
                📅 2+ years of customer support & operations experience
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Education ── */}
      <section id="education" className="py-16 sm:py-20" style={{ background: C.altBg }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <SectionLabel>Academic Background</SectionLabel>
          <SectionHeading>Education</SectionHeading>

          <div
            className="max-w-xl mx-auto rounded-2xl overflow-hidden"
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="h-1"
              style={{ background: `linear-gradient(90deg, ${C.green}, ${C.amber})` }}
            />
            <div className="p-8">
              <h3 className="text-xl font-bold mb-1" style={{ color: C.text }}>Bachelor of Science in Computer Science</h3>
              <p className="font-semibold text-sm mb-1" style={{ color: C.green }}>University of Agriculture, Faisalabad (UAF)</p>
              <p className="text-xs mb-4" style={{ color: C.muted }}>Currently Pursuing · Semester 5 · Expected Graduation 2028</p>
              <p className="text-sm leading-relaxed mb-5" style={{ color: C.body }}>
                Studying Computer Science while building practical professional experience in customer support, operations, technology and digital tools.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["HTML5", "JavaScript", "Python", "Data Structures", "OOP", "Databases"].map((t) => (
                  <Tag key={t} green>{t}</Tag>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section id="skills" className="py-16 sm:py-20" style={{ background: C.white }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel>Capabilities</SectionLabel>
          <SectionHeading>Skills</SectionHeading>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Communication",
                items: ["Urdu — Native", "Punjabi — Fluent", "English — Professional", "AI Language Training", "Urdu Text Annotation"],
              },
              {
                title: "Customer Support",
                items: ["Query Handling", "Issue Resolution", "Case Documentation", "WhatsApp / Email / Phone"],
              },
              {
                title: "Operations",
                items: ["Inventory Tracking", "Record Management", "Process Improvement", "Reporting"],
              },
              {
                title: "Technical",
                items: ["Microsoft Excel", "Python", "HTML5", "JavaScript", "Problem Solving"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="font-bold text-sm mb-3" style={{ color: C.text }}>{col.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {col.items.map((item) => <Tag key={item}>{item}</Tag>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="py-16 sm:py-20" style={{ background: C.altBg }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel>Built by Me</SectionLabel>
          <SectionHeading>Selected Work</SectionHeading>
          <p className="text-sm max-w-xl mb-10" style={{ color: C.muted }}>
            Practical problems I've worked on and solutions I've built — from offline retail software to AI-ready tools and operational Excel systems.
          </p>

          <h3 className="font-semibold text-sm mb-4" style={{ color: C.muted }}>Software Projects</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
            {projects.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
                style={{ background: C.white, border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <div
                  className="w-full overflow-hidden relative"
                  style={{ background: "#0a0a0a", maxHeight: "200px" }}
                >
                  <img
                    src={p.image}
                    alt={p.title + " screenshot"}
                    className="w-full object-cover object-top"
                    style={{ maxHeight: "200px" }}
                  />
                  <span
                    className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={
                      p.status === "Completed"
                        ? { background: C.lightGreen, color: C.darkGreen }
                        : { background: C.lightAmber, color: C.amber }
                    }
                  >
                    {p.status}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-0.5" style={{ color: C.text }}>{p.title}</h3>
                  <p className="text-xs font-medium mb-3" style={{ color: C.muted }}>{p.subtitle}</p>
                  <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: C.body }}>{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                  </div>
                  {p.meta && (
                    <p className="text-xs mb-3" style={{ color: C.muted }}>{p.meta}</p>
                  )}
                  <button
                    onClick={() => setSelectedProject(p)}
                    className="text-sm font-semibold transition-colors hover:opacity-70 text-left"
                    style={{ color: C.green }}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-sm mb-4" style={{ color: C.muted }}>Operations & Excel Projects</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { status: "Active Use", title: "Inventory Tracking System", desc: "Excel workflow maintaining up-to-date pharmaceutical stock across multiple SKUs and reducing discrepancies." },
              { status: "Completed", title: "Reporting Workflow", desc: "Spreadsheet workflow reducing repetitive monthly reporting work and improving team efficiency." },
              { status: "Completed", title: "Data Validation System", desc: "Validation rules across spreadsheets reducing operational data errors and improving consistency." },
              { status: "Completed", title: "Date Format Error Fix", desc: "Found and fixed a DD/MM vs MM/DD date issue that was silently corrupting monthly reporting data." },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                style={{ background: C.white, border: `1px solid ${C.border}` }}
              >
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 inline-block"
                  style={
                    c.status === "Active Use"
                      ? { background: C.lightGreen, color: C.darkGreen }
                      : { background: C.altBg, color: C.muted }
                  }
                >
                  {c.status}
                </span>
                <h4 className="font-semibold text-sm mb-2" style={{ color: C.text }}>{c.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm mb-3" style={{ color: C.muted }}>Want to see the full project portfolio?</p>
            <BtnPrimary href={PORTFOLIO_URL} target="_blank">Explore Full Portfolio →</BtnPrimary>
          </div>
        </div>
      </section>

      {/* ── Voice Samples ── */}
      <section id="voice" className="py-16 sm:py-20" style={{ background: C.white }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel>Audio Samples</SectionLabel>
          <SectionHeading>Hear How I Communicate</SectionHeading>
          <p className="text-sm max-w-xl mb-8" style={{ color: C.muted }}>
            Communication is one of the most important parts of my work. Short samples demonstrating my Urdu style across different professional situations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <AudioCard
              title="Natural Conversational Urdu"
              titleUrdu="قدرتی اردو گفتگو"
              description="A natural, conversational Urdu sample demonstrating authentic everyday speech."
              duration="0:57"
              driveId="1HwU5rnsZRMyuXdO0r0dKWlIb9KCyvkWS"
            />
            <AudioCard
              title="Natural Urdu-English Communication"
              titleUrdu="اردو انگریزی — مشترکہ گفتگو"
              description="Natural switching between Urdu and English — the way Pakistanis actually communicate."
              duration="1:03"
              driveId="1zc2Ueipl-LcaeeI5lsYRUM3g10GxI4jY"
            />
          </div>

          <div className="text-center">
            <p className="text-sm mb-3" style={{ color: C.muted }}>Want to hear the complete collection?</p>
            <BtnPrimary href={PORTFOLIO_URL} target="_blank">View Full Voice Portfolio →</BtnPrimary>
          </div>
        </div>
      </section>

      {/* ── Why Work With Me ── */}
      <section className="py-16 sm:py-20" style={{ background: C.altBg }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel>Why Me</SectionLabel>
          <SectionHeading>Why Work With Me</SectionHeading>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "I Communicate Clearly", desc: "I focus on understanding what someone actually needs before trying to solve the problem — in Urdu, in English, or in both at once." },
              { title: "I Notice the Details", desc: "Small errors in data or processes can create large downstream problems. I genuinely enjoy finding and fixing those issues." },
              { title: "I Keep Learning", desc: "Studying Computer Science while building real practical skills through professional work and independent software projects." },
            ].map((c) => (
              <div key={c.title} className="pt-5">
                <div className="w-8 h-0.5 mb-4" style={{ background: C.amber }} />
                <h3 className="font-bold text-base mb-2" style={{ color: C.text }}>{c.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.body }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How I Work ── */}
      <section className="py-16 sm:py-20" style={{ background: C.white }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel>My Approach</SectionLabel>
          <SectionHeading>How I Work</SectionHeading>

          <div className="relative">
            <div
              className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px"
              style={{ background: C.border }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Understand", desc: "Listen carefully and understand the actual problem." },
                { step: "02", title: "Investigate", desc: "Look at the details instead of making assumptions." },
                { step: "03", title: "Solve", desc: "Find a practical solution that works in the real situation." },
                { step: "04", title: "Improve", desc: "Look for ways to prevent the same problem from happening again." },
              ].map((s) => (
                <div key={s.step} className="text-center relative">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 font-bold text-white text-sm"
                    style={{ background: C.green }}
                  >
                    {s.step}
                  </div>
                  <h3 className="font-bold text-sm mb-1" style={{ color: C.text }}>{s.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Resume CTA ── */}
      <section className="py-16 sm:py-20" style={{ background: C.lightAmber, borderTop: `1px solid ${C.amberBorder}` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: C.text }}>Download My Resume</h2>
              <p className="text-sm mb-3" style={{ color: C.body }}>A concise overview of my experience, skills, education and contact information — ready to share.</p>
              <p className="urdu text-base" style={{ color: C.amber }}>میرا ریزومے ڈاؤن لوڈ کریں</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <BtnPrimary href={RESUME_URL} download="Abdul_Hanan_CV.pdf" target="_blank">Download PDF Resume</BtnPrimary>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-80 text-center"
                style={{ border: `1.5px solid ${C.amber}`, color: C.amber }}
              >
                View LinkedIn ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Portfolio CTA ── */}
      <section className="py-16 sm:py-20" style={{ background: C.green }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Want to See More?</h2>
          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "#a7d4b8" }}>
            This website gives you a quick picture of who I am. My portfolio goes deeper into projects, work samples and Urdu voice samples.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <BtnOutlineWhite href={PORTFOLIO_URL} target="_blank">Explore Full Portfolio →</BtnOutlineWhite>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:bg-white/10 text-center"
              style={{ color: "#a7d4b8", border: "1.5px solid rgba(255,255,255,0.2)" }}
            >
              Back to LinkedIn ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-16 sm:py-20" style={{ background: C.altBg }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionLabel>Get in Touch</SectionLabel>
          <SectionHeading>Let's Connect</SectionHeading>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: C.body }}>
                Whether you're interested in AI Urdu training, customer support work, or discussing any opportunity — feel free to reach out.
              </p>
              <div className="space-y-3 mb-6">
                <a
                  href={`mailto:${EMAIL}`}
                  onClick={(e) => handleEmailAction(e, "Portfolio Inquiry", "Hi Abdul Hanan,\n\n")}
                  className="flex items-center gap-3 text-sm hover:opacity-70 transition-opacity"
                  style={{ color: C.body }}
                >
                  <span className="text-base">✉️</span> {EMAIL}
                </a>
                <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm hover:opacity-70 transition-opacity" style={{ color: C.body }}>
                  <span className="text-base">🔗</span> LinkedIn Profile ↗
                </a>
                <p className="flex items-center gap-3 text-sm" style={{ color: C.body }}>
                  <span className="text-base">📍</span> Faisalabad, Pakistan 🇵🇰
                </p>
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: C.muted }}>Open To:</p>
              <div className="flex flex-wrap gap-2">
                {["AI Urdu Training", "Language Annotation", "Remote Work", "Freelance", "Customer Support Roles", "Software Collaboration"].map((t) => (
                  <Tag key={t} green>{t}</Tag>
                ))}
              </div>
            </div>

            {/* Form */}
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{ background: C.white, border: `1px solid ${C.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
            >
              {formSent ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: C.text }}>Message Sent</h3>
                  <p className="text-sm" style={{ color: C.muted }}>Thank you for reaching out. I'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {[
                    { label: "Full Name", key: "name", type: "text", placeholder: "Your name" },
                    { label: "Email Address", key: "email", type: "email", placeholder: "your@email.com" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>{f.label}</label>
                      <input
                        type={f.type}
                        required
                        placeholder={f.placeholder}
                        value={(formData as Record<string, string>)[f.key]}
                        onChange={(e) => setFormData((d) => ({ ...d, [f.key]: e.target.value }))}
                        className="w-full text-sm px-3.5 py-2.5 rounded-lg outline-none transition-all"
                        style={{
                          border: `1.5px solid ${C.border}`,
                          color: C.text,
                          background: C.bg,
                        }}
                        onFocus={(e) => (e.target.style.borderColor = C.green)}
                        onBlur={(e) => (e.target.style.borderColor = C.border)}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>Topic</label>
                    <select
                      required
                      value={formData.topic}
                      onChange={(e) => setFormData((d) => ({ ...d, topic: e.target.value }))}
                      className="w-full text-sm px-3.5 py-2.5 rounded-lg outline-none transition-all"
                      style={{ border: `1.5px solid ${C.border}`, color: formData.topic ? C.text : C.muted, background: C.bg }}
                    >
                      <option value="" disabled>Select a topic</option>
                      <option>AI Urdu Training Opportunity</option>
                      <option>Language Annotation / Evaluation</option>
                      <option>Customer Support Role</option>
                      <option>Freelance Project</option>
                      <option>Software Collaboration</option>
                      <option>General Enquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: C.text }}>Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell me about the opportunity or project..."
                      value={formData.message}
                      onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                      className="w-full text-sm px-3.5 py-2.5 rounded-lg outline-none transition-all resize-none"
                      style={{ border: `1.5px solid ${C.border}`, color: C.text, background: C.bg }}
                      onFocus={(e) => (e.target.style.borderColor = C.green)}
                      onBlur={(e) => (e.target.style.borderColor = C.border)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: C.green }}
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12" style={{ background: "#0f0f0f" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-1">Abdul Hanan</h3>
            <p className="text-sm" style={{ color: "#787878" }}>
              AI Urdu Tutor · Customer Support & Operations · Computer Science · Faisalabad, Pakistan 🇵🇰
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-8">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm transition-colors hover:text-white"
                style={{ color: "#787878" }}
              >
                {l.label}
              </button>
            ))}
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-sm transition-colors hover:text-white" style={{ color: "#787878" }}>LinkedIn ↗</a>
            <a href={RESUME_URL} download="Abdul_Hanan_CV.pdf" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors hover:text-white" style={{ color: "#787878" }}>Download Resume</a>
          </div>
          <div style={{ borderTop: "1px solid #2a2a2a" }} className="pt-6">
            <p className="text-xs" style={{ color: "#555" }}>© 2026 Abdul Hanan. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ── Project Modal ── */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
