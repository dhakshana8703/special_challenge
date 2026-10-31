import { NextResponse } from 'next/server';
import { authenticateRequest, PERSONAS, recordAuditLog, sendInAppNotification } from '@/lib/iam';
import { getStore, saveStore } from '@/lib/store';

export async function POST(req, { params }) {
  const auth = authenticateRequest(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { user } = auth;
  const isModerator = user.persona === PERSONAS.LEARNING_MODERATOR || user.grants?.includes('moderate_learning') || user.persona === PERSONAS.PORTAL_ADMIN;
  if (!isModerator) {
    return NextResponse.json({ error: "Access denied. Learning Moderator permission grant required." }, { status: 403 });
  }

  const store = getStore();
  const { id } = params;
  const obs = store.observations.find(o => o.id === id);

  if (!obs) {
    return NextResponse.json({ error: "Observation not found" }, { status: 404 });
  }

  try {
    const { action, reviewedTitle, reviewedSummary, moderatorNotes, evidenceGrade, clarificationQuestion } = await req.json();

    if (action === 'publish_approved') {
      obs.status = 'approved_published';
      obs.reviewedRepresentation = {
        title: reviewedTitle || obs.title,
        summary: reviewedSummary || obs.description,
        offering: obs.offering,
        industry: obs.industry,
        region: obs.region,
        observationPeriod: obs.observationPeriod,
        evidenceGrade: evidenceGrade || "Grade A - Moderator Verified",
        moderatorNotes: moderatorNotes || "Approved and de-identified representation verified.",
        approvedAt: new Date().toISOString(),
        approvedBy: user.id
      };

      // Notify contributor
      sendInAppNotification(store, {
        userId: obs.authorId,
        title: "Observation Approved for Shared Learning",
        message: `Your observation '${obs.title}' was reviewed, de-identified, and published to the collective learning feed.`,
        type: "success"
      });

      recordAuditLog(store, {
        userId: user.id,
        userName: user.name,
        role: user.persona,
        action: 'OBSERVATION_APPROVED_AND_PUBLISHED',
        targetResourceId: obs.id,
        targetType: 'observation',
        details: `Published approved de-identified version with grade '${evidenceGrade || 'Grade A'}'. Original private details retained exclusively in tenant boundary.`
      });
    } else if (action === 'request_clarification') {
      obs.status = 'needs_clarification';
      obs.clarificationRequest = {
        question: clarificationQuestion || "Please clarify the observation period and confirm if specific customer records are excluded.",
        requestedAt: new Date().toISOString(),
        requestedBy: user.name
      };

      sendInAppNotification(store, {
        userId: obs.authorId,
        title: "Clarification Requested on Your Observation",
        message: `Moderator ${user.name} requested clarification: "${clarificationQuestion || 'Please clarify observation period'}"`,
        type: "alert"
      });

      recordAuditLog(store, {
        userId: user.id,
        userName: user.name,
        role: user.persona,
        action: 'OBSERVATION_CLARIFICATION_REQUESTED',
        targetResourceId: obs.id,
        targetType: 'observation',
        details: `Requested clarification from author ${obs.authorName}. Status moved to 'needs_clarification'.`
      });
    } else if (action === 'reject') {
      obs.status = 'rejected';
      obs.rejectionReason = moderatorNotes || "Duplicate submission or insufficient evidence.";

      sendInAppNotification(store, {
        userId: obs.authorId,
        title: "Observation Review Concluded",
        message: `Your submission '${obs.title}' was rejected by moderation: ${moderatorNotes || 'Insufficient evidence or duplicate'}.`,
        type: "info"
      });

      recordAuditLog(store, {
        userId: user.id,
        userName: user.name,
        role: user.persona,
        action: 'OBSERVATION_REJECTED',
        targetResourceId: obs.id,
        targetType: 'observation',
        details: `Submission rejected. Reason: ${moderatorNotes}`
      });
    }

    obs.updatedAt = new Date().toISOString();
    saveStore(store);

    return NextResponse.json({
      success: true,
      observation: obs
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
