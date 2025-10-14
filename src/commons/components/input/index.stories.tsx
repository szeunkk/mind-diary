import type { Meta, StoryObj } from "@storybook/react";
import Input from "./index";

const meta: Meta<typeof Input> = {
  title: "Commons/Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary"],
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
    theme: {
      control: { type: "select" },
      options: ["light", "dark"],
    },
    disabled: {
      control: { type: "boolean" },
    },
    placeholder: {
      control: { type: "text" },
    },
    value: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 인풋
export const Default: Story = {
  args: {
    placeholder: "회고를 남겨보세요.",
  },
};

// Variant Stories
export const Primary: Story = {
  args: {
    variant: "primary",
    placeholder: "Primary Input",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    placeholder: "Secondary Input",
  },
};

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    placeholder: "Tertiary Input",
  },
};

// Size Stories
export const Small: Story = {
  args: {
    size: "small",
    placeholder: "Small Input",
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
    placeholder: "Medium Input",
  },
};

export const Large: Story = {
  args: {
    size: "large",
    placeholder: "Large Input",
  },
};

// Theme Stories
export const LightTheme: Story = {
  args: {
    theme: "light",
    placeholder: "Light Theme Input",
  },
};

export const DarkTheme: Story = {
  args: {
    theme: "dark",
    placeholder: "Dark Theme Input",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// With Value Stories
export const WithValue: Story = {
  args: {
    value: "입력된 텍스트",
    placeholder: "텍스트를 입력하세요",
  },
};

export const WithLongValue: Story = {
  args: {
    value:
      "이것은 매우 긴 텍스트 입력 예시입니다. 긴 텍스트가 어떻게 표시되는지 확인할 수 있습니다.",
    placeholder: "텍스트를 입력하세요",
  },
};

// Disabled Stories
export const Disabled: Story = {
  args: {
    placeholder: "Disabled Input",
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  args: {
    value: "비활성화된 입력 필드",
    disabled: true,
  },
};

// Input Types
export const EmailInput: Story = {
  args: {
    type: "email",
    placeholder: "이메일을 입력하세요",
  },
};

export const PasswordInput: Story = {
  args: {
    type: "password",
    placeholder: "비밀번호를 입력하세요",
  },
};

export const NumberInput: Story = {
  args: {
    type: "number",
    placeholder: "숫자를 입력하세요",
  },
};

export const SearchInput: Story = {
  args: {
    type: "search",
    placeholder: "검색어를 입력하세요",
  },
};

// All Variants Showcase
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
      <Input variant="primary" placeholder="Primary Input" />
      <Input variant="secondary" placeholder="Secondary Input" />
      <Input variant="tertiary" placeholder="Tertiary Input" />
    </div>
  ),
};

// All Sizes Showcase
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
      <Input size="small" placeholder="Small Input" />
      <Input size="medium" placeholder="Medium Input" />
      <Input size="large" placeholder="Large Input" />
    </div>
  ),
};

// All Themes Showcase
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
      <Input theme="light" placeholder="Light Theme Input" />
      <Input theme="dark" placeholder="Dark Theme Input" />
    </div>
  ),
};

// Complex Example
export const ComplexExample: Story = {
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
          Primary Variants
        </h3>
        <Input variant="primary" size="small" placeholder="Small Primary" />
        <Input variant="primary" size="medium" placeholder="Medium Primary" />
        <Input variant="primary" size="large" placeholder="Large Primary" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          Secondary Variants
        </h3>
        <Input variant="secondary" size="small" placeholder="Small Secondary" />
        <Input
          variant="secondary"
          size="medium"
          placeholder="Medium Secondary"
        />
        <Input variant="secondary" size="large" placeholder="Large Secondary" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          Tertiary Variants
        </h3>
        <Input variant="tertiary" size="small" placeholder="Small Tertiary" />
        <Input variant="tertiary" size="medium" placeholder="Medium Tertiary" />
        <Input variant="tertiary" size="large" placeholder="Large Tertiary" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          Input Types
        </h3>
        <Input type="text" placeholder="텍스트 입력" />
        <Input type="email" placeholder="이메일 입력" />
        <Input type="password" placeholder="비밀번호 입력" />
        <Input type="number" placeholder="숫자 입력" />
        <Input type="search" placeholder="검색어 입력" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          With Values
        </h3>
        <Input value="입력된 텍스트" placeholder="텍스트를 입력하세요" />
        <Input
          value="user@example.com"
          type="email"
          placeholder="이메일을 입력하세요"
        />
        <Input
          value="123456"
          type="password"
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          Disabled States
        </h3>
        <Input variant="primary" disabled placeholder="Primary Disabled" />
        <Input variant="secondary" disabled placeholder="Secondary Disabled" />
        <Input variant="tertiary" disabled placeholder="Tertiary Disabled" />
        <Input disabled value="비활성화된 입력 필드" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          Dark Theme
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
            <Input theme="dark" variant="primary" placeholder="Dark Primary" />
            <Input
              theme="dark"
              variant="secondary"
              placeholder="Dark Secondary"
            />
            <Input
              theme="dark"
              variant="tertiary"
              placeholder="Dark Tertiary"
            />
            <Input theme="dark" disabled placeholder="Dark Disabled" />
          </div>
        </div>
      </div>
    </div>
  ),
};
