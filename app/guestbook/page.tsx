import { auth } from '@/lib/auth';
import { signOut } from '@/lib/auth';
import GuestbookClient from '@/components/GuestbookClient';

export default async function GuestbookPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-blue-500 hover:underline text-sm">← 대시보드</a>
            <h1 className="text-xl font-bold text-gray-800">방명록</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:block">{session?.user?.email}</span>
            <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }); }}>
              <button type="submit" className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition cursor-pointer">
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <GuestbookClient userEmail={session?.user?.email ?? ''} userName={session?.user?.name ?? ''} />
      </main>
    </div>
  );
}
