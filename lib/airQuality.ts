const API_KEY = process.env.AIR_QUALITY_API_KEY!;
const BASE_URL = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc';

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

export async function getSidoAirQuality(sidoName: string = '서울'): Promise<StationData[]> {
  const params = new URLSearchParams({
    serviceKey: API_KEY,
    returnType: 'json',
    numOfRows: '20',
    pageNo: '1',
    sidoName,
    ver: '1.0',
  });

  const res = await fetch(`${BASE_URL}/getCtprvnRltmMesureDnsty?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`API 호출 실패: ${res.status}`);

  const json = await res.json();
  return json?.response?.body?.items ?? [];
}

export async function getMostRecentNational(): Promise<StationData[]> {
  const sidos = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기'];
  const results = await Promise.allSettled(sidos.map((sido) => getSidoAirQuality(sido)));

  const data: StationData[] = [];
  results.forEach((result, i) => {
    if (result.status === 'fulfilled' && result.value.length > 0) {
      const first = { ...result.value[0], sidoName: sidos[i] };
      data.push(first);
    }
  });
  return data;
}
