# SettlementForge — scroll-driven landing microsite

A standalone marketing microsite (separate from the app): the journey film as a
fixed, scroll-scrubbed background with parchment-plate content scrolling over it.
Built per `.claude/skills/BRAND-landing/SKILL.md` with the brand adaptations from
`marketing/copy/brand-kit.md` — parchment-and-ink plates instead of glass, the
forge-free CTA instead of pre-order, no prices baked in (the rate card lives in
the app), reduced-motion and touch fallbacks included.

## Run

```bash
cd marketing/website
npm install
npm run dev        # http://localhost:5173
```

## Build + preview the build

```bash
npm run build -- --base=./
npx serve dist     # never open dist over file://
```

## Assets

- `public/bg.mp4` — the journey film, re-encoded ALL-KEYFRAME H.264 (g=1) for
  frame-accurate scrubbing. Raw master: `../assets/videos/settlementforge-journey-scrub.mp4`.
  To swap in a new film: re-encode with
  `ffmpeg -y -i INPUT -an -c:v libx264 -preset slow -crf 18 -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart public/bg.mp4`
  (an `ffmpeg-static` binary works fine if ffmpeg isn't installed).
- `public/img/seal.svg` — the house device (canonical vector; never regenerate).
- `public/img/mobile-poster.png` — the town evolution plate; shown instead of
  the film on touch/small screens.

## Behavior notes

- The film scrubs with scroll (no autoplay). Two pinned sequences: the impact
  statement and the one-card-at-a-time audience gallery.
- `prefers-reduced-motion`: no Lenis, no pins, no scrub; reveals render instantly
  and the gallery stacks vertically.
- Dev hooks (dev builds only): `window.__lenis`, `window.__ST`, `window.__bgv`.
- The 33MB all-keyframe file is a prototype-grade asset; for production, add a
  720p variant and serve by viewport.
