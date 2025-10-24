"use client";

import React from "react";
import Image from "next/image";
import SelectBox from "@/commons/components/selectbox";
import SearchBar from "@/commons/components/searchbar";
import Button from "@/commons/components/button";
import Pagination from "@/commons/components/pagination";
import { getEmotionLabel, getEmotionImage } from "@/commons/constants/enum";
import { useDiaryWriteModal } from "./hooks/index.link.modal.hook";
import { useDiaryFilter } from "./hooks/index.filter.hook";
import { useDiaryRouting } from "./hooks/index.link.routing.hook";
import { useDiaryPagination } from "./hooks/index.pagination.hook";
import { useDiaryDelete } from "./hooks/index.delete.hook";
import styles from "./styles.module.css";

const DiariesComponent: React.FC = () => {
  const { openDiaryWriteModal } = useDiaryWriteModal();
  const {
    filteredDiaries,
    filterOptions,
    selectedFilter,
    handleFilterChange,
    handleSearch,
  } = useDiaryFilter();
  const { navigateToDiaryDetail } = useDiaryRouting();
  const { paginatedDiaries, currentPage, totalPages, handlePageChange } =
    useDiaryPagination(filteredDiaries);
  const { openDeleteModal, isDeleteVisible } = useDiaryDelete();

  const handleWriteDiary = () => {
    // 일기쓰기 모달 열기
    openDiaryWriteModal();
  };

  const handleDeleteDiary = (event: React.MouseEvent, diaryId: number) => {
    // 이벤트 전파 중지 (카드 클릭 이벤트가 발생하지 않도록)
    event.stopPropagation();
    // 일기 삭제 모달 열기
    openDeleteModal(diaryId);
  };

  const handleCardClick = (diaryId: number) => {
    // 일기 상세 페이지로 이동
    navigateToDiaryDetail(diaryId);
  };

  return (
    <div className={styles.container} data-testid="diaries-page">
      <div className={styles.gap32}></div>
      <div className={styles.search}>
        <div className={styles.searchLeft}>
          <div className={styles.dropdown}>
            <SelectBox
              variant="primary"
              size="medium"
              theme="light"
              options={filterOptions}
              value={selectedFilter}
              onChange={handleFilterChange}
              placeholder="전체"
              className={styles.filterSelect}
              data-testid="filter-selectbox"
            />
          </div>
          <SearchBar
            variant="primary"
            size="medium"
            theme="light"
            placeholder="검색어를 입력해 주세요."
            onSearch={handleSearch}
            className={styles.searchInput}
            data-testid="search-input"
          />
        </div>
        <div className={styles.searchRight}>
          <Button
            variant="primary"
            size="medium"
            theme="light"
            onClick={handleWriteDiary}
            className={styles.writeButton}
            data-testid="diary-new-open-button"
            icon={
              <Image
                src="/icons/plus_outline_light_m.svg"
                alt="plus"
                width={24}
                height={24}
              />
            }
          >
            일기쓰기
          </Button>
        </div>
      </div>
      <div className={styles.gap42}></div>
      <div className={styles.main}>
        <div className={styles.cardGrid}>
          {paginatedDiaries.map((diary) => (
            <div
              key={diary.id}
              className={styles.card}
              onClick={() => handleCardClick(diary.id)}
              data-testid={`diary-card-${diary.id}`}
            >
              <div className={styles.cardImage}>
                <Image
                  src={getEmotionImage(diary.emotion)}
                  alt={getEmotionLabel(diary.emotion)}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className={styles.emotionImage}
                />
                {isDeleteVisible && (
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => handleDeleteDiary(e, diary.id)}
                    data-testid="delete-button"
                  >
                    <Image
                      src="/icons/close_outline_light_s.svg"
                      alt="삭제"
                      width={24}
                      height={24}
                    />
                  </button>
                )}
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <span
                    className={styles.emotionText}
                    data-emotion={diary.emotion}
                    data-testid="emotion-label"
                  >
                    {getEmotionLabel(diary.emotion)}
                  </span>
                  <span className={styles.dateText} data-testid="diary-date">
                    {diary.date}
                  </span>
                </div>
                <div className={styles.titleText} data-testid="diary-title">
                  {diary.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.gap40}></div>
      <div className={styles.pagination}>
        <Pagination
          variant="primary"
          size="medium"
          theme="light"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <div className={styles.gap40}></div>
    </div>
  );
};

export default DiariesComponent;
