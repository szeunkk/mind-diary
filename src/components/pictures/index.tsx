import styles from "./styles.module.css";

export default function Pictures() {
  return (
    <div className={styles.container}>
      <div className={styles.gap1}></div>
      <div className={styles.filter}>
        <span>Filter Area</span>
      </div>
      <div className={styles.gap2}></div>
      <div className={styles.main}>
        <span>Main Content Area</span>
      </div>
    </div>
  );
}
