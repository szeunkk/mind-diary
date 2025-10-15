"use client";

import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { useLinkRouting } from "./hooks/index.link.routing.hook";
import { useArea } from "./hooks/index.area.hook";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const {
    handleLogoClick,
    handleDiariesClick,
    handlePicturesClick,
    isDiariesActive,
    isPicturesActive,
  } = useLinkRouting();

  const { showHeader, showHeaderLogo, showBanner, showNavigation, showFooter } =
    useArea();

  return (
    <div className={styles.layout}>
      {showHeader && (
        <header className={styles.header} data-testid="layout-header">
          <div className={styles.headerContent}>
            {showHeaderLogo && (
              <div
                className={styles.logo}
                onClick={handleLogoClick}
                data-testid="header-logo"
              >
                <p className={styles.logoText}>민지의 다이어리</p>
              </div>
            )}
            <div className={styles.headerActions}></div>
          </div>
        </header>
      )}

      {showBanner && <div className={styles.gap}></div>}

      {showBanner && (
        <section className={styles.banner} data-testid="layout-banner">
          <div className={styles.bannerContent}>
            <div className={styles.bannerImage}>
              <Image
                src="/images/banner.png"
                alt="배너 이미지"
                width={1168}
                height={240}
                className={styles.bannerImg}
              />
            </div>
          </div>
        </section>
      )}

      {showBanner && <div className={styles.gap}></div>}

      {showNavigation && (
        <nav className={styles.navigation} data-testid="layout-navigation">
          <div className={styles.navigationContent}>
            <div className={styles.tabContainer}>
              <div
                className={`${styles.tab} ${
                  isDiariesActive ? styles.tabActive : ""
                }`}
                onClick={handleDiariesClick}
                data-testid="nav-diaries"
              >
                <p
                  className={
                    isDiariesActive
                      ? styles.tabTextActive
                      : styles.tabTextInactive
                  }
                >
                  일기보관함
                </p>
              </div>
              <div
                className={`${styles.tab} ${
                  isPicturesActive ? styles.tabActive : ""
                }`}
                onClick={handlePicturesClick}
                data-testid="nav-pictures"
              >
                <p
                  className={
                    isPicturesActive
                      ? styles.tabTextActive
                      : styles.tabTextInactive
                  }
                >
                  사진보관함
                </p>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className={styles.children}>{children}</main>

      {showFooter && (
        <footer className={styles.footer} data-testid="layout-footer">
          <div className={styles.footerContent}>
            <p className={styles.footerLogo}>민지의 다이어리</p>
            <div className={styles.footerInfo}>
              <p className={styles.footerText}>대표 : {"{name}"}</p>
            </div>
            <p className={styles.footerCopyright}>
              Copyright © 2024. {"{name}"} Co., Ltd.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
