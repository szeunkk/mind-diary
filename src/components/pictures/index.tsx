"use client";

import React, { useState } from "react";
import Image from "next/image";
import SelectBox from "@/commons/components/selectbox";
import { useDogPictures, useSplashScreens } from "./hooks/index.binding.hook";
import styles from "./styles.module.css";

const filterOptions = [
  { value: "default", label: "기본" },
  { value: "newest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
];

const PicturesComponent: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("default");

  // API Hook 사용
  const {
    pictures,
    isInitialLoading,
    isLoadingMore,
    isError,
    error,
    setTriggerRef,
    retry,
  } = useDogPictures();

  // 스플래시 스크린 Hook 사용
  const { splashScreens, showSplashScreens } =
    useSplashScreens(isInitialLoading);

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  return (
    <div className={styles.container} data-testid="pictures-container">
      <div className={styles.gap32}></div>
      <div className={styles.filter} data-testid="filter-area">
        <SelectBox
          variant="primary"
          size="medium"
          theme="light"
          options={filterOptions}
          value={selectedFilter}
          onChange={handleFilterChange}
          className={styles.filterSelectBox}
        />
      </div>
      <div className={styles.gap42}></div>
      <div className={styles.main} data-testid="main-area">
        {/* 에러 상태 */}
        {isError && (
          <div className={styles.errorContainer}>
            <div className={styles.errorMessage} data-testid="error-message">
              {error?.message || "사진을 불러올 수 없습니다."}
            </div>
            <button
              className={styles.retryButton}
              onClick={retry}
              data-testid="retry-button"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 스플래시 스크린 (초기 로딩 시) */}
        {showSplashScreens && (
          <div className={styles.pictureGrid}>
            {splashScreens.map((splash) => (
              <div
                key={splash.id}
                className={styles.splashScreen}
                data-testid="splash-screen"
              >
                <div className={styles.splashLine}></div>
              </div>
            ))}
          </div>
        )}

        {/* 실제 강아지 사진들 */}
        {!showSplashScreens && !isError && (
          <div className={styles.pictureGrid}>
            {pictures.map((picture, index) => {
              const triggerRef = setTriggerRef(index);
              return (
                <div
                  key={picture.id}
                  className={styles.pictureItem}
                  data-testid="picture-item"
                  ref={triggerRef || undefined}
                >
                  <Image
                    src={picture.src}
                    alt={picture.alt}
                    width={640}
                    height={640}
                    className={styles.pictureImage}
                    data-testid="picture-image"
                  />
                </div>
              );
            })}

            {/* 추가 로딩 중 표시 */}
            {isLoadingMore && (
              <div className={styles.loadingMore} data-testid="loading-more">
                <div className={styles.loadingSpinner}></div>
                <span>추가 사진을 불러오는 중...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PicturesComponent;
