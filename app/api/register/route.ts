import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import db from '@/lib/db';

export async function POST() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  await db.execute({
    sql: `INSERT OR IGNORE INTO allowed_users (email) VALUES (?)`,
    args: [session.user.email],
  });

  return NextResponse.json({ success: true });
}
