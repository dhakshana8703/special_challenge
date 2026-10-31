import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/iam';
import { queryAIRA } from '@/lib/aira';

export async function POST(req) {
  try {
    const auth = authenticateRequest(req);
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const result = queryAIRA({
      query,
      user: auth.user
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
