---
name: content-gt-final-shipped
description: "CONTENT-GT-FINAL (THE BIG CONTENT WAVE) — all six taste-approved charges BUILT on claude/content-gt-final; supersedes both parked content branches as the stack's tip; PARKED"
metadata:
  node_type: memory
  type: project
  originSessionId: 4e5bd424-21ab-4307-ba41-bd048bb9061e
---

THE BIG CONTENT WAVE — the taste-approved completion of the dossier/naming content program
(task #27's endgame), built 2026-07-18 on `claude/content-gt-final` (base = the parked
CONTENT-GT-DOSSIER tip `577179fb`; this branch REPLACES both parked content branches as the
content stack's tip in the composite). **PARKED — no fold/PR/deploy/merge.** The verified-after
ledger lives in `docs/GENERATION_TIME_SHIFT_MAP_DOSSIER.md` §CONTENT-GT-FINAL on the branch.

**Commits (in order):** `56e3203f` AMENDMENT B casing pass (capFirst on EXACTLY the 13
sentence-start `${govFaction}`/`${topFaction}` sites — the capitalised-"The" fallback is the
site marker; NOT the taste-doc's estimated 9) · `3ef2abd7` AMENDMENT A faction de-clunk
(descriptor-SWAP first from a DEDUP-ONLY widened pool inside factionDedup.js — NEVER widen
powerData.FACTION_DESCRIPTORS, its per-settlement retry loop is draw-count-VARIABLE; adjectival
PREFIX as last resort because any true suffix stacks a second collective; banned-stack guard;
clunkers structurally impossible) · `48211f56` Charge 1 history-event descs (58 banked variants
recovered from the brave-babbage scratchpad, wired via historyData.historyDescription + fnv;
seed rides `config._seed` stamped by generateNarratives/regenHistoryPipeline) · `9ebb4c62`
timelineVariety timeout (pre-existing wall-clock flake, PROVEN at base in a temp worktree) ·
`e39076e0` Charge 3 NPC pools (positives 30→45 + npcBank NPC_TEMPERAMENTS LOCKSTEP mirror;
SPEECH_PATTERNS 20→30; NPC_WANTS 4→8/cat; STRESS_ECONOMIC_EFFECTS desc+tension 1→3 via
pairProse — pure fnv on the directed pair key, archetype OBJECT IDENTITY preserved for the ===
consumers) · `f3b0e129`+`d656d25f` Charge 2 institution descs EXHAUSTIVE (all 301; originals
byte-identical; NEW exhaustiveness ratchet: every catalog institution w/ a desc MUST have
variants) · `badd5291` Charge 4 vignettes (probes made POOL-ROBUST FIRST, then STRESS_DESCS
4→6×15 + STRESS_NOTES 1→3×15 draw-free; both tables moved to data/narrativeData.js for the
max-lines ratchet, STRESS_DESCS re-exported) · `23c77444` shift-map ledger.

**Gotchas a successor needs:**
- ⚠️ eslint max-lines is a PER-FILE ratchet at prior size: historyGenerator capped at 883,
  narrativeGenerator at 905 — new content in capped generators goes to a src/data leaf +
  re-export (src/data is exempt).
- ⚠️ An institution can arrive carrying ANOTHER tier's catalog desc (village w/ the hamlet
  'Dairy farmer' text): the assembly variant pool is `[arrivedDesc, ...variants]` — any pool
  membership assertion must accept any tier's canonical for that cat|name.
- The 15 new positive traits carry NO TRAIT_ALIGNMENT/AGGRESSION weights (leaf contract:
  absent ⇒ 0; the leaf is first-paint-eager) — weighting is an owner-gated follow-on.
- Deferred (recorded in the shift map): NPC neg/neutral traits (content-branch hazard),
  NPC_FACTION_GOALS (the /grain/g literal-replace hazard), NPC_WANTS name mislabel (flagged).
- The full-realm composeInstantWorld tests + timelineVariety budget loop need the 120s
  golden-master timeout on loaded runners (both pre-existing wall-clock, not correctness).

**Park law state:** goldens NOT re-recorded; the red set at completion = exactly
generatorGoldenMaster (whole-settlement hash over grown prose). The structural-diff proof
(base-vs-tree over the 187-row grid, comparator in the session scratchpad) shows ONLY prose
paths move — 18 distinct display paths, zero structural/numeric.
