import { getMostRecentNational, getSidoAirQuality } from '@/lib/airQuality';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const sido = req.nextUrl.searchParams.get('sido');
  try {
    const data = sido ? await getSidoAirQuality(sido) : await getMostRecentNational();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
