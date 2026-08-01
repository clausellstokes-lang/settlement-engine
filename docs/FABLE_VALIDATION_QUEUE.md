# FABLE VALIDATION QUEUE — post-exhaustion judgment ledger

## Owner order 2026-07-31: "If I run out of fable, I want you to seamlessly switch to
## opus 5. For all validations post fable weekly usage is up, write in your documents
## and instructions for an account that has fable usage to validate those that weren't
## and readjust instructions where appropriate."

## THE PROTOCOL (binding on any Opus-era session)
The standing model split (owner law): Fable = manage / architect / VALIDATE / survey;
Opus = verify + implement. When Fable usage is exhausted, an Opus 5 successor inherits
FULL standing authority immediately (do not wait for the owner; the 2026-07-18
continuity order applies, updated to Opus 5) and performs BOTH chairs — but every
judgment that the split assigns to Fable's validate/architect chair MUST be recorded
here as a row, so a Fable-capable account can re-validate later and readjust.

**What gets a row (judgment-density items only — not mechanical green gates):**
- Wave/slice ACCEPTANCE judgments (reading implementer reports, deciding a wave is done)
- Any NEW architecture decision beyond the frozen design corpus (the six DESIGN_* docs
  are Fable-authored and FROZEN — building from them needs no row; deviating does)
- Golden-shift adjudications and any re-record acceptance
- Soak/certification verdict INTERPRETATIONS (what the receipts mean, not that they ran)
- Tuning-band ratifications (highest density — every ratified band gets a row)
- Deferral/skip/block dispositions with product consequences

**Row shape:**
| date | item | Opus decision | evidence (commits/receipts/reports) | what Fable should re-examine |

## RE-VALIDATION PROTOCOL (for the Fable-capable account)
1. Read this queue oldest-first alongside DESIGN_REALM_DIRECTIVES.md Progress.
2. For each row: re-derive the judgment from the cited evidence; CONFIRM (mark ✓ with
   date), ADJUST (record the correction as a new Progress entry + fix forward — never
   rewrite the Opus-era row), or ESCALATE to the owner if the correction is owner-gated.
3. Readjust instructions where appropriate: if a class of Opus-era judgment shows a
   systematic lean, amend the relevant design doc's judgment block (vetoably) and note
   the amendment here.
4. Tuning rows get priority: re-examine ratified bands against the same receipts before
   any further tuning.

## THE QUEUE (empty at creation — all judgments through 2026-07-31 ~21:50 are
## Fable-validated; rows begin when an Opus-era session begins)

| date | item | Opus decision | evidence | Fable re-examination |
|---|---|---|---|---|
| 2026-07-31 | Golden-shift adjudication: npc-credibility dormancy `nc-b\|8\|one_month` re-recorded | ACCEPTED as a legitimate one-time shift caused by the wizard-news id fix (an `infowar_spy_exposed` beat, previously discarded, now counted by the golden's newsKinds histogram) | Commit 8d71a479; the projection was dumped with and without the fix on an isolated base worktree and diffed field-by-field: only `newsKinds` moved, tick/rollSummary/all four ledgers byte-identical | Re-derive the field-level diff from the commit's test-header account; confirm no ledger drift hides behind the histogram change |
| 2026-07-31 | Herald routing sections for the nine newly-flowing kinds | Eight war-doctrine kinds → `war`; `intel_transfer` → `trade` (rides the generosity obligation machinery) | Commit 8d71a479, heraldRouting.js; forced by the WHAT_PHRASES totality walker once rumor phrases landed | Re-file any kind whose door reads wrong in play; note `treaty_signed` FILES UNDER `events` in the Herald (impactKind `diplomacy` outranks kind by routing law) — decide whether bare `diplomacy` should re-route to `trade` or `war` |
| 2026-07-31 | `treaty_signed` upgraded to significance `major` (severity 0.55, score 66) | A dictated peace ends a war — on par with the climb-down (major/68); it previously graded notable/severity 0/score 0 by normalizeEntry defaults | peaceTerms.js signingBeat (wave-2 commit) | Confirm a signed treaty belongs in World Book majorHeadlines and the 240-cap major-arc rescue; downgrade if treaty spam emerges in long soaks |
| 2026-07-31 | Severity scale for the ten late-lane receipts | climb-down 0.6 · webwar mint 0.45 / raid+wrong-village 0.65 / abandon 0.4 / complete 0.5 · infowar lie 0.45 / spy 0.4 / intel 0.35 · treaty 0.55 — register anchored to the upswing exemplars (bust 0.6 major, boom 0.4 notable) | wave-2 commit; fixes "Severity 0%" cards and mildest-band rumor magnitudes | Re-examine against a lit-realm soak's rumor magnitude distribution; these are Opus-chosen bands, not measured ones |
| 2026-07-31 | Herald-doors architecture: buildHeraldFeed gains a READ-ONLY fourth source (campaign.wizardNews.entries) instead of widening the persisted impactDigest freeze | Display-layer completion of the module's own stated contract ("pulse + wizard-news records"); rejected the pulseKernel freeze-widening because it rewrites persisted per-tick pulseHistory content and grazes provenanceKernel's read of `applied.newsEntries` | heraldFeed.js + tests/components/heraldFeedSources.test.js (wave-2 commit) | Validate the lens rule (advance = `entry.tick >= latestPulse.tick`; movers receive the same worldState.tick the pulse record stores) against a multi-interval advance; confirm the persisted-digest road stays closed |
