import { NextResponse } from 'next/server';
import { authenticateRequest, PERSONAS } from '@/lib/iam';
import { reviewCandidateModel } from '@/lib/federated';

export async function POST(req) {
  const auth = authenticateRequest(req);
  const { user } = auth;

  const isCoordinator = user.persona === PERSONAS.PORTAL_ADMIN || user.roles?.includes('portal_admin') || user.grants?.includes('run_federated_coordinator');
  if (!isCoordinator) {
    return NextResponse.json({ error: "Access denied. Portal Administrator authorization required for model candidate deployment." }, { status: 403 });
  }

  try {
    const { version, decision, notes } = await req.json();
    if (!version || !decision) {
      return NextResponse.json({ error: "Version and decision are required." }, { status: 400 });
    }

    const result = reviewCandidateModel({
      user,
      version,
      decision,
      notes
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
