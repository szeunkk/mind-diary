import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <p className={styles.logoText}>
              민지의 다이어리
            </p>
          </div>
          <div className={styles.headerActions}></div>
        </div>
      </header>
      
      <div className={styles.gap}></div>
      
      <section className={styles.banner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerImage}>
            <Image 
              src="/images/banner.png" 
              alt="배너 이미지" 
              fill
              className={styles.bannerImg}
            />
          </div>
        </div>
      </section>
      
      <div className={styles.gap}></div>
      
      <nav className={styles.navigation}>
        <div className={styles.navigationContent}>
          <div className={styles.tabContainer}>
            <div className={`${styles.tab} ${styles.tabActive}`}>
              <p className={styles.tabTextActive}>
                일기보관함
              </p>
            </div>
            <div className={styles.tab}>
              <p className={styles.tabTextInactive}>
                사진보관함
              </p>
            </div>
          </div>
        </div>
      </nav>
      
      <main className={styles.children}>
        {children}
      </main>
      
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerLogo}>
            민지의 다이어리
          </p>
          <div className={styles.footerInfo}>
            <p className={styles.footerText}>
              대표 : {'{name}'}
            </p>
          </div>
          <p className={styles.footerCopyright}>
            Copyright © 2024. {'{name}'} Co., Ltd.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
