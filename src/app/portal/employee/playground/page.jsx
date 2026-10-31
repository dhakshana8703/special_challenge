'use client';

import React, { useState } from 'react';
import { 
  Terminal, 
  Sparkles, 
  ShieldAlert, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Send, 
  MessageSquare,
  FileCheck,
  Cpu
} from 'lucide-react';

export default function EmployeePlaygroundPage() {
  const [offering, setOffering] = useState('Financial Analysis Intelligence');
  const [modelMode, setModelMode] = useState('ai_assisted'); // 'deterministic' | 'ai_assisted'
  const [scenario, setScenario] = useState('sme_seasonality');
  const [feedbackRating, setFeedbackRating] = useState('High');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [runOutput, setRunOutput] = useState(null);

  const runSimulation = () => {
    setExecuting(true);
    setTimeout(() => {
      setRunOutput({
        runId: `run_${Date.now()}`,
        mode: modelMode,
        offering,
        evidenceTrace: [
          "Synthetic Cash Flow Stream: [Q1: +$45k, Q2: +$60k, Q3: -$120k (Inventory Build), Q4: -$85k, Q1_next: +$180k]",
          "Deterministic Rule 14-B: Unadjusted 12-month trailing coverage triggered leverage alert (DSCR 0.88 < 1.25)",
          "AI-Assisted Seasonality Layer (Candidate v1.2): Cyclical decomposition applied with 36-month retail baseline. Q1 receivables realization recognized. Normalized DSCR: 1.48 (Low default probability).",
          "Explainability Log: 0.94 cosine similarity with historical retail cohort trends."
        ],
        simulatedRecommendation: "CONDITIONAL APPROVAL: Seasonal Working Capital Line with March Inventory Receivables Sweeping Covenant.",
        confidenceScore: "94.2%",
        syntheticDisclaimer: "SIMULATED OUTPUT ONLY - SYNTHETIC DATASET • NOT AN ACTUAL CREDIT OR BUSINESS DECISION"
      });
      setExecuting(false);
    }, 600);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackNotes('');
      alert("Structured feedback logged to internal squad sprint backlog.");
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Explicit Watermark Disclaimer (Section 05) */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>
            <strong>SYNTHETIC SANDBOX DATA:</strong> All scenario inputs and simulated recommendations are synthetic. Do not imply or represent that a sandbox recommendation is an approved credit or business decision.
          </span>
        </div>
        <span className="font-mono text-[10px] text-amber-400/80 uppercase">Employee Sandbox v2.0</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Guided Employee Playground
            </span>
            <span className="text-xs text-slate-400">Section 05 Acceptance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-2">
            Synthetic Scenario Evaluation Sandbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Choose an offering, inspect synthetic parameters, run deterministic or AI-assisted reasoning, review the evidence trace, and provide structured feedback.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={executing}
          className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/25 transition disabled:opacity-50 self-start sm:self-auto"
        >
          {executing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          <span>Run Synthetic Scenario</span>
        </button>
      </div>

      {/* Parameter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase">Target Offering</label>
          <select
            value={offering}
            onChange={(e) => setOffering(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
          >
            <option value="Financial Analysis Intelligence">Financial Analysis Intelligence</option>
            <option value="SME Credit Decisioning">SME Credit Decisioning</option>
            <option value="Credit Strategy Simulator">Credit Strategy Simulator</option>
            <option value="RIVA Conversational Copilot">RIVA Conversational Copilot</option>
          </select>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase">Reasoning Engine Mode</label>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setModelMode('deterministic')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition ${
                modelMode === 'deterministic'
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Deterministic Rule
            </button>
            <button
              onClick={() => setModelMode('ai_assisted')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition ${
                modelMode === 'ai_assisted'
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              AI-Assisted (AIRA)
            </button>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase">Preloaded Synthetic Case</label>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
          >
            <option value="sme_seasonality">Case #1: Retail Wholesale SME (Q3-Q4 Stock Buildup)</option>
            <option value="agri_harvest">Case #2: Pre-harvest Agri Working Capital Drawdown</option>
            <option value="tourism_swings">Case #3: Destination Hospitality Low-Season Recovery</option>
          </select>
        </div>
      </div>

      {/* Execution Output Trace */}
      {runOutput && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Scenario Execution Trace
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {runOutput.runId}
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-400">
                Confidence: {runOutput.confidenceScore}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase">Evidence & Step-by-Step Reasoning:</div>
              <div className="space-y-1.5 text-xs text-slate-200">
                {runOutput.evidenceTrace.map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 font-mono text-[11px] leading-relaxed">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs text-purple-200 space-y-1">
              <div className="font-bold text-white uppercase text-[10px] tracking-wider">Simulated Output Recommendation:</div>
              <div className="text-sm font-semibold text-emerald-300">{runOutput.simulatedRecommendation}</div>
              <div className="text-[10px] text-slate-400 italic mt-1">{runOutput.syntheticDisclaimer}</div>
            </div>
          </div>

          {/* Structured Feedback Form (Section 05 Requirement) */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              Submit Structured Employee Evaluation Feedback
            </h3>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Model Precision & Reasoning Quality</label>
                  <select
                    value={feedbackRating}
                    onChange={(e) => setFeedbackRating(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="High">High - Accurate cyclical reasoning</option>
                    <option value="Satisfactory">Satisfactory - Acceptable explanation</option>
                    <option value="Needs Evidence">Needs Evidence - Potential edge cases overlooked</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Observed Divergence or Hallucination Risk</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white">
                    <option>Zero Hallucination - Strictly follows evidence trace</option>
                    <option>Minor Ambiguity in Covenant Wording</option>
                    <option>Uncalibrated Risk Penalty</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Detailed Review Notes for Squad</label>
                <textarea
                  rows={2}
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="Provide qualitative notes for product tuning..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={feedbackSubmitted}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{feedbackSubmitted ? "Submitting..." : "Log Feedback to Squad"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
