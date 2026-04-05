import {createContext, useContext, useEffect, useRef, useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
    ArrowUp,
    Award,
    BarChart3,
    Box,
    Briefcase,
    CheckCircle2,
    ChevronDown,
    Clock,
    Cloud,
    Code2,
    Cpu,
    Database,
    Download,
    ExternalLink,
    FileText,
    GitBranch,
    Globe,
    GraduationCap,
    Layers,
    Mail,
    MapPin,
    Menu,
    Moon,
    Phone,
    Rocket,
    Server,
    Shield,
    Star,
    Sun,
    TrendingUp,
    Users,
    X,
    Zap,
} from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/* ═══════════════════════════════════════════════════════
   APPLE LIQUID GLASS — THEME TOKENS
   Inspired by iOS 26 / macOS Tahoe liquid glass materials
   ═══════════════════════════════════════════════════════ */
const themes = {
  light: {
    // Backgrounds
    bg: "#F2F2F7",
    meshA: "rgba(120, 180, 255, .12)",
    meshB: "rgba(200, 130, 255, .08)",
    meshC: "rgba(100, 220, 200, .06)",
    meshD: "rgba(255, 170, 120, .05)",
    // Glass
    glass: "rgba(255,255,255,.55)",
    glassHover: "rgba(255,255,255,.72)",
    glassBorder: "rgba(255,255,255,.6)",
    glassBorderHover: "rgba(255,255,255,.85)",
    glassShadow: "0 2px 20px rgba(0,0,0,.04), 0 8px 40px rgba(0,0,0,.06)",
    glassShadowHover: "0 4px 24px rgba(0,0,0,.06), 0 16px 56px rgba(0,0,0,.10)",
    glassBlur: "blur(40px) saturate(1.8)",
    // Nav
    navGlass: "rgba(255,255,255,.62)",
    navBorder: "rgba(255,255,255,.5)",
    navBlur: "blur(40px) saturate(2)",
    // Text
    text: "#1D1D1F",
    textSecondary: "#48484A",
    textMuted: "#8E8E93",
    // Accent
    accent: "#007AFF",
    accentSoft: "rgba(0,122,255,.10)",
    accentGlow: "rgba(0,122,255,.18)",
    accent2: "#34C759",
    accent3: "#FF9500",
    accent4: "#AF52DE",
    accent5: "#FF3B30",
    // Misc
    gradient: "linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)",
    gradientText: "linear-gradient(135deg, #007AFF 0%, #5856D6 100%)",
    barBg: "rgba(0,122,255,.08)",
    barFill: "linear-gradient(90deg, #007AFF 0%, #5AC8FA 100%)",
    scrollThumb: "rgba(0,0,0,.15)",
    toggleBg: "rgba(0,0,0,.04)",
    pillBg: "rgba(0,122,255,.07)",
    pillBorder: "rgba(0,122,255,.12)",
    divider: "rgba(0,0,0,.06)",
    tagBg: "rgba(0,0,0,.03)",
  },
  dark: {
    bg: "#000000",
    meshA: "rgba(80, 140, 255, .08)",
    meshB: "rgba(160, 90, 220, .06)",
    meshC: "rgba(60, 180, 160, .05)",
    meshD: "rgba(220, 130, 80, .04)",
    glass: "rgba(44,44,46,.45)",
    glassHover: "rgba(58,58,60,.55)",
    glassBorder: "rgba(255,255,255,.08)",
    glassBorderHover: "rgba(255,255,255,.14)",
    glassShadow: "0 2px 20px rgba(0,0,0,.15), 0 8px 40px rgba(0,0,0,.2)",
    glassShadowHover: "0 4px 24px rgba(0,0,0,.2), 0 16px 56px rgba(0,0,0,.35)",
    glassBlur: "blur(40px) saturate(1.6)",
    navGlass: "rgba(30,30,30,.55)",
    navBorder: "rgba(255,255,255,.06)",
    navBlur: "blur(40px) saturate(1.8)",
    text: "#F5F5F7",
    textSecondary: "#A1A1A6",
    textMuted: "#6E6E73",
    accent: "#0A84FF",
    accentSoft: "rgba(10,132,255,.12)",
    accentGlow: "rgba(10,132,255,.2)",
    accent2: "#30D158",
    accent3: "#FF9F0A",
    accent4: "#BF5AF2",
    accent5: "#FF453A",
    gradient: "linear-gradient(135deg, #0A84FF 0%, #64D2FF 100%)",
    gradientText: "linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)",
    barBg: "rgba(10,132,255,.1)",
    barFill: "linear-gradient(90deg, #0A84FF 0%, #64D2FF 100%)",
    scrollThumb: "rgba(255,255,255,.12)",
    toggleBg: "rgba(255,255,255,.06)",
    pillBg: "rgba(10,132,255,.1)",
    pillBorder: "rgba(10,132,255,.18)",
    divider: "rgba(255,255,255,.06)",
    tagBg: "rgba(255,255,255,.04)",
  },
};
const ThemeCtx = createContext(null);

/** Consume the current theme tokens and mode from ThemeCtx. */
const useTheme = () => useContext(ThemeCtx);

/**
 * Wraps the app with a theme context.
 * Persists the selected mode ("dark" | "light") to localStorage.
 * @param {{ children: React.ReactNode }} props
 */
function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem("theme") || "dark"; } catch { return "dark"; }
  });
  const toggle = () => setMode(p => {
    const n = p === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", n); } catch {}
    return n;
  });
  const t = { ...themes[mode], mode };
  return <ThemeCtx.Provider value={{ t, mode, toggle }}>{children}</ThemeCtx.Provider>;
}
/* ═══════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════ */

/**
 * Returns [ref, isVisible]. Attaches an IntersectionObserver to the ref
 * and sets isVisible=true once the element enters the viewport.
 * Disconnects automatically after the first intersection (fire-once).
 * @param {number} [threshold=0.12] - Fraction of an element visible to trigger.
 * @returns {[React.RefObject, boolean]}
 */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/**
 * Animates children into view when they scroll into the viewport.
 * Uses useInView internally; wraps children in a div with a CSS transition.
 * @param {{ children: React.ReactNode, delay?: number, direction?: "up"|"down"|"left"|"right"|"none", style?: React.CSSProperties }} props
 */
function FadeIn({ children, delay = 0, direction = "up", style = {} }) {
  const [ref, vis] = useInView();
  const dirs = {
    up: "translateY(32px)", down: "translateY(-32px)",
    left: "translateX(32px)", right: "translateX(-32px)", none: "none",
  };
  return (
    <div ref={ref} style={{
      ...style, opacity: vis ? 1 : 0,
      transform: vis ? "none" : dirs[direction],
      transition: `opacity .8s cubic-bezier(.22,1,.36,1) ${delay}s, transform .8s cubic-bezier(.22,1,.36,1) ${delay}s`,
    }}>{children}</div>
  );
}
/* ═══════════════════════════════════════════════════════
   SHARED — GLASS CARD, PILL, SECTION
   ═══════════════════════════════════════════════════════ */

/**
 * Frosted-glass card with optional hover-lift animation.
 * Reads glass tokens (background, blur, border, shadow) from the active theme.
 * @param {{ children: React.ReactNode, style?: React.CSSProperties, radius?: number, hoverLift?: boolean }} props
 */
function GlassCard({ children, style: s = {}, radius = 24, hoverLift = true }) {
  const { t } = useTheme();
    /** @type {React.RefObject<HTMLDivElement>} */
    const ref = useRef(null);
  return (
    <div ref={ref} style={{
      background: t.glass,
      backdropFilter: t.glassBlur, WebkitBackdropFilter: t.glassBlur,
      borderRadius: radius,
      border: `1px solid ${t.glassBorder}`,
      boxShadow: t.glassShadow,
      transition: "transform .45s cubic-bezier(.22,1,.36,1), box-shadow .45s ease, background .35s, border-color .35s",
      ...s,
    }}
    onMouseOver={() => { if (hoverLift && ref.current) {
      ref.current.style.transform = "translateY(-6px) scale(1.01)";
      ref.current.style.boxShadow = t.glassShadowHover;
      ref.current.style.background = t.glassHover;
      ref.current.style.borderColor = t.glassBorderHover;
    }}}
    onMouseOut={() => { if (hoverLift && ref.current) {
      ref.current.style.transform = "none";
      ref.current.style.boxShadow = t.glassShadow;
      ref.current.style.background = t.glass;
      ref.current.style.borderColor = t.glassBorder;
    }}}
    >{children}</div>
  );
}

/**
 * Small pill badge used for location, date, and contact chips.
 * @param {{ children: React.ReactNode, style?: React.CSSProperties }} props
 */
function Pill({ children, style: s = {} }) {
  const { t } = useTheme();
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      background: t.pillBg, color: t.textSecondary,
      padding: "6px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500,
      border: `1px solid ${t.pillBorder}`,
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      ...s,
    }}>{children}</span>
  );
}

/**
 * Full-width <section> wrapper with a centered max-width container (1080 px).
 * @param {{ id: string, children: React.ReactNode, style?: React.CSSProperties }} props
 */
function Section({ id, children, style: s = {} }) {
  return (
    <section id={id} style={{ position: "relative", zIndex: 1, padding: "88px 0", ...s }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px" }}>{children}</div>
    </section>
  );
}

/**
 * Renders the icon + h2 heading row that opens each portfolio section.
 * Wrapped in FadeIn for scroll-triggered entrance animation.
 * @param {{ icon: React.ComponentType, title: string }} props
 */
function SectionTitle({ icon: Icon, title }) {
  const { t } = useTheme();
  return (
    <FadeIn>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: t.accentSoft, backdropFilter: "blur(20px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${t.pillBorder}`,
        }}>
          <Icon size={20} color={t.accent} strokeWidth={2} />
        </div>
        <h2 style={{
          fontSize: "clamp(24px,4vw,34px)", fontWeight: 700, color: t.text,
          letterSpacing: "-0.02em",
        }}>{title}</h2>
      </div>
    </FadeIn>
  );
}
/* ═══════════════════════════════════════════════════════
   MESH BACKGROUND — liquid gradient blobs
   ═══════════════════════════════════════════════════════ */

/**
 * Fixed the full-screen decorative background layer.
 * Renders several blurred radial-gradient blobs that float behind all content.
 * Pointer-events are disabled, so it never intercepts clicks.
 */
function MeshBackground() {
  const { t } = useTheme();
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Base solid */}
      <div style={{ position: "absolute", inset: 0, background: t.bg, transition: "background .5s ease" }} />
      {/* Mesh blobs */}
      {[
        { w: 700, bg: t.meshA, top: "-15%", left: "-12%", dur: 20 },
        { w: 650, bg: t.meshB, top: "25%", right: "-15%", dur: 25 },
        { w: 550, bg: t.meshC, bottom: "5%", left: "8%", dur: 22 },
        { w: 400, bg: t.meshD, top: "55%", left: "45%", dur: 28 },
      ].map((b, i) => (
        <div key={i} style={{
          position: "absolute", width: b.w, height: b.w,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${b.bg} 0%, transparent 70%)`,
          top: b.top, left: b.left, right: b.right, bottom: b.bottom,
          animation: `liquidFloat ${b.dur}s ease-in-out infinite alternate`,
          filter: "blur(2px)",
        }} />
      ))}
    </div>
  );
}
/* ═══════════════════════════════════════════════════════
   THEME TOGGLE — pill-shaped
   ═══════════════════════════════════════════════════════ */

/**
 * Circular button that switches between dark and light mode.
 * Shows a Sun icon in dark mode and a Moon icon in light mode.
 */
function ThemeToggle() {
  const { t, mode, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label="Toggle theme" style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 40, height: 40, borderRadius: 20,
      background: t.toggleBg, border: `1px solid ${t.glassBorder}`,
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      cursor: "pointer", transition: "all .35s cubic-bezier(.22,1,.36,1)",
    }}
    onMouseOver={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.background = t.accentSoft; }}
    onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = t.toggleBg; }}
    >
      {mode === "dark" ? <Sun size={17} color="#FF9F0A" /> : <Moon size={17} color={t.accent} />}
    </button>
  );
}
/* ═══════════════════════════════════════════════════════
   NAVIGATION — frosted glass bar
   ═══════════════════════════════════════════════════════ */

/**
 * Sticky top navigation bar.
 * - Desktop: inline anchor links hidden on mobile via CSS (.nav-desktop).
 * - Mobile: the hamburger toggle reveals a dropdown menu.
 * - After 40 px of scroll the bar gains a frosted-glass backdrop.
 */
function Nav() {
  const { t } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [
    { label: "About", href: "#about" }, { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" }, { label: "Education", href: "#education" },
    { label: "Achievements", href: "#achievements" }, { label: "Contact", href: "#contact" },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      transition: "all .45s cubic-bezier(.22,1,.36,1)",
    }}>
      <div style={{
        maxWidth: 1080, margin: scrolled ? "8px auto" : "0 auto",
        padding: "0 28px",
        transition: "all .45s cubic-bezier(.22,1,.36,1)",
      }}>
        <div style={{
          background: scrolled ? t.navGlass : "transparent",
          backdropFilter: scrolled ? t.navBlur : "none",
          WebkitBackdropFilter: scrolled ? t.navBlur : "none",
          borderRadius: scrolled ? 22 : 0,
          border: scrolled ? `1px solid ${t.navBorder}` : "1px solid transparent",
          boxShadow: scrolled ? t.glassShadow : "none",
          padding: "0 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between", height: 56,
          transition: "all .45s cubic-bezier(.22,1,.36,1)",
        }}>
          <a href="#hero" style={{ textDecoration: "none" }}>
            <span style={{ fontWeight: 600, fontSize: 17, color: t.text, letterSpacing: "-0.01em" }}>Home</span>
          </a>
          <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {links.map(l => (
              <a key={l.href} href={l.href} style={{
                textDecoration: "none", color: t.textMuted, fontSize: 13, fontWeight: 500,
                padding: "6px 14px", borderRadius: 12, transition: "all .25s cubic-bezier(.22,1,.36,1)",
              }}
              onMouseOver={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.background = t.accentSoft; }}
              onMouseOut={e => { e.currentTarget.style.color = t.textMuted; e.currentTarget.style.background = "transparent"; }}
              >{l.label}</a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ThemeToggle />
            <button className="nav-toggle" onClick={() => setOpen(!open)} style={{
              display: "none", background: "none", border: "none", color: t.text, cursor: "pointer", padding: 4,
            }}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {open && (
        <div style={{
          margin: "4px 28px 0", padding: "8px 4px 12px",
          background: t.navGlass, backdropFilter: t.navBlur, WebkitBackdropFilter: t.navBlur,
          borderRadius: 18, border: `1px solid ${t.navBorder}`, boxShadow: t.glassShadow,
        }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              const target = document.querySelector(l.href);
              if (target) {
                setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
              }
            }} style={{
              display: "block", textDecoration: "none", color: t.textSecondary, fontSize: 15, fontWeight: 500,
              padding: "12px 16px", borderRadius: 12, transition: "all .2s",
            }}
            onMouseOver={e => { e.currentTarget.style.background = t.accentSoft; e.currentTarget.style.color = t.text; }}
            onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.textSecondary; }}
            >{l.label}</a>
          ))}
        </div>
      )}
    </nav>
  );
}
/* ═══════════════════════════════════════════════════════
   RESUME PAGE — full-tab PDF viewer with skeleton loading
   ═══════════════════════════════════════════════════════ */

/**
 * Full-screen resume viewer rendered with react-pdf.
 * Works on desktop and mobile — PDF pages are drawn on <canvas> via PDF.js,
 * bypassing the browser's built-in PDF plugin (absent on Android/iOS).
 *
 * Loading sequence:
 *   1. Skeleton shimmer is shown immediately.
 *   2. react-pdf Document fires onLoadSuccess → pdfLoaded = true.
 *   3. Skeleton fades out; rendered PDF pages fade in.
 *
 * Page width is measured via ResizeObserver so it fits any screen / orientation.
 *
 * @param {{ onBack: () => void }} props
 */
function ResumePage({ onBack }) {
  const { t, mode } = useTheme();
    const [numPages, setNumPages] = useState(null);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [pageWidth, setPageWidth] = useState(0);
    const containerRef = useRef(null);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

    // Measure container width so PDF pages fill it exactly
    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver(entries => {
            const width = entries[0].contentRect.width;
            setPageWidth(Math.min(width - (isMobile ? 24 : 64), 860));
        });
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, [isMobile]);

  const pdfUrl = process.env.PUBLIC_URL + "/resume.pdf";
  const shimmer = {
    background: mode === "dark"
      ? "linear-gradient(90deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.10) 40%, rgba(255,255,255,.04) 100%)"
      : "linear-gradient(90deg, rgba(0,0,0,.05) 0%, rgba(0,0,0,.12) 40%, rgba(0,0,0,.05) 100%)",
    backgroundSize: "300% 100%",
    animation: "skeletonShimmer 1.6s ease-in-out infinite",
    borderRadius: 6,
  };
  const sk = (w, h, r = 6, extra = {}) => ({
    ...shimmer, width: w, height: h, borderRadius: r, flexShrink: 0, ...extra,
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: t.bg,
      display: "flex", flexDirection: "column",
        fontFamily: "-apple-system, BlinkMacSystemFont, ‘SF Pro Text’, ‘Inter’, sans-serif",
    }}>
      {/* ── Compact responsive top bar ── */}
      <div style={{
        display: "flex", alignItems: "center",
        padding: isMobile ? "8px 12px" : "10px 20px",
        gap: isMobile ? 8 : 12,
        background: t.navGlass,
        backdropFilter: t.navBlur, WebkitBackdropFilter: t.navBlur,
        borderBottom: `1px solid ${t.divider}`,
        flexShrink: 0, minHeight: isMobile ? 50 : 56,
      }}>
        {/* Back button */}
        <button
          id="resume-back-btn"
          onClick={onBack}
          style={{
            display: "flex", alignItems: "center", gap: isMobile ? 4 : 7,
            padding: isMobile ? "6px 10px" : "7px 14px",
            borderRadius: 10, fontSize: isMobile ? 12 : 13, fontWeight: 600,
            background: t.toggleBg, color: t.textSecondary,
            border: `1px solid ${t.glassBorder}`,
            cursor: "pointer", transition: "all .25s", flexShrink: 0,
          }}
          onMouseOver={e => { e.currentTarget.style.background = t.accentSoft; e.currentTarget.style.color = t.accent; }}
          onMouseOut={e => { e.currentTarget.style.background = t.toggleBg; e.currentTarget.style.color = t.textSecondary; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {isMobile ? "Back" : "Back to Portfolio"}
        </button>

          {/* Title — centred */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, overflow: "hidden" }}>
          {!isMobile && (
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center",
              border: `1px solid ${t.pillBorder}`,
            }}>
              <FileText size={13} color={t.accent} />
            </div>
          )}
          <span style={{
            fontWeight: 600, fontSize: isMobile ? 13 : 14,
            color: t.text, letterSpacing: "-0.01em",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {isMobile ? "Resume" : "Resume — Mahaveersinh Gohil"}
          </span>
        </div>

        {/* Download button */}
        <a
          href={pdfUrl}
          download="Mahaveersinh_Gohil_Resume.pdf"
          id="resume-download-btn"
          style={{
            display: "flex", alignItems: "center", gap: isMobile ? 4 : 6,
            padding: isMobile ? "6px 10px" : "7px 14px",
            borderRadius: 10, fontSize: isMobile ? 12 : 13, fontWeight: 600,
            background: t.gradient, color: "#fff",
            border: "none", textDecoration: "none",
            boxShadow: `0 2px 12px ${t.accentGlow}`,
            transition: "all .25s", flexShrink: 0,
          }}
          onMouseOver={e => { e.currentTarget.style.opacity = "0.85"; }}
          onMouseOut={e => { e.currentTarget.style.opacity = "1"; }}
        >
          <Download size={isMobile ? 12 : 13} />
          {isMobile ? "Save" : "Download PDF"}
        </a>
      </div>

      {/* ── Content area ── */}
        <div ref={containerRef} style={{flex: 1, position: "relative", overflowY: "auto", overflowX: "hidden"}}>

            {/* Skeleton overlay — fades away after PDF loads */}
            <div style={{
                position: "absolute", inset: 0,
                background: t.bg,
                padding: isMobile ? "20px 12px" : "32px",
                display: "flex", flexDirection: "column", alignItems: "center",
                opacity: pdfLoaded ? 0 : 1,
                transition: "opacity .7s ease",
                pointerEvents: pdfLoaded ? "none" : "auto",
                overflow: "hidden",
                zIndex: 2,
            }}>
                <div style={{
                    width: "100%",
                    maxWidth: 720,
                    display: "flex",
                    flexDirection: "column",
                    gap: isMobile ? 14 : 20
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4
                    }}>
                        <div style={sk(isMobile ? "70%" : "55%", isMobile ? 20 : 28, 6)}/>
                        <div style={sk(isMobile ? "50%" : "38%", isMobile ? 12 : 14, 4)}/>
                        <div style={{display: "flex", gap: 10, marginTop: 4}}>
                            <div style={sk(isMobile ? 70 : 90, 9, 4)}/>
                            <div style={sk(isMobile ? 95 : 120, 9, 4)}/>
                            <div style={sk(isMobile ? 80 : 100, 9, 4)}/>
                        </div>
                    </div>
                    <div style={{...shimmer, height: 2, width: "100%", borderRadius: 99}}/>
                    {[
                        {title: isMobile ? 44 : 52, lines: ["90%", "85%", "92%"]},
                        {title: isMobile ? 56 : 68, lines: ["88%", "75%", "80%", "70%"]},
                        {title: isMobile ? 48 : 58, lines: ["82%", "60%"]},
                        {title: isMobile ? 60 : 72, lines: ["95%", "78%", "88%", "65%", "72%"]},
                    ].map((sec, si) => (
                        <div key={si} style={{display: "flex", flexDirection: "column", gap: isMobile ? 7 : 10}}>
                            <div style={sk(sec.title, isMobile ? 10 : 13, 4)}/>
                            {sec.lines.map((w, li) => (
                                <div key={li} style={{
                                    ...shimmer, width: w, height: isMobile ? 8 : 10, borderRadius: 4,
                                    animationDelay: `${(si * 0.08 + li * 0.05).toFixed(2)}s`,
                                }}/>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* react-pdf renderer — works on desktop AND mobile */}
            {pageWidth > 0 && (
                <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    padding: isMobile ? "16px 0 32px" : "32px 0 48px",
                    gap: isMobile ? 12 : 20,
                    opacity: pdfLoaded ? 1 : 0,
                    transition: "opacity .8s ease",
                    zIndex: 1, position: "relative",
                }}>
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={({numPages}) => {
                            setNumPages(numPages);
                            setPdfLoaded(true);
                        }}
                        loading={null}
                        error={null}
                    >
                        <>
                            {Array.from({length: numPages || 0}, (_, i) => (
                                <div key={i} style={{
                                    boxShadow: mode === "dark"
                                        ? "0 4px 32px rgba(0,0,0,.5)"
                                        : "0 4px 32px rgba(0,0,0,.15)",
                                    borderRadius: isMobile ? 8 : 12,
                                    overflow: "hidden",
                                    marginBottom: isMobile ? 12 : 20,
                                }}>
                                    <Page
                                        pageNumber={i + 1}
                                        width={pageWidth}
                                        renderTextLayer={!isMobile}
                                        renderAnnotationLayer={false}
                                    />
                                </div>
                            ))}
                        </>
                    </Document>
                </div>
        )}
      </div>
    </div>
  );
}
/* ═══════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════ */

/**
 * Full-viewport hero section shown at the top of the portfolio.
 * Staggered entrance animations play on the mount via a delayed `loaded` flag.
 * Contains the avatar, name, job title, contact pills, and the Resume CTA button.
 * @param {{ onViewResume: () => void }} props
 */
function Hero({ onViewResume }) {
  const { t } = useTheme();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 120); }, []);
  const a = (d) => ({
    opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(24px)",
    transition: `all .9s cubic-bezier(.22,1,.36,1) ${d}s`,
  });
  return (
    <section id="hero" style={{
      position: "relative", zIndex: 1, minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "120px 28px 80px",
    }}>
      <div style={{ textAlign: "center", maxWidth: 720 }}>
        {/* Avatar */}
        <div style={a(0.1)}>
          <div style={{
            width: 96, height: 96, borderRadius: "50%", margin: "0 auto 28px",
            background: t.gradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 34, fontWeight: 700, color: "#fff", letterSpacing: 1,
            boxShadow: `0 8px 40px ${t.accentGlow}, 0 0 0 4px ${t.glass}`,
          }}>MG</div>
        </div>
        <h1 key={t.mode + "-name"} style={{
          ...a(0.25), fontSize: "clamp(36px,7vw,68px)", fontWeight: 700,
          lineHeight: 1.06, marginBottom: 16, letterSpacing: "-0.03em",
          background: t.gradientText,
          backgroundClip: "text", WebkitBackgroundClip: "text",
          color: "transparent", WebkitTextFillColor: "transparent",
        }}>
          Mahaveersinh Gohil
        </h1>
        <p style={{
          ...a(0.38), fontSize: "clamp(17px,2.5vw,21px)", fontWeight: 600,
          color: t.accent, marginBottom: 16, letterSpacing: "-0.01em",
        }}>
          Java Backend Engineer
        </p>
        <p style={{
          ...a(0.48), fontSize: "clamp(14px,1.8vw,16px)",
          color: t.textMuted, maxWidth: 520, margin: "0 auto 36px",
          lineHeight: 1.75, letterSpacing: "-0.01em",
        }}>
          3+ years crafting scalable microservices and cloud-native solutions.
          Passionate about clean architecture, performance, and reliability.
        </p>
        <div style={{ ...a(0.56), display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 32 }}>
          {[
            { icon: MapPin, text: "Rajkot, Gujarat" },
            { icon: Phone, text: "+91-8000545662" },
            { icon: Mail, text: "gohilmahaveer@gmail.com" },
          ].map((c, i) => {
              const Icon = c.icon;
              return <Pill key={i}><Icon size={13} color={t.accent}/>{c.text}</Pill>;
          })}
        </div>
        {/* ── Resume Button ── */}
        <div style={{ ...a(0.62), display: "flex", justifyContent: "center", marginBottom: 40 }}>
          <button
            id="open-resume-btn"
            onClick={onViewResume}
            style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              padding: "13px 28px", borderRadius: 16, fontSize: 15, fontWeight: 600,
              background: t.gradient,
              color: "#fff",
              border: "none",
              boxShadow: `0 4px 24px ${t.accentGlow}`,
              cursor: "pointer",
              letterSpacing: "-0.01em",
              transition: "transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease",
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.03)";
              e.currentTarget.style.boxShadow = `0 8px 36px ${t.accentGlow}`;
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = `0 4px 24px ${t.accentGlow}`;
            }}
          >
            <FileText size={17} />
              Resume
          </button>
        </div>
        <div style={{ ...a(0.72), marginTop: 0 }}>
          <a href="#about" style={{ color: t.textMuted, animation: "bounce 2.2s ease-in-out infinite", display: "inline-block" }}>
            <ChevronDown size={24} />
          </a>
        </div>
      </div>
    </section>
  );
}
/* ═══════════════════════════════════════════════════════
   ABOUT
   ═══════════════════════════════════════════════════════ */

/**
 * "About Me" section with a bio paragraph and a 2×2 stats grid
 * (years of experience, microservices count, uptime, code reviews).
 */
function About() {
  const { t } = useTheme();
  const stats = [
    { icon: Clock, value: "3+", label: "Years" },
    { icon: Server, value: "8+", label: "Services" },
    { icon: TrendingUp, value: "99.9%", label: "Uptime" },
    { icon: Users, value: "100+", label: "Reviews" },
  ];
  return (
    <Section id="about">
      <SectionTitle icon={Zap} title="About Me" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        <FadeIn delay={0.1}>
          <GlassCard style={{ padding: 32, height: "100%", display: "flex", alignItems: "center" }}>
            <p style={{ color: t.textSecondary, lineHeight: 1.85, fontSize: 15, letterSpacing: "-0.01em" }}>
              Results-driven <strong style={{ color: t.accent }}>Java Backend Engineer</strong> with expertise in
              architecting scalable <strong style={{ color: t.accent }}>microservices-based enterprise applications</strong>.
              Proven track record of building high-performance REST APIs, implementing cloud-native solutions,
              and optimizing system reliability with end-to-end project ownership.
            </p>
          </GlassCard>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {stats.map((st, i) => {
                const Icon = st.icon;
                return (
            <FadeIn key={i} delay={0.12 + i * 0.07}>
              <GlassCard style={{ padding: "22px 16px", textAlign: "center", height: "100%" }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12, margin: "0 auto 10px",
                  background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <Icon size={18} color={t.accent} strokeWidth={1.8}/>
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: t.text, letterSpacing: "-0.02em" }}>{st.value}</div>
                <div style={{ color: t.textMuted, fontSize: 12, fontWeight: 500, marginTop: 3 }}>{st.label}</div>
              </GlassCard>
            </FadeIn>
                );
            })}
        </div>
      </div>
    </Section>
  );
}
/* ═══════════════════════════════════════════════════════
   EXPERIENCE
   ═══════════════════════════════════════════════════════ */

/**
 * Work history section. Renders each job as a GlassCard with a gradient
 * accent line at the top, company/period pills, and a bullet-icon highlights list.
 */
function Experience() {
  const { t } = useTheme();
  const jobs = [
    {
      title: "Java Backend Engineer",
      company: "Alticon Technologies Pvt Ltd",
      location: "Ahmedabad, Gujarat",
      period: "Sep 2022 – Present",
      current: true,
      highlights: [
        { icon: Rocket, text: "Architected microservices B2B eCommerce platform — reduced order processing time by 40% with Redis caching" },
        { icon: Shield, text: "Led payment gateway & ERP integrations — 99.9% uptime with circuit breaker patterns" },
        { icon: Zap, text: "Engineered scalable search with Lucene for E-Catalog platform" },
        { icon: Shield, text: "Implemented OAuth 2.0 / JWT security with Keycloak & Spring Security" },
        { icon: Layers, text: "Optimized Kafka event-driven architecture — zero message loss across microservices" },
        { icon: Cloud, text: "Deployed containers via Docker + Kubernetes + NGINX — 99.9% availability" },
        { icon: Users, text: "Mentored juniors, 100+ code reviews — velocity ↑35%, bugs ↓50%" },
      ],
    },
    {
      title: "Trainee Software Developer",
      company: "Knovos",
      location: "Gandhinagar, Gujarat",
      period: "Jan 2022 – Jun 2022",
      current: false,
      highlights: [
        { icon: Code2, text: "Developed RESTful web services with Spring Boot + MySQL integration" },
        { icon: GitBranch, text: "Collaborated in Agile cross-functional teams following best practices" },
      ],
    },
  ];
  return (
    <Section id="experience">
      <SectionTitle icon={Briefcase} title="Experience" />
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {jobs.map((job, ji) => (
          <FadeIn key={ji} delay={ji * 0.1}>
            <GlassCard style={{ padding: "clamp(24px,4vw,36px)", overflow: "hidden", position: "relative" }}>
              {/* accent top line */}
              <div style={{ position: "absolute", top: 0, left: 24, right: 24, height: 2, borderRadius: 2, background: t.gradient, opacity: 0.6 }} />
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: "clamp(17px,2.8vw,20px)", fontWeight: 700, color: t.text, letterSpacing: "-0.02em" }}>{job.title}</h3>
                    {job.current && (
                      <span style={{
                        fontSize: 11, fontWeight: 600, color: t.accent2,
                        background: `${t.accent2}16`, padding: "3px 10px", borderRadius: 99,
                      }}>CURRENT</span>
                    )}
                  </div>
                  <p style={{ color: t.accent, fontWeight: 600, fontSize: 14, marginTop: 4 }}>{job.company}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <Pill><MapPin size={11} />{job.location}</Pill>
                  <Pill><Clock size={11} />{job.period}</Pill>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {job.highlights.map((h, hi) => {
                      const Icon = h.icon;
                      return (
                  <div key={hi} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginTop: 1,
                      background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <Icon size={13} color={t.accent} strokeWidth={2}/>
                    </div>
                    <p style={{ color: t.textSecondary, fontSize: 14, lineHeight: 1.65, letterSpacing: "-0.01em" }}>{h.text}</p>
                  </div>
                      );
                  })}
              </div>
            </GlassCard>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
/* ═══════════════════════════════════════════════════════
   SKILLS
   ═══════════════════════════════════════════════════════ */

/**
 * Animated progress bar for a single skill.
 * The fill animates from 0 → skill.level% once the bar scrolls into view
 * (driven by useInView). The delay prop staggers bars within a category.
 * @param {{ skill: { name: string, level: number, emoji: string }, delay: number }} props
 */
function SkillBar({ skill, delay }) {
  const { t } = useTheme();
  const [ref, vis] = useInView();
  return (
    <div ref={ref}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: t.textSecondary, letterSpacing: "-0.01em" }}>
          <span style={{ marginRight: 5 }}>{skill.emoji}</span>{skill.name}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color: t.accent }}>{skill.level}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 99, background: t.barBg, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99, background: t.barFill,
          width: vis ? `${skill.level}%` : "0%",
          transition: `width 1.1s cubic-bezier(.22,1,.36,1) ${delay}s`,
        }} />
      </div>
    </div>
  );
}

/**
 * Technical skills section. Groups skills into six categories
 * (Languages, Frameworks, Databases, Cloud/DevOps, Security, Architecture)
 * and renders each as a GlassCard containing SkillBar rows.
 */
function Skills() {
  const { t } = useTheme();
  const categories = [
    { title: "Languages & Core", icon: Code2, skills: [
      { name: "Java", level: 95, emoji: "☕" }, { name: "SQL", level: 85, emoji: "🗃️" },
    ]},
    { title: "Frameworks", icon: Layers, skills: [
      { name: "Spring Boot", level: 92, emoji: "🍃" }, { name: "Spring Data JPA", level: 88, emoji: "📦" },
      { name: "Spring Security", level: 85, emoji: "🔐" }, { name: "Hibernate", level: 88, emoji: "🐻‍❄️" },
      { name: "Kafka", level: 80, emoji: "📨" }, { name: "REST APIs", level: 93, emoji: "🌐" },
    ]},
    { title: "Databases", icon: Database, skills: [
      { name: "MySQL", level: 90, emoji: "🐬" }, { name: "Redis", level: 82, emoji: "⚡" },
      { name: "MongoDB", level: 78, emoji: "🍃" }, { name: "Oracle", level: 75, emoji: "🏛️" },
    ]},
    { title: "Cloud & DevOps", icon: Cloud, skills: [
      { name: "Docker", level: 85, emoji: "🐳" }, { name: "Kubernetes", level: 78, emoji: "☸️" },
      { name: "AWS", level: 75, emoji: "☁️" }, { name: "Jenkins", level: 78, emoji: "🔧" },
      { name: "Nginx", level: 80, emoji: "🌀" }, { name: "Git", level: 90, emoji: "🔀" },
    ]},
    { title: "Security", icon: Shield, skills: [
      { name: "Keycloak", level: 82, emoji: "🔑" }, { name: "OAuth 2.0", level: 85, emoji: "🛡️" },
      { name: "JWT", level: 88, emoji: "🎫" },
    ]},
    { title: "Architecture", icon: Box, skills: [
      { name: "Microservices", level: 90, emoji: "🧩" }, { name: "Event-Driven", level: 85, emoji: "⚡" },
      { name: "Lucene Search", level: 78, emoji: "🔍" }, { name: "Agile / Scrum", level: 85, emoji: "🔄" },
    ]},
  ];
  return (
    <Section id="skills">
      <SectionTitle icon={Cpu} title="Technical Skills" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 18 }}>
          {categories.map((cat, ci) => {
              const Icon = cat.icon;
              return (
          <FadeIn key={ci} delay={ci * 0.06}>
            <GlassCard style={{ padding: 26, height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <Icon size={16} color={t.accent} strokeWidth={2}/>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: t.text, letterSpacing: "-0.01em" }}>{cat.title}</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {cat.skills.map((sk, si) => (
                  <SkillBar key={si} skill={sk} delay={ci * 0.06 + si * 0.04} />
                ))}
              </div>
            </GlassCard>
          </FadeIn>
              );
          })}
      </div>
    </Section>
  );
}
/* ═══════════════════════════════════════════════════════
   EDUCATION
   ═══════════════════════════════════════════════════════ */

/**
 * Education section displaying MCA and BCA degrees as GlassCards
 * with degree name, institution, period pill, and field of study.
 */
function Education() {
  const { t } = useTheme();
  const edu = [
    { degree: "Master of Computer Applications (MCA)", school: "Marwadi University", period: "Dec 2020 – May 2022", field: "Computer Software Engineering", emoji: "🎓" },
    { degree: "Bachelor of Computer Applications (BCA)", school: "Atmiya Institute of Technology & Science", period: "Jun 2015 – Mar 2018", field: "Computer Software Engineering", emoji: "📚" },
  ];
  return (
    <Section id="education">
      <SectionTitle icon={GraduationCap} title="Education" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
        {edu.map((e, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <GlassCard style={{ padding: 30, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 24, right: 24, height: 2, borderRadius: 2, background: t.gradient, opacity: 0.5 }} />
              <div style={{ fontSize: 36, marginBottom: 14 }}>{e.emoji}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: t.text, marginBottom: 6, letterSpacing: "-0.02em" }}>{e.degree}</h3>
              <p style={{ color: t.accent, fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{e.school}</p>
              <Pill><Clock size={11} />{e.period}</Pill>
              <p style={{ color: t.textMuted, fontSize: 13, marginTop: 10 }}>{e.field}</p>
            </GlassCard>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
/* ═══════════════════════════════════════════════════════
   ACHIEVEMENTS
   ═══════════════════════════════════════════════════════ */

/**
 * Key Achievements section rendered as a 4-card grid.
 * Each card has a centred icon, a bold metric title, and a short description.
 */
function Achievements() {
  const { t } = useTheme();
  const items = [
    { icon: BarChart3, title: "40% Faster APIs", desc: "800ms → 280ms via DB optimization & Redis caching" },
    { icon: CheckCircle2, title: "80% First-Time Fix", desc: "Critical production issues resolved promptly" },
    { icon: TrendingUp, title: "99.9% Uptime", desc: "Circuit breakers & retries across 8 microservices" },
    { icon: Star, title: "Production-Ready", desc: "End-to-end B2B eCommerce features at scale" },
  ];
  return (
    <Section id="achievements">
      <SectionTitle icon={Award} title="Key Achievements" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 18 }}>
          {items.map((item, i) => {
              const Icon = item.icon;
              return (
          <FadeIn key={i} delay={i * 0.08}>
            <GlassCard style={{ padding: 28, textAlign: "center" }}>
              <div style={{
                width: 50, height: 50, borderRadius: 16, margin: "0 auto 14px",
                background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${t.pillBorder}`,
              }}>
                  <Icon size={22} color={t.accent} strokeWidth={1.8}/>
              </div>
                <h3 style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: t.text,
                    marginBottom: 8,
                    letterSpacing: "-0.02em"
                }}>{item.title}</h3>
                <p style={{color: t.textMuted, fontSize: 13, lineHeight: 1.6}}>{item.desc}</p>
            </GlassCard>
          </FadeIn>
              );
          })}
      </div>
    </Section>
  );
}
/* ═══════════════════════════════════════════════════════
   CONTACT
   ═══════════════════════════════════════════════════════ */

/**
 * "Get In Touch" section with clickable contact cards (email, phone, LinkedIn, location).
 * External links open in a new tab; the location card scrolls nowhere (href= "#").
 */
function Contact() {
  const { t } = useTheme();
  const items = [
    { icon: Mail, label: "Email", value: "gohilmahaveer@gmail.com", href: "mailto:gohilmahaveer@gmail.com" },
    { icon: Phone, label: "Phone", value: "+91-8000545662", href: "tel:+918000545662" },
    { icon: Globe, label: "LinkedIn", value: "mahaveersinh-gohil", href: "https://linkedin.com/in/mahaveersinh-gohil" },
    { icon: MapPin, label: "Location", value: "Rajkot, Gujarat, India", href: "#" },
  ];
  return (
    <Section id="contact" style={{ paddingBottom: 48 }}>
      <SectionTitle icon={Globe} title="Get In Touch" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {items.map((l, i) => {
              const Icon = l.icon;
              return (
          <FadeIn key={i} delay={i * 0.08}>
            <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <GlassCard style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} radius={18}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <Icon size={18} color={t.accent} strokeWidth={1.8}/>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{l.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.value}</div>
                </div>
                {l.href.startsWith("http") && <ExternalLink size={14} color={t.textMuted} style={{ marginLeft: "auto", flexShrink: 0 }} />}
              </GlassCard>
            </a>
          </FadeIn>
              );
          })}
      </div>
    </Section>
  );
}
/* ═══════════════════════════════════════════════════════
   FOOTER + BACK TO TOP
   ═══════════════════════════════════════════════════════ */

/** Minimal footer showing the copyright year, auto-updated via Date. */
function Footer() {
  const { t } = useTheme();
  return (
    <footer style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "28px 28px", borderTop: `1px solid ${t.divider}` }}>
      <p style={{ color: t.textMuted, fontSize: 12, fontWeight: 500 }}>© {new Date().getFullYear()} Mahaveersinh Gohil</p>
    </footer>
  );
}

/**
 * Fixed the "back to top" anchor button that fades in after 500 px of scroll.
 * Scales to 0.6 and hides via pointer-events:none when not visible.
 */
function BackToTop() {
  const { t } = useTheme();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <a href="#hero" style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 90,
      width: 44, height: 44, borderRadius: 22,
      background: t.glass, backdropFilter: t.glassBlur, WebkitBackdropFilter: t.glassBlur,
      border: `1px solid ${t.glassBorder}`, boxShadow: t.glassShadow,
      display: "flex", alignItems: "center", justifyContent: "center",
      opacity: show ? 1 : 0, transform: show ? "scale(1)" : "scale(0.6)",
      transition: "all .4s cubic-bezier(.22,1,.36,1)", pointerEvents: show ? "auto" : "none",
      textDecoration: "none",
    }}
    onMouseOver={e => { if (show) { e.currentTarget.style.transform = "scale(1.12)"; e.currentTarget.style.background = t.accentSoft; } }}
    onMouseOut={e => { if (show) { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = t.glass; } }}
    ><ArrowUp size={18} color={t.accent} /></a>
  );
}
/* ═══════════════════════════════════════════════════════
   GLOBAL STYLES
   ═══════════════════════════════════════════════════════ */

/**
 * Injects a <style> tag with reset rules, keyframe animations (bounce, skeletonShimmer),
 * scrollbar styling, and responsive CSS classes (nav-desktop / nav-toggle breakpoints).
 * Must be rendered inside ThemeProvider so it can read theme tokens for scrollbar colors.
 */
function GlobalStyles() {
  const { t } = useTheme();
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; scroll-padding-top: 80px; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Helvetica Neue', sans-serif;
        background: ${t.bg};
        color: ${t.text};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
        transition: background .5s ease, color .4s ease;
      }
      ::selection { background: ${t.accentGlow}; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: ${t.scrollThumb}; border-radius: 99px; }
      ::-webkit-scrollbar-thumb:hover { background: ${t.textMuted}; }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(8px); }
      }
      @keyframes liquidFloat {
        0%   { transform: translate(0, 0) scale(1); }
        25%  { transform: translate(30px, -20px) scale(1.06); }
        50%  { transform: translate(-15px, 25px) scale(0.96); }
        75%  { transform: translate(20px, 10px) scale(1.03); }
        100% { transform: translate(-10px, -15px) scale(1.01); }
      }
      @keyframes skeletonShimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      @media (max-width: 768px) {
        .nav-desktop { display: none !important; }
        .nav-toggle { display: block !important; }
      }
    `}</style>
  );
}
/* ═══════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════ */

/**
 * Root component. Wraps the app in ThemeProvider so every child
 * can access theme tokens and the toggle function via useTheme().
 */
export default function App() {
  return (
    <ThemeProvider>
      <Inner />
    </ThemeProvider>
  );
}

/**
 * Inner router — switches between the portfolio page and the full-screen resume viewer.
 * Kept separate from App so ThemeProvider is already mounted when Inner first renders.
 */
function Inner() {
  const [page, setPage] = useState("portfolio");
  if (page === "resume") {
    return (
      <>
        <GlobalStyles />
        <ResumePage onBack={() => setPage("portfolio")} />
      </>
    );
  }
  return (
    <>
      <GlobalStyles />
      <MeshBackground />
      <Nav />
      <Hero onViewResume={() => setPage("resume")} />
      <About />
      <Experience />
      <Skills />
      <Education />
      <Achievements />
      <Contact />
      <Footer />
      <BackToTop />
    </>
  );
}
