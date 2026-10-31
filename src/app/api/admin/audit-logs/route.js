import { NextResponse } from 'next/server';
import { authenticateRequest, PERSONAS } from '@/lib/iam';
import { getStore } from '@/lib/store';

export async function GET(req) {
  const auth = authenticateRequest(req);
  const { user } = auth;

  // Privileged audit logs are restricted to Portal Administrators (IAM-01)
  if (user.persona !== PERSONAS.PORTAL_ADMIN && !user.roles?.includes('portal_admin')) {
    return NextResponse.json({ error: "Access denied. Portal Administrator role required to view security audit logs." }, { status: 403 });
  }

  const store = getStore();
  return NextResponse.json({
    total: (store.auditLogs || []).length,
    auditLogs: store.auditLogs || []
  });
}
