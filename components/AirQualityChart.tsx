'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StationData } from '@/lib/airQuality';

const BASE_URL = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc';

async function fetchSidoData(sido: string): Promise<StationData[]> {
  const key = process.env.NEXT_PUBLIC_AIR_QUALITY_API_KEY!;
  const url = `${BASE_URL}/getCtprvnRltmMesureDnsty?serviceKey=${key}&returnType=json&numOfRows=20&pageNo=1&sidoName=${encodeURIComponent(sido)}&ver=1.0`;
  const res = await fetch(url);
  const json = await res.json();
  return json?.response?.body?.items ?? [];
}

export default function AirQualityChart() {
  const [data, setData] = useState<StationData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = (sido: string) => {
    setLoading(true);
    fetchSidoData(sido)
      .then((d) => setData(d.slice(0, 10)))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData('서울');
    const handler = (e: Event) => loadData((e as CustomEvent).detail);
    window.addEventListener('sidoChange', handler);
    return () => window.removeEventListener('sidoChange', handler);
  }, []);

  const chartData = data.map((s) => ({
    name: s.stationName,
    PM10: Number(s.pm10Value) || 0,
    'PM2.5': Number(s.pm25Value) || 0,
  }));

  if (loading) return <div className="h-64 flex items-center justify-center text-gray-400">불러오는 중...</div>;
  if (chartData.length === 0) return <div className="h-64 flex items-center justify-center text-gray-400">데이터 없음</div>;

  return (
    <div className="mt-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit=" ㎍" />
          <Tooltip formatter={(val) => `${val} ㎍/㎥`} />
          <Legend />
          <Bar dataKey="PM10" fill="#60a5fa" radius={[4, 4, 0, 0]} />
          <Bar dataKey="PM2.5" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
