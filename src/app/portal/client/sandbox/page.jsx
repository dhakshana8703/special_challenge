'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  FileCheck,
  Building2,
  Lock
} from 'lucide-react';

export default function ClientSandboxPage() {
  const [businessType, setBusinessType] = useState('Retail Wholesale SME');
  const [loanAmount, setLoanAmount] = useState(350000);
  const [annualRevenue, setAnnualRevenue] = useState(1400000);
  const [seasonalityFactor, setSeasonalityFactor] = useState(1.45);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const res = await fetch('/api/sandbox/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType,
          loanAmount,
          annualRevenue,
          seasonalityFactor
        })
      });
      const data = await res.json();
      setSimResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Sandbox Banner & Legal Disclaimer */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-300 uppercase tracking-wider">
            Synthetic Sandbox Environment • Explicit Disclaimer (Section 06)
          </div>
          <div className="leading-relaxed">
            This demonstration runs exclusively on synthetic client scenarios. Recommendations simulated below do NOT constitute an approved credit, lending, or regulatory decision. Runs and evidence are isolated by tenant membership.
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
              Entitled Product Sandbox
            </span>
            <span className="text-xs text-slate-400">Financial Analysis Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-2">
            Dynamic SME Underwriting & Seasonality Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Test how seasonality decomposition addresses false-positive risk warnings for cyclical retail, agribusiness, and tourism borrowers.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={simulating}
          className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition disabled:opacity-50 self-start sm:self-auto"
        >
          {simulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-slate-950" />}
          <span>Run Sandbox Simulation</span>
        </button>
      </div>

      {/* Simulator Inputs & Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase">Sector Category</label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
          >
            <option value="Retail Wholesale SME">Retail Wholesale & Stock Buildup</option>
            <option value="Agri-Business & Seeding">Agri-Business & Pre-Harvest Seeding</option>
            <option value="Hospitality & Destination Logistics">Tourism & Hospitality Off-Season</option>
          </select>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase">Requested Facility ($)</label>
          <input
            type="number"
            step="10000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase">Annual Revenue ($)</label>
          <input
            type="number"
            step="50000"
            value={annualRevenue}
            onChange={(e) => setAnnualRevenue(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase">
            Cyclical Fluctuation ({seasonalityFactor}x)
          </label>
          <input
            type="range"
            min="1.0"
            max="2.0"
            step="0.05"
            value={seasonalityFactor}
            onChange={(e) => setSeasonalityFactor(e.target.value)}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="text-[10px] text-slate-500 flex justify-between">
            <span>Flat (1.0x)</span>
            <span>Extreme (2.0x)</span>
          </div>
        </div>
      </div>

      {/* Simulation Result Comparison (Baseline Static vs Seasonality-Aware) */}
      {simResult && (
        <div className="space-y-6 pt-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Side-by-Side Model Underwriting Decision Comparison
            </h2>
            <span className="text-[11px] text-emerald-400 font-medium">
              Simulation ID: {simResult.simulationId}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Standard Static Model */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Baseline Static Model v1.0
                </span>
                {simResult.comparisonOutputs.standardStaticModel.recommendation.includes('APPROVE') ? (
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> High Risk / Declined
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-3xl font-extrabold text-white">
                  DSCR: {simResult.comparisonOutputs.standardStaticModel.computedDSCR}
                  <span className="text-xs text-slate-500 font-normal ml-2">
                    (Threshold: {simResult.comparisonOutputs.standardStaticModel.thresholdRequired})
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {simResult.comparisonOutputs.standardStaticModel.reasoning}
                </p>
              </div>

              {simResult.comparisonOutputs.standardStaticModel.falsePositiveFlag && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/40 text-[11px] text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span><strong>Systemic Distortion Detected:</strong> Seasonal inventory peak penalized as structural debt exhaustion.</span>
                </div>
              )}
            </div>

            {/* Seasonality-Aware Model (Candidate v1.2) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-900 border border-emerald-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Seasonality-Aware Model (Candidate v1.2)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                    Collective Improvement
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500 text-slate-950 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved with Seasonal Covenant
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-3xl font-extrabold text-emerald-400">
                  DSCR: {simResult.comparisonOutputs.seasonalityAwareModel.computedDSCR}
                  <span className="text-xs text-slate-400 font-normal ml-2">
                    ({simResult.comparisonOutputs.seasonalityAwareModel.improvementDelta})
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {simResult.comparisonOutputs.seasonalityAwareModel.reasoning}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Incorporates multi-year cyclical cash-flow smoothing verified across 3 partner banking cohorts.</span>
              </div>
            </div>
          </div>

          {/* Evidence Trace Steps */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              Automated Reasoning & Evidence Audit Trace
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {simResult.evidenceTrace.map((tr, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="font-semibold text-white">{tr.step}</div>
                  <div className="text-[11px] text-slate-400">{tr.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
