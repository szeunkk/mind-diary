"use client";

import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import Button from "@/commons/components/button";
import Input from "@/commons/components/input";
import {
  Emotion,
  emotionMetadata,
  allEmotions,
} from "@/commons/constants/enum";
import { useModalClose } from "./hooks/index.link.modal.close.hook";
import { useDiaryForm } from "./hooks/index.form.hook";

export default function DiariesNew() {
  const { handleClose } = useModalClose();
  const { form, onSubmit, isFormValid } = useDiaryForm();

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const watchedEmotion = watch("emotion");

  const handleEmotionChange = (emotion: Emotion) => {
    setValue("emotion", emotion);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={styles.wrapper}
      data-testid="diary-new-modal"
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent} data-testid="diary-new-title">
          일기 쓰기
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Emotion Box */}
        <div className={styles.emotionBox}>
          <div className={styles.emotionTitle}>오늘 기분은 어땠나요?</div>
          <div className={styles.emotionRadioGroup}>
            {allEmotions.map((emotion) => (
              <label key={emotion} className={styles.emotionRadioItem}>
                <input
                  type="radio"
                  {...register("emotion")}
                  value={emotion}
                  checked={watchedEmotion === emotion}
                  onChange={() => handleEmotionChange(emotion)}
                  className={styles.emotionRadioInput}
                />
                <div className={styles.emotionRadioIcon}>
                  <Image
                    src={
                      watchedEmotion === emotion
                        ? "/icons/radio_fill_light_m.svg"
                        : "/icons/radio_outline_light_m.svg"
                    }
                    alt=""
                    width={24}
                    height={24}
                  />
                </div>
                <span className={styles.emotionRadioLabel}>
                  {emotionMetadata[emotion].label}
                </span>
              </label>
            ))}
          </div>
          {errors.emotion && (
            <div className={styles.errorMessage}>{errors.emotion.message}</div>
          )}
        </div>

        {/* Text Input Area */}
        <div className={styles.textInputArea}>
          {/* Input Title */}
          <div className={styles.inputTitle}>
            <label className={styles.inputLabel}>제목</label>
            <Input
              variant="primary"
              size="medium"
              theme="light"
              placeholder="제목을 입력합니다."
              {...register("title")}
              className={styles.inputWidth}
            />
            {errors.title && (
              <div className={styles.errorMessage}>{errors.title.message}</div>
            )}
          </div>

          {/* Input Content */}
          <div className={styles.inputContent}>
            <label className={styles.inputLabel}>내용</label>
            <textarea
              placeholder="내용을 입력합니다."
              {...register("content")}
              className={styles.textareaField}
            />
            {errors.content && (
              <div className={styles.errorMessage}>
                {errors.content.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <Button
            type="button"
            variant="secondary"
            size="medium"
            theme="light"
            onClick={handleClose}
            className={styles.buttonWidth}
            data-testid="diary-new-close-button"
          >
            닫기
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="medium"
            theme="light"
            disabled={!isFormValid}
            className={styles.buttonWidth}
            data-testid="diary-new-submit-button"
          >
            등록하기
          </Button>
        </div>
      </div>
    </form>
  );
}
