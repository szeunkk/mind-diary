import React from "react";

/**
 * 사진보관함 페이지
 * 사용자의 사진을 보관하고 관리하는 페이지입니다.
 */
const PicturesPage: React.FC = () => {
  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "1168px",
        margin: "0 auto",
        minHeight: "400px",
      }}
      data-testid="pictures-page"
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "24px",
          color: "var(--color-gray-black)",
        }}
      >
        사진보관함
      </h1>
      <p
        style={{
          fontSize: "16px",
          color: "var(--color-gray-70)",
          lineHeight: "1.6",
        }}
      >
        사진보관함 페이지입니다. 추후 구현 예정입니다.
      </p>
    </div>
  );
};

export default PicturesPage;

