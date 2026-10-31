'use client';

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Sparkles, 
  Radio, 
  Lightbulb, 
  FileText, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Clock, 
  UserCheck 
} from 'lucide-react';

export default function EmployeePortalPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setCurrentUser(data.user);
        setLoading(false);
      });
  }, []);

  const isEmployee = currentUser?.roles?.includes('employee') || currentUser?.persona === 'employee' || currentUser?.persona === 'portal_admin';

  if (!isEmployee && !loading) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
        <Lock className="w-12 h-12 text-purple-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Azentio Verified Employee Access Required</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          IAM Boundary Enforced (IAM-01): Internal prototypes, employee broadcasts, and improvement idea backlogs are restricted to verified @azentio.com identities. Switch to Priya Sharma or Marcus Vance via the top demo switcher.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border border-purple-800/40 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Azentio Internal Innovation Hub
              </span>
              <span className="text-xs text-slate-400">Section 05 Acceptance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Employee Dashboard & Research Workspace
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Signed in as <strong className="text-white">{currentUser?.name}</strong> ({currentUser?.department || 'Platform'}). Internal sessions, prototype feedback loops, and PO improvement loop controls.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/portal/employee/playground"
              className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/25 transition"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch AI Playground</span>
            </a>

            <a
              href="/portal/employee/ideas"
              className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Improvement Ideas Loop</span>
            </a>
          </div>
        </div>

        {/* Boundary Notice */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>
            <strong>Confidentiality Isolation:</strong> Employee experiment submissions, sprint backlogs, and internal prototype notes never enter public/client search or AIRA responses.
          </span>
          <span className="text-purple-400 font-medium whitespace-nowrap ml-4">Audited Identity</span>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase">Interactive Testing</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">Synthetic</span>
          </div>
          <h3 className="text-lg font-bold text-white">Employee Guided Playground</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Run synthetic scenarios, inspect model weights, verify explainability traces, and submit structured evaluation feedback on active prototypes.
          </p>
          <div className="pt-2">
            <a
              href="/portal/employee/playground"
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>Open Playground</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase">Product Owner Loop</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">Audited</span>
          </div>
          <h3 className="text-lg font-bold text-white">Improvement Ideas Manager</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Connect approved collective learning themes into structured improvement tickets. Update plain-language statuses for client visibility without leaking roadmaps.
          </p>
          <div className="pt-2">
            <a
              href="/portal/employee/ideas"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Manage Ideas & Loop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 uppercase">Internal Media</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">Employee Only</span>
          </div>
          <h3 className="text-lg font-bold text-white">Internal Broadcasts & Townhalls</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Access confidential employee-only engineering townhalls, architecture deep-dives, and publishing management tools.
          </p>
          <div className="pt-2">
            <a
              href="/live"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>View Sessions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Internal Knowledge Library & Experiments (Hackathon Page 6) */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          Active Experiments & Internal Knowledge Base
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300">
                Transformer Sparse Attention for 10-K Balance Sheet Ingestion
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                Active Prototype
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Squad: AI Research & Core NLP • Lead: Dr. Marcus Vance • Review Date: 2026-11-15
            </p>
            <p className="text-[11px] text-slate-300">
              Cuts hallucination rate in commercial credit memo generation by 68% over dense tabular accounts.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300">
                Differential Privacy Noise Calibration for Cross-Border Risk Benchmarks
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                In Peer Review
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Squad: AI Governance & Trust • Lead: Aisha Al-Mansoor • Review Date: 2026-11-20
            </p>
            <p className="text-[11px] text-slate-300">
              Guarantees epsilon=1.25, delta=1e-5 mathematical bounds for multi-tenant risk quantile sharing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
