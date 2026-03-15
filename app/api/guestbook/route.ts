import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import db from '@/lib/db';

export async function GET() {
  const result = await db.execute(
    'SELECT id, author_name, author_email, content, created_at FROM guestbook ORDER BY created_at DESC'
  );
  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const { content } = await req.json();
  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: '내용을 입력해주세요.' }, { status: 400 });
  }
  if (content.length > 500) {
    return NextResponse.json({ error: '500자 이내로 입력해주세요.' }, { status: 400 });
  }

  await db.execute({
    sql: 'INSERT INTO guestbook (author_email, author_name, content) VALUES (?, ?, ?)',
    args: [session.user.email, session.user.name ?? session.user.email, content.trim()],
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const { id } = await req.json();
  await db.execute({
    sql: 'DELETE FROM guestbook WHERE id = ? AND author_email = ?',
    args: [id, session.user.email],
  });

  return NextResponse.json({ success: true });
}
