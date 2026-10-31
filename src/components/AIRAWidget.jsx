'use client';

import React, { useState } from 'react';
import { Sparkles, X, MessageSquare, Send, ExternalLink, ShieldCheck, Database, RefreshCw } from 'lucide-react';

export default function AIRAWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([
    {
      sender: 'aira',
      text: "Hello! I am AIRA, Azentio's Intelligent Retrieval & Synthesis Assistant. I synthesize insights strictly across approved collective learning contributions and enterprise AI research, citing verified de-identified sources. How may I assist your risk evaluation today?",
      citations: []
    }
  ]);

  const handleSend = async (textToSend) => {
    const q = textToSend || query;
    if (!q.trim() || loading) return;

    const userMessage = { sender: 'user', text: q };
    setConversation(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/aira', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();

      setConversation(prev => [
        ...prev,
        {
          sender: 'aira',
          text: data.synthesis,
          citations: data.citations || [],
          governanceDisclaimer: data.governanceDisclaimer
        }
      ]);
    } catch (e) {
      setConversation(prev => [
        ...prev,
        {
          sender: 'aira',
          text: "I encountered an error accessing the permitted collective learning index. Please verify your connection.",
          citations: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "What collective learning exists for SME cash flow seasonality?",
    "What is the status of the seasonality improvement idea?",
    "How does the Federated Consortium ensure privacy?"
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition"
        >
          <Sparkles className="w-5 h-5 text-slate-950" />
          <span className="text-sm">Ask AIRA Copilot</span>
        </button>
      </div>

      {/* Floating Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 sm:w-[480px] h-[580px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  AIRA Intelligence Assistant
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Governed
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Synthesizes only approved, de-identified evidence
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {conversation.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-xl max-w-[90%] leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-slate-800/90 border border-slate-700/60 text-slate-200 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {/* Citations Card */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/80 space-y-1.5">
                      <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Citations & Verified Evidence:
                      </div>
                      {msg.citations.map((c, ci) => (
                        <div key={ci} className="bg-slate-900/80 p-2 rounded border border-slate-800 text-[11px]">
                          <div className="font-semibold text-slate-200">{c.code}: {c.title}</div>
                          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                            <span>{c.deIdentifiedOrg}</span>
                            <span className="text-emerald-400 font-medium">{c.grade}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.governanceDisclaimer && (
                    <div className="mt-2 text-[9px] text-slate-400 italic">
                      {msg.governanceDisclaimer}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                Synthesizing cross-institution evidence...
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-slate-950/40 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            {samplePrompts.map((p, pi) => (
              <button
                key={pi}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AIRA across collective learning..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !query.trim()}
              className="p-2 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
