import React from 'react';
import { Shield, Sparkles, Terminal, FileText, Lock, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-base">
              a
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              azentio<span className="text-emerald-400">.ai</span>
            </span>
          </div>
          <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
            Enterprise Applied AI website & secure collaboration portal. Demonstrating public discovery, employee innovation, client collaboration, and governed collective learning.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-emerald-400">
              <Shield className="w-3.5 h-3.5" /> IAM-01 Server RBAC
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-teal-400">
              <Lock className="w-3.5 h-3.5" /> Multi-Tenant Boundary
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold mb-3 text-xs tracking-wider uppercase">Applied AI Products</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/products/sme-credit-decisioning" className="hover:text-emerald-400 transition">SME Credit Decisioning</a></li>
            <li><a href="/products/credit-strategy-simulator" className="hover:text-emerald-400 transition">Credit Strategy Simulator</a></li>
            <li><a href="/products/riva" className="hover:text-emerald-400 transition">RIVA Financial Copilot</a></li>
            <li><a href="/products/similar-portfolio-intelligence" className="hover:text-emerald-400 transition">Similar Portfolio Intelligence</a></li>
            <li><a href="/products/persona-newsroom" className="hover:text-emerald-400 transition">Persona Newsroom Sentinel</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold mb-3 text-xs tracking-wider uppercase">Governed Collaboration</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/portal/learning" className="hover:text-emerald-400 transition">Collective Learning Hub</a></li>
            <li><a href="/portal/client" className="hover:text-emerald-400 transition">Client Workspaces</a></li>
            <li><a href="/portal/employee/playground" className="hover:text-emerald-400 transition">Synthetic Playgrounds</a></li>
            <li><a href="/portal/moderation" className="hover:text-emerald-400 transition">Redaction & Review Queue</a></li>
            <li><a href="/portal/federated" className="hover:text-emerald-400 transition">Federated Model Consortium</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold mb-3 text-xs tracking-wider uppercase">Hackathon & Compliance</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="/hackathon/register" className="hover:text-emerald-400 transition">Azentio Hackathon 2026</a></li>
            <li><a href="/technology" className="hover:text-emerald-400 transition">Cohort Privacy Safeguards</a></li>
            <li><a href="/live" className="hover:text-emerald-400 transition">Azentio.ai LIVE Broadcasts</a></li>
            <li><a href="/connect" className="hover:text-emerald-400 transition">Demo Requests & Inquiries</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
        <div>
          &copy; {new Date().getFullYear()} Azentio Software Private Limited. Built for Azentio Hackathon Build Requirements v1.0.
        </div>
        <div className="flex items-center gap-6">
          <span>Synthetic Data Verification Guarantee</span>
          <span>Zero Client PII Retention</span>
          <span>Audited Status Lifecycles</span>
        </div>
      </div>
    </footer>
  );
}
