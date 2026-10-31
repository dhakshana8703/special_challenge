import { NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export async function POST(req) {
  try {
    const { userId } = await req.json();
    const store = getStore();

    const user = store.users.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response = NextResponse.json({
      success: true,
      message: `Switched active persona to ${user.name} (${user.persona})`,
      user
    });

    // Set cookie for session persistence
    response.cookies.set('azentio_user_id', user.id, {
      path: '/',
      httpOnly: false, // accessible to client for reactive UI switches
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
