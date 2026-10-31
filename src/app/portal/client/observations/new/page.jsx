'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  Lock, 
  Building2, 
  Users, 
  Globe, 
  CheckCircle2, 
  HelpCircle,
  ArrowLeft
} from 'lucide-react';

export default function NewObservationPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privateDetails, setPrivateDetails] = useState('');
  const [offering, setOffering] = useState('Financial Analysis Intelligence');
  const [industry, setIndustry] = useState('Retail Wholesale');
  const [region, setRegion] = useState('EMEA');
  const [observationPeriod, setObservationPeriod] = useState('FY 2025 - Q1 2026');
  const [confidence, setConfidence] = useState('High');
  const [evidenceType, setEvidenceType] = useState('Portfolio Anomaly Distribution');

  // Sharing choice: private_to_author | organisation_only | proposed_sharing
  const [sharingScope, setSharingScope] = useState('private_to_author'); // Safe default!

  // Granular consent checkboxes (Section 09)
  const [storeConsent, setStoreConsent] = useState(true);
  const [publishConsent, setPublishConsent] = useState(false);
  const [discloseAttribution, setDiscloseAttribution] = useState(false); // default false: anonymous
  const [futureTrainingOptIn, setFutureTrainingOptIn] = useState(false);

  const [sensitiveWarning, setSensitiveWarning] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Client-side real-time sensitive data scanner
  const checkSensitiveContent = (text) => {
    const sensitiveRegex = /(\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b|\b\d{8,16}\b|account\s*#?|acc\s*#?|pwd|password|secret|confidential\s+pricing|margin\s*[:=]\s*\d+)/i;
    if (sensitiveRegex.test(text)) {
      setSensitiveWarning("Privacy Warning: Detected possible account numbers or confidential pricing keywords. Please ensure all borrower PII and internal commercial secrets are excluded or moved to private context.");
    } else {
      setSensitiveWarning(null);
    }
  };

  const handleSubmit = async (actionType) => {
    if (!title.trim() || !description.trim()) {
      alert("Please enter a title and description for your observation.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          privateDetails,
          offering,
          industry,
          region,
          observationPeriod,
          confidence,
          evidenceType,
          sharingScope,
          consents: {
            storeAndProcess: storeConsent,
            publishReviewedShared: publishConsent,
            discloseAttribution,
            futureTrainingOptIn
          },
          action: actionType // 'save_draft' | 'submit_for_review'
        })
      });

      const data = await res.json();
      if (data.success) {
        alert(actionType === 'submit_for_review' 
          ? "Observation successfully submitted for governance moderation! It will undergo de-identification prior to community sharing."
          : "Draft saved privately within your workspace."
        );
        router.push('/portal/client/observations');
      } else {
        alert(data.error || "Submission failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting observation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <a
          href="/portal/client/observations"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Organisation Observations</span>
        </a>
      </div>

      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
            Structured Contribution Form
          </span>
          <span className="text-xs text-slate-400">Sections 07 & 09</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Capture Market Observation or Trend
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Record empirical market trends, operational friction, or SME behavioral anomalies. All contributions start as private drafts and require explicit consent plus moderation before being shared.
        </p>
      </div>

      {/* Sensitive Data Notice & Live Warning */}
      {sensitiveWarning ? (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-xs text-amber-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-200">Automated Sensitive Data Scanner Alert</div>
            <div className="mt-1 leading-relaxed">{sensitiveWarning}</div>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong>Confidentiality Guidelines:</strong> Promptly exclude borrower identities, individual bank account numbers, transaction-level secrets, and confidential pricing terms.
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Observation Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              checkSensitiveContent(`${e.target.value} ${description}`);
            }}
            placeholder="e.g. Seasonal Q4 inventory surge misclassified as structural leverage spike"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Offering & Industry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Relevant Product Offering *
            </label>
            <select
              value={offering}
              onChange={(e) => setOffering(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
            >
              <option value="Financial Analysis Intelligence">Financial Analysis Intelligence</option>
              <option value="SME Credit Decisioning">SME Credit Decisioning</option>
              <option value="Credit Strategy Simulator">Credit Strategy Simulator</option>
              <option value="RIVA - Conversational Financial Copilot">RIVA - Financial Copilot</option>
              <option value="Similar Portfolio Intelligence">Similar Portfolio Intelligence</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Industry Sector *
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
            >
              <option value="Retail Wholesale">Retail Wholesale & Distribution</option>
              <option value="Agri-Business & Trade">Agri-Business & Trade Finance</option>
              <option value="Hospitality & Tourism">Hospitality & Tourism</option>
              <option value="Manufacturing & Logistics">Manufacturing & Logistics</option>
              <option value="Healthcare & Services">Healthcare & Services</option>
            </select>
          </div>
        </div>

        {/* Region & Observation Period */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
            >
              <option value="EMEA">EMEA</option>
              <option value="Middle East">Middle East</option>
              <option value="GCC">GCC</option>
              <option value="APAC">APAC</option>
              <option value="Global">Global</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">Observation Period</label>
            <input
              type="text"
              value={observationPeriod}
              onChange={(e) => setObservationPeriod(e.target.value)}
              placeholder="e.g. Q3 2025 - Q1 2026"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">Confidence Level</label>
            <select
              value={confidence}
              onChange={(e) => setConfidence(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
            >
              <option value="High">High (Validated by Committee)</option>
              <option value="Medium">Medium (Observed in multiple portfolios)</option>
              <option value="Preliminary">Preliminary (Early trend hypothesis)</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Observation Summary & Empirical Evidence *
          </label>
          <textarea
            rows={5}
            required
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              checkSensitiveContent(`${title} ${e.target.value}`);
            }}
            placeholder="Describe the recurring pattern, credit anomaly, or operational gap observed in commercial lending..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 leading-relaxed"
          />
        </div>

        {/* Private Internal Context (Isolated to Tenant) */}
        <div className="space-y-1.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Internal Private Context (Confidential to Your Bank)
          </label>
          <p className="text-[11px] text-slate-400">
            Internal loan committee reference codes or notes. This field is NEVER sent to the shared collective feed or AIRA retrieval.
          </p>
          <textarea
            rows={2}
            value={privateDetails}
            onChange={(e) => setPrivateDetails(e.target.value)}
            placeholder="e.g. Committee memo ref #SME-902, branch location notes..."
            className="w-full mt-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-amber-200 placeholder-slate-600 focus:outline-none"
          />
        </div>

        {/* Clear Sharing Choices (Section 09 - Hackathon Page 10) */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Sharing Scope & Visibility Tier *
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
              sharingScope === 'private_to_author' 
                ? 'bg-slate-800/90 border-slate-500 text-white' 
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}>
              <div className="space-y-1">
                <input
                  type="radio"
                  name="sharingScope"
                  value="private_to_author"
                  checked={sharingScope === 'private_to_author'}
                  onChange={() => {
                    setSharingScope('private_to_author');
                    setPublishConsent(false);
                  }}
                  className="sr-only"
                />
                <div className="font-bold text-xs flex items-center gap-1.5 text-white">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Private to Author
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  Personal draft. Only accessible to you. Never published or shared.
                </div>
              </div>
            </label>

            <label className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
              sharingScope === 'organisation_only' 
                ? 'bg-slate-800/90 border-teal-500 text-white' 
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}>
              <div className="space-y-1">
                <input
                  type="radio"
                  name="sharingScope"
                  value="organisation_only"
                  checked={sharingScope === 'organisation_only'}
                  onChange={() => {
                    setSharingScope('organisation_only');
                    setPublishConsent(false);
                  }}
                  className="sr-only"
                />
                <div className="font-bold text-xs flex items-center gap-1.5 text-white">
                  <Building2 className="w-3.5 h-3.5 text-teal-400" />
                  Within Organisation
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  Visible only to verified colleagues within your banking tenant.
                </div>
              </div>
            </label>

            <label className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
              sharingScope === 'proposed_sharing' 
                ? 'bg-emerald-950/30 border-emerald-500 text-white' 
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}>
              <div className="space-y-1">
                <input
                  type="radio"
                  name="sharingScope"
                  value="proposed_sharing"
                  checked={sharingScope === 'proposed_sharing'}
                  onChange={() => {
                    setSharingScope('proposed_sharing');
                    setPublishConsent(true);
                  }}
                  className="sr-only"
                />
                <div className="font-bold text-xs flex items-center gap-1.5 text-emerald-400">
                  <Globe className="w-3.5 h-3.5" />
                  Proposed Shared Hub
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  Submits to Learning Moderator for redaction & de-identified publication.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Separate Consent Checkboxes (Section 09 - Page 10) */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-white uppercase tracking-wider">
            Mandatory Separate Consent Controls
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            Per Azentio IAM-01, membership, publishing consent, and model-training consent are distinct and non-interchangeable:
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={storeConsent}
                onChange={(e) => setStoreConsent(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-950 text-teal-500"
              />
              <span>(a) Consent to store and process this contribution within our tenant workspace.</span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                disabled={sharingScope !== 'proposed_sharing'}
                checked={publishConsent}
                onChange={(e) => setPublishConsent(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-500"
              />
              <span className={sharingScope !== 'proposed_sharing' ? 'text-slate-500' : ''}>
                (b) Consent to publish reviewed and de-identified shared representation to the collective learning hub.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                disabled={sharingScope !== 'proposed_sharing'}
                checked={discloseAttribution}
                onChange={(e) => setDiscloseAttribution(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-500"
              />
              <span className={sharingScope !== 'proposed_sharing' ? 'text-slate-500' : ''}>
                (c) Disclose organisation attribution on shared representation (Default unchecked: Anonymous/De-identified).
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={futureTrainingOptIn}
                onChange={(e) => setFutureTrainingOptIn(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-950 text-teal-500"
              />
              <span>
                (d) Opt-in to future governed federated learning or synthetic benchmarking programmes.
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit('save_draft')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition"
            >
              Save Private Draft
            </button>

            <button
              type="button"
              disabled={submitting || (sharingScope === 'proposed_sharing' && !publishConsent)}
              onClick={() => handleSubmit('submit_for_review')}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition disabled:opacity-50"
            >
              Submit for Governance Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
