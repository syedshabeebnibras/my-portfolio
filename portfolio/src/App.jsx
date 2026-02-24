import { useState, useEffect, useRef } from "react";

/* ─── DATA ──────────────────────────────────────────────── */
const projects = [
  {
    title: "Optimal Trade Parameter Selection",
    tags: ["Calculus", "Optimization", "Derivatives", "Risk Management"],
    desc: "Applied single-variable calculus to optimize position size, leverage, and stop-loss placement. Built profit models incorporating market impact, execution costs, and risk penalties with full sensitivity analysis.",
    metric: "Full sensitivity analysis across all key parameters",
  },
  {
    title: "Market Regime Discovery via Geometric Decomposition",
    tags: ["PCA", "SVD", "Linear Algebra", "Clustering"],
    desc: "Improved market regime identification by ~20% using PCA and clustering on equity and multi-asset return data. Evaluated factor exposures, volatility, and drawdown characteristics across environments.",
    metric: "~20% improvement in regime stability",
  },
  {
    title: "Trading Strategy Profitability via Expected Value",
    tags: ["Probability", "Monte Carlo", "Backtesting"],
    desc: "Evaluated 1,000+ historical trades on expected return as the sole profitability criterion. Integrated round-trip transaction costs (~5–10 bps) and ran parameter sweeps on win rate and payoff ratios.",
    metric: "1,000+ historical trades evaluated",
  },
  {
    title: "Portfolio Risk Surface Analysis",
    tags: ["Multivariable Calculus", "Portfolio Theory", "Optimization"],
    desc: "Improved investment decision quality by ~15% via constrained optimization with expected returns, transaction costs, and risk penalties. Documented key performance drivers and failure modes.",
    metric: "~15% decision quality improvement",
  },
  {
    title: "Monte Carlo Option Pricer",
    tags: ["NumPy", "Stochastic Modeling", "Options Pricing"],
    desc: "Improved pricing stability by ~25% via Monte Carlo simulations for derivative values and risk metrics. Vectorized simulations cut runtime ~20%, validated against analytical benchmarks.",
    metric: "~25% pricing stability, ~20% faster runtime",
  },
];

const skillGroups = [
  {
    label: "Languages & Libraries",
    items: [
      { name: "Python (NumPy, Pandas)", pct: 95 },
      { name: "SQL & ETL Pipelines", pct: 90 },
      { name: "C++", pct: 68 },
      { name: "Shell / Linux / Git", pct: 78 },
    ],
  },
  {
    label: "Quantitative Finance",
    items: [
      { name: "Portfolio Risk & Attribution", pct: 92 },
      { name: "Monte Carlo Simulation", pct: 90 },
      { name: "Option Pricing", pct: 82 },
      { name: "Factor & Regime Analysis", pct: 85 },
    ],
  },
  {
    label: "Mathematics",
    items: [
      { name: "Probability & Statistics", pct: 93 },
      { name: "Linear Algebra", pct: 90 },
      { name: "Multivariable Calculus", pct: 88 },
      { name: "Numerical Methods", pct: 83 },
    ],
  },
  {
    label: "Investment Analytics",
    items: [
      { name: "Portfolio Construction", pct: 88 },
      { name: "Performance Attribution", pct: 90 },
      { name: "Backtesting Logic", pct: 85 },
      { name: "Systematic Research", pct: 87 },
    ],
  },
];

/* ─── CSS ────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #fafaf8;
  --surface: #ffffff;
  --surface2: #f4f3f0;
  --border: #e8e6e1;
  --border2: #d4d1ca;
  --text: #18181b;
  --body: #52525b;
  --muted: #a1a1aa;
  --dim: #d4d4d8;
  --accent: #1d4ed8;
  --accent-bg: #eff6ff;
  --accent-mid: #93c5fd;
  --serif: 'Cormorant Garamond', Georgia, serif;
  --sans: 'DM Sans', sans-serif;
  --max: 1040px;
  --pad: 56px;
}

html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); font-family: var(--sans); font-weight: 400; -webkit-font-smoothing: antialiased; }
a { text-decoration: none; color: inherit; }

/* SCROLLBAR */
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

/* ── NAV ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  height: 64px;
  background: rgba(250,250,248,0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 var(--pad);
}
.nav-brand { display: flex; align-items: center; gap: 12px; }
.nav-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--serif); font-size: 13px; color: #fff; font-weight: 500;
}
.nav-name { font-family: var(--serif); font-size: 16px; font-weight: 600; letter-spacing: 0.01em; }
.nav-links { display: flex; gap: 32px; list-style: none; }
.nav-links a {
  font-size: 12px; font-weight: 500; color: var(--muted);
  letter-spacing: 0.05em; text-transform: uppercase;
  transition: color 0.18s;
}
.nav-links a:hover { color: var(--text); }
.nav-cta {
  padding: 8px 20px; background: var(--text); color: var(--bg);
  font-size: 12px; font-weight: 500; letter-spacing: 0.04em;
  border-radius: 4px; transition: opacity 0.18s;
}
.nav-cta:hover { opacity: 0.8; }

/* ── HERO ── */
.hero {
  min-height: 100vh;
  display: flex; flex-direction: column; justify-content: center;
  padding: 100px var(--pad) 80px;
  max-width: var(--max); margin: 0 auto;
}
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 28px;
}
.hero-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
.hero-h1 {
  font-family: var(--serif);
  font-size: clamp(52px, 7.5vw, 96px);
  font-weight: 700; line-height: 1.0; letter-spacing: -0.02em;
  margin-bottom: 36px; color: var(--text);
}
.hero-h1 em { font-style: italic; color: var(--accent); }
.hero-sub {
  font-size: 16px; font-weight: 400; color: var(--body); line-height: 1.8;
  max-width: 540px; margin-bottom: 48px;
}
.hero-actions { display: flex; gap: 16px; align-items: center; margin-bottom: 80px; }
.btn-dark {
  padding: 13px 28px; background: var(--text); color: var(--bg);
  font-size: 13px; font-weight: 500; letter-spacing: 0.03em;
  border-radius: 6px; transition: opacity 0.18s;
}
.btn-dark:hover { opacity: 0.82; }
.btn-light {
  padding: 13px 28px; background: transparent; color: var(--body);
  font-size: 13px; font-weight: 400; letter-spacing: 0.03em;
  border: 1px solid var(--border2); border-radius: 6px;
  transition: border-color 0.18s, color 0.18s;
}
.btn-light:hover { border-color: var(--text); color: var(--text); }
.hero-stats {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 1px; background: var(--border);
  border: 1px solid var(--border); border-radius: 10px; overflow: hidden;
}
.hero-stat {
  background: var(--surface); padding: 24px 28px;
}
.hs-num {
  font-family: var(--serif); font-size: 36px; font-weight: 300;
  color: var(--accent); line-height: 1; display: block; margin-bottom: 6px;
}
.hs-label { font-size: 12px; font-weight: 500; color: var(--muted); line-height: 1.4; }

/* ── SHARED SECTION ── */
.section { padding: 96px 0; }
.section + .section { border-top: 1px solid var(--border); }
.wrap { max-width: var(--max); margin: 0 auto; padding: 0 var(--pad); }

.sec-label {
  display: flex; align-items: center; gap: 12px;
  font-size: 10px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 14px;
}
.sec-label-line { flex: 1; height: 1px; background: var(--border); max-width: 60px; }
.sec-title {
  font-family: var(--serif); font-size: clamp(32px, 4vw, 52px);
  font-weight: 700; line-height: 1.1; letter-spacing: -0.02em;
  margin-bottom: 56px;
}

/* ── ABOUT ── */
.about-layout { display: grid; grid-template-columns: 1.1fr 1fr; gap: 72px; align-items: start; }
.about-text { font-size: 15px; font-weight: 400; color: var(--body); line-height: 1.9; }
.about-text p + p { margin-top: 18px; }
.about-text strong { color: var(--text); font-weight: 500; }
.about-aside { display: flex; flex-direction: column; gap: 20px; }
.aside-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 10px; padding: 24px;
}
.aside-card-title {
  font-size: 10px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 16px;
}
.chip-wrap { display: flex; flex-wrap: wrap; gap: 7px; }
.chip {
  font-size: 11px; font-weight: 500; color: var(--body);
  border: 1px solid var(--border); border-radius: 20px;
  padding: 5px 12px; background: var(--bg);
  transition: border-color 0.18s, color 0.18s, background 0.18s;
}
.chip:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); }

/* ── EXPERIENCE ── */
.exp-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 40px 44px;
  display: grid; grid-template-columns: 200px 1fr; gap: 48px;
}
.exp-badge {
  display: inline-block; padding: 4px 10px; border-radius: 4px;
  background: var(--accent-bg); color: var(--accent);
  font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
  margin-bottom: 8px;
}
.exp-period { font-size: 12px; font-weight: 400; color: var(--muted); }
.exp-role {
  font-family: var(--serif); font-size: 24px; font-weight: 600;
  letter-spacing: -0.01em; margin-bottom: 24px; line-height: 1.2;
}
.exp-items { display: flex; flex-direction: column; gap: 14px; }
.exp-item {
  display: flex; gap: 14px;
  font-size: 14px; font-weight: 400; color: var(--body); line-height: 1.75;
}
.exp-bullet {
  flex-shrink: 0; margin-top: 9px;
  width: 5px; height: 5px; border-radius: 50%; background: var(--accent-mid);
}
.exp-item mark {
  background: none; color: var(--accent); font-weight: 500; padding: 0;
}

/* ── PROJECTS ── */
.proj-grid { display: flex; flex-direction: column; gap: 12px; }
.proj-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 10px; padding: 28px 32px;
  display: grid; grid-template-columns: 52px 1fr auto;
  gap: 20px; align-items: start;
  transition: border-color 0.2s, box-shadow 0.2s;
  cursor: default;
}
.proj-card:hover {
  border-color: var(--accent-mid);
  box-shadow: 0 4px 24px rgba(29,78,216,0.06);
}
.proj-num {
  font-family: var(--serif); font-size: 28px; font-weight: 300;
  color: var(--dim); line-height: 1; padding-top: 4px;
}
.proj-title {
  font-family: var(--serif); font-size: 19px; font-weight: 600;
  letter-spacing: -0.01em; margin-bottom: 8px; line-height: 1.25;
  transition: color 0.18s;
}
.proj-card:hover .proj-title { color: var(--accent); }
.proj-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.proj-tag {
  font-size: 10px; font-weight: 500; color: var(--muted);
  letter-spacing: 0.06em; text-transform: uppercase;
  padding: 3px 9px; border: 1px solid var(--border); border-radius: 3px;
}
.proj-desc { font-size: 13px; font-weight: 400; color: var(--body); line-height: 1.75; }
.proj-metric {
  font-size: 11px; font-weight: 400; color: var(--accent);
  background: var(--accent-bg); padding: 4px 10px; border-radius: 4px;
  white-space: nowrap; align-self: start;
}

/* ── SKILLS ── */
.skills-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 40px 64px; }
.sk-group {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 10px; padding: 28px 28px 20px;
}
.sk-label {
  font-size: 10px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 20px; display: block;
}
.sk-item { margin-bottom: 16px; }
.sk-item:last-child { margin-bottom: 0; }
.sk-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
.sk-name { font-size: 13px; font-weight: 500; color: var(--body); }
.sk-pct { font-size: 11px; font-weight: 300; color: var(--muted); }
.sk-track {
  height: 3px; background: var(--border); border-radius: 2px; overflow: hidden;
}
.sk-fill {
  height: 100%; background: linear-gradient(90deg, var(--accent) 0%, #60a5fa 100%);
  border-radius: 2px;
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.9s cubic-bezier(0.16,1,0.3,1);
}
.sk-fill.anim { transform: scaleX(1); }

/* ── EDUCATION ── */
.edu-grid { display: flex; flex-direction: column; gap: 12px; }
.edu-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 10px; padding: 28px 32px;
  display: flex; justify-content: space-between; align-items: center;
  gap: 24px;
}
.edu-school { font-family: var(--serif); font-size: 20px; font-weight: 600; letter-spacing: -0.01em; margin-bottom: 4px; }
.edu-deg { font-size: 13px; font-weight: 400; color: var(--body); }
.edu-yr {
  font-size: 12px; font-weight: 400; color: var(--muted);
  white-space: nowrap; text-align: right;
}
.pub-card {
  margin-top: 12px;
  background: var(--accent-bg); border: 1px solid var(--accent-mid);
  border-radius: 10px; padding: 24px 32px;
  display: flex; justify-content: space-between; align-items: center; gap: 24px;
}
.pub-label {
  font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 6px;
}
.pub-title { font-family: var(--serif); font-size: 17px; font-weight: 600; margin-bottom: 3px; }
.pub-meta { font-size: 12px; font-weight: 400; color: var(--body); }
.pub-link {
  flex-shrink: 0; padding: 9px 20px;
  background: var(--accent); color: #fff;
  font-size: 12px; font-weight: 500; border-radius: 6px;
  transition: opacity 0.18s;
}
.pub-link:hover { opacity: 0.85; }

/* ── CONTACT ── */
.contact-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
.contact-heading {
  font-family: var(--serif); font-size: clamp(36px, 5vw, 56px);
  font-weight: 700; line-height: 1.12; letter-spacing: -0.02em; margin-bottom: 18px;
}
.contact-heading span { color: var(--accent); font-style: italic; }
.contact-sub { font-size: 14px; font-weight: 400; color: var(--body); line-height: 1.8; }
.contact-links { display: flex; flex-direction: column; }
.contact-link {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 0; border-bottom: 1px solid var(--border);
  transition: none;
}
.contact-link:first-child { border-top: 1px solid var(--border); }
.contact-link-lbl { font-size: 11px; font-weight: 500; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }
.contact-link-val {
  display: flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 500; color: var(--text);
  transition: color 0.18s;
}
.contact-link:hover .contact-link-val { color: var(--accent); }
.contact-arrow { font-size: 16px; transition: transform 0.18s; }
.contact-link:hover .contact-arrow { transform: translate(2px,-2px); }

/* ── FOOTER ── */
.footer {
  border-top: 1px solid var(--border);
  padding: 32px var(--pad);
  display: flex; justify-content: space-between; align-items: center;
  max-width: var(--max); margin: 0 auto;
}
.footer-l { font-size: 13px; font-weight: 400; color: var(--muted); }
.footer-r { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); font-weight: 400; }
.footer-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--accent); }

/* ── FADE-IN ── */
.fi { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
.fi.v { opacity: 1; transform: none; }

/* ── RESPONSIVE ── */
@media (max-width: 820px) {
  :root { --pad: 24px; }
  .nav-links, .nav-cta { display: none; }
  .about-layout, .exp-card, .skills-layout, .contact-layout { grid-template-columns: 1fr; gap: 28px; }
  .proj-card { grid-template-columns: 40px 1fr; }
  .proj-metric { display: none; }
  .edu-card { flex-direction: column; align-items: flex-start; }
  .pub-card { flex-direction: column; align-items: flex-start; }
  .hero-stats { grid-template-columns: 1fr; }
  .hero { min-height: auto; padding-top: 96px; }
  .footer { flex-direction: column; gap: 8px; text-align: center; }
}
`;

/* ─── HELPERS ───────────────────────────────────────────── */
function useFadeIn(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function FI({ children, delay = 0 }) {
  const [ref, vis] = useFadeIn();
  return (
    <div ref={ref} className={`fi ${vis ? "v" : ""}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

function SkillBar({ name, pct, delay = 0 }) {
  const [ref, vis] = useFadeIn(0.2);
  return (
    <div className="sk-item" ref={ref}>
      <div className="sk-row">
        <span className="sk-name">{name}</span>
        <span className="sk-pct">{pct}%</span>
      </div>
      <div className="sk-track">
        <div
          className={`sk-fill ${vis ? "anim" : ""}`}
          style={{ width: `${pct}%`, transitionDelay: `${delay}s` }}
        />
      </div>
    </div>
  );
}

/* ─── COMPONENT ─────────────────────────────────────────── */
export default function Portfolio() {
  return (
    <>
      <style>{css}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-brand">
          <div className="nav-avatar">SN</div>
          <span className="nav-name">Syed Shabeeb Nibras</span>
        </div>
        <ul className="nav-links">
          {["About", "Experience", "Projects", "Skills", "Contact"].map((l) => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
        <a href="mailto:syedshabeebn@gmail.com" className="nav-cta">Hire Me</a>
      </nav>

      {/* HERO */}
      <div style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="hero">
          <FI>
            <div className="hero-eyebrow">
              <span className="hero-dot" />
              Associate Quantitative Analyst
            </div>
          </FI>
          <FI delay={0.08}>
            <h1 className="hero-h1">
              Syed Shabeeb<br />
              <em>Nibras</em>
            </h1>
          </FI>
          <FI delay={0.14}>
            <p className="hero-sub">
              Quantitative analyst specializing in portfolio risk, factor exposure analysis,
              and systematic investment research — turning complex models into decisions that move the needle.
            </p>
          </FI>
          <FI delay={0.18}>
            <div className="hero-actions">
              <a href="#projects" className="btn-dark">View Projects</a>
              <a href="#contact" className="btn-light">Get in Touch</a>
            </div>
          </FI>
          <FI delay={0.22}>
            <div className="hero-stats">
              {[
                ["~25%", "Analytical reliability improved at Wipro"],
                ["~20%", "Time-to-insight reduced via ETL optimization"],
                ["< 1 day", "Root-cause analysis cycle (from multi-day)"],
              ].map(([n, l]) => (
                <div className="hero-stat" key={n}>
                  <span className="hs-num">{n}</span>
                  <span className="hs-label">{l}</span>
                </div>
              ))}
            </div>
          </FI>
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="section">
        <div className="wrap">
          <FI>
            <div className="sec-label"><span className="sec-label-line" />01 — About</div>
            <h2 className="sec-title">Background &<br />Expertise</h2>
          </FI>
          <div className="about-layout">
            <FI delay={0.06}>
              <div className="about-text">
                <p>
                  I'm a quantitative analyst with a strong foundation in <strong>portfolio
                  analytics, investment research, and data-driven decision support</strong>.
                  Experienced in applying statistical analysis, optimization, and systematic
                  research techniques to assess portfolio risk and performance attribution.
                </p>
                <p>
                  At <strong>Wipro</strong>, I developed Python and SQL data pipelines that
                  improved analytical reliability by ~25%, optimized ETL workflows to cut
                  time-to-insight by ~20%, and built quantitative communication layers that
                  collapsed multi-day root-cause cycles to under a day.
                </p>
                <p>
                  Currently completing an <strong>MS in Computer Science at DePaul
                  University</strong>, building on a BTech from GITAM and a published paper
                  in deep learning security research.
                </p>
              </div>
            </FI>
            <FI delay={0.12}>
              <div className="about-aside">
                <div className="aside-card">
                  <div className="aside-card-title">Core Technologies</div>
                  <div className="chip-wrap">
                    {["Python", "NumPy", "Pandas", "SQL", "C++", "Linux", "Git"].map((s) => (
                      <span className="chip" key={s}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className="aside-card">
                  <div className="aside-card-title">Domain Expertise</div>
                  <div className="chip-wrap">
                    {["Monte Carlo", "PCA / SVD", "Portfolio Theory", "Factor Analysis",
                      "Options Pricing", "ETL Pipelines", "Backtesting"].map((s) => (
                      <span className="chip" key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </FI>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section">
        <div className="wrap">
          <FI>
            <div className="sec-label"><span className="sec-label-line" />02 — Experience</div>
            <h2 className="sec-title">Where I've<br />Worked</h2>
          </FI>
          <FI delay={0.08}>
            <div className="exp-card">
              <div>
                <span className="exp-badge">Wipro</span>
                <div className="exp-period">March 2022 – April 2023</div>
              </div>
              <div>
                <div className="exp-role">Salesforce Administrator<br />& Developer</div>
                <div className="exp-items">
                  {[
                    ["~25%", "Improved analytical reliability by developing Python and SQL data pipelines for quantitative analysis, portfolio risk exposure assessment, and investment decision support."],
                    ["~20%", "Reduced analytics refresh and time-to-insight by optimizing SQL queries and ETL workflows supporting performance attribution and factor exposure analysis."],
                    ["< 1 day", "Enhanced stakeholder decision-making by translating complex quantitative outputs into clear summaries explaining portfolio risk sensitivities and performance drivers."],
                  ].map(([metric, text]) => (
                    <div className="exp-item" key={metric}>
                      <div className="exp-bullet" />
                      <span>
                        <mark>{metric} impact</mark> — {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FI>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section">
        <div className="wrap">
          <FI>
            <div className="sec-label"><span className="sec-label-line" />03 — Projects</div>
            <h2 className="sec-title">Selected<br />Work</h2>
          </FI>
          <div className="proj-grid">
            {projects.map((p, i) => (
              <FI key={p.title} delay={i * 0.06}>
                <div className="proj-card">
                  <div className="proj-num">{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <div className="proj-title">{p.title}</div>
                    <div className="proj-tags">
                      {p.tags.map((t) => <span className="proj-tag" key={t}>{t}</span>)}
                    </div>
                    <div className="proj-desc">{p.desc}</div>
                  </div>
                  <div className="proj-metric">{p.metric}</div>
                </div>
              </FI>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section">
        <div className="wrap">
          <FI>
            <div className="sec-label"><span className="sec-label-line" />04 — Skills</div>
            <h2 className="sec-title">Technical<br />Proficiency</h2>
          </FI>
          <div className="skills-layout">
            {skillGroups.map((g, gi) => (
              <FI key={g.label} delay={gi * 0.07}>
                <div className="sk-group">
                  <span className="sk-label">{g.label}</span>
                  {g.items.map((s, si) => (
                    <SkillBar key={s.name} name={s.name} pct={s.pct} delay={si * 0.07} />
                  ))}
                </div>
              </FI>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="section">
        <div className="wrap">
          <FI>
            <div className="sec-label"><span className="sec-label-line" />05 — Education & Publications</div>
            <h2 className="sec-title">Academic<br />Background</h2>
          </FI>
          <div className="edu-grid">
            {[
              { school: "DePaul University", deg: "MS Computer Science", yr: "Sep 2023 – Nov 2025" },
              { school: "GITAM University", deg: "BTech Computer Science", yr: "Jun 2018 – Apr 2022" },
            ].map((e, i) => (
              <FI key={e.school} delay={i * 0.06}>
                <div className="edu-card">
                  <div>
                    <div className="edu-school">{e.school}</div>
                    <div className="edu-deg">{e.deg}</div>
                  </div>
                  <div className="edu-yr">{e.yr}</div>
                </div>
              </FI>
            ))}
            <FI delay={0.14}>
              <div className="pub-card">
                <div>
                  <div className="pub-label">Publication</div>
                  <div className="pub-title">Android Malware Detection Using Deep Learning</div>
                  <div className="pub-meta">EasyChair · April 2022</div>
                </div>
                <a
                  href="https://easychair.org/publications/preprint/G5BK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pub-link"
                >
                  View Paper →
                </a>
              </div>
            </FI>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="wrap">
          <FI>
            <div className="sec-label"><span className="sec-label-line" />06 — Contact</div>
          </FI>
          <div className="contact-layout">
            <FI delay={0.06}>
              <div>
                <div className="contact-heading">
                  Let's build<br />something <span>together.</span>
                </div>
                <div className="contact-sub">
                  Open to quantitative analyst roles, systematic research collaborations,
                  and interesting problems at the intersection of mathematics and finance.
                </div>
              </div>
            </FI>
            <FI delay={0.12}>
              <div className="contact-links">
                {[
                  { lbl: "Email", val: "syedshabeebn@gmail.com", href: "mailto:syedshabeebn@gmail.com" },
                  { lbl: "LinkedIn", val: "Syed Shabeeb Nibras", href: "https://linkedin.com/in/syedshabeebnibras" },
                  { lbl: "Publication", val: "EasyChair · 2022", href: "https://easychair.org/publications/preprint/G5BK" },
                ].map(({ lbl, val, href }) => (
                  <a key={lbl} href={href} target="_blank" rel="noopener noreferrer" className="contact-link">
                    <span className="contact-link-lbl">{lbl}</span>
                    <span className="contact-link-val">
                      {val} <span className="contact-arrow">↗</span>
                    </span>
                  </a>
                ))}
              </div>
            </FI>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div className="footer">
          <span className="footer-l">© 2025 Syed Shabeeb Nibras</span>
          <div className="footer-r">
            <div className="footer-dot" />
            Associate Quantitative Analyst
          </div>
        </div>
      </div>
    </>
  );
}
