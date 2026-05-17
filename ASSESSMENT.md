# SettlementForge — Assessment

## What it is
A constraint-driven D&D settlement simulator. Outputs a printable PDF dossier; offers a procedural fantasy-map workspace and an optional AI narrative layer. Differentiator (per your own copy): **"Most generators roll on a table. This one simulates."** Real moat — if a DM can feel the difference inside 60 seconds.

---

## Code

**Scale.** ~76,000 lines JS/JSX. ~15 generator files + 18,000 lines of data tables (`institutionalCatalog.js` 2350, `namingData.js` 4037, `supplyChainData.js` 1571). Real engine, not a weekend project.

**Architecture.** 14-step pipeline (`steps/index.js`): resolve → assemble → subsume → cascade → isolate → economy → power → factions → population → narratives → assemble. PRNG context with replay seed and `onStep` callback. Strangler-Fig refactor of legacy `generateSettlement.js` is in flight — mature move.

### Strengths
- Three-layer separation (data → generators → presentation) genuinely respected.
- Storage abstraction (`saves.js` Supabase + localStorage fallback) — same async API regardless of backend. The no-op cross-tab lock workaround in `supabase.js` is sharp debugging.
- Auth orthogonality: `tier` (anon/free/premium) × `role` (user/developer/admin). Lets you ship internal tools without polluting the user model.
- PDF chapter ordering (Cover → ToC → Overview → TonightAtTheTable → people → power → systems → background → external → AI Appendix) is deliberately authored, not a section dump.
- mapBridge.js typed RPC over postMessage is the right abstraction for the iframe boundary.

### Concerns
- **2.1 MB SettlementsPanel chunk.** Largest thing on the wire, gates the most-used view. Tabs already separate — lazy-load each. First-paint will drop dramatically.
- **Zero tests in 76kloc.** With 14 cascading pipeline steps where step 8 reads outputs of step 5, regressions hide. A snapshot suite seeded with fixed PRNG is hours of work and immortalizes engine behavior.
- **No TypeScript.** Defensive `?.` and `||` everywhere — paying the cost without the benefit. Data-table types alone would catch a class of bugs that's hard to express in JS.
- **FMG fork.** 2400+ lines of patches in `public/map/main.js`. Every Azgaar release = manual reconciliation. Either commit to hard-fork or upstream the bridge hooks.
- **Bus factor of 1.** Comment style and plan-file vocabulary read as one mind talking to itself over time. Not unkind to a second contributor — but no second contributor exists.
- **13 store slices** with cross-slice dependencies. When Phase C lands, you'll want one place to assert the convergence loop terminates and produces sane modifier values.

---

## Product

**Thesis is correct.** "Constraint-driven coherence" is the actual shape of the value. A struggling frontier town with high criminal priority producing a corrupt guard, underfunded walls, black market, and aligned NPC secrets *is* meaningfully different from rolling tables. DMs who get it will pay. Moat is the data — 18kloc of interlocking institution/resource/stress/trade tables.

**Pricing undersells.** $4.99/mo + $5–20 credit packs is fair-to-cheap. DMs spend $30+/yr on D&D Beyond, $20 on a source book, $50–150 on a campaign module. You're closer to a published gazetteer than a generator. Room above $4.99/mo if Custom mode genuinely unlocks the worldbuilder workflow.

### Three growth blockers
1. **Onboarding.** First-time anon user faces Quick vs Advanced before knowing why constraint-driven matters. Default to one-click "Generate a market town" demo on first visit. Your philosophy copy lives in How-To, which most won't navigate to.
2. **AI narrative layer is buried.** Per your copy the purple button is the hook. That's your strongest demo against "just ask ChatGPT to make a town." Show it on first generation, even one free pass.
3. **PDF is the deliverable but not the showcase.** Landing pages for tools like this lead with the map screenshot. Your moat is the dossier. A real PDF page on the landing (NPC cards, hooks, supply-chain diagram) communicates "session-prep-ready" in a way the map can't.

### 5-phase plan vs reality
- **Phase A** (tab consolidation 8→5) — pure UX win.
- **Phase B** (settlement editor) — closes a critical gap. DMs WILL want to tweak outputs without regenerating.
- **Phase C** (asymmetric relationship dynamics) — engine's depth differentiator, highest regression risk.
- **Phase D** (Quick/Advanced/Custom + premium gate) — lines up monetization correctly.
- **Phase E** (map viz) — polish, not value.

Plan misses: migration story for existing saves when settlement shape changes in B, feature flags so C doesn't ship big-bang, bundle-size cliff getting worse with each phase.

---

## Recommended next 4 steps, in order

1. **Snapshot tests for the engine** (~2 days). 10 seeded configs, freeze outputs, run on every commit. Buys freedom to refactor.
2. **Code-split SettlementsPanel** (~1 day). Tabs are already separate components; lazy-load each.
3. **Onboarding demo on landing** (~2 days). One-click generate → tour dossier → tease AI narrative.
4. **Then** start Phase A.

Address the structural risks (bundle size, no tests, fork divergence) **before** Phase C lands, not after — they all get worse with growth.
