import { test, expect } from "@playwright/test";

test.describe("Diary Form Hook Tests", () => {
  test.beforeEach(async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto("/diaries");

    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-page"]', {
      timeout: 500,
    });

    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="diary-new-open-button"]');

    // 일기쓰기 모달이 열릴 때까지 대기
    await page.waitForSelector('[data-testid="diary-new-modal"]', {
      timeout: 500,
    });
  });

  test("폼 초기 상태 확인", async ({ page }) => {
    // 등록하기 버튼이 비활성화되어 있는지 확인
    const submitButton = page.locator(
      '[data-testid="diary-new-submit-button"]'
    );
    await expect(submitButton).toBeDisabled();

    // 모든 입력 필드가 비어있는지 확인
    await expect(page.locator('input[name="emotion"]:checked')).toHaveCount(0);
    await expect(
      page.locator('input[placeholder="제목을 입력합니다."]')
    ).toHaveValue("");
    await expect(
      page.locator('textarea[placeholder="내용을 입력합니다."]')
    ).toHaveValue("");
  });

  test("감정 선택 기능", async ({ page }) => {
    // 첫 번째 감정(행복해요) 선택 - 라벨을 클릭
    await page.click('label:has(input[value="HAPPY"])');

    // 선택된 감정이 체크되는지 확인
    await expect(page.locator('input[value="HAPPY"]')).toBeChecked();

    // 다른 감정 선택 - 라벨을 클릭
    await page.click('label:has(input[value="SAD"])');

    // 이전 감정이 해제되고 새로운 감정이 선택되는지 확인
    await expect(page.locator('input[value="HAPPY"]')).not.toBeChecked();
    await expect(page.locator('input[value="SAD"]')).toBeChecked();
  });

  test("제목 입력 기능", async ({ page }) => {
    const titleInput = page.locator('input[placeholder="제목을 입력합니다."]');

    // 제목 입력
    await titleInput.fill("테스트 일기 제목");

    // 입력된 값 확인
    await expect(titleInput).toHaveValue("테스트 일기 제목");
  });

  test("내용 입력 기능", async ({ page }) => {
    const contentTextarea = page.locator(
      'textarea[placeholder="내용을 입력합니다."]'
    );

    // 내용 입력
    await contentTextarea.fill("테스트 일기 내용입니다.");

    // 입력된 값 확인
    await expect(contentTextarea).toHaveValue("테스트 일기 내용입니다.");
  });

  test("모든 필드 입력 후 등록하기 버튼 활성화", async ({ page }) => {
    // 모든 필드 입력
    await page.click('label:has(input[value="HAPPY"])'); // 감정 선택
    await page.fill('input[placeholder="제목을 입력합니다."]', "테스트 제목");
    await page.fill(
      'textarea[placeholder="내용을 입력합니다."]',
      "테스트 내용"
    );

    // 등록하기 버튼이 활성화되는지 확인
    const submitButton = page.locator(
      '[data-testid="diary-new-submit-button"]'
    );
    await expect(submitButton).toBeEnabled();
  });

  test("라디오 버튼을 마지막에 클릭해도 등록하기 버튼 활성화", async ({
    page,
  }) => {
    // 제목과 내용을 먼저 입력
    await page.fill('input[placeholder="제목을 입력합니다."]', "테스트 제목");
    await page.fill(
      'textarea[placeholder="내용을 입력합니다."]',
      "테스트 내용"
    );

    // 등록하기 버튼이 아직 비활성화되어 있는지 확인
    const submitButton = page.locator(
      '[data-testid="diary-new-submit-button"]'
    );
    await expect(submitButton).toBeDisabled();

    // 마지막에 감정 선택
    await page.click('label:has(input[value="HAPPY"])');

    // 등록하기 버튼이 활성화되는지 확인
    await expect(submitButton).toBeEnabled();
  });

  test("다양한 입력 순서에서 등록하기 버튼 활성화 - 감정 → 제목 → 내용", async ({
    page,
  }) => {
    const submitButton = page.locator(
      '[data-testid="diary-new-submit-button"]'
    );

    // 1. 감정 선택
    await page.click('label:has(input[value="SAD"])');
    await expect(submitButton).toBeDisabled();

    // 2. 제목 입력
    await page.fill('input[placeholder="제목을 입력합니다."]', "테스트 제목");
    await expect(submitButton).toBeDisabled();

    // 3. 내용 입력
    await page.fill(
      'textarea[placeholder="내용을 입력합니다."]',
      "테스트 내용"
    );
    await expect(submitButton).toBeEnabled();
  });

  test("다양한 입력 순서에서 등록하기 버튼 활성화 - 내용 → 제목 → 감정", async ({
    page,
  }) => {
    const submitButton = page.locator(
      '[data-testid="diary-new-submit-button"]'
    );

    // 1. 내용 입력
    await page.fill(
      'textarea[placeholder="내용을 입력합니다."]',
      "테스트 내용"
    );
    await expect(submitButton).toBeDisabled();

    // 2. 제목 입력
    await page.fill('input[placeholder="제목을 입력합니다."]', "테스트 제목");
    await expect(submitButton).toBeDisabled();

    // 3. 감정 선택
    await page.click('label:has(input[value="ANGRY"])');
    await expect(submitButton).toBeEnabled();
  });

  test("빈 필드가 있을 때 등록하기 버튼 비활성화", async ({ page }) => {
    // 제목만 입력 (감정, 내용 없음)
    await page.fill('input[placeholder="제목을 입력합니다."]', "테스트 제목");

    // 등록하기 버튼이 비활성화되어 있는지 확인
    const submitButton = page.locator(
      '[data-testid="diary-new-submit-button"]'
    );
    await expect(submitButton).toBeDisabled();
  });

  test("첫 번째 일기 등록 성공 시나리오", async ({ page }) => {
    // 로컬스토리지 초기화 (기존 diaries 데이터 제거)
    await page.evaluate(() => {
      localStorage.removeItem("diaries");
    });

    // 모든 필드 입력
    await page.click('label:has(input[value="HAPPY"])');
    await page.fill('input[placeholder="제목을 입력합니다."]', "첫 번째 일기");
    await page.fill(
      'textarea[placeholder="내용을 입력합니다."]',
      "첫 번째 일기 내용입니다."
    );

    // 등록하기 버튼 클릭
    await page.click('[data-testid="diary-new-submit-button"]');

    // 등록 완료 모달이 표시되는지 확인
    await expect(page.locator("text=일기 등록 완료")).toBeVisible({
      timeout: 500,
    });
    await expect(page.locator("text=등록이 완료 되었습니다.")).toBeVisible();

    // 로컬스토리지에 데이터가 저장되었는지 확인
    const storedData = await page.evaluate(() => {
      return localStorage.getItem("diaries");
    });

    expect(storedData).toBeTruthy();
    const diaries = JSON.parse(storedData || "[]");
    expect(diaries).toHaveLength(1);
    expect(diaries[0]).toMatchObject({
      id: 1,
      title: "첫 번째 일기",
      content: "첫 번째 일기 내용입니다.",
      emotion: "HAPPY",
      createdAt: expect.any(String),
    });

    // 등록 완료 모달의 확인 버튼 클릭
    await page.click('button:has-text("확인")');

    // 일기 상세 페이지로 이동하는지 확인
    await expect(page).toHaveURL("/diaries/1");
  });

  test("기존 일기가 있을 때 새 일기 등록", async ({ page }) => {
    // 기존 diaries 데이터 설정
    await page.evaluate(() => {
      const existingDiaries = [
        {
          id: 1,
          title: "기존 일기",
          content: "기존 일기 내용",
          emotion: "SAD",
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          title: "기존 일기 2",
          content: "기존 일기 내용 2",
          emotion: "ANGRY",
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem("diaries", JSON.stringify(existingDiaries));
    });

    // 모든 필드 입력
    await page.click('label:has(input[value="SURPRISE"])');
    await page.fill('input[placeholder="제목을 입력합니다."]', "새로운 일기");
    await page.fill(
      'textarea[placeholder="내용을 입력합니다."]',
      "새로운 일기 내용입니다."
    );

    // 등록하기 버튼 클릭
    await page.click('[data-testid="diary-new-submit-button"]');

    // 등록 완료 모달 확인
    await expect(page.locator("text=일기 등록 완료")).toBeVisible({
      timeout: 500,
    });

    // 로컬스토리지에 새 데이터가 추가되었는지 확인
    const storedData = await page.evaluate(() => {
      return localStorage.getItem("diaries");
    });

    const diaries = JSON.parse(storedData || "[]");
    expect(diaries).toHaveLength(3);

    // 새로 추가된 일기의 ID가 4인지 확인 (기존 최대 ID 3 + 1)
    const newDiary = diaries.find(
      (diary: { title: string }) => diary.title === "새로운 일기"
    );
    expect(newDiary).toMatchObject({
      id: 4,
      title: "새로운 일기",
      content: "새로운 일기 내용입니다.",
      emotion: "SURPRISE",
    });
  });

  test("등록 완료 모달 확인 버튼 클릭 시 상세페이지 이동", async ({ page }) => {
    // 로컬스토리지 초기화
    await page.evaluate(() => {
      localStorage.removeItem("diaries");
    });

    // 일기 등록
    await page.click('label:has(input[value="ETC"])');
    await page.fill(
      'input[placeholder="제목을 입력합니다."]',
      "상세페이지 테스트"
    );
    await page.fill(
      'textarea[placeholder="내용을 입력합니다."]',
      "상세페이지 이동 테스트"
    );

    await page.click('[data-testid="diary-new-submit-button"]');

    // 등록 완료 모달 확인
    await expect(page.locator("text=일기 등록 완료")).toBeVisible({
      timeout: 500,
    });

    // 확인 버튼 클릭
    await page.click('button:has-text("확인")');

    // 일기 상세 페이지로 이동하는지 확인
    await expect(page).toHaveURL("/diaries/1");
  });

  test("닫기 버튼 클릭 시 모달 닫기", async ({ page }) => {
    // 닫기 버튼 클릭
    await page.click('[data-testid="diary-new-close-button"]');

    // 등록취소 확인 모달이 나타나는지 확인
    await expect(page.locator("text=일기 등록 취소")).toBeVisible({
      timeout: 500,
    });

    // 등록 취소 버튼 클릭
    await page.click('button:has-text("등록 취소")');

    // 모든 모달이 닫혔는지 확인
    await expect(
      page.locator('[data-testid="diary-new-modal"]')
    ).not.toBeVisible({ timeout: 500 });
  });

  test("폼 검증 - 빈 제목", async ({ page }) => {
    // 감정과 내용만 입력
    await page.click('label:has(input[value="HAPPY"])');
    await page.fill(
      'textarea[placeholder="내용을 입력합니다."]',
      "내용은 있습니다"
    );

    // 등록하기 버튼이 비활성화되어 있는지 확인
    const submitButton = page.locator(
      '[data-testid="diary-new-submit-button"]'
    );
    await expect(submitButton).toBeDisabled();
  });

  test("폼 검증 - 빈 내용", async ({ page }) => {
    // 감정과 제목만 입력
    await page.click('label:has(input[value="HAPPY"])');
    await page.fill(
      'input[placeholder="제목을 입력합니다."]',
      "제목은 있습니다"
    );

    // 등록하기 버튼이 비활성화되어 있는지 확인
    const submitButton = page.locator(
      '[data-testid="diary-new-submit-button"]'
    );
    await expect(submitButton).toBeDisabled();
  });

  test("폼 검증 - 감정 미선택", async ({ page }) => {
    // 제목과 내용만 입력
    await page.fill(
      'input[placeholder="제목을 입력합니다."]',
      "제목은 있습니다"
    );
    await page.fill(
      'textarea[placeholder="내용을 입력합니다."]',
      "내용은 있습니다"
    );

    // 등록하기 버튼이 비활성화되어 있는지 확인
    const submitButton = page.locator(
      '[data-testid="diary-new-submit-button"]'
    );
    await expect(submitButton).toBeDisabled();
  });

  // 경계값 테스트

  test("경계값 테스트 - 빈 문자열 입력", async ({ page }) => {
    // 빈 문자열로 입력 시도
    await page.click('label:has(input[value="HAPPY"])');
    await page.fill('input[placeholder="제목을 입력합니다."]', "");
    await page.fill('textarea[placeholder="내용을 입력합니다."]', "");

    // 등록하기 버튼이 비활성화되어 있는지 확인
    const submitButton = page.locator(
      '[data-testid="diary-new-submit-button"]'
    );
    await expect(submitButton).toBeDisabled();
  });

  test("경계값 테스트 - 공백만 입력", async ({ page }) => {
    // 공백만 입력
    await page.click('label:has(input[value="HAPPY"])');
    await page.fill('input[placeholder="제목을 입력합니다."]', "   ");
    await page.fill('textarea[placeholder="내용을 입력합니다."]', "   ");

    // 등록하기 버튼이 비활성화되어 있는지 확인 (trim 후 빈 문자열)
    const submitButton = page.locator(
      '[data-testid="diary-new-submit-button"]'
    );
    await expect(submitButton).toBeDisabled();
  });

  // 실패 시나리오 테스트
  test("실패 시나리오 - 로컬스토리지 저장 실패", async ({ page }) => {
    // 로컬스토리지 기능을 비활성화하여 저장 실패 시뮬레이션
    await page.evaluate(() => {
      // localStorage.setItem을 오버라이드하여 항상 에러 발생
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => {
        throw new Error("Storage quota exceeded");
      };

      // 테스트 후 복원을 위한 플래그 설정
      (window as { testRestoreStorage?: () => void }).testRestoreStorage = () => {
        localStorage.setItem = originalSetItem;
      };
    });

    // 모든 필드 입력
    await page.click('label:has(input[value="HAPPY"])');
    await page.fill('input[placeholder="제목을 입력합니다."]', "테스트 일기");
    await page.fill(
      'textarea[placeholder="내용을 입력합니다."]',
      "테스트 내용입니다"
    );

    // 등록하기 버튼 클릭
    await page.click('[data-testid="diary-new-submit-button"]');

    // 에러 모달이 표시되는지 확인
    await expect(page.locator("text=등록 실패")).toBeVisible({ timeout: 500 });
    await expect(
      page.locator("text=일기 등록 중 오류가 발생했습니다. 다시 시도해주세요.")
    ).toBeVisible();

    // localStorage 기능 복원
    await page.evaluate(() => {
      if ((window as { testRestoreStorage?: () => void }).testRestoreStorage) {
        (window as { testRestoreStorage?: () => void }).testRestoreStorage!();
      }
    });
  });

  test("실패 시나리오 - 로컬스토리지 읽기 실패", async ({ page }) => {
    // 로컬스토리지 읽기 기능을 비활성화
    await page.evaluate(() => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = () => {
        throw new Error("Storage read error");
      };

      (window as { testRestoreStorageRead?: () => void }).testRestoreStorageRead = () => {
        localStorage.getItem = originalGetItem;
      };
    });

    // 모든 필드 입력
    await page.click('label:has(input[value="SAD"])');
    await page.fill(
      'input[placeholder="제목을 입력합니다."]',
      "읽기 실패 테스트"
    );
    await page.fill(
      'textarea[placeholder="내용을 입력합니다."]',
      "읽기 실패 테스트 내용"
    );

    // 등록하기 버튼 클릭
    await page.click('[data-testid="diary-new-submit-button"]');

    // 에러 모달이 표시되는지 확인
    await expect(page.locator("text=등록 실패")).toBeVisible({ timeout: 500 });

    // localStorage 기능 복원
    await page.evaluate(() => {
      if ((window as { testRestoreStorageRead?: () => void }).testRestoreStorageRead) {
        (window as { testRestoreStorageRead?: () => void }).testRestoreStorageRead!();
      }
    });
  });

  test("실패 시나리오 - 잘못된 로컬스토리지 데이터", async ({ page }) => {
    // 잘못된 JSON 데이터를 로컬스토리지에 저장
    await page.evaluate(() => {
      localStorage.setItem("diaries", "invalid json data");
    });

    // 모든 필드 입력
    await page.click('label:has(input[value="ANGRY"])');
    await page.fill(
      'input[placeholder="제목을 입력합니다."]',
      "잘못된 데이터 테스트"
    );
    await page.fill(
      'textarea[placeholder="내용을 입력합니다."]',
      "잘못된 데이터 테스트 내용"
    );

    // 등록하기 버튼 클릭
    await page.click('[data-testid="diary-new-submit-button"]');

    // 에러 모달이 표시되는지 확인
    await expect(page.locator("text=등록 실패")).toBeVisible({ timeout: 500 });

    // 로컬스토리지 정리
    await page.evaluate(() => {
      localStorage.removeItem("diaries");
    });
  });

  test("실패 시나리오 - 네트워크 오류 시뮬레이션", async ({ page }) => {
    // 네트워크 오류를 시뮬레이션하기 위해 router.push를 오버라이드
    await page.evaluate(() => {
      // window.history.pushState를 오버라이드하여 에러 발생
      const originalPushState = window.history.pushState;
      window.history.pushState = () => {
        throw new Error("Navigation failed");
      };

      (window as { testRestoreNavigation?: () => void }).testRestoreNavigation = () => {
        window.history.pushState = originalPushState;
      };
    });

    // 로컬스토리지 초기화
    await page.evaluate(() => {
      localStorage.removeItem("diaries");
    });

    // 모든 필드 입력
    await page.click('label:has(input[value="SURPRISE"])');
    await page.fill(
      'input[placeholder="제목을 입력합니다."]',
      "네트워크 오류 테스트"
    );
    await page.fill(
      'textarea[placeholder="내용을 입력합니다."]',
      "네트워크 오류 테스트 내용"
    );

    // 등록하기 버튼 클릭
    await page.click('[data-testid="diary-new-submit-button"]');

    // 등록 완료 모달은 표시되지만 네비게이션은 실패
    await expect(page.locator("text=일기 등록 완료")).toBeVisible({
      timeout: 500,
    });

    // 확인 버튼 클릭 시 네비게이션 실패로 에러 발생
    await page.click('button:has-text("확인")');

    // 네비게이션 기능 복원
    await page.evaluate(() => {
      if ((window as { testRestoreNavigation?: () => void }).testRestoreNavigation) {
        (window as { testRestoreNavigation?: () => void }).testRestoreNavigation!();
      }
    });
  });
});
