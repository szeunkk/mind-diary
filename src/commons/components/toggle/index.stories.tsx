import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Toggle from "./index";

const meta: Meta<typeof Toggle> = {
  title: "Commons/Components/Toggle",
  component: Toggle,
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
    checked: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    onChange: {
      action: "changed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 토글
export const Default: Story = {
  args: {
    checked: false,
  },
};

// Variant Stories
export const Primary: Story = {
  args: {
    variant: "primary",
    checked: true,
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    checked: true,
  },
};

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    checked: true,
  },
};

// Size Stories
export const Small: Story = {
  args: {
    size: "small",
    checked: true,
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
    checked: true,
  },
};

export const Large: Story = {
  args: {
    size: "large",
    checked: true,
  },
};

// Theme Stories
export const LightTheme: Story = {
  args: {
    theme: "light",
    checked: true,
  },
};

export const DarkTheme: Story = {
  args: {
    theme: "dark",
    checked: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// State Stories
export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Unchecked: Story = {
  args: {
    checked: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    checked: false,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

// Interactive Story
export const Interactive: Story = {
  render: function RenderToggle(args) {
    const [checked, setChecked] = useState(args.checked || false);
    return (
      <Toggle
        {...args}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Toggle variant="primary" checked={true} />
        <span>Primary</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Toggle variant="secondary" checked={true} />
        <span>Secondary</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Toggle variant="tertiary" checked={true} />
        <span>Tertiary</span>
      </div>
    </div>
  ),
};

// All Sizes Showcase
export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Toggle size="small" checked={true} />
        <span>Small</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Toggle size="medium" checked={true} />
        <span>Medium</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Toggle size="large" checked={true} />
        <span>Large</span>
      </div>
    </div>
  ),
};

// All Themes Showcase
export const AllThemes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Toggle theme="light" checked={true} />
        <span>Light Theme</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "16px",
          background: "#333",
          color: "white",
          borderRadius: "8px",
        }}
      >
        <Toggle theme="dark" checked={true} />
        <span>Dark Theme</span>
      </div>
    </div>
  ),
};

// Complex Example
export const ComplexExample: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <h3 style={{ width: "100%", margin: 0 }}>Primary Variants</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Toggle variant="primary" size="small" checked={true} />
          <span>Small Primary</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Toggle variant="primary" size="medium" checked={true} />
          <span>Medium Primary</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Toggle variant="primary" size="large" checked={true} />
          <span>Large Primary</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <h3 style={{ width: "100%", margin: 0 }}>Secondary Variants</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Toggle variant="secondary" size="small" checked={true} />
          <span>Small Secondary</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Toggle variant="secondary" size="medium" checked={true} />
          <span>Medium Secondary</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Toggle variant="secondary" size="large" checked={true} />
          <span>Large Secondary</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <h3 style={{ width: "100%", margin: 0 }}>Tertiary Variants</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Toggle variant="tertiary" size="small" checked={true} />
          <span>Small Tertiary</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Toggle variant="tertiary" size="medium" checked={true} />
          <span>Medium Tertiary</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Toggle variant="tertiary" size="large" checked={true} />
          <span>Large Tertiary</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <h3 style={{ width: "100%", margin: 0 }}>States</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Toggle variant="primary" checked={false} />
          <span>Unchecked</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Toggle variant="primary" checked={true} />
          <span>Checked</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Toggle variant="primary" checked={false} disabled />
          <span>Disabled Unchecked</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Toggle variant="primary" checked={true} disabled />
          <span>Disabled Checked</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <h3 style={{ width: "100%", margin: 0 }}>All Combinations</h3>
        {(["primary", "secondary", "tertiary"] as const).map((variant) => (
          <div
            key={variant}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "12px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
            }}
          >
            <strong
              style={{ textTransform: "capitalize", marginBottom: "4px" }}
            >
              {variant}
            </strong>
            {(["small", "medium", "large"] as const).map((size) => (
              <div
                key={size}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Toggle variant={variant} size={size} checked={true} />
                <span style={{ fontSize: "14px" }}>{size}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
};
