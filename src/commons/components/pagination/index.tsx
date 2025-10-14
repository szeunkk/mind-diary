/**
 * Pagination Component
 * variant: primary, secondary, tertiary
 * size: small, medium, large
 * theme: light, dark
 */

import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";

export interface PaginationProps {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  theme?: "light" | "dark";
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  variant = "primary",
  size = "medium",
  theme = "light",
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const containerClasses = [
    styles.pagination,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${theme}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div className={containerClasses}>
      {/* Previous Button */}
      <button
        className={`${styles.navButton} ${
          isPrevDisabled ? styles.disabled : ""
        }`}
        onClick={handlePrevious}
        disabled={isPrevDisabled}
        aria-label="Previous page"
      >
        <Image
          src={
            isPrevDisabled
              ? "/icons/leftdisabled_outline_light_m.svg"
              : "/icons/leftenable_outline_light_m.svg"
          }
          alt="Previous"
          width={24}
          height={24}
          className={styles.navIcon}
        />
      </button>

      {/* Page Numbers */}
      <div className={styles.pageNumbers}>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`${styles.pageButton} ${
              page === currentPage ? styles.active : ""
            }`}
            onClick={() => handlePageClick(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        className={`${styles.navButton} ${
          isNextDisabled ? styles.disabled : ""
        }`}
        onClick={handleNext}
        disabled={isNextDisabled}
        aria-label="Next page"
      >
        <Image
          src={
            isNextDisabled
              ? "/icons/rightdisabled_outline_light_m.svg"
              : "/icons/rightenable_outline_light_m.svg"
          }
          alt="Next"
          width={24}
          height={24}
          className={styles.navIcon}
        />
      </button>
    </div>
  );
}
