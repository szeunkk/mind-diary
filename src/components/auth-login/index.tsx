"use client";

import React from "react";
import Input from "@/commons/components/input";
import Button from "@/commons/components/button";
import styles from "./styles.module.css";

const AuthLoginComponent: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>
            민지의 다이어리에 오신 것을 환영합니다
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">
              이메일
            </label>
            <div>
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
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">
              비밀번호
            </label>
            <div>
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
          </div>

          <Button
            variant="primary"
            size="medium"
            theme="light"
            className={styles.submitButton}
            type="submit"
          >
            로그인
          </Button>
        </form>

        <div className={styles.footer}>
          <a href="/auth/signup" className={styles.signupLink}>
            계정이 없으신가요? 회원가입
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthLoginComponent;
