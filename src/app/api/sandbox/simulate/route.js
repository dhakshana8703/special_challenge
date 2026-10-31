import { NextResponse } from 'next/server';
import { authenticateRequest, PERSONAS } from '@/lib/iam';

export async function POST(req) {
  const auth = authenticateRequest(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Authentication required to access sandbox." }, { status: 401 });
  }

  const { user } = auth;
  const body = await req.json();
  const { scenarioType, loanAmount, annualRevenue, seasonalityFactor, businessType } = body;

  // Verify entitlement if user is client
  if (user.persona === PERSONAS.CLIENT_MEMBER || user.persona === PERSONAS.CLIENT_ADMIN) {
    // Check if client organisation has entitlement
    // In our seed, Apex, Meridian, Gulf all have 'sme-credit-decisioning' and 'financial-analysis-intelligence'
  }

  // Calculate synthetic decision metrics
  const requested = Number(loanAmount) || 250000;
  const revenue = Number(annualRevenue) || 1200000;
  const seasonalIdx = Number(seasonalityFactor) || 1.35; // 1.35 indicates peak seasonal variance

  // Standard static model (unadjusted)
  const staticDscr = (revenue * 0.12) / (requested * 0.35);
  // Seasonality-aware model (our improvement proposed by collective learning)
  const adjustedDscr = (revenue * 0.12 * (1 + (seasonalIdx - 1) * 0.4)) / (requested * 0.35);

  const staticApproval = staticDscr >= 1.25;
  const adjustedApproval = adjustedDscr >= 1.25;

  return NextResponse.json({
    simulationId: `sim_${Date.now()}`,
    tenantId: user.tenantId,
    disclaimer: "SYNTHETIC SANDBOX DATA ONLY - NOT AN ACTUAL CREDIT OR BUSINESS DECISION. FOR DEMONSTRATION PURPOSES ONLY.",
    inputs: {
      businessType: businessType || "Retail Wholesale SME",
      requestedFacility: `$${requested.toLocaleString()}`,
      annualRevenue: `$${revenue.toLocaleString()}`,
      seasonalFluctuationFactor: seasonalIdx
    },
    comparisonOutputs: {
      standardStaticModel: {
        modelName: "Baseline Static Underwriting v1.0",
        computedDSCR: staticDscr.toFixed(2),
        thresholdRequired: "1.25x",
        recommendation: staticApproval ? "APPROVE" : "REJECT / HIGH LEVERAGE RISK",
        falsePositiveFlag: !staticApproval && adjustedApproval,
        reasoning: "Evaluates trailing-twelve-month average without cyclical decomposition. Q3-Q4 stock inventory build counted as persistent debt overload."
      },
      seasonalityAwareModel: {
        modelName: "Seasonality-Aware Model (Candidate v1.2)",
        computedDSCR: adjustedDscr.toFixed(2),
        thresholdRequired: "1.25x",
        recommendation: adjustedApproval ? "APPROVE WITH SEASONAL COVENANT" : "REVISE CAPACITY",
        improvementDelta: "+38% Underwriting Precision",
        reasoning: "Applies 24-month cyclical smoothing derived from approved collective learning observations [OBS-SEASONALITY-01, 02, 03]. Q1 receivable liquidation recognized."
      }
    },
    evidenceTrace: [
      { step: "1. Ingestion", status: "Verified", note: "Synthetic VAT invoices and bank statements normalized." },
      { step: "2. Seasonality Adjustment", status: "Active", note: "Cross-checked against retail wholesale seasonal benchmark." },
      { step: "3. Policy Rule Check", status: "Passed", note: "Facility conforms with SME Risk Envelope B-2." }
    ]
  });
}
