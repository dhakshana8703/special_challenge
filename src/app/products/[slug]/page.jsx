import React from 'react';
import { getStore } from '@/lib/store';
import { notFound } from 'next/navigation';
import { 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Terminal, 
  ArrowRight,
  Cpu,
  Lock
} from 'lucide-react';

export default function ProductDetailPage({ params }) {
  const store = getStore();
  const product = store.products.find(p => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <a
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Catalog</span>
        </a>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
            {product.category}
          </span>
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs text-slate-400 font-medium">Enterprise Applied AI</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {product.name}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
          {product.tagline}
        </p>
      </div>

      {/* Main Overview Card */}
      <div className="p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white">Product Architecture & Purpose</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Verified Architectural Capabilities
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.capabilities.map((cap, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-200 leading-relaxed">{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Governance & Privacy Guarantee */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Compliance & Privacy Isolation Guarantee
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            Protected by Azentio Server-Side IAM-01 and tenant membership controls. Client borrower PII never enters shared indices, and sandbox simulations are strictly partitioned by organization.
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white">Test {product.name} in a Governed Sandbox</h3>
          <p className="text-xs text-slate-400 mt-1">
            Experience realistic synthetic workflows, stress scenarios, and explainability traces.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/portal/client/sandbox"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition"
          >
            Launch Client Sandbox
          </a>
          <a
            href="/connect"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            Request Enterprise Demo
          </a>
        </div>
      </div>
    </div>
  );
}
