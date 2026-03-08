# 전국 대기질 대시보드

WAQI(World Air Quality Index) API를 활용한 실시간 전국 미세먼지·대기질 현황 대시보드 웹서비스입니다.

## 주요 기능

- **실시간 대기질 현황**: 전국 주요 도시(서울, 부산, 대구 등) PM10, PM2.5, AQI 통합지수 표시
- **지역별 차트**: 시도 선택 시 해당 지역 측정소별 막대 차트 시각화
- **Google OAuth 로그인**: 허용된 계정만 접근 가능한 보안 인증
- **접근 허용 리스트**: Turso DB에 저장된 허용 이메일 목록 기반 접근 제어

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 인증 | NextAuth.js v5 + Google OAuth 2.0 |
| 데이터베이스 | Turso (libSQL / SQLite Edge) |
| 차트 | Recharts |
| 배포 | Vercel |
| 데이터 | WAQI API (한국 주요 도시 실시간 대기질) |

## 환경 변수

`.env.local` 파일에 아래 값을 설정하세요:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<랜덤 시크릿>
GOOGLE_CLIENT_ID=<Google Cloud Console에서 발급>
GOOGLE_CLIENT_SECRET=<Google Cloud Console에서 발급>
TURSO_DATABASE_URL=libsql://<your-db>.turso.io
TURSO_AUTH_TOKEN=<Turso에서 발급>
AIR_QUALITY_API_KEY=<공공데이터포털에서 발급>
WAQI_TOKEN=<aqicn.org에서 발급>
```

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 후, 최초 1회 DB 초기화:
```
http://localhost:3000/api/init
```

## 접근 허용 계정

Turso DB의 `allowed_users` 테이블에 등록된 이메일만 로그인 가능합니다.
기본 등록 계정: `23@kookmin.ac.kr`, `wlsdyd4270@gmail.com`

## 배포

GitHub 저장소에 push하면 Vercel을 통해 자동 배포됩니다.
Vercel 프로젝트 설정의 Environment Variables에 위 환경변수를 모두 등록하세요.

## 데이터 출처

- **WAQI (World Air Quality Index)**: https://waqi.info/
- **데이터 원천**: AirKorea (한국환경공단 에어코리아) 기반
- **공공데이터포털**: https://www.data.go.kr/
- **갱신주기**: 실시간
