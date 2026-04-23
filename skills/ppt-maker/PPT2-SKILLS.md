---
name: pptx-generation
description: python-pptx를 사용해 한국어 회사소개서 PPTX를 코드로 생성하는 스킬
metadata:
  tags: pptx, python-pptx, presentation, 회사소개서, powerpoint
---

## When to use

PPTX 파일을 코드로 생성해야 할 때 이 스킬을 사용한다.
특히 회사소개서·제안서·보고서 등 정형화된 슬라이드 구성이 필요한 경우에 적합하다.

---

## 환경 설정

```bash
pip install python-pptx
```

Python 3.x 에서 동작한다.

---

## 기본 구조

```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from lxml import etree

prs = Presentation()
prs.slide_width  = Inches(13.33)   # 16:9 와이드
prs.slide_height = Inches(7.5)

blank = prs.slide_layouts[6]       # 빈 레이아웃

slide = prs.slides.add_slide(blank)
prs.save("output.pptx")
```

---

## 핵심 헬퍼 함수

### 배경색 설정

```python
def bg(slide, color: RGBColor):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = color
```

### 도형(박스) 추가

```python
def box(slide, l, t, w, h, fill_color=None, border_color=None, border_pt=0, radius=0):
    shape = slide.shapes.add_shape(1, l, t, w, h)
    shape.line.fill.background()
    if fill_color:
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill_color
    else:
        shape.fill.background()
    if border_color and border_pt:
        shape.line.color.rgb = border_color
        shape.line.width = Pt(border_pt)
    else:
        shape.line.fill.background()
    if radius:
        # 둥근 모서리 적용 (radius: 0~50000)
        ns = 'http://schemas.openxmlformats.org/drawingml/2006/main'
        sp = shape._element
        spPr = sp.find(f'.//{{{ns}}}spPr') or sp
        prstGeom = spPr.find(f'{{{ns}}}prstGeom')
        if prstGeom is not None:
            prstGeom.set('prst', 'roundRect')
            avLst = prstGeom.find(f'{{{ns}}}avLst')
            if avLst is None:
                avLst = etree.SubElement(prstGeom, f'{{{ns}}}avLst')
            for gd in avLst.findall(f'{{{ns}}}gd'):
                if gd.get('name') == 'adj':
                    avLst.remove(gd)
            gd = etree.SubElement(avLst, f'{{{ns}}}gd')
            gd.set('name', 'adj')
            gd.set('fmla', f'val {radius}')
    return shape
```

> **radius 가이드**
> - `50000` → 완전한 원/타원
> - `10000` → 크게 둥근 모서리
> - `5000`  → 보통 둥근 모서리
> - `0`     → 직각 모서리 (기본값, radius 생략 가능)

### 텍스트 박스 추가

```python
def txt(slide, text, l, t, w, h,
        size=14, bold=False, color=RGBColor(0xff,0xff,0xff),
        align=PP_ALIGN.LEFT, wrap=True):
    txBox = slide.shapes.add_textbox(l, t, w, h)
    tf = txBox.text_frame
    tf.word_wrap = wrap
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color
    return txBox
```

### 여러 줄 텍스트

```python
def multiline_txt(slide, lines: list[str], l, t, w, h,
                  size=14, bold=False, color=RGBColor(0xff,0xff,0xff),
                  align=PP_ALIGN.LEFT):
    txBox = slide.shapes.add_textbox(l, t, w, h)
    tf = txBox.text_frame
    tf.word_wrap = True
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        run = p.add_run()
        run.text = line
        run.font.size = Pt(size)
        run.font.bold = bold
        run.font.color.rgb = color
    return txBox
```

### 구분선

```python
def divider(slide, l, t, w, color=RGBColor(0xe8,0xe2,0xd9)):
    box(slide, l, t, w, Pt(1), fill_color=color)
```

---

## 색상 팔레트 (SmartAI Marketing 기준)

```python
NAVY       = RGBColor(0x2e, 0x3d, 0x5b)   # 메인 다크
NAVY_MID   = RGBColor(0x4a, 0x5f, 0x80)   # 미드 네이비
ACCENT     = RGBColor(0x4a, 0x7f, 0xc1)   # 포인트 블루
CREAM      = RGBColor(0xf2, 0xed, 0xe6)   # 배경 크림
CREAM_DARK = RGBColor(0xe8, 0xe2, 0xd9)   # 구분선·테두리
SLATE      = RGBColor(0x8a, 0x9a, 0xb5)   # 레이블
MUTED      = RGBColor(0x6b, 0x7a, 0x94)   # 본문 서브
WHITE      = RGBColor(0xff, 0xff, 0xff)
```

---

## 슬라이드 구성 패턴

### 패턴 A — 좌우 분할 (다크 패널 + 콘텐츠)

```python
LP = Inches(4.0)                            # 좌측 패널 너비
box(slide, 0, 0, LP, H, fill_color=NAVY)   # 좌측 다크 패널
# 우측 콘텐츠 시작 X
RX = LP + Inches(0.5)
RW = W - LP - Inches(0.7)
```

### 패턴 B — 섹션 헤더 + 카드 그리드

```python
# 헤더
label(slide, "섹션명", PX, Inches(0.55), Inches(4))
txt(slide, "슬라이드 타이틀", PX, Inches(0.9), Inches(6), Inches(0.8),
    size=44, bold=True, color=NAVY)
divider(slide, PX, Inches(1.75), W - Inches(1.7))

# n열 카드 그리드
n = 4
CW = (W - Inches(1.7) - Inches(0.45) * (n-1)) / n
for i in range(n):
    cx = PX + i * (CW + Inches(0.15))
    box(slide, cx, Inches(2.0), CW, Inches(4.9),
        fill_color=WHITE, border_color=CREAM_DARK, border_pt=0.75, radius=8000)
```

### 패턴 C — 다크 배경 카드 그리드

```python
bg(slide, NAVY)
# 반투명 카드
box(slide, cx, cy, CW, CH,
    fill_color=RGBColor(0x3a,0x4c,0x6e),
    border_color=RGBColor(0x4a,0x5f,0x80), border_pt=0.75, radius=8000)
```

### 패턴 D — 프로세스 플로우 (원형 + 연결선 + 카드)

```python
for i, step in enumerate(steps):
    cx = PX + i * (CW + gap)
    # 원형 아이콘
    box(slide, cx + CW/2 - Inches(0.37), Inches(2.0),
        Inches(0.74), Inches(0.74),
        fill_color=ACCENT if i == last else NAVY, radius=50000)
    # 연결선 (마지막 제외)
    if i < last:
        box(slide, cx + CW/2 + Inches(0.37), Inches(2.35),
            gap + CW - Inches(0.74), Pt(2), fill_color=CREAM_DARK)
    # 하단 카드
    box(slide, cx, Inches(3.0), CW, Inches(4.0),
        fill_color=WHITE, border_color=CREAM_DARK, border_pt=0.75, radius=8000)
```

---

## 실행 방법

```bash
python generate_pptx.py
```

출력 파일: `SmartAI_Marketing.pptx`

---

## 생성 파일 구성 (SmartAI Marketing 회사소개서)

| 슬라이드 | 제목 | 레이아웃 패턴 | 배경 |
|---|---|---|---|
| 1 | Cover — 표지 | 좌우 분할 + 목차 사이드바 | 네이비 |
| 2 | About Us — 회사 소개 | 좌측 다크 패널 + 우측 카드 3개 | 크림 |
| 3 | Vision & Mission | Vision 다크 카드 + Mission 3단계 | 크림 |
| 4 | Our Services — 핵심 서비스 | 4열 카드 그리드 | 크림 |
| 5 | Our Strengths — 핵심 경쟁력 | 다크 배경 5열 카드 | 네이비 |
| 6 | Service Process — 프로세스 | 5단계 플로우 (원형+선+카드) | 크림 |
| 7 | Benefits — 기대 효과 | 좌측 다크 CTA + 우측 4카드 바 | 크림 |

---

## 주의사항

- `add_textbox`로 생성한 텍스트는 세로 중앙 정렬이 기본 지원되지 않는다. 위치(t)를 수동으로 조정한다.
- 한글 폰트는 시스템에 설치된 폰트를 사용하므로 별도 임베드 설정 없이 PowerPoint에서 렌더링된다.
- `radius` 값은 EMU 단위의 비율(분자/100000)이며, `50000` = 50% = 완전 원형이다.
- 이미지 삽입: `slide.shapes.add_picture(path, l, t, w, h)` 사용.
- 슬라이드 크기는 반드시 `Presentation()` 생성 직후, 슬라이드 추가 전에 설정한다.

---

## 관련 파일

| 파일 | 설명 |
|------|------|
| `generate_pptx.py` | PPTX 생성 스크립트 |
| `SmartAI_Marketing.pptx` | 생성된 결과 파일 |
| `ppt.html` | 동일 내용의 HTML 슬라이드 버전 |
