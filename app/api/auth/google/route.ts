import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    return NextResponse.json({ message: 'Server misconfigured' }, { status: 500 });
  }

  try {
    const body = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Try to parse JSON; if backend returned non-JSON, fall back gracefully
    const data: unknown = await response
      .json()
      .catch(() => undefined);

    if (!response.ok) {
      const message =
        data && typeof data === 'object' && 'message' in data &&
        typeof (data as { message?: unknown }).message === 'string'
          ? (data as { message: string }).message
          : 'Authentication failed';
      return NextResponse.json({ message }, { status: response.status });
    }

    return NextResponse.json((data as Record<string, unknown>) ?? {}, { status: response.status });
  } catch (error) {
    console.error('Error during Google authentication:', error);
    return NextResponse.json({ message: 'Authentication failed' }, { status: 500 });
  }
}


