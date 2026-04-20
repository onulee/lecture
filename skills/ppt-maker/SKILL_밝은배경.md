# Web Presentation Skill – Warm Light Theme (skill2)

This document defines a complete system for building full-screen web presentations using **only HTML, CSS, and vanilla JavaScript** — no external libraries or build tools required.

Based on SKILL.md with a **warm light color theme** derived from the sample design reference (샘플1–6.jpg).

## Color Palette

```
--bg:           #f2f0eb   /* warm cream – slide/page background */
--header-bar:   #3d3d3d   /* dark charcoal – section label bar at top */
--text-primary: #333333   /* dark charcoal – headings, body */
--text-muted:   #888480   /* medium warm gray – captions, secondary */
--accent:       #8B7355   /* warm khaki/gold-brown – badges, icons, highlights */
--accent-light: #a8916e   /* lighter accent – hover states */
--box-fill:     #cdc8bf   /* warm beige/linen – content boxes, table cells */
--box-dark:     #b8b2a8   /* slightly darker beige – alternate box */
--dot-pattern:  #c8c4bc   /* decorative dot grid color */
--divider:      #d8d4ce   /* subtle rule lines */
```

## Core Purpose

Generate single-file, browser-ready presentations that load instantly. Light, professional aesthetic with warm neutrals. Users trigger navigation via arrow keys, Space, or touch swipes. The system includes progress tracking, slide numbering, and staggered animation effects.

## Essential Features

Every presentation must include:

- **Keyboard navigation**: Arrow keys (←/→), Space/PageDown for next, Home/End for boundaries
- **Fullscreen toggle**: F key invokes `requestFullscreen()` API
- **Visual indicators**: Slide counter (bottom-right, "X / Total" format) and progress bar (bottom, percentage-based) — bar uses `--accent` color
- **Animations**: CSS transitions with `transform: translate3d()` for GPU acceleration; `.step` elements appear sequentially via `data-step` ordering
- **Touch support**: Swipe detection (48px threshold) on `touchend`
- **Accessibility**: Key hints (hide on first input), motion-reduction media query support
- **Responsive text**: `clamp()` for fluid typography scaling across viewports

## HTML Structure

```
#app (flex container, relative positioned)
├── .slide (absolute, opacity-based transitions)
│   ├── .slide-header (dark charcoal bar, section label + slide number)
│   ├── .content (centered, width-constrained)
│   │   ├── .section-icon (☑ checkbox icon in charcoal)
│   │   ├── .section-title
│   │   ├── .box-full / .box-half (beige content boxes)
│   │   └── .step[data-step="N"] (staggered reveal)
│   └── .dot-deco (decorative dot grid, bottom-right)
├── #progress-bar → #progress-fill (accent color fill)
├── #counter (formatted "1 / 5")
└── #key-hint (kbd elements, hide on interaction)
```

## Slide Design Patterns

**Cover slide (샘플1 style)**:
- Full cream background, no header bar
- Left vertical accent line in `--accent` color (3px wide, ~60px tall)
- Large title in `--text-primary`, subtitle below in `--text-muted`
- Author + date in small `--text-muted`
- Decorative dot-chevron pattern (bottom-right, `--dot-pattern`)
- Steps: accent line → title → subtitle → meta

**Table of Contents slide (샘플2 style)**:
- No header bar, or minimal top label
- "목차" heading with left accent border in `--accent`
- Numbered list items, each as a `.step`
- Decorative dot-bird/arrow pattern (bottom-right)

**Section header slide (샘플3 style)**:
- `.slide-header` bar: `background: var(--header-bar)`, white text, "N. 섹션명" format
- ☑ icon + section title below
- Data grid: flex row of `.grid-cell` items (background `--box-fill`)
  - Each cell: label (small, `--text-muted`) + value (large, `--text-primary`)

**Timeline / Progress slide (샘플4 style)**:
- `.slide-header` bar with section label
- Timeline rows: date badge (background `--accent`, white text) + description text
- Chart icon (bar chart or arrow) on right, filled with `--accent`
- Each row is a `.step`

**Dual-box slide (샘플5 style)**:
- `.slide-header` bar
- Two sections each with ☑ icon + title
- `.box-full` (full width) or `.box-half` (side by side) with `background: var(--box-fill)`
- Bullet items inside boxes with `○` markers in `--text-muted`

**Nested content slide (샘플6 style)**:
- `.slide-header` bar
- Sub-header row: ▶ icon in `--accent` + label text
- `.box-full` with bullet content
- Arrow-prefixed rows (➡) for nested items, accent colored arrows

## JavaScript Architecture

Single IIFE managing:
- **State**: `cur` index, `busy` flag, `staggerTimers[]` array
- **Navigation**: `goTo(idx, instant)` with smooth fade/slide or instant jump
- **Events**: keyboard (`keydown`), touch (`touchstart`/`touchend`), hash changes
- **Effects**: `showStaggered()` delays `.step` element reveal; `resetSteps()` clears for incoming slides

**Critical pattern**: Busy flag + transitionend + setTimeout fallback prevents animation conflicts.

## CSS Foundation

Light warm theme:
- `body` background: `#f2f0eb` (warm cream)
- Text: `#333333` (dark charcoal)
- Fonts: Noto Sans KR (Korean), Inter (UI) — loaded from Google Fonts
- Progress bar fill: `#8B7355` (warm accent)
- Counter text: `#333333`

### Typography classes

```css
.title    { font-size: clamp(32px, 5.5vw, 68px); font-weight: 900; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 16px; color: var(--text-primary); }
.subtitle { font-size: clamp(20px, 3vw, 36px); font-weight: 700; line-height: 1.3; margin-bottom: 24px; color: var(--text-muted); }
.body     { font-size: clamp(14px, 1.6vw, 20px); font-weight: 300; line-height: 1.8; color: var(--text-primary); }
.label    { font-size: clamp(11px, 1.2vw, 14px); font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 20px; color: var(--text-muted); }
.big      { font-size: clamp(22px, 3.5vw, 48px); font-weight: 700; line-height: 1.25; color: var(--text-primary); }
```

### Component classes

```css
.slide-header     { background: #3d3d3d; color: #fff; padding: 10px 40px; font-size: 14px; }
.section-icon     { color: #3d3d3d; font-size: 1.3em; margin-right: 10px; }
.box-full         { background: var(--box-fill); border-radius: 6px; padding: 24px 28px; }
.box-half         { background: var(--box-fill); border-radius: 6px; padding: 20px 24px; flex: 1; }
.badge-date       { background: var(--accent); color: #fff; font-size: 12px; padding: 4px 12px; border-radius: 4px; }
.accent-bar       { width: 3px; height: 56px; background: var(--accent); border-radius: 2px; }
.dot-deco         { position: absolute; bottom: 20px; right: 20px; opacity: 0.3; pointer-events: none; }
.grid-cell        { background: var(--box-fill); flex: 1; padding: 16px 20px; border-radius: 4px; }
.grid-cell .val   { font-size: clamp(20px, 3vw, 32px); font-weight: 600; color: var(--text-primary); }
.grid-cell .key   { font-size: 12px; color: var(--text-muted); margin-bottom: 6px; }
```

## Customization Entry Points

- Add slides: Insert `<section class="slide slide-N">` + corresponding CSS if per-slide background variation needed
- Change accent: Replace `#8B7355` with desired brand color throughout
- Adjust timing: Edit `DURATION` (400ms default) and `STAGGER` (120ms default)
- Swap fonts: Update `<link>` and `font-family` declarations

## Key Constraints

- Use `transform`/`opacity` only (no `left`/`top` animation)
- Fullscreen API works only within user gesture contexts
- Hash-based URL state (`#slide-1`, `#slide-2`) enables browser back/forward
- `prefers-reduced-motion: reduce` disables all transitions
- Mobile: `100dvh` instead of `100vh` for address bar accounting
- Keep all assets inline — this ships as a **single, self-contained HTML file**

## Dot Decoration Pattern

Replicate the sample's dot grid + chevron/bird shape using SVG inline:

```html
<svg class="dot-deco" width="160" height="140" viewBox="0 0 160 140">
  <!-- dot grid -->
  <g fill="#8B7355" opacity="0.35">
    <!-- repeat circles at 10px intervals -->
  </g>
  <!-- chevron shape formed by larger dots -->
</svg>
```

Or use CSS `radial-gradient` repeating pattern for the dot grid background.
