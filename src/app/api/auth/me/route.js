import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/iam';
import { getStore } from '@/lib/store';

export async function GET(req) {
  const auth = authenticateRequest(req);
  const store = getStore();

  let activeTenant = null;
  if (auth.user.tenantId) {
    activeTenant = store.tenants.find(t => t.id === auth.user.tenantId);
  }

  // Get unread notifications count for user
  const unreadCount = (store.notifications || []).filter(
    n => n.userId === auth.user.id && !n.read
  ).length;

  return NextResponse.json({
    authenticated: auth.authenticated,
    user: auth.user,
    activeTenant,
    availableTenants: store.tenants,
    unreadNotificationsCount: unreadCount
  });
}
