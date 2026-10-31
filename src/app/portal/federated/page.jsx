'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ShieldCheck, 
  Cpu, 
  Play, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Sliders, 
  FileText, 
  Layers, 
  Lock,
  TrendingUp,
  Activity,
  UserCheck
} from 'lucide-react';

export default function FederatedTrackPage() {
  const [trackData, setTrackData] = useState(null);
  const [isolatedDatasets, setIsolatedDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningRound, setRunningRound] = useState(false);

  // Round Simulation Options
  const [simulateDropout, setSimulateDropout] = useState(false);
  const [simulatePoisoning, setSimulatePoisoning] = useState(false);
  const [clippingNorm, setClippingNorm] = useState(1.5);
  const [dpSigma, setDpSigma] = useState(0.85);

  // Review notes modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    loadFederatedState();
  }, []);

  const loadFederatedState = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/federated/state');
      const data = await res.json();
      setTrackData(data.track);
      setIsolatedDatasets(data.isolatedDatasets || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatchRound = async () => {
    setRunningRound(true);
    try {
      const res = await fetch('/api/federated/round', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simulateDropout,
          simulatePoisoning,
          clippingNorm,
          dpSigma
        })
      });

      const data = await res.json();
      if (data.success) {
        setActionMessage(`Federated Round ${data.round.roundNumber} completed! Holdout Accuracy: ${(data.round.holdoutMetrics.accuracy * 100).toFixed(1)}% (${data.round.baselineComparison.improvement} over baseline).`);
        await loadFederatedState();
        setTimeout(() => setActionMessage(null), 6000);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRunningRound(false);
    }
  };

  const handleCandidateReview = async (decision) => {
    if (!selectedCandidate) return;

    try {
      const res = await fetch('/api/federated/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: selectedCandidate.version,
          decision,
          notes: reviewNotes
        })
      });

      const data = await res.json();
      if (data.success) {
        setReviewModalOpen(false);
        setActionMessage(`Candidate ${selectedCandidate.version} ${decision === 'approve_deployment' ? 'deployed into production scoring!' : 'rolled back to baseline.'}`);
        await loadFederatedState();
        setTimeout(() => setActionMessage(null), 5000);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400 text-xs">Loading federated learning coordinator...</div>;
  }

  const latestRound = trackData?.rounds?.[trackData.rounds.length - 1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Track Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 uppercase flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Advanced Track 11 / P2
            </span>
            <span className="text-xs text-slate-400">Opt-in Machine Learning Consortium</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-2">
            Governed Federated Model-Learning Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Genuine federated machine learning: Client environments train locally and send governed model updates. Raw client training records remain 100% local. The coordinator aggregates weight deltas (FedAvg) under differential privacy.
          </p>
        </div>

        <button
          onClick={handleDispatchRound}
          disabled={runningRound}
          className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/25 transition disabled:opacity-50 self-start md:self-auto"
        >
          {runningRound ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          <span>Execute Federated Round</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center justify-between">
          <span className="font-medium">{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* 3 Isolated Synthetic Client Environments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            3 Separately Isolated Synthetic Client Datasets (Non-IID Distribution)
          </h2>
          <span className="text-xs text-slate-400">Zero Raw Records Transmitted</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isolatedDatasets.map(dataset => (
            <div
              key={dataset.id}
              className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{dataset.clientName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Local Enclave Active
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 font-medium">{dataset.portfolioName}</div>
                <div className="text-[10px] text-slate-400 leading-relaxed">{dataset.distributionSkew}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Local Records:</span>
                  <span className="font-semibold text-white">{dataset.recordCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Local Train Loss:</span>
                  <span className="font-semibold text-emerald-400">{dataset.localMetrics.trainLoss}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Local L2 Weight Norm:</span>
                  <span className="font-semibold text-slate-300">{dataset.l2Norm} (Norm &le; {clippingNorm})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulator Stress Controls: Dropout & Poisoning (Section 11 Requirement) */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-red-400" />
            Consortium Robustness & Threat Stress Controls
          </span>
          <span className="text-[10px] text-slate-500">Simulate adversarial & network anomalies</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          {/* Dropout Checkbox */}
          <label className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer flex items-start gap-2.5">
            <input
              type="checkbox"
              checked={simulateDropout}
              onChange={(e) => setSimulateDropout(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-red-500"
            />
            <div>
              <div className="font-bold text-white">Dropout Scenario</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Gulf Financial disconnects / drops out of round.</div>
            </div>
          </label>

          {/* Poisoning Checkbox */}
          <label className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer flex items-start gap-2.5">
            <input
              type="checkbox"
              checked={simulatePoisoning}
              onChange={(e) => setSimulatePoisoning(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-red-500"
            />
            <div>
              <div className="font-bold text-white">Poisoning Attack Check</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Tests L2 clipping & anomaly score filtering.</div>
            </div>
          </label>

          {/* L2 Clipping Norm */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="font-bold text-white">L2 Clipping Bound (C={clippingNorm})</div>
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.1"
              value={clippingNorm}
              onChange={(e) => setClippingNorm(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500">Bounds participant influence</div>
          </div>

          {/* DP Gaussian Noise */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="font-bold text-white">DP Noise Multiplier (&sigma;={dpSigma})</div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={dpSigma}
              onChange={(e) => setDpSigma(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
            <div className="text-[10px] text-slate-500">Differential privacy guarantee</div>
          </div>
        </div>
      </div>

      {/* Global Evaluation on Holdout vs Baseline Benchmark */}
      {latestRound && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Holdout Evaluation Benchmark (Round {latestRound.roundNumber})
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {latestRound.aggregationMethod}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Evaluated on 1,500 Holdout Synthetic SME Records
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] uppercase text-slate-400">Baseline Static Model</div>
              <div className="text-2xl font-bold text-slate-300">76.5%</div>
              <div className="text-[10px] text-slate-500">Holdout Accuracy</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-1">
              <div className="text-[10px] uppercase text-emerald-400 font-bold">Global FedAvg Model</div>
              <div className="text-2xl font-bold text-emerald-400">
                {(latestRound.holdoutMetrics.accuracy * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-emerald-300">{latestRound.baselineComparison.improvement} over baseline</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] uppercase text-slate-400">Holdout F1-Score</div>
              <div className="text-2xl font-bold text-white">{latestRound.holdoutMetrics.f1Score.toFixed(3)}</div>
              <div className="text-[10px] text-slate-500">Balanced classification</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-[10px] uppercase text-slate-400">Cumulative DP Budget</div>
              <div className="text-2xl font-bold text-purple-400">&epsilon; = {latestRound.dpBudgetSpent.epsilon}</div>
              <div className="text-[10px] text-slate-500">&delta; = 10^-5 (Strict Bound)</div>
            </div>
          </div>

          {/* Anomaly / Dropout Reports */}
          {latestRound.dropoutReport && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Participant Dropout Handled ({latestRound.dropoutReport.droppedClient}):
              </div>
              <div className="text-[11px]">{latestRound.dropoutReport.reason}</div>
              <div className="text-[11px] text-amber-200">{latestRound.dropoutReport.fallbackHandling}</div>
            </div>
          )}

          {latestRound.poisoningReport && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Poisoning Mitigation Triggered ({latestRound.poisoningReport.flaggedClient}):
              </div>
              <div className="text-[11px]">{latestRound.poisoningReport.actionTaken}</div>
            </div>
          )}
        </div>
      )}

      {/* Candidate Model Registry & Explicit Human Deployment / Rollback (Section 11) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          Candidate Model Registry & Governance Review
        </h2>

        <div className="space-y-3">
          {(trackData?.candidateModels || []).map(candidate => (
            <div
              key={candidate.version}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">{candidate.version}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    candidate.status === 'approved_active' ? 'bg-emerald-500 text-slate-950' :
                    candidate.status === 'rolled_back' ? 'bg-red-950 text-red-300 border border-red-800' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {candidate.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Holdout Acc: <strong className="text-slate-200">{candidate.holdoutAccuracy}</strong> • F1: <strong className="text-slate-200">{candidate.holdoutF1}</strong> • Reviewer: {candidate.humanReviewer || 'Awaiting sign-off'}
                </p>
                <p className="text-[11px] text-slate-500">{candidate.reviewNotes}</p>
              </div>

              <div className="flex items-center gap-2">
                {candidate.status === 'pending_human_review' && (
                  <button
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setReviewModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Human Review & Deploy</span>
                  </button>
                )}

                {candidate.status === 'approved_active' && candidate.rollbackTarget && (
                  <button
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      handleCandidateReview('rollback');
                    }}
                    className="px-4 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-800/40 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Rollback to Baseline</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Model & Withdrawal Policy Documentation (Section 11) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Threat Model & Privacy Safeguards
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {trackData?.threatModel?.defenseDifferentialPrivacy} Bounded L2 update norm of C={clippingNorm} prevents single-client model takeover. Coordinator logs reject raw data samples.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-teal-400" />
            Withdrawal & Model Lineage Policy
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {trackData?.withdrawalPolicy?.statement}
          </p>
          <div className="text-[10px] text-teal-400 font-semibold">
            Propagation SLA: {trackData?.withdrawalPolicy?.sla}
          </div>
        </div>
      </div>

      {/* Human Review Modal */}
      {reviewModalOpen && selectedCandidate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                Human Review: {selectedCandidate.version}
              </h3>
              <button onClick={() => setReviewModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">
                As a privileged administrator, review the candidate model before enabling it in live SME decisioning pipelines:
              </p>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div>Accuracy: <strong className="text-emerald-400">{selectedCandidate.holdoutAccuracy}</strong></div>
                <div>F1 Score: <strong className="text-white">{selectedCandidate.holdoutF1}</strong></div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Audit Review Notes</label>
                <textarea
                  rows={2}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="e.g. CRO approved holdout fairness validation..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleCandidateReview('rollback')}
                  className="px-4 py-2 rounded-lg bg-red-950/40 text-red-400 border border-red-800/40"
                >
                  Reject / Rollback
                </button>
                <button
                  type="button"
                  onClick={() => handleCandidateReview('approve_deployment')}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                >
                  Approve Deployment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
