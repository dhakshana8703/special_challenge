'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Building2, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';

export default function ConnectPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [interest, setInterest] = useState('SME Credit Decisioning');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
          ENTERPRISE ENGAGEMENT
        </span>
        <h1 className="text-4xl font-extrabold text-white">Request an Enterprise AI Demonstration</h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Schedule a private demonstration of Azentio's applied AI products or discuss onboarding your financial institution to the governed collective learning consortium.
        </p>
      </div>

      <div className="max-w-xl mx-auto p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl">
        {submitted ? (
          <div className="text-center space-y-4 py-8 animate-fade-in">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
            <h2 className="text-xl font-bold text-white">Inquiry Received</h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              Thank you, <strong>{name}</strong>. An Azentio Solutions Architect will reach out to <strong>{email}</strong> within 1 business day with synthetic sandbox access and credentials for <strong>{company}</strong>.
            </p>
            <div className="pt-4">
              <a
                href="/"
                className="inline-block px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Return to Homepage
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. David Chen"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Work Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. david.chen@apexbank.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Financial Institution / Organisation *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Apex Global Bank"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Primary Product of Interest</label>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none"
              >
                <option>SME Credit Decisioning</option>
                <option>Credit Strategy Simulator</option>
                <option>RIVA - Conversational Financial Copilot</option>
                <option>Similar Portfolio Intelligence</option>
                <option>Governed Collective Learning Consortium</option>
                <option>Advanced Federated Machine Learning (Track 11)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Specific Requirements / Objectives</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your current commercial underwriting or risk governance priorities..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition mt-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Enterprise Demo Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
