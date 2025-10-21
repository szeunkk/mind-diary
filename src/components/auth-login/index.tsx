"use client";

import React from "react";
import Input from "@/commons/components/input";
import Button from "@/commons/components/button";
import styles from "./styles.module.css";
import { useLoginForm } from "./hooks/index.form.hook";

const AuthLoginComponent: React.FC = () => {
  const { register, handleSubmit, errors, isValid, isSubmitting } =
    useLoginForm();

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>
            민지의 다이어리에 오신 것을 환영합니다
          </p>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
          data-testid="login-form"
        >
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
                data-testid="login-email-input"
                {...register("email")}
              />
              {errors.email && (
                <p className={styles.errorMessage} data-testid="email-error">
                  {errors.email.message}
                </p>
              )}
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
                data-testid="login-password-input"
                {...register("password")}
              />
              {errors.password && (
                <p className={styles.errorMessage} data-testid="password-error">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button
            variant="primary"
            size="medium"
            theme="light"
            className={styles.submitButton}
            type="submit"
            disabled={!isValid || isSubmitting}
            data-testid="login-submit-button"
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
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
