import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/iam';
import { getStore, saveStore } from '@/lib/store';

export async function POST(req, { params }) {
  const auth = authenticateRequest(req);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Authentication required to submit feedback." }, { status: 401 });
  }

  const store = getStore();
  const { id } = params;
  const obs = store.observations.find(o => o.id === id);

  if (!obs) {
    return NextResponse.json({ error: "Observation not found" }, { status: 404 });
  }

  try {
    const { type } = await req.json(); // 'useful' | 'needsEvidence'
    if (!obs.qualityVotes) {
      obs.qualityVotes = { useful: 0, needsEvidence: 0 };
    }

    if (type === 'useful') {
      obs.qualityVotes.useful = (obs.qualityVotes.useful || 0) + 1;
    } else if (type === 'needsEvidence') {
      obs.qualityVotes.needsEvidence = (obs.qualityVotes.needsEvidence || 0) + 1;
    }

    saveStore(store);

    return NextResponse.json({
      success: true,
      qualityVotes: obs.qualityVotes
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
