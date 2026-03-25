import { useState, useEffect, useRef, createContext, useContext } from "react";
import {
  Mail, Phone, MapPin, Linkedin, ChevronDown, Briefcase, GraduationCap,
  Award, Code2, Zap, Shield, Database, Cloud, GitBranch, Server,
  Cpu, Layers, Box, ExternalLink, Star, TrendingUp, CheckCircle2,
  ArrowUp, Menu, X, Globe, Clock, Users, BarChart3, Sun, Moon, Rocket,
} from "lucide-react";
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
const ThemeCtx = createContext();
const useTheme = () => useContext(ThemeCtx);
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
function GlassCard({ children, style: s = {}, radius = 24, hoverLift = true }) {
  const { t } = useTheme();
  const ref = useRef();
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
function Section({ id, children, style: s = {} }) {
  return (
    <section id={id} style={{ position: "relative", zIndex: 1, padding: "88px 0", ...s }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 28px" }}>{children}</div>
    </section>
  );
}
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
   HERO
   ═══════════════════════════════════════════════════════ */
function Hero() {
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
        <div style={{ ...a(0.56), display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 40 }}>
          {[
            { icon: MapPin, text: "Rajkot, Gujarat" },
            { icon: Phone, text: "+91-8000545662" },
            { icon: Mail, text: "gohilmahaveer@gmail.com" },
          ].map((c, i) => (
            <Pill key={i}><c.icon size={13} color={t.accent} />{c.text}</Pill>
          ))}
        </div>
        <div style={{ ...a(0.7), marginTop: 40 }}>
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
          {stats.map((st, i) => (
            <FadeIn key={i} delay={0.12 + i * 0.07}>
              <GlassCard style={{ padding: "22px 16px", textAlign: "center", height: "100%" }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12, margin: "0 auto 10px",
                  background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <st.icon size={18} color={t.accent} strokeWidth={1.8} />
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: t.text, letterSpacing: "-0.02em" }}>{st.value}</div>
                <div style={{ color: t.textMuted, fontSize: 12, fontWeight: 500, marginTop: 3 }}>{st.label}</div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}
/* ═══════════════════════════════════════════════════════
   EXPERIENCE
   ═══════════════════════════════════════════════════════ */
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
                {job.highlights.map((h, hi) => (
                  <div key={hi} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginTop: 1,
                      background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <h.icon size={13} color={t.accent} strokeWidth={2} />
                    </div>
                    <p style={{ color: t.textSecondary, fontSize: 14, lineHeight: 1.65, letterSpacing: "-0.01em" }}>{h.text}</p>
                  </div>
                ))}
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
        {categories.map((cat, ci) => (
          <FadeIn key={ci} delay={ci * 0.06}>
            <GlassCard style={{ padding: 26, height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10,
                  background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <cat.icon size={16} color={t.accent} strokeWidth={2} />
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
        ))}
      </div>
    </Section>
  );
}
/* ═══════════════════════════════════════════════════════
   EDUCATION
   ═══════════════════════════════════════════════════════ */
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
        {items.map((a, i) => (
          <FadeIn key={i} delay={i * 0.08}>
            <GlassCard style={{ padding: 28, textAlign: "center" }}>
              <div style={{
                width: 50, height: 50, borderRadius: 16, margin: "0 auto 14px",
                background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${t.pillBorder}`,
              }}>
                <a.icon size={22} color={t.accent} strokeWidth={1.8} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 8, letterSpacing: "-0.02em" }}>{a.title}</h3>
              <p style={{ color: t.textMuted, fontSize: 13, lineHeight: 1.6 }}>{a.desc}</p>
            </GlassCard>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
/* ═══════════════════════════════════════════════════════
   CONTACT
   ═══════════════════════════════════════════════════════ */
function Contact() {
  const { t } = useTheme();
  const items = [
    { icon: Mail, label: "Email", value: "gohilmahaveer@gmail.com", href: "mailto:gohilmahaveer@gmail.com" },
    { icon: Phone, label: "Phone", value: "+91-8000545662", href: "tel:+918000545662" },
    { icon: Linkedin, label: "LinkedIn", value: "mahaveersinh-gohil", href: "https://linkedin.com/in/mahaveersinh-gohil" },
    { icon: MapPin, label: "Location", value: "Rajkot, Gujarat, India", href: "#" },
  ];
  return (
    <Section id="contact" style={{ paddingBottom: 48 }}>
      <SectionTitle icon={Globe} title="Get In Touch" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {items.map((l, i) => (
          <FadeIn key={i} delay={i * 0.08}>
            <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <GlassCard style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} radius={18}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: t.accentSoft, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <l.icon size={18} color={t.accent} strokeWidth={1.8} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{l.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.value}</div>
                </div>
                {l.href.startsWith("http") && <ExternalLink size={14} color={t.textMuted} style={{ marginLeft: "auto", flexShrink: 0 }} />}
              </GlassCard>
            </a>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
/* ═══════════════════════════════════════════════════════
   FOOTER + BACK TO TOP
   ═══════════════════════════════════════════════════════ */
function Footer() {
  const { t } = useTheme();
  return (
    <footer style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "28px 28px", borderTop: `1px solid ${t.divider}` }}>
      <p style={{ color: t.textMuted, fontSize: 12, fontWeight: 500 }}>© {new Date().getFullYear()} Mahaveersinh Gohil</p>
    </footer>
  );
}
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
      @media (max-width: 768px) {
        .nav-desktop { display: none !important; }
        .nav-toggle { display: block !important; }
      }
      @media (min-width: 769px) {
        .nav-mobile { display: none !important; }
      }
    `}</style>
  );
}
/* ═══════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════ */
export default function App() {
  return (
    <ThemeProvider>
      <Inner />
    </ThemeProvider>
  );
}
function Inner() {
  return (
    <>
      <GlobalStyles />
      <MeshBackground />
      <Nav />
      <Hero />
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
