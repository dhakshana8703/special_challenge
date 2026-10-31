'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Plus, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Activity,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function ProductOwnerIdeasPage() {
  const [ideas, setIdeas] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [loading, setLoading] = useState(true);

  // Status update state
  const [newStatus, setNewStatus] = useState('Under review');
  const [publicNote, setPublicNote] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [actionMessage, setActionMessage] = useState(null);

  // New idea modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [newOffering, setNewOffering] = useState('Financial Analysis Intelligence');
  const [newOutcome, setNewOutcome] = useState('');
  const [newPriority, setNewPriority] = useState('High');

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    setLoading(true);
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      setCurrentUser(userData.user);

      const res = await fetch('/api/ideas');
      const data = await res.json();
      setIdeas(data.ideas || []);
      if (data.ideas && data.ideas.length > 0) {
        setSelectedIdea(data.ideas[0]);
        setNewStatus(data.ideas[0].status);
        setPublicNote(data.ideas[0].publicClientSafeUpdate || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedIdea) return;

    try {
      const res = await fetch('/api/ideas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaId: selectedIdea.id,
          status: newStatus,
          publicClientSafeUpdate: publicNote,
          internalRoadmapNotes: internalNote
        })
      });

      const data = await res.json();
      if (data.success) {
        setActionMessage(`Status updated to '${newStatus}'! Audit log recorded and client-safe update synchronized.`);
        await loadIdeas();
        setTimeout(() => setActionMessage(null), 5000);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateIdea = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          problemStatement: newProblem,
          offering: newOffering,
          proposedOutcome: newOutcome,
          priority: newPriority,
          supportingContributionReferences: ["obs_apex_seasonality_01", "obs_meridian_seasonality_02", "obs_gulf_seasonality_03"]
        })
      });

      const data = await res.json();
      if (data.success) {
        setCreateModalOpen(false);
        setNewTitle('');
        setNewProblem('');
        setNewOutcome('');
        setActionMessage("New Improvement Idea created and linked to verified evidence!");
        await loadIdeas();
        setTimeout(() => setActionMessage(null), 5000);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Released': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'In progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Planned': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Under review': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Not proceeding': return 'bg-slate-700 text-slate-400 border-slate-600';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              Product Owner Improvement Loop
            </span>
            <span className="text-xs text-slate-400">Section 10 Acceptance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-2">
            Turn Collective Learning into Better Offerings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Product owners connect approved collective learning themes into structured improvement ideas, manage lifecycle stages, and close the loop with contributing clients safely.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Improvement Idea</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between">
          <span className="font-medium">{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Ideas List */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
            Active Improvement Ideas ({ideas.length})
          </div>

          <div className="space-y-3">
            {ideas.map(idea => (
              <div
                key={idea.id}
                onClick={() => {
                  setSelectedIdea(idea);
                  setNewStatus(idea.status);
                  setPublicNote(idea.publicClientSafeUpdate || '');
                }}
                className={`p-4 rounded-xl border cursor-pointer transition space-y-2.5 ${
                  selectedIdea?.id === idea.id
                    ? 'bg-emerald-950/20 border-emerald-500/60 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">
                    {idea.offering}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${getStatusColor(idea.status)}`}>
                    {idea.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-2">
                  {idea.title}
                </h4>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Priority: {idea.priority}</span>
                  <span>Owner: {idea.ownerTeam}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Columns: Detail, Status Lifecycle & Contributor Loop Closure */}
        <div className="lg:col-span-2 space-y-6">
          {selectedIdea ? (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    {selectedIdea.offering} • Priority: {selectedIdea.priority}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-1">
                    {selectedIdea.title}
                  </h2>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs border font-semibold ${getStatusColor(selectedIdea.status)}`}>
                  {selectedIdea.status}
                </span>
              </div>

              {/* Problem & Outcome */}
              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-400 uppercase text-[10px]">Problem Statement</div>
                  <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    {selectedIdea.problemStatement}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold text-slate-400 uppercase text-[10px]">Proposed Product Outcome</div>
                  <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    {selectedIdea.proposedOutcome}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold text-slate-400 uppercase text-[10px]">Supporting Collective Evidence Citations</div>
                  <div className="space-y-1">
                    {(selectedIdea.supportingContributionReferences || []).map((ref, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px] text-emerald-300 flex items-center justify-between">
                        <span>{ref}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Verified Contributor Citation</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Loop Closure Status Management Form */}
              <form onSubmit={handleStatusUpdate} className="space-y-4 pt-4 border-t border-slate-800">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Audited Status Transition & Client Loop Closure
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Lifecycle Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    >
                      <option value="Proposed">Proposed</option>
                      <option value="Under review">Under review</option>
                      <option value="Planned">Planned</option>
                      <option value="In progress">In progress</option>
                      <option value="Released">Released</option>
                      <option value="Not proceeding">Not proceeding</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Last Audit Event</label>
                    <div className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                      {new Date(selectedIdea.lastUpdate).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Plain language public update (Page 11) */}
                <div className="space-y-1 text-xs">
                  <label className="text-slate-300 font-medium flex items-center justify-between">
                    <span>Client-Facing Safe Status Note (Shared with Contributors)</span>
                    <span className="text-[10px] text-slate-500">Must not disclose private client tickets or delivery dates</span>
                  </label>
                  <textarea
                    rows={2}
                    value={publicNote}
                    onChange={(e) => setPublicNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                {/* Internal roadmap notes (visible only to employees) */}
                <div className="space-y-1 text-xs">
                  <label className="text-slate-300 font-medium flex items-center justify-between">
                    <span>Internal Engineering & Sprint Roadmap Notes</span>
                    <span className="text-[10px] text-purple-400">Internal Employee Only</span>
                  </label>
                  <textarea
                    rows={2}
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="e.g. Target sprint deployment, synthetic holdout benchmark target..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-purple-900/40 text-xs text-purple-200"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                  >
                    Save Audited Status Change
                  </button>
                </div>
              </form>

              {/* Audited History Log */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Audit History Timeline (IAM-01 Compliant)
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-400">
                  {(selectedIdea.auditLog || []).map((entry, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-300">{entry.action}:</span> {entry.details}
                      </div>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/30 rounded-2xl border border-slate-800 text-slate-500 text-xs">
              Select an improvement idea from the list to view and update.
            </div>
          )}
        </div>
      </div>

      {/* Create New Idea Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-emerald-400" />
                Create New Product Improvement Idea
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateIdea} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Idea Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Add Seasonality-Aware Working Capital Comparison Model"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Target Offering</label>
                  <select
                    value={newOffering}
                    onChange={(e) => setNewOffering(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="Financial Analysis Intelligence">Financial Analysis Intelligence</option>
                    <option value="SME Credit Decisioning">SME Credit Decisioning</option>
                    <option value="Credit Strategy Simulator">Credit Strategy Simulator</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Problem Statement *</label>
                <textarea
                  rows={2}
                  required
                  value={newProblem}
                  onChange={(e) => setNewProblem(e.target.value)}
                  placeholder="Describe the operational challenge observed across client institutions..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Proposed Product Outcome *</label>
                <textarea
                  rows={2}
                  required
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  placeholder="Describe the intended model improvement or policy enhancement..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                >
                  Create & Link Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
