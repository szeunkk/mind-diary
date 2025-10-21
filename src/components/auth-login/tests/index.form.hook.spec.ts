import { test, expect } from "@playwright/test";

test.describe("로그인 폼 훅 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 페이지 이동
    await page.goto("/auth/login");

    // 페이지가 완전히 로드될 때까지 대기 (data-testid로 식별)
    await page.waitForSelector('[data-testid="login-form"]');
  });

  test("모든 인풋이 입력되면 로그인버튼이 활성화된다", async ({ page }) => {
    // 초기 상태: 버튼이 비활성화되어 있어야 함
    const submitButton = page.getByTestId("login-submit-button");
    await expect(submitButton).toBeDisabled();

    // 이메일 입력
    await page.getByTestId("login-email-input").fill("a@c.com");

    // 비밀번호 입력 전에는 여전히 비활성화
    await expect(submitButton).toBeDisabled();

    // 비밀번호 입력
    await page.getByTestId("login-password-input").fill("1234qwer");

    // 모든 입력 후 버튼 활성화
    await expect(submitButton).toBeEnabled();
  });

  test("로그인 성공 시나리오 - 실제 API 사용", async ({ page }) => {
    // 실제 데이터 입력
    await page.getByTestId("login-email-input").fill("a@c.com");
    await page.getByTestId("login-password-input").fill("1234qwer");

    // 로그인 버튼 클릭
    await page.getByTestId("login-submit-button").click();

    // 성공 모달이 나타날 때까지 대기 (2000ms 미만)
    await page.waitForSelector('[data-testid="modal-success"]', {
      timeout: 2000,
    });

    // 모달 내용 확인
    await expect(page.getByText("로그인 완료")).toBeVisible();

    // 로컬스토리지에 accessToken이 저장되었는지 확인
    const accessToken = await page.evaluate(() =>
      localStorage.getItem("accessToken")
    );
    expect(accessToken).toBeTruthy();
    expect(typeof accessToken).toBe("string");

    // 로컬스토리지에 user 정보가 저장되었는지 확인
    const userStr = await page.evaluate(() => localStorage.getItem("user"));
    expect(userStr).toBeTruthy();

    const user = JSON.parse(userStr || "{}");
    expect(user._id).toBeTruthy();
    expect(user.name).toBeTruthy();

    // 모달의 확인 버튼 클릭
    await page.getByTestId("modal-confirm-button").click();

    // 일기목록 페이지로 이동되었는지 확인
    await expect(page).toHaveURL("/diaries");
  });

  test("로그인 실패 시나리오 - API 모킹", async ({ page }) => {
    // GraphQL API 요청을 가로채서 에러 반환
    await page.route("**/graphql", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          errors: [
            {
              message: "이메일 또는 비밀번호가 일치하지 않습니다",
            },
          ],
        }),
      });
    });

    // 임의의 데이터 입력
    await page.getByTestId("login-email-input").fill("wrong@test.com");
    await page.getByTestId("login-password-input").fill("wrongpass");

    // 로그인 버튼 클릭
    await page.getByTestId("login-submit-button").click();

    // 실패 모달이 나타날 때까지 대기 (2000ms 미만)
    await page.waitForSelector('[data-testid="modal-error"]', {
      timeout: 2000,
    });

    // 모달 내용 확인
    await expect(page.getByText("로그인 실패")).toBeVisible();

    // 모달의 확인 버튼 클릭
    await page.getByTestId("modal-confirm-button").click();

    // 모달이 닫혔는지 확인
    await expect(page.getByTestId("modal-error")).not.toBeVisible();

    // 여전히 로그인 페이지에 있어야 함
    await expect(page).toHaveURL("/auth/login");
  });

  test("이메일 검증 - @ 포함 확인", async ({ page }) => {
    // @ 없는 이메일 입력
    await page.getByTestId("login-email-input").fill("invalidemail");
    await page.getByTestId("login-password-input").fill("1234qwer");

    // 버튼이 비활성화되어야 함
    const submitButton = page.getByTestId("login-submit-button");
    await expect(submitButton).toBeDisabled();

    // @ 포함한 이메일로 수정
    await page.getByTestId("login-email-input").fill("valid@email.com");

    // 버튼이 활성화되어야 함
    await expect(submitButton).toBeEnabled();
  });

  test("비밀번호 검증 - 최소 1글자 이상", async ({ page }) => {
    // 이메일 입력
    await page.getByTestId("login-email-input").fill("test@test.com");

    // 빈 비밀번호
    const submitButton = page.getByTestId("login-submit-button");
    await expect(submitButton).toBeDisabled();

    // 1글자 입력
    await page.getByTestId("login-password-input").fill("1");

    // 버튼이 활성화되어야 함
    await expect(submitButton).toBeEnabled();
  });
});
