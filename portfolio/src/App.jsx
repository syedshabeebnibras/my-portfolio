import { useState, useEffect, useRef } from "react";

const projects = [
  {
    title: "Optimal Trade Parameter Selection",
    tags: ["Calculus", "Optimization", "Derivatives", "Risk Management"],
    desc: "Applied single-variable calculus to optimize position size, leverage, and stop-loss placement. Built profit models incorporating market impact, execution costs, and risk penalties with full sensitivity analysis.",
    metric: "Full sensitivity analysis",
    github: "https://github.com/syedshabeebnibras/Designing-Optimal-Trade",
  },
  {
    title: "Market Regime Discovery via Geometric Decomposition",
    tags: ["PCA", "SVD", "Linear Algebra", "Clustering"],
    desc: "Improved market regime identification by ~20% using PCA and clustering on equity and multi-asset return data. Evaluated factor exposures, volatility, and drawdown characteristics across environments.",
    metric: "~20% regime stability improvement",
    github: "https://github.com/syedshabeebnibras/Market-Regime-Discovery-via-Geometric-Decomposition",
  },
  {
    title: "Trading Strategy Profitability via Expected Value",
    tags: ["Probability", "Monte Carlo", "Backtesting"],
    desc: "Evaluated 1,000+ historical trades on expected return as the sole profitability criterion. Integrated round-trip transaction costs (~5–10 bps) and ran parameter sweeps on win rate and payoff ratios.",
    metric: "1,000+ trades evaluated",
    github: "https://github.com/syedshabeebnibras/Trading-Strategy-Profitability-via-Expected-Value",
  },
  {
    title: "Portfolio Risk Surface Analysis",
    tags: ["Multivariable Calculus", "Portfolio Theory", "Optimization"],
    desc: "Improved investment decision quality by ~15% via constrained optimization with expected returns, transaction costs, and risk penalties. Documented key performance drivers and failure modes.",
    metric: "~15% decision quality gain",
    github: "https://github.com/syedshabeebnibras/Portfolio-Risk-Surface-Analysis",
  },
  {
    title: "Monte Carlo Option Pricer",
    tags: ["NumPy", "Stochastic Modeling", "Options Pricing"],
    desc: "Improved pricing stability by ~25% via Monte Carlo simulations for derivative values and risk metrics. Vectorized simulations cut runtime ~20%, validated against analytical benchmarks.",
    metric: "~25% pricing stability",
    github: "https://github.com/syedshabeebnibras/Monte-Carlo-Option-Pricer",
  },
];

const skillGroups = [
  { label: "Languages & Libraries", items: [{ name: "Python (NumPy, Pandas)", pct: 95 }, { name: "SQL & ETL Pipelines", pct: 90 }, { name: "C++", pct: 68 }, { name: "Shell / Linux / Git", pct: 78 }] },
  { label: "Quantitative Finance", items: [{ name: "Portfolio Risk & Attribution", pct: 92 }, { name: "Monte Carlo Simulation", pct: 90 }, { name: "Option Pricing", pct: 82 }, { name: "Factor & Regime Analysis", pct: 85 }] },
  { label: "Mathematics", items: [{ name: "Probability & Statistics", pct: 93 }, { name: "Linear Algebra", pct: 90 }, { name: "Multivariable Calculus", pct: 88 }, { name: "Numerical Methods", pct: 83 }] },
  { label: "Investment Analytics", items: [{ name: "Portfolio Construction", pct: 88 }, { name: "Performance Attribution", pct: 90 }, { name: "Backtesting Logic", pct: 85 }, { name: "Systematic Research", pct: 87 }] },
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #fafaf8;
  --surface: #ffffff;
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
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

html { scroll-behavior: smooth; scroll-padding-top: 72px; }
body { background: var(--bg); color: var(--text); font-family: var(--sans); font-weight: 400; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
a { text-decoration: none; color: inherit; }

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--accent-mid); border-radius: 2px; }

/* ── KEYFRAMES ── */
@keyframes fadeUp   { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
@keyframes slideLine{ from { transform:scaleX(0); } to { transform:scaleX(1); } }
@keyframes pulse    { 0%,100%{ transform:scale(1); opacity:1; } 50%{ transform:scale(1.4); opacity:.6; } }
@keyframes float    { 0%,100%{ transform:translateY(0px); } 50%{ transform:translateY(-8px); } }
@keyframes shimmer  { from{ background-position:200% center; } to{ background-position:-200% center; } }
@keyframes countUp  { from{ opacity:0; transform:translateY(12px); } to{ opacity:1; transform:translateY(0); } }

/* ── NAV ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  height: 64px;
  background: rgba(250,250,248,0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 var(--pad);
  animation: fadeIn 0.6s ease both;
}
.nav-brand { display: flex; align-items: center; gap: 12px; }
.nav-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg, #1d4ed8, #3b82f6);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--serif); font-size: 13px; color: #fff; font-weight: 600;
  animation: float 4s ease-in-out infinite;
  box-shadow: 0 4px 12px rgba(29,78,216,0.25);
}
.nav-name { font-family: var(--serif); font-size: 16px; font-weight: 600; }
.nav-links { display: flex; gap: 32px; list-style: none; }
.nav-links a {
  font-size: 12px; font-weight: 500; color: var(--muted);
  letter-spacing: 0.05em; text-transform: uppercase;
  transition: color 0.2s;
  position: relative;
}
.nav-links a::after {
  content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
  height: 1.5px; background: var(--accent);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.2s var(--ease);
}
.nav-links a:hover { color: var(--accent); }
.nav-links a:hover::after { transform: scaleX(1); }
.nav-cta {
  padding: 9px 22px; background: var(--accent); color: #fff;
  font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
  border-radius: 6px;
  transition: transform 0.2s var(--ease), box-shadow 0.2s;
  display: inline-block;
  cursor: pointer;
}
.nav-cta:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(29,78,216,0.3); }

/* ── HERO ── */
.hero {
  min-height: 100vh;
  display: flex; flex-direction: column; justify-content: center;
  padding: 100px var(--pad) 80px;
  max-width: var(--max); margin: 0 auto;
}
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 24px;
  animation: fadeUp 0.7s var(--ease) 0.1s both;
}
.hero-dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--accent);
  animation: pulse 2s ease-in-out infinite;
}
.hero-h1 {
  font-family: var(--serif);
  font-size: clamp(54px, 8vw, 100px);
  font-weight: 700; line-height: 0.95; letter-spacing: -0.025em;
  margin-bottom: 32px; color: var(--text);
  text-transform: uppercase;
  animation: fadeUp 0.8s var(--ease) 0.2s both;
}
.hero-h1 em {
  font-style: italic; color: var(--accent);
  background: linear-gradient(120deg, #1d4ed8, #3b82f6, #1d4ed8);
  background-size: 200% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}
.hero-sub {
  font-size: 16px; font-weight: 400; color: var(--body); line-height: 1.85;
  max-width: 520px; margin-bottom: 44px;
  animation: fadeUp 0.8s var(--ease) 0.3s both;
}
.hero-actions {
  display: flex; gap: 14px; align-items: center; margin-bottom: 72px;
  animation: fadeUp 0.8s var(--ease) 0.4s both;
}
.btn-dark {
  padding: 14px 30px; background: var(--text); color: var(--bg);
  font-size: 13px; font-weight: 600; letter-spacing: 0.03em;
  border-radius: 7px; display: inline-block; cursor: pointer;
  transition: transform 0.2s var(--ease), box-shadow 0.2s;
}
.btn-dark:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(24,24,27,0.2); }
.btn-light {
  padding: 14px 30px; background: transparent; color: var(--body);
  font-size: 13px; font-weight: 500; letter-spacing: 0.03em;
  border: 1.5px solid var(--border2); border-radius: 7px; display: inline-block; cursor: pointer;
  transition: border-color 0.2s, color 0.2s, transform 0.2s var(--ease);
}
.btn-light:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }

.hero-stats {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 1px; background: var(--border);
  border: 1px solid var(--border); border-radius: 12px; overflow: hidden;
  animation: fadeUp 0.8s var(--ease) 0.5s both;
}
.hero-stat {
  background: var(--surface); padding: 24px 28px;
  transition: background 0.2s;
}
.hero-stat:hover { background: var(--accent-bg); }
.hs-num {
  font-family: var(--serif); font-size: 38px; font-weight: 700;
  color: var(--accent); line-height: 1; display: block; margin-bottom: 7px;
  animation: countUp 0.6s var(--ease) 0.8s both;
}
.hs-label { font-size: 12px; font-weight: 500; color: var(--muted); line-height: 1.45; }

/* ── SECTIONS ── */
.section { padding: 100px 0; }
.section + .section { border-top: 1px solid var(--border); }
.wrap { max-width: var(--max); margin: 0 auto; padding: 0 var(--pad); }

.sec-label {
  display: flex; align-items: center; gap: 12px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 12px;
}
.sec-label-line {
  display: inline-block; width: 40px; height: 1.5px;
  background: var(--accent); border-radius: 1px;
  transform-origin: left;
  animation: slideLine 0.6s var(--ease) both;
}
.sec-title {
  font-family: var(--serif); font-size: clamp(34px, 4.5vw, 54px);
  font-weight: 700; line-height: 1.05; letter-spacing: -0.025em;
  margin-bottom: 56px; text-transform: uppercase;
}

/* ── ABOUT ── */
.about-layout { display: grid; grid-template-columns: 1.1fr 1fr; gap: 72px; align-items: start; }
.about-text { font-size: 15px; font-weight: 400; color: var(--body); line-height: 1.95; }
.about-text p + p { margin-top: 18px; }
.about-text strong { color: var(--text); font-weight: 600; }
.about-aside { display: flex; flex-direction: column; gap: 16px; }
.aside-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 24px;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s var(--ease);
}
.aside-card:hover { border-color: var(--accent-mid); box-shadow: 0 4px 20px rgba(29,78,216,0.07); transform: translateY(-2px); }
.aside-card-title {
  font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 14px;
}
.chip-wrap { display: flex; flex-wrap: wrap; gap: 7px; }
.chip {
  font-size: 11px; font-weight: 500; color: var(--body);
  border: 1px solid var(--border); border-radius: 20px;
  padding: 5px 13px; background: var(--bg); cursor: default;
  transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.15s;
}
.chip:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-bg); transform: translateY(-1px); }

/* ── EXPERIENCE ── */
.exp-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 14px; padding: 44px 48px;
  display: grid; grid-template-columns: 200px 1fr; gap: 48px;
  transition: box-shadow 0.2s;
}
.exp-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.06); }
.exp-badge {
  display: inline-block; padding: 5px 12px; border-radius: 5px;
  background: var(--accent-bg); color: var(--accent);
  font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  margin-bottom: 10px;
}
.exp-period { font-size: 12px; font-weight: 500; color: var(--muted); }
.exp-role { font-family: var(--serif); font-size: 26px; font-weight: 700; letter-spacing: -0.015em; margin-bottom: 28px; line-height: 1.2; text-transform: uppercase; }
.exp-items { display: flex; flex-direction: column; gap: 16px; }
.exp-item { display: flex; gap: 14px; font-size: 14px; font-weight: 400; color: var(--body); line-height: 1.8; }
.exp-bullet { flex-shrink: 0; margin-top: 10px; width: 6px; height: 6px; border-radius: 50%; background: var(--accent-mid); }
.exp-item mark { background: none; color: var(--accent); font-weight: 600; }

/* ── PROJECTS ── */
.proj-grid { display: flex; flex-direction: column; gap: 14px; }
.proj-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 30px 34px;
  display: grid; grid-template-columns: 56px 1fr auto;
  gap: 20px; align-items: start;
  transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s var(--ease);
  cursor: default;
}
.proj-card:hover { border-color: var(--accent-mid); box-shadow: 0 6px 28px rgba(29,78,216,0.08); transform: translateY(-3px); }
.proj-num { font-family: var(--serif); font-size: 30px; font-weight: 700; color: var(--dim); line-height: 1; padding-top: 4px; transition: color 0.2s; }
.proj-card:hover .proj-num { color: var(--accent-mid); }
.proj-title { font-family: var(--serif); font-size: 20px; font-weight: 700; letter-spacing: -0.015em; margin-bottom: 9px; line-height: 1.2; transition: color 0.2s; text-transform: uppercase; }
.proj-card:hover .proj-title { color: var(--accent); }
.proj-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 11px; }
.proj-tag {
  font-size: 10px; font-weight: 600; color: var(--muted);
  letter-spacing: 0.07em; text-transform: uppercase;
  padding: 3px 10px; border: 1px solid var(--border); border-radius: 4px;
  transition: border-color 0.2s, color 0.2s;
}
.proj-card:hover .proj-tag { border-color: var(--accent-mid); color: var(--accent); }
.proj-desc { font-size: 13px; font-weight: 400; color: var(--body); line-height: 1.8; margin-bottom: 14px; }
.proj-github {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 12px; font-weight: 600; color: var(--accent);
  border: 1.5px solid var(--accent-mid); border-radius: 7px;
  padding: 8px 16px; background: var(--accent-bg);
  transition: background 0.2s, border-color 0.2s, transform 0.2s var(--ease), box-shadow 0.2s;
  cursor: pointer; text-decoration: none;
}
.proj-github:hover { background: var(--accent); color: #fff; border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 4px 14px rgba(29,78,216,0.25); }
.proj-metric {
  font-size: 11px; font-weight: 600; color: var(--accent);
  background: var(--accent-bg); padding: 5px 12px; border-radius: 5px;
  white-space: nowrap; align-self: start; border: 1px solid var(--accent-mid);
}

/* ── SKILLS ── */
.skills-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.sk-group {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 28px 28px 20px;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s var(--ease);
}
.sk-group:hover { border-color: var(--accent-mid); box-shadow: 0 4px 20px rgba(29,78,216,0.06); transform: translateY(-2px); }
.sk-label { font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 20px; display: block; }
.sk-item { margin-bottom: 16px; }
.sk-item:last-child { margin-bottom: 0; }
.sk-row { display: flex; justify-content: space-between; margin-bottom: 7px; }
.sk-name { font-size: 13px; font-weight: 500; color: var(--body); }
.sk-pct { font-size: 11px; font-weight: 600; color: var(--accent); }
.sk-track { height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
.sk-fill {
  height: 100%;
  background: linear-gradient(90deg, #1d4ed8 0%, #60a5fa 100%);
  border-radius: 2px;
  transform: scaleX(0); transform-origin: left;
  transition: transform 1s var(--ease);
}
.sk-fill.anim { transform: scaleX(1); }

/* ── EDUCATION ── */
.edu-grid { display: flex; flex-direction: column; gap: 12px; }
.edu-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 28px 34px;
  display: flex; justify-content: space-between; align-items: center; gap: 24px;
  transition: border-color 0.2s, transform 0.2s var(--ease), box-shadow 0.2s;
}
.edu-card:hover { border-color: var(--accent-mid); transform: translateX(4px); box-shadow: 0 4px 20px rgba(29,78,216,0.06); }
.edu-school { font-family: var(--serif); font-size: 21px; font-weight: 700; letter-spacing: -0.015em; margin-bottom: 4px; text-transform: uppercase; }
.edu-deg { font-size: 13px; font-weight: 400; color: var(--body); }
.edu-yr { font-size: 12px; font-weight: 500; color: var(--muted); white-space: nowrap; text-align: right; }
.pub-card {
  margin-top: 12px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1.5px solid var(--accent-mid);
  border-radius: 12px; padding: 28px 34px;
  display: flex; justify-content: space-between; align-items: center; gap: 24px;
  transition: transform 0.2s var(--ease), box-shadow 0.2s;
}
.pub-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(29,78,216,0.12); }
.pub-label { font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); margin-bottom: 7px; }
.pub-title { font-family: var(--serif); font-size: 18px; font-weight: 700; margin-bottom: 4px; text-transform: uppercase; }
.pub-meta { font-size: 12px; font-weight: 400; color: var(--body); }
.pub-link {
  flex-shrink: 0; padding: 11px 22px;
  background: var(--accent); color: #fff;
  font-size: 12px; font-weight: 600; border-radius: 7px; cursor: pointer;
  display: inline-block; text-decoration: none;
  transition: transform 0.2s var(--ease), box-shadow 0.2s;
}
.pub-link:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(29,78,216,0.3); }

/* ── CONTACT ── */
.contact-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
.contact-heading { font-family: var(--serif); font-size: clamp(36px, 5vw, 56px); font-weight: 700; line-height: 1.1; letter-spacing: -0.025em; margin-bottom: 18px; text-transform: uppercase; }
.contact-heading span { color: var(--accent); font-style: italic; }
.contact-sub { font-size: 14px; font-weight: 400; color: var(--body); line-height: 1.85; }
.contact-links { display: flex; flex-direction: column; }
.contact-link {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 0; border-bottom: 1px solid var(--border);
  cursor: pointer; text-decoration: none;
  transition: padding-left 0.2s var(--ease);
}
.contact-link:first-child { border-top: 1px solid var(--border); }
.contact-link:hover { padding-left: 6px; }
.contact-link-lbl { font-size: 10px; font-weight: 600; color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase; }
.contact-link-val { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; color: var(--text); transition: color 0.2s; }
.contact-link:hover .contact-link-val { color: var(--accent); }
.contact-arrow { font-size: 16px; display: inline-block; transition: transform 0.2s var(--ease); }
.contact-link:hover .contact-arrow { transform: translate(3px, -3px); }

/* ── FOOTER ── */
.footer-wrap { border-top: 1px solid var(--border); }
.footer { max-width: var(--max); margin: 0 auto; padding: 28px var(--pad); display: flex; justify-content: space-between; align-items: center; }
.footer-l { font-size: 13px; font-weight: 400; color: var(--muted); }
.footer-r { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); font-weight: 400; }
.footer-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); animation: pulse 2.5s ease-in-out infinite; }

/* ── FADE-IN ── */
.fi {
  opacity: 0; transform: translateY(24px);
  transition: opacity 0.65s var(--ease), transform 0.65s var(--ease);
  /* CRITICAL FIX: pointer-events must stay active */
  pointer-events: auto;
}
.fi.v { opacity: 1; transform: none; }
/* ensure links inside .fi always work */
.fi a, .fi button { pointer-events: auto; }

/* ── RESPONSIVE ── */
@media (max-width: 820px) {
  :root { --pad: 24px; }
  .nav-links, .nav-cta { display: none; }
  .about-layout, .exp-card, .skills-layout, .contact-layout { grid-template-columns: 1fr; gap: 28px; }
  .proj-card { grid-template-columns: 44px 1fr; }
  .proj-metric { display: none; }
  .edu-card, .pub-card { flex-direction: column; align-items: flex-start; }
  .hero-stats { grid-template-columns: 1fr; }
  .hero { min-height: auto; padding-top: 96px; }
  .footer { flex-direction: column; gap: 8px; text-align: center; }
}
`;

function useFI(threshold = 0.1) {
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
  const [ref, vis] = useFI();
  return (
    <div
      ref={ref}
      className={`fi ${vis ? "v" : ""}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

function SkillBar({ name, pct, delay = 0 }) {
  const [ref, vis] = useFI(0.2);
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

const GH = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);

export default function Portfolio() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

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
          {["About","Experience","Projects","Skills","Contact"].map(l => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} onClick={e => { e.preventDefault(); scrollTo(l.toLowerCase()); }}>{l}</a>
            </li>
          ))}
        </ul>
        <a href="mailto:syedshabeebn@gmail.com" className="nav-cta">Hire Me</a>
      </nav>

      {/* HERO */}
      <div style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="hero">
          <div className="hero-eyebrow">
            <span className="hero-dot" />
            Associate Quantitative Analyst
          </div>
          <h1 className="hero-h1">
            Syed Shabeeb<br /><em>Nibras</em>
          </h1>
          <p className="hero-sub">
            Quantitative analyst specializing in portfolio risk, factor exposure analysis,
            and systematic investment research — turning complex models into decisions that move the needle.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn-dark" onClick={e => { e.preventDefault(); scrollTo("projects"); }}>View Projects</a>
            <a href="#contact" className="btn-light" onClick={e => { e.preventDefault(); scrollTo("contact"); }}>Get in Touch</a>
          </div>
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
            <FI delay={0.07}>
              <div className="about-text">
                <p>I'm a quantitative analyst with a strong foundation in <strong>portfolio analytics, investment research, and data-driven decision support</strong>. Experienced in statistical analysis, optimization, and systematic research to assess portfolio risk and performance attribution.</p>
                <p>At <strong>Wipro</strong>, I developed Python and SQL pipelines that improved analytical reliability by ~25%, optimized ETL workflows to cut time-to-insight by ~20%, and compressed multi-day root-cause cycles to under a day.</p>
                <p>Currently completing an <strong>MS in Computer Science at DePaul University</strong>, building on a BTech from GITAM and a published paper in deep learning security research.</p>
              </div>
            </FI>
            <FI delay={0.14}>
              <div className="about-aside">
                <div className="aside-card">
                  <div className="aside-card-title">Core Technologies</div>
                  <div className="chip-wrap">
                    {["Python","NumPy","Pandas","SQL","C++","Linux","Git"].map(s => <span className="chip" key={s}>{s}</span>)}
                  </div>
                </div>
                <div className="aside-card">
                  <div className="aside-card-title">Domain Expertise</div>
                  <div className="chip-wrap">
                    {["Monte Carlo","PCA / SVD","Portfolio Theory","Factor Analysis","Options Pricing","ETL Pipelines","Backtesting"].map(s => <span className="chip" key={s}>{s}</span>)}
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
          <FI delay={0.09}>
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
                    ["< 1 day", "Enhanced stakeholder decision-making by translating complex quantitative outputs into clear summaries on portfolio risk sensitivities and performance drivers."],
                  ].map(([metric, text]) => (
                    <div className="exp-item" key={metric}>
                      <div className="exp-bullet" />
                      <span><mark>{metric} impact</mark> — {text}</span>
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
              <FI key={p.title} delay={i * 0.07}>
                <div className="proj-card">
                  <div className="proj-num">{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <div className="proj-title">{p.title}</div>
                    <div className="proj-tags">
                      {p.tags.map(t => <span className="proj-tag" key={t}>{t}</span>)}
                    </div>
                    <div className="proj-desc">{p.desc}</div>
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proj-github"
                      onClick={e => e.stopPropagation()}
                    >
                      <GH /> View on GitHub
                    </a>
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
              <FI key={g.label} delay={gi * 0.08}>
                <div className="sk-group">
                  <span className="sk-label">{g.label}</span>
                  {g.items.map((s, si) => (
                    <SkillBar key={s.name} name={s.name} pct={s.pct} delay={si * 0.08} />
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
              <FI key={e.school} delay={i * 0.07}>
                <div className="edu-card">
                  <div>
                    <div className="edu-school">{e.school}</div>
                    <div className="edu-deg">{e.deg}</div>
                  </div>
                  <div className="edu-yr">{e.yr}</div>
                </div>
              </FI>
            ))}
            <FI delay={0.15}>
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
            <FI delay={0.07}>
              <div>
                <div className="contact-heading">Let's build<br />something <span>together.</span></div>
                <div className="contact-sub">Open to quantitative analyst roles, systematic research collaborations, and interesting problems at the intersection of mathematics and finance.</div>
              </div>
            </FI>
            <FI delay={0.14}>
              <div className="contact-links">
                {[
                  { lbl: "Email",       val: "syedshabeebn@gmail.com",  href: "mailto:syedshabeebn@gmail.com" },
                  { lbl: "LinkedIn",    val: "Syed Shabeeb Nibras",     href: "https://www.linkedin.com/in/syed-shabeeb/" },
                  { lbl: "Publication", val: "EasyChair · 2022",        href: "https://easychair.org/publications/preprint/G5BK" },
                ].map(({ lbl, val, href }) => (
                  <a key={lbl} href={href} target="_blank" rel="noopener noreferrer" className="contact-link">
                    <span className="contact-link-lbl">{lbl}</span>
                    <span className="contact-link-val">{val} <span className="contact-arrow">↗</span></span>
                  </a>
                ))}
              </div>
            </FI>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="footer-wrap">
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
