import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/iam';
import { getStore, saveStore } from '@/lib/store';

export async function GET(req) {
  const auth = authenticateRequest(req);
  const store = getStore();
  const { user } = auth;

  const userNotifs = (store.notifications || []).filter(n => n.userId === user.id);

  return NextResponse.json({
    notifications: userNotifs,
    unreadCount: userNotifs.filter(n => !n.read).length
  });
}

export async function PATCH(req) {
  const auth = authenticateRequest(req);
  const store = getStore();
  const { user } = auth;

  const body = await req.json();
  const { notifId, markAllRead } = body;

  if (markAllRead) {
    (store.notifications || []).forEach(n => {
      if (n.userId === user.id) n.read = true;
    });
  } else if (notifId) {
    const target = (store.notifications || []).find(n => n.id === notifId && n.userId === user.id);
    if (target) target.read = true;
  }

  saveStore(store);

  return NextResponse.json({ success: true });
}
