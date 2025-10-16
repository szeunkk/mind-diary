import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import Modal from "./index";

const meta: Meta<typeof Modal> = {
  title: "Commons/Components/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Modal 컴포넌트는 사용자에게 중요한 정보를 전달하거나 확인을 요청하는 데 사용되는 컴포넌트입니다.

## 주요 특징
- 2가지 variant: info, danger
- 2가지 actions: single, dual
- 2가지 theme: light, dark
- 접근성 준수
- 유연한 버튼 구성

## 사용법
\`\`\`tsx
import Modal from "@/commons/components/modal";

<Modal
  variant="info"
  actions="dual"
  title="제목"
  description="설명 텍스트"
  confirmText="확인"
  cancelText="취소"
  onConfirm={() => console.log('확인')}
  onCancel={() => console.log('취소')}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["info", "danger"],
      description: "모달의 시각적 스타일을 결정합니다.",
      table: {
        type: { summary: "info | danger" },
        defaultValue: { summary: "info" },
      },
    },
    actions: {
      control: { type: "select" },
      options: ["single", "dual"],
      description: "모달의 버튼 구성을 결정합니다.",
      table: {
        type: { summary: "single | dual" },
        defaultValue: { summary: "single" },
      },
    },
    theme: {
      control: { type: "select" },
      options: ["light", "dark"],
      description: "모달의 테마를 결정합니다.",
      table: {
        type: { summary: "light | dark" },
        defaultValue: { summary: "light" },
      },
    },
    title: {
      control: { type: "text" },
      description: "모달의 제목입니다.",
      table: {
        type: { summary: "string" },
      },
    },
    description: {
      control: { type: "text" },
      description: "모달의 설명 텍스트입니다. (선택사항)",
      table: {
        type: { summary: "string" },
      },
    },
    confirmText: {
      control: { type: "text" },
      description: "확인 버튼의 텍스트입니다.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "확인" },
      },
    },
    cancelText: {
      control: { type: "text" },
      description: "취소 버튼의 텍스트입니다. (dual actions일 때만 표시)",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "취소" },
      },
    },
    onConfirm: {
      action: "confirmed",
      description: "확인 버튼 클릭 시 실행될 함수입니다.",
    },
    onCancel: {
      action: "cancelled",
      description: "취소 버튼 클릭 시 실행될 함수입니다.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ===== 기본 스토리 =====
export const Default: Story = {
  args: {
    title: "모달 제목",
    description: "이것은 기본 모달입니다.",
  },
};

// ===== Variant별 스토리 =====
export const Info: Story = {
  args: {
    variant: "info",
    title: "정보 모달",
    description: "정보를 전달하는 모달입니다.",
  },
  parameters: {
    docs: {
      description: {
        story: "Info variant 모달입니다. 일반적인 정보 전달에 사용됩니다.",
      },
    },
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    title: "위험 모달",
    description: "중요한 경고나 삭제 확인 등에 사용됩니다.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Danger variant 모달입니다. 위험한 작업이나 중요한 경고에 사용됩니다.",
      },
    },
  },
};

// ===== Actions별 스토리 =====
export const SingleAction: Story = {
  args: {
    actions: "single",
    title: "단일 버튼 모달",
    description: "확인 버튼만 있는 모달입니다.",
    confirmText: "확인",
  },
  parameters: {
    docs: {
      description: {
        story: "Single action 모달입니다. 확인 버튼만 표시됩니다.",
      },
    },
  },
};

export const DualAction: Story = {
  args: {
    actions: "dual",
    title: "이중 버튼 모달",
    description: "확인과 취소 버튼이 있는 모달입니다.",
    confirmText: "확인",
    cancelText: "취소",
  },
  parameters: {
    docs: {
      description: {
        story: "Dual action 모달입니다. 확인과 취소 버튼이 모두 표시됩니다.",
      },
    },
  },
};

// ===== Theme별 스토리 =====
export const LightTheme: Story = {
  args: {
    theme: "light",
    title: "라이트 테마 모달",
    description: "밝은 배경의 모달입니다.",
  },
  parameters: {
    docs: {
      description: {
        story: "Light theme 모달입니다. 기본 테마입니다.",
      },
    },
  },
};

export const DarkTheme: Story = {
  args: {
    theme: "dark",
    title: "다크 테마 모달",
    description: "어두운 배경의 모달입니다.",
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story: "Dark theme 모달입니다. 어두운 배경에서 사용됩니다.",
      },
    },
  },
};

// ===== 설명 없는 모달 =====
export const WithoutDescription: Story = {
  args: {
    title: "간단한 모달",
  },
  parameters: {
    docs: {
      description: {
        story: "설명(description)이 없는 모달입니다.",
      },
    },
  },
};

// ===== 커스텀 버튼 텍스트 =====
export const CustomButtonText: Story = {
  args: {
    actions: "dual",
    title: "일기 삭제",
    description: "정말로 이 일기를 삭제하시겠습니까?",
    confirmText: "삭제",
    cancelText: "아니요",
  },
  parameters: {
    docs: {
      description: {
        story: "버튼 텍스트를 커스터마이징한 모달입니다.",
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
        gap: "24px",
        alignItems: "center",
      }}
    >
      <Modal
        variant="info"
        actions="single"
        title="Info 모달"
        description="정보를 전달하는 모달입니다."
      />
      <Modal
        variant="danger"
        actions="single"
        title="Danger 모달"
        description="경고를 전달하는 모달입니다."
      />
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

export const AllActions: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        alignItems: "center",
      }}
    >
      <Modal
        actions="single"
        title="단일 버튼"
        description="확인 버튼만 있습니다."
        confirmText="확인"
      />
      <Modal
        actions="dual"
        title="이중 버튼"
        description="확인과 취소 버튼이 있습니다."
        confirmText="확인"
        cancelText="취소"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "모든 actions를 한눈에 볼 수 있는 쇼케이스입니다.",
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
        gap: "24px",
        alignItems: "center",
      }}
    >
      <Modal
        theme="light"
        title="라이트 테마"
        description="밝은 배경의 모달입니다."
      />
      <div
        style={{
          padding: "40px",
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
        }}
      >
        <Modal
          theme="dark"
          title="다크 테마"
          description="어두운 배경의 모달입니다."
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "모든 theme을 한눈에 볼 수 있는 쇼케이스입니다.",
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
        gap: "40px",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          일기 저장 완료
        </h3>
        <Modal
          variant="info"
          actions="single"
          title="일기가 저장되었습니다"
          description="작성하신 일기가 성공적으로 저장되었습니다."
          confirmText="확인"
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          일기 삭제 확인
        </h3>
        <Modal
          variant="danger"
          actions="dual"
          title="일기를 삭제하시겠습니까?"
          description="삭제된 일기는 복구할 수 없습니다."
          confirmText="삭제"
          cancelText="취소"
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          로그아웃 확인
        </h3>
        <Modal
          variant="info"
          actions="dual"
          title="로그아웃 하시겠습니까?"
          confirmText="로그아웃"
          cancelText="취소"
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          네트워크 오류
        </h3>
        <Modal
          variant="danger"
          actions="single"
          title="네트워크 오류가 발생했습니다"
          description="인터넷 연결을 확인하고 다시 시도해주세요."
          confirmText="확인"
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          변경사항 저장 확인
        </h3>
        <Modal
          variant="info"
          actions="dual"
          title="변경사항을 저장하시겠습니까?"
          description="저장하지 않으면 변경사항이 사라집니다."
          confirmText="저장"
          cancelText="취소"
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          작업 완료 (설명 없음)
        </h3>
        <Modal
          variant="info"
          actions="single"
          title="작업이 완료되었습니다"
          confirmText="확인"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "실제 Mind Diary 앱에서 사용될 수 있는 다양한 모달 사용 사례들을 보여줍니다.",
      },
    },
  },
};

// ===== 조합 예제 스토리 =====
export const AllCombinations: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          Info Variant
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <Modal
            variant="info"
            actions="single"
            theme="light"
            title="Info + Single + Light"
            description="정보 전달용 단일 버튼 라이트 테마 모달"
            confirmText="확인"
          />
          <Modal
            variant="info"
            actions="dual"
            theme="light"
            title="Info + Dual + Light"
            description="정보 전달용 이중 버튼 라이트 테마 모달"
            confirmText="확인"
            cancelText="취소"
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
          padding: "40px",
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: "600",
            color: "#fff",
          }}
        >
          Info Variant (Dark Theme)
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <Modal
            variant="info"
            actions="single"
            theme="dark"
            title="Info + Single + Dark"
            description="정보 전달용 단일 버튼 다크 테마 모달"
            confirmText="확인"
          />
          <Modal
            variant="info"
            actions="dual"
            theme="dark"
            title="Info + Dual + Dark"
            description="정보 전달용 이중 버튼 다크 테마 모달"
            confirmText="확인"
            cancelText="취소"
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          Danger Variant
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <Modal
            variant="danger"
            actions="single"
            theme="light"
            title="Danger + Single + Light"
            description="경고용 단일 버튼 라이트 테마 모달"
            confirmText="확인"
          />
          <Modal
            variant="danger"
            actions="dual"
            theme="light"
            title="Danger + Dual + Light"
            description="경고용 이중 버튼 라이트 테마 모달"
            confirmText="삭제"
            cancelText="취소"
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
          padding: "40px",
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: "600",
            color: "#fff",
          }}
        >
          Danger Variant (Dark Theme)
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <Modal
            variant="danger"
            actions="single"
            theme="dark"
            title="Danger + Single + Dark"
            description="경고용 단일 버튼 다크 테마 모달"
            confirmText="확인"
          />
          <Modal
            variant="danger"
            actions="dual"
            theme="dark"
            title="Danger + Dual + Dark"
            description="경고용 이중 버튼 다크 테마 모달"
            confirmText="삭제"
            cancelText="취소"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "모든 variant, actions, theme의 조합을 한눈에 볼 수 있는 쇼케이스입니다.",
      },
    },
  },
};

// ===== 인터랙티브 예제 =====
export const InteractiveExample: Story = {
  render: function RenderModal() {
    const [showModal, setShowModal] = React.useState(true);

    const handleConfirm = () => {
      alert("확인 버튼이 클릭되었습니다!");
      setShowModal(false);
      setTimeout(() => setShowModal(true), 1000);
    };

    const handleCancel = () => {
      alert("취소 버튼이 클릭되었습니다!");
      setShowModal(false);
      setTimeout(() => setShowModal(true), 1000);
    };

    return (
      <div>
        {showModal ? (
          <Modal
            variant="info"
            actions="dual"
            title="인터랙티브 모달"
            description="버튼을 클릭해보세요. 1초 후 다시 나타납니다."
            confirmText="확인"
            cancelText="취소"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        ) : (
          <div
            style={{
              width: "400px",
              padding: "40px",
              textAlign: "center",
              border: "2px dashed #ccc",
              borderRadius: "16px",
            }}
          >
            모달이 닫혔습니다...
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "버튼 클릭 시 실제 동작을 시뮬레이션하는 인터랙티브 모달입니다.",
      },
    },
  },
};
