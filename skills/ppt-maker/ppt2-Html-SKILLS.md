---
name: ppt-html-presentation
description: 순수 HTML/CSS/JS로 16:9 PPT 슬라이드 프레젠테이션을 만드는 스킬
metadata:
  tags: html, css, presentation, ppt, 회사소개서, 슬라이드, 16:9
---

## When to use

별도 라이브러리 없이 단일 HTML 파일로 PPT 스타일 프레젠테이션이 필요할 때 사용한다.
브라우저에서 바로 열고, 키보드/버튼으로 슬라이드를 넘길 수 있다.

---

## 전체 구조

```
shell (body 전체 래퍼)
└── viewport (1280×720 슬라이드 컨테이너)
│   └── slides (전체 슬라이드 스택)
│       ├── slide.s1.active  (현재 슬라이드 — opacity: 1)
│       ├── slide.s2         (비활성 — opacity: 0)
│       └── ...
└── nav-bar (하단 플로팅 네비게이션)
    ├── 이전 버튼
    ├── 슬라이드 카운터
    ├── 다음 버튼
    └── 점 인디케이터 (dots)
```

---

## CSS 변수 (디자인 토큰)

```css
:root {
  --cream:      #f2ede6;   /* 슬라이드 배경 기본 */
  --cream-dark: #e8e2d9;   /* 구분선·카드 테두리 */
  --navy:       #2e3d5b;   /* 메인 다크 컬러 */
  --navy-light: #3d4f6e;
  --navy-mid:   #4a5f80;
  --slate:      #8a9ab5;   /* 섹션 레이블 */
  --muted:      #6b7a94;   /* 본문 서브텍스트 */
  --white:      #ffffff;
  --accent:     #4a7fc1;   /* 포인트 블루 */
  --slide-w:    1280px;
  --slide-h:    720px;
}
```

---

## 뷰포트 & 반응형 스케일

슬라이드는 고정 1280×720px이며, 화면이 작으면 `transform: scale()`로 축소한다.
레이아웃 자체를 바꾸지 않으므로 모든 해상도에서 동일하게 보인다.

```css
.viewport {
  width: var(--slide-w);
  height: var(--slide-h);
  overflow: hidden;
}

@media (max-width: 1340px) {
  .viewport { transform: scale(0.85); transform-origin: top center; }
  .shell    { gap: 0; padding-top: 0; }
}
@media (max-width: 1100px) { .viewport { transform: scale(0.70); } }
@media (max-width:  900px) { .viewport { transform: scale(0.56); } }
```

---

## 슬라이드 전환 (fade)

```css
.slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
  display: flex;
}
.slide.active {
  opacity: 1;
  pointer-events: all;
}
```

```js
function go(n) {
  slides[current].classList.remove('active');
  dotsEl.children[current].classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  dotsEl.children[current].classList.add('active');
  counter.textContent = (current + 1) + ' / ' + slides.length;
}

document.getElementById('prevBtn').addEventListener('click', () => go(current - 1));
document.getElementById('nextBtn').addEventListener('click', () => go(current + 1));

// 키보드 지원
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(current + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   go(current - 1);
});
```

---

## 하단 플로팅 네비게이션

슬라이드 위에 겹치도록 `position: fixed` + `backdrop-filter: blur` 사용.

```css
.nav-bar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 100px;
  padding: 8px 20px;
  z-index: 999;
}
```

---

## 폰트

Google Fonts에서 한국어(Noto Sans KR)와 영문(Inter)을 함께 로드한다.

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
```

```css
body {
  font-family: 'Noto Sans KR', 'Inter', sans-serif;
}
```

---

## 슬라이드 레이아웃 패턴

### 패턴 A — 좌우 분할 (다크 사이드바 + 콘텐츠)

Cover(s1), About Us(s2), Benefits(s7)에 사용.

```css
.slide { flex-direction: row; }

/* 고정폭 다크 패널 */
.panel-left {
  width: 420px;           /* 또는 480px */
  background: var(--navy);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 70px 56px;
}

/* 나머지 콘텐츠 영역 */
.panel-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 70px 64px;
  gap: 28px;
}
```

### 패턴 B — 섹션 헤더 + 카드 그리드

Services(s4)에 사용. 상단 헤더 + 하단 n열 카드.

```css
.slide {
  flex-direction: column;
  padding: 56px 64px;
}

/* 구분선 */
.divider {
  width: 100%;
  height: 1px;
  background: var(--cream-dark);
  margin-bottom: 32px;
}

/* 4열 카드 */
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  flex: 1;
}

.card {
  background: #fff;
  border: 1px solid var(--cream-dark);
  border-radius: 18px;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

### 패턴 C — 다크 배경 + 카드 그리드

Strengths(s5)에 사용.

```css
.slide {
  background: var(--navy);
  flex-direction: column;
  padding: 56px 64px;
}

.strength-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 18px;
  padding: 32px 24px;
}
```

### 패턴 D — 비전/미션 좌우 비대칭 분할

Vision & Mission(s3)에 사용. `flex: 1` vs `flex: 1.2`로 비율 조정.

```css
.s3-body {
  display: flex;
  gap: 32px;
  flex: 1;
  align-items: stretch;
}

.vision-card {
  flex: 1;              /* 좁은 쪽 */
  background: var(--navy);
  border-radius: 20px;
  padding: 44px 48px;
}

.mission-list {
  flex: 1.2;            /* 넓은 쪽 */
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

### 패턴 E — 프로세스 플로우 (원형 아이콘 + 연결선 + 카드)

Process(s6)에 사용.

```html
<div class="process-step">
  <div class="process-connector">
    <div class="process-circle"><!-- SVG 아이콘 --></div>
    <div class="process-line"></div>   <!-- 마지막 스텝은 생략 -->
  </div>
  <div class="process-body">
    <div class="process-num">STEP 01</div>
    <div class="process-title">타이틀</div>
    <div class="process-desc">설명</div>
  </div>
</div>
```

```css
.process-connector {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.process-circle {
  width: 56px;
  height: 56px;
  background: var(--navy);
  border-radius: 50%;
  flex-shrink: 0;
}

.process-line {
  flex: 1;
  height: 2px;
  background: var(--cream-dark);
  position: relative;
}
/* 화살표 끝 */
.process-line::after {
  content: '';
  position: absolute;
  right: -6px;
  top: -4px;
  border: 5px solid transparent;
  border-left: 8px solid var(--cream-dark);
}

/* 마지막 스텝 강조 */
.process-step:last-child .process-circle { background: var(--accent); }
.process-step:last-child .process-line   { display: none; }
```

---

## 공통 컴포넌트 패턴

### 섹션 레이블

슬라이드 타이틀 위에 붙는 소형 대문자 레이블.

```css
.section-label {
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
  margin-bottom: 16px;
}
.section-label.dark { color: var(--slate); }  /* 밝은 배경에서 사용 */
```

### 배지 (pill badge)

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 100px;
  padding: 6px 16px;
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
  width: fit-content;
}
/* 앞 점 */
.badge::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}
```

### 아이콘 박스 (네이비 배경 SVG)

```css
.icon-box {
  width: 52px;
  height: 52px;
  background: var(--navy);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-box svg {
  width: 26px;
  height: 26px;
  fill: none;
  stroke: #fff;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
```

### 통계 숫자 블록

```css
.stat-num {
  font-size: 38px;
  font-weight: 800;
  color: #fff;
}
.stat-num span {          /* 단위(+, %, 년) */
  font-size: 20px;
  color: var(--accent);
}
.stat-label {
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  margin-top: 2px;
}
```

### 진행 바 (benefit bar)

```css
.benefit-bar {
  height: 4px;
  background: var(--cream-dark);
  border-radius: 2px;
  overflow: hidden;
}
.benefit-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--navy-mid), var(--accent));
  border-radius: 2px;
  /* width는 인라인 style로 지정 */
}
```

```html
<div class="benefit-bar">
  <div class="benefit-bar-fill" style="width:72%"></div>
</div>
```

### 좌측 강조선 (accent bar heading)

```css
.accent-heading {
  border-left: 3px solid var(--accent);
  padding-left: 14px;
  font-size: 16px;
  font-weight: 700;
  color: var(--navy);
}
```

---

## 슬라이드 구성 요약

| # | 클래스 | 제목 | 배경 | 레이아웃 패턴 |
|---|--------|------|------|---------------|
| 1 | `.s1` | Cover — 표지 | `--navy` | 패턴 A (좌우 분할 + 목차) |
| 2 | `.s2` | About Us | `--cream` | 패턴 A (다크 패널 + 카드 3개) |
| 3 | `.s3` | Vision & Mission | `--cream` | 패턴 D (비대칭 좌우 분할) |
| 4 | `.s4` | Our Services | `--cream` | 패턴 B (4열 카드 그리드) |
| 5 | `.s5` | Our Strengths | `--navy` | 패턴 C (다크 5열 카드) |
| 6 | `.s6` | Service Process | `--cream` | 패턴 E (5단계 플로우) |
| 7 | `.s7` | Benefits | `--cream` | 패턴 A (다크 CTA + 2×2 바 카드) |

---

## 새 슬라이드 추가 방법

1. HTML에 `<div class="slide sN">...</div>` 추가
2. CSS에 `.sN { background: ...; flex-direction: ...; }` 정의
3. JS의 슬라이드 카운터는 `querySelectorAll('.slide')`로 자동 감지되므로 별도 수정 불필요

---

## 주의사항

- `overflow: hidden`이 `.viewport`에 걸려 있으므로 슬라이드 밖으로 요소가 넘치면 잘린다.
- `flex: 1`로 높이를 채우는 구조이므로 슬라이드 루트 요소에 `display: flex`가 필요하다.
- 배경이 다크(`--navy`)인 슬라이드에서 `section-label`은 `.dark` 클래스 없이 사용하고, 밝은 배경에서는 `.dark`를 추가한다.
- SVG 아이콘은 외부 라이브러리 없이 인라인으로 삽입하며 `stroke` 기반으로 통일한다.

---

## 관련 파일

| 파일 | 설명 |
|------|------|
| `ppt.html` | 메인 HTML 프레젠테이션 파일 |
| `PPT-SKILLS.md` | python-pptx로 PPTX 생성하는 스킬 |
| `SmartAI_Marketing.pptx` | 동일 내용의 PPTX 파일 |
| `generate_pptx.py` | PPTX 생성 스크립트 |
