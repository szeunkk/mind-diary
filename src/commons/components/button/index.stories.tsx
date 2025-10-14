import type { Meta, StoryObj } from "@storybook/react";
import Button from "./index";

const meta: Meta<typeof Button> = {
  title: "Commons/Components/Button",
  component: Button,
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
    children: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 버튼
export const Default: Story = {
  args: {
    children: "일기쓰기",
  },
};

// Variant Stories
export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    children: "Tertiary Button",
  },
};

// Size Stories
export const Small: Story = {
  args: {
    size: "small",
    children: "Small Button",
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
    children: "Medium Button",
  },
};

export const Large: Story = {
  args: {
    size: "large",
    children: "Large Button",
  },
};

// Theme Stories
export const LightTheme: Story = {
  args: {
    theme: "light",
    children: "Light Theme Button",
  },
};

export const DarkTheme: Story = {
  args: {
    theme: "dark",
    children: "Dark Theme Button",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// With Icon Stories
export const WithIcon: Story = {
  args: {
    children: "일기쓰기",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
    ),
  },
};

export const SmallWithIcon: Story = {
  args: {
    size: "small",
    children: "작은 버튼",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
    ),
  },
};

export const LargeWithIcon: Story = {
  args: {
    size: "large",
    children: "큰 버튼",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
    ),
  },
};

// Disabled Stories
export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};

export const DisabledPrimary: Story = {
  args: {
    variant: "primary",
    children: "Disabled Primary",
    disabled: true,
  },
};

export const DisabledSecondary: Story = {
  args: {
    variant: "secondary",
    children: "Disabled Secondary",
    disabled: true,
  },
};

export const DisabledTertiary: Story = {
  args: {
    variant: "tertiary",
    children: "Disabled Tertiary",
    disabled: true,
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
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="tertiary">Tertiary Button</Button>
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
      <Button size="small">Small Button</Button>
      <Button size="medium">Medium Button</Button>
      <Button size="large">Large Button</Button>
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
      <Button theme="light">Light Theme Button</Button>
      <Button theme="dark">Dark Theme Button</Button>
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
        <Button variant="primary" size="small">
          Small Primary
        </Button>
        <Button variant="primary" size="medium">
          Medium Primary
        </Button>
        <Button variant="primary" size="large">
          Large Primary
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          Secondary Variants
        </h3>
        <Button variant="secondary" size="small">
          Small Secondary
        </Button>
        <Button variant="secondary" size="medium">
          Medium Secondary
        </Button>
        <Button variant="secondary" size="large">
          Large Secondary
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          Tertiary Variants
        </h3>
        <Button variant="tertiary" size="small">
          Small Tertiary
        </Button>
        <Button variant="tertiary" size="medium">
          Medium Tertiary
        </Button>
        <Button variant="tertiary" size="large">
          Large Tertiary
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          With Icons
        </h3>
        <Button
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          }
        >
          일기쓰기
        </Button>
        <Button
          variant="secondary"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          }
        >
          새 항목 추가
        </Button>
        <Button
          variant="tertiary"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          }
        >
          더보기
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          Disabled States
        </h3>
        <Button variant="primary" disabled>
          Primary Disabled
        </Button>
        <Button variant="secondary" disabled>
          Secondary Disabled
        </Button>
        <Button variant="tertiary" disabled>
          Tertiary Disabled
        </Button>
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
            <Button theme="dark" variant="primary">
              Dark Primary
            </Button>
            <Button theme="dark" variant="secondary">
              Dark Secondary
            </Button>
            <Button theme="dark" variant="tertiary">
              Dark Tertiary
            </Button>
            <Button theme="dark" disabled>
              Dark Disabled
            </Button>
          </div>
        </div>
      </div>
    </div>
  ),
};
