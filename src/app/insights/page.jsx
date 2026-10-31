import React from 'react';
import { TrendingUp, ArrowRight, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export default function InsightsPage() {
  const articles = [
    {
      title: "Why Discussion Boards and Central Repositories Are Not Federated Machine Learning",
      tagline: "Distinguishing genuine privacy-preserving federated aggregation from centralized document repositories.",
      category: "Architectural Principles",
      readTime: "6 min read",
      author: "Dr. Marcus Vance (AI Lead)",
      date: "October 24, 2026",
      summary: "Under Section 02 of the Azentio specification, genuine federated machine learning requires that raw client training records remain 100% local, transmitting only bounded weight updates to an opt-in coordinator. Centralizing raw data into a shared database defeats the cryptographic and legal premise of federated learning."
    },
    {
      title: "Mitigating False-Positive Risk in SME Credit Underwriting Across Cyclical Seasons",
      tagline: "Empirical findings from the collective learning hub across retail, agri-business, and hospitality.",
      category: "Lending Science",
      readTime: "8 min read",
      author: "Priya Sharma (Senior Product Specialist)",
      date: "October 20, 2026",
      summary: "Traditional trailing-twelve-month underwriting algorithms misdiagnose routine pre-season inventory purchases as acute balance-sheet leverage. How 3 distinct partner banks provided de-identified evidence to establish a multi-year seasonal decomposition model."
    },
    {
      title: "Mathematical Differential Privacy & Differencing Safeguards in Multi-Tenant Analytics",
      tagline: "Preventing reconstruction and cohort re-identification with k-anonymity and Gaussian noise.",
      category: "AI Governance & Ethics",
      readTime: "7 min read",
      author: "Aisha Al-Mansoor (Governance & Trust Lead)",
      date: "October 16, 2026",
      summary: "Why a simple minimum cohort size (k >= 3) is a necessary baseline but not an absolute guarantee against differencing attacks. We outline our suppression policies, bounded L2 gradient clipping, and epsilon-delta accounting."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30 uppercase">
          PERSPECTIVES & WHITE PAPERS
        </span>
        <h1 className="text-4xl font-extrabold text-white">Ideas Worth Exploring. Perspectives Worth Sharing.</h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Deep-dives into applied AI, algorithmic credit governance, and secure collaborative intelligence for enterprise banking leaders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-bold text-emerald-400 uppercase tracking-wider">{art.category}</span>
                <span>{art.readTime}</span>
              </div>
              <h2 className="text-lg font-bold text-white leading-snug">{art.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{art.summary}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>{art.author}</span>
              <span className="text-[10px] text-slate-500">{art.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
