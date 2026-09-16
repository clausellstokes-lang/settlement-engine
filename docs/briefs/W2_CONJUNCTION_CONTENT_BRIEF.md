# W2 Implementer Brief — conjunction content multiplication (THE content wave)

Opus 4.8 ultracode implementer, Phase 5 W2, /Users/cstokes/Desktop/settlement-engine
(branch review-fixes-2026-07-08). You implement; the manager (Fable) reviews + commits.
BINDING context: docs/PHASE5_CONTENT_ARCHITECTURE.md (with the correction below) + the W-C5
cause-resolution lifecycle (src/domain/worldPulse/causeLifecycle.js) + this brief.

## THE ARCHITECT'S RULING (supersedes the content-architecture doc where they differ)
The doc advertises ~30 roles × ~12 situations. The BUILT engine emits a NARROWER key
(causeLifecycle.js:88 typedef, :256 makeEvent): `{ role, situation, causeClass, lifecycleStage }`
with **12 roles (NPC_ROLE_ARCHETYPES) × 2 situations (compromised-covert | compromised-revealed,
bearerSituation :165) × 14 causeClasses × 6 stages (attributed, re-caused, reformed, historicized,
exposed-public, re-adjudicated)** ≈ 2,016 naive / ~1,000–2,000 affinity-reachable conjunctions.
W2 AUTHORS AGAINST THE BUILT KEY ONLY. Do NOT widen bearerSituation, do NOT add situations, do
NOT chase the doc's phantom key space — unreachable content is waste. Patch the doc's key-space
paragraph to record the built reality (one small doc edit, cite this brief).

## TWO CONSTITUTIONAL LAWS
1. **GOLDEN LAW.** Do NOT touch the inline event headline/summary strings in causeLifecycle.js —
   they feed causeLifecycleEvents/news and are HASHED by worldpulse-golden-master.json. ALL new
   content lives in a DISPLAY-SIDE SIDECAR consumed at render time. Goldens must pass untouched
   (generator + worldpulse + pdf goldenViewModel). If you believe a transition string must move,
   STOP-AND-REPORT — do not regen goldens yourself.
2. **FIRST-PAINT LAW.** Headroom is 942 BYTES (budget 1,441,000). Thousands of lines of prose must
   NEVER reach the entry closure: the sidecar is imported ONLY from lazy dossier surfaces (the NPC
   card path is lazy). Do NOT add a manualChunks pin (the W4h leaf-pin lesson — it backfired);
   just keep every import edge inside the lazy dossier graph and verify:dist proves it. If the
   entry closure moves at all, STOP-AND-REPORT.

## Items

1. **The sidecar module** — `src/domain/display/causeConjunctionContent.js` (+ data tables beside
   it if cleaner). Pure, deterministic, tree-shakeable. Precedent: institutionVocabulary.js.
   Content keyed by the conjunction: `content[role][situation][causeClass][stage]` (sparse).

2. **The selection LADDER** — `conjunctionContent(key, seedId) → { line, tier }`, falling through:
   (role, situation, causeClass, stage) → (role, causeClass, stage) → (causeClass, stage) →
   the EXISTING generic floor (unchanged, stays as final fallback). Variant selection among a
   conjunction's 2–3 variants is a PURE HASH of (seedId = npc/settlement id, key) — no rng stream,
   no Date, byte-inert to the engine. Anti-repetition: two NPCs in one settlement with the same
   conjunction should prefer different variants (hash on npc id does this).

3. **CONTENT — the multiplication itself (the bulk).** Author specific content tier-by-tier:
   - TIER 1 (required): every AFFINITY-REACHABLE (role × causeClass) pair (consult
     roleCauseAffinity — skip never-attributed pairs) at (causeClass, stage) + (role, causeClass,
     stage) granularity, ≥2 variants for the high-frequency stages (attributed, exposed-public,
     reformed). The covert/revealed situation split applied where it changes the READ (covert =
     hints/tells/dramatic-irony; revealed = public reckoning/aftermath) — where it doesn't, one
     line serves both (the ladder handles it).
   - TIER 2 (as budget allows): full 4-part specificity for the ~dozen most dramatic conjunctions
     (e.g. priest × faith-cause × exposed-public; guard-captain × corruption × covert).
   VOICE: the established canon voice — plain, derived, concrete, no purple prose; each line must
   read as a CAUSAL RECEIPT a DM can speak aloud (who/why/what-now), consistent with the identity
   cards + institutionVocabulary register. Every line UNIQUE (no template-with-synonyms padding).
   Generate-then-review is fine; YOU review every line before including it — no raw dumps.

4. **Consumption seam** — wire the ladder into the existing NPC-card floor render (the
   compromiseLifecycle read-model path from projectCauseLifecycleOntoSettlement,
   causeLifecycle.js:493, rendered in the dossier NPC card). Replace the floor CALL with the
   ladder (floor remains the ladder's last rung). Touch nothing else in the card.

5. **Coverage-ladder test** — enumerate the full REACHABLE key space (12×2×14×6 minus zero-affinity
   pairs) and assert: (a) every key resolves to a non-empty line (ladder total), (b) report the
   tier distribution (how many resolve specific vs role-level vs class-level vs floor) as a
   snapshot the manager can read, (c) determinism (same key+seed ⇒ same line), (d) variant
   anti-repetition works. Plus a lazy-graph test or verify:dist confirmation that the sidecar is
   absent from the entry closure.

## Gates
Full battery: eslint / typecheck / domain-strict / build / verify:dist (budget 1,441,000 —
entry closure UNMOVED, cite the byte number) / goldens byte-identical (generator + worldpulse +
pdf) / tests/ui + tests/domain green. Report: the tier-distribution snapshot (the multiplication,
quantified), total lines authored, files + line counts, both laws confirmed (golden untouched,
entry closure byte-identical), the doc correction made, and anything STOP-AND-REPORTED.
