import { test, expect } from "@playwright/test";
import { Emotion } from "@/commons/constants/enum";

/**
 * 일기 필터 기능 테스트
 *
 * 테스트 데이터:
 * - 로컬스토리지의 diaries 키에 실제 일기 데이터 사용
 * - emotion enum 타입 사용
 *
 * 테스트 시나리오:
 * 1. 필터선택박스를 통한 감정 필터링
 * 2. 검색 후 필터링
 */

test.describe("일기 필터 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 테스트 데이터 준비 - 실제 로컬스토리지 데이터 사용
    const testDiaries = [
      {
        id: 1,
        title: "행복한 하루",
        content: "오늘은 정말 행복한 하루였다",
        emotion: Emotion.Happy,
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: 2,
        title: "슬픈 기억",
        content: "슬픈 일이 있었다",
        emotion: Emotion.Sad,
        createdAt: "2024-01-02T00:00:00.000Z",
      },
      {
        id: 3,
        title: "놀라운 경험",
        content: "놀라운 일이 있었다",
        emotion: Emotion.Surprise,
        createdAt: "2024-01-03T00:00:00.000Z",
      },
      {
        id: 4,
        title: "화가 난 날",
        content: "정말 화가 났다",
        emotion: Emotion.Angry,
        createdAt: "2024-01-04T00:00:00.000Z",
      },
      {
        id: 5,
        title: "기타 감정",
        content: "특별한 감정",
        emotion: Emotion.Etc,
        createdAt: "2024-01-05T00:00:00.000Z",
      },
      {
        id: 6,
        title: "또 다른 행복",
        content: "행복한 일",
        emotion: Emotion.Happy,
        createdAt: "2024-01-06T00:00:00.000Z",
      },
    ];

    // 로컬스토리지에 테스트 데이터 저장
    await page.goto("/diaries");
    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);

    // 페이지 새로고침하여 데이터 로드
    await page.reload();

    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="diaries-page"]');
  });

  test("필터선택박스 클릭 시 올바른 메뉴가 표시되는지 확인", async ({
    page,
  }) => {
    // 필터 선택박스 찾기
    const selectBox = page.locator('[data-testid="filter-selectbox"]');
    await expect(selectBox).toBeVisible();

    // 선택박스 클릭
    await selectBox.click();

    // 드롭다운 메뉴 확인
    const dropdown = page.locator('[data-testid="filter-dropdown"]');
    await expect(dropdown).toBeVisible();

    // 옵션 목록 확인
    const options = page.locator('[data-testid="filter-option"]');
    const optionTexts = await options.allTextContents();

    // 예상되는 옵션 목록 (enum.ts의 emotion label 사용)
    const expectedOptions = [
      "전체",
      "행복해요",
      "슬퍼요",
      "놀랐어요",
      "화나요",
      "기타",
    ];

    expect(optionTexts.length).toBe(expectedOptions.length);
    expectedOptions.forEach((expectedOption) => {
      expect(optionTexts).toContain(expectedOption);
    });
  });

  test("전체 필터 선택 시 모든 일기가 표시되는지 확인", async ({ page }) => {
    // 필터 선택박스 클릭
    const selectBox = page.locator('[data-testid="filter-selectbox"]');
    await selectBox.click();

    // "전체" 옵션 선택
    const allOption = page.locator('[data-testid="filter-option"]', {
      hasText: "전체",
    });
    await allOption.click();

    // 모든 카드가 표시되는지 확인 (총 6개)
    const cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(6);
  });

  test("행복해요 필터 선택 시 HAPPY 감정의 일기만 표시되는지 확인", async ({
    page,
  }) => {
    // 필터 선택박스 클릭
    const selectBox = page.locator('[data-testid="filter-selectbox"]');
    await selectBox.click();

    // "행복해요" 옵션 선택
    const happyOption = page.locator('[data-testid="filter-option"]', {
      hasText: "행복해요",
    });
    await happyOption.click();

    // HAPPY 감정의 카드만 표시되는지 확인 (2개)
    const cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(2);

    // 각 카드의 감정 레이블 확인
    const emotionLabels = page.locator('[data-testid="emotion-label"]');
    const labelTexts = await emotionLabels.allTextContents();

    labelTexts.forEach((text) => {
      expect(text).toBe("행복해요");
    });

    // 각 카드의 data-emotion 속성 확인
    const emotionAttributes = await emotionLabels.evaluateAll((elements) =>
      elements.map((el) => el.getAttribute("data-emotion"))
    );

    emotionAttributes.forEach((attr) => {
      expect(attr).toBe(Emotion.Happy);
    });
  });

  test("슬퍼요 필터 선택 시 SAD 감정의 일기만 표시되는지 확인", async ({
    page,
  }) => {
    // 필터 선택박스 클릭
    const selectBox = page.locator('[data-testid="filter-selectbox"]');
    await selectBox.click();

    // "슬퍼요" 옵션 선택
    const sadOption = page.locator('[data-testid="filter-option"]', {
      hasText: "슬퍼요",
    });
    await sadOption.click();

    // SAD 감정의 카드만 표시되는지 확인 (1개)
    const cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(1);

    // 감정 레이블 확인
    const emotionLabel = page.locator('[data-testid="emotion-label"]').first();
    await expect(emotionLabel).toHaveText("슬퍼요");

    // data-emotion 속성 확인
    const emotionAttr = await emotionLabel.getAttribute("data-emotion");
    expect(emotionAttr).toBe(Emotion.Sad);
  });

  test("놀랐어요 필터 선택 시 SURPRISE 감정의 일기만 표시되는지 확인", async ({
    page,
  }) => {
    // 필터 선택박스 클릭
    const selectBox = page.locator('[data-testid="filter-selectbox"]');
    await selectBox.click();

    // "놀랐어요" 옵션 선택
    const surpriseOption = page.locator('[data-testid="filter-option"]', {
      hasText: "놀랐어요",
    });
    await surpriseOption.click();

    // SURPRISE 감정의 카드만 표시되는지 확인 (1개)
    const cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(1);

    // 감정 레이블 확인
    const emotionLabel = page.locator('[data-testid="emotion-label"]').first();
    await expect(emotionLabel).toHaveText("놀랐어요");

    // data-emotion 속성 확인
    const emotionAttr = await emotionLabel.getAttribute("data-emotion");
    expect(emotionAttr).toBe(Emotion.Surprise);
  });

  test("화나요 필터 선택 시 ANGRY 감정의 일기만 표시되는지 확인", async ({
    page,
  }) => {
    // 필터 선택박스 클릭
    const selectBox = page.locator('[data-testid="filter-selectbox"]');
    await selectBox.click();

    // "화나요" 옵션 선택
    const angryOption = page.locator('[data-testid="filter-option"]', {
      hasText: "화나요",
    });
    await angryOption.click();

    // ANGRY 감정의 카드만 표시되는지 확인 (1개)
    const cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(1);

    // 감정 레이블 확인
    const emotionLabel = page.locator('[data-testid="emotion-label"]').first();
    await expect(emotionLabel).toHaveText("화나요");

    // data-emotion 속성 확인
    const emotionAttr = await emotionLabel.getAttribute("data-emotion");
    expect(emotionAttr).toBe(Emotion.Angry);
  });

  test("기타 필터 선택 시 ETC 감정의 일기만 표시되는지 확인", async ({
    page,
  }) => {
    // 필터 선택박스 클릭
    const selectBox = page.locator('[data-testid="filter-selectbox"]');
    await selectBox.click();

    // "기타" 옵션 선택
    const etcOption = page.locator('[data-testid="filter-option"]', {
      hasText: "기타",
    });
    await etcOption.click();

    // ETC 감정의 카드만 표시되는지 확인 (1개)
    const cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(1);

    // 감정 레이블 확인
    const emotionLabel = page.locator('[data-testid="emotion-label"]').first();
    await expect(emotionLabel).toHaveText("기타");

    // data-emotion 속성 확인
    const emotionAttr = await emotionLabel.getAttribute("data-emotion");
    expect(emotionAttr).toBe(Emotion.Etc);
  });

  test("검색 후 필터 적용이 올바르게 동작하는지 확인", async ({ page }) => {
    // 검색창에 "하루" 검색 (id: 1인 일기만 매칭, emotion: HAPPY)
    const searchBar = page.locator('[data-testid="search-input"]');
    await searchBar.fill("하루");

    const searchButton = page.locator('[data-testid="search-button"]');
    await searchButton.click();

    // 검색 결과 확인 (1개)
    let cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(1);

    // 필터 선택박스 클릭
    const selectBox = page.locator('[data-testid="filter-selectbox"]');
    await selectBox.click();

    // "행복해요" 필터 선택
    const happyOption = page.locator('[data-testid="filter-option"]', {
      hasText: "행복해요",
    });
    await happyOption.click();

    // 여전히 1개의 카드가 표시되어야 함 (검색결과가 HAPPY 감정이므로)
    cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(1);

    // 감정 레이블 확인
    const emotionLabel = page.locator('[data-testid="emotion-label"]').first();
    await expect(emotionLabel).toHaveText("행복해요");
  });

  test("검색 후 다른 감정 필터 선택 시 결과가 없어야 함", async ({ page }) => {
    // 검색창에 "하루" 검색 (id: 1인 일기만 매칭, emotion: HAPPY)
    const searchBar = page.locator('[data-testid="search-input"]');
    await searchBar.fill("하루");

    const searchButton = page.locator('[data-testid="search-button"]');
    await searchButton.click();

    // 검색 결과 확인 (1개)
    let cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(1);

    // 필터 선택박스 클릭
    const selectBox = page.locator('[data-testid="filter-selectbox"]');
    await selectBox.click();

    // "슬퍼요" 필터 선택
    const sadOption = page.locator('[data-testid="filter-option"]', {
      hasText: "슬퍼요",
    });
    await sadOption.click();

    // 검색 결과가 HAPPY 감정인데 SAD 필터를 적용했으므로 0개
    cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(0);
  });

  test("필터 선택 후 검색 시 두 조건 모두 적용되는지 확인", async ({
    page,
  }) => {
    // 먼저 "행복해요" 필터 선택
    const selectBox = page.locator('[data-testid="filter-selectbox"]');
    await selectBox.click();

    const happyOption = page.locator('[data-testid="filter-option"]', {
      hasText: "행복해요",
    });
    await happyOption.click();

    // 행복한 일기 2개 표시 확인
    let cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(2);

    // 검색창에 "하루" 검색
    const searchBar = page.locator('[data-testid="search-input"]');
    await searchBar.fill("하루");

    const searchButton = page.locator('[data-testid="search-button"]');
    await searchButton.click();

    // 검색 결과가 필터링되어 1개만 표시되어야 함
    cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(1);

    // 감정 레이블이 여전히 "행복해요"인지 확인
    const emotionLabel = page.locator('[data-testid="emotion-label"]').first();
    await expect(emotionLabel).toHaveText("행복해요");

    // 제목이 "행복한 하루"인지 확인
    const titleLabel = page.locator('[data-testid="diary-title"]').first();
    await expect(titleLabel).toHaveText("행복한 하루");
  });

  test("페이지 로드 시 초기 상태에서 모든 일기가 표시된다", async ({
    page,
  }) => {
    // 페이지 로드 직후 모든 일기 카드가 표시되는지 확인 (필터 미적용 상태)
    const cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(6);
  });

  test("필터 적용 후 전체 옵션 선택 시 모든 일기가 다시 표시된다", async ({
    page,
  }) => {
    // 먼저 "행복해요" 필터 선택
    const selectBox = page.locator('[data-testid="filter-selectbox"]');
    await selectBox.click();

    const happyOption = page.locator('[data-testid="filter-option"]', {
      hasText: "행복해요",
    });
    await happyOption.click();

    // 행복한 일기 2개만 표시 확인
    let cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(2);

    // 다시 선택박스 열기
    await selectBox.click();

    // "전체" 옵션 선택
    const allOption = page.locator('[data-testid="filter-option"]', {
      hasText: "전체",
    });
    await allOption.click();

    // 모든 일기가 다시 표시되는지 확인 (6개)
    cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(6);
  });

  test("여러 필터를 순차적으로 변경할 때 올바르게 동작한다", async ({
    page,
  }) => {
    const selectBox = page.locator('[data-testid="filter-selectbox"]');

    // 1. "행복해요" 필터 선택
    await selectBox.click();
    const happyOption = page.locator('[data-testid="filter-option"]', {
      hasText: "행복해요",
    });
    await happyOption.click();

    let cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(2);

    // 2. "슬퍼요" 필터로 변경
    await selectBox.click();
    const sadOption = page.locator('[data-testid="filter-option"]', {
      hasText: "슬퍼요",
    });
    await sadOption.click();

    cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(1);

    let emotionLabel = page.locator('[data-testid="emotion-label"]').first();
    await expect(emotionLabel).toHaveText("슬퍼요");

    // 3. "놀랐어요" 필터로 변경
    await selectBox.click();
    const surpriseOption = page.locator('[data-testid="filter-option"]', {
      hasText: "놀랐어요",
    });
    await surpriseOption.click();

    cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(1);

    emotionLabel = page.locator('[data-testid="emotion-label"]').first();
    await expect(emotionLabel).toHaveText("놀랐어요");
  });

  test("검색 결과가 없을 때 필터를 변경해도 결과가 없다", async ({ page }) => {
    // 존재하지 않는 검색어로 검색
    const searchBar = page.locator('[data-testid="search-input"]');
    await searchBar.fill("존재하지않는제목");

    const searchButton = page.locator('[data-testid="search-button"]');
    await searchButton.click();

    // 검색 결과 0개 확인
    let cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(0);

    // 필터 선택
    const selectBox = page.locator('[data-testid="filter-selectbox"]');
    await selectBox.click();

    const happyOption = page.locator('[data-testid="filter-option"]', {
      hasText: "행복해요",
    });
    await happyOption.click();

    // 여전히 결과가 없어야 함
    cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(0);
  });

  test("검색어 지우고 필터만 적용 시 올바르게 동작한다", async ({ page }) => {
    // 먼저 검색어 입력하여 검색
    const searchBar = page.locator('[data-testid="search-input"]');
    await searchBar.fill("행복");

    const searchButton = page.locator('[data-testid="search-button"]');
    await searchButton.click();

    // 검색 결과 2개 확인
    let cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(2);

    // 검색어 지우기
    await searchBar.clear();
    await searchButton.click();

    // 모든 일기 표시 확인 (6개)
    cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(6);

    // 필터 적용
    const selectBox = page.locator('[data-testid="filter-selectbox"]');
    await selectBox.click();

    const sadOption = page.locator('[data-testid="filter-option"]', {
      hasText: "슬퍼요",
    });
    await sadOption.click();

    // 슬픈 일기 1개만 표시되어야 함
    cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(1);

    const emotionLabel = page.locator('[data-testid="emotion-label"]').first();
    await expect(emotionLabel).toHaveText("슬퍼요");
  });
});
