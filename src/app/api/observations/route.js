import { NextResponse } from 'next/server';
import { authenticateRequest, PERSONAS, recordAuditLog, sendInAppNotification } from '@/lib/iam';
import { getStore, saveStore } from '@/lib/store';

// Helper to sanitize observation for external / public / cross-client consumption
function sanitizeForSharedAudience(obs, isAuthorOrSameTenant = false) {
  if (isAuthorOrSameTenant) {
    return obs; // Author or own-tenant colleague can see their own full details
  }

  // Cross-client or public consumption: MUST be approved_published
  if (obs.status !== 'approved_published' || !obs.reviewedRepresentation) {
    return null;
  }

  return {
    id: obs.id,
    title: obs.reviewedRepresentation.title,
    summary: obs.reviewedRepresentation.summary,
    offering: obs.reviewedRepresentation.offering,
    industry: obs.reviewedRepresentation.industry,
    region: obs.reviewedRepresentation.region,
    observationPeriod: obs.reviewedRepresentation.observationPeriod,
    evidenceGrade: obs.reviewedRepresentation.evidenceGrade,
    moderatorNotes: obs.reviewedRepresentation.moderatorNotes,
    approvedAt: obs.reviewedRepresentation.approvedAt,
    qualityVotes: obs.qualityVotes || { useful: 0, needsEvidence: 0 },
    // Organization attribution is only disclosed if explicitly consented AND approved!
    attribution: (obs.consents?.discloseAttribution && obs.authorOrgName) ? obs.authorOrgName : "Verified Financial Institution (De-identified)",
    version: obs.version,
    status: 'approved_published',
    isSharedCommunityItem: true
  };
}

export async function GET(req) {
  const auth = authenticateRequest(req);
  const store = getStore();
  const { user } = auth;

  const url = new URL(req.url);
  const viewFilter = url.searchParams.get('view') || 'all'; // 'shared' | 'mine' | 'tenant' | 'review_queue' | 'all'
  const industryFilter = url.searchParams.get('industry');
  const offeringFilter = url.searchParams.get('offering');
  const searchQuery = url.searchParams.get('q')?.toLowerCase();

  const isModerator = user.persona === PERSONAS.LEARNING_MODERATOR || user.grants?.includes('moderate_learning');
  const isPortalAdmin = user.persona === PERSONAS.PORTAL_ADMIN;
  const isClient = user.persona === PERSONAS.CLIENT_MEMBER || user.persona === PERSONAS.CLIENT_ADMIN;

  let results = [];

  store.observations.forEach(obs => {
    const isAuthor = obs.authorId === user.id;
    const isSameTenant = user.tenantId && obs.authorOrgId === user.tenantId;

    // RULE 1: Unsubmitted private drafts can ONLY be seen by the author
    if (obs.status === 'draft') {
      if (isAuthor) {
        results.push(obs);
      }
      return;
    }

    // RULE 2: Organisation-only items can only be seen by colleagues in that tenant
    if (obs.sharingScope === 'organisation_only') {
      if (isSameTenant || isAuthor) {
        results.push(obs);
      }
      return;
    }

    // RULE 3: Pending review / in review / needs clarification items
    if (['pending_review', 'in_review', 'needs_clarification', 'rejected'].includes(obs.status)) {
      if (isAuthor || isSameTenant) {
        results.push(obs);
      } else if (isModerator || isPortalAdmin) {
        // Moderator can view submissions submitted for review
        results.push(obs);
      }
      return;
    }

    // RULE 4: Withdrawn items are instantly excluded from public and shared lists!
    if (obs.status === 'withdrawn') {
      if (isAuthor || isSameTenant || isModerator) {
        results.push(obs);
      }
      return;
    }

    // RULE 5: Approved published items
    if (obs.status === 'approved_published') {
      const sanitized = sanitizeForSharedAudience(obs, isAuthor || isSameTenant);
      if (sanitized) results.push(sanitized);
    }
  });

  // Apply view filters
  if (viewFilter === 'mine') {
    results = results.filter(o => o.authorId === user.id);
  } else if (viewFilter === 'tenant') {
    results = results.filter(o => o.authorOrgId === user.tenantId);
  } else if (viewFilter === 'review_queue') {
    results = results.filter(o => ['pending_review', 'in_review', 'needs_clarification'].includes(o.status));
  } else if (viewFilter === 'shared') {
    results = results.filter(o => o.status === 'approved_published');
  }

  // Apply search and metadata filters
  if (industryFilter && industryFilter !== 'all') {
    results = results.filter(o => (o.industry || o.reviewedRepresentation?.industry) === industryFilter);
  }
  if (offeringFilter && offeringFilter !== 'all') {
    results = results.filter(o => (o.offering || o.reviewedRepresentation?.offering) === offeringFilter);
  }
  if (searchQuery) {
    results = results.filter(o => {
      const title = (o.title || o.reviewedRepresentation?.title || '').toLowerCase();
      const desc = (o.description || o.summary || o.reviewedRepresentation?.summary || '').toLowerCase();
      return title.includes(searchQuery) || desc.includes(searchQuery);
    });
  }

  return NextResponse.json({
    total: results.length,
    observations: results,
    currentUser: {
      id: user.id,
      persona: user.persona,
      tenantId: user.tenantId
    }
  });
}

export async function POST(req) {
  const auth = authenticateRequest(req);
  if (!auth.authenticated || auth.user.persona === PERSONAS.PUBLIC_VISITOR) {
    return NextResponse.json({ error: "Authentication required to submit observations." }, { status: 401 });
  }

  const { user } = auth;
  const store = getStore();

  try {
    const body = await req.json();
    const {
      title,
      description,
      privateDetails,
      offering,
      industry,
      region,
      observationPeriod,
      confidence,
      evidenceType,
      sharingScope = 'private_to_author', // default is private draft!
      consents = {},
      action = 'save_draft' // 'save_draft' | 'submit_for_review'
    } = body;

    if (!title || !description || !offering) {
      return NextResponse.json({ error: "Title, description, and offering are required." }, { status: 400 });
    }

    // Client and Server-side sensitive data scanner (Hackathon Page 8)
    const sensitiveRegex = /(\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b|\b\d{8,16}\b|account\s*#?|acc\s*#?|pwd|password|secret|confidential\s+pricing|margin\s*[:=]\s*\d+)/i;
    const containsPotentialSensitive = sensitiveRegex.test(`${title} ${description} ${privateDetails || ''}`);

    const newObsId = `obs_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    
    // Determine initial status
    let status = 'draft';
    if (action === 'submit_for_review') {
      if (sharingScope === 'proposed_sharing') {
        status = 'pending_review';
      } else if (sharingScope === 'organisation_only') {
        status = 'organisation_shared';
      }
    }

    const newObservation = {
      id: newObsId,
      title: title.trim(),
      description: description.trim(),
      privateDetails: privateDetails ? privateDetails.trim() : "",
      offering,
      industry: industry || "General Corporate Banking",
      region: region || "Global",
      observationPeriod: observationPeriod || "Current Fiscal Year",
      confidence: confidence || "Medium",
      evidenceType: evidenceType || "Empirical Portfolio Trend",
      sharingScope,
      status,
      authorId: user.id,
      authorName: user.name,
      authorOrgId: user.tenantId || "tenant_unassigned",
      authorOrgName: user.tenantName || "Independent Contributor",
      consents: {
        storeAndProcess: true,
        publishReviewedShared: sharingScope === 'proposed_sharing',
        discloseAttribution: Boolean(consents.discloseAttribution), // default false
        futureTrainingOptIn: Boolean(consents.futureTrainingOptIn)
      },
      flaggedSensitiveReview: containsPotentialSensitive,
      reviewedRepresentation: null,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      qualityVotes: { useful: 0, needsEvidence: 0 }
    };

    store.observations.unshift(newObservation);

    // Record audit event
    recordAuditLog(store, {
      userId: user.id,
      userName: user.name,
      role: user.persona,
      action: status === 'pending_review' ? 'OBSERVATION_SUBMITTED_FOR_REVIEW' : 'OBSERVATION_DRAFT_SAVED',
      targetResourceId: newObsId,
      targetType: 'observation',
      details: `Observation '${title}' created with status '${status}'. SharingScope: ${sharingScope}. SensitiveFlag: ${containsPotentialSensitive}.`
    });

    // If submitted for review, notify learning moderators
    if (status === 'pending_review') {
      const moderators = store.users.filter(u => u.persona === PERSONAS.LEARNING_MODERATOR);
      moderators.forEach(mod => {
        sendInAppNotification(store, {
          userId: mod.id,
          title: "New Observation Submitted for Review",
          message: `Client ${user.tenantName} submitted '${title}' for cross-institution collective learning.`,
          type: "alert"
        });
      });
    }

    saveStore(store);

    return NextResponse.json({
      success: true,
      observation: newObservation,
      sensitiveDataWarning: containsPotentialSensitive ? "Notice: Automated scanner flagged potential account numbers or private terms. These will be reviewed and redacted by moderators prior to any publication." : null
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
