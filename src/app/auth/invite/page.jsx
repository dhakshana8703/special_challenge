'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, Building2, Lock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

function ClientInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || 'tok_invite_apex_sample';

  const [name, setName] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [acceptedUser, setAcceptedUser] = useState(null);

  const handleAcceptInvite = async (e) => {
    e.preventDefault();
    if (!agreedTerms) {
      alert("Please review and agree to the Workspace Terms & Learning-Sharing Guidelines.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, name })
      });

      const data = await res.json();
      if (data.success) {
        setAcceptedUser(data.user);
      } else {
        setErrorMsg(data.error || "Failed to accept invitation.");
      }
    } catch (err) {
      setErrorMsg("Network error connecting to invitation service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-semibold">
          <Building2 className="w-3.5 h-3.5" />
          <span>Client Workspace Onboarding (Section 04)</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Accept Organisation Invitation</h1>
        <p className="text-xs text-slate-400">
          Single-use, expiring invitation link for authorized banking partners.
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
        {acceptedUser ? (
          <div className="text-center space-y-4 py-4 animate-fade-in">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Workspace Membership Established!</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Welcome, <strong>{acceptedUser.name}</strong>. You have successfully joined <strong>{acceptedUser.tenantName}</strong> with role <strong>{acceptedUser.persona}</strong>.
            </p>
            <div className="pt-2">
              <a
                href="/portal/client"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition"
              >
                <span>Enter Client Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAcceptInvite} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px] text-slate-300">
              <div className="font-semibold text-teal-300 uppercase tracking-wider text-[10px]">
                Target Organisation Details
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Organisation:</span>
                <span className="font-bold text-white">Apex Global Bank</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Invited Role:</span>
                <span className="font-medium text-emerald-400">client_member (Lending Risk Analyst)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Secure Token:</span>
                <span className="font-mono text-[10px] text-slate-500">{token}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Your Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Mandatory Section 04 Workspace Terms Explanation */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
              <div className="font-bold text-white text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Workspace Terms & Learning-Sharing Explanation
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Joining an organization workspace establishes access to entitled product sandboxes and internal team notes. <strong>Joining a workspace is NOT consent to share or train on client data.</strong> Any broader visibility requires explicit per-contribution author consent and moderator review.
              </p>

              <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-teal-500"
                />
                <span className="text-[11px] text-slate-300">
                  I understand and agree to the Workspace Terms and acknowledge the strict separation between internal tenant data and de-identified collective learning.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agreedTerms}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <span>{loading ? "Verifying..." : "Accept Invitation & Join Workspace"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ClientInviteAcceptPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-slate-400 text-xs">Loading invitation...</div>}>
      <ClientInviteContent />
    </Suspense>
  );
}
