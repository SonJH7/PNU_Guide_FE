# 📘 README — PNU Tour (Mobile Web)

> 부산대 캠퍼스 투어 웹앱
>
> React + Vite + TypeScript + Tailwind · React Query · MSW · Vitest
>
> 배포: **Vercel** (PR마다 자동 Preview)

---

## Table of Contents

1. [개요]
2. [주요 기능]
3. [기술 스택]
4. [빠른 시작]
5. [환경변수]
6. [스크립트]
7. [폴더 구조]
8. [코드 규칙(ESLint/Prettier/Husky)]
9. [테스트(Vitest/RTL/MSW)]
10. [지도/내비 연동(네이버)]
11. [배포(CI/CD, Vercel)]
12. [PWA 계획(후순위)]
13. [접근성·성능 기준]
14. [FAQ & Troubleshooting]
15. [브랜치/PR 규칙]

---

## 개요

**PNU Tour**는 방문객·수험생·학부모가 **모바일로 바로 쓰는 캠퍼스 투어 웹앱**입니다.

- 테마 **코스** → **스탬프(사진 단말 판별)** → **퀴즈** → **네이버 내비 원클릭**
- (확장) **행사/식단/학과 개방 행사 공지 피드**, 웹푸시(PWA 전환 시)

> 웹 우선 전략 → 스마트캠퍼스 메뉴 연동이 쉽고, PR마다 Preview URL로 디자인/기능 리뷰가 빠릅니다.

---

## 주요 기능

- **모바일 퍼스트 UI** (Tailwind)
- **React Query** 기반 데이터 캐싱
- **네이버 지도/내비 딥링크** (앱/웹 폴백)
- **익명 모드** + (옵션) 간편 로그인
- **테스트/목킹**: Vitest + Testing Library + **MSW**
- **품질 자동화**: ESLint/Prettier/Husky/lint‑staged
- **Vercel**: main=프로덕션, PR=자동 Preview

---

## 기술 스택

- **App**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS (+ Headless UI/Radix 선택적)
- **Data**: @tanstack/react-query, axios
- **Test**: Vitest, @testing-library/react, jest-dom, MSW
- **Lint/Format**: ESLint v9(Flat), Prettier, Husky, lint-staged
- **Deploy**: Vercel (GitHub 연동 자동 배포), GitHub Actions(테스트/빌드 CI)

아키텍처(요약)

```
Browser
 ├─ React App (Vite, Tailwind)
 ├─ React Query / axios  → 공개 API(행사/식단/공지, 우리 CMS)
 ├─ Naver Maps JS SDK    → 지도/경로
 └─ 딥링크 nmap://...    → 네이버 내비 (웹 폴백)

```

---

## 빠른 시작

### 1) 사전 요구

- Node **20+**
- npm (또는 pnpm/yarn)

### 2) 설치 & 실행

```bash
npm ci
npm run dev
# → http://localhost:5173

```

> ⚠️ Vite 생성 시 보이는 Use rolldown-vite (Experimental)? 질문은 No가 정답입니다.
>
> Rolldown은 Rust 기반 실험 번들러로, 아직 플러그인 호환성이 부족합니다.

---

## 스크립트

```json
"dev": "vite",
"build": "tsc -b && vite build",
"preview": "vite preview",
"lint": "eslint .",
"format": "prettier --write .",
"typecheck": "tsc -b --pretty",
"test": "vitest",
"test:run": "vitest run",
"test:coverage": "vitest run --coverage"

```

---

## 폴더 구조

```
src/
  app/            # Providers, Router
  pages/          # Home, CourseList, SpotDetail, Quiz, Notices
  features/       # course/ stamp/ quiz/ notice/ (API + hooks + UI)
  components/ui/  # 공용 버튼/모달/BottomSheet 등
  widgets/        # Map, NaverNavButton, StampUploader
  lib/            # axios client, env, analytics
  mocks/          # msw handlers/server
  test/           # vitest setup
  styles/         # index.css (Tailwind)
  types/          # fontsource.d.ts 등

```

---

## 코드 규칙(ESLint/Prettier/Husky)

- **ESLint v9 (Flat)** + React/TS/Hooks/import/a11y
- **Prettier**: 포맷 전담(ESLint 충돌 방지 설정 포함)
- **Husky + lint‑staged**: 커밋 전 `eslint --fix` + `prettier --write` + **관련 테스트** 실행

커밋 메시지: **Conventional Commits**

`feat:`, `fix:`, `chore:`, `refactor:`, `test:` …

---

## 테스트(Vitest/RTL/MSW)

- **Vitest**: 빠른 러너 (jsdom 환경)
- **Testing Library**: 사용자 시나리오 중심 DOM 테스트
- **MSW**: API 모킹. 테스트/개발에서 서버 없이 동작

설정: `vite.config.ts > test`, `src/test/setup.ts`, `src/mocks/*`

샘플:

```tsx
import axios from 'axios';

test('fetch greeting', async () => {
  const res = await axios.get('/api/greeting');
  expect(res.data.message).toBe('Hello, PNU!');
});
```

---

## 배포(CI/CD, Vercel)

### 1) Vercel 프로젝트 준비

1. [Vercel](https://vercel.com/)에서 GitHub 저장소를 Import 합니다.
2. Framework Preset은 **Vite**, Build Command는 `npm run build`, Output Directory는 `dist`로 자동 인식됩니다.
3. SPA 라우팅을 위해 다음 내용을 `vercel.json`에 추가합니다.

   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
   ```

4. Preview / Production 환경 변수는 **Project Settings → Environment Variables**에서 분리해서 등록합니다.

### 2) GitHub 연동 & 자동 배포

1. Vercel 프로젝트 **Settings → Git**에서 이 저장소를 연결하면, GitHub App이 **PR 생성 시 Preview**, **`main`에 머지되면 Production**을 자동으로 배포합니다.
2. 별도 GitHub Actions 배포 파이프라인 없이도 Preview URL이 PR에 자동으로 남고, `main` 브랜치에는 Production 배포가 트리거됩니다.
3. 포크 PR은 GitHub 보안 정책에 따라 환경 변수 사용이 제한될 수 있으니, 필요하다면 Vercel 프로젝트 **Settings → Git**에서 `Automatically expose Preview Deployments for forked pull requests` 옵션을 확인하세요.

### 3) GitHub Actions CI

- `.github/workflows/ci.yml`
  - `main`, `develop` 브랜치 대상 **push/PR**에서 린트 · 테스트 · 빌드를 검증합니다.

### 4) 로컬에서 수동 배포 (선택)

```bash
npm i -g vercel
vercel login                # 최초 1회
vercel pull --environment=preview
vercel build
vercel deploy --prebuilt    # preview 배포
vercel deploy --prebuilt --prod  # production 배포
```

Preview 배포 URL은 `vercel deploy` 명령 결과 또는 PR 댓글에서 확인할 수 있습니다.

### 5) Vercel Speed Insights · Analytics 계측

1. 의존성 설치

   ```bash
   npm install @vercel/speed-insights @vercel/analytics
   ```

2. 엔트리 파일(`src/main.tsx`)에서 계측 컴포넌트를 추가합니다.

   ```tsx
   import { Analytics } from '@vercel/analytics/react';
   import { SpeedInsights } from '@vercel/speed-insights/react';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <RouterProvider router={router} />
       <Analytics />
       <SpeedInsights />
     </React.StrictMode>,
   );
   ```

3. 변경 사항을 배포하고, 배포 URL을 방문해 페이지 간을 탐색하면 아래 대시보드에서 메트릭이 수집되기 시작합니다.
   - **Speed Insights** → Performance (Production/Mobile/Desktop)
   - **Analytics** → 방문자 수, 페이지 뷰, 체류 시간 등 트래픽 리포트

   데이터가 안 보이면 브라우저 콘텐츠 차단기를 해제한 뒤 다시 새로고침해 주세요.

---

## PWA 계획(후순위)

- MVP 안정화 후 `vite-plugin-pwa` 도입
- `manifest.webmanifest`/Workbox 캐싱 → 홈 화면 설치
- **웹푸시(안드로이드)**, iOS는 제한 → 네이티브 래핑 후 FCM 고려

---

## 접근성·성능 기준

- 터치 영역 **≥ 44px**, 대비비율 **≥ 4.5:1**
- 키보드 포커스 링 표시, 이미지 대체 텍스트
- Lighthouse **≥ 80** (Performance/Accessibility)

---

## FAQ & Troubleshooting

**Q. `Use rolldown‑vite (Experimental)?`는 뭔가요?**

A. Vite의 실험 번들러(롤다운) 사용 여부입니다. **지금은 “No”** 선택이 안전합니다.

**Q. iOS에서 푸시가 안 와요.**

A. 웹푸시는 iOS 사파리 제한이 있습니다. PWA/네이티브 전환 시 FCM을 붙입니다.

**Q. 네이버 앱이 없으면?**

A. 딥링크 실패 시 **웹 지도**로 자동 폴백됩니다.

---

## 브랜치/PR 규칙

- 브랜치: `feat/…`, `fix/…`, `chore/…`
- PR 템플릿(요약/변경/스크린샷/테스트/체크리스트)
- **PR 체크리스트**
  - [ ] ESLint/Prettier 통과
  - [ ] 관련 테스트 추가 & 통과
  - [ ] 접근성(포커스/대체텍스트)
  - [ ] 모바일 360–430px 확인
  - [ ] PR Preview 링크 캡처/공유
