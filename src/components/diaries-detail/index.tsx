"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Button from "@/commons/components/button";
import Input from "@/commons/components/input";
import {
  EmotionImageSize,
  getEmotionImage,
  getEmotionLabel,
  getEmotionColor,
  allEmotions,
} from "@/commons/constants/enum";
import { useDiaryBinding } from "./hooks/index.binding.hook";
import { useRetrospectForm } from "./hooks/index.retrospect.form.hook";
import { useRetrospectBinding } from "./hooks/index.retrospect.binding.hook";
import { useUpdateDiary } from "./hooks/index.update.hook";
import { useDeleteDiary } from "./hooks/index.delete.hook";
import styles from "./styles.module.css";

const DiariesDetailComponent: React.FC = () => {
  const params = useParams();
  const currentDiaryId = params?.id ? Number(params.id) : null;

  // Hook을 사용하여 실제 데이터 바인딩
  const diaryData = useDiaryBinding();

  // 회고 폼 Hook
  const {
    register: retrospectRegister,
    handleSubmit: retrospectHandleSubmit,
    isSubmitEnabled: retrospectIsSubmitEnabled,
  } = useRetrospectForm();

  // 회고 목록 바인딩 Hook
  const retrospectList = useRetrospectBinding(currentDiaryId);

  // 일기 수정 Hook
  const {
    isEditMode,
    register: updateRegister,
    handleSubmit: updateHandleSubmit,
    isSubmitEnabled: updateIsSubmitEnabled,
    handleEdit,
    handleCancel,
    emotion: selectedEmotion,
  } = useUpdateDiary();

  // 일기 삭제 Hook
  const { handleOpenDeleteModal } = useDeleteDiary();

  const handleCopyContent = () => {
    if (diaryData) {
      navigator.clipboard.writeText(diaryData.content);
      alert("내용이 복사되었습니다.");
    }
  };

  return (
    <div className={styles.container} data-testid="diary-detail-container">
      {/* Gap 64px */}
      <div className={styles.gap64}></div>

      {isEditMode ? (
        // 수정 모드
        <form onSubmit={updateHandleSubmit}>
          {/* 감정 선택 영역 */}
          <div className={styles.emotionSelectArea}>
            <h2 className={styles.emotionSelectTitle}>오늘 기분은 어땟나요?</h2>
            <div className={styles.emotionRadioGroup}>
              {allEmotions.map((emotion) => (
                <label key={emotion} className={styles.emotionRadioLabel}>
                  <input
                    type="radio"
                    value={emotion}
                    className={styles.emotionRadioInput}
                    data-testid={`emotion-radio-${emotion}`}
                    {...updateRegister("emotion")}
                  />
                  <Image
                    src={
                      selectedEmotion === emotion
                        ? "/icons/radio_fill_light_m.svg"
                        : "/icons/radio_outline_light_m.svg"
                    }
                    alt="radio"
                    width={24}
                    height={24}
                    className={styles.emotionRadioIcon}
                  />
                  <span className={styles.emotionRadioText}>
                    {getEmotionLabel(emotion)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Gap 24px */}
          <div className={styles.gap24}></div>

          {/* 제목 입력 */}
          <div className={styles.editInputGroup}>
            <label className={styles.editLabel}>제목</label>
            <Input
              variant="primary"
              size="medium"
              theme="light"
              className={styles.editTitleInput}
              data-testid="edit-title-input"
              {...updateRegister("title")}
            />
          </div>

          {/* Gap 24px */}
          <div className={styles.gap24}></div>

          {/* 내용 입력 */}
          <div className={styles.editInputGroup}>
            <label className={styles.editLabel}>내용</label>
            <textarea
              className={styles.editContentTextarea}
              data-testid="edit-content-textarea"
              {...updateRegister("content")}
            />
          </div>

          {/* Gap 24px */}
          <div className={styles.gap24}></div>

          {/* 버튼 영역 */}
          <div className={styles.editButtonGroup}>
            <Button
              variant="tertiary"
              size="medium"
              theme="light"
              type="button"
              onClick={handleCancel}
            >
              취소
            </Button>
            <Button
              variant="primary"
              size="medium"
              theme="light"
              type="submit"
              disabled={!updateIsSubmitEnabled}
            >
              수정 하기
            </Button>
          </div>
        </form>
      ) : (
        // 상세 보기 모드
        <>
          {/* Detail Title */}
          <div className={styles.detailTitle}>
            <div className={styles.titleSection}>
              <h1
                className={styles.title}
                data-testid="diary-title"
                suppressHydrationWarning
              >
                {diaryData?.title || ""}
              </h1>
            </div>
            <div className={styles.emotionAndDate}>
              <div className={styles.emotionSection}>
                <div className={styles.emotionIcon}>
                  {diaryData && (
                    <Image
                      src={getEmotionImage(
                        diaryData.emotion,
                        EmotionImageSize.Small
                      )}
                      alt={getEmotionLabel(diaryData.emotion)}
                      width={32}
                      height={32}
                      data-testid="diary-emotion-image"
                    />
                  )}
                </div>
                <span
                  className={styles.emotionText}
                  data-testid="diary-emotion-text"
                  suppressHydrationWarning
                  style={{
                    color: diaryData
                      ? getEmotionColor(diaryData.emotion)
                      : undefined,
                  }}
                >
                  {diaryData ? getEmotionLabel(diaryData.emotion) : ""}
                </span>
              </div>
              <div className={styles.dateSection}>
                <span
                  className={styles.dateText}
                  data-testid="diary-created-at"
                  suppressHydrationWarning
                >
                  {diaryData?.createdAt || ""}
                </span>
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
              <p
                className={styles.contentText}
                data-testid="diary-content"
                suppressHydrationWarning
              >
                {diaryData?.content || ""}
              </p>
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
                onClick={handleOpenDeleteModal}
              >
                삭제
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Gap 24px */}
      <div className={styles.gap24}></div>

      {/* Retrospect Input - 1168 * 85 */}
      <form onSubmit={retrospectHandleSubmit}>
        <div className={styles.retrospectInput}>
          <h3 className={styles.retrospectTitle}>회고</h3>
          <div className={styles.retrospectInputRow}>
            <Input
              variant="primary"
              size="medium"
              theme="light"
              placeholder={
                isEditMode
                  ? "수정중일땐 회고를 작성할 수 없어요."
                  : "회고를 남겨보세요."
              }
              data-testid="retrospect-input"
              disabled={isEditMode}
              {...retrospectRegister("content")}
            />
            <Button
              variant="primary"
              size="medium"
              theme="light"
              type="submit"
              disabled={!retrospectIsSubmitEnabled || isEditMode}
              data-testid="retrospect-submit-button"
            >
              입력
            </Button>
          </div>
        </div>
      </form>

      {/* Gap 16px */}
      <div className={styles.gap16}></div>

      {/* Retrospect List - 1168 * 72 */}
      <div className={styles.retrospectList}>
        {retrospectList.map((retrospect, index) => (
          <div key={retrospect.id} className={styles.retrospectItem}>
            <div className={styles.retrospectContent}>
              <span
                className={styles.retrospectText}
                data-testid="retrospect-text"
              >
                {retrospect.content}
              </span>
              <span
                className={styles.retrospectDate}
                data-testid="retrospect-date"
              >
                [{retrospect.createdAt}]
              </span>
            </div>
            {index < retrospectList.length - 1 && (
              <div className={styles.retrospectDivider}></div>
            )}
          </div>
        ))}
      </div>

      {/* Gap 40px */}
      <div className={styles.gap40}></div>
    </div>
  );
};

export default DiariesDetailComponent;
