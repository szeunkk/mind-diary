import type { Meta, StoryObj } from "@storybook/react";
import Selectbox from "./index";

const meta: Meta<typeof Selectbox> = {
  title: "Commons/Components/Selectbox",
  component: Selectbox,
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
    options: {
      control: { type: "object" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 옵션 데이터
const defaultOptions = [
  { value: "option1", label: "옵션 1" },
  { value: "option2", label: "옵션 2" },
  { value: "option3", label: "옵션 3" },
  { value: "option4", label: "옵션 4" },
];

const fruitOptions = [
  { value: "apple", label: "사과" },
  { value: "banana", label: "바나나" },
  { value: "orange", label: "오렌지" },
  { value: "grape", label: "포도" },
  { value: "strawberry", label: "딸기" },
];

const countryOptions = [
  { value: "kr", label: "대한민국" },
  { value: "us", label: "미국" },
  { value: "jp", label: "일본" },
  { value: "cn", label: "중국" },
  { value: "uk", label: "영국" },
];

// 기본 셀렉트박스
export const Default: Story = {
  args: {
    options: defaultOptions,
    placeholder: "선택하세요",
  },
};

// Variant Stories
export const Primary: Story = {
  args: {
    variant: "primary",
    options: defaultOptions,
    placeholder: "Primary Selectbox",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    options: defaultOptions,
    placeholder: "Secondary Selectbox",
  },
};

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    options: defaultOptions,
    placeholder: "Tertiary Selectbox",
  },
};

// Size Stories
export const Small: Story = {
  args: {
    size: "small",
    options: defaultOptions,
    placeholder: "Small Selectbox",
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
    options: defaultOptions,
    placeholder: "Medium Selectbox",
  },
};

export const Large: Story = {
  args: {
    size: "large",
    options: defaultOptions,
    placeholder: "Large Selectbox",
  },
};

// Theme Stories
export const Light: Story = {
  args: {
    theme: "light",
    options: defaultOptions,
    placeholder: "Light Theme",
  },
};

export const Dark: Story = {
  args: {
    theme: "dark",
    options: defaultOptions,
    placeholder: "Dark Theme",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// State Stories
export const Disabled: Story = {
  args: {
    disabled: true,
    options: defaultOptions,
    placeholder: "Disabled Selectbox",
  },
};

export const WithValue: Story = {
  args: {
    options: defaultOptions,
    value: "option2",
    placeholder: "선택하세요",
  },
};

// Content Variations
export const FruitSelector: Story = {
  args: {
    options: fruitOptions,
    placeholder: "과일을 선택하세요",
  },
};

export const CountrySelector: Story = {
  args: {
    options: countryOptions,
    placeholder: "국가를 선택하세요",
  },
};

export const LongOptions: Story = {
  args: {
    options: [
      { value: "long1", label: "매우 긴 옵션 텍스트가 포함된 첫 번째 선택지" },
      { value: "long2", label: "이것도 상당히 긴 텍스트를 가진 두 번째 옵션" },
      { value: "long3", label: "세 번째로 긴 옵션 텍스트 예시" },
    ],
    placeholder: "긴 텍스트 옵션",
  },
};

// Combination Stories
export const PrimarySmallLight: Story = {
  args: {
    variant: "primary",
    size: "small",
    theme: "light",
    options: defaultOptions,
    placeholder: "Primary Small Light",
  },
};

export const SecondaryMediumLight: Story = {
  args: {
    variant: "secondary",
    size: "medium",
    theme: "light",
    options: defaultOptions,
    placeholder: "Secondary Medium Light",
  },
};

export const TertiaryLargeLight: Story = {
  args: {
    variant: "tertiary",
    size: "large",
    theme: "light",
    options: defaultOptions,
    placeholder: "Tertiary Large Light",
  },
};

export const PrimarySmallDark: Story = {
  args: {
    variant: "primary",
    size: "small",
    theme: "dark",
    options: defaultOptions,
    placeholder: "Primary Small Dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const SecondaryMediumDark: Story = {
  args: {
    variant: "secondary",
    size: "medium",
    theme: "dark",
    options: defaultOptions,
    placeholder: "Secondary Medium Dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const TertiaryLargeDark: Story = {
  args: {
    variant: "tertiary",
    size: "large",
    theme: "dark",
    options: defaultOptions,
    placeholder: "Tertiary Large Dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Disabled Variations
export const DisabledPrimary: Story = {
  args: {
    variant: "primary",
    disabled: true,
    options: defaultOptions,
    placeholder: "Disabled Primary",
  },
};

export const DisabledSecondary: Story = {
  args: {
    variant: "secondary",
    disabled: true,
    options: defaultOptions,
    placeholder: "Disabled Secondary",
  },
};

export const DisabledTertiary: Story = {
  args: {
    variant: "tertiary",
    disabled: true,
    options: defaultOptions,
    placeholder: "Disabled Tertiary",
  },
};

export const DisabledDark: Story = {
  args: {
    theme: "dark",
    disabled: true,
    options: defaultOptions,
    placeholder: "Disabled Dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Interactive Stories
export const Interactive: Story = {
  args: {
    options: fruitOptions,
    placeholder: "과일을 선택하세요",
    onChange: (value: string) => {
      console.log("Selected:", value);
    },
  },
};

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
      <Selectbox
        variant="primary"
        options={defaultOptions}
        placeholder="Primary"
      />
      <Selectbox
        variant="secondary"
        options={defaultOptions}
        placeholder="Secondary"
      />
      <Selectbox
        variant="tertiary"
        options={defaultOptions}
        placeholder="Tertiary"
      />
    </div>
  ),
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
      <Selectbox size="small" options={defaultOptions} placeholder="Small" />
      <Selectbox size="medium" options={defaultOptions} placeholder="Medium" />
      <Selectbox size="large" options={defaultOptions} placeholder="Large" />
    </div>
  ),
};

export const AllThemes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px" }}>
      <div style={{ padding: "16px", backgroundColor: "white" }}>
        <Selectbox
          theme="light"
          options={defaultOptions}
          placeholder="Light Theme"
        />
      </div>
      <div style={{ padding: "16px", backgroundColor: "#1a1a1a" }}>
        <Selectbox
          theme="dark"
          options={defaultOptions}
          placeholder="Dark Theme"
        />
      </div>
    </div>
  ),
};
