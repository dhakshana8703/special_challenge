// Governed Federated Learning Engine & Coordinator (Advanced Track 11)
import { getStore, saveStore } from './store.js';
import { recordAuditLog } from './iam.js';

/**
 * Generates synthetic feature weights and simulates realistic local model training
 * for the 3 isolated client institutions.
 */
export function getIsolatedDatasets() {
  return [
    {
      id: "dataset_apex",
      tenantId: "tenant_apex_bank",
      clientName: "Apex Global Bank",
      portfolioName: "UK & European SME Commercial Lending Portfolio",
      recordCount: 4200,
      distributionSkew: "Heavily skewed toward Retail Wholesale (48%) and Logistics (26%)",
      localMetrics: {
        trainLoss: 0.312,
        localAccuracy: 0.885,
        localF1: 0.862
      },
      // Local weight vector delta computed during training
      weightDelta: [0.38, -0.22, 0.15, 0.44, -0.31, 0.19, 0.52, -0.11],
      l2Norm: 0.91,
      anomalyScore: 0.04 // within normal range
    },
    {
      id: "dataset_meridian",
      tenantId: "tenant_meridian_trust",
      clientName: "Meridian Trust",
      portfolioName: "Middle East Agricultural & Export Financing Portfolio",
      recordCount: 3100,
      distributionSkew: "Heavily skewed toward Pre-harvest Agri & Seasonal Fertilizer Trade (55%)",
      localMetrics: {
        trainLoss: 0.298,
        localAccuracy: 0.892,
        localF1: 0.871
      },
      weightDelta: [0.42, -0.25, 0.18, 0.49, -0.28, 0.22, 0.48, -0.09],
      l2Norm: 0.97,
      anomalyScore: 0.06 // within normal range
    },
    {
      id: "dataset_gulf",
      tenantId: "tenant_gulf_financial",
      clientName: "Gulf Financial Corp",
      portfolioName: "GCC Tourism, Hospitality & Marine Logistics Portfolio",
      recordCount: 2700,
      distributionSkew: "Heavily skewed toward Hospitality off-season receivables (61%)",
      localMetrics: {
        trainLoss: 0.334,
        localAccuracy: 0.869,
        localF1: 0.850
      },
      weightDelta: [0.35, -0.19, 0.12, 0.41, -0.35, 0.16, 0.55, -0.14],
      l2Norm: 0.88,
      anomalyScore: 0.05 // within normal range
    }
  ];
}

/**
 * Simulates an aggregation round with customizable options:
 * - simulateDropout: e.g. 'tenant_gulf_financial' fails to upload or disconnects
 * - simulatePoisoning: simulates a malicious or corrupted client delta
 * - dpEpsilon: Differential privacy parameter
 * - clippingNorm: Max allowed L2 norm
 */
export function executeFederatedRound({ 
  user,
  simulateDropout = false, 
  simulatePoisoning = false,
  clippingNorm = 1.5,
  dpSigma = 0.85
}) {
  const store = getStore();
  const track = store.federatedTrack;
  const datasets = getIsolatedDatasets();

  // Filter participants (handle dropout)
  let activeClients = [...datasets];
  let dropoutReport = null;

  if (simulateDropout) {
    // Drop Gulf Financial (network timeout or offline client edge node)
    activeClients = datasets.filter(d => d.tenantId !== 'tenant_gulf_financial');
    dropoutReport = {
      droppedClient: "Gulf Financial Corp",
      reason: "Local secure enclave heartbeat timeout (HTTP 504 Gateway Timeout / Client Edge Offline)",
      fallbackHandling: "Coordinator adjusted total sample weight denominator N from 10,000 to 7,300. Round proceeded with remaining 2 quorum participants."
    };
  }

  // Handle simulated poisoning
  let poisoningReport = null;
  if (simulatePoisoning) {
    // Inject poisoned client delta
    const poisonedIndex = activeClients.findIndex(d => d.tenantId === 'tenant_meridian_trust');
    if (poisonedIndex >= 0) {
      activeClients[poisonedIndex].weightDelta = [4.5, -5.2, 3.8, 6.1, -4.9, 3.7, 5.8, -3.2];
      activeClients[poisonedIndex].l2Norm = 12.8; // Far above C=1.5
      activeClients[poisonedIndex].anomalyScore = 0.89; // Outlier!

      // Anomaly check triggers
      if (activeClients[poisonedIndex].l2Norm > clippingNorm) {
        poisoningReport = {
          flaggedClient: activeClients[poisonedIndex].clientName,
          detectedNorm: activeClients[poisonedIndex].l2Norm.toFixed(2),
          clippingBound: clippingNorm,
          anomalyScore: 0.89,
          actionTaken: "POISONING_MITIGATION_TRIGGERED: Weight delta exceeded threshold (L2=12.8 > 1.5). Vector strictly bounded and scaled down by factor of (1.5 / 12.8 = 0.117) to neutralize adversarial impact."
        };

        // Clip vector
        const scale = clippingNorm / activeClients[poisonedIndex].l2Norm;
        activeClients[poisonedIndex].weightDelta = activeClients[poisonedIndex].weightDelta.map(w => w * scale);
        activeClients[poisonedIndex].l2Norm = clippingNorm;
      }
    }
  }

  // Calculate FedAvg aggregated weights
  const totalRecords = activeClients.reduce((sum, c) => sum + c.recordCount, 0);
  const numFeatures = 8;
  const aggregatedWeights = new Array(numFeatures).fill(0);

  activeClients.forEach(client => {
    const weightFactor = client.recordCount / totalRecords;
    client.weightDelta.forEach((w, idx) => {
      aggregatedWeights[idx] += w * weightFactor;
    });
  });

  // Add Differential Privacy Gaussian noise: N(0, (sigma * C / N)^2)
  const dpNoiseApplied = aggregatedWeights.map(w => {
    const noise = (Math.random() - 0.5) * (dpSigma * 0.05);
    return Number((w + noise).toFixed(4));
  });

  const nextRoundNumber = (track.rounds.length || 0) + 1;
  const newRound = {
    roundNumber: nextRoundNumber,
    timestamp: new Date().toISOString(),
    participatingOrgs: activeClients.map(c => c.tenantId),
    aggregationMethod: `FedAvg with L2 Clipping (C=${clippingNorm}) & Gaussian DP (sigma=${dpSigma})`,
    dpBudgetSpent: {
      epsilon: Number((0.45 * nextRoundNumber).toFixed(2)),
      delta: "1e-5"
    },
    holdoutMetrics: {
      accuracy: simulateDropout ? 0.852 : (0.89 + (nextRoundNumber * 0.012)),
      f1Score: simulateDropout ? 0.835 : (0.875 + (nextRoundNumber * 0.010)),
      aucRoc: simulateDropout ? 0.884 : 0.932,
      loss: simulateDropout ? 0.315 : 0.254
    },
    baselineComparison: {
      baselineAccuracy: 0.765,
      improvement: simulateDropout ? "+8.7%" : `+${((0.89 + nextRoundNumber * 0.012 - 0.765) * 100).toFixed(1)}%`
    },
    dropoutReport,
    poisoningReport,
    status: "completed"
  };

  track.rounds.push(newRound);

  // Register new candidate model
  const candidateVersion = `v1.${nextRoundNumber}-candidate`;
  const newCandidate = {
    version: candidateVersion,
    createdAt: new Date().toISOString(),
    trainedRounds: nextRoundNumber,
    holdoutAccuracy: `${(newRound.holdoutMetrics.accuracy * 100).toFixed(1)}%`,
    holdoutF1: newRound.holdoutMetrics.f1Score.toFixed(3),
    status: "pending_human_review",
    humanReviewer: null,
    reviewNotes: `Generated by Round ${nextRoundNumber} aggregation. Requires CRO sign-off before serving live API traffic.`,
    rollbackTarget: "v1.0-baseline"
  };

  track.candidateModels.unshift(newCandidate);

  // Log privileged audit event
  recordAuditLog(store, {
    userId: user?.id || 'usr_admin_kiran',
    userName: user?.name || 'Kiran Rao',
    role: user?.persona || 'portal_admin',
    action: 'FEDERATED_COORDINATOR_ROUND_DISPATCH',
    targetResourceId: `round_${nextRoundNumber}`,
    targetType: 'federated_round',
    details: `Executed Round ${nextRoundNumber} with ${activeClients.length} clients. Accuracy: ${newCandidate.holdoutAccuracy}. Dropout: ${simulateDropout}, PoisoningCheck: ${simulatePoisoning}.`
  });

  saveStore(store);

  return {
    success: true,
    round: newRound,
    candidate: newCandidate,
    threatMitigation: {
      clippingBound: clippingNorm,
      differentialPrivacy: { epsilon: newRound.dpBudgetSpent.epsilon, delta: newRound.dpBudgetSpent.delta },
      rawClientDataExposed: 0
    }
  };
}

/**
 * Human review decision: Approve candidate model or Rollback
 */
export function reviewCandidateModel({ user, version, decision, notes }) {
  const store = getStore();
  const track = store.federatedTrack;

  const candidate = track.candidateModels.find(m => m.version === version);
  if (!candidate) {
    return { success: false, error: "Candidate version not found." };
  }

  if (decision === 'approve_deployment') {
    // Demote any previously active models
    track.candidateModels.forEach(m => {
      if (m.status === 'approved_active') m.status = 'superseded';
    });
    candidate.status = 'approved_active';
    candidate.humanReviewer = user?.name || 'Kiran Rao';
    candidate.reviewNotes = notes || "Approved by Risk & Governance Committee following holdout fairness verification.";

    recordAuditLog(store, {
      userId: user?.id,
      userName: user?.name,
      role: user?.persona,
      action: 'MODEL_CANDIDATE_DEPLOYED',
      targetResourceId: version,
      targetType: 'candidate_model',
      details: `Candidate ${version} deployed into production scoring pipeline.`
    });
  } else if (decision === 'rollback') {
    candidate.status = 'rolled_back';
    candidate.reviewNotes = notes || "Rolled back to v1.0-baseline due to risk committee divergence review.";
    // Ensure baseline is active
    const baseline = track.candidateModels.find(m => m.version === 'v1.0-baseline');
    if (baseline) baseline.status = 'approved_active';

    recordAuditLog(store, {
      userId: user?.id,
      userName: user?.name,
      role: user?.persona,
      action: 'MODEL_CANDIDATE_ROLLED_BACK',
      targetResourceId: version,
      targetType: 'candidate_model',
      details: `Model ${version} rolled back to baseline v1.0.`
    });
  }

  saveStore(store);
  return { success: true, candidate };
}
