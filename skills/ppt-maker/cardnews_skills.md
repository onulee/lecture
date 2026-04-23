# 카드뉴스 제작 스킬 레퍼런스

## 캔버스 기본 설정

- 카드 사이즈: `1080 × 1080px` (정사각형)
- 배경색: `#c8c2b2` (회색빛 베이지)
- 카드 내부 배경: `#ede8dc` + 도트 패턴
- 폰트: `Do Hyeon` (제목 강조), `Noto Sans KR` (본문)
- 카드 간격: `28px`

---

## 카드 구조

```html
<div class="card" id="card-01">
  <div class="card-inner">
    <!-- 콘텐츠 -->
  </div>
</div>
```

- `.card` — 외부 래퍼, 도트 배경
- `.card-inner` — 흰색 박스, `border-radius`, `border: 1.5px solid #1a1a1a`
- `card-01`은 순수 흰색 배경, `card-02` 이후는 `images/back.png` 워터마크 적용

---

## 타이포그래피 클래스

| 클래스 | 크기 범위 | 용도 |
|---|---|---|
| `.t-hero` | 52–100px, Do Hyeon | 커버 메인 타이틀 |
| `.t-xl` | 36–74px, bold 900 | 섹션 대제목 |
| `.t-lg` | 28–56px, bold 700 | 카드 타이틀 |
| `.t-md` | 20–40px, bold 700 | 인용구·강조문 |
| `.t-body` | 16–32px, regular 400 | 설명 본문 |

### 색상 유틸

- `.t-green` — `#00a651` (긍정·완료)
- `.t-orange` — `#e07030` (경고·강조)
- `.t-red` — `#dc3737` (부정·위험)

---

## 레이아웃 컴포넌트

### 칩 레이블
```html
<span class="chip">CARD NEWS</span>
```
- 작은 알약형 태그, 폰트 `13–22px`, 색상 `#777`, 테두리 `#bbb`

---

### 하이라이트 박스 (커버용)
```html
<span class="hl-box">클로드 코드AI</span>
```
- 베이지 배경 `#f0ead8`, 테두리 `#1a1a1a`, 인라인 블록

---

### 베이지 박스
```html
<div class="beige-box">
  <!-- check-item 목록 -->
</div>
```
- 배경 `#f0ead8`, 내부 세로 목록 컨테이너

---

### 체크 아이템
```html
<div class="check-item">
  <span class="check-icon">✓</span>
  <span class="check-text">내용</span>
</div>
```
- `check-icon`: 오렌지 `#e07030`, 20–34px
- `check-text`: 20–34px, `#1a1a1a`
- 부정 표현 시 아이콘 색상 `#dc3737`, 기호 `✗` 또는 `→`

---

### 인용구 블록
```html
<div class="quote-block">
  <p class="t-md">"인용 텍스트"</p>
</div>
```
- 배경 `#f0ead8`, 전체 너비

---

### 두 컬럼 비교
```html
<div class="two-col">
  <div class="col-box neutral">
    <p class="col-head" style="color:#777;">남들</p>
    <p class="col-item">내용</p>
  </div>
  <div class="col-box positive">
    <p class="col-head t-green">AI 쓰는 너</p>
    <p class="col-item" style="color:#1a1a1a;">내용</p>
  </div>
</div>
```
- `.col-box.neutral` — 베이지 배경 `#f0ead8`, 테두리 `#ccc5ae`
- `.col-box.positive` — 연초록 배경 `#e8f5ee`, 테두리 `#00a651`

---

### 알림 바 (CTA)
```html
<div class="alert-bar">긴급 메시지</div>
```
- 빨간 배경 `#dc3737`, 흰색 텍스트, 16–30px bold

---

### 노트 박스
```html
<div class="note-box">
  <p class="t-body" style="color:#1a1a1a;">안내 텍스트</p>
</div>
```
- 연초록 배경 `#e8f5ee`, 초록 테두리 `#00a651`

---

### 구분선
```html
<div class="divider-wide"></div> <!-- 큰 구분선 -->
<div class="divider-sm"></div>   <!-- 작은 구분선 -->
```
- 색상 `#00a651` (초록), 두께 5–8px / 4–7px

---

## 카드 유형 패턴

| 카드 유형 | 구성 요소 |
|---|---|
| 커버 | `chip` + `t-hero` × 3 + `hl-box` + `arrow` + `t-body` |
| 임팩트 단언 | `t-lg` (Do Hyeon) + `beige-box` (check-item) + `t-body` |
| 인용 강조 | `t-xl` + `quote-block` + `t-body` |
| 리스트 나열 | `t-lg` + `beige-box` (check-item × N) |
| 비교 대조 | `t-lg` + `two-col` (neutral / positive) + `t-body` |
| CTA 마무리 | `alert-bar` + `t-xl` + `cta-text` + `note-box` |

---

## 반응형 원칙

- 모든 크기값은 `clamp(min, vw기준, max)` 사용
- vw 기준값: 카드 1080px 기준, 원하는 px ÷ 1080 × 100
- 예: 56px → `clamp(28px, 5.19vw, 56px)`

---

## 카드 내부 여백 기준

- `card-inner` padding: `clamp(32px,5.19vw,56px)` 상하 / `clamp(40px,6.48vw,70px)` 좌우
- `card-inner` gap: `clamp(10px,1.67vw,18px)`
- `beige-box` 내부 gap: `clamp(10px,1.67vw,18px)`
