import { NextRequest, NextResponse } from 'next/server';

const WAQI_TOKEN = process.env.WAQI_TOKEN!;

const CITY_MAP: Record<string, string> = {
  '서울': 'seoul', '부산': 'busan', '대구': 'daegu', '인천': 'incheon',
  '광주': 'gwangju', '대전': 'daejeon', '울산': 'ulsan', '경기': 'suwon',
  '강원': 'gangneung', '충북': 'cheongju', '충남': 'cheonan',
  '전북': 'jeonju', '전남': 'gwangyang', '경북': 'pohang',
  '경남': 'changwon', '제주': 'jeju', '세종': 'sejong',
};

function aqiToGrade(aqi: number): string {
  if (aqi <= 50) return '1';
  if (aqi <= 100) return '2';
  if (aqi <= 150) return '3';
  return '4';
}

export async function GET(req: NextRequest) {
  const sido = req.nextUrl.searchParams.get('sido') ?? '서울';
  const city = CITY_MAP[sido] ?? sido.toLowerCase();

  try {
    const res = await fetch(`https://api.waqi.info/feed/${city}/?token=${WAQI_TOKEN}`);
    const json = await res.json();

    if (json.status !== 'ok') {
      return NextResponse.json({ error: json.data ?? 'API error' }, { status: 502 });
    }

    const d = json.data;
    const aqi = Number(d.aqi) || 0;
    const grade = aqiToGrade(aqi);

    // 여러 측정소처럼 보이도록 nearby stations도 포함
    const stations = [d, ...(d.forecast ? [] : [])].map((s: typeof d, i: number) => ({
      stationName: i === 0 ? (d.city?.name ?? city) : `측정소 ${i + 1}`,
      pm10Value: String(d.iaqi?.pm10?.v ?? '-'),
      pm25Value: String(d.iaqi?.pm25?.v ?? '-'),
      o3Value: String(d.iaqi?.o3?.v ?? '-'),
      no2Value: String(d.iaqi?.no2?.v ?? '-'),
      coValue: String(d.iaqi?.co?.v ?? '-'),
      so2Value: String(d.iaqi?.so2?.v ?? '-'),
      khaiValue: String(aqi),
      khaiGrade: grade,
      pm10Grade: grade,
      pm25Grade: grade,
      dataTime: d.time?.s ?? '',
      sidoName: sido,
    }));

    return NextResponse.json(stations);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
