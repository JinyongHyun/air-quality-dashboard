import { auth } from './lib/auth';
import { NextResponse } from 'next/server';
import { isAllowedUser } from './lib/db';

export default auth(async (req) => {
  const { pathname } = req.nextUrl;

  // 공개 경로는 통과
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/init') ||
    pathname.startsWith('/api/debug') ||
    pathname.startsWith('/api/register')
  ) {
    return NextResponse.next();
  }

  // 로그인 안 된 경우
  if (!req.auth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 로그인은 됐지만 DB에 없는 신규 사용자 → 회원가입 페이지
  const email = req.auth.user?.email;
  if (email) {
    const allowed = await isAllowedUser(email);
    if (!allowed) {
      return NextResponse.redirect(new URL('/register', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
