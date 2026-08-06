---
name: ""
metadata: 
  node_type: memory
  title: VISION LANE V-N shipped — AI scope + content follow-ons
  date: 2026-07-20
  branch: claude/vision-n
  base: 5d9218c6
  tip: e017c1f2
  tags: 
    - vision-wave
    - interview
    - multi-hop
    - campaign-scope
    - handbook
    - dark-flag
    - ratchets
    - hazards
  status: complete-not-folded
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-20T18:45:06.626Z
---

# VISION LANE V-N — AI scope + content follow-ons (V-26a + V-26b)

The FINAL lane of the Vision Wave. Two lettered commits on `claude/vision-n`
(base 5d9218c6 = the folded composite tip; NOT folded, NOT pushed):
- **V-N (a) d99724a0** — interview follow-ons (multi-hop + campaign-wide scope)
- **V-N (b) e017c1f2** — handbook narrative rewrite, staged dark (tip)

## What shipped

### V-26a — Interview follow-ons (existed vs built)
Extends V-1's Interview (`supabase/functions/interview/*`, `src/lib/interview.js`,
`src/components/InterviewPanel.jsx`, `src/domain/ai/stateSlicers.js`). NO new edge
function, NO new EDIT_KIND, NO new billable feature — reuses V-1's whole gate stack
+ citation law.
- **Multi-hop**: each follow-up is a SEPARATE metered POST, re-grounded on a fresh
  bundle. Prior Q&A rides its OWN fence (`<<<INTERVIEW_PRIOR_EXCHANGE>>>`) BETWEEN
  the stable grounding prefix and the volatile question (cache ordering preserved),
  stripped + capped (last 6 turns, q≤500/a≤1200), data-not-instructions. New
  `buildPriorExchange` + `history` param on `buildInterviewPrompt`; `stripFences`
  now also strips the prior-exchange tokens. Empty history ⇒ first-hop prompt
  BYTE-IDENTICAL to V-1. Panel keeps a thread of successful hops; "Ask follow-up"
  / "New line of questions".
- **Campaign-wide scope**: `selectSlices({ scope:'campaign', campaignSettlements })`
  fans settlement-scoped briefs across the campaign's members (CAP 6), namespaced
  `kind@sid:sec` id + "Name — Section" title so a citation resolves to the right
  town; realm briefs compose once. `scope:'settlement'` (default) unchanged. Panel
  shows "This settlement / The campaign" toggle when a campaign is active.

### V-26b — Handbook narrative rewrite, staged dark
- Flag `handbookVoice` (default:false) in `src/lib/flags.js`. OFF ⇒ exact current
  handbook (byte-identical); ON ⇒ voiced draft. The ONLY eager cost of the lane.
- NEW lazy `src/components/howto/HandbookVoiced.jsx` — voiced header strings +
  QuickTab "why it works this way" concept essay in the covenant/chronicler
  register. Imported only by the already-lazy HowToUse ⇒ zero first-paint bytes.
- `HowToUse.jsx` forks the header + concept essay on the flag.
- **CLARITY CLAUSE honored**: numbered STEPS, the Reference lifeline, the billing
  FAQ, PowerTab, CompareTab are NOT voiced — plain in both states (mandated
  plainness stays plain; also keeps CompareTab's competitive claims claims-parity-safe).

## Receipts (verbatim)
- interview + interviewCampaignScope + aiAnalyst pins: **64/64**
- edgeFunctions dir: **528/528** · sessionGateCensus **18/18** (interview still the
  9th gated surface — census unbroken) · validate:edge OK (**59 files**, no _shared churn)
- handbookVoice + howToInversion + howToUseLivingWorld: **10/10** (no copy test weakened)
- components dir **158 files / 806** · copy contract **27/27**
- ratchets: errorCopy **2/2** (51/20, unraised), rawColor **12/12**, deepCraftKillList
  / domainAnyCast / mapPalette green
- domain-strict **0** (bare `node scripts/check-domain-strict.mjs`) · full tsc **0** ·
  eslint **0** on touched files · NUL scan CLEAN (all files)
- verify:dist **174/174** (surveyorPanelsLazy confirms interview transport OFF entry closure)
- **CLOSURE 1,036,669 ≤ 1,040,000, headroom 3,331; lane eager Δ ≈ +270 B** (flag
  description in flags.js + `errors.interviewUnavailable` key — both eager; all V-26a
  + HandbookVoiced are server-side/lazy)

## HAZARDS BANKED
1. **errorCopy ratchet is name-sensitive** (`tests/lint/errorCopyBaseline.test.js`):
   the detector matches `set[A-Za-z]*(Error|Notice)('literal')` — so `setResult({error:'x'})`
   is INVISIBLE but renaming to a `setPendingError('x')` state setter TRIPS it (+1 file,
   +1 count, baseline 20→21 / 51→52). CURE = route through `t('errors.*')` (the quote is
   not adjacent to the paren) — NOT gaming the setter name. This bit V-26a's InterviewPanel
   rewrite; fixed via `t('errors.interviewUnavailable')`.
2. **domain-strict + helper-mutated arrays**: an array pushed ONLY through a helper
   (not inline literals) infers `any[]` (TS7034/7005) and reddens domain-strict.
   CURE = annotate `/** @type {Slice[]} */` at the declaration. (`campaignSlices` needed this.)
3. **rawColor ratchet exemptions** (`tests/lint/rawColorLiteral.test.js`): `swatch['#HEX']`
   computed-member form is EXEMPT, and a `linear-gradient(...,#hex...)` string is NOT a
   pure-hex literal (only `^#hex$` counts). So reusing the original conceptIntro's dark
   gradient + swatch['#C8B098'] in a NEW file adds ZERO — no gaming needed.
4. **selectSlices consumers** (interview.js, aiAnalyst.js, surveyorWrite.js, tests):
   new params (`scope`, `campaignSettlements`, and `history` on askInterview) added with
   safe defaults ⇒ default 'settlement' path byte-identical; the aiAnalyst pins PROVE it.
5. **Client flag mechanism** = `src/lib/flags.js` FLAGS registry (default:false = dark).
   Tests flip via `setFlagOverride(name, true)` (localStorage); `flag()` resolves
   url → localStorage → env → registry default. This is the "one-click" flip surface
   (URL `?flag.handbookVoice=true` / dev flag panel) — no bespoke toggle UI needed
   (matches warEconomySurfacing / advanceWorkerParanoia precedent).

## JUDGMENTS (vetoable)
- **V-26b voiced surface = header + concept essay ONLY** (the narrative/voice prose);
  steps/Reference/FAQ/PowerTab/Compare left plain per the clarity clause + claims-parity.
  Veto path: expand HandbookVoiced.jsx to cover PowerTab intros / Compare framing if the
  owner wants a broader rewrite.
- **Multi-hop = client-driven separate metered calls** (each hop a fresh POST re-grounded),
  NOT a server-side loop. Satisfies "EVERY hop metered" trivially via the existing belt.
- **Campaign cap = 6 settlements** (MAX_CAMPAIGN_SETTLEMENTS) to bound bundle size vs the
  128 KB edge body cap. Veto path: raise the const.

## DEFERRALS (documented, not bugs)
- A dedicated `'interview'` billable feature stays a V-1 follow-on (unchanged); multi-hop
  meters under the existing `'analysis'` feature — a distinct feature needs an owner-gated
  migration to `spend_credits`' feature CASE.
- V-26b did not voice PowerTab / CompareTab prose (clarity + claims-parity) — recorded.

## Owner-gated residue (unchanged)
Lane is NOT folded, NOT pushed. The `handbookVoice` flip is the owner's taste call. Keys/
pricing placement for the Interview follow-on ride existing metering (owner confirms).
NOTE: a PRE-EXISTING foreign `stash@{0}` (On analytics-intelligence-layer) sits in this
worktree — it is the owner's WIP on another branch; left untouched (do not drop it).
