import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Pagination, { PaginationProps } from "./index";

const meta: Meta<typeof Pagination> = {
  title: "Commons/Components/Pagination",
  component: Pagination,
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
    currentPage: {
      control: { type: "number", min: 1 },
    },
    totalPages: {
      control: { type: "number", min: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 페이지네이션
export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    onPageChange: (page: number) => console.log("Page changed to:", page),
  },
};

// Variant Stories
export const Primary: Story = {
  args: {
    variant: "primary",
    currentPage: 3,
    totalPages: 10,
    onPageChange: (page: number) => console.log("Page changed to:", page),
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    currentPage: 3,
    totalPages: 10,
    onPageChange: (page: number) => console.log("Page changed to:", page),
  },
};

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    currentPage: 3,
    totalPages: 10,
    onPageChange: (page: number) => console.log("Page changed to:", page),
  },
};

// Size Stories
export const Small: Story = {
  args: {
    size: "small",
    currentPage: 2,
    totalPages: 5,
    onPageChange: (page: number) => console.log("Page changed to:", page),
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
    currentPage: 2,
    totalPages: 5,
    onPageChange: (page: number) => console.log("Page changed to:", page),
  },
};

export const Large: Story = {
  args: {
    size: "large",
    currentPage: 2,
    totalPages: 5,
    onPageChange: (page: number) => console.log("Page changed to:", page),
  },
};

// Theme Stories
export const LightTheme: Story = {
  args: {
    theme: "light",
    currentPage: 3,
    totalPages: 7,
    onPageChange: (page: number) => console.log("Page changed to:", page),
  },
};

export const DarkTheme: Story = {
  args: {
    theme: "dark",
    currentPage: 3,
    totalPages: 7,
    onPageChange: (page: number) => console.log("Page changed to:", page),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Edge Cases
export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    onPageChange: (page: number) => console.log("Page changed to:", page),
  },
};

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log("Page changed to:", page),
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    onPageChange: (page: number) => console.log("Page changed to:", page),
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 15,
    totalPages: 50,
    onPageChange: (page: number) => console.log("Page changed to:", page),
  },
};

// Interactive Component
const InteractiveComponent = (args: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage || 1);

  return (
    <Pagination
      {...args}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  );
};

const InteractiveLargeComponent = (args: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage || 1);

  return (
    <Pagination
      {...args}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  );
};

// Interactive Stories
export const Interactive: Story = {
  render: (args) => <InteractiveComponent {...args} />,
  args: {
    currentPage: 1,
    totalPages: 10,
  },
};

export const InteractiveLarge: Story = {
  render: (args) => <InteractiveLargeComponent {...args} />,
  args: {
    currentPage: 25,
    totalPages: 100,
  },
};

// All Variants Component
const AllVariantsComponent = () => {
  const [primaryPage, setPrimaryPage] = useState(3);
  const [secondaryPage, setSecondaryPage] = useState(3);
  const [tertiaryPage, setTertiaryPage] = useState(3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h3
          style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}
        >
          Primary Variant
        </h3>
        <Pagination
          variant="primary"
          currentPage={primaryPage}
          totalPages={10}
          onPageChange={setPrimaryPage}
        />
      </div>
      <div>
        <h3
          style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}
        >
          Secondary Variant
        </h3>
        <Pagination
          variant="secondary"
          currentPage={secondaryPage}
          totalPages={10}
          onPageChange={setSecondaryPage}
        />
      </div>
      <div>
        <h3
          style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}
        >
          Tertiary Variant
        </h3>
        <Pagination
          variant="tertiary"
          currentPage={tertiaryPage}
          totalPages={10}
          onPageChange={setTertiaryPage}
        />
      </div>
    </div>
  );
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => <AllVariantsComponent />,
};

// All Sizes Component
const AllSizesComponent = () => {
  const [smallPage, setSmallPage] = useState(2);
  const [mediumPage, setMediumPage] = useState(2);
  const [largePage, setLargePage] = useState(2);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        alignItems: "center",
      }}
    >
      <div>
        <h3
          style={{
            margin: "0 0 16px 0",
            fontSize: "16px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Small Size
        </h3>
        <Pagination
          size="small"
          currentPage={smallPage}
          totalPages={5}
          onPageChange={setSmallPage}
        />
      </div>
      <div>
        <h3
          style={{
            margin: "0 0 16px 0",
            fontSize: "16px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Medium Size
        </h3>
        <Pagination
          size="medium"
          currentPage={mediumPage}
          totalPages={5}
          onPageChange={setMediumPage}
        />
      </div>
      <div>
        <h3
          style={{
            margin: "0 0 16px 0",
            fontSize: "16px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Large Size
        </h3>
        <Pagination
          size="large"
          currentPage={largePage}
          totalPages={5}
          onPageChange={setLargePage}
        />
      </div>
    </div>
  );
};

// All Sizes Showcase
export const AllSizes: Story = {
  render: () => <AllSizesComponent />,
};

// All Themes Component
const AllThemesComponent = () => {
  const [lightPage, setLightPage] = useState(3);
  const [darkPage, setDarkPage] = useState(3);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h3
          style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}
        >
          Light Theme
        </h3>
        <Pagination
          theme="light"
          currentPage={lightPage}
          totalPages={7}
          onPageChange={setLightPage}
        />
      </div>
      <div
        style={{
          padding: "24px",
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
        }}
      >
        <h3
          style={{
            margin: "0 0 16px 0",
            fontSize: "16px",
            fontWeight: "600",
            color: "white",
          }}
        >
          Dark Theme
        </h3>
        <Pagination
          theme="dark"
          currentPage={darkPage}
          totalPages={7}
          onPageChange={setDarkPage}
        />
      </div>
    </div>
  );
};

// All Themes Showcase
export const AllThemes: Story = {
  render: () => <AllThemesComponent />,
};

// Complex Example Component
const ComplexExampleComponent = () => {
  // Primary variants with different sizes
  const [primarySmall, setPrimarySmall] = useState(2);
  const [primaryMedium, setPrimaryMedium] = useState(2);
  const [primaryLarge, setPrimaryLarge] = useState(2);

  // Secondary variants with different sizes
  const [secondarySmall, setSecondarySmall] = useState(3);
  const [secondaryMedium, setSecondaryMedium] = useState(3);
  const [secondaryLarge, setSecondaryLarge] = useState(3);

  // Tertiary variants with different sizes
  const [tertiarySmall, setTertiarySmall] = useState(4);
  const [tertiaryMedium, setTertiaryMedium] = useState(4);
  const [tertiaryLarge, setTertiaryLarge] = useState(4);

  // Edge cases
  const [singlePage, setSinglePage] = useState(1);
  const [manyPages, setManyPages] = useState(25);

  // Dark theme examples
  const [darkPrimary, setDarkPrimary] = useState(5);
  const [darkSecondary, setDarkSecondary] = useState(5);
  const [darkTertiary, setDarkTertiary] = useState(5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
      {/* Primary Variants */}
      <div>
        <h2
          style={{ margin: "0 0 24px 0", fontSize: "20px", fontWeight: "700" }}
        >
          Primary Variants
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Small Primary
            </h3>
            <Pagination
              variant="primary"
              size="small"
              currentPage={primarySmall}
              totalPages={8}
              onPageChange={setPrimarySmall}
            />
          </div>
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Medium Primary
            </h3>
            <Pagination
              variant="primary"
              size="medium"
              currentPage={primaryMedium}
              totalPages={8}
              onPageChange={setPrimaryMedium}
            />
          </div>
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Large Primary
            </h3>
            <Pagination
              variant="primary"
              size="large"
              currentPage={primaryLarge}
              totalPages={8}
              onPageChange={setPrimaryLarge}
            />
          </div>
        </div>
      </div>

      {/* Secondary Variants */}
      <div>
        <h2
          style={{ margin: "0 0 24px 0", fontSize: "20px", fontWeight: "700" }}
        >
          Secondary Variants
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Small Secondary
            </h3>
            <Pagination
              variant="secondary"
              size="small"
              currentPage={secondarySmall}
              totalPages={8}
              onPageChange={setSecondarySmall}
            />
          </div>
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Medium Secondary
            </h3>
            <Pagination
              variant="secondary"
              size="medium"
              currentPage={secondaryMedium}
              totalPages={8}
              onPageChange={setSecondaryMedium}
            />
          </div>
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Large Secondary
            </h3>
            <Pagination
              variant="secondary"
              size="large"
              currentPage={secondaryLarge}
              totalPages={8}
              onPageChange={setSecondaryLarge}
            />
          </div>
        </div>
      </div>

      {/* Tertiary Variants */}
      <div>
        <h2
          style={{ margin: "0 0 24px 0", fontSize: "20px", fontWeight: "700" }}
        >
          Tertiary Variants
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Small Tertiary
            </h3>
            <Pagination
              variant="tertiary"
              size="small"
              currentPage={tertiarySmall}
              totalPages={8}
              onPageChange={setTertiarySmall}
            />
          </div>
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Medium Tertiary
            </h3>
            <Pagination
              variant="tertiary"
              size="medium"
              currentPage={tertiaryMedium}
              totalPages={8}
              onPageChange={setTertiaryMedium}
            />
          </div>
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Large Tertiary
            </h3>
            <Pagination
              variant="tertiary"
              size="large"
              currentPage={tertiaryLarge}
              totalPages={8}
              onPageChange={setTertiaryLarge}
            />
          </div>
        </div>
      </div>

      {/* Edge Cases */}
      <div>
        <h2
          style={{ margin: "0 0 24px 0", fontSize: "20px", fontWeight: "700" }}
        >
          Edge Cases
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Single Page
            </h3>
            <Pagination
              currentPage={singlePage}
              totalPages={1}
              onPageChange={setSinglePage}
            />
          </div>
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Many Pages (100 total, current: {manyPages})
            </h3>
            <Pagination
              currentPage={manyPages}
              totalPages={100}
              onPageChange={setManyPages}
            />
          </div>
        </div>
      </div>

      {/* Dark Theme */}
      <div
        style={{
          padding: "32px",
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
        }}
      >
        <h2
          style={{
            margin: "0 0 24px 0",
            fontSize: "20px",
            fontWeight: "700",
            color: "white",
          }}
        >
          Dark Theme Variants
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
                color: "white",
              }}
            >
              Dark Primary
            </h3>
            <Pagination
              variant="primary"
              theme="dark"
              currentPage={darkPrimary}
              totalPages={10}
              onPageChange={setDarkPrimary}
            />
          </div>
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
                color: "white",
              }}
            >
              Dark Secondary
            </h3>
            <Pagination
              variant="secondary"
              theme="dark"
              currentPage={darkSecondary}
              totalPages={10}
              onPageChange={setDarkSecondary}
            />
          </div>
          <div>
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
                color: "white",
              }}
            >
              Dark Tertiary
            </h3>
            <Pagination
              variant="tertiary"
              theme="dark"
              currentPage={darkTertiary}
              totalPages={10}
              onPageChange={setDarkTertiary}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Complex Example
export const ComplexExample: Story = {
  render: () => <ComplexExampleComponent />,
};
