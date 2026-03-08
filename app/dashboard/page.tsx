import { auth } from '@/lib/auth';
import { getMostRecentNational, GRADE_COLORS, GRADE_LABELS } from '@/lib/airQuality';
import { signOut } from '@/lib/auth';
import AirQualityChart from '@/components/AirQualityChart';
import SidoSelector from '@/components/SidoSelector';

export const revalidate = 3600; // 1시간 캐시

export default async function DashboardPage() {
  const session = await auth();
  const data = await getMostRecentNational().catch(() => []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌤️</span>
            <div>
              <h1 className="text-xl font-bold text-gray-800">전국 대기질 대시보드</h1>
              <p className="text-xs text-gray-400">한국환경공단 에어코리아 실시간 데이터</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">{session?.user?.email}</span>
            <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }); }}>
              <button type="submit" className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition cursor-pointer">
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* 지역별 현황 카드 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">주요 도시 대기질 현황</h2>
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
        </section>

        {/* 차트 및 지역 선택 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">지역별 상세 조회</h2>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <SidoSelector />
            <AirQualityChart />
          </div>
        </section>

        {/* 등급 기준 안내 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">대기질 등급 기준</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(GRADE_LABELS).map(([grade, label]) => (
              <div key={grade} className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: GRADE_COLORS[grade] }} />
                <div>
                  <div className="font-semibold text-gray-700">{label}</div>
                  <div className="text-xs text-gray-400">
                    {grade === '1' && 'PM2.5 0~15 ㎍/㎥'}
                    {grade === '2' && 'PM2.5 16~35 ㎍/㎥'}
                    {grade === '3' && 'PM2.5 36~75 ㎍/㎥'}
                    {grade === '4' && 'PM2.5 76+ ㎍/㎥'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-10 text-center text-xs text-gray-400">
          데이터 출처: 한국환경공단 에어코리아 (data.go.kr) · 1시간마다 업데이트
        </footer>
      </main>
    </div>
  );
}
