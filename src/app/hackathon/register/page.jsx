'use client';

import React, { useState } from 'react';
import { Sparkles, Trophy, Calendar, CheckCircle2, ShieldCheck, Users, Send } from 'lucide-react';

export default function HackathonRegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [track, setTrack] = useState('Collective Learning & Underwriting Intelligence');
  const [registered, setRegistered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setRegistered(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
          AZENTIO HACKATHON 2026
        </span>
        <h1 className="text-4xl font-extrabold text-white">Join the Collective Intelligence Challenge</h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Build intelligence. Create shared value. Compete across governed collective learning, server-side RBAC, and advanced federated machine learning tracks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Track Details */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Challenge Tracks & Guidelines</h2>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-emerald-400">Core Track (P0/P1): Collective Learning Portal</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Build full multi-tenant portal with 7 personas, IAM-01 server RBAC, observation capture, moderation redaction workboard, cohort privacy safeguard (&ge; 3 orgs), and product owner loop closure.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-red-400">Advanced Track (P2): Federated Model-Learning</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Demonstrate genuine federated training across 3 isolated client synthetic datasets, secure FedAvg coordinator, differential privacy, dropout handling, and candidate model rollback.
              </p>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-400" /> Submission Deadline: November 2026</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-teal-400" /> Live Interactive Evaluation Environment</div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          {registered ? (
            <div className="p-8 text-center space-y-3 animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Registration Confirmed!</h3>
              <p className="text-xs text-slate-300">
                Thank you for registering, <strong>{name}</strong>! Your team profile has been provisioned for the Azentio Hackathon evaluation cluster.
              </p>
              <div className="pt-3">
                <a
                  href="/portal/learning"
                  className="inline-block px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Explore Collective Learning Hub
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-white">Register Interest</h3>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Work / Institution Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@fintech-innovations.org"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Organisation / University *</label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Apex Global Bank or FinTech Lab"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Preferred Track</label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                >
                  <option>Core Track: Collective Learning & Underwriting Intelligence</option>
                  <option>Advanced Track: Federated Model-Learning & Privacy</option>
                  <option>Both Tracks (Comprehensive End-to-End Submission)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition mt-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Registration</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
