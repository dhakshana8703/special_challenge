'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  ThumbsUp, 
  HelpCircle, 
  Flag, 
  RefreshCw, 
  Building2, 
  TrendingUp, 
  ChevronRight, 
  Layers,
  ArrowUpRight,
  ExternalLink,
  Eye,
  Trash2
} from 'lucide-react';

export default function CollectiveLearningPage() {
  const [themes, setThemes] = useState([]);
  const [observations, setObservations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedOffering, setSelectedOffering] = useState('all');
  const [activeTab, setActiveTab] = useState('themes'); // 'themes' | 'feed'
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, [selectedIndustry, selectedOffering, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch current user
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setCurrentUser(userData.user);

      // 2. Fetch approved themes
      const themesRes = await fetch('/api/themes');
      const themesData = await themesRes.json();
      setThemes(themesData.themes || []);

      // 3. Fetch shared observations
      const queryParams = new URLSearchParams({
        view: 'shared',
        industry: selectedIndustry,
        offering: selectedOffering,
        q: searchQuery
      });
      const obsRes = await fetch(`/api/observations?${queryParams}`);
      const obsData = await obsRes.json();
      setObservations(obsData.observations || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (obsId, type) => {
    try {
      const res = await fetch(`/api/observations/${obsId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      if (data.success) {
        setObservations(prev => prev.map(o => o.id === obsId ? { ...o, qualityVotes: data.qualityVotes } : o));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReport = async (obsId) => {
    const reason = prompt("Enter reason for reporting this shared observation (e.g. confidential data, misleading claim):");
    if (!reason) return;

    try {
      const res = await fetch(`/api/observations/${obsId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage("Contribution flagged and temporarily suspended for moderation review.");
        loadData();
        setTimeout(() => setActionMessage(null), 5000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleWithdraw = async (obsId) => {
    if (!confirm("Are you sure you want to synchronously withdraw this contribution? It will be instantly purged from the shared index and AIRA retrieval.")) return;

    try {
      const res = await fetch(`/api/observations/${obsId}/withdraw`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage("Synchronous Withdrawal Complete: Observation instantly removed from shared index & AIRA memory (0s SLA).");
        loadData();
        setTimeout(() => setActionMessage(null), 6000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
              Governed Collective Learning Hub
            </span>
            <span className="text-xs text-slate-400">Sections 08, 09 & 10</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-2">
            Cross-Institution Market Intelligence & Evidence
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Verified, de-identified market observations from participating client institutions. Privacy safeguards ensure that sensitive figures remain confidential while turning common challenges into product improvements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/portal/client/observations/new"
            className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Contribute Observation</span>
          </a>
        </div>
      </div>

      {/* Action Notification Message */}
      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between animate-fade-in">
          <span className="font-medium">{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* View Switcher: Themes Dashboard vs Approved Shared Feed */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('themes')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'themes'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Aggregated Themes Dashboard ({themes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'feed'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Approved Shared Feed ({observations.length})</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3 flex-wrap flex-1 max-w-xl justify-end">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search observations or themes..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={selectedOffering}
            onChange={(e) => setSelectedOffering(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Offerings</option>
            <option value="Financial Analysis Intelligence">Financial Analysis Intelligence</option>
            <option value="SME Credit Decisioning">SME Credit Decisioning</option>
            <option value="Credit Strategy Simulator">Credit Strategy Simulator</option>
          </select>
        </div>
      </div>

      {/* Tab 1: Themes Dashboard */}
      {activeTab === 'themes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {themes.map(theme => (
              <div
                key={theme.id}
                className={`p-6 rounded-2xl border transition flex flex-col justify-between space-y-4 ${
                  theme.privacySafeguardStatus === 'suppressed'
                    ? 'bg-slate-900/40 border-amber-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40 shadow-xl'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      {theme.offering}
                    </span>

                    {/* Small Cohort Safeguard Badge (Section 10) */}
                    {theme.privacySafeguardStatus === 'suppressed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3" />
                        Small Cohort Safeguard Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3" />
                        Cohort Quorum Met (&ge; 3 Orgs)
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {theme.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {theme.summary}
                  </p>

                  {/* Suppression warning if < 3 orgs */}
                  {theme.suppressionWarning && (
                    <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-300 leading-relaxed">
                      {theme.suppressionWarning}
                    </div>
                  )}

                  {/* Cohort & Evidence Metadata */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Distinct Contributing Orgs:</span>
                      <span className="font-semibold text-slate-200">
                        {theme.distinctContributingOrgs} distinct institutions
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Observation Period:</span>
                      <span className="font-semibold text-slate-200">{theme.observationPeriod}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Confidence Rating:</span>
                      <span className="font-semibold text-emerald-400">{theme.confidence}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase">Associated Product Loop:</span>
                      <span className="font-semibold text-slate-200">
                        {theme.linkedIdeaId ? "Improvement Idea Linked" : "Pending Triaging"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-500">
                    Updated {new Date(theme.latestUpdate).toLocaleDateString()}
                  </div>

                  {theme.linkedIdeaId ? (
                    <a
                      href="/portal/employee/ideas"
                      className="text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-1"
                    >
                      <span>View Active Idea Progress</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-slate-500">No active idea linked</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Approved Shared Feed */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {observations.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No approved shared observations matching your filter criteria.
            </div>
          ) : (
            observations.map(obs => (
              <div
                key={obs.id}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      {obs.offering}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-300 font-medium">{obs.industry}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">{obs.region}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      {obs.evidenceGrade || "Grade A"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {obs.attribution}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {obs.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {obs.summary}
                </p>

                {obs.moderatorNotes && (
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Governance Audit:</strong> {obs.moderatorNotes}</span>
                  </div>
                )}

                {/* Footer Controls: Useful / Needs Evidence, Report, Withdraw */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-4">
                    {/* Useful Upvote */}
                    <button
                      onClick={() => handleVote(obs.id, 'useful')}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition"
                      title="Mark as useful cross-institution evidence"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Useful ({obs.qualityVotes?.useful || 0})</span>
                    </button>

                    {/* Needs Evidence */}
                    <button
                      onClick={() => handleVote(obs.id, 'needsEvidence')}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition"
                      title="Request additional empirical evidence"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Needs Evidence ({obs.qualityVotes?.needsEvidence || 0})</span>
                    </button>

                    {/* Report Content */}
                    <button
                      onClick={() => handleReport(obs.id)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition"
                      title="Report misleading or sensitive content"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Report</span>
                    </button>
                  </div>

                  {/* Synchronous Withdraw Button if Author or Moderator */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">
                      Approved {new Date(obs.approvedAt).toLocaleDateString()}
                    </span>

                    {/* Author or Admin can trigger synchronous withdrawal */}
                    <button
                      onClick={() => handleWithdraw(obs.id)}
                      className="px-2.5 py-1 rounded bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-800/40 text-[10px] font-semibold flex items-center gap-1 transition"
                      title="Withdraw contribution synchronously from shared index & AIRA"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Withdraw (0s SLA)</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
