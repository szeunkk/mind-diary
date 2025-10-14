# MIND DIARY

Next.js와 Storybook을 활용한 컴포넌트 기반 프론트엔드 프로젝트입니다.

## 📋 프로젝트 소개

이 프로젝트는 재사용 가능한 UI 컴포넌트를 개발하고 관리하기 위한 프로젝트입니다.
Storybook을 통해 독립적으로 컴포넌트를 개발하고 테스트할 수 있으며, Next.js의 최신 App Router를 활용합니다.

## 🛠️ 기술 스택

- **Framework**: Next.js 14.2.32
- **UI**: React 18, CSS Module
- **상태 관리**: TanStack Query (React Query)
- **폼 관리**: React Hook Form
- **검증**: Zod
- **테마**: next-themes
- **테스트**: Playwright
- **개발 도구**: Storybook, TypeScript, ESLint

## 📦 프로젝트 구조

```
mind-diary/
├── src/
│   ├── app/              # Next.js App Router 페이지
│   └── commons/          # 공통 컴포넌트 및 유틸리티
│       ├── components/   # 재사용 가능한 UI 컴포넌트
│       ├── constants/    # 상수 및 설정
│       └── providers/    # Context 및 Provider
├── public/               # 정적 파일
│   ├── icons/           # SVG 아이콘
│   └── images/          # 이미지 파일
└── storybook-static/    # Storybook 빌드 결과물
```

## 🚀 실행 방법

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인할 수 있습니다.

### Storybook 실행

컴포넌트를 독립적으로 개발하고 테스트하려면:

```bash
npm run storybook
```

브라우저에서 [http://localhost:6006](http://localhost:6006)을 열어 Storybook을 확인할 수 있습니다.

## 🔨 빌드

### 프로덕션 빌드

```bash
npm run build
```

### 프로덕션 서버 실행

```bash
npm run start
```

### Storybook 빌드

```bash
npm run build-storybook
```

## 📝 테스트

### Lint 검사

코드 품질 및 스타일 검사:

```bash
npm run lint
```

### E2E 테스트

Playwright를 사용한 End-to-End 테스트:

```bash
# 테스트 실행
npm run test:e2e

# 테스트 UI 모드로 실행
npm run test:e2e:ui

# 테스트 헤드리스 모드로 실행
npm run test:e2e:headless
```

## 📚 주요 컴포넌트

프로젝트에 포함된 주요 컴포넌트:

- **Button**: 다양한 스타일과 상태를 가진 버튼 컴포넌트
- **Input**: 입력 필드 컴포넌트
- **Pagination**: 페이지네이션 컴포넌트
- **SearchBar**: 검색 바 컴포넌트
- **SelectBox**: 선택 박스 컴포넌트
- **Toggle**: 토글 스위치 컴포넌트

각 컴포넌트의 사용 예시는 Storybook에서 확인할 수 있습니다.

## 🎨 개발 가이드

### 컴포넌트 개발

1. 새로운 컴포넌트는 `src/commons/components/` 디렉토리에 추가합니다.
2. 각 컴포넌트는 해당하는 Storybook 스토리 파일(`.stories.tsx`)을 포함해야 합니다.
3. TypeScript를 사용하여 타입 안정성을 확보합니다.

### 스타일링

- **CSS Module 사용**: 모든 스타일링은 CSS Module(`.module.css`)을 사용합니다.
- **Flexbox 기반**: 레이아웃은 Flexbox를 기반으로 구현합니다.
- **전역 스타일**: `src/app/globals.css`는 전역적으로 필요한 경우에만 수정합니다.
- **금지 사항**: `:global`, `:root`, `!important`, `position: absolute` 사용 금지

### 상수 관리

- **ENUM**: `src/commons/constants/enum.ts`에서 구조화된 타입 관리
- **URL**: `src/commons/constants/url.ts`에서 페이지 경로 및 메타데이터 관리

### 폼 및 검증

- **폼 관리**: React Hook Form을 사용하여 폼 상태 관리
- **검증 로직**: Zod를 사용하여 스키마 기반 검증 구현

### API 통신

- **상태 관리**: TanStack Query (React Query)를 사용하여 서버 상태 관리
- **Provider 설정**: `src/commons/providers/`에서 설정된 Provider 사용

### 테스트

- **TDD 방식**: Playwright를 사용한 End-to-End 테스트 우선 작성
- **테스트 식별자**: CSS Module과의 충돌 방지를 위해 `data-testid` 사용
- **실제 데이터**: Mock 데이터 대신 실제 데이터로 테스트 수행

## 📋 개발 규칙

### 공통 규칙

1. **파일 수정 제한**: 명시된 파일 이외에는 수정 금지
2. **라이브러리 제한**: 명시하지 않은 라이브러리 설치 금지
3. **독립적 구조**: 추후 수정이 쉽도록 독립적인 부품들의 조립 형태로 구현

### Git 규칙

- **커밋 메시지**: Conventional Commits 방식으로 한국어 커밋 메시지 작성

### 권한 관리

- **기본 설정**: 로그인 유저를 기본값으로 모든 페이지 접근 가능
- **테스트 시나리오**: `window.TEST_BYPASS` 플래그를 통한 권한 테스트

## 🌙 다크 모드

이 프로젝트는 `next-themes`를 사용하여 다크 모드를 지원합니다.

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

## 🔗 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
