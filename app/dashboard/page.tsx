import { auth } from '@/lib/auth';
import { signOut } from '@/lib/auth';
import { GRADE_COLORS, GRADE_LABELS } from '@/lib/airQuality';
import AirQualityChart from '@/components/AirQualityChart';
import SidoSelector from '@/components/SidoSelector';
import NationalAirQuality from '@/components/NationalAirQuality';

export default async function DashboardPage() {
  const session = await auth();

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
          <div className="flex items-center gap-3">
            <a href="/guestbook" className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg transition font-medium">
              방명록
            </a>
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
        {/* 주요 도시 현황 카드 - 클라이언트에서 직접 호출 */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">주요 도시 대기질 현황</h2>
          <NationalAirQuality />
        </section>

        {/* 지역별 상세 차트 */}
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
          데이터 출처: 한국환경공단 에어코리아 (data.go.kr) · 실시간 업데이트
        </footer>
      </main>
    </div>
  );
}
