import { NextResponse } from 'next/server';
import { authenticateRequest, PERSONAS, recordAuditLog, sendInAppNotification } from '@/lib/iam';
import { getStore, saveStore } from '@/lib/store';

export async function GET(req) {
  const auth = authenticateRequest(req);
  const store = getStore();
  const { user } = auth;

  const isEmployee = user.roles.includes('employee') || user.persona === PERSONAS.EMPLOYEE || user.persona === PERSONAS.PORTAL_ADMIN;

  const ideas = (store.improvementIdeas || []).map(idea => {
    // If client or public, strip confidential internal roadmap notes!
    if (!isEmployee) {
      const { internalRoadmapNotes, ...safeIdea } = idea;
      return safeIdea;
    }
    return idea;
  });

  return NextResponse.json({ ideas });
}

export async function POST(req) {
  const auth = authenticateRequest(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { user } = auth;
  const isProductOwner = user.roles.includes('product_owner') || user.grants?.includes('manage_improvement_ideas') || user.persona === PERSONAS.PORTAL_ADMIN;
  if (!isProductOwner) {
    return NextResponse.json({ error: "Access denied. Product Owner grant required to initiate improvement ideas." }, { status: 403 });
  }

  const store = getStore();

  try {
    const {
      title,
      problemStatement,
      offering,
      supportingContributionReferences,
      proposedOutcome,
      priority = "Medium",
      status = "Proposed",
      publicClientSafeUpdate,
      internalRoadmapNotes
    } = await req.json();

    if (!title || !problemStatement || !offering) {
      return NextResponse.json({ error: "Title, problem statement, and offering are required." }, { status: 400 });
    }

    const newIdeaId = `idea_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newIdea = {
      id: newIdeaId,
      title: title.trim(),
      problemStatement: problemStatement.trim(),
      offering,
      supportingContributionReferences: supportingContributionReferences || [],
      proposedOutcome: proposedOutcome || "",
      ownerTeam: `${user.name} / ${user.department || 'Product Squad'}`,
      priority,
      status,
      lastUpdate: new Date().toISOString(),
      publicClientSafeUpdate: publicClientSafeUpdate || "Improvement initiative opened. Squad analyzing empirical evidence from collective learning community.",
      internalRoadmapNotes: internalRoadmapNotes || "Internal sprint planning notes.",
      auditLog: [
        {
          timestamp: new Date().toISOString(),
          action: "IDEA_CREATED",
          performedBy: `${user.id} (${user.name})`,
          details: `Idea created with initial status '${status}'.`
        }
      ]
    };

    if (!store.improvementIdeas) store.improvementIdeas = [];
    store.improvementIdeas.unshift(newIdea);

    recordAuditLog(store, {
      userId: user.id,
      userName: user.name,
      role: user.persona,
      action: 'IMPROVEMENT_IDEA_CREATED',
      targetResourceId: newIdeaId,
      targetType: 'improvement_idea',
      details: `Created improvement idea '${title}' for offering '${offering}'. Status: ${status}.`
    });

    saveStore(store);

    return NextResponse.json({ success: true, idea: newIdea });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  const auth = authenticateRequest(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { user } = auth;
  const isProductOwner = user.roles.includes('product_owner') || user.grants?.includes('manage_improvement_ideas') || user.persona === PERSONAS.PORTAL_ADMIN;
  if (!isProductOwner) {
    return NextResponse.json({ error: "Access denied. Product Owner grant required to update improvement ideas." }, { status: 403 });
  }

  const store = getStore();

  try {
    const { ideaId, status, publicClientSafeUpdate, internalRoadmapNotes } = await req.json();
    const idea = store.improvementIdeas?.find(i => i.id === ideaId);

    if (!idea) {
      return NextResponse.json({ error: "Improvement idea not found." }, { status: 404 });
    }

    const prevStatus = idea.status;
    if (status) idea.status = status;
    if (publicClientSafeUpdate) idea.publicClientSafeUpdate = publicClientSafeUpdate;
    if (internalRoadmapNotes) idea.internalRoadmapNotes = internalRoadmapNotes;
    idea.lastUpdate = new Date().toISOString();

    const auditEntry = {
      timestamp: new Date().toISOString(),
      action: "STATUS_CHANGE",
      performedBy: `${user.id} (${user.name})`,
      details: `Status updated from '${prevStatus}' to '${status}'. Public note updated.`
    };

    if (!idea.auditLog) idea.auditLog = [];
    idea.auditLog.unshift(auditEntry);

    recordAuditLog(store, {
      userId: user.id,
      userName: user.name,
      role: user.persona,
      action: 'IMPROVEMENT_IDEA_STATUS_UPDATED',
      targetResourceId: idea.id,
      targetType: 'improvement_idea',
      details: `Status advanced from ${prevStatus} to ${status}.`
    });

    saveStore(store);

    return NextResponse.json({ success: true, idea });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
