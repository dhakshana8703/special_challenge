import { NextResponse } from 'next/server';
import { authenticateRequest, PERSONAS, recordAuditLog } from '@/lib/iam';
import { getStore, saveStore } from '@/lib/store';

export async function POST(req) {
  const auth = authenticateRequest(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { user } = auth;
  const isClientAdmin = user.persona === PERSONAS.CLIENT_ADMIN || user.grants?.includes('invite_client_users');
  const isPortalAdmin = user.persona === PERSONAS.PORTAL_ADMIN;

  if (!isClientAdmin && !isPortalAdmin) {
    return NextResponse.json({ error: "Access denied. Client Administrator grant required to issue invitations." }, { status: 403 });
  }

  const store = getStore();

  try {
    const { email, proposedRole } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Client Admin can ONLY invite to their own tenant and CANNOT grant platform roles! (Hackathon Page 4 & 7)
    if (isClientAdmin && !isPortalAdmin) {
      if (['portal_admin', 'employee', 'learning_moderator', 'content_publisher'].includes(proposedRole)) {
        return NextResponse.json({ 
          error: "Permission escalation prohibited: Client administrators cannot grant internal employee or platform administrative roles." 
        }, { status: 403 });
      }
    }

    const tenantId = isClientAdmin ? user.tenantId : (req.body.tenantId || user.tenantId);
    const tenant = store.tenants.find(t => t.id === tenantId);

    const inviteToken = `inv_tok_${Math.random().toString(36).substring(2, 10)}`;
    const newInvite = {
      id: `inv_${Date.now()}`,
      token: inviteToken,
      tenantId: tenant.id,
      tenantName: tenant.name,
      email: email.trim(),
      proposedRole: proposedRole || 'client_member',
      invitedBy: `${user.id} (${user.name})`,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days expiring
      createdAt: new Date().toISOString()
    };

    if (!store.invitations) store.invitations = [];
    store.invitations.unshift(newInvite);

    recordAuditLog(store, {
      userId: user.id,
      userName: user.name,
      role: user.persona,
      action: 'CLIENT_INVITATION_ISSUED',
      targetResourceId: newInvite.id,
      targetType: 'invitation',
      details: `Single-use invitation issued to ${email} for organisation ${tenant.name} with proposed role ${newInvite.proposedRole}.`
    });

    saveStore(store);

    return NextResponse.json({
      success: true,
      message: `Invitation generated for ${email}. Single-use secure token issued.`,
      invitation: newInvite,
      inviteUrl: `/auth/invite?token=${inviteToken}`
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
