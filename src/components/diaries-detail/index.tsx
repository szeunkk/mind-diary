"use client";

import React from "react";
import Image from "next/image";
import Button from "@/commons/components/button";
import {
  Emotion,
  EmotionImageSize,
  getEmotionImage,
  getEmotionLabel,
} from "@/commons/constants/enum";
import styles from "./styles.module.css";

// Mock 데이터 타입 정의
interface DiaryDetailData {
  id: string;
  title: string;
  content: string;
  emotion: Emotion;
  createdAt: string;
}

// Mock 데이터
const mockDiaryData: DiaryDetailData = {
  id: "1",
  title: "이것은 타이틀 입니다.",
  content:
    "내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다내용이 들어갑니다",
  emotion: Emotion.Happy,
  createdAt: "2024. 07. 12",
};

const DiariesDetailComponent: React.FC = () => {
  const handleCopyContent = () => {
    navigator.clipboard.writeText(mockDiaryData.content);
    alert("내용이 복사되었습니다.");
  };

  const handleEdit = () => {
    console.log("수정 버튼 클릭");
  };

  const handleDelete = () => {
    console.log("삭제 버튼 클릭");
  };

  return (
    <div className={styles.container}>
      {/* Gap 64px */}
      <div className={styles.gap64}></div>

      {/* Detail Title */}
      <div className={styles.detailTitle}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{mockDiaryData.title}</h1>
        </div>
        <div className={styles.emotionAndDate}>
          <div className={styles.emotionSection}>
            <div className={styles.emotionIcon}>
              <Image
                src={getEmotionImage(
                  mockDiaryData.emotion,
                  EmotionImageSize.Small
                )}
                alt={getEmotionLabel(mockDiaryData.emotion)}
                width={32}
                height={32}
              />
            </div>
            <span className={styles.emotionText}>
              {getEmotionLabel(mockDiaryData.emotion)}
            </span>
          </div>
          <div className={styles.dateSection}>
            <span className={styles.dateText}>{mockDiaryData.createdAt}</span>
            <span className={styles.dateLabel}>작성</span>
          </div>
        </div>
      </div>

      {/* Gap 24px */}
      <div className={styles.gap24}></div>

      {/* Detail Content */}
      <div className={styles.detailContent}>
        <div className={styles.contentSection}>
          <h2 className={styles.contentTitle}>내용</h2>
          <p className={styles.contentText}>{mockDiaryData.content}</p>
        </div>
        <div className={styles.copySection}>
          <button className={styles.copyButton} onClick={handleCopyContent}>
            <Image
              src="/icons/copy_outline_light_m.svg"
              alt="복사"
              width={24}
              height={24}
            />
            <span className={styles.copyText}>내용 복사</span>
          </button>
        </div>
      </div>

      {/* Gap 24px */}
      <div className={styles.gap24}></div>

      {/* Detail Footer */}
      <div className={styles.detailFooter}>
        <div className={styles.buttonGroup}>
          <Button
            variant="outline"
            size="medium"
            theme="light"
            onClick={handleEdit}
          >
            수정
          </Button>
          <Button
            variant="outline"
            size="medium"
            theme="light"
            onClick={handleDelete}
          >
            삭제
          </Button>
        </div>
      </div>

      {/* Gap 24px */}
      <div className={styles.gap24}></div>

      {/* Retrospect Input - 1168 * 85 */}
      <div className={styles.retrospectInput}>
        <div className={styles.inputArea}>Retrospect Input Area</div>
      </div>

      {/* Gap 16px */}
      <div className={styles.gap16}></div>

      {/* Retrospect List - 1168 * 72 */}
      <div className={styles.retrospectList}>
        <div className={styles.listArea}>Retrospect List Area</div>
      </div>
    </div>
  );
};

export default DiariesDetailComponent;
