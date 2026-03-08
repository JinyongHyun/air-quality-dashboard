# 아키텍처 문서

## 시스템 개요

```
사용자 브라우저
    │
    ▼
[Vercel Edge Network]
    │
    ▼
[Next.js App (App Router)]
    ├── middleware.ts          # 인증 게이트웨이 (모든 요청 검사)
    ├── app/login/page.tsx     # 로그인 페이지
    ├── app/dashboard/page.tsx # 대시보드 (Server Component)
    ├── app/api/auth/          # NextAuth 핸들러
    ├── app/api/air-quality/   # 공공데이터 API 프록시
    └── app/api/init/          # DB 초기화 엔드포인트
         │
         ├── [Turso DB] ──── allowed_users 테이블
         │   libsql://...turso.io
         │
         └── [에어코리아 API] ──── 실시간 대기질 데이터
             apis.data.go.kr
```

## 인증 플로우

```
1. 사용자 접근
      │
      ▼
2. middleware.ts 검사
      │
      ├─ 로그인 안됨 → /login 리디렉션
      │
      └─ 로그인됨 → 페이지 접근 허용
           │
           ▼
3. Google OAuth (NextAuth)
      │
      ▼
4. signIn 콜백 → isAllowedUser(email) 호출
      │
      ├─ allowed_users 테이블에 없음 → AccessDenied
      │
      └─ 있음 → 세션 생성 → 대시보드 접근
```

## 디렉토리 구조

```
air-quality-dashboard/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth 핸들러
│   │   ├── air-quality/route.ts         # 에어코리아 API 프록시
│   │   └── init/route.ts                # DB 초기화
│   ├── dashboard/page.tsx               # 메인 대시보드 (Server)
│   ├── login/page.tsx                   # 로그인 페이지 (Client)
│   ├── layout.tsx                       # 루트 레이아웃
│   └── page.tsx                         # / → /dashboard 리디렉션
├── components/
│   ├── AirQualityChart.tsx              # Recharts 막대 차트 (Client)
│   └── SidoSelector.tsx                 # 시도 선택 드롭다운 (Client)
├── lib/
│   ├── auth.ts                          # NextAuth 설정
│   ├── db.ts                            # Turso DB 클라이언트
│   └── airQuality.ts                    # 에어코리아 API 유틸
├── middleware.ts                         # 전역 인증 미들웨어
├── .env.local                           # 환경변수 (git 제외)
├── README.md
└── ARCHITECTURE.md
```

## 데이터베이스 스키마

```sql
CREATE TABLE allowed_users (
  id         INTEGER  PRIMARY KEY AUTOINCREMENT,
  email      TEXT     UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 환경변수 목록

| 변수명 | 용도 |
|--------|------|
| `NEXTAUTH_URL` | NextAuth 콜백 기본 URL |
| `NEXTAUTH_SECRET` | 세션 암호화 키 |
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 클라이언트 시크릿 |
| `TURSO_DATABASE_URL` | Turso DB 연결 URL |
| `TURSO_AUTH_TOKEN` | Turso 인증 토큰 |
| `AIR_QUALITY_API_KEY` | 공공데이터포털 API 인증키 |

## 보안 설계

- `.env.local`은 `.gitignore`에 포함되어 GitHub에 노출되지 않음
- 미들웨어에서 모든 요청에 대해 세션 검증
- signIn 콜백에서 DB 조회로 화이트리스트 검증
- API 키는 서버 사이드에서만 사용 (클라이언트 노출 없음)
