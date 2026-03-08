'use client';

import { useEffect, useState } from 'react';
import { StationData, GRADE_COLORS, GRADE_LABELS } from '@/lib/airQuality';

const SIDOS = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기'];

export default function NationalAirQuality() {
  const [data, setData] = useState<StationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      SIDOS.map((sido) =>
        fetch(`/api/air-quality?sido=${encodeURIComponent(sido)}`)
          .then((r) => r.json())
          .then((items: StationData[]) => (items.length > 0 ? { ...items[0], sidoName: sido } : null))
          .catch(() => null)
      )
    ).then((results) => {
      setData(results.filter((d): d is StationData => d !== null));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {SIDOS.map((s) => (
          <div key={s} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 animate-pulse h-28" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return <p className="text-gray-400 text-sm">데이터를 불러올 수 없습니다.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {data.map((station) => {
        const grade = station.khaiGrade;
        const color = GRADE_COLORS[grade] ?? '#94a3b8';
        const label = GRADE_LABELS[grade] ?? '-';
        return (
          <div key={station.stationName} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-700">{station.sidoName}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>{label}</span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>PM10</span><span className="font-medium">{station.pm10Value ?? '-'} ㎍/㎥</span>
              </div>
              <div className="flex justify-between">
                <span>PM2.5</span><span className="font-medium">{station.pm25Value ?? '-'} ㎍/㎥</span>
              </div>
              <div className="flex justify-between">
                <span>통합지수</span><span className="font-medium">{station.khaiValue ?? '-'}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
