"use client";

import React, { useState } from "react";
import Image from "next/image";
import SelectBox from "@/commons/components/selectbox";
import SearchBar from "@/commons/components/searchbar";
import Button from "@/commons/components/button";
import Pagination from "@/commons/components/pagination";
import { getEmotionLabel, getEmotionImage } from "@/commons/constants/enum";
import { useDiaryWriteModal } from "./hooks/index.link.modal.hook";
import { useDiaryBinding } from "./hooks/index.binding.hook";
import { useDiaryRouting } from "./hooks/index.link.routing.hook";
import styles from "./styles.module.css";

const DiariesComponent: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // 총 페이지 수
  const { openDiaryWriteModal } = useDiaryWriteModal();
  const diaries = useDiaryBinding();
  const { navigateToDiaryDetail } = useDiaryRouting();

  const filterOptions = [
    { value: "all", label: "전체" },
    { value: "happy", label: "기쁨" },
    { value: "sad", label: "슬픔" },
    { value: "angry", label: "화남" },
    { value: "surprise", label: "놀람" },
    { value: "etc", label: "기타" },
  ];

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  const handleSearch = (value: string) => {
    // 검색 로직 구현
    console.log("검색어:", value);
  };

  const handleWriteDiary = () => {
    // 일기쓰기 모달 열기
    openDiaryWriteModal();
  };

  const handleDeleteDiary = (event: React.MouseEvent, diaryId: number) => {
    // 이벤트 전파 중지 (카드 클릭 이벤트가 발생하지 않도록)
    event.stopPropagation();
    // 일기 삭제 로직
    console.log("일기 삭제:", diaryId);
  };

  const handleCardClick = (diaryId: number) => {
    // 일기 상세 페이지로 이동
    navigateToDiaryDetail(diaryId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("페이지 변경:", page);
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
            />
          </div>
          <SearchBar
            variant="primary"
            size="medium"
            theme="light"
            placeholder="검색어를 입력해 주세요."
            onSearch={handleSearch}
            className={styles.searchInput}
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
          {diaries.map((diary) => (
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
