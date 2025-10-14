import React from "react";
import styles from "./styles.module.css";

export default function DiariesNew() {
  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>Header Area</div>
      </div>
      
      {/* Gap 1 */}
      <div className={styles.gap}></div>
      
      {/* Emotion Box */}
      <div className={styles.emotionBox}>
        <div className={styles.emotionContent}>Emotion Box Area</div>
      </div>
      
      {/* Gap 2 */}
      <div className={styles.gap}></div>
      
      {/* Input Title */}
      <div className={styles.inputTitle}>
        <div className={styles.inputTitleContent}>Input Title Area</div>
      </div>
      
      {/* Gap 3 */}
      <div className={styles.gapSmall}></div>
      
      {/* Input Content */}
      <div className={styles.inputContent}>
        <div className={styles.inputContentArea}>Input Content Area</div>
      </div>
      
      {/* Gap 4 */}
      <div className={styles.gap}></div>
      
      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerContent}>Footer Area</div>
      </div>
    </div>
  );
}
