import { NextResponse } from 'next/server';
import { authenticateRequest, PERSONAS } from '@/lib/iam';
import { executeFederatedRound } from '@/lib/federated';

export async function POST(req) {
  const auth = authenticateRequest(req);
  const { user } = auth;

  // Track 11 coordinator actions require Portal Admin or AI Lead
  const isCoordinator = user.persona === PERSONAS.PORTAL_ADMIN || user.roles?.includes('portal_admin') || user.grants?.includes('run_federated_coordinator');
  if (!isCoordinator) {
    return NextResponse.json({ error: "Access denied. Federated Learning Coordinator grant required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { simulateDropout, simulatePoisoning, clippingNorm, dpSigma } = body;

    const result = executeFederatedRound({
      user,
      simulateDropout: Boolean(simulateDropout),
      simulatePoisoning: Boolean(simulatePoisoning),
      clippingNorm: clippingNorm ? Number(clippingNorm) : 1.5,
      dpSigma: dpSigma ? Number(dpSigma) : 0.85
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
