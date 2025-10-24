import { test, expect, Page } from "@playwright/test";
import { Emotion } from "@/commons/constants/enum";

/**
 * 일기 수정 기능 테스트
 * TDD 기반으로 작성된 테스트 시나리오
 */

// 테스트 데이터 준비
const testDiary = {
  id: 1,
  title: "테스트 일기 제목",
  content: "테스트 일기 내용입니다.",
  emotion: Emotion.Happy,
  createdAt: new Date().toISOString(),
};

const updatedDiary = {
  emotion: Emotion.Sad,
  title: "수정된 일기 제목",
  content: "수정된 일기 내용입니다.",
};

/**
 * 로컬스토리지에 테스트 데이터 설정
 */
async function setupTestDiary(page: Page) {
  await page.evaluate((diary) => {
    localStorage.setItem("diaries", JSON.stringify([diary]));
  }, testDiary);
}

test.describe("일기 수정 기능 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 상태 설정 (모든 페이지 로드 시 적용)
    await page.addInitScript(() => {
      localStorage.setItem("accessToken", "test-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "test-user",
          email: "test@example.com",
          name: "Test User",
        })
      );
    });

    // 로컬스토리지 초기화 및 테스트 데이터 설정
    await page.goto("/diaries/1");
    await setupTestDiary(page);
    await page.reload();
  });

  test("수정 버튼 클릭 시 수정 모드로 전환", async ({ page }) => {
    // 페이지 로드 확인 (data-testid 대기)
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 로드될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return (
          titleEl && titleEl.textContent && titleEl.textContent.trim() !== ""
        );
      },
      { timeout: 500 }
    );

    // 수정 버튼 찾기 및 클릭
    const editButton = page.getByRole("button", { name: "수정" });
    await expect(editButton).toBeVisible();
    await editButton.click();

    // 수정 모드로 전환 확인
    // 1. 감정 선택 라디오 버튼이 보이는지 확인
    await expect(page.getByText("오늘 기분은 어땟나요?")).toBeVisible();

    // 2. 제목 입력 필드가 보이는지 확인
    const titleInput = page.locator('[data-testid="edit-title-input"]');
    await expect(titleInput).toBeVisible();

    // 3. 내용 입력 필드가 보이는지 확인
    const contentTextarea = page.locator(
      '[data-testid="edit-content-textarea"]'
    );
    await expect(contentTextarea).toBeVisible();

    // 4. 수정하기 버튼이 보이는지 확인
    const updateButton = page.getByRole("button", { name: "수정 하기" });
    await expect(updateButton).toBeVisible();

    // 5. 취소 버튼이 보이는지 확인
    const cancelButton = page.getByRole("button", { name: "취소" });
    await expect(cancelButton).toBeVisible();
  });

  test("수정 모드에서 회고 입력창이 비활성화됨", async ({ page }) => {
    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 로드될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return (
          titleEl && titleEl.textContent && titleEl.textContent.trim() !== ""
        );
      },
      { timeout: 500 }
    );

    // 수정 버튼 클릭
    const editButton = page.getByRole("button", { name: "수정" });
    await editButton.click();

    // 수정 모드 진입 확인
    await expect(page.getByText("오늘 기분은 어땟나요?")).toBeVisible();

    // 회고 입력창 비활성화 확인
    const retrospectInput = page.locator('[data-testid="retrospect-input"]');
    await expect(retrospectInput).toBeDisabled();

    // 회고 입력 버튼 비활성화 확인
    const retrospectSubmitButton = page.locator(
      '[data-testid="retrospect-submit-button"]'
    );
    await expect(retrospectSubmitButton).toBeDisabled();
  });

  test("수정 모드에서 데이터 변경 후 수정하기 클릭", async ({ page }) => {
    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 로드될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return (
          titleEl && titleEl.textContent && titleEl.textContent.trim() !== ""
        );
      },
      { timeout: 500 }
    );

    // 수정 버튼 클릭
    const editButton = page.getByRole("button", { name: "수정" });
    await editButton.click();

    // 수정 모드 진입 확인
    await expect(page.getByText("오늘 기분은 어땟나요?")).toBeVisible();

    // 1. 감정 변경 (슬퍼요 선택) - label을 클릭
    const sadRadioLabel = page
      .locator("label")
      .filter({ has: page.locator('[data-testid="emotion-radio-SAD"]') });
    await sadRadioLabel.click();

    // 2. 제목 변경
    const titleInput = page.locator('[data-testid="edit-title-input"]');
    await titleInput.clear();
    await titleInput.fill(updatedDiary.title);

    // 3. 내용 변경
    const contentTextarea = page.locator(
      '[data-testid="edit-content-textarea"]'
    );
    await contentTextarea.clear();
    await contentTextarea.fill(updatedDiary.content);

    // 4. 수정하기 버튼 클릭
    const updateButton = page.getByRole("button", { name: "수정 하기" });
    await updateButton.click();

    // 5. 수정 완료 후 상세 화면으로 돌아감 확인
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 리프레시될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return (
          titleEl && titleEl.textContent && titleEl.textContent.trim() !== ""
        );
      },
      { timeout: 500 }
    );

    // 6. 수정된 내용 확인
    const updatedTitle = page.locator('[data-testid="diary-title"]');
    await expect(updatedTitle).toHaveText(updatedDiary.title);

    const updatedContent = page.locator('[data-testid="diary-content"]');
    await expect(updatedContent).toHaveText(updatedDiary.content);

    const updatedEmotion = page.locator('[data-testid="diary-emotion-text"]');
    await expect(updatedEmotion).toHaveText("슬퍼요");

    // 7. 로컬스토리지에 반영 확인
    const savedDiaries = await page.evaluate(() => {
      const data = localStorage.getItem("diaries");
      return data ? JSON.parse(data) : [];
    });

    expect(savedDiaries).toHaveLength(1);
    expect(savedDiaries[0].title).toBe(updatedDiary.title);
    expect(savedDiaries[0].content).toBe(updatedDiary.content);
    expect(savedDiaries[0].emotion).toBe(Emotion.Sad);
  });

  test("취소 버튼 클릭 시 수정 취소 및 상세 화면으로 복귀", async ({
    page,
  }) => {
    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 로드될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return (
          titleEl && titleEl.textContent && titleEl.textContent.trim() !== ""
        );
      },
      { timeout: 500 }
    );

    // 원본 데이터 확인
    const originalTitle = await page
      .locator('[data-testid="diary-title"]')
      .textContent();

    // 수정 버튼 클릭
    const editButton = page.getByRole("button", { name: "수정" });
    await editButton.click();

    // 수정 모드 진입 확인
    await expect(page.getByText("오늘 기분은 어땟나요?")).toBeVisible();

    // 데이터 변경
    const titleInput = page.locator('[data-testid="edit-title-input"]');
    await titleInput.clear();
    await titleInput.fill("취소될 제목");

    // 취소 버튼 클릭
    const cancelButton = page.getByRole("button", { name: "취소" });
    await cancelButton.click();

    // 상세 화면으로 복귀 확인
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 로드될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return (
          titleEl && titleEl.textContent && titleEl.textContent.trim() !== ""
        );
      },
      { timeout: 500 }
    );

    // 원본 데이터 유지 확인
    const currentTitle = await page
      .locator('[data-testid="diary-title"]')
      .textContent();
    expect(currentTitle).toBe(originalTitle);

    // 수정/삭제 버튼이 다시 보이는지 확인
    await expect(page.getByRole("button", { name: "수정" })).toBeVisible();
    await expect(page.getByRole("button", { name: "삭제" })).toBeVisible();
  });

  test("수정 모드에서 필수 입력값 검증", async ({ page }) => {
    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 로드될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return (
          titleEl && titleEl.textContent && titleEl.textContent.trim() !== ""
        );
      },
      { timeout: 500 }
    );

    // 수정 버튼 클릭
    const editButton = page.getByRole("button", { name: "수정" });
    await editButton.click();

    // 수정 모드 진입 확인
    await expect(page.getByText("오늘 기분은 어땟나요?")).toBeVisible();

    // 제목을 비움
    const titleInput = page.locator('[data-testid="edit-title-input"]');
    await titleInput.clear();

    // 수정하기 버튼이 비활성화되어야 함
    const updateButton = page.getByRole("button", { name: "수정 하기" });
    await expect(updateButton).toBeDisabled();
  });
});
