'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    const res = await fetch('/api/register', { method: 'POST' });
    if (res.ok) {
      router.push('/dashboard');
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        <div className="text-5xl mb-4">🌤️</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">회원가입</h1>
        <p className="text-gray-500 mb-6 text-sm">전국 대기질 대시보드</p>

        <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-gray-600 mb-1">가입할 계정</p>
          <p className="font-semibold text-gray-800">{session?.user?.name}</p>
          <p className="text-sm text-gray-500">{session?.user?.email}</p>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition cursor-pointer"
        >
          {loading ? '가입 중...' : '회원가입 완료'}
        </button>

        <p className="mt-4 text-xs text-gray-400">버튼을 클릭하면 서비스 이용이 가능합니다</p>
      </div>
    </div>
  );
}
