"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";
import Button from "@/commons/components/button";
import Input from "@/commons/components/input";
import { Emotion, emotionMetadata, allEmotions } from "@/commons/constants/enum";

export default function DiariesNew() {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleEmotionChange = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleClose = () => {
    // 닫기 로직
    console.log("닫기");
  };

  const handleSubmit = () => {
    // 등록 로직
    console.log("등록하기", { selectedEmotion, title, content });
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>일기 쓰기</div>
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
                  name="emotion"
                  value={emotion}
                  checked={selectedEmotion === emotion}
                  onChange={() => handleEmotionChange(emotion)}
                  className={styles.emotionRadioInput}
                />
                <div className={styles.emotionRadioIcon}>
                  <img 
                    src={selectedEmotion === emotion ? "/icons/radio_fill_light_m.svg" : "/icons/radio_outline_light_m.svg"}
                    alt=""
                  />
                </div>
                <span className={styles.emotionRadioLabel}>
                  {emotionMetadata[emotion].label}
                </span>
              </label>
            ))}
          </div>
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.inputWidth}
            />
          </div>
          
          {/* Input Content */}
          <div className={styles.inputContent}>
            <label className={styles.inputLabel}>내용</label>
            <textarea
              placeholder="내용을 입력합니다."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.textareaField}
            />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <Button
            variant="outline"
            size="medium"
            theme="light"
            onClick={handleClose}
            className={styles.buttonWidth}
          >
            닫기
          </Button>
          <Button
            variant="primary"
            size="medium"
            theme="light"
            onClick={handleSubmit}
            className={styles.buttonWidth}
          >
            등록하기
          </Button>
        </div>
      </div>
    </div>
  );
}
