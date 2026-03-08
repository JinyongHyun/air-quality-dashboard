import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const BASE_URL = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc';

export async function GET(req: NextRequest) {
  const sido = req.nextUrl.searchParams.get('sido') ?? '서울';
  const key = process.env.AIR_QUALITY_API_KEY!;

  const url = `${BASE_URL}/getCtprvnRltmMesureDnsty?serviceKey=${key}&returnType=json&numOfRows=20&pageNo=1&sidoName=${encodeURIComponent(sido)}&ver=1.0`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.data.go.kr/',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `upstream ${res.status}` }, { status: res.status });
    }

    const json = await res.json();
    const items = json?.response?.body?.items ?? [];
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
