# Web Presentation Skill – Complete Reference

This document defines a complete system for building full-screen web presentations using **only HTML, CSS, and vanilla JavaScript** — no external libraries or build tools required.

## Core Purpose

Generate single-file, browser-ready presentations that load instantly. Users trigger navigation via arrow keys, Space, or touch swipes. The system includes progress tracking, slide numbering, and staggered animation effects.

## Essential Features

Every presentation must include:

- **Keyboard navigation**: Arrow keys (←/→), Space/PageDown for next, Home/End for boundaries
- **Fullscreen toggle**: F key invokes `requestFullscreen()` API
- **Visual indicators**: Slide counter (bottom-right, "X / Total" format) and progress bar (bottom, percentage-based)
- **Animations**: CSS transitions with `transform: translate3d()` for GPU acceleration; `.step` elements appear sequentially via `data-step` ordering
- **Touch support**: Swipe detection (48px threshold) on `touchend`
- **Accessibility**: Key hints (hide on first input), motion-reduction media query support
- **Responsive text**: `clamp()` for fluid typography scaling across viewports

## HTML Structure

```
#app (flex container, relative positioned)
├── .slide (absolute, opacity-based transitions)
│   ├── .content (centered, width-constrained)
│   └── .step[data-step="N"] (staggered reveal)
├── #progress-bar → #progress-fill (width animated)
├── #counter (formatted "1 / 5")
└── #key-hint (kbd elements, hide on interaction)
```

## JavaScript Architecture

Single IIFE managing:
- **State**: `cur` index, `busy` flag, `staggerTimers[]` array
- **Navigation**: `goTo(idx, instant)` with smooth fade/slide or instant jump
- **Events**: keyboard (`keydown`), touch (`touchstart`/`touchend`), hash changes
- **Effects**: `showStaggered()` delays `.step` element reveal; `resetSteps()` clears for incoming slides

**Critical pattern**: Busy flag + transitionend + setTimeout fallback prevents animation conflicts.

## CSS Foundation

Dark theme defaults (customizable):
- `body` background: `#0E0C08` (near-black)
- Text: `#F0E8D8` (off-white)
- Fonts: Noto Sans KR (Korean), Inter (UI)
- Slide backgrounds: Subtle radial/linear gradients per slide

Typography classes (`.label`, `.title`, `.subtitle`, `.body`, `.big`) use `clamp()` for viewport-aware sizing.

## Design Patterns

**Title slide**: Label + title + divider + body (steps 1–4)
**Content slide**: Label + subtitle + bulleted list (each item is a step)
**Card grid**: Steps applied to container; cards render as flex grid
**Code block**: `<code>` inside `.code-block` with monospace font

## Customization Entry Points

- Add slides: Insert `<section class="slide slide-N">` + corresponding CSS `.slide-N { background: ... }`
- Change theme: Modify `body` background, accent colors, per-slide gradients
- Adjust timing: Edit `DURATION` (400ms default) and `STAGGER` (120ms default)
- Swap fonts: Update `<link>` and `font-family` declarations

## Key Constraints

- Use `transform`/`opacity` only (no `left`/`top` animation)
- Fullscreen API works only within user gesture contexts
- Hash-based URL state (`#slide-1`, `#slide-2`) enables browser back/forward
- `prefers-reduced-motion: reduce` disables all transitions
- Mobile: `100dvh` instead of `100vh` for address bar accounting

This system ships as a **single, self-contained HTML file** requiring no server, npm, or external CDN dependencies.
