---
name: ""
metadata: 
  node_type: memory
  type: project
  date: 2026-07-22
  branch: claude/pronoun-links
  commits: 
    - 41f31d7e
    - e6a22408
  base: composite-r4 @ 0fc79125
  tags: 
    - entity-links
    - pronoun
    - discourse-kernel
    - generate-narrative
    - byte-stability
    - finite-semantics
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T08:24:38.356Z
---

# PRONOUN-LINK feature shipped (owner order 2026-07-22)

Owner verbatim: "If any pronoun is ever mentioned, then it should link to that
settlement or that appropriate card in that settlement." Built on branch
`claude/pronoun-links` off composite-r4 @ 0fc79125. Two commits: tier-1 render
mechanism (41f31d7e), tier-2 AI-wrapper contract (e6a22408). NOT merged, NOT
pushed, NOT deployed.

## Why (the shape of the solution)
Pronoun links reuse the existing `⟦entity:id|name⟧` EntityLink web. The ONE new
primitive is a **verbatim/pronoun token** — needed because both EntityLink (web)
and EntityRef (pdf) render `entry.currentName` for a resolved id, so a resolved
`⟦entity:npc.jon|he⟧` would print "Jon", not "he". The pronoun token renders its
wrapped word verbatim while still linking to the same card.

## The token grammar (how to apply)
- Name link (unchanged): `⟦entity:<id>|<displayName>⟧` → renders live currentName (rename-safe).
- Pronoun link (NEW):     `⟦pronoun:<id>|<word>⟧`      → renders `<word>` verbatim, links to `<id>`.
- Distinct PREFIX, not a third field — chosen so `ENTITY_REF_PATTERN` and every
  existing token/golden/importer stay byte-untouched. `PRONOUN_REF_PATTERN` +
  combined `ANY_REF_PATTERN` added in `src/lib/entityRefTokenizer.js`.
- Tokenizer segment: a pronoun ref carries `verbatim:true`; a name ref keeps its
  EXACT prior shape (no new key) — so existing `toEqual` tokenizer tests pass.
- Renderers: `EntityLink`/`EntityRef` take a `verbatim` prop → `label = verbatim
  ? fallback : currentName`. aria-label still names the destination entity (E-I).
  ProseParagraph/ProseText forward `seg.verbatim`.

## Tier 2 (AI narrative) — the real value surface
`entityRefWrapper.ts` (generate-narrative edge fn):
- `collectPronounResolver(settlement)` builds name→id + linkable-id set mirroring
  `buildDossierEntityIndex` (npc / faction incl. `faction.id` alias / neighbour /
  the settlement itself).
- `normalizePronounTokens` validates each clerk-emitted anchor: known id kept
  (idempotent), known NAME rewritten to stable id, UNKNOWN anchor unwrapped to
  the bare word (fail-open). Server never scans prose for pronouns, never invents
  a link target (FINITE-SEMANTICS holds).
- kept pronoun tokens are frozen during name-wrapping (EXISTING_TOKEN now matches
  entity|pronoun). `secret.what` is SANITIZED (all tokens stripped) — the editable
  textarea must stay raw even if the clerk over-marks.
- `inventionSignal.ts` FENCE strip covers pronoun tokens too.
- Prompt contract in `prompts.ts` (PRONOUN_LINK_CONTRACT, appended to
  PRESERVATION_RULES) SHIPS INERT — takes effect only when the OWNER DEPLOYS the
  edge fn. Clerk anchors pronouns by NAME; the wrapper resolves+validates.
- ⚠️ deno `check:edge` is ENVIRONMENTALLY BLOCKED in this worktree (npm:@types/node
  resolution — reproduces on the UNTOUCHED base graph with & without --frozen).
  My wrapper type-checks CLEAN in isolation and adds ZERO imports. deno lint:edge
  is non-blocking; my `any`/std-import additions match the file's convention.

## ⚠️ Tier 1 (deterministic producers) — NO producer was wired (STOP+reported)
The render mechanism above IS the tier-1 render-layer, built fully and DORMANT
(no deterministic output carries tokens → all same-seed goldens stay token-free,
byte-identical). But NO deterministic PRODUCER was wired, because every candidate
is byte-blocked — per the brief's own "STOP on a pinned-output change":
- **Discourse kernel** (`discourseKernel.js`): emits ZERO authored pronouns —
  only finite connectives + BYTE-VERBATIM recorded headlines. Its goldens pin
  `text == connective + ' ' + recorded`. Pronouns live only inside opaque
  headlines (a truth surface); tokenizing them needs prose-scanning (forbidden)
  and rewrites recorded truth. Byte-stable-by-EXCLUSION, not a target.
- **worldPulse/events producers** (npcGrowthKernel:701, npcLadderContest:804/829,
  rulingPower:374/407, factionResponses:278…523, settlementLifecycle:524) DO hold
  the antecedent id in scope — but they emit **wizardNews headlines/narratives**
  that flow into MANY non-tokenizer surfaces (news panels, crier, chronicler's
  letter plain-text export, and the discourse kernel which carries them verbatim)
  AND are byte-golden-pinned. Wiring them needs (a) golden re-baseline (owner-
  gated) + (b) tokenizer-upgrading every wizardNews render surface. Owner-gated
  follow-on; the mechanism drops in the moment that's authorized.
- **dossierViewModel viability "it/its"** (settlement self-ref): the `summary`
  string is golden-pinned (goldenViewModel/viewModelParity/voiceMechanics). STOP.
- Generator prose (`npcData.js` pairProse, `npcGenerator.js` crime) uses PLURAL /
  cross-referential pronouns ("either of them") — un-wrappable to ONE antecedent —
  and lands in the excluded editable `secret.what`.

## Byte-stability verdict (CONFIRMED)
First-paint closure = **1,039,961 bytes** on BOTH my build AND a clean rebuild of
the untouched base 0fc79125 (measured apples-to-apples in the money-wave worktree).
**Δ = 0.** The brief's baseline figure (1,039,956) is stale/cross-environment drift
of 5 bytes — NOT a regression. My src edits live only in lazy dossier/pdf chunks;
no marker (`pronoun`/`verbatim`/`tokenizeProse`) appears in any of the 7 eager
closure files. Discourse-kernel goldens UNTOUCHED (never modified the kernel).

## Gate receipts (all CONFIRMED green on committed HEAD e6a22408)
tsc(full) clean · domain-strict 0/ceiling 0 · eslint(touched) clean · NUL 0 ·
copy+lint families 282 · focused entity-ref 68 · verify:dist 227 (closure Δ=0) ·
deno test:edge 456. check:edge env-blocked (pre-existing @types/node); wrapper
isolated `deno check` clean.

## Hazards for the next session
- Adding a THIRD token mode: extend `ANY_REF_PATTERN` in entityRefTokenizer AND
  `EXISTING_TOKEN`/`ANY_TOKEN_DISPLAY`/`PRONOUN_TOKEN` in entityRefWrapper.ts AND
  the `FENCE` in inventionSignal.ts — four separate hardcoded copies of the fence.
- The pseudo-locale system also uses `⟦…⟧` brackets (`⟦PARTIAL⟧`, localeParity.test)
  — safe: the token pattern requires the `entity:`/`pronoun:` prefix + a pipe.
- Wiring any deterministic pronoun producer is a golden-re-baseline + multi-surface
  tokenizer-upgrade job → OWNER-GATED (behavior shift). Do not do it unilaterally.
- The inert prompt (PRONOUN_LINK_CONTRACT) lights up only on OWNER DEPLOY of the
  generate-narrative edge fn.
