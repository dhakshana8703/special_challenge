import React from 'react';
import { ShieldCheck, Lock, Database, Cpu, CheckCircle2, Terminal } from 'lucide-react';

export default function TechnologyPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
          SECURITY & ARCHITECTURE
        </span>
        <h1 className="text-4xl font-extrabold text-white">Enterprise AI Architecture & Privacy Foundations</h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          How azentio.ai enforces server-side role-based access control, tenant boundary guarantees, differential privacy, and synthetic sandbox workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            01
          </div>
          <h2 className="text-xl font-bold text-white">IAM-01 & IAM-02 Server-Side Authorization</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Authority is never derived from navigation menus, localStorage tokens, email suffixes alone, or client-supplied tenant IDs. Every API route verifies caller identity, tenant membership, product entitlement, and explicit audience access rules before returning data.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Least-privilege defaults across 7 personas</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Audited privileged actions and state changes</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Client admins cannot elevate platform privileges</li>
          </ul>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold">
            02
          </div>
          <h2 className="text-xl font-bold text-white">Governed Collective Learning & K-Anonymity</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Market observations require explicit author consent before submission. De-identification scrubs proprietary client IDs, accounts, and narrow geography. Shared aggregated themes enforce minimum cohort thresholds (&ge; 3 distinct financial institutions) with small cohort suppression active.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> Synchronous withdrawal with 0s shared index purge</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> Independent moderation redaction workboard</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> Repeated posts never double-counted as evidence</li>
          </ul>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
            03
          </div>
          <h2 className="text-xl font-bold text-white">AIRA Governed AI-Assisted Synthesis</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            AIRA synthesizes insights strictly across approved collective learning contributions, citing verified de-identified sources. Retrieval and summarization do not retrain underlying models, and employee-only prototypes never leak to external or client queries.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Verifiable citation badges and evidence grades</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Instant withdrawal invalidation</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Audience boundary partition</li>
          </ul>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-bold">
            04
          </div>
          <h2 className="text-xl font-bold text-white">Genuine Federated Machine Learning (Track 11)</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Separate client environments train models locally on isolated synthetic datasets and transmit governed weight updates (FedAvg) to the central coordinator. Raw client records never leave the client boundary.
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" /> Differential Privacy Gaussian noise calibration</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" /> L2 gradient clipping (C=1.5) & poisoning detection</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" /> Candidate model registry with human review & rollback</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
