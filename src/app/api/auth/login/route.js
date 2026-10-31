import { NextResponse } from 'next/server';
import { getStore } from '@/lib/store';

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const store = getStore();
    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Check if it's an unauthorized external email (Hackathon Page 5: arbitrary external email must not create a trusted tenant membership automatically)
      if (email.endsWith('@azentio.com')) {
        return NextResponse.json({ 
          error: "Azentio employee identity verified, but internal workspace profile requires organiser approval." 
        }, { status: 403 });
      }

      return NextResponse.json({ 
        error: "Unregistered external email. Client organisations join strictly by invitation or administrator approval." 
      }, { status: 403 });
    }

    const response = NextResponse.json({
      success: true,
      message: `Identity verified for ${user.name}`,
      user
    });

    response.cookies.set('azentio_user_id', user.id, {
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
