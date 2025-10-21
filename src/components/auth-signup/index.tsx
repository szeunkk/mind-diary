"use client";

import React from "react";
import Input from "@/commons/components/input";
import Button from "@/commons/components/button";
import styles from "./styles.module.css";

const AuthSignupComponent: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>
            민지의 다이어리에 오신 것을 환영합니다
          </p>
        </div>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              variant="primary"
              size="medium"
              theme="light"
              placeholder="이메일을 입력하세요"
              className={styles.inputWrapper}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              variant="primary"
              size="medium"
              theme="light"
              placeholder="비밀번호를 입력하세요"
              className={styles.inputWrapper}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="confirmPassword">
              비밀번호 재입력
            </label>
            <Input
              id="confirmPassword"
              type="password"
              variant="primary"
              size="medium"
              theme="light"
              placeholder="비밀번호를 다시 입력하세요"
              className={styles.inputWrapper}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="name">
              이름
            </label>
            <Input
              id="name"
              type="text"
              variant="primary"
              size="medium"
              theme="light"
              placeholder="이름을 입력하세요"
              className={styles.inputWrapper}
            />
          </div>

          <Button
            variant="primary"
            size="medium"
            theme="light"
            className={styles.submitButton}
            type="submit"
          >
            회원가입
          </Button>
        </form>

        <div className={styles.footer}>
          <a href="#" className={styles.loginLink}>
            이미 계정이 있으신가요? 로그인
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthSignupComponent;
