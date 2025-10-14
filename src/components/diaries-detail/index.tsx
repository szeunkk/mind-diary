"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "@/commons/components/button";
import Input from "@/commons/components/input";
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

// 회고 데이터 타입 정의
interface RetrospectData {
  id: string;
  content: string;
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

// Mock 회고 데이터
const mockRetrospectData: RetrospectData[] = [
  {
    id: "1",
    content: "3년이 지나고 다시 보니 이때가 그립다.",
    createdAt: "2024. 09. 24",
  },
  {
    id: "2",
    content: "3년이 지나고 다시 보니 이때가 그립다.",
    createdAt: "2024. 09. 24",
  },
];

const DiariesDetailComponent: React.FC = () => {
  const [retrospectInput, setRetrospectInput] = useState("");
  const [retrospectList, setRetrospectList] =
    useState<RetrospectData[]>(mockRetrospectData);

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

  const handleRetrospectSubmit = () => {
    if (retrospectInput.trim()) {
      const newRetrospect: RetrospectData = {
        id: Date.now().toString(),
        content: retrospectInput.trim(),
        createdAt: new Date()
          .toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\./g, ". ")
          .replace(/\s+$/, ""),
      };
      setRetrospectList([newRetrospect, ...retrospectList]);
      setRetrospectInput("");
    }
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
            variant="tertiary"
            size="small"
            theme="light"
            onClick={handleEdit}
          >
            수정
          </Button>
          <Button
            variant="tertiary"
            size="small"
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
        <h3 className={styles.retrospectTitle}>회고</h3>
        <div className={styles.retrospectInputRow}>
          <Input
            variant="primary"
            size="medium"
            theme="light"
            placeholder="회고를 남겨보세요."
            value={retrospectInput}
            onChange={(e) => setRetrospectInput(e.target.value)}
            className={styles.retrospectInputField}
          />
          <Button
            variant="primary"
            size="medium"
            theme="light"
            onClick={handleRetrospectSubmit}
          >
            입력
          </Button>
        </div>
      </div>

      {/* Gap 16px */}
      <div className={styles.gap16}></div>

      {/* Retrospect List - 1168 * 72 */}
      <div className={styles.retrospectList}>
        {retrospectList.map((retrospect, index) => (
          <div key={retrospect.id} className={styles.retrospectItem}>
            <div className={styles.retrospectContent}>
              <span className={styles.retrospectText}>
                {retrospect.content}
              </span>
              <span className={styles.retrospectDate}>
                [{retrospect.createdAt}]
              </span>
            </div>
            {index < retrospectList.length - 1 && (
              <div className={styles.retrospectDivider}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiariesDetailComponent;
