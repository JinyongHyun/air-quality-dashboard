const WAQI_TOKEN = process.env.WAQI_TOKEN!;

export interface StationData {
  stationName: string;
  pm10Value: string;
  pm25Value: string;
  o3Value: string;
  no2Value: string;
  coValue: string;
  so2Value: string;
  khaiValue: string;
  khaiGrade: string;
  pm10Grade: string;
  pm25Grade: string;
  dataTime: string;
  sidoName?: string;
  cityName?: string;
}

export const GRADE_LABELS: Record<string, string> = {
  '1': '좋음',
  '2': '보통',
  '3': '나쁨',
  '4': '매우나쁨',
};

export const GRADE_COLORS: Record<string, string> = {
  '1': '#4ade80',
  '2': '#facc15',
  '3': '#f97316',
  '4': '#ef4444',
};

// AQI 값을 한국 등급 기준으로 변환
function aqiToGrade(aqi: number): string {
  if (aqi <= 50) return '1';
  if (aqi <= 100) return '2';
  if (aqi <= 150) return '3';
  return '4';
}

interface WaqiStation {
  city: string;
  label: string;
}

export const KOREAN_CITIES: WaqiStation[] = [
  { city: 'seoul', label: '서울' },
  { city: 'busan', label: '부산' },
  { city: 'daegu', label: '대구' },
  { city: 'incheon', label: '인천' },
  { city: 'gwangju', label: '광주' },
  { city: 'daejeon', label: '대전' },
  { city: 'ulsan', label: '울산' },
  { city: 'suwon', label: '경기' },
];

export async function getCityAirQuality(city: string): Promise<StationData | null> {
  const res = await fetch(
    `https://api.waqi.info/feed/${city}/?token=${WAQI_TOKEN}`,
    { next: { revalidate: 1800 } }
  );
  const json = await res.json();
  if (json.status !== 'ok') return null;

  const d = json.data;
  const aqi = Number(d.aqi) || 0;
  const grade = aqiToGrade(aqi);
  const pm25 = String(d.iaqi?.pm25?.v ?? '-');
  const pm10 = String(d.iaqi?.pm10?.v ?? '-');

  return {
    stationName: d.city?.name ?? city,
    pm10Value: pm10,
    pm25Value: pm25,
    o3Value: String(d.iaqi?.o3?.v ?? '-'),
    no2Value: String(d.iaqi?.no2?.v ?? '-'),
    coValue: String(d.iaqi?.co?.v ?? '-'),
    so2Value: String(d.iaqi?.so2?.v ?? '-'),
    khaiValue: String(aqi),
    khaiGrade: grade,
    pm10Grade: grade,
    pm25Grade: grade,
    dataTime: d.time?.s ?? '',
    cityName: city,
  };
}

export async function getMostRecentNational(): Promise<StationData[]> {
  const results = await Promise.allSettled(
    KOREAN_CITIES.map((c) => getCityAirQuality(c.city).then((d) => d ? { ...d, sidoName: c.label } : null))
  );
  return results
    .filter((r): r is PromiseFulfilledResult<StationData> => r.status === 'fulfilled' && r.value !== null)
    .map((r) => r.value);
}
