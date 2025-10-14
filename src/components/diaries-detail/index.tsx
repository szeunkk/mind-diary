import React from "react";
import styles from "./styles.module.css";

const DiariesDetailComponent: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Gap 64px */}
      <div className={styles.gap64}></div>

      {/* Detail Title - 1168 * 84 */}
      <div className={styles.detailTitle}>
        <div className={styles.titleContent}>Detail Title Area</div>
      </div>

      {/* Gap 24px */}
      <div className={styles.gap24}></div>

      {/* Detail Content - 1168 * 169 */}
      <div className={styles.detailContent}>
        <div className={styles.contentArea}>Detail Content Area</div>
      </div>

      {/* Gap 24px */}
      <div className={styles.gap24}></div>

      {/* Detail Footer - 1168 * 56 */}
      <div className={styles.detailFooter}>
        <div className={styles.footerContent}>Detail Footer Area</div>
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
