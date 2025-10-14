import React from 'react';
import styles from './styles.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        {/* Header 영역 */}
      </header>
      
      <div className={styles.gap}></div>
      
      <section className={styles.banner}>
        {/* Banner 영역 */}
      </section>
      
      <div className={styles.gap}></div>
      
      <nav className={styles.navigation}>
        {/* Navigation 영역 */}
      </nav>
      
      <main className={styles.children}>
        {children}
      </main>
      
      <footer className={styles.footer}>
        {/* Footer 영역 */}
      </footer>
    </div>
  );
};

export default Layout;
