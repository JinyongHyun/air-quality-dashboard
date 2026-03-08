'use client';

const SIDOS = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '세종'];

export default function SidoSelector() {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    window.dispatchEvent(new CustomEvent('sidoChange', { detail: e.target.value }));
  };

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-600">지역 선택</label>
      <select
        onChange={handleChange}
        defaultValue="서울"
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {SIDOS.map((sido) => (
          <option key={sido} value={sido}>{sido}</option>
        ))}
      </select>
    </div>
  );
}
