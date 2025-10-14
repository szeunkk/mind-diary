# Vibe Coding

Next.js와 Storybook을 활용한 컴포넌트 기반 프론트엔드 프로젝트입니다.

## 📋 프로젝트 소개

이 프로젝트는 재사용 가능한 UI 컴포넌트를 개발하고 관리하기 위한 프로젝트입니다.
Storybook을 통해 독립적으로 컴포넌트를 개발하고 테스트할 수 있으며, Next.js의 최신 App Router를 활용합니다.

## 🛠️ 기술 스택

- **Framework**: Next.js 14.2.32
- **UI**: React 18, Tailwind CSS
- **상태 관리**: TanStack Query (React Query)
- **테마**: next-themes
- **개발 도구**: Storybook, TypeScript, ESLint

## 📦 프로젝트 구조

```
vibe-coding/
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

1. 새로운 컴포넌트는 `src/commons/components/` 디렉토리에 추가합니다.
2. 각 컴포넌트는 해당하는 Storybook 스토리 파일(`.stories.tsx`)을 포함해야 합니다.
3. TypeScript를 사용하여 타입 안정성을 확보합니다.
4. Tailwind CSS를 활용하여 스타일링합니다.

## 🌙 다크 모드

이 프로젝트는 `next-themes`를 사용하여 다크 모드를 지원합니다.

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.

## 🔗 참고 자료

- [Next.js Documentation](https://nextjs.org/docs)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
