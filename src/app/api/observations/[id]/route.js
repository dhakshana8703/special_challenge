import { NextResponse } from 'next/server';
import { authenticateRequest, PERSONAS, recordAuditLog, sendInAppNotification } from '@/lib/iam';
import { getStore, saveStore } from '@/lib/store';

export async function GET(req, { params }) {
  const auth = authenticateRequest(req);
  const store = getStore();
  const { id } = params;

  const obs = store.observations.find(o => o.id === id);
  if (!obs) {
    return NextResponse.json({ error: "Observation not found" }, { status: 404 });
  }

  const { user } = auth;
  const isAuthor = obs.authorId === user.id;
  const isSameTenant = user.tenantId && obs.authorOrgId === user.tenantId;
  const isModerator = user.persona === PERSONAS.LEARNING_MODERATOR || user.persona === PERSONAS.PORTAL_ADMIN;

  // Enforce access boundaries
  if (obs.status === 'draft' && !isAuthor) {
    return NextResponse.json({ error: "Access denied. Private draft accessible only to author." }, { status: 403 });
  }

  if (obs.sharingScope === 'organisation_only' && !isAuthor && !isSameTenant && !isModerator) {
    return NextResponse.json({ error: "Access denied. Confidential to author organisation." }, { status: 403 });
  }

  // If approved and requester is public/external, return de-identified representation
  if (obs.status === 'approved_published' && !isAuthor && !isSameTenant && !isModerator) {
    return NextResponse.json({
      observation: {
        id: obs.id,
        title: obs.reviewedRepresentation.title,
        summary: obs.reviewedRepresentation.summary,
        offering: obs.reviewedRepresentation.offering,
        industry: obs.reviewedRepresentation.industry,
        region: obs.reviewedRepresentation.region,
        observationPeriod: obs.reviewedRepresentation.observationPeriod,
        evidenceGrade: obs.reviewedRepresentation.evidenceGrade,
        attribution: (obs.consents?.discloseAttribution && obs.authorOrgName) ? obs.authorOrgName : "Verified Financial Institution (De-identified)",
        approvedAt: obs.reviewedRepresentation.approvedAt,
        qualityVotes: obs.qualityVotes,
        status: 'approved_published'
      }
    });
  }

  return NextResponse.json({ observation: obs });
}

export async function PUT(req, { params }) {
  const auth = authenticateRequest(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const store = getStore();
  const { id } = params;
  const obs = store.observations.find(o => o.id === id);

  if (!obs) {
    return NextResponse.json({ error: "Observation not found" }, { status: 404 });
  }

  const { user } = auth;
  const isAuthor = obs.authorId === user.id;

  if (!isAuthor && user.persona !== PERSONAS.PORTAL_ADMIN) {
    return NextResponse.json({ error: "Only the author may edit this observation." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, description, privateDetails, action, consents, sharingScope } = body;

    // If it was already published and user does a material edit, it creates a new version and requires renewed review! (Hackathon Page 9)
    const wasPublished = obs.status === 'approved_published';
    if (wasPublished) {
      obs.version = (obs.version || 1) + 1;
      obs.status = 'pending_review'; // Must be renewed!
      obs.reviewedRepresentation = null;
    }

    if (title) obs.title = title.trim();
    if (description) obs.description = description.trim();
    if (privateDetails !== undefined) obs.privateDetails = privateDetails.trim();
    if (sharingScope) obs.sharingScope = sharingScope;
    if (consents) obs.consents = { ...obs.consents, ...consents };

    if (action === 'submit_for_review') {
      obs.status = 'pending_review';
    }

    obs.updatedAt = new Date().toISOString();

    recordAuditLog(store, {
      userId: user.id,
      userName: user.name,
      role: user.persona,
      action: wasPublished ? 'OBSERVATION_MATERIAL_EDIT_VERSION_BUMP' : 'OBSERVATION_UPDATED',
      targetResourceId: obs.id,
      targetType: 'observation',
      details: wasPublished ? `Observation amended to version ${obs.version}. Re-routed to review queue.` : `Observation updated by author.`
    });

    saveStore(store);

    return NextResponse.json({
      success: true,
      observation: obs,
      renewedReviewRequired: wasPublished
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
