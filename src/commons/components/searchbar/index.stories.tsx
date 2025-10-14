import type { Meta, StoryObj } from "@storybook/react";
import SearchBar from "./index";

const meta: Meta<typeof SearchBar> = {
  title: "Commons/Components/SearchBar",
  component: SearchBar,
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
    onSearch: {
      action: "searched",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 검색바
export const Default: Story = {
  args: {
    placeholder: "검색어를 입력해 주세요.",
  },
};

// Variant Stories
export const Primary: Story = {
  args: {
    variant: "primary",
    placeholder: "Primary SearchBar",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    placeholder: "Secondary SearchBar",
  },
};

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    placeholder: "Tertiary SearchBar",
  },
};

// Size Stories
export const Small: Story = {
  args: {
    size: "small",
    placeholder: "Small SearchBar",
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
    placeholder: "Medium SearchBar",
  },
};

export const Large: Story = {
  args: {
    size: "large",
    placeholder: "Large SearchBar",
  },
};

// Theme Stories
export const Light: Story = {
  args: {
    theme: "light",
    placeholder: "Light Theme SearchBar",
  },
};

export const Dark: Story = {
  args: {
    theme: "dark",
    placeholder: "Dark Theme SearchBar",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// State Stories
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled SearchBar",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "검색된 내용",
    placeholder: "검색어를 입력해 주세요.",
  },
};

// Interactive Stories
export const WithSearchHandler: Story = {
  args: {
    placeholder: "Enter를 눌러 검색하세요",
    onSearch: (value: string) => {
      alert(`검색어: ${value}`);
    },
  },
};

// Combination Stories
export const AllVariantsLight: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "400px",
      }}
    >
      <SearchBar variant="primary" theme="light" placeholder="Primary Light" />
      <SearchBar
        variant="secondary"
        theme="light"
        placeholder="Secondary Light"
      />
      <SearchBar
        variant="tertiary"
        theme="light"
        placeholder="Tertiary Light"
      />
    </div>
  ),
};

export const AllVariantsDark: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "400px",
      }}
    >
      <SearchBar variant="primary" theme="dark" placeholder="Primary Dark" />
      <SearchBar
        variant="secondary"
        theme="dark"
        placeholder="Secondary Dark"
      />
      <SearchBar variant="tertiary" theme="dark" placeholder="Tertiary Dark" />
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "400px",
      }}
    >
      <SearchBar size="small" placeholder="Small Size" />
      <SearchBar size="medium" placeholder="Medium Size" />
      <SearchBar size="large" placeholder="Large Size" />
    </div>
  ),
};

export const DisabledStates: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "400px",
      }}
    >
      <SearchBar variant="primary" disabled placeholder="Disabled Primary" />
      <SearchBar
        variant="secondary"
        disabled
        placeholder="Disabled Secondary"
      />
      <SearchBar variant="tertiary" disabled placeholder="Disabled Tertiary" />
    </div>
  ),
};

// Focus States
export const FocusStates: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "400px",
      }}
    >
      <SearchBar
        variant="primary"
        placeholder="Focus me to see border change"
      />
      <SearchBar
        variant="secondary"
        placeholder="Focus me to see border change"
      />
      <SearchBar
        variant="tertiary"
        placeholder="Focus me to see border change"
      />
    </div>
  ),
};

// Responsive Example
export const Responsive: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ width: "200px" }}>
        <SearchBar placeholder="Narrow container" />
      </div>
      <div style={{ width: "400px" }}>
        <SearchBar placeholder="Medium container" />
      </div>
      <div style={{ width: "600px" }}>
        <SearchBar placeholder="Wide container" />
      </div>
    </div>
  ),
};

// Complex Example with all props
export const ComplexExample: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    placeholder: "모든 기능이 포함된 검색바",
    defaultValue: "",
    disabled: false,
    onSearch: (value: string) => {
      console.log("검색어:", value);
    },
  },
};
