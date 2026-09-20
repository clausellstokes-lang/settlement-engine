# REVIEW-P — the anonymous public-path walk (ODQ §934.24 item 1)

Lane: Opus REVIEW (read-only). Chair: Fable 5.1, session a9df403c. Date 2026-09-20.
Tree walked: `$SP/read-tip-32602dc60` at **32602dc60** (`CURE-D: the prose-wiring census re-taken…`).
`git status --short` **empty before and after** the walk (verified twice; exit 0 both times).

**Instrument.** The read tree's own Playwright **1.60.0**, chromium headless, driven by
`$SP/lane-review-p-scratch/walk{,2,3,4,5,6,7,8}.mjs`. Server: `VITE_PREVIEW_ROLE= vite --port 5231
--strictPort --host 127.0.0.1` started from the read tree (PID 84024, killed by PID at the end;
nothing else touched). **The persona was OFF** — the read tree carries only `.env.e2e` and
`.env.example`, no `.env.development.local`; no `PREVIEW PERSONA` badge appears in any of the 120+
captures, and the account control reads **Sign In** on every route.
Viewports: **phone 375×812** (mobile UA, `isMobile`, `hasTouch`) and **desktop 1440×900**.
Never signed in, entered no credentials, submitted no form, bought nothing.

---

## FINDINGS

| # | Step | Viewport | Receipt | Exact copy / measurement | Law | Severity | Smallest cure (not built here) |
|---|---|---|---|---|---|---|---|
| **F1** | 7 · a sample fork | both | `walk3-desktop.json` §B; `walk2-{desktop,phone}.json` `fork.forks`; `fork-desktop-1.png`, `fork-phone-1.png` | **Two independent anonymous contexts forking Cnocby produced byte-identical worlds**: `settlement.id = s_01773858621d9a94`, `_seed = "cnocby-033a-anon"`, pop **729**, NPCs `[Deirbhile Sheridan, Barra Ward, Gobnat Brennan, Finnuala Murphy]`, first faction `The Grey Council`. Desktop and phone contexts forking Mossgate both gave `s_691e605ab09e6143`, seed `mossgate-004-anon`. The cards promise the opposite — /create: *"Fork one of these curated settlements into your own draft: **no two the same, all deterministic from their seed.**"*; /settlements: *"**Each forks with a unique character. Same setting, different settlement.**"* Cause: `src/data/sampleSettlements.js:166-170` `forkSeedFor` → `` `${sample.config.seed}-${(userId \|\| 'anon').slice(0,8)}` ``, then `src/domain/normalizeSettlement.js:191` `out.id = idFromSeed(out._seed)` | §934.24 item 1 (copy promising what the product does not do); RECON-ID §934.47 addendum — **NEW as a walked defect** | **a visitor is misled** | Mint a per-browser anonymous fork salt once (beside `sf.anon.gens`) and pass it as `forkSeedFor`'s `userId`, so anonymous forks vary as the card promises while staying stable within one browser |
| **F2** | 7 · the id's blast radius | — | code read + F1's receipt | **CONFIRMED**: anonymous forks collide on `settlement.id`. **PLAUSIBLE, unreachable anonymously**: the *library* and *gallery* do **not** collide — `src/lib/saves.js:467-487` inserts the row with **no** `id`, so the DB mints it and `settlement.id` travels only inside `data`; `src/lib/gallery.js:62` publishes by that save-row id. The reachable hazard is **within one realm**: `src/domain/regionalGraph.js:302` (`centerId = settlement.id`), `src/domain/resourceSites.js:142`, `src/domain/townMap/mapDress.js:101,167` all key on it, so two saves grown from one seed placed in one campaign share a node key | RECON-ID | a visitor is misled (latent) | Give the realm/graph layer the **save** id as its node key, or make `settlement.id` fold the resolved config as `contentId` already does |
| **F3** | 4–5 · the forge / first dossier | desktop (same control on phone) | `cap-desktop-r4.png`; `walk8-desktop.json` round 4 | After 1 generation + 2 rerolls (`sf.anon.gens = {"date":"2026-09-20","full":1,"reroll":2}`), a 4th click on **"↻ Regenerate draft"** leaves the settlement unchanged (Anyuan → Anyuan), sets `lastRefusal = {"reason":"dailyCap","vars":null}` in the store, and renders **zero** `role="alert"` / `role="status"` nodes. The button stays enabled, its label unchanged. The screenshot shows a completely unchanged screen | **§934.24 item 2** — no gate refuses silently. The exact shape `FoundingWorlds.jsx`'s header records as cured for the sample strip | **a visitor is blocked** | Mount `components/primitives/RefusalNotice.jsx` on the dossier toolbar the way the sample strip does; the lane already records the reason |
| **F4** | 2 · landing | desktop (section not mounted on phone, §934.27) | `N-narrate-after-desktop.png`; `walk5-desktop.json` §N | /home section **"02 · THE VOICE"**, the enabled button **"Narrate"** under the *"5 credits"* plate. Clicked from a clean anonymous context → `href: /create`, `store.settlement: false`, `dialogs: []`, `alerts: []`. No notice, no settlement; the reader is silently moved off the landing | **§934.24 item 2**; and FoundingWorlds.jsx's own rule *"a refusal NEVER navigates"* | **a visitor is misled** | Raise the lane's registered reason through `RefusalNotice` beside the panel; do not navigate |
| **F5** | 4–6 · forge wait, first dossier, save nudge | desktop | `forge-desktop-t00785ms.png`, `forge-desktop-t01443ms.png`, `forge-desktop-settled.png`; `walk2-desktop.json` `forge`; `walk4-desktop.json` §H | `storeMs = 785`, `readableMs = 7700`. At **785 ms** the card reads **"What's next — Erdenkul is ready. ① STEP 1 OF 4 — Save it. Create a free account"** while the screen shows only the establishing painting; at 1443 ms it is still up beside the *"Forging Erdenkul…"* rail, then on **step 2 of 16**. When the dossier lands the card (`role="dialog"`, `position: fixed`, `z-index: 900`, **340×225 at top=600 left=1076** in 1440×900) overlaps live prose: *"The strain is severe. Petenpeten is meeting it by giving up things it would rather keep…"* (**4742 px²**), the heading *"What the town is living through"* (4446 px²), *"Petenpeten has more mouths than arrangements…"* (4398 px²), and two more | §934.24 item 1 (a claim false when made) + the positioning law (the 3–10 s forge is **deliberate pacing**; a card announcing the end at the start spends it) — **NEW** | **a visitor is misled** (false claim) / polish (the occlusion) | Gate the coach's mount on the **reveal finishing**, not on `settlement != null`; dock it below the dossier column or inset the column's right gutter by its width |
| **F6** | 5 · first dossier | phone | `walk5-phone.json` §P; `P-coach-phone.png` | The same coach on the phone: `role="dialog"`, `position: relative`, `z-index: auto`, rect **top=2857 left=12 w=351 h=245**, `onScreen: false`. A dialog role on a non-modal, non-focus-trapped card sitting mid-document | NEW (a11y) | polish | Drop `role="dialog"` on the inline phone rendering (it is a `region` there), or make the phone variant a real bottom sheet |
| **F7** | every step | phone | `walk-phone.json` — all 14 phone captures; `02-landing-phone.png` | `<SPAN>` **"Sign In"** in the arrow header computes to **10 px** on /home, /create, the forge wait, the dossier, /settlements, /pricing and /signin — the only sub-12 px element outside /pricing | **§934.24 item 4** (chrome floor ≥ 12 px) | polish | Route the plate's label through `design/proseScale.js` `chromeFontSize()` so the phone rung lifts it to 12 px |
| **F8** | 1–10 · the chrome | phone | `walk4-phone.json` §G; `02-landing-phone.png` (reads **"COMPEND…"**) | Bottom-bar label **"Compendium"**: `scrollWidth 82` vs `clientWidth 71`, `text-overflow: ellipsis`, 12 px. The other four fit exactly — Create 45/45, Library 49/49, Gallery 53/53, About 42/42 | **§934.26** (the bar's five words are the owner's order) | polish | The seat needs ~11 px: size seats by content rather than equal share, or shave 3 px of inter-seat padding |
| **F9** | 9 · pricing | phone | `walk-phone.json` step `09b-pricing-end` (**15** elements < 12 px, **45** more at 12–13.99 px); `09b-pricing-end-phone-full.png` | **11 px prose**: *"Chairs held are counted in the Hall."*, *"Dollar figures are estimates at the starter-pack rate…"*. **11 px chrome**: "Most popular", "AI · early access", "25 credits", "17% off", "60 credits", "34% off", "150 credits", and the four comparison `<TH>` ("World generation", "Simulation", "Exports", "AI"). **12 px prose** (×11 `<P>`): *"The price on this page is the price at checkout…"*, *"Cartographer is a service, not a feature key…"*, *"A chair is given, never sold. A seated chair carries 30 credits."*, *"The artifact is yours: it downloads, it prints, and it survives cancellation."* | **§934.24 item 4** (prose ≥ 14 px, chrome ≥ 12 px) | **confused** — the page that asks for money is the one the phone cannot read | /pricing sets type from raw `FS` constants; route its card + table type through the same `proseFontSize`/`chromeFontSize` the dossier uses (the dossier's phone panes hold the floor exactly) |
| **F10** | 10 · sign-in | both | `walk4-phone.json` §I; `I-account-guard-phone.png` | `/account` → `href: /signin?next=%2Faccount`, `notices: []`. The lead is the generic *"Welcome back — Sign in to keep your work: saves, larger settlements, and the Neighbour System."* The destination **is** preserved; only the reason is dropped | **§934.24 item 2** | confused | The sign-in surface reads `next`; when it names a guarded route it prints one line above the form |
| **F11** | 1 · the front door | both | `walk4-{phone,desktop}.json` §J; `J-notfound-*.png` | `/this-page-does-not-exist` → `href: /create`, `title: SettlementForge`, `notices: []`, `saysNotFound: false`. `src/lib/routes.js:390` already returns `notFound: true`; the hook discards it | **§934.24 item 2** | **a visitor is misled** (a dead link looks like it worked) | Pass `notFound` to the destination and print one dismissible line |
| **F12** | 7 · a sample fork | desktop | `walk3-desktop.json` §A; `A-citycard-after-desktop.png` | Forking **Black Crag** (a City) anonymously renders **two** `role="alert"` nodes with identical copy — one above the hero CTA, one above the Founding Worlds strip: *"A BIGGER SETTLEMENT — A City is past what this account forges; it reaches up to a Town. Sign in (free) to reach thorpe, city, and metropolis."* | NEW (a doubled live-region announcement) | polish | One `RefusalNotice` mount per surface, keyed to the refusing control |
| **F13** | 7 · a sample fork | desktop | same as F12 | The refusal says *"A City is past what **this account** forges"* to a visitor who **has no account** | §934.24 item 2 (a gate's notice must name its reason truthfully) | confused | The anon branch says "an account-less visit"; the copy already branches on tier for the "Sign in (free)" clause |
| **F14** | 7, 9 + gallery | both | `walk4-phone.json` §L; `A-citycard-after-desktop.png`; `walk2-desktop.json` `extra.gallery` | Two spellings on the public path: the refusal prints **"thorpe"**; `/compendium/tier-thorp` renders **"Thorp"**; the gallery TIER chip reads **"Thorp"**; the landing's assets are `leg-1-desk-to-thorp.mp4`. `src/config/tierFacts.js:106` declares "thorpe" deliberate for those sentences — a **declared split**, so it needs a ruling, not a silent edit | NEW | polish | One word, pinned by a walker over both the refusal sentences and the compendium/gallery tier labels |
| **F15** | (realm, walked as an adjacent public route) | desktop | `walk5-desktop.json` §Q `/realm` | `warning: Generate random map`; `warning: Unresolved depressions: 21. Edit heightmap to fix`; `warning: TOTAL: 0.31s`. **Every other public route is console-clean on both viewports** | §934.24 item 1's console clause | polish | Gate the map generator's diagnostics behind `import.meta.env.DEV` |
| **F16** | 9 · pricing | desktop | `walk3-desktop.json` §E | Every `$` figure on /pricing sits in a section carrying *"Available at launch"* **except "$2.99 per settlement"** in the *"What each plan includes"* comparison table. The price itself **resolves** (the dossier's buy button carries the lock), so this is a coverage gap in the lock, not an unresolved price | §934.24 addendum | polish | The comparison table's price cell carries the same lock mark the tier cards do |

---

## CONFIRMED AND SOUND (measured, no finding)

- **§934.24 item 3 — the anonymous daily cap does not apply to a curated sample. BOTH ARMS HOLD.**
  With `sf.anon.gens = {"date":"2026-09-20","full":99,"reroll":99}` seeded before load, "Fork this
  sample" produced a settlement on **both** viewports (`fork-{desktop,phone}-capped-strip.png`,
  `walk2-*.json`) **and left the counter byte-identical at 99/99**, `lastRefusal: null`. The cap is
  neither consulted nor spent.
- **The cap's own arithmetic is honest.** /create says *"(1 free settlement today, plus 2 rerolls)"*;
  measured 1 full + 2 rerolls accepted, the 4th refused (`walk8-desktop.json`). Only the *notice* is
  missing (F3).
- **§934.24 addendum — no Founder card on /create.** `walk3-desktop.json` §E:
  `createFounder: {founderWord: false, dollars: []}` on the create landing.
- **§934.26 — the phone form is exactly as ruled.** Header (sticky) carries only
  `SettlementForge home` (the plaque + wax seal, 169×44) and `Sign In` (84×44) — no nav words.
  Bottom bar (`nav[aria-label="Primary"]`, fixed, h=45): **CREATE › LIBRARY | COMPENDIUM GALLERY
  ABOUT**, **no Realm**, every seat 44 px tall, the flow mark drawn only for the Create→Library pair.
- **§934.26 — /realm on the phone answers honestly:** *"The realm map opens on a tablet or larger
  screen. Your world is saved and waiting, exactly here, when you next sit down at one."*
- **No horizontal overflow at 375** on any walked route (`scrollWidth === clientWidth === 375`
  everywhere) nor in any of the **31** phone dossier panes.
- **The first dossier is clean.** 29 desktop panes + 31 phone panes (every top tab, every sub-tab,
  every collapsible opened): **zero** dotted copy keys, **zero** snake_case tokens, **zero** bare
  floats, **zero** `undefined`/`NaN`/`null`/`[object Object]`, **zero** placeholders
  (`walk7-{desktop,phone}.json`).
- **The phone dossier holds both floors** — no prose under 14 px, all chrome at exactly 12 px
  (the one exception is the header's `Sign In`, F7).
- **The forge pacing matches the ruling.** Click → readable dossier: **7700 ms desktop, 8990 ms
  phone**, inside the owner's 3–10 s band, with a 16-step named rail (*"resolving constraints…
  sourcing resources… reading the pressure… … assembling the dossier…"*). The CTA is
  *"Forge a village →"*. Generation itself lands in the store at 785/842 ms — the pacing is
  deliberate, exactly as the positioning law says.
- **§934.30's honesty line is present on the landing**, beside the events section:
  *"The Narrative Layer never invents facts."* · *"The Narrative Layer is powered by AI. Every AI
  feature here reads and proposes; only the deterministic engine writes canon."* ·
  *"Every one of those is a record the engine wrote, and every one carries its cause."* ·
  *"Every change carries its cause."* Footer: *"Simulated, not AI-generated."*
- **The tier gate names its reason** on the Black Crag fork (content correct; F12/F13 are about how
  it is delivered), and /create states it in advance: *"Free anonymous generations are capped at town
  size. Sign in to push further."*
- **The save nudge is not silent.** *"Save this village. Free account →"* opens the auth modal
  (`walk3-desktop.json` §D).

### Measured and dismissed — do not chase these

- `mountain_timber` / `travelers_inn` on the landing are inside the panel labelled **"Raw — what the
  engine derived"**: deliberate contrast against the Narrated column, not leakage.
- The `.mp4` `requestfailed` lines are the browser **aborting** video fetches. All six journey legs
  and `realm-journey.mp4` serve **HTTP 200** from `public/` (verified by curl).
- **The phone landing being hero-only is ODQ §934.27**, an explicit owner ruling quoted verbatim in
  `src/components/HomeLanding.jsx:195-207` (*"everything below the fold is NOT MOUNTED at phone
  width"*). Desktop `/home` scrollHeight **10974**; phone **1093**. Not a defect.
- The `flags` control is `src/components/dev/DevFlagPanel.jsx`, **DEV-only** (it does cover dossier
  prose on the phone, but it does not ship).
- `warning: [settlementSlice] anonymous daily generation cap reached.` in `walk7` was **my own
  driver** clicking Regenerate four times. Not a defect.
- *"Running in local mode. No backend configured."* / *"Payments are not available in local mode…"*
  are artefacts of my unconfigured server, not product copy.

---

## UNREACHED, and why

- **Everything behind an account** — saving, a populated library, publishing, realm placement, a
  signed-in fork, the Cartographer surfaces, `/account`. The walk is anonymous by law; I entered no
  credentials.
- **Any purchase.** Locked ("Available at launch") and out of bounds regardless.
- **A populated gallery.** My server has no Supabase, so `/gallery` renders *"0 public settlements —
  Be the first to publish one. Every shared dossier becomes a permanent page anyone can find."* I
  cannot distinguish a genuinely empty gallery from an unconfigured one; the empty state's copy is
  honest either way.
- **The production BUILD.** I measured a Vite **dev** server, which is the launch file's own recipe.
  Layout, copy, gates, tier rules, generation, pacing and fork ids are client-side and carry over;
  chunking, stale-deploy recovery and CSP behaviour are unmeasured.
- **F2's second arm** (two same-seed saves in one realm) needs an account.

---

## ⛔ NOTICED AND NOT WALKED — each specific enough to slot

1. **The anonymous draft survives a full reload, and a comment says it cannot.** After a generation,
   `page.goto('/create')` returned the same `settlement.id = s_bf70c5e4ef990562` and seed
   `mu9gjk9l000c8byg2`, while `src/main.jsx:127` states *"generated worlds are not persisted
   locally"* and `installStaleDeployRecovery`'s `hasWorkOnScreen` reasons from that premise. Slot:
   find the draft's real persistence seam and reconcile the comment — or the stale-deploy recovery is
   reasoning from a false one.
2. **"New Draft" after a sample fork does not bring the Founding Worlds strip back.** Two runs
   (`walk2-desktop`, `walk3-desktop` `B_newDraft: null`) could not reach a second fork through the
   visitor's own path; only a fresh context could. Slot: measure what "New Draft" leaves on screen
   and whether a second sample is reachable without a reload.
3. **The landing's "Save to Library / free account · keeps every draft" button was not reachable by
   its accessible name** in my driver (its sibling "Forge this exact town" CONFIRMED works — it
   forged Cnocby with the full rail). Slot: walk that one control for F4's silent-navigation shape.
4. **The `†` glyph is used as the feature bullet** before every Wanderer/Cartographer line on
   /pricing, with no footnote anywhere on the page. Slot: decide whether it is a check mark with the
   wrong glyph or a footnote with a missing target.
5. **"Access wars, religion, trade, the world!"** on /realm's Cartographer gate is the only
   exclamation mark on any walked surface and reads out of the estate's register. Slot: a copy pass
   on the realm gate's three lines.
6. **Literal ALL-CAPS in dossier content rather than CSS `text-transform`**: `FOUNDED`, `NOW`,
   `STILL RELEVANT TODAY` (World › History); `REQ`, `YOU`, `WORLD` (Summary › DM Summary); and
   `VILLAGE · 624 pop · road` in DM Summary where the dossier header sets the same fact with
   `text-transform: uppercase`. Slot: one convention for cased chrome labels, pinned by a walker.
7. **The `<header>` box is 22 px tall while its two buttons are 44 px** on the phone — the controls
   overflow their own header. Slot: check whether anything depends on the header's box height
   (sticky offsets, `scroll-margin-top`, the skip link's landing).
8. **`forkSeedFor` truncates a signed-in user id to 8 characters**
   (`src/data/sampleSettlements.js:168`). Two accounts sharing a UUID's first 8 hex chars fork the
   same world. Slot: decide the suffix width, or hash the whole id.
9. **The gallery's facet-hub routes** (`/gallery/at-war`, `/gallery/most-alive`,
   `/gallery/terrain/:v`, `/gallery/tier/:v`) and the share route `/world/:code` are public and were
   not walked. Slot: a second anonymous pass once a backend is configured.
10. **Seven public routes outside the ten steps were not measured** for floors, overflow or console:
    `/screen`, `/founders`, `/first-hundred`, `/roadmap`, `/covenant`, `/bounty`, `/about/guide`.
    Slot: extend the phone-floor sweep to the full `staticUrls()` enumeration that
    `e2e/phone-horizontal-overflow.spec.js` already derives.

---

## Receipts index

`$SP/lane-review-p-scratch/` — `walk*.mjs` (8 drivers), `walk*-{phone,desktop}.json` (raw
measurements), `text-desktop-*.txt` (per-step fold + body copy), and ~130 PNGs. The ones the table
cites by name: `forge-desktop-t00785ms.png`, `forge-desktop-t01443ms.png`, `forge-desktop-settled.png`,
`cap-desktop-r4.png`, `N-narrate-after-desktop.png`, `A-citycard-after-desktop.png`,
`I-account-guard-phone.png`, `J-notfound-{phone,desktop}.png`, `P-coach-phone.png`,
`02-landing-phone.png`, `09b-pricing-end-phone-full.png`, `fork-{desktop,phone}-1.png`.
