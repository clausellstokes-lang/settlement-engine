---
name: product-landing
description: >-
  Conventions and ready-made recipes for a scroll-driven product landing site.
  USE THIS SKILL whenever working on a product landing page — any request
  touching its sections, scroll-scrubbed background video, Higgsfield
  MCP-generated assets, GSAP ScrollTrigger pins, Lenis smooth scroll, glass
  panels/cards, brand typography/colors, reference images, all-keyframe video
  encoding, or "swap the background video / add a section / change the scroll
  animation" should follow these rules. Always read copy/brand-kit.md first and
  derive all brand decisions from it.
---

# Product landing site

A single-page, scroll-driven motion landing page built from the project's brand
kit. Before doing anything, read `copy/brand-kit.md` and use it as the single
source of truth for the brand name, product name, slogan, color palette,
typography, visual mood, target audience, and website goal.

The site should feel dark, cinematic, minimal, and premium — unless the brand
kit defines a different direction, in which case follow the brand kit exactly.

The goal is not to build a normal static product page. The goal is to build a
motion-driven product experience where the visitor scrolls through the story of
the product. The full-screen background video is generated with Higgsfield MCP,
encoded for smooth scroll scrubbing, and used as the core motion layer behind
the website content.

---

## Project facts

Read all of the following from `copy/brand-kit.md` before proceeding:

- **Brand name**
- **Product name**
- **Slogan**
- **Brand positioning**
- **Target audience**
- **Website goal**
- **Visual mood**
- **Color palette**
- **Typography direction**

### Suggested project root

Use the current working directory opened in Claude Code. A typical structure:

```txt
/
├─ assets/
│  ├─ images/
│  ├─ videos/
│  └─ references/
├─ copy/
│  └─ brand-kit.md
└─ website/
   ├─ index.html
   ├─ package.json
   ├─ src/
   │  ├─ main.js
   │  ├─ style.css
   │  └─ glass.css
   └─ public/
      ├─ bg.mp4
      └─ img/
```

### Stack

- Vite
- Vanilla JavaScript ES modules, unless the user explicitly requests React
- GSAP + `gsap/ScrollTrigger`
- Lenis for smooth scroll
- Optional lightweight cursor / glow layer
- CSS variables for brand tokens derived from the brand kit
- Higgsfield MCP for media generation
- `ffmpeg` for all-keyframe video encoding

### Files that matter

- `website/index.html` — all page section markup and Google Fonts link
- `website/src/main.js` — Lenis, ScrollTrigger, video scrub, section render logic
- `website/src/style.css` — base layout, typography, sections, video layer
- `website/src/glass.css` — glass panels, buttons, chips, cards
- `website/public/bg.mp4` — scroll-scrubbed all-keyframe background video
- `assets/references/BRAND-hero-reference.png` — main hero/product reference
- `assets/references/BRAND-material-reference.png` — material/detail reference
- `assets/references/BRAND-workspace-reference.png` — environment/mood reference
- `assets/videos/BRAND-scroll-background.mp4` — raw Higgsfield-generated video
- `copy/brand-kit.md` — product positioning, visual mood, site sections, video brief

### Run and build

```bash
cd website
npm install
npm run dev
```

Portable static build:

```bash
npm run build -- --base=./
```

Preview the build over HTTP, not `file://`:

```bash
npx serve dist
```

---

## Brand tokens

Read `copy/brand-kit.md` before editing the site. All colors, fonts, and
identity details must come from the brand kit. The examples below are a
structural reference only — replace every value with what the brand kit defines.

### Color palette

Define CSS variables from the brand kit's color palette:

```css
:root {
  --bg: /* brand kit background color */;
  --surface: /* brand kit surface color */;
  --surface-2: /* brand kit secondary surface */;
  --text: /* brand kit primary text color */;
  --muted: /* brand kit muted/secondary text color */;
  --accent: /* brand kit primary accent color */;
  --accent-2: /* brand kit secondary accent color, if defined */;
  --line: /* brand kit border/divider color */;
}
```

Rules:

- Use the primary accent color sparingly for CTAs, active states, highlights,
  and key interactive elements.
- Use the secondary accent only as a small technical or supporting detail, if
  the brand kit defines one.
- The site should stay mostly dark and neutral unless the brand kit directs
  otherwise.
- Avoid neon rainbow color palettes, busy gradients, and generic SaaS colors
  unless the brand kit explicitly calls for them.

### Typography

Use the fonts defined in the brand kit's typography direction. If Google Fonts
are recommended, link them in `index.html`. Define CSS variables:

```css
:root {
  --font: /* brand kit body font */;
  --font-head: /* brand kit heading font */;
  --font-mono: /* brand kit mono font, if defined */;
}
```

Apply `--font-head` to display elements:

```css
.nav__logo,
.hero__title,
.impact__head,
.section-head h2,
.showcase__line,
.feature__title,
.spec__value,
.buy__title,
.buy__amount,
.footer__big,
.preloader__word {
  font-family: var(--font-head);
}
```

Use mono typography for small labels, counters, specs, and technical chips if
the brand kit includes a mono font.

---

## Visual direction

Read the visual mood section of `copy/brand-kit.md` and use it to define the
site's atmosphere, lighting style, materials, and motion direction. The
descriptions below are structural prompts — fill them in from the brand kit.

### Mood

Derive from the brand kit's brand personality and visual mood sections.

### Lighting

Derive from the brand kit's visual mood section.

### Materials

Derive from the brand kit's product description and visual mood sections.

### Motion

- slow, smooth camera movement
- shallow depth of field
- gentle parallax
- no fast cuts
- no shaky movement
- no distracting background motion
- pace and style should match the brand kit's visual mood

---

## Reference assets

The three reference images define the visual foundation for the video and site.
Their creative direction must come from the brand kit.

### `BRAND-hero-reference.png`

Use as the main product design and hero composition reference.

Purpose:

- Defines the product silhouette and hero placement
- Establishes negative space for headline and CTA
- Useful for hero section composition and first video phase

### `BRAND-material-reference.png`

Use as the material and detail reference.

Purpose:

- Defines the product's textures and surface finishes from the brand kit
- Defines the accent color treatment in physical materials
- Useful for material/design sections and second video phase

### `BRAND-workspace-reference.png`

Use as the environment and mood reference.

Purpose:

- Defines the environment and atmosphere appropriate to the brand's audience
- Connects the product to its target use cases from the brand kit
- Useful for lifestyle/workflow sections and third video phase

---

## Background video requirements

The main background video must be designed for a **scroll-driven website**, not
just as a standalone cinematic clip. Its creative direction must come from the
brand kit's Higgsfield video brief and visual mood sections.

### Raw generated file

```txt
assets/videos/BRAND-scroll-background.mp4
```

### Final scrubbed file

```txt
website/public/bg.mp4
```

### Creative direction

Read the Higgsfield video brief in `copy/brand-kit.md` and use it as the
prompt foundation. The video should feel like one continuous premium product
film with three slow phases that match the brand kit's visual mood:

1. **Hero composition** — product on a surface appropriate to the brand's world.
   Keep one side calmer and darker for hero text and buttons.

2. **Material detail** — slow move into the product's surfaces, textures, and
   materials as described in the brand kit.

3. **Environment mood** — reveal the broader environment appropriate to the
   brand's target audience and use cases.

### Constraints

- 16:9
- 12–16 seconds
- slow and smooth movement
- suitable for scroll scrubbing
- enough dark negative space for text overlays
- no people
- no readable text baked into the video
- no real brand logos
- no third-party marks
- no busy background
- no fast cuts
- no shaky camera
- no flickering UI elements
- product design should stay consistent with the reference images

---

## Suggested section order

Read the suggested landing page sections from `copy/brand-kit.md` and use them
as the primary section guide. The structure below is a generic default — follow
the brand kit's own section list if it differs.

1. `#home` — Hero
   Full-screen video background, brand wordmark, slogan, product value
   proposition, CTA.

2. `#impact` — Core promise statement
   Large pinned text reveal explaining the brand's core emotional promise.

3. `#showcase` — Product detail moment
   Short section focused on design, material, and key product quality.

4. `#features` — Key feature cards
   Feature cards derived from the brand kit's key benefits section.

5. `#workflow` — Made for the audience
   One-card-at-a-time gallery or pinned cards for the target use cases defined
   in the brand kit.

6. `#specs` — Technical credibility
   Clean specs table derived from the brand kit's product description.

7. `#buy` — Pre-order or purchase section
   Price, contents, CTA derived from the brand kit's website goal.

8. `footer` — Footer dissolve to black
   Minimal links, brand signature, secondary CTA.

---

## Layer architecture

Background is fixed. Content scrolls over it.

Keep this stack intact:

| Element | z-index | Role |
|---|---:|---|
| `.bg-video` / `#bgv` | 0 | Fixed full-screen video, object-fit cover, scrubbed by scroll |
| `.bg-tint` | 1 | Radial darkening and contrast layer for text readability |
| `.motion-glow` / optional cursor layer | 2 | Subtle accent motion accents, never dominant |
| `#page` | 10 | All page sections |
| `.custom-cursor` | 100 | Optional cursor ring or hover detail |

The footer should live outside the padded sections as a full-bleed dark band.
Use a gradient dissolve above the footer rather than a fixed overlay.

---

## Interaction rules

### Scroll-scrubbed video

The video should be controlled by scroll position, not autoplay timing. Map
scroll progress to `bgVideo.currentTime`.

Keep redundant seeks low:

```js
const t = progress * (bgVideo.duration - 0.05);

if (Math.abs(t - lastVideoT) > 0.008) {
  bgVideo.currentTime = t;
  lastVideoT = t;
}
```

### ScrollTrigger pins

Use pinned sections sparingly. Each pin changes the scroll timing.

Good candidates:

- impact statement
- feature/card gallery
- specs or final CTA

### Text readability

The video is beautiful, but the website must remain readable.

Use:

- radial dark overlay
- background blur behind glass cards
- text shadows used subtly
- calmer zones for hero copy
- glass panels with enough opacity over bright frames

---

## Recipes

### 1. Generate reference images with Higgsfield MCP

Read `copy/brand-kit.md` first. Use GPT Image 2 to create three 16:9 visual
references based on the brand kit's product description, visual mood, color
palette, and Higgsfield video brief:

```txt
assets/references/BRAND-hero-reference.png
assets/references/BRAND-material-reference.png
assets/references/BRAND-workspace-reference.png
```

The references should define the product design, materials, lighting, and
workspace mood before video generation.

### 2. Generate the scroll background video

Use the three reference images and the brand kit's Higgsfield video brief to
generate:

```txt
assets/videos/BRAND-scroll-background.mp4
```

The prompt must explicitly say that the video will be used in a scroll-driven
motion website and must be slow, stable, text-friendly, cinematic, and suitable
for frame-by-frame scrubbing.

### 3. Re-encode the background video for scroll scrubbing

Raw AI-generated MP4 files often seek poorly during scroll scrubbing. Re-encode
to all-keyframe H.264.

Create a helper script:

```bash
mkdir -p scripts
cat > scripts/swap-bg-video.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

INPUT="$1"
OUTPUT="website/public/bg.mp4"

mkdir -p website/public

ffmpeg -y -i "$INPUT" -an -c:v libx264 -preset slow -crf 18 \
  -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p \
  -movflags +faststart "$OUTPUT"

echo "Encoded all-keyframe background video to $OUTPUT"
EOF

chmod +x scripts/swap-bg-video.sh
```

Run:

```bash
scripts/swap-bg-video.sh "assets/videos/BRAND-scroll-background.mp4"
```

After swapping, confirm in the browser console:

```js
window.__bgv.readyState === 4
window.__bgv.duration
```

### 4. Add a pinned, scroll-scrubbed section

Use this pattern for pinned content reveals:

```js
function setupImpact() {
  const section = document.querySelector("#impact");
  const pin = section.querySelector(".impact__pin");
  const words = [...section.querySelectorAll(".word")];

  function render(p) {
    words.forEach((word, i) => {
      const start = (i / words.length) * 0.72;
      const o = gsap.utils.clamp(0, 1, (p - start) / 0.12);
      word.style.opacity = 0.12 + o * 0.88;
      word.style.filter = `blur(${(1 - o) * 8}px)`;
      word.style.transform = `translateY(${(1 - o) * 18}px)`;
    });
  }

  render(0);

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: () => "+=" + innerHeight * 1.7,
    pin,
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: self => render(self.progress),
  });
}
```

### 5. Create a use-case gallery

Use a one-card-at-a-time gallery for the target audience use cases defined in
the brand kit:

```js
function setupCreatorGallery() {
  const track = document.querySelector("#workflow-track");
  const slides = [...track.querySelectorAll(".workflow-card")];
  const N = slides.length;

  function render(p) {
    const pos = p * (N - 1);

    slides.forEach((el, i) => {
      const d = pos - i;
      const ad = Math.abs(d);

      el.style.opacity = Math.max(0, 1 - ad / 0.6);
      el.style.transform = `translate(${-d * 130}px, -50%) scale(${1 - Math.min(ad, 1) * 0.06})`;
      el.style.filter = `blur(${Math.min(ad * 10, 14)}px)`;
      el.style.zIndex = String(100 - Math.round(ad * 10));
      el.style.pointerEvents = el.style.opacity > 0.6 ? "auto" : "none";
    });
  }

  render(0);

  ScrollTrigger.create({
    trigger: "#workflow",
    start: "top top",
    end: () => "+=" + Math.max(1, N - 1) * innerHeight * 0.72,
    pin: ".workflow__pin",
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: self => render(self.progress),
  });
}
```

CSS note:

```css
.workflow .workflow-card {
  position: absolute;
  top: 50%;
  left: clamp(1.5rem, 6vw, 7rem);
  width: min(420px, 44vw);
}
```

If cards also use `.glass`, make the selector more specific than `.glass`
because `glass.css` may load after `style.css`.

### 6. Glass panels and buttons

Use glass UI sparingly. It should feel premium, not cluttered.

```css
.glass {
  position: relative;
  overflow: hidden;
  background: rgba(18, 19, 25, 0.46);
  border: 1px solid color-mix(in srgb, var(--line) 75%, transparent);
  backdrop-filter: blur(22px) saturate(1.18);
  -webkit-backdrop-filter: blur(22px) saturate(1.18);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
}

.glass::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08),
    transparent 38%,
    rgba(var(--accent-rgb), 0.05)
  );
  pointer-events: none;
}

.glass > * {
  position: relative;
  z-index: 2;
}
```

Buttons:

```css
.glass-btn--primary {
  background: linear-gradient(
    135deg,
    var(--accent),
    color-mix(in srgb, var(--accent) 70%, #ffffff 20%)
  );
  color: var(--bg);
}
```

### 7. Footer dissolve to dark

```css
.footer {
  position: relative;
  margin-top: 30vh;
  padding: 16vh clamp(1.25rem, 5vw, 6rem) 8vh;
  background: var(--bg);
}

.footer::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  height: 45vh;
  background: linear-gradient(to bottom, transparent, var(--bg));
  pointer-events: none;
}
```

### 8. Freeze or slow the video during a pin

```js
const k = 0.18;

let eff = scrollY;
let removed = 0;

if (galleryST) {
  const gs = galleryST.start;
  const ge = galleryST.end;
  const gl = ge - gs;

  removed = gl * (1 - k);

  if (scrollY >= ge) {
    eff = scrollY - removed;
  } else if (scrollY > gs) {
    eff = gs + (scrollY - gs) * k;
  }
}

const p = eff / Math.max(1, lenis.limit - removed);
const t = p * (bgVideo.duration - 0.05);

if (Math.abs(t - lastVideoT) > 0.008) {
  bgVideo.currentTime = t;
  lastVideoT = t;
}
```

---

## Mobile behavior

Scroll-scrubbed video can be heavy on mobile. Provide a fallback.

Recommended:

- keep the video on larger screens
- use a poster image on touch devices
- reduce or remove pinned sections on small screens
- convert card galleries into vertical stacked cards
- disable custom cursor on touch devices

```css
@media (hover: none), (max-width: 768px) {
  .bg-video {
    display: none;
  }

  .mobile-poster {
    display: block;
    position: fixed;
    inset: 0;
    background-image: url("/img/mobile-poster.jpg");
    background-size: cover;
    background-position: center;
    z-index: 0;
  }
}
```

---

## Claude Preview verification

Claude Preview can throttle animation when backgrounded. If screenshots look
wrong, verify with dev hooks and browser console before assuming the code is
broken.

Expose dev hooks in development:

```js
if (import.meta.env.DEV) {
  window.__lenis = lenis;
  window.__ST = ScrollTrigger;
  window.__bgv = bgVideo;
}
```

Use:

```js
window.__bgv.readyState
window.__bgv.duration
window.__ST.refresh()
```

For pinned states, native scroll jumps are often more reliable than Lenis jumps:

```js
window.scrollTo(0, document.querySelector("#impact").offsetTop + innerHeight * 0.8);
window.__ST.update();
```

Always run:

```bash
npm run build
```

after major edits.

---

## Gotchas

1. **Raw AI video may scrub poorly.**
   Always re-encode the final background video to all-keyframe H.264.

2. **Text readability beats video beauty.**
   If the video is too bright or busy, darken with `.bg-tint`, add a gradient,
   or adjust the section layout.

3. **Pinned sections shift later ScrollTriggers.**
   Use `invalidateOnRefresh: true` and call `ScrollTrigger.refresh()` after
   layout-affecting changes.

4. **Glass cards may override positioning.**
   If `.glass { position: relative; }` overrides absolutely positioned cards,
   out-specify it with `.workflow .workflow-card { position: absolute; }`.

5. **Do not use real brands or logos.**
   Keep all assets original and fictional as defined in the brand kit.

6. **Do not bake website text into images or video.**
   Text should be rendered in HTML/CSS, not inside generated media.

7. **Do not open the build through `file://`.**
   Use Vite dev server or `npx serve dist`.

8. **Keep the motion slow.**
   Scroll-driven video should feel deliberate. Fast motion becomes unpleasant
   when scrubbed manually.

---

## Quality checklist

Before considering the site complete:

- [ ] `copy/brand-kit.md` has been read and all brand tokens are applied
- [ ] three reference images exist in `assets/references/`
- [ ] raw Higgsfield video exists in `assets/videos/`
- [ ] all-keyframe video exists at `website/public/bg.mp4`
- [ ] site runs with `npm run dev`
- [ ] `window.__bgv.readyState === 4`
- [ ] video scrubs smoothly on scroll
- [ ] hero text remains readable over the video
- [ ] at least one pinned ScrollTrigger section works
- [ ] Lenis smooth scroll works without breaking pins
- [ ] glass cards remain legible over bright frames
- [ ] mobile fallback exists
- [ ] `npm run build -- --base=./` passes
- [ ] no real logos, third-party marks, or baked-in text appear in media

---

## Preferred build philosophy

Start simple, then add motion.

Recommended order:

1. Read `copy/brand-kit.md` and apply all brand tokens
2. Generate reference images based on the brand kit
3. Generate scroll-friendly video based on the brand kit's video brief
4. Re-encode all-keyframe
5. Build Vite project shell
6. Add fixed video background and scrub mapping
7. Add hero
8. Add one pinned impact section
9. Add feature cards from the brand kit's key benefits
10. Add specs and CTA from the brand kit's product description
11. Add mobile fallback
12. Polish glass, typography, spacing, and performance

The website should feel like a premium product launch built entirely around
the brand established in `copy/brand-kit.md`.
