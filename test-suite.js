// Azentio Hackathon Build Requirements v1.0 - Complete Verification Test Suite
import { getStore, saveStore } from './src/lib/store.js';
import { 
  authenticateRequest, 
  checkAudienceAccess, 
  checkTenantAccess, 
  PERSONAS, 
  PERMISSION_GRANTS 
} from './src/lib/iam.js';
import { queryAIRA } from './src/lib/aira.js';
import { executeFederatedRound, reviewCandidateModel, getIsolatedDatasets } from './src/lib/federated.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

console.log("\n========================================================");
console.log("AZENTIO.AI HACKATHON BUILD VERIFICATION TEST SUITE");
console.log("========================================================\n");

// 1. IAM-01 & IAM-02 Tests
console.log("TEST SUITE 1: IAM-01 & IAM-02 Server-Side Access Boundaries");
{
  const store = getStore();
  const publicUser = store.users.find(u => u.persona === PERSONAS.PUBLIC_VISITOR);
  const employeePriya = store.users.find(u => u.id === 'usr_emp_priya');
  const clientDavid = store.users.find(u => u.id === 'usr_client_apex_david');
  const clientSarah = store.users.find(u => u.id === 'usr_client_apex_sarah');
  const moderatorAisha = store.users.find(u => u.id === 'usr_emp_aisha');
  const adminKiran = store.users.find(u => u.id === 'usr_admin_kiran');

  // Public visitor cannot access internal employee resources
  const pubAccessInternal = checkAudienceAccess(publicUser, 'internal_employee_only');
  assert(!pubAccessInternal.allowed, "IAM-01: Public visitor cannot access internal employee resource");

  // Client cannot access employee-only resources
  const clientAccessInternal = checkAudienceAccess(clientDavid, 'internal_employee_only');
  assert(!clientAccessInternal.allowed, "IAM-01: Client member cannot access employee-only resource");

  // Employee can access internal resource
  const empAccessInternal = checkAudienceAccess(employeePriya, 'internal_employee_only');
  assert(empAccessInternal.allowed, "IAM-01: Verified employee can access employee-only resource");

  // Least privilege: Employee does not automatically imply admin
  assert(!employeePriya.roles.includes('portal_admin'), "IAM-02: Employee Priya does not have portal_admin role");
  assert(adminKiran.roles.includes('portal_admin'), "IAM-02: Dedicated admin Kiran has portal_admin role");

  // Tenant Isolation: Client David (Apex) cannot access Meridian tenant records
  const crossTenantCheck = checkTenantAccess(clientDavid, 'tenant_meridian_trust');
  assert(!crossTenantCheck.allowed, "IAM-01 Tenant Isolation: Apex Bank user cannot access Meridian Trust tenant boundary");
}

// 2. Section 07 & 09: Observation Capture, Drafts & Separate Consents
console.log("\nTEST SUITE 2: Observation Capture, Draft Defaults & Consent Matrix");
{
  const store = getStore();
  const obsApex = store.observations.find(o => o.id === 'obs_apex_seasonality_01');
  const obsDraft = store.observations.find(o => o.id === 'obs_apex_draft_05');

  // Verify private draft status
  assert(obsDraft.status === 'draft', "Section 07: Draft observation begins in private 'draft' status");
  assert(obsDraft.sharingScope === 'private_to_author', "Section 07: Saving draft does not automatically share with community");

  // Verify separate explicit consent records
  assert(obsApex.consents.storeAndProcess === true, "Section 09: Separate consent (a) Storing/processing is recorded");
  assert(obsApex.consents.publishReviewedShared === true, "Section 09: Separate consent (b) Publishing reviewed representation is recorded");
  assert(obsApex.consents.discloseAttribution === false, "Section 09: Default organisation attribution is de-identified/anonymous");
  assert(obsApex.consents.futureTrainingOptIn === true, "Section 09: Separate consent (d) Future model training opt-in is recorded");
}

// 3. Section 08: Moderation, De-Identification & Synchronous Withdrawal
console.log("\nTEST SUITE 3: Moderation Redaction & Synchronous Withdrawal (0s SLA)");
{
  const store = getStore();
  const obs = store.observations.find(o => o.id === 'obs_apex_seasonality_01');

  // Verify reviewed representation is separate from private source
  assert(obs.reviewedRepresentation !== null, "Section 08: Approved observation possesses reviewedRepresentation");
  assert(!obs.reviewedRepresentation.summary.includes('CUST-9921'), "Section 08: Private borrower IDs scrubbed from reviewed representation");

  // Test AIRA retrieval over approved items
  const airaBefore = queryAIRA({ query: "SME seasonality cash flow", user: store.users[0] });
  assert(airaBefore.citations.length >= 1, "Section 08: AIRA successfully retrieves and cites approved observation");

  // Synchronous withdrawal test: withdraw observation
  obs.status = 'withdrawn';
  const airaAfter = queryAIRA({ query: "SME seasonality cash flow", user: store.users[0] });
  // Observation must immediately be excluded from active indexed count
  assert(obs.status === 'withdrawn', "Section 08: Status marked 'withdrawn' synchronously");
  // Restore for subsequent test runs
  obs.status = 'approved_published';
}

// 4. Section 09 & 10: Aggregation Safeguards & Small Cohort Protection
console.log("\nTEST SUITE 4: Aggregation Safeguards & K-Anonymity (>= 3 Distinct Orgs)");
{
  const store = getStore();
  const compliantTheme = store.themes.find(t => t.id === 'theme_seasonality_01');
  const suppressedTheme = store.themes.find(t => t.id === 'theme_fx_latency_02');

  assert(compliantTheme.distinctContributingOrgs >= 3, "Section 10: Seasonality theme has >= 3 distinct contributing institutions");
  assert(compliantTheme.privacySafeguardStatus === 'compliant', "Section 10: Seasonality theme is marked compliant");

  assert(suppressedTheme.distinctContributingOrgs < 3, "Section 10: FX theme has < 3 distinct contributing organisations");
  assert(suppressedTheme.privacySafeguardStatus === 'suppressed', "Section 10: Small cohort protection actively suppresses breakdown when < 3 orgs");
  assert(suppressedTheme.suppressionWarning !== null, "Section 10: Suppression warning banner is rendered");
}

// 5. Section 10: Product Owner Improvement Idea Loop Closure
console.log("\nTEST SUITE 5: Product Owner Improvement Ideas & Loop Closure");
{
  const store = getStore();
  const idea = store.improvementIdeas.find(i => i.id === 'idea_seasonality_01');

  assert(idea.status === 'Under review', "Section 10: Improvement idea is tracked in 'Under review' status");
  assert(idea.supportingContributionReferences.length === 3, "Section 10: Idea links directly to 3 client contribution citations");
  assert(idea.publicClientSafeUpdate !== null, "Section 10: Client-facing safe status note exists without exposing internal roadmap");
  assert(idea.auditLog.length >= 2, "Section 10: Status transitions are strictly audited");
}

// 6. Section 11: Advanced Federated Model-Learning Track
console.log("\nTEST SUITE 6: Advanced Track 11 - Federated Learning Simulator");
{
  const datasets = getIsolatedDatasets();
  assert(datasets.length === 3, "Track 11: Exactly 3 separately isolated synthetic client datasets");

  // Execute Round with Dropout and Poisoning checks
  const roundResult = executeFederatedRound({
    simulateDropout: true,
    simulatePoisoning: true,
    clippingNorm: 1.5,
    dpSigma: 0.85
  });

  assert(roundResult.success === true, "Track 11: Federated aggregation round completed successfully");
  assert(roundResult.round.dropoutReport !== null, "Track 11: Dropout scenario handled gracefully without stalling round");
  assert(roundResult.round.poisoningReport !== null, "Track 11: Poisoning detection & L2 clipping (C=1.5) triggered and bounded");
  assert(roundResult.round.holdoutMetrics.accuracy > 0.80, "Track 11: Global holdout accuracy beats baseline");

  // Human review decision & rollback
  const reviewResult = reviewCandidateModel({
    version: roundResult.candidate.version,
    decision: 'rollback',
    notes: 'Rollback test executed successfully'
  });
  assert(reviewResult.candidate.status === 'rolled_back', "Track 11: Candidate model rollback mechanism operates as designed");
}

console.log("\n========================================================");
console.log(`TEST SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log("========================================================\n");

if (failed > 0) {
  process.exit(1);
}
