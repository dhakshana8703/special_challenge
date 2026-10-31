import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/iam';
import { getStore } from '@/lib/store';
import { getIsolatedDatasets } from '@/lib/federated';

export async function GET(req) {
  const auth = authenticateRequest(req);
  const store = getStore();

  const datasets = getIsolatedDatasets();
  const track = store.federatedTrack;

  return NextResponse.json({
    track,
    isolatedDatasets: datasets,
    authenticatedUser: {
      id: auth.user.id,
      persona: auth.user.persona
    }
  });
}
