'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StationData } from '@/lib/airQuality';

export default function AirQualityChart() {
  const [data, setData] = useState<StationData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const sido = (e as CustomEvent).detail;
      setLoading(true);
      fetch(`/api/air-quality?sido=${encodeURIComponent(sido)}`)
        .then((r) => r.json())
        .then((d) => setData(d.slice(0, 10)))
        .catch(() => setData([]))
        .finally(() => setLoading(false));
    };
    window.addEventListener('sidoChange', handler);
    // 초기 로드
    fetch('/api/air-quality?sido=서울')
      .then((r) => r.json())
      .then((d) => setData(d.slice(0, 10)))
      .catch(() => setData([]));
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
