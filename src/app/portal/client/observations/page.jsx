'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck,
  Send,
  Lock,
  Building2
} from 'lucide-react';

export default function ClientObservationsListPage() {
  const [observations, setObservations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [viewFilter, setViewFilter] = useState('tenant'); // 'mine' | 'tenant'
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, [viewFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setCurrentUser(userData.user);

      const res = await fetch(`/api/observations?view=${viewFilter}`);
      const data = await res.json();
      setObservations(data.observations || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (obsId) => {
    if (!confirm("Are you sure you want to synchronously withdraw this contribution? It will immediately disappear from shared indexes, theme statistics, and AIRA retrieval.")) return;

    try {
      const res = await fetch(`/api/observations/${obsId}/withdraw`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage("Observation synchronously withdrawn. Shared index, theme links, and AIRA cache invalidated (0s SLA).");
        loadData();
        setTimeout(() => setActionMessage(null), 5000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitDraft = async (obsId) => {
    try {
      const res = await fetch(`/api/observations/${obsId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'submit_for_review', 
          sharingScope: 'proposed_sharing',
          consents: { publishReviewedShared: true }
        })
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage("Observation submitted for governance review! Moderators notified.");
        loadData();
        setTimeout(() => setActionMessage(null), 5000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved_published':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Approved & Shared</span>;
      case 'pending_review':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1"><Clock className="w-3 h-3" /> In Moderation Review</span>;
      case 'needs_clarification':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Clarification Requested</span>;
      case 'draft':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300 flex items-center gap-1"><Lock className="w-3 h-3" /> Private Draft</span>;
      case 'withdrawn':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1"><Trash2 className="w-3 h-3" /> Withdrawn</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {currentUser?.tenantName || "Organisation Workspace"}
            </span>
            <span className="text-xs text-slate-400">Section 06 & 07</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-2">
            Observation Records & Evidence Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Private organisation knowledge and cross-client shared feed are visually and technically isolated. Saving a draft never publishes or trains an AI model.
          </p>
        </div>

        <a
          href="/portal/client/observations/new"
          className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Observation</span>
        </a>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-teal-950/80 border border-teal-500/50 text-teal-300 text-xs flex items-center justify-between animate-fade-in">
          <span className="font-medium">{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* View Filter Switcher */}
      <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setViewFilter('tenant')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
            viewFilter === 'tenant'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Our Organisation's Observations</span>
        </button>

        <button
          onClick={() => setViewFilter('mine')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
            viewFilter === 'mine'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>My Contributions</span>
        </button>
      </div>

      {/* Observations List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading observations...</div>
        ) : observations.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-3">
            <div>No observations recorded under this view.</div>
            <a
              href="/portal/client/observations/new"
              className="inline-block px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Capture New Market Observation
            </a>
          </div>
        ) : (
          observations.map(obs => (
            <div
              key={obs.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                    {obs.offering}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-300 font-medium">{obs.industry}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">{obs.region}</span>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(obs.status)}
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    v{obs.version || 1}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  {obs.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed whitespace-pre-line">
                  {obs.description}
                </p>
              </div>

              {/* Private Details (Visually Isolated to Client Tenant) */}
              {obs.privateDetails && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-900/30 text-[11px] text-amber-200/90 space-y-1">
                  <div className="font-semibold text-amber-400 flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                    <Lock className="w-3 h-3" /> Tenant Private Internal Context (Confidential to {currentUser?.tenantName})
                  </div>
                  <div>{obs.privateDetails}</div>
                  <div className="text-[10px] text-slate-500 italic">
                    * This context is strictly isolated and NEVER exposed in shared collective feeds or AIRA responses.
                  </div>
                </div>
              )}

              {/* Clarification Request Notice if returned */}
              {obs.status === 'needs_clarification' && obs.clarificationRequest && (
                <div className="p-3.5 rounded-xl bg-orange-950/40 border border-orange-500/40 text-xs text-orange-300 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    Clarification Requested by Moderator {obs.clarificationRequest.requestedBy}:
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    "{obs.clarificationRequest.question}"
                  </p>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span>Author: <strong className="text-slate-400">{obs.authorName}</strong></span>
                  <span>•</span>
                  <span>Period: {obs.observationPeriod}</span>
                  <span>•</span>
                  <span>Confidence: {obs.confidence}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Draft Submit Action */}
                  {obs.status === 'draft' && (
                    <button
                      onClick={() => handleSubmitDraft(obs.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit for Governance Review</span>
                    </button>
                  )}

                  {/* Synchronous Withdraw Button */}
                  {['approved_published', 'pending_review', 'needs_clarification'].includes(obs.status) && (
                    <button
                      onClick={() => handleWithdraw(obs.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-800/40 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Synchronous Withdraw (0s)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
