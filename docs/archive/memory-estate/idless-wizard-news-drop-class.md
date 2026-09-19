---
name: idless-wizard-news-drop-class
description: The silent id-less wizard-news drop class — 3 modules / 9 receipt kinds narrated into a void; fixed + guarded 2026-07-31
metadata: 
  node_type: memory
  type: project
  originSessionId: d93acdaf-1b3e-47b1-b554-27e20fc872f7
  modified: 2026-08-01T06:07:11.463Z
---

⚠️⚠️ **THE SILENT ID-LESS DROP.** A world-pulse mover that authors a wizard-news receipt
WITHOUT an `id` has its beat discarded **twice over**, silently:
`normalizeEntry` returns null on `!entry?.id` (`src/domain/region/wizardNews.js`), and
`appendObservedWizardNewsEntries` pushes only id-carrying entries into the audit receipt
sink. So the subsystem fires, narrates NOTHING to any reader / the Herald / a soak
receipt, and every downstream reading records an honest zero.

**Why it hid for the modules' whole life:** every existing pin read `out.newsEntries`
DIRECTLY off the mover. The drop happens ONE SEAM LATER, inside the kernel's append. A
mover test can be fully green while the subsystem is narratively dead.

**Members found 2026-07-31 — 4 modules / 10 kinds, all fixed in one change on
`claude/composite-r4`. The brief named only the first two:**
- `momentum.js` — `climbDownNews` → `momentum_climb_down`
- `supplyWebWarfare.js` — `mintNews`/`raidNews`/`abandonNews`/`completeNews` → 5 kinds
  (`webwar_campaign_minted`, `webwar_raid`, `webwar_wrong_village`,
  `webwar_campaign_abandoned`, `webwar_campaign_complete`)
- `informationStatecraft.js` — **found by the new guard**, which threw on a dormancy
  golden the moment it was added: `infowar_lie_exposed`, `infowar_spy_exposed`,
  `intel_transfer`
- `peaceTerms.js` — `signingBeat` → `treaty_signed`. **Found by a subagent census, NOT by
  my static scan and NOT by the guard**, because no existing test drives a treaty mint.
  So EVERY treaty this engine has ever signed was narrated into a void. It also carried
  `parties` instead of `settlementIds`, so an id alone would have addressed it to nowhere;
  it needed both.

⚠️ **DETECTOR LESSON — my first static scan MISSED peaceTerms.** It required an object
literal carrying `headline:` AND (`significance:` OR `score:`). `signingBeat` sets neither,
so it scanned clean. **Detect on `headline:` + `kind:` alone** and disposition the hits by
hand. The broad scan yields ~11 extra hits that are all legitimately fine: outcome and
candidate factories (`failedReturnOutcome`, `strategyCandidate`) that mint ids downstream,
and display projections (`chronicleGraph`, `chronicleReadModel`, `auspice`).

**The cure (habitat removal):** `assertAuthoredEntriesCarryIds` in `wizardNews.js`, called
from `appendObservedWizardNewsEntries`. Test-gated (`NODE_ENV==='test'`), pure read, the
`residueStripGuard.js` posture — so it can only surface as a test failure, never as a
determinism change. ⚠️ It is deliberately on the **authoring** seam, NOT in
`normalizeEntry`: normalizeEntry also runs over PERSISTED save data on every read, where
degrading a malformed row is the intended fail-closed posture.

**Why:** this is the same shape as [[writer-reader-payload-spelling-class]] — a producer
and a consumer disagreeing on a field, invisible to every in-memory test of the producer.

**How to apply:** when adding ANY new wizard-news author, mint
`wizard_news.${tick}.<slug>.<stableParts>` via `stablePart` from
`worldPulse/stablePart.js` (a true dependency-free leaf, safe to import anywhere).
Include enough parts that two beats of the same kind cannot collide in one tick —
`appendWizardNewsEntries` dedupes by id through a Map, so a collision SILENTLY MERGES
two distinct beats. Derive the parts from the emitting loop's own uniqueness key (e.g.
the `intelTransfers` ledger key is `intel.<seller>.<receiver>.<subject>.<tick>`, so all
three ids are required).

⚠️ **Wrappers and projections are the false positives**: `roadsBeat` (roadsKernel) and
`steadingNews` (settlementLifecycleKernel) mint the id inside the wrapper, and
`chronicle.js` / `generateWorldBook.js` PROJECT the feed rather than author into it. The
class boundary is exactly "flows into `appendObservedWizardNewsEntries`".

⚠️ **THE GUARD IS A LOWER BOUND, NOT A CENSUS.** It only fires on paths a test actually
drives, so it caught `informationStatecraft` and stayed silent on `peaceTerms`. Worse, a
guard added while an unfixed member remains is a LANDMINE: the next test that touches
treaties would have thrown. Pair the guard with a source census in the same change.

⚠️⚠️ **`climbDownNews` HAS TWO CALLERS** — `momentum.js` (the organic crack) and
`realmVerbExecution.js` (the DM's `FORCE_RECONSIDERATION` verb) — and both can price the
SAME (actor, target) on the SAME tick. A naive `(actor, target)` id collides and the feed
merges them, losing a receipt. Cured by an `origin` segment (`'crack'` / `'forced'`).
**When minting an id, grep for EVERY caller of the author function**; per-tick uniqueness
inside one loop is not uniqueness across callers.

⚠️ **TWO walkers that look like they'd catch this both have the same blind spot**:
`tests/lint/heraldRouting.walker.test.js` (routing totality) and the WHAT_PHRASES/
impactKind walkers source-scan only `impactKind: '<lit>'` and `candidateType: '<lit>'`.
Every producer here writes `kind: '<lit>'` and NO impactKind, so all of them are invisible
to both walkers. Consequence: the 9 kinds fall to the Herald `events` catch-all and, until
2026-07-31, would have printed raw engine slugs ("webwar campaign minted") into
player-facing rumor prose via `whatPhrase`'s de-underscore fallback. Phrases were added to
`WHAT_PHRASES` in `src/domain/display/settlementRumors.js`; the ROUTING is still
unfiled and owner-gated.

**How to apply:** giving a dropped receipt an id is never a display-only change. It goes
live on `rumorNetwork` (which seeds PERSISTED rumors, gated on `entry.id`), the 240-cap
major-arc rescue, the World Book chronicle, and the soak observation at once.

**STATE 2026-07-31: COMMITTED, owner-authorized.** Two pathspec commits on
`claude/composite-r4`: `8d71a479` (ids ×10 kinds, authoring guard, inverted pin,
routing, rumor phrases, golden re-record; body carries the ATTRIBUTION CORRECTION for
the two files twin commit `1aa98909` swallowed) and `266765e0` (severity on all ten
authors, treaty upgraded to major/0.55/66, buildHeraldFeed's missing wizard-news
source wired + pinned by tests/components/heraldFeedSources.test.js, first five
Opus-era rows in docs/FABLE_VALIDATION_QUEUE.md). Each isolated-worktree gated: lint 0;
20,670 / 20,674 passed; every red reproduced at bare base without my files.

**DECLARED ONE-TIME SHIFT:** same seed, same world, but soak receipts now COUNT receipts
they used to discard (`moverCounts` +knowledge/+war, `postApplyReceiptCount`,
`arcCounts.destructive`, `firstResultSha256`). One golden re-recorded WITH cause:
`npc-credibility-dormancy-golden.json` key `nc-b|8|one_month` only, from a single
`infowar_spy_exposed` beat; attributed by dumping the projection with and without the fix
and diffing field by field (tick, rollSummary and all 4 ledgers unchanged, so D-2 dormancy
is intact). `nc-a`/`nc-c` byte-identical.

**Formerly-deferred gaps CLOSED @ 266765e0 + bbac6276 (owner order, "do all the
remaining work"):** buildHeraldFeed reads `campaign.wizardNews.entries` as a fourth
read-only source (advance lens = latest pulse tick; the persisted-impactDigest widening
was REJECTED — it rewrites pulseHistory content and grazes provenanceKernel); all ten
authors set `severity`; `diplomacy` re-filed `events`→`trade` so both of the treaty
beat's routing keys agree (KIND_SECTION divergence recorded); the kind-only residual
census `KNOWLEDGE_FAMILY_RESIDUAL_KINDS` (7 entries + 3 executed exclusions) sits beside
the impactKind list; the panel's reasons pills wrap. The ONE item left to another lane:
the twin session's own reds (`applyAutoplacement` walker arming, docCounts mig-193,
any-cast rows in their new files) — their live wave, their dirty amendments fix them.
Program PUSHED to origin 2026-08-01 (owner-ordered): `018e4119..0630633b`, 71 commits
fast-forward, carrying this program's three commits plus the twin lane's batches. The
pre-push hook runs the FULL suite in the WORKING tree, so a push from a tree holding
another session's WIP fails on their reds — the successful push waited for the twin's
batch-2 landing and a clean tree.

See also [[self-referential-pin-class]], [[minifold-tree-is-live]],
[[wizard-news-id-token-skews-mover-family]], [[legibility-law]], [[news-address-law]].
