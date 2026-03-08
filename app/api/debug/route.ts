import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.AIR_QUALITY_API_KEY!;
  const url = `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${API_KEY}&returnType=json&numOfRows=3&pageNo=1&sidoName=%EC%84%9C%EC%9A%B8&ver=1.0`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    const text = await res.text();
    return NextResponse.json({
      status: res.status,
      ok: res.ok,
      body: text.slice(0, 1000),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
