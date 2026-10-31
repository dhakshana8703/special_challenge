'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Edit3, 
  Search, 
  Layers, 
  RefreshCw, 
  Send,
  Eye,
  Lock,
  Building2
} from 'lucide-react';

export default function ModerationQueuePage() {
  const [submissions, setSubmissions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedObs, setSelectedObs] = useState(null);
  const [loading, setLoading] = useState(true);

  // Moderator redaction fields
  const [redactedTitle, setRedactedTitle] = useState('');
  const [redactedSummary, setRedactedSummary] = useState('');
  const [evidenceGrade, setEvidenceGrade] = useState('Grade A - Committee Verified');
  const [moderatorNotes, setModeratorNotes] = useState('');
  const [clarificationQuestion, setClarificationQuestion] = useState('');
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setCurrentUser(userData.user);

      const res = await fetch('/api/observations?view=review_queue');
      const data = await res.json();
      setSubmissions(data.observations || []);
      if (data.observations && data.observations.length > 0) {
        selectForReview(data.observations[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectForReview = (obs) => {
    setSelectedObs(obs);
    setRedactedTitle(obs.title);
    // Suggest a sanitized de-identified summary
    setRedactedSummary(
      obs.description
        .replace(/\b[A-Z]{3,4}-\d{4,}\b/g, '[REDACTED_ID]')
        .replace(/\b\d+(\.\d+)?\s*(M|AED|USD|GBP|EUR)\b/gi, '[NORMALIZED_VOLUME]')
    );
    setEvidenceGrade('Grade A - Verified Cross-Cohort');
    setModeratorNotes('Redacted individual borrower identifiers and proprietary regional margins. Retained core structural trend.');
  };

  const handleModerate = async (action) => {
    if (!selectedObs) return;

    try {
      const res = await fetch(`/api/observations/${selectedObs.id}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          reviewedTitle: redactedTitle,
          reviewedSummary: redactedSummary,
          evidenceGrade,
          moderatorNotes,
          clarificationQuestion
        })
      });

      const data = await res.json();
      if (data.success) {
        setActionMessage(`Action '${action}' executed successfully! Contributor notified in-app.`);
        await loadSubmissions();
        setTimeout(() => setActionMessage(null), 5000);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isModerator = currentUser?.persona === 'learning_moderator' || currentUser?.grants?.includes('moderate_learning') || currentUser?.persona === 'portal_admin';

  if (!isModerator && !loading) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Learning Moderator Access Required</h2>
        <p className="text-xs text-slate-400">
          IAM Boundary Enforced: Only designated Learning Moderators (e.g. Aisha Al-Mansoor) have authorization to redact and publish cross-client collective learning. Please switch to Aisha via the top demo bar.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Governance & Redaction Workboard
            </span>
            <span className="text-xs text-slate-400">Section 08 & 09</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-2">
            Collective Learning Moderation Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Review proposed client contributions, scrub confidential bank specifics, request clarification, and publish de-identified representations to the collective learning hub.
          </p>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Active Moderator:</span>
          <strong className="text-amber-400">{currentUser?.name}</strong>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs flex items-center justify-between">
          <span className="font-medium">{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Submissions Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Pending Submissions ({submissions.length})
            </span>
            <button onClick={loadSubmissions} className="text-slate-400 hover:text-white">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {submissions.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-slate-500 text-xs">
                Review queue is empty. No pending proposals.
              </div>
            ) : (
              submissions.map(obs => (
                <div
                  key={obs.id}
                  onClick={() => selectForReview(obs)}
                  className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${
                    selectedObs?.id === obs.id
                      ? 'bg-amber-950/20 border-amber-500/60 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-teal-400 uppercase">
                      {obs.authorOrgName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {obs.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-2">
                    {obs.title}
                  </h4>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>{obs.offering}</span>
                    <span>{obs.confidence} Conf.</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Columns: Side-by-Side Original Source vs De-Identified Public Draft */}
        <div className="lg:col-span-2 space-y-6">
          {selectedObs ? (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
              {/* Header metadata */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="text-xs text-slate-400">
                    Contributing Institution: <strong className="text-white">{selectedObs.authorOrgName}</strong> ({selectedObs.authorName})
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Consent Checks: Storing=Yes, Publish=Yes, OrgAttribution={selectedObs.consents?.discloseAttribution ? 'Disclose' : 'Anonymous/De-identified'}
                  </div>
                </div>

                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
                  {selectedObs.id}
                </span>
              </div>

              {/* Side-by-Side Review */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original Source (Confidential) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-red-400" />
                    Original Source (Tenant Boundary)
                  </div>
                  <div className="font-semibold text-xs text-slate-200">
                    {selectedObs.title}
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
                    {selectedObs.description}
                  </div>
                  {selectedObs.privateDetails && (
                    <div className="p-2.5 rounded bg-amber-950/30 border border-amber-900/40 text-[10px] text-amber-300">
                      <strong>Client Internal Notes:</strong> {selectedObs.privateDetails}
                    </div>
                  )}
                </div>

                {/* Proposed Shared Representation (Redacted) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Reviewed & De-Identified Public Copy
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Sanitized Title</label>
                    <input
                      type="text"
                      value={redactedTitle}
                      onChange={(e) => setRedactedTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase">De-Identified Summary</label>
                    <textarea
                      rows={5}
                      value={redactedSummary}
                      onChange={(e) => setRedactedSummary(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Review Controls: Evidence Grade & Moderator Audit Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Evidence Grade</label>
                  <select
                    value={evidenceGrade}
                    onChange={(e) => setEvidenceGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="Grade A - Committee Verified">Grade A - Committee Verified</option>
                    <option value="Grade A - Empirically Corroborated">Grade A - Empirically Corroborated</option>
                    <option value="Grade B - Single Portfolio Telemetry">Grade B - Single Portfolio Telemetry</option>
                    <option value="Grade C - Preliminary Hypothesis">Grade C - Preliminary Hypothesis</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Governance Audit Note</label>
                  <input
                    type="text"
                    value={moderatorNotes}
                    onChange={(e) => setModeratorNotes(e.target.value)}
                    placeholder="Audit reason for publication or redaction..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              {/* Clarification Request Box (Optional) */}
              <div className="space-y-1 pt-2">
                <label className="text-[11px] font-bold text-orange-400 uppercase">
                  Clarification Note to Contributor (If returning submission):
                </label>
                <input
                  type="text"
                  value={clarificationQuestion}
                  onChange={(e) => setClarificationQuestion(e.target.value)}
                  placeholder="e.g. Please clarify if the Q4 inventory spike repeats across multiple years or single vintage..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              {/* Moderator Decision Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleModerate('reject')}
                    className="px-3.5 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-800/40 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Submission</span>
                  </button>

                  <button
                    onClick={() => handleModerate('request_clarification')}
                    disabled={!clarificationQuestion.trim()}
                    className="px-3.5 py-2 rounded-lg bg-orange-950/40 hover:bg-orange-900/40 text-orange-300 border border-orange-800/40 text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Request Clarification</span>
                  </button>
                </div>

                <button
                  onClick={() => handleModerate('publish_approved')}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Approved Shared Version</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/30 rounded-2xl border border-slate-800 text-slate-500 text-xs">
              Select a submission from the queue to review and redact.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
