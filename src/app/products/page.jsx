import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Database, ChevronRight } from 'lucide-react';
import { getStore } from '@/lib/store';

export default function ProductsPage() {
  const store = getStore();
  const products = store.products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          ENTERPRISE AI PORTFOLIO
        </span>
        <h1 className="text-4xl font-extrabold text-white">Applied AI Products for Financial Institutions</h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Autonomous underwriting, dynamic stress testing, and explainable generative financial copilots built for Tier-1 banking, regional commercial trusts, and trade finance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div
            key={product.slug}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between space-y-4 shadow-xl group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{product.category}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Audience: {product.audience}</span>
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition">{product.name}</h2>
              <p className="text-xs text-slate-400 leading-relaxed">{product.description}</p>

              <div className="pt-2 space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-500">Key Capabilities:</div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {product.capabilities.map((cap, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
              <a
                href={`/products/${product.slug}`}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
              >
                <span>View Architecture</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="/connect"
                className="text-slate-400 hover:text-white"
              >
                Request Demo
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
