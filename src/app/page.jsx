import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Terminal, 
  Database, 
  Compass, 
  Lock, 
  Users, 
  TrendingUp, 
  Cpu, 
  Radio, 
  CheckCircle2, 
  FileCheck,
  ChevronRight,
  GitBranch
} from 'lucide-react';

export default function HomePage() {
  const products = [
    {
      slug: "sme-credit-decisioning",
      name: "SME Credit Decisioning",
      category: "Lending & Underwriting",
      tagline: "Autonomous multi-factor underwriting for commercial small-and-medium enterprise facilities.",
      badge: "Flagship"
    },
    {
      slug: "credit-strategy-simulator",
      name: "Credit Strategy Simulator",
      category: "Risk Optimization",
      tagline: "Stress-test policy adjustments, macroeconomic shocks, and cutoff calibrations.",
      badge: "Interactive"
    },
    {
      slug: "riva",
      name: "RIVA - Conversational Financial Copilot",
      category: "Generative AI Banking",
      tagline: "Enterprise-grade conversational banking agent powered by governed financial reasoning.",
      badge: "AIRA Powered"
    },
    {
      slug: "similar-portfolio-intelligence",
      name: "Similar Portfolio Intelligence",
      category: "Market Benchmarking",
      tagline: "De-identified peer cohort comparisons across regional corporate portfolios.",
      badge: "Differentially Private"
    },
    {
      slug: "persona-newsroom",
      name: "Persona Newsroom & Market Sentinel",
      category: "Market Intelligence",
      tagline: "Hyper-curated executive market briefings and regulatory change detection.",
      badge: "Real-time"
    }
  ];

  const personasWalkthrough = [
    {
      title: "1. Public Visitor",
      desc: "Explore public catalogue, read AI perspectives, register for Azentio Hackathon, and request guided enterprise demos.",
      badge: "Zero Auth",
      link: "/products"
    },
    {
      title: "2. Client Member",
      desc: "Sign in to isolated tenant workspace (Apex Bank, Meridian Trust), run entitled sandboxes, and submit market observations.",
      badge: "Multi-Tenant",
      link: "/portal/client"
    },
    {
      title: "3. Learning Moderator",
      desc: "Review submitted client observations, redact sensitive figures, verify evidence grade, and publish de-identified representations.",
      badge: "Governance",
      link: "/portal/moderation"
    },
    {
      title: "4. Product Owner",
      desc: "Connect recurring approved themes into structured Improvement Ideas for Azentio offerings and update progress.",
      badge: "Loop Closure",
      link: "/portal/employee/ideas"
    },
    {
      title: "5. Federated Coordinator",
      desc: "Run opt-in federated rounds across 3 isolated client datasets with differential privacy and poisoning checks.",
      badge: "Advanced Track",
      link: "/portal/federated"
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-teal-500/10 blur-[100px] pointer-events-none rounded-full"></div>

        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          {/* Tag badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AZENTIO.AI HACKATHON PLATFORM • v1.0</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Build intelligence. <br />
            <span className="gradient-text">Create shared value.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Public discovery. Employee innovation. Client collaboration. Governed collective learning that continuously turns real market feedback into better offerings.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold">
            <a
              href="/portal/learning"
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-2 shadow-xl shadow-emerald-500/25 transition transform hover:-translate-y-0.5"
            >
              <span>Explore Collective Learning Hub</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="/portal/client"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition"
            >
              <span>Launch Client Workspace</span>
              <Layers className="w-4 h-4 text-teal-400" />
            </a>

            <a
              href="/portal/employee/playground"
              className="px-6 py-3.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 border border-purple-800/50 flex items-center gap-2 transition"
            >
              <span>Employee AI Playground</span>
              <Terminal className="w-4 h-4 text-purple-400" />
            </a>
          </div>

          {/* Quick Notice */}
          <div className="pt-2 text-xs text-slate-500 flex items-center justify-center gap-6">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Server-side IAM Enforced</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-teal-400" /> Strict Multi-Tenant Isolation</span>
            <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-purple-400" /> Zero Raw Client Data Retention</span>
          </div>
        </div>
      </section>

      {/* Illustrative End-to-End Scenario Banner (From Page 11 of PDF) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                  Featured Scenario • SME Seasonality Loop
                </span>
                <span className="text-xs text-slate-400">Section 10 Acceptance Test</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                How 3 Banks Turn SME Seasonal Cash Flow Challenges into a Better AI Underwriting Model
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Apex Global Bank, Meridian Trust, and Gulf Financial Corporation separately observed that seasonal inventory spikes in retail, agri-business, and hospitality trigger false credit alerts. See how moderation redacted details, grouped them into a theme (&ge;3 orgs), and inspired a seasonality-aware model.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/portal/learning"
                className="px-5 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition"
              >
                Inspect Seasonality Theme
              </a>
              <a
                href="/portal/employee/ideas"
                className="px-5 py-2.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium text-xs hover:bg-slate-700 transition"
              >
                View Improvement Idea
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Applied AI Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Enterprise Catalog</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Azentio Applied AI Solutions</h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Production-grade decisioning engines tested with synthetic sandbox datasets and strict governance boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">{p.category}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                    {p.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {p.tagline}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                <a
                  href={`/products/${p.slug}`}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition"
                >
                  <span>Explore Architecture</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="/connect"
                  className="text-slate-400 hover:text-white transition"
                >
                  Request Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Personas & Access Boundaries (Section 03 Acceptance Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Role-Based Experiences</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">7 Distinct Personas. Zero Unauthorized Leakage.</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Switch between personas using the top demo bar to verify that server-side RBAC, tenant isolation, and audience controls are strictly enforced.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {personasWalkthrough.map((p, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/90 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{p.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{p.badge}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
              <a
                href={p.link}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-2"
              >
                <span>Launch Experience</span>
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Live Broadcasts & Perspectives Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Live Section */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Azentio.ai LIVE</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Conversations Where Intelligence Comes Alive.</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Executive webinars, client briefings, and employee internal townhalls. Access is strictly audience-filtered by IAM permissions.
            </p>
            <div className="pt-2">
              <a
                href="/live"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                <span>Browse Live Broadcasts & Recordings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Insights Section */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">PERSPECTIVES & RESEARCH</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Ideas Worth Exploring. Perspectives Worth Sharing.</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Read whitepapers on differential privacy, credit cycle volatility, and why discussion boards do not constitute federated machine learning.
            </p>
            <div className="pt-2">
              <a
                href="/insights"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                <span>Read Perspectives & Whitepapers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Track 11: Federated Model Learning Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-slate-900/70 border border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 uppercase">
                Advanced Track 11 / P2
              </span>
              <span className="text-xs text-slate-400">Opt-in Machine Learning Consortium</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Genuine Federated Training Simulator with Differential Privacy & Holdout Evaluation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore local training on 3 isolated synthetic bank datasets, coordinator aggregation (FedAvg), poisoning / dropout stress testing, and explicit candidate model rollback controls.
            </p>
          </div>

          <a
            href="/portal/federated"
            className="whitespace-nowrap px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/20 transition"
          >
            <span>Launch Federated Simulator</span>
            <Database className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
