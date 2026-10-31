import { NextResponse } from 'next/server';
import { authenticateRequest, PERSONAS, recordAuditLog, sendInAppNotification } from '@/lib/iam';
import { getStore, saveStore } from '@/lib/store';

export async function POST(req, { params }) {
  const auth = authenticateRequest(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Authentication required to file a report." }, { status: 401 });
  }

  const store = getStore();
  const { id } = params;
  const obs = store.observations.find(o => o.id === id);

  if (!obs) {
    return NextResponse.json({ error: "Observation not found" }, { status: 404 });
  }

  try {
    const { reason, details } = await req.json();
    const { user } = auth;

    // Temporarily unpublish immediately for moderation review!
    obs.status = 'reported_suspended';
    obs.reportDetails = {
      reportedAt: new Date().toISOString(),
      reason: reason || "Confidential or misleading content flagged",
      notes: details || "Flagged by peer institution for urgent moderation review."
    };

    recordAuditLog(store, {
      userId: user.id,
      userName: "Anonymous Client Member", // Never disclose reporting client's identity to other clients!
      role: user.persona,
      action: 'OBSERVATION_FLAGGED_AND_SUSPENDED',
      targetResourceId: obs.id,
      targetType: 'observation',
      details: `Observation suspended pending review. Reason: ${reason}`
    });

    // Alert moderators
    const moderators = store.users.filter(u => u.persona === PERSONAS.LEARNING_MODERATOR);
    moderators.forEach(mod => {
      sendInAppNotification(store, {
        userId: mod.id,
        title: "URGENT: Shared Observation Reported",
        message: `An observation '${obs.title}' was flagged as potentially sensitive/misleading and has been temporarily unpublished pending your review.`,
        type: "alert"
      });
    });

    saveStore(store);

    return NextResponse.json({
      success: true,
      message: "Contribution has been reported and immediately suspended from shared visibility pending governance review. Thank you for maintaining collective trust."
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
