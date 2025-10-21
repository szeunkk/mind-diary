import { test, expect } from "@playwright/test";

test.describe("회원가입 폼 테스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/signup");
    await page.waitForSelector('[data-testid="signup-form"]');
  });

  test("모든 인풋이 비어있으면 회원가입 버튼이 비활성화되어야 한다", async ({
    page,
  }) => {
    const submitButton = page.locator('[data-testid="submit-button"]');
    await expect(submitButton).toBeDisabled();
  });

  test("이메일에 @ 가 없으면 에러 메시지가 표시되어야 한다", async ({
    page,
  }) => {
    const emailInput = page.locator('[data-testid="email-input"]');

    await emailInput.fill("invalidemail");
    await page.locator('[data-testid="password-input"]').fill("Test1234");

    const emailError = page.locator('[data-testid="email-error"]');
    await expect(emailError).toBeVisible();

    const submitButton = page.locator('[data-testid="submit-button"]');
    await expect(submitButton).toBeDisabled();
  });

  test("비밀번호가 영문+숫자 8자리 미만이면 에러 메시지가 표시되어야 한다", async ({
    page,
  }) => {
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');

    await emailInput.fill("test@example.com");
    await passwordInput.fill("short1");
    await page.locator('[data-testid="password-confirm-input"]').fill("short1");

    const passwordError = page.locator('[data-testid="password-error"]');
    await expect(passwordError).toBeVisible();

    const submitButton = page.locator('[data-testid="submit-button"]');
    await expect(submitButton).toBeDisabled();
  });

  test("비밀번호 확인이 비밀번호와 다르면 에러 메시지가 표시되어야 한다", async ({
    page,
  }) => {
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    const passwordConfirmInput = page.locator(
      '[data-testid="password-confirm-input"]'
    );

    await emailInput.fill("test@example.com");
    await passwordInput.fill("Test1234");
    await passwordConfirmInput.fill("Different1234");
    await page.locator('[data-testid="name-input"]').fill("테스트");

    const passwordConfirmError = page.locator(
      '[data-testid="password-confirm-error"]'
    );
    await expect(passwordConfirmError).toBeVisible();

    const submitButton = page.locator('[data-testid="submit-button"]');
    await expect(submitButton).toBeDisabled();
  });

  test("이름이 비어있으면 버튼이 비활성화되어야 한다", async ({ page }) => {
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');

    await emailInput.fill("test@example.com");
    await passwordInput.fill("Test1234");
    await page
      .locator('[data-testid="password-confirm-input"]')
      .fill("Test1234");

    const submitButton = page.locator('[data-testid="submit-button"]');
    await expect(submitButton).toBeDisabled();
  });

  test("모든 인풋이 올바르게 입력되면 회원가입 버튼이 활성화되어야 한다", async ({
    page,
  }) => {
    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    const passwordConfirmInput = page.locator(
      '[data-testid="password-confirm-input"]'
    );
    const nameInput = page.locator('[data-testid="name-input"]');
    const submitButton = page.locator('[data-testid="submit-button"]');

    await emailInput.fill("test@example.com");
    await passwordInput.fill("Test1234");
    await passwordConfirmInput.fill("Test1234");
    await nameInput.fill("테스트");

    await expect(submitButton).toBeEnabled();
  });

  test("회원가입에 성공하면 가입완료 모달이 표시되고 확인을 누르면 로그인 페이지로 이동해야 한다", async ({
    page,
  }) => {
    const timestamp = Date.now();

    let responseData: { _id: string } | null = null;
    page.on("response", async (response) => {
      if (response.url().includes("graphql")) {
        try {
          const json = await response.json();
          if (json.data?.createUser) {
            responseData = json.data.createUser;
          }
        } catch {}
      }
    });

    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    const passwordConfirmInput = page.locator(
      '[data-testid="password-confirm-input"]'
    );
    const nameInput = page.locator('[data-testid="name-input"]');
    const submitButton = page.locator('[data-testid="submit-button"]');

    await emailInput.fill(`test${timestamp}@example.com`);
    await passwordInput.fill("Test1234");
    await passwordConfirmInput.fill("Test1234");
    await nameInput.fill("테스트유저");

    await submitButton.click();

    await page.waitForSelector('[data-testid="modal-success"]', {
      timeout: 1999,
    });

    expect(responseData).not.toBeNull();
    expect(responseData._id).toBeDefined();
    expect(typeof responseData._id).toBe("string");
    expect(responseData._id.length).toBeGreaterThan(0);

    const successModal = page.locator('[data-testid="modal-success"]');
    await expect(successModal).toBeVisible();

    const confirmButton = successModal.locator("button", { hasText: "확인" });
    await confirmButton.click();

    await expect(page).toHaveURL("/auth/login");
  });

  test("회원가입에 실패하면 가입실패 모달이 표시되고 확인을 누르면 모달만 닫혀야 한다", async ({
    page,
  }) => {
    await page.route("**/graphql", async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      if (postData?.operationName === "createUser") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            errors: [
              {
                message: "이미 존재하는 이메일입니다.",
              },
            ],
          }),
        });
      } else {
        await route.continue();
      }
    });

    const emailInput = page.locator('[data-testid="email-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    const passwordConfirmInput = page.locator(
      '[data-testid="password-confirm-input"]'
    );
    const nameInput = page.locator('[data-testid="name-input"]');
    const submitButton = page.locator('[data-testid="submit-button"]');

    await emailInput.fill("existing@example.com");
    await passwordInput.fill("Test1234");
    await passwordConfirmInput.fill("Test1234");
    await nameInput.fill("테스트유저");

    await submitButton.click();

    await page.waitForSelector('[data-testid="modal-error"]', {
      timeout: 1999,
    });

    const errorModal = page.locator('[data-testid="modal-error"]');
    await expect(errorModal).toBeVisible();

    const confirmButton = errorModal.locator("button", { hasText: "확인" });
    await confirmButton.click();

    await expect(page).toHaveURL("/auth/signup");
    await expect(errorModal).not.toBeVisible();
  });
});
