import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import Button from "./index";
import Image from "next/image";

// 실제 프로젝트 아이콘들을 위한 컴포넌트
const PlusIcon = () => (
  <Image src="/icons/plus_outline_light_m.svg" alt="plus" width={24} height={24} />
);

const CheckIcon = () => (
  <Image src="/icons/check_outline_light_xs.svg" alt="check" width={16} height={16} />
);

const SearchIcon = () => (
  <Image src="/icons/search_outline_light_m.svg" alt="search" width={24} height={24} />
);

const BackIcon = () => (
  <Image src="/icons/back_outline_light_m.svg" alt="back" width={24} height={24} />
);


const CopyIcon = () => (
  <Image src="/icons/copy_outline_light_m.svg" alt="copy" width={24} height={24} />
);

const meta: Meta<typeof Button> = {
  title: "Commons/Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Button 컴포넌트는 다양한 스타일과 크기를 지원하는 재사용 가능한 버튼 컴포넌트입니다.

## 주요 특징
- 3가지 variant: primary, secondary, tertiary
- 3가지 size: small, medium, large  
- 2가지 theme: light, dark
- 아이콘 지원
- 접근성 준수
- 반응형 디자인

## 사용법
\`\`\`tsx
import Button from "@/commons/components/button";

<Button variant="primary" size="medium">
  버튼 텍스트
</Button>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary"],
      description: "버튼의 시각적 스타일을 결정합니다.",
      table: {
        type: { summary: "primary | secondary | tertiary" },
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "버튼의 크기를 결정합니다.",
      table: {
        type: { summary: "small | medium | large" },
        defaultValue: { summary: "medium" },
      },
    },
    theme: {
      control: { type: "select" },
      options: ["light", "dark"],
      description: "버튼의 테마를 결정합니다.",
      table: {
        type: { summary: "light | dark" },
        defaultValue: { summary: "light" },
      },
    },
    disabled: {
      control: { type: "boolean" },
      description: "버튼의 비활성화 상태를 결정합니다.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    children: {
      control: { type: "text" },
      description: "버튼 내부에 표시될 텍스트 또는 컨텐츠입니다.",
      table: {
        type: { summary: "React.ReactNode" },
      },
    },
    icon: {
      control: false,
      description: "버튼에 표시될 아이콘입니다.",
      table: {
        type: { summary: "React.ReactNode" },
      },
    },
    onClick: {
      action: "clicked",
      description: "버튼 클릭 시 실행될 함수입니다.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ===== 기본 스토리 =====
export const Default: Story = {
  args: {
    children: "일기쓰기",
  },
};

// ===== Variant별 스토리 =====
export const Primary: Story = {
  args: {
    variant: "primary",
    children: "일기쓰기",
  },
  parameters: {
    docs: {
      description: {
        story: "기본 Primary 버튼입니다. 주요 액션에 사용됩니다.",
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "취소",
  },
  parameters: {
    docs: {
      description: {
        story: "Secondary 버튼입니다. 보조 액션에 사용됩니다.",
      },
    },
  },
};

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    children: "더보기",
  },
  parameters: {
    docs: {
      description: {
        story: "Tertiary 버튼입니다. 가장 낮은 우선순위의 액션에 사용됩니다.",
      },
    },
  },
};

// ===== Size별 스토리 =====
export const Small: Story = {
  args: {
    size: "small",
    children: "작은 버튼",
  },
  parameters: {
    docs: {
      description: {
        story: "Small 크기 버튼입니다. 제한된 공간에서 사용됩니다.",
      },
    },
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
    children: "보통 버튼",
  },
  parameters: {
    docs: {
      description: {
        story: "Medium 크기 버튼입니다. 기본 크기입니다.",
      },
    },
  },
};

export const Large: Story = {
  args: {
    size: "large",
    children: "큰 버튼",
  },
  parameters: {
    docs: {
      description: {
        story: "Large 크기 버튼입니다. 강조가 필요한 주요 액션에 사용됩니다.",
      },
    },
  },
};

// ===== Theme별 스토리 =====
export const LightTheme: Story = {
  args: {
    theme: "light",
    children: "라이트 테마",
  },
  parameters: {
    docs: {
      description: {
        story: "Light 테마 버튼입니다. 기본 테마입니다.",
      },
    },
  },
};

export const DarkTheme: Story = {
  args: {
    theme: "dark",
    children: "다크 테마",
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story: "Dark 테마 버튼입니다. 어두운 배경에서 사용됩니다.",
      },
    },
  },
};

// ===== 아이콘이 있는 버튼 스토리 =====
export const WithPlusIcon: Story = {
  args: {
    children: "일기쓰기",
    icon: <PlusIcon />,
  },
  parameters: {
    docs: {
      description: {
        story: "Plus 아이콘이 있는 버튼입니다. 새로운 항목 추가 시 사용됩니다.",
      },
    },
  },
};

export const WithCheckIcon: Story = {
  args: {
    variant: "secondary",
    children: "완료",
    icon: <CheckIcon />,
  },
  parameters: {
    docs: {
      description: {
        story: "Check 아이콘이 있는 버튼입니다. 완료나 확인 액션에 사용됩니다.",
      },
    },
  },
};

export const WithSearchIcon: Story = {
  args: {
    variant: "tertiary",
    children: "검색",
    icon: <SearchIcon />,
  },
  parameters: {
    docs: {
      description: {
        story: "Search 아이콘이 있는 버튼입니다. 검색 기능에 사용됩니다.",
      },
    },
  },
};

export const WithBackIcon: Story = {
  args: {
    variant: "secondary",
    children: "뒤로가기",
    icon: <BackIcon />,
  },
  parameters: {
    docs: {
      description: {
        story: "Back 아이콘이 있는 버튼입니다. 이전 페이지로 이동 시 사용됩니다.",
      },
    },
  },
};

// ===== 비활성화 상태 스토리 =====
export const Disabled: Story = {
  args: {
    children: "비활성화된 버튼",
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: "비활성화된 기본 버튼입니다. 클릭할 수 없는 상태입니다.",
      },
    },
  },
};

export const DisabledPrimary: Story = {
  args: {
    variant: "primary",
    children: "비활성화 Primary",
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: "비활성화된 Primary 버튼입니다.",
      },
    },
  },
};

export const DisabledSecondary: Story = {
  args: {
    variant: "secondary",
    children: "비활성화 Secondary",
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: "비활성화된 Secondary 버튼입니다.",
      },
    },
  },
};

export const DisabledTertiary: Story = {
  args: {
    variant: "tertiary",
    children: "비활성화 Tertiary",
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: "비활성화된 Tertiary 버튼입니다.",
      },
    },
  },
};

// ===== 종합 쇼케이스 스토리 =====
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "300px",
      }}
    >
      <Button variant="primary">일기쓰기</Button>
      <Button variant="secondary">취소</Button>
      <Button variant="tertiary">더보기</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "모든 variant를 한눈에 볼 수 있는 쇼케이스입니다.",
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "300px",
      }}
    >
      <Button size="small">작은 버튼</Button>
      <Button size="medium">보통 버튼</Button>
      <Button size="large">큰 버튼</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "모든 크기를 한눈에 볼 수 있는 쇼케이스입니다.",
      },
    },
  },
};

export const AllThemes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "300px",
      }}
    >
      <Button theme="light">라이트 테마</Button>
      <div style={{ padding: "20px", backgroundColor: "#1a1a1a", borderRadius: "8px" }}>
        <Button theme="dark">다크 테마</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "모든 테마를 한눈에 볼 수 있는 쇼케이스입니다.",
      },
    },
  },
};

// ===== 실제 사용 사례 예제 =====
export const RealWorldUseCases: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        width: "400px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          일기 작성 페이지
        </h3>
        <Button variant="primary" icon={<PlusIcon />}>
          일기쓰기
        </Button>
        <Button variant="secondary" icon={<BackIcon />}>
          뒤로가기
        </Button>
        <Button variant="tertiary" icon={<CopyIcon />}>
          임시저장
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          일기 목록 페이지
        </h3>
        <Button variant="primary" icon={<SearchIcon />}>
          일기 검색
        </Button>
        <Button variant="secondary">
          필터링
        </Button>
        <Button variant="tertiary" size="small">
          더보기
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          폼 액션 버튼들
        </h3>
        <div style={{ display: "flex", gap: "12px" }}>
          <Button variant="primary" icon={<CheckIcon />}>
            저장
          </Button>
          <Button variant="secondary">
            취소
          </Button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          비활성화 상태 (로딩 중)
        </h3>
        <Button variant="primary" disabled>
          저장 중...
        </Button>
        <Button variant="secondary" disabled>
          처리 중...
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          다크 테마 (야간 모드)
        </h3>
        <div
          style={{
            padding: "20px",
            backgroundColor: "#1a1a1a",
            borderRadius: "8px",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <Button theme="dark" variant="primary" icon={<PlusIcon />}>
              일기쓰기
            </Button>
            <Button theme="dark" variant="secondary" icon={<SearchIcon />}>
              검색
            </Button>
            <Button theme="dark" variant="tertiary">
              설정
            </Button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          크기별 사용 사례
        </h3>
        <Button size="large" variant="primary">
          메인 액션 (큰 버튼)
        </Button>
        <Button size="medium" variant="secondary">
          보조 액션 (보통 버튼)
        </Button>
        <Button size="small" variant="tertiary">
          작은 액션 (작은 버튼)
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "실제 Mind Diary 앱에서 사용될 수 있는 다양한 버튼 사용 사례들을 보여줍니다.",
      },
    },
  },
};

// ===== 접근성 및 상호작용 스토리 =====
export const InteractiveStates: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        width: "400px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          호버 및 포커스 상태
        </h3>
        <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
          마우스를 올리거나 Tab 키로 포커스를 이동해보세요.
        </p>
        <Button variant="primary">호버해보세요</Button>
        <Button variant="secondary">포커스해보세요</Button>
        <Button variant="tertiary">클릭해보세요</Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          키보드 접근성
        </h3>
        <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
          Tab, Enter, Space 키로 조작할 수 있습니다.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Button variant="primary" icon={<CheckIcon />}>
            Enter로 실행
          </Button>
          <Button variant="secondary" icon={<BackIcon />}>
            Space로 실행
          </Button>
          <Button variant="tertiary">
            Tab으로 이동
          </Button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          로딩 상태 시뮬레이션
        </h3>
        <LoadingButtonExample />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "버튼의 다양한 상호작용 상태와 접근성 기능을 보여줍니다.",
      },
    },
  },
};

// 로딩 상태를 시뮬레이션하는 컴포넌트
const LoadingButtonExample = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <Button 
        variant="primary" 
        disabled={isLoading}
        onClick={handleClick}
        icon={isLoading ? undefined : <CheckIcon />}
      >
        {isLoading ? "저장 중..." : "저장하기"}
      </Button>
      <Button 
        variant="secondary" 
        disabled={isLoading}
      >
        {isLoading ? "처리 중..." : "취소"}
      </Button>
    </div>
  );
};

// ===== 감정 아이콘 버튼 스토리 =====
export const EmotionButtons: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        width: "400px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          감정 선택 버튼들
        </h3>
        <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
          일기 작성 시 감정을 선택할 때 사용되는 버튼들입니다.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Button 
            variant="tertiary" 
            size="small"
            icon={<Image src="/images/emotion-happy-s.png" alt="행복" width={20} height={20} />}
          >
            행복
          </Button>
          <Button 
            variant="tertiary" 
            size="small"
            icon={<Image src="/images/emotion-sad-s.png" alt="슬픔" width={20} height={20} />}
          >
            슬픔
          </Button>
          <Button 
            variant="tertiary" 
            size="small"
            icon={<Image src="/images/emotion-angry-s.png" alt="화남" width={20} height={20} />}
          >
            화남
          </Button>
          <Button 
            variant="tertiary" 
            size="small"
            icon={<Image src="/images/emotion-surprise-s.png" alt="놀람" width={20} height={20} />}
          >
            놀람
          </Button>
          <Button 
            variant="tertiary" 
            size="small"
            icon={<Image src="/images/emotion-etc-s.png" alt="기타" width={20} height={20} />}
          >
            기타
          </Button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          선택된 감정 버튼
        </h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Button 
            variant="primary" 
            size="small"
            icon={<Image src="/images/emotion-happy-s.png" alt="행복" width={20} height={20} />}
          >
            행복 (선택됨)
          </Button>
          <Button 
            variant="secondary" 
            size="small"
            icon={<Image src="/images/emotion-sad-s.png" alt="슬픔" width={20} height={20} />}
          >
            슬픔
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Mind Diary 앱의 감정 선택 기능에서 사용되는 버튼들을 보여줍니다.",
      },
    },
  },
};
