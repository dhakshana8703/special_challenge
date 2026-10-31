'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  UserPlus, 
  Terminal, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function ClientWorkspacePage() {
  const [userData, setUserData] = useState(null);
  const [activeTenant, setActiveTenant] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);

  // Invite modal for Client Admin
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('client_member');
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState(null);

  useEffect(() => {
    loadClientData();
  }, []);

  const loadClientData = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUserData(data.user);
      setActiveTenant(data.activeTenant);

      // Fetch tenant observations
      const obsRes = await fetch('/api/observations?view=tenant');
      const obsData = await obsRes.json();
      const list = obsData.observations || [];

      setStats({
        total: list.length,
        approved: list.filter(o => o.status === 'approved_published').length,
        pending: list.filter(o => o.status === 'pending_review' || o.status === 'in_review').length,
        drafts: list.filter(o => o.status === 'draft').length
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, proposedRole: inviteRole })
      });
      const data = await res.json();
      if (data.success) {
        setInviteSuccessMsg(`Single-use invitation generated! Token Link: ${data.inviteUrl}`);
        setInviteEmail('');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isClientAdmin = userData?.persona === 'client_admin' || userData?.grants?.includes('invite_client_users');

  if (loading) {
    return <div className="p-12 text-center text-slate-400 text-xs">Loading client workspace...</div>;
  }

  // If unauthenticated or public visitor
  if (!userData || userData.persona === 'public_visitor') {
    return (
      <div className="max-w-3xl mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Client Workspace Authentication Required</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Client workspaces are strictly isolated by organisation. Please use the top demo switcher to select a Client persona (e.g. David Chen or Sarah Jenkins of Apex Global Bank).
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Workspace Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Active Organisation: {activeTenant?.name || "Client Organisation"}
              </span>
              <span className="text-xs text-slate-400">
                Tier: {activeTenant?.tier}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {activeTenant?.name} Collaborative Intelligence Portal
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Signed in as <strong className="text-white">{userData.name}</strong> ({userData.title}). Client data is stored within your isolated tenant boundary.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isClientAdmin && (
              <button
                onClick={() => setInviteModalOpen(true)}
                className="px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-600/20 transition"
              >
                <UserPlus className="w-4 h-4" />
                <span>Invite Colleague</span>
              </button>
            )}

            <a
              href="/portal/client/observations/new"
              className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit Observation</span>
            </a>
          </div>
        </div>

        {/* Legal Consent Banner (Page 5) */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>
            <strong>Workspace Terms Notice:</strong> Joining a workspace is not consent to share or train on client data. Broadening visibility requires explicit per-contribution author permission and independent moderator review.
          </span>
          <span className="text-teal-400 font-medium whitespace-nowrap ml-4">IAM-01 Compliant</span>
        </div>
      </div>

      {/* Observation Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-500">Organisation Contributions</div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-[10px] text-slate-400">Total submitted & drafts</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-[10px] uppercase font-bold text-emerald-400">Approved & Shared</div>
          <div className="text-2xl font-bold text-emerald-400">{stats.approved}</div>
          <div className="text-[10px] text-slate-400">Published de-identified</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-[10px] uppercase font-bold text-amber-400">In Governance Review</div>
          <div className="text-2xl font-bold text-amber-400">{stats.pending}</div>
          <div className="text-[10px] text-slate-400">Pending moderation review</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Private Drafts</div>
          <div className="text-2xl font-bold text-slate-300">{stats.drafts}</div>
          <div className="text-[10px] text-slate-400">Author-only visibility</div>
        </div>
      </div>

      {/* Entitled Offerings & Sandboxes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            Entitled Product Sandboxes
          </h2>
          <span className="text-xs text-slate-400">
            Isolated synthetic test environments for {activeTenant?.name}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(activeTenant?.entitlements || []).map((ent, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                    Entitled
                  </span>
                  <span className="text-[10px] text-slate-400">Synthetic Sandbox</span>
                </div>
                <h3 className="text-base font-bold text-white capitalize">
                  {ent.replace(/-/g, ' ')}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Interactive simulation sandbox with synthetic data. Test stress parameters without customer PII risk.
                </p>
              </div>

              <a
                href="/portal/client/sandbox"
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <span>Launch Entitled Sandbox</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links to Observations & Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            My & Organisation Observations
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Review your internal drafts, track review status, amend submissions, or withdraw published observations synchronously.
          </p>
          <div className="pt-2">
            <a
              href="/portal/client/observations"
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              <span>Manage Organisation Observations</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Cross-Client Collective Learning
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Explore approved observations, safe aggregated themes, and check active product improvement updates without exposing tenant secrets.
          </p>
          <div className="pt-2">
            <a
              href="/portal/learning"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Explore Collective Learning Feed</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Invite Colleague Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-teal-400" />
                Invite Colleague to {activeTenant?.name}
              </h3>
              <button onClick={() => { setInviteModalOpen(false); setInviteSuccessMsg(null); }} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {inviteSuccessMsg ? (
              <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-500/40 text-xs text-teal-300 space-y-2">
                <div className="font-semibold">{inviteSuccessMsg}</div>
                <div className="text-[10px] text-slate-400">
                  Single-use, expiring link generated. In production, this dispatches via email.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Work Email Address</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="e.g. colleague@apexbank.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Proposed Client Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="client_member">Client Member (Lending / Risk Analyst)</option>
                    <option value="client_admin">Client Administrator</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Client admins cannot grant platform or employee roles (IAM-01 boundary).
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setInviteModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-500"
                  >
                    Generate Single-Use Invite
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
