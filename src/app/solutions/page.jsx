import React from 'react';
import { Layers, ShieldCheck, Building2, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';

export default function SolutionsPage() {
  const solutions = [
    {
      title: "Corporate & Commercial SME Lending",
      tagline: "Autonomous underwriting and dynamic credit envelope optimization.",
      description: "Transform complex commercial loan origination with multi-source synthetic statement ingestion, cash-flow seasonality smoothing, and explainable credit memos for underwriting committees.",
      products: ["SME Credit Decisioning", "Credit Strategy Simulator", "Financial Analysis Intelligence"]
    },
    {
      title: "Islamic Banking & Sharia-Compliant Governance",
      tagline: "Algorithmic Murabaha, Ijara, and Mudaraba asset verification.",
      description: "Ensure complete adherence to Sharia contract covenants, profit-sharing ratio calibrations, and automated audit trails tailored to GCC and Southeast Asian Islamic financial jurisdictions.",
      products: ["Islamic Banking Core Assistant", "RIVA Financial Copilot"]
    },
    {
      title: "Enterprise Risk & Capital Optimization",
      tagline: "Macroeconomic stress testing and capital allocation simulations.",
      description: "Simulate interest rate shocks, tariff fluctuations, and liquidity contractions with real-time Monte Carlo scenario modeling and synthetic peer benchmarks.",
      products: ["Credit Strategy Simulator", "Similar Portfolio Intelligence"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
          INDUSTRY SOLUTIONS
        </span>
        <h1 className="text-4xl font-extrabold text-white">Applied Intelligence Across Financial Segments</h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Engineered to fit existing commercial credit processes with zero infrastructure overhaul and rigorous regulatory compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {solutions.map((sol, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Enterprise Solution</span>
              <h2 className="text-xl font-bold text-white">{sol.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{sol.description}</p>

              <div className="pt-2 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-500">Integrated Products:</div>
                <div className="flex flex-wrap gap-1.5">
                  {sol.products.map((p, pi) => (
                    <span key={pi} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <a href="/portal/client/sandbox" className="text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-1">
                <span>Test in Sandbox</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
              <a href="/connect" className="text-slate-400 hover:text-white">
                Request Briefing
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
