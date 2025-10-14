"use client";

import React, { useState } from "react";
import Image from "next/image";
import SelectBox from "@/commons/components/selectbox";
import SearchBar from "@/commons/components/searchbar";
import Button from "@/commons/components/button";
import { Emotion, getEmotionLabel, getEmotionImage, getEmotionColor } from "@/commons/constants/enum";
import styles from "./styles.module.css";

// 일기 데이터 타입 정의
interface DiaryData {
  id: number;
  emotion: Emotion;
  date: string;
  title: string;
}

const DiariesComponent: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock 데이터 생성 - 피그마 디자인과 정확히 일치
  const mockDiaries: DiaryData[] = [
    // 첫 번째 행 (왼쪽부터 오른쪽)
    { id: 1, emotion: Emotion.Sad, date: "2024. 03. 12", title: "타이틀 영역 입니다. 한줄까지만 노출 됩니다." },
    { id: 2, emotion: Emotion.Surprise, date: "2024. 03. 12", title: "타이틀 영역 입니다." },
    { id: 3, emotion: Emotion.Angry, date: "2024. 03. 12", title: "타이틀 영역 입니다." },
    { id: 4, emotion: Emotion.Happy, date: "2024. 03. 12", title: "타이틀 영역 입니다." },
    
    // 두 번째 행 (왼쪽부터 오른쪽)
    { id: 5, emotion: Emotion.Etc, date: "2024. 03. 12", title: "타이틀 영역 입니다. 한줄까지만 노출 됩니다." },
    { id: 6, emotion: Emotion.Surprise, date: "2024. 03. 12", title: "타이틀 영역 입니다." },
    { id: 7, emotion: Emotion.Angry, date: "2024. 03. 12", title: "타이틀 영역 입니다." },
    { id: 8, emotion: Emotion.Happy, date: "2024. 03. 12", title: "타이틀 영역 입니다." },
    
    // 세 번째 행 (왼쪽부터 오른쪽)
    { id: 9, emotion: Emotion.Sad, date: "2024. 03. 12", title: "타이틀 영역 입니다. 한줄까지만 노출 됩니다." },
    { id: 10, emotion: Emotion.Surprise, date: "2024. 03. 12", title: "타이틀 영역 입니다." },
    { id: 11, emotion: Emotion.Angry, date: "2024. 03. 12", title: "타이틀 영역 입니다." },
    { id: 12, emotion: Emotion.Happy, date: "2024. 03. 12", title: "타이틀 영역 입니다." },
  ];

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
    // 일기쓰기 페이지로 이동
    console.log("일기쓰기 클릭");
  };

  const handleDeleteDiary = (diaryId: number) => {
    // 일기 삭제 로직
    console.log("일기 삭제:", diaryId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.gap32}></div>
      <div className={styles.search}>
        <div className={styles.searchLeft}>
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
          {/* 첫 번째 행 */}
          <div className={styles.cardRow}>
            {mockDiaries.slice(0, 4).map((diary) => (
              <div key={diary.id} className={styles.card}>
                <div 
                  className={styles.cardImage}
                  style={{ backgroundColor: getEmotionColor(diary.emotion) }}
                >
                  <Image
                    src={getEmotionImage(diary.emotion)}
                    alt={getEmotionLabel(diary.emotion)}
                    width={80}
                    height={80}
                    className={styles.emotionImage}
                  />
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDeleteDiary(diary.id)}
                  >
                    <Image
                      src="/icons/close_outline_light_s.svg"
                      alt="삭제"
                      width={12}
                      height={12}
                    />
                  </button>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <span 
                      className={styles.emotionText}
                      style={{ color: getEmotionColor(diary.emotion) }}
                    >
                      {getEmotionLabel(diary.emotion)}
                    </span>
                    <span className={styles.dateText}>
                      {diary.date}
                    </span>
                  </div>
                  <div className={styles.titleText}>
                    {diary.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 두 번째 행 */}
          <div className={styles.cardRow}>
            {mockDiaries.slice(4, 8).map((diary) => (
              <div key={diary.id} className={styles.card}>
                <div 
                  className={styles.cardImage}
                  style={{ backgroundColor: getEmotionColor(diary.emotion) }}
                >
                  <Image
                    src={getEmotionImage(diary.emotion)}
                    alt={getEmotionLabel(diary.emotion)}
                    width={80}
                    height={80}
                    className={styles.emotionImage}
                  />
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDeleteDiary(diary.id)}
                  >
                    <Image
                      src="/icons/close_outline_light_s.svg"
                      alt="삭제"
                      width={12}
                      height={12}
                    />
                  </button>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <span 
                      className={styles.emotionText}
                      style={{ color: getEmotionColor(diary.emotion) }}
                    >
                      {getEmotionLabel(diary.emotion)}
                    </span>
                    <span className={styles.dateText}>
                      {diary.date}
                    </span>
                  </div>
                  <div className={styles.titleText}>
                    {diary.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 세 번째 행 */}
          <div className={styles.cardRow}>
            {mockDiaries.slice(8, 12).map((diary) => (
              <div key={diary.id} className={styles.card}>
                <div 
                  className={styles.cardImage}
                  style={{ backgroundColor: getEmotionColor(diary.emotion) }}
                >
                  <Image
                    src={getEmotionImage(diary.emotion)}
                    alt={getEmotionLabel(diary.emotion)}
                    width={80}
                    height={80}
                    className={styles.emotionImage}
                  />
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDeleteDiary(diary.id)}
                  >
                    <Image
                      src="/icons/close_outline_light_s.svg"
                      alt="삭제"
                      width={12}
                      height={12}
                    />
                  </button>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <span 
                      className={styles.emotionText}
                      style={{ color: getEmotionColor(diary.emotion) }}
                    >
                      {getEmotionLabel(diary.emotion)}
                    </span>
                    <span className={styles.dateText}>
                      {diary.date}
                    </span>
                  </div>
                  <div className={styles.titleText}>
                    {diary.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.gap40}></div>
      <div className={styles.pagination}></div>
      <div className={styles.gap40}></div>
    </div>
  );
};

export default DiariesComponent;
