import {createContext, useContext, useEffect, useRef, useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
    ArrowRight,
    ArrowUp,
    Award,
    BarChart3,
    Box,
    Boxes,
    Briefcase,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
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
    Leaf,
    Mail,
    Monitor,
    MapPin,
    Menu,
    Moon,
    Phone,
    RefreshCw,
    Rocket,
    Server,
    Shield,
    ShieldCheck,
    Sparkles,
    Star,
    Sun,
    TrendingUp,
    Users,
    X,
    Zap,
} from "lucide-react";
import {
    SiApachekafka,
    SiApachelucene,
    SiDocker,
    SiGit,
    SiHibernate,
    SiJenkins,
    SiJsonwebtokens,
    SiKeycloak,
    SiKubernetes,
    SiMongodb,
    SiMysql,
    SiNginx,
    SiRedis,
    SiSpring,
    SiSpringboot,
    SiSpringsecurity,
} from "react-icons/si";
import {FaAws, FaJava} from "react-icons/fa";
import {GrOracle} from "react-icons/gr";

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
    toggleBg: "rgba(60,60,67,.12)",
    toggleBorder: "rgba(60,60,67,.22)",
    pillBg: "rgba(0,122,255,.07)",
    pillBorder: "rgba(0,122,255,.12)",
    divider: "rgba(0,0,0,.06)",
    tagBg: "rgba(0,0,0,.03)",
  },
  dark: {
    bg: "#010409",
    meshA: "rgba(10, 80, 255, .12)",
    meshB: "rgba(110, 40, 220, .09)",
    meshC: "rgba(0, 160, 140, .07)",
    meshD: "rgba(240, 110, 50, .05)",
    glass: "rgba(22, 27, 34, .65)",
    glassHover: "rgba(30, 35, 45, .75)",
    glassBorder: "rgba(255,255,255,.1)",
    glassBorderHover: "rgba(255,255,255,.18)",
    glassShadow: "0 2px 20px rgba(0,0,0,.3), 0 8px 40px rgba(0,0,0,.4)",
    glassShadowHover: "0 4px 24px rgba(0,0,0,.4), 0 16px 56px rgba(0,0,0,.6)",
    glassBlur: "blur(40px) saturate(1.8)",
    navGlass: "rgba(13, 17, 23, .72)",
    navBorder: "rgba(255,255,255,.08)",
    navBlur: "blur(40px) saturate(2)",
    text: "#F0F6FC",
    textSecondary: "#C9D1D9",
    textMuted: "#8B949E",
    accent: "#58A6FF",
    accentSoft: "rgba(88, 166, 255, .15)",
    accentGlow: "rgba(88, 166, 255, .25)",
    accent2: "#39D353",
    accent3: "#FF9F0A",
    accent4: "#BF5AF2",
    accent5: "#FF453A",
    gradient: "linear-gradient(135deg, #1D4ED8 0%, #58A6FF 100%)",
    gradientText: "linear-gradient(135deg, #58A6FF 0%, #A371F7 100%)",
    barBg: "rgba(88, 166, 255, .12)",
    barFill: "linear-gradient(90deg, #1D4ED8 0%, #58A6FF 100%)",
    scrollThumb: "rgba(255,255,255,.15)",
    toggleBg: "rgba(255,255,255,.08)",
    pillBg: "rgba(88,166,255,.10)",
    pillBorder: "rgba(88,166,255,.18)",
    divider: "rgba(255,255,255,.06)",
    tagBg: "rgba(255,255,255,.04)",
  },
  forest: {
    bg: "#051605",
    meshA: "rgba(34, 139, 34, .12)",
    meshB: "rgba(0, 100, 0, .08)",
    meshC: "rgba(144, 238, 144, .06)",
    meshD: "rgba(107, 142, 35, .05)",
    glass: "rgba(20, 40, 20, .55)",
    glassHover: "rgba(30, 60, 30, .72)",
    glassBorder: "rgba(255,255,255,.08)",
    glassBorderHover: "rgba(255,255,255,.14)",
    glassShadow: "0 2px 20px rgba(0,0,0,.2), 0 8px 40px rgba(0,0,0,.3)",
    glassShadowHover: "0 4px 24px rgba(0,0,0,.3), 0 16px 56px rgba(0,0,0,.45)",
    glassBlur: "blur(40px) saturate(1.4)",
    navGlass: "rgba(15, 30, 15, .65)",
    navBorder: "rgba(255,255,255,.06)",
    navBlur: "blur(40px) saturate(1.6)",
    text: "#E8F5E9",
    textSecondary: "#A5D6A7",
    textMuted: "#66BB6A",
    accent: "#4CAF50",
    accentSoft: "rgba(76, 175, 80, .15)",
    accentGlow: "rgba(76, 175, 80, .25)",
    accent2: "#8BC34A",
    accent3: "#CDDC39",
    accent4: "#009688",
    accent5: "#F44336",
    gradient: "linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)",
    gradientText: "linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%)",
    barBg: "rgba(76, 175, 80, .12)",
    barFill: "linear-gradient(90deg, #2E7D32 0%, #4CAF50 100%)",
    scrollThumb: "rgba(255,255,255,.12)",
    toggleBg: "rgba(255,255,255,.06)",
    pillBg: "rgba(76,175,80,.10)",
    pillBorder: "rgba(76,175,80,.18)",
    divider: "rgba(255,255,255,.05)",
    tagBg: "rgba(255,255,255,.03)",
  },
  purple: {
    bg: "#0F051D",
    meshA: "rgba(147, 51, 234, .18)",
    meshB: "rgba(79, 70, 229, .12)",
    meshC: "rgba(192, 38, 211, .10)",
    meshD: "rgba(124, 58, 237, .06)",
    glass: "rgba(30, 10, 50, .65)",
    glassHover: "rgba(45, 15, 75, .8)",
    glassBorder: "rgba(255,255,255,.1)",
    glassBorderHover: "rgba(255,255,255,.2)",
    glassShadow: "0 2px 20px rgba(0,0,0,.4), 0 8px 40px rgba(147, 51, 234, .15)",
    glassShadowHover: "0 4px 24px rgba(0,0,0,.5), 0 16px 56px rgba(147, 51, 234, .25)",
    glassBlur: "blur(40px) saturate(1.8)",
    navGlass: "rgba(20, 5, 40, .75)",
    navBorder: "rgba(255,255,255,.08)",
    navBlur: "blur(40px) saturate(2)",
    text: "#F5F3FF",
    textSecondary: "#DDD6FE",
    textMuted: "#A78BFA",
    accent: "#C084FC",
    accentSoft: "rgba(192, 132, 252, .15)",
    accentGlow: "rgba(192, 132, 252, .3)",
    accent2: "#818CF8",
    accent3: "#F472B6",
    accent4: "#FB7185",
    accent5: "#F87171",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #C084FC 100%)",
    gradientText: "linear-gradient(135deg, #A78BFA 0%, #F472B6 100%)",
    barBg: "rgba(192, 132, 252, .12)",
    barFill: "linear-gradient(90deg, #7C3AED 0%, #C084FC 100%)",
    scrollThumb: "rgba(255,255,255,.15)",
    toggleBg: "rgba(255,255,255,.08)",
    pillBg: "rgba(192,132,252,.10)",
    pillBorder: "rgba(192,132,252,.20)",
    divider: "rgba(255,255,255,.06)",
    tagBg: "rgba(255,255,255,.04)",
  },
  steel: {
    bg: "#1A1B1E",
    meshA: "rgba(112, 128, 144, .15)",
    meshB: "rgba(47, 79, 79, .10)",
    meshC: "rgba(119, 136, 153, .08)",
    meshD: "rgba(105, 105, 105, .05)",
    glass: "rgba(37, 38, 43, .7)",
    glassHover: "rgba(44, 46, 51, .85)",
    glassBorder: "rgba(255,255,255,.08)",
    glassBorderHover: "rgba(255,255,255,.15)",
    glassShadow: "0 2px 20px rgba(0,0,0,.35), 0 8px 40px rgba(0,0,0,.45)",
    glassShadowHover: "0 4px 24px rgba(0,0,0,.45), 0 16px 56px rgba(0,0,0,.65)",
    glassBlur: "blur(40px) saturate(1.2)",
    navGlass: "rgba(26, 27, 30, .75)",
    navBorder: "rgba(255,255,255,.06)",
    navBlur: "blur(40px) saturate(1.4)",
    text: "#C1C2C5",
    textSecondary: "#A6A7AB",
    textMuted: "#909296",
    accent: "#74C0FC",
    accentSoft: "rgba(116, 192, 252, .12)",
    accentGlow: "rgba(116, 192, 252, .22)",
    accent2: "#63E6BE",
    accent3: "#FFD43B",
    accent4: "#B197FC",
    accent5: "#FF8787",
    gradient: "linear-gradient(135deg, #495057 0%, #ADB5BD 100%)",
    gradientText: "linear-gradient(135deg, #CED4DA 0%, #74C0FC 100%)",
    barBg: "rgba(116, 192, 252, .1)",
    barFill: "linear-gradient(90deg, #495057 0%, #74C0FC 100%)",
    scrollThumb: "rgba(255,255,255,.12)",
    toggleBg: "rgba(255,255,255,.07)",
    pillBg: "rgba(116,192,252,.10)",
    pillBorder: "rgba(116,192,252,.18)",
    divider: "rgba(255,255,255,.05)",
    tagBg: "rgba(255,255,255,.03)",
  },
};
const ThemeCtx = createContext(null);

/** Consume the current theme tokens and mode from ThemeCtx. */
const useTheme = () => useContext(ThemeCtx);

// Text-size levels applied via CSS `zoom` on the portfolio content wrapper
// (not <body>, so the fixed nav keeps its normal size). `zoom` scales fixed-px
// type too, which rem-based tricks wouldn't since this site sets sizes in px.
const FONT_SCALE_ZOOM = [1, 1.15, 1.3];
const FONT_SCALE_MAX = FONT_SCALE_ZOOM.length - 1;

// Selectable content fonts (mobile hamburger menu). Applied to the content
// wrapper only — nav and page chrome keep the default body font.
const FONT_FAMILIES = {
  plex:     { label: "IBM Plex", stack: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" },
  grotesk:  { label: "Space Grotesk", stack: "'Space Grotesk', 'IBM Plex Sans', sans-serif" },
};

/**
 * Wraps the app with a theme context.
 * Persists the selected mode (any key of `themes`) and the text-size level
 * (0..FONT_SCALE_MAX) to localStorage.
 * @param {{ children: React.ReactNode }} props
 */
function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem("theme") || "dark"; } catch { return "dark"; }
  });
  const [fontScale, setFontScaleState] = useState(() => {
    try { return Math.min(FONT_SCALE_MAX, Math.max(0, parseInt(localStorage.getItem("fontScale"), 10) || 0)); }
    catch { return 0; }
  });
  const [fontFamily, setFontFamilyState] = useState(() => {
    try { const v = localStorage.getItem("fontFamily"); return FONT_FAMILIES[v] ? v : "plex"; }
    catch { return "plex"; }
  });
  const setTheme = (n) => {
    if (!themes[n]) return;
    try { localStorage.setItem("theme", n); } catch {}
    setMode(n);
  };
  const setFontScale = (n) => {
    const clamped = Math.min(FONT_SCALE_MAX, Math.max(0, n));
    try { localStorage.setItem("fontScale", String(clamped)); } catch {}
    setFontScaleState(clamped);
  };
  const setFontFamily = (n) => {
    if (!FONT_FAMILIES[n]) return;
    try { localStorage.setItem("fontFamily", n); } catch {}
    setFontFamilyState(n);
  };
  const t = { ...themes[mode], mode };
  return (
    <ThemeCtx.Provider value={{ t, mode, setTheme, fontScale, setFontScale, fontFamily, setFontFamily }}>
      {children}
    </ThemeCtx.Provider>
  );
}
/* ═══════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════ */

/** Tiny haptic "detent" tick on supported devices (Android); no-op elsewhere. */
const buzz = () => { try { navigator.vibrate && navigator.vibrate(8); } catch {} };

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
    <section id={id} style={{ position: "relative", zIndex: 1, padding: "44px 0", ...s }}>
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
   THEME SWITCHER — segmented pill, all themes visible
   ═══════════════════════════════════════════════════════ */

const THEME_OPTIONS = [
  { key: "light",  Icon: Sun,      label: "Light",  color: "#FF9500" },
  { key: "dark",   Icon: Moon,     label: "Dark",   color: "#58A6FF" },
  { key: "forest", Icon: Leaf,     label: "Forest", color: "#4CAF50" },
  { key: "purple", Icon: Sparkles, label: "Purple", color: "#C084FC" },
  { key: "steel",  Icon: Monitor,  label: "Steel",  color: "#8E959E" },
];

// Segment geometry shared by the buttons and the sliding thumb —
// the thumb's translateX is computed from these, so they must stay in sync.
const SEG_SIZE = 28;
const SEG_PAD = 3;

/**
 * Segmented pill showing every theme at once (inspired by jwt.io's
 * system/dark/light switcher). Inactive icons are muted; the active one
 * is tinted in its theme's signature color and sits on a frosted-glass
 * thumb that slides to the selected segment.
 */
function ThemeSwitcher() {
  const { t, mode, setTheme } = useTheme();
  const idx = Math.max(0, THEME_OPTIONS.findIndex(o => o.key === mode));
  return (
    <div className="theme-ctl" role="radiogroup" aria-label="Theme" style={{
      position: "relative", display: "flex", alignItems: "center",
      padding: SEG_PAD, borderRadius: (SEG_SIZE + SEG_PAD * 2) / 2,
      background: t.toggleBg, border: `1px solid ${t.toggleBorder || t.glassBorder}`,
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    }}>
      {/* Sliding thumb behind the active segment */}
      <span aria-hidden="true" style={{
        position: "absolute", top: SEG_PAD, left: SEG_PAD,
        width: SEG_SIZE, height: SEG_SIZE, borderRadius: SEG_SIZE / 2,
        background: t.glassHover, border: `1px solid ${t.glassBorderHover}`,
        boxShadow: t.glassShadow,
        transform: `translateX(${idx * SEG_SIZE}px)`,
        transition: "transform .4s cubic-bezier(.22,1,.36,1)",
      }} />
      {THEME_OPTIONS.map(({ key, Icon, label, color }) => {
        const active = key === mode;
        return (
          <button key={key} onClick={() => setTheme(key)}
            role="radio" aria-checked={active}
            aria-label={`${label} theme`} title={`${label} theme`}
            style={{
              position: "relative", zIndex: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              width: SEG_SIZE, height: SEG_SIZE, borderRadius: SEG_SIZE / 2,
              background: "transparent", border: "none", padding: 0, cursor: "pointer",
              color: active ? color : t.textMuted,
              opacity: active ? 1 : 0.55,
              transform: active ? "scale(1.08)" : "scale(1)",
              transition: "all .3s cubic-bezier(.22,1,.36,1)",
            }}
            onMouseOver={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = color; }}
            onMouseOut={e => {
              if (!e.currentTarget.matches("[aria-checked='true']")) {
                e.currentTarget.style.opacity = "0.55";
                e.currentTarget.style.color = t.textMuted;
              }
            }}
          >
            <Icon size={14} strokeWidth={2.2} />
          </button>
        );
      })}
    </div>
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
  const { t, mode, setTheme, fontScale, setFontScale, fontFamily, setFontFamily } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const touchX = useRef(null);
  const themeTouchX = useRef(null);
  // Slide direction of the last change (1 = came from right), so the
  // incoming label animates from the side the old one was pushed toward.
  const [fontDir, setFontDir] = useState(1);
  const [themeDir, setThemeDir] = useState(1);
  const fontKeys = Object.keys(FONT_FAMILIES);
  const fontIdx = Math.max(0, fontKeys.indexOf(fontFamily));
  const cycleFont = (dir) => {
    setFontDir(dir); buzz();
    setFontFamily(fontKeys[(fontIdx + dir + fontKeys.length) % fontKeys.length]);
  };
  const themeIdx = Math.max(0, THEME_OPTIONS.findIndex(o => o.key === mode));
  const cycleTheme = (dir) => {
    setThemeDir(dir); buzz();
    setTheme(THEME_OPTIONS[(themeIdx + dir + THEME_OPTIONS.length) % THEME_OPTIONS.length].key);
  };
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  // Close the mobile menu when the page scrolls underneath it
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close);
    return () => window.removeEventListener("scroll", close);
  }, [open]);
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
      <div className="nav-shell" style={{
        maxWidth: 1080, margin: scrolled ? "8px auto" : "0 auto",
        padding: "0 28px",
        transition: "all .45s cubic-bezier(.22,1,.36,1)",
      }}>
        <div className="nav-inner" style={{
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ThemeSwitcher />
            <button className="nav-toggle" onClick={() => setOpen(!open)} style={{
              display: "none", alignItems: "center", justifyContent: "center",
              width: 32, height: 32, background: t.toggleBg, border: `1px solid ${t.toggleBorder || t.glassBorder}`, color: t.text, cursor: "pointer", padding: 0,
              borderRadius: 16, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", transition: "all .35s cubic-bezier(.22,1,.36,1)",
              }}
              onMouseOver={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.background = t.accentSoft; }}
              onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = t.toggleBg; }}
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu — the invisible backdrop before it catches taps anywhere
          outside the menu and closes it (the menu paints above, being later
          in the same stacking context). */}
      {open && (
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "transparent" }}
        />
      )}
      {open && (
        <div style={{
          margin: "4px 28px 0", padding: "8px 4px 12px",
          background: t.navGlass, backdropFilter: t.navBlur, WebkitBackdropFilter: t.navBlur,
          borderRadius: 18, border: `1px solid ${t.navBorder}`, boxShadow: t.glassShadow,
          position: "relative",
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
          {/* Theme row — the nav's icon pill is hidden on smartphones, so the
              theme is picked here by name, in the same swipeable capsule
              style as the Font row below. */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            margin: "8px 12px 0", padding: "14px 4px 2px",
            borderTop: `1px solid ${t.divider}`,
          }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: t.textSecondary, paddingLeft: 4 }}>
              Theme
            </span>
            <div
              onTouchStart={e => { themeTouchX.current = e.touches[0].clientX; }}
              onTouchEnd={e => {
                if (themeTouchX.current == null) return;
                const dx = e.changedTouches[0].clientX - themeTouchX.current;
                themeTouchX.current = null;
                if (Math.abs(dx) > 30) cycleTheme(dx < 0 ? 1 : -1);
              }}
              style={{
                display: "flex", alignItems: "center",
                padding: "3px 4px", borderRadius: 17,
                background: t.toggleBg, border: `1px solid ${t.toggleBorder || t.glassBorder}`,
                touchAction: "pan-y", userSelect: "none", WebkitUserSelect: "none",
              }}
            >
              <button onClick={() => cycleTheme(-1)} aria-label="Previous theme" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 26, height: 26, borderRadius: 13, padding: 0,
                background: "transparent", border: "none",
                color: t.textMuted, cursor: "pointer",
              }}>
                <ChevronLeft size={15} />
              </button>
              <span key={mode} style={{
                minWidth: 112, textAlign: "center",
                fontSize: 13, fontWeight: 600,
                color: THEME_OPTIONS[themeIdx].color,
                animation: `${themeDir > 0 ? "slideFromRight" : "slideFromLeft"} .3s cubic-bezier(.22,1,.36,1)`,
              }}>
                {THEME_OPTIONS[themeIdx].label}
              </span>
              <button onClick={() => cycleTheme(1)} aria-label="Next theme" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 26, height: 26, borderRadius: 13, padding: 0,
                background: "transparent", border: "none",
                color: t.textMuted, cursor: "pointer",
              }}>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
          {/* Font row — shows only the selected typeface (rendered in itself);
              swipe left/right on the capsule (or tap the chevrons) to switch.
              This hamburger menu is the only place the font controls are
              exposed (mobile-only by design). */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            margin: "0 12px", padding: "12px 4px 2px",
          }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: t.textSecondary, paddingLeft: 4 }}>
              Font
            </span>
            <div
              onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
              onTouchEnd={e => {
                if (touchX.current == null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                touchX.current = null;
                if (Math.abs(dx) > 30) cycleFont(dx < 0 ? 1 : -1);
              }}
              style={{
                display: "flex", alignItems: "center",
                padding: "3px 4px", borderRadius: 17,
                background: t.toggleBg, border: `1px solid ${t.toggleBorder || t.glassBorder}`,
                touchAction: "pan-y", userSelect: "none", WebkitUserSelect: "none",
              }}
            >
              <button onClick={() => cycleFont(-1)} aria-label="Previous font" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 26, height: 26, borderRadius: 13, padding: 0,
                background: "transparent", border: "none",
                color: t.textMuted, cursor: "pointer",
              }}>
                <ChevronLeft size={15} />
              </button>
              <span key={fontFamily} style={{
                minWidth: 112, textAlign: "center",
                fontSize: 13, fontWeight: 600, color: t.accent,
                fontFamily: FONT_FAMILIES[fontFamily].stack,
                animation: `${fontDir > 0 ? "slideFromRight" : "slideFromLeft"} .3s cubic-bezier(.22,1,.36,1)`,
              }}>
                {FONT_FAMILIES[fontFamily].label}
              </span>
              <button onClick={() => cycleFont(1)} aria-label="Next font" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 26, height: 26, borderRadius: 13, padding: 0,
                background: "transparent", border: "none",
                color: t.textMuted, cursor: "pointer",
              }}>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
          {/* Font-size row */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            margin: "0 12px", padding: "12px 4px 2px",
          }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: t.textSecondary, paddingLeft: 4 }}>
              Font Size
            </span>
            {/* Capsule mirrors the Font selector's geometry exactly:
                26px end buttons + 112px center, same padding/radius. */}
            <div style={{
              display: "flex", alignItems: "center",
              padding: "3px 4px", borderRadius: 17,
              background: t.toggleBg, border: `1px solid ${t.toggleBorder || t.glassBorder}`,
            }}>
              <button onClick={() => { buzz(); setFontScale(fontScale - 1); }} disabled={fontScale === 0}
                aria-label="Decrease text size" style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 26, height: 26, borderRadius: 13, padding: 0,
                  background: "transparent", border: "none",
                  color: t.text, fontSize: 11, fontWeight: 700, lineHeight: 1,
                  opacity: fontScale === 0 ? 0.3 : 0.8,
                  cursor: fontScale === 0 ? "default" : "pointer",
                  transition: "opacity .25s ease",
                }}
              >A</button>
              <div style={{
                minWidth: 112, display: "flex", justifyContent: "center", gap: 6,
              }} aria-hidden="true">
                {FONT_SCALE_ZOOM.map((_, i) => (
                  <span key={i} style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: i <= fontScale ? t.accent : t.divider,
                    transition: "background .25s ease",
                  }} />
                ))}
              </div>
              <button onClick={() => { buzz(); setFontScale(fontScale + 1); }} disabled={fontScale === FONT_SCALE_MAX}
                aria-label="Increase text size" style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 26, height: 26, borderRadius: 13, padding: 0,
                  background: "transparent", border: "none",
                  color: t.text, fontSize: 15, fontWeight: 700, lineHeight: 1,
                  opacity: fontScale === FONT_SCALE_MAX ? 0.3 : 0.8,
                  cursor: fontScale === FONT_SCALE_MAX ? "default" : "pointer",
                  transition: "opacity .25s ease",
                }}
              >A</button>
            </div>
          </div>
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
    background: mode !== "light"
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
                                    boxShadow: mode !== "light"
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
const HERO_ROLES = [
    "Java Backend Engineer",
    "Microservices Architect",
    "Spring Boot Developer",
    "Cloud-Native Builder",
];

function Hero({ onViewResume }) {
  const { t } = useTheme();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 120); }, []);
  const a = (d) => ({
    opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(24px)",
    transition: `all .9s cubic-bezier(.22,1,.36,1) ${d}s`,
  });

    // Typewriter state
    const [roleIndex, setRoleIndex] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [typing, setTyping] = useState(true);

    useEffect(() => {
        const current = HERO_ROLES[roleIndex];
        if (typing) {
            if (displayed.length < current.length) {
                const id = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
                return () => clearTimeout(id);
            } else {
                const id = setTimeout(() => setTyping(false), 1800);
                return () => clearTimeout(id);
            }
        } else {
            if (displayed.length > 0) {
                const id = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
                return () => clearTimeout(id);
            } else {
                setRoleIndex((roleIndex + 1) % HERO_ROLES.length);
                setTyping(true);
            }
        }
    }, [displayed, typing, roleIndex]);

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
            width: 140, height: 140, borderRadius: "50%", margin: "0 auto 28px",
            overflow: "hidden",
            boxShadow: `0 8px 40px ${t.accentGlow}, 0 0 0 4px ${t.glass}`,
          }}>
            <img
              src={process.env.PUBLIC_URL + "/Photo.png"}
              alt="Mahaveersinh Gohil"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
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
          ...a(0.38), fontSize: "clamp(16px,2.4vw,20px)", fontWeight: 500,
          fontFamily: "'IBM Plex Mono', monospace",
          color: t.accent, marginBottom: 16, letterSpacing: "-0.01em",
            minHeight: "1.4em",
        }}>
            {displayed}
            <span style={{
                display: "inline-block", width: 2, height: "1em",
                background: t.accent, marginLeft: 2, verticalAlign: "text-bottom",
                animation: "blink 1s step-end infinite",
            }}/>
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
        {/* ── Resume CTA ── */}
        <div style={{ ...a(0.62), display: "flex", justifyContent: "center", marginBottom: 40 }}>
          <button
            id="open-resume-btn"
            className="cta-primary"
            onClick={() => { buzz(); onViewResume(); }}
            style={{
              position: "relative", overflow: "hidden",
              display: "inline-flex", alignItems: "center", gap: 11,
              padding: "13px 24px 13px 15px", borderRadius: 999,
              fontSize: 15.5, fontWeight: 600, letterSpacing: "-0.01em",
              background: t.gradient, color: "#fff", border: "none", cursor: "pointer",
              boxShadow: `0 8px 28px ${t.accentGlow}, inset 0 1px 0 rgba(255,255,255,.35)`,
              transition: "transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease",
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
              e.currentTarget.style.boxShadow = `0 14px 40px ${t.accentGlow}, inset 0 1px 0 rgba(255,255,255,.35)`;
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = `0 8px 28px ${t.accentGlow}, inset 0 1px 0 rgba(255,255,255,.35)`;
            }}
          >
            <span style={{
              width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              background: "rgba(255,255,255,.22)", border: "1px solid rgba(255,255,255,.32)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <FileText size={15} />
            </span>
            View Resume
            <ArrowRight className="cta-arrow" size={17} style={{ transition: "transform .3s cubic-bezier(.22,1,.36,1)" }} />
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
 * Animated stat card that counts up from 0 to `end` using requestAnimationFrame
 * once it scrolls into view. Handles integer (floor) and decimal (toFixed(1)) ends.
 */
function AnimatedStatCard({icon: Icon, end, suffix, label, delay}) {
    const {t} = useTheme();
    const [ref, vis] = useInView();
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!vis) return;
        let startTime = null;
        const duration = 1000;
        const animate = (ts) => {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(eased * end);
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(end);
        };
        requestAnimationFrame(animate);
    }, [vis, end]);

    const display = Number.isInteger(end) ? Math.floor(count) : count.toFixed(1);

    return (
        <FadeIn delay={delay}>
            <div ref={ref}>
                <GlassCard style={{padding: "22px 16px", textAlign: "center", height: "100%"}}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 12, margin: "0 auto 10px",
                        background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <Icon size={18} color={t.accent} strokeWidth={1.8}/>
                    </div>
                    <div style={{fontSize: 26, fontWeight: 700, color: t.text, letterSpacing: "-0.02em"}}>
                        {display}{suffix}
                    </div>
                    <div style={{color: t.textMuted, fontSize: 12, fontWeight: 500, marginTop: 3}}>{label}</div>
                </GlassCard>
            </div>
        </FadeIn>
    );
}

/**
 * "About Me" section with a bio paragraph and a 2×2 animated stats grid
 * (years of experience, microservices count, uptime, code reviews).
 */
function About() {
    const stats = [
        {icon: Clock, end: 3, suffix: "+", label: "Years"},
        {icon: Server, end: 8, suffix: "+", label: "Services"},
        {icon: TrendingUp, end: 99.9, suffix: "%", label: "Uptime"},
        {icon: Users, end: 100, suffix: "+", label: "Reviews"},
    ];
  const { t } = useTheme();
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
            {stats.map((st, i) => (
                <AnimatedStatCard
                    key={i}
                    icon={st.icon}
                    end={st.end}
                    suffix={st.suffix}
                    label={st.label}
                    delay={0.12 + i * 0.07}
                />
            ))}
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

/** Convert a 6-digit hex color to rgba at the given alpha (returns input unchanged if not hex). */
const tint = (hex, a) => {
  if (typeof hex !== "string" || hex[0] !== "#" || hex.length !== 7) return hex;
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/**
 * Horizontal row for a single skill: tinted logo chip, name, and an
 * animated proficiency bar that fills from 0 → level% on first scroll into view.
 * When `url` is set, the row links to the technology's official website in a new tab.
 * @param {{ skill: { name: string, level: number, Icon: React.ComponentType, color: string, url?: string }, delay: number }} props
 */
function SkillBadge({ skill, delay }) {
  const { t } = useTheme();
  const [barRef, barVis] = useInView(0.3);
  const { Icon, color, url } = skill;
  return (
    <FadeIn delay={delay}>
      <a
        ref={barRef}
        className="skill-row"
        href={url}
        target={url ? "_blank" : undefined}
        rel={url ? "noopener noreferrer" : undefined}
        aria-label={url ? `${skill.name} — official website` : undefined}
        style={{
          display: "flex", alignItems: "center", gap: 18,
          padding: "13px 14px", borderRadius: 16,
          transition: "background .25s cubic-bezier(.22,1,.36,1)",
          cursor: url ? "pointer" : "default", textDecoration: "none",
        }}
        onMouseOver={e => { e.currentTarget.style.background = tint(color, 0.08); }}
        onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{
          width: 56, height: 56, borderRadius: 16, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: tint(color, 0.12), border: `1px solid ${tint(color, 0.22)}`,
          boxShadow: `0 4px 14px ${tint(color, 0.18)}`,
        }}>
          <Icon size={32} color={color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: t.text, letterSpacing: "-0.01em" }}>
                {skill.name}
              </span>
              {url && <ExternalLink className="skill-ext" size={12} color={t.textMuted} />}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: color, fontVariantNumeric: "tabular-nums" }}>
              {skill.level}%
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: t.barBg, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 3,
              width: barVis ? `${skill.level}%` : "0%",
              background: `linear-gradient(90deg, ${tint(color, 0.55)} 0%, ${color} 100%)`,
              boxShadow: `0 0 10px ${tint(color, 0.4)}`,
              transition: `width 1.1s cubic-bezier(.22,1,.36,1) ${delay + 0.15}s`,
            }} />
          </div>
        </div>
      </a>
    </FadeIn>
  );
}

/**
 * Technical skills section. Groups skills into six categories
 * (Languages, Frameworks, Databases, Cloud/DevOps, Security, Architecture)
 * and renders each as a GlassCard containing SkillBadge components.
 */
function Skills() {
  const { t } = useTheme();
  // Brand technologies use their official logo + brand hex color.
  // Concepts without a logo (SQL, REST, OAuth, …) get a lucide glyph
  // tinted with the theme accent; near-black logos (Kafka, JWT) use
  // t.text so they stay visible on dark themes.
  const categories = [
    { title: "Languages & Core", icon: Code2, skills: [
      { name: "Java", level: 95, Icon: FaJava, color: "#ED8B00", url: "https://www.oracle.com/java/" },
      { name: "SQL", level: 85, Icon: Database, color: t.accent, url: "https://www.mysql.com/" },
    ]},
    { title: "Frameworks", icon: Layers, skills: [
      { name: "Spring Boot", level: 92, Icon: SiSpringboot, color: "#6DB33F", url: "https://spring.io/projects/spring-boot" },
      { name: "Spring Data JPA", level: 88, Icon: SiSpring, color: "#6DB33F", url: "https://spring.io/projects/spring-data-jpa" },
      { name: "Spring Security", level: 85, Icon: SiSpringsecurity, color: "#6DB33F", url: "https://spring.io/projects/spring-security" },
      { name: "Hibernate", level: 88, Icon: SiHibernate, color: "#59666C", url: "https://hibernate.org/" },
      { name: "Kafka", level: 80, Icon: SiApachekafka, color: t.text, url: "https://kafka.apache.org/" },
      { name: "REST APIs", level: 93, Icon: Globe, color: t.accent, url: "https://developer.mozilla.org/en-US/docs/Glossary/REST" },
    ]},
    { title: "Databases", icon: Database, skills: [
      { name: "MySQL", level: 90, Icon: SiMysql, color: "#4479A1", url: "https://www.mysql.com/" },
      { name: "Redis", level: 82, Icon: SiRedis, color: "#DC382D", url: "https://redis.io/" },
      { name: "MongoDB", level: 78, Icon: SiMongodb, color: "#47A248", url: "https://www.mongodb.com/" },
      { name: "Oracle", level: 75, Icon: GrOracle, color: "#F80000", url: "https://www.oracle.com/database/" },
    ]},
    { title: "Cloud & DevOps", icon: Cloud, skills: [
      { name: "Docker", level: 85, Icon: SiDocker, color: "#2496ED", url: "https://www.docker.com/" },
      { name: "Kubernetes", level: 78, Icon: SiKubernetes, color: "#326CE5", url: "https://kubernetes.io/" },
      { name: "AWS", level: 75, Icon: FaAws, color: "#FF9900", url: "https://aws.amazon.com/" },
      { name: "Jenkins", level: 78, Icon: SiJenkins, color: "#D24939", url: "https://www.jenkins.io/" },
      { name: "Nginx", level: 80, Icon: SiNginx, color: "#009639", url: "https://nginx.org/" },
      { name: "Git", level: 90, Icon: SiGit, color: "#F05032", url: "https://git-scm.com/" },
    ]},
    { title: "Security", icon: Shield, skills: [
      { name: "Keycloak", level: 82, Icon: SiKeycloak, color: "#008AAA", url: "https://www.keycloak.org/" },
      { name: "OAuth 2.0", level: 85, Icon: ShieldCheck, color: t.accent, url: "https://oauth.net/2/" },
      { name: "JWT", level: 88, Icon: SiJsonwebtokens, color: t.text, url: "https://jwt.io/" },
    ]},
    { title: "Architecture", icon: Box, skills: [
      { name: "Microservices", level: 90, Icon: Boxes, color: t.accent },
      { name: "Event-Driven", level: 85, Icon: Zap, color: t.accent3 },
      { name: "Lucene Search", level: 78, Icon: SiApachelucene, color: "#019B8F" },
      { name: "Agile / Scrum", level: 85, Icon: RefreshCw, color: t.accent },
    ]},
  ];
  return (
    <Section id="skills">
      <SectionTitle icon={Cpu} title="Technical Skills" />
      {/* Masonry via CSS multi-columns: cards keep their natural height and
          pack tightly instead of stretching to the tallest row (see .skills-masonry). */}
      <div className="skills-masonry">
          {categories.map((cat, ci) => {
              const Icon = cat.icon;
              return (
          <FadeIn key={ci} delay={ci * 0.06} style={{ breakInside: "avoid", marginBottom: 18 }}>
            <GlassCard style={{ padding: "26px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "0 14px" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                  background: t.gradient, boxShadow: `0 4px 14px ${t.accentGlow}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <Icon size={17} color="#fff" strokeWidth={2.2}/>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, letterSpacing: "-0.01em" }}>{cat.title}</h3>
                <span style={{
                  marginLeft: "auto", fontSize: 11, fontWeight: 600, color: t.textMuted,
                  background: t.tagBg, border: `1px solid ${t.divider}`,
                  padding: "3px 9px", borderRadius: 9,
                }}>{cat.skills.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {cat.skills.map((sk, si) => (
                  <SkillBadge key={si} skill={sk} delay={ci * 0.04 + si * 0.03} />
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
 * Thin gradient bar pinned to the very top of the viewport showing how far
 * through the page the visitor has scrolled. Sits above the nav (zIndex 120)
 * and ignores pointer events entirely.
 */
function ScrollProgress() {
  const { t } = useTheme();
  const [p, setP] = useState(0);
  useEffect(() => {
    const h = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    h();
    window.addEventListener("scroll", h, { passive: true });
    window.addEventListener("resize", h);
    return () => { window.removeEventListener("scroll", h); window.removeEventListener("resize", h); };
  }, []);
  return (
    <div aria-hidden="true" style={{
      position: "fixed", top: 0, left: 0, right: 0, height: 3,
      zIndex: 120, pointerEvents: "none",
    }}>
      <div style={{
        height: "100%", width: `${p * 100}%`,
        background: t.gradient,
        boxShadow: `0 0 8px ${t.accentGlow}`,
        borderRadius: "0 2px 2px 0",
      }} />
    </div>
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
    <a href="#hero" onClick={buzz} style={{
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
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; scroll-padding-top: 80px; }
      body {
        font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
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
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
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
        .nav-toggle { display: flex !important; }
        /* Smartphone: the theme icon pill leaves the nav bar — the hamburger
           menu's Theme capsule (name-based) takes over. Desktop unchanged. */
        .theme-ctl { display: none !important; }
      }
      @media (max-width: 400px) {
        .nav-shell { padding: 0 12px !important; }
        .nav-inner { padding: 0 12px !important; }
      }
      /* Skills masonry: at most 2 wide columns (each at least 380px) so the
         56px logo chips have room to breathe — collapses to 1 column on mobile. */
      .skills-masonry { columns: 2 380px; column-gap: 22px; }
      .skills-masonry > * { break-inside: avoid; }
      /* Hero CTA: periodic glossy shine sweep + arrow nudge on hover */
      .cta-primary::after {
        content: ""; position: absolute; top: 0; left: -80%;
        width: 55%; height: 100%; pointer-events: none;
        background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,.4) 50%, transparent 80%);
        transform: skewX(-20deg);
        animation: ctaShine 4s cubic-bezier(.4,0,.2,1) infinite;
      }
      @keyframes ctaShine {
        0% { left: -80%; }
        55%, 100% { left: 140%; }
      }
      .cta-primary:hover .cta-arrow { transform: translateX(4px) !important; }
      /* Skill rows link to the tech's official site — reveal the hint icon on hover */
      .skill-row .skill-ext { opacity: 0; transition: opacity .25s ease; flex-shrink: 0; }
      .skill-row:hover .skill-ext { opacity: 1; }
      /* Keep anchor-jump targets clear of the fixed nav bar */
      section[id] { scroll-margin-top: 76px; }
      /* Capsule selectors: label slides in from the side it was pushed from */
      @keyframes slideFromRight {
        from { opacity: 0; transform: translateX(12px); }
        to   { opacity: 1; transform: none; }
      }
      @keyframes slideFromLeft {
        from { opacity: 0; transform: translateX(-12px); }
        to   { opacity: 1; transform: none; }
      }
    `}</style>
  );
}
/* ═══════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════ */

/**
 * Root component. Wraps the app in ThemeProvider so every child
 * can access theme tokens and the setTheme function via useTheme().
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
  const { fontScale, fontFamily } = useTheme();
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
      <ScrollProgress />
      <Nav />
      {/* Text-size and font controls affect only the page content — the fixed
          nav, background, and back-to-top button keep their defaults. */}
      <main style={{ zoom: FONT_SCALE_ZOOM[fontScale], fontFamily: FONT_FAMILIES[fontFamily].stack }}>
        <Hero onViewResume={() => setPage("resume")} />
        <About />
        <Experience />
        <Skills />
        <Education />
        <Achievements />
        <Contact />
        <Footer />
      </main>
      <BackToTop />
    </>
  );
}
