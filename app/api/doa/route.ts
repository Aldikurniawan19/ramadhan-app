import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://open-api.my.id/api/doa', {
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!res.ok) throw new Error('Failed to fetch doa');

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Doa API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doa data' },
      { status: 500 }
    );
  }
}
