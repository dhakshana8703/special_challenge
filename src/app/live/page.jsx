'use client';

import React, { useState, useEffect } from 'react';
import { Radio, Lock, Play, ShieldCheck, Clock, Users, ArrowRight, Video } from 'lucide-react';

export default function LiveBroadcastsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setCurrentUser(data.user);
        // Load broadcasts according to audience boundary
        loadFilteredBroadcasts(data.user);
      });
  }, []);

  const loadFilteredBroadcasts = (user) => {
    const isEmployee = user?.roles?.includes('employee') || user?.persona === 'employee' || user?.persona === 'portal_admin';
    const isClient = user?.persona === 'client_member' || user?.persona === 'client_admin';

    const allBroadcasts = [
      {
        id: "live_01",
        title: "Building Governed Collective Intelligence in Tier-1 Banking",
        audience: "public",
        status: "recorded",
        speaker: "Srinivas Rao (Chief AI Strategist, Azentio)",
        duration: "48 mins",
        views: 1240,
        description: "How leading commercial institutions convert isolated market feedback into de-identified, privacy-preserving collective learning without risking regulatory or proprietary breach.",
        badge: "Public Access"
      },
      {
        id: "live_02",
        title: "Azentio SME Decisioning 2026 Fall Release & Roadmap Preview",
        audience: "client_only",
        status: "recorded",
        speaker: "Priya Sharma (Senior Product Specialist)",
        duration: "35 mins",
        views: 310,
        description: "Deep dive into new credit scoring calibrations, dynamic scenario simulations, and client feedback integration for entitled partners.",
        badge: "Client Exclusive"
      },
      {
        id: "live_03",
        title: "Internal Engineering Townhall: AIRA v3 Multi-Agent Synthesis Architecture",
        audience: "internal_employee_only",
        status: "upcoming",
        speaker: "Dr. Marcus Vance (AI Lead) & Kiran Rao (Infrastructure)",
        duration: "60 mins",
        views: 0,
        description: "Confidential roadmap for scaling federated model coordination across Kubernetes clusters and securing agent prompt boundaries.",
        badge: "Internal Employee Only",
        scheduledFor: "November 5, 2026 • 14:00 GMT"
      }
    ];

    // Filter by IAM permission (Section 04 & 05)
    const filtered = allBroadcasts.filter(b => {
      if (b.audience === 'public') return true;
      if (b.audience === 'client_only') return isClient || isEmployee;
      if (b.audience === 'internal_employee_only') return isEmployee;
      return false;
    });

    setBroadcasts(filtered);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Azentio.ai LIVE Broadcasts
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">IAM-01 Audience Filter Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Conversations Where Intelligence Comes Alive.
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Live executive keynotes, client-exclusive product roadmap briefings, and internal engineering townhalls with server-enforced audience isolation.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong className="text-white">{broadcasts.length}</strong> permitted sessions for <span className="text-emerald-400 font-medium">{currentUser?.name || "Public Visitor"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {broadcasts.map(session => (
          <div
            key={session.id}
            className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  session.audience === 'internal_employee_only' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                  session.audience === 'client_only' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {session.badge}
                </span>

                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {session.duration}
                </span>
              </div>

              <h2 className="text-base font-bold text-white leading-snug">
                {session.title}
              </h2>

              <p className="text-xs text-slate-400 leading-relaxed">
                {session.description}
              </p>

              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
                Speaker: <strong className="text-slate-200">{session.speaker}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500 font-mono">
                {session.scheduledFor || `${session.views} verified views`}
              </span>

              <button
                onClick={() => alert(`Launching media stream for ${session.title} (Audience: ${session.audience})`)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>{session.status === 'upcoming' ? 'Join Stream' : 'Watch Recording'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
