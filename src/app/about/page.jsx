import React from 'react';
import { Sparkles, Building2, ShieldCheck, Globe, Trophy } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
          ABOUT AZENTIO.AI
        </span>
        <h1 className="text-4xl font-extrabold text-white">Build Intelligence. Create Shared Value.</h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Pioneering applied AI platforms, algorithmic decisioning, and governed multi-tenant collaboration across global banking ecosystems.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-2xl font-bold text-white">Our Mission & Hackathon Context</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Azentio Software provides specialized mission-critical software products for financial institutions, Islamic banks, and insurance providers across Asia Pacific, Middle East, and Africa.
        </p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          This platform was built to satisfy the <strong>Azentio Hackathon Build Requirements v1.0</strong>, delivering an end-to-end enterprise website and intelligent collaboration portal. It showcases how real client market observations are transformed through governed collective learning into tangible product improvements—while ensuring zero unauthorized exposure of proprietary client data.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
          <div className="text-3xl font-extrabold text-emerald-400">1,000+</div>
          <div className="text-xs text-slate-300 font-semibold">Financial Institutions</div>
          <p className="text-[11px] text-slate-500">Across emerging and established global financial corridors.</p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
          <div className="text-3xl font-extrabold text-teal-400">7 Personas</div>
          <div className="text-xs text-slate-300 font-semibold">Governed Access Boundaries</div>
          <p className="text-[11px] text-slate-500">Strict server-side RBAC and audience separation.</p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
          <div className="text-3xl font-extrabold text-purple-400">0s Latency</div>
          <div className="text-xs text-slate-300 font-semibold">Synchronous Withdrawal</div>
          <p className="text-[11px] text-slate-500">Instant purge from shared search, themes, and AIRA retrieval.</p>
        </div>
      </div>
    </div>
  );
}
