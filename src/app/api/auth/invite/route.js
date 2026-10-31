import { NextResponse } from 'next/server';
import { getStore, saveStore } from '@/lib/store';
import { recordAuditLog } from '@/lib/iam';

export async function POST(req) {
  try {
    const { token, name, password } = await req.json();
    const store = getStore();

    const invite = store.invitations.find(inv => inv.token === token && inv.status === 'pending');
    if (!invite) {
      return NextResponse.json({ error: "Invalid, expired, or already used invitation token." }, { status: 400 });
    }

    if (new Date(invite.expiresAt) < new Date()) {
      invite.status = 'expired';
      saveStore(store);
      return NextResponse.json({ error: "This invitation link has expired." }, { status: 410 });
    }

    // Provision new client member
    const newUserId = `usr_client_${Date.now()}`;
    const newUser = {
      id: newUserId,
      name: name || invite.email.split('@')[0],
      email: invite.email,
      persona: invite.proposedRole,
      roles: [invite.proposedRole],
      grants: ["submit_observations", "access_entitled_sandbox", "view_shared_learning"],
      tenantId: invite.tenantId,
      tenantName: invite.tenantName,
      title: "Commercial Risk Analyst",
      avatar: (name || invite.email)[0].toUpperCase()
    };

    store.users.push(newUser);
    invite.status = 'accepted';
    invite.acceptedAt = new Date().toISOString();
    invite.acceptedUserId = newUserId;

    recordAuditLog(store, {
      userId: newUserId,
      userName: newUser.name,
      role: newUser.persona,
      action: 'INVITATION_ACCEPTED',
      targetResourceId: invite.id,
      targetType: 'invitation',
      details: `User joined ${invite.tenantName} with role ${invite.proposedRole}.`
    });

    saveStore(store);

    const response = NextResponse.json({
      success: true,
      message: `Welcome to ${invite.tenantName}! Your workspace membership has been established.`,
      user: newUser
    });

    response.cookies.set('azentio_user_id', newUserId, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
