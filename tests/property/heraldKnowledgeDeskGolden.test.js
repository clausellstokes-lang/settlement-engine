/**
 * heraldKnowledgeDeskGolden.test.js — THE NON-OMNISCIENT HERALD GOLDEN OF THE KNOWLEDGE DESK
 * (FP IN-5, commit 1; J-INF-6, J-INF-7; docs/DESIGN_FP_ARCH_IN.md §2 and §4 IN-5).
 *
 * The `belief_misjudgment` refile is not dark-safe: a Full Simulation realm records beliefs
 * (`infoMode: 'full'`), so the kind's beats reach its Herald, and moving their desk changes what
 * a reachable, already-supported realm shows. The goldens-first discipline: the Herald of such a
 * realm was captured BEFORE the routing table moved (at the clean base 57b52b510, through the
 * signed door, record docs/shift-records/2026-09-24-in5-herald-knowledge-desk.json), and this
 * suite holds it byte-stable AFTER, with the one-time shift recorded as exactly the declared set.
 *
 * Capture/refresh (the door refuses without a signed record naming this surface):
 *   GOLDEN_SHIFT_SIGNED=docs/shift-records/<record>.json UPDATE_GOLDEN=1 npx vitest run tests/property/heraldKnowledgeDeskGolden.test.js
 *
 * @enforced-module src/domain/realm/heraldRouting.js
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { buildHeraldFeed } from '../../src/components/map/heraldFeed.js';
import { EXACT_SECTION, SECTION_OF } from '../../src/domain/realm/heraldRouting.js';
import {
  advanceReaderCampaign,
  composeReaderRegion,
  READER_CORPUS_ROSTER,
} from '../../scripts/review/readerCorpus.mjs';
import { recordGolden } from '../helpers/goldenRecordDoor.js';
import { HERALD_DESK_GOLDEN_ROWS, heraldDeskManifest, heraldDeskProjection } from '../helpers/heraldDeskGolden.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MANIFEST = join(ROOT, 'tests/fixtures/herald-knowledge-desk-golden.json');
const DEPS = Object.freeze({ READER_CORPUS_ROSTER, composeReaderRegion, advanceReaderCampaign, buildHeraldFeed });

/**
 * THE DECLARED REFILE SET — the one-time shift this golden records. The information program's
 * routed beats re-filed from the interim `war` desk, and `belief_misjudgment` re-filed from
 * faith (J-INF-6). Codepoint-sorted.
 */
const REFILED = Object.freeze(['belief_misjudgment', 'false_accusation', 'lure_sprung', 'plant_took', 'sweep_launched']);

/** @param {string} id @returns {string} the routing kind a wizard-news id names, or '' */
const kindOfNewsId = (id) => (/^wizard_news\.\d+\.([a-z0-9_]+)\./.exec(id) || [])[1] || '';

describe('the knowledge desk — the non-omniscient Herald golden (captured first, byte-stable after)', () => {
  if (process.env.UPDATE_GOLDEN) {
    it('captures the Herald of the Full Simulation realm through the signed door', async () => {
      const projections = [];
      for (const row of HERALD_DESK_GOLDEN_ROWS) projections.push(await heraldDeskProjection(DEPS, row));
      recordGolden({ surface: 'herald-knowledge-desk-golden', path: MANIFEST, produce: () => heraldDeskManifest(projections) });
      expect(projections.length).toBe(HERALD_DESK_GOLDEN_ROWS.length);
    }, 240_000);
    return;
  }

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};

  it('the manifest exists and closes at its captured row count', () => {
    expect(existsSync(MANIFEST)).toBe(true);
    // 2 fixed keys + 241 items, captured at the clean base (the enroll record predicted 243).
    // 243 → 366 at the Herald lens U2's pick (FP-31, 2026-09-24): the feed keeps its newest 52 weeks whole and
    // caps only beyond them, so the year-one desk carries the entries the bare 240 cap used to drop.
    // 366 → 367 at the treaty-voice pick (FP-28, 2026-09-24): a peacetime pact's default beat now speaks
    // (wizard_news.39.treaty_default_detected joins the year-one desk).
    // 367 → 400 at the urban band (ODQ §934.86, 2026-09-30; record docs/shift-records/
    // 2026-10-01-urban-band-herald-rows.json): fuller rosters feed the year-one desk 33 more items.
    // 400 → 383 at J33, the Warden's Lodge census (2026-10-01, record docs/shift-records/
    // 2026-10-01-urban-band-warden-census-herald.json): the realm's one lodge town re-deals the year's news.
    // 383 → 379 at PACT-ANSWER U1's pick (FP-42, ODQ §934.89 FP-46, 2026-10-02; record docs/shift-records/
    // 2026-10-02-pact-answer-fp42-herald-desk.json): an unlearned appetite reads neutral, four refused
    // sheets sign as amendments, and the year downstream follows (381 → 377 items).
    // 379 → 377 at PACT-COMPLIANCE U1's pick (FP-44, ODQ §934.89 FP-46, 2026-10-02; record docs/shift-records/
    // 2026-10-02-pact-compliance-u1-strain-band.json, re-derived at the composed point): the pact strain band
    // lifts the realm's one gathering war storm at weeks 41 and 42, so two tempo beats leave (377 → 375 items).
    // 377 → 387 at PACT-COMPLIANCE U2's pick (FPQ-75, ODQ §934.89 FP-46, FP-54, 2026-10-02; record docs/shift-
    // records/2026-10-02-pact-compliance-u2-stream-carry.json, re-derived at the composed point): a stream clause
    // now moves grain between soak-c and soak-d, ten relief beats join and the tempo items re-deal (375 → 385 items).
    // 387 → 475 at FOOD-1 (ODQ §934.104, 2026-11-03; record docs/shift-records/2026-11-03-food-1-one-food-record.json):
    // the Foundations food score reads the balance and the reserves, so the pulse's food pressure re-deals the realm's
    // year and the year-one desk carries 88 more items (385 → 473).
    // 475 → 473 at FOOD-2 (ODQ §934.104, 2026-11-03; record docs/shift-records/2026-11-03-food-2-food-base-numbers.json):
    // the food base numbers read one terrain table and draw the hinterland as supply, so the pulse's food pressure
    // re-deals the year again and the year-one desk carries two fewer items (473 → 471). The misjudgment ids do not move.
    // 473 → 462 at X-46 CAR 1 (THE OWNER'S HISTORICAL BANDS) (ODQ §934.105, RUNG 1 OF THE SOAK LADDER, 2026-11-04; record docs/shift-records/2026-11-04-rung1-01-x46-car-1-bands.json): the step re-deals the realm's year and the year-one desk files
    // 11 fewer items (473 → 462).
    // 462 → 463 at X-46 CAR 2 (LANE X46-2-THRESHOLDS) (ODQ §934.105, RUNG 1 OF THE SOAK LADDER, 2026-11-04; record docs/shift-records/2026-11-04-rung1-02-x46-car-2-thresholds.json): the step re-deals the realm's year and the year-one desk files
    // 1 more items (462 → 463).
    // 463 → 473 at FOOD-EXPORTS (WITH FOOD-4) (ODQ §934.105, RUNG 1 OF THE SOAK LADDER, 2026-11-04; record docs/shift-records/2026-11-04-rung1-07-food-exports.json): the step re-deals the realm's year and the year-one desk files
    // 10 more items (463 → 473).
    // 473 → 475 at T1/T2 (THE DRY RUN §4'S TWO PROPOSALS, ADOPTED BY THE CHAIR) (ODQ §934.105, RUNG 1 OF THE SOAK LADDER, 2026-11-04; record docs/shift-records/2026-11-04-rung1-10-t1-t2-siege-stores.json): the step re-deals the realm's year and the year-one desk files
    // 2 more items (473 → 475).
    // 475 → 395 at X-46 CAR 3 (LANE X46-3-BUDGET) (ODQ §934.105, RUNG 1 OF THE SOAK LADDER, 2026-11-04; record docs/shift-records/2026-11-04-rung1-12-x46-car-3-budget.json): the institution budget re-deals the realm's year and the year-one desk files
    // 80 fewer items (475 → 395).
    // 395 → 400 at PLACE-NOT-TIER (R6, UNITS 1–2) (ODQ §934.105, RUNG 1 OF THE SOAK LADDER, 2026-11-04; record docs/shift-records/2026-11-04-rung1-15-place-not-tier.json): the step re-deals the realm's year and the year-one desk files
    // 5 more items (395 → 400).
    // 400 → 434 at PINS, FIRST STEP (UNITS 1–3 AND THE CHAIR'S ADDENDUM) (ODQ §934.105, RUNG 1 OF THE SOAK LADDER, 2026-11-04; record docs/shift-records/2026-11-04-rung1-17-pins-1-density-exemptions.json): the step re-deals the realm's year and the year-one desk files
    // 34 more items (400 → 434).
    // 434 → 436 at X-46 CAR 3, I7 (ODQ §934.105, RUNG 1 OF THE SOAK LADDER, 2026-11-04; record docs/shift-records/2026-11-04-rung1-19-x46-car-3-i7-realised.json): the step re-deals the realm's year and the year-one desk files
    // 2 more items (434 → 436).
    // 436 → 434 at F6 BUDGET-FLOOR (UNITS 1–4) (ODQ §934.105, RUNG 1 OF THE SOAK LADDER, 2026-11-04; record docs/shift-records/2026-11-04-rung1-22-f6-budget-floor.json): the step re-deals the realm's year and the year-one desk files
    // 2 fewer items (436 → 434).
    // 434 → 435 at F1 DEFENCE-WORDS, FIRST STEP (UNITS 1–5) (ODQ §934.105, RUNG 1 OF THE SOAK LADDER, 2026-11-04; record docs/shift-records/2026-11-04-rung1-23-f1-defence-words.json): the step re-deals the realm's year and the year-one desk files
    // 1 more items (434 → 435).
    // 435 → 438 at THE POOL CENSUS COMPOSED (ODQ §934.105, RUNG 2 OF THE SOAK LADDER, the landing stacked on rung 1;
    // record docs/shift-records/2026-11-06-rung2-03-census-composed-herald-desk.json): the census record's shape on rung 1's
    // desk files 3 more items (5 rows from the census-1b step, 36 interaction rows of the rung-1 merge; 435 → 438).
    expect(Object.keys(manifest)).toHaveLength(438);
  });

  it('the declared refile set is exactly the knowledge desk the routing table carries', () => {
    // The desk routes EXACTLY the kinds the design names, and every one of them by an exact row.
    const knowledge = Object.keys(EXACT_SECTION).filter((k) => EXACT_SECTION[k] === 'knowledge').sort();
    expect(knowledge.filter((k) => REFILED.includes(k))).toEqual([...REFILED]);
    for (const kind of REFILED) expect(SECTION_OF(kind)).toBe('knowledge');
  });

  it('THE REFILE MOVES NO CONTENT BYTE, AND EXACTLY THE DECLARED ITEMS CHANGE DESK', async () => {
    for (const row of HERALD_DESK_GOLDEN_ROWS) {
      const live = await heraldDeskProjection(DEPS, row);
      // BYTE-STABLE: every item's content except its desk, and the closure count.
      expect(live.contentSha256).toBe(manifest[`${live.key}|contentSha256`]);
      expect(live.itemCount).toBe(manifest[`${live.key}|itemCount`]);
      const moved = [];
      const drifted = [];
      for (const [id, section] of Object.entries(live.sections)) {
        const captured = manifest[`${live.key}|section|${id}`];
        if (captured === undefined) { drifted.push(`${id}: not in the golden`); continue; }
        if (section === captured) continue;
        if (REFILED.includes(kindOfNewsId(id)) && section === 'knowledge') moved.push(`${id}: ${captured} -> ${section}`);
        else drifted.push(`${id}: ${captured} -> ${section}`);
      }
      // anchored: a desk that moved outside the declared set is a routing change nobody declared
      expect(drifted).toEqual([]);
      // THE ONE-TIME SHIFT, RECORDED at IN-5's landing (6cf6920d4): the realm's two misjudgment
      // beats, faith to knowledge, proven against a golden captured BEFORE the refile. RE-SCOPED at
      // LIT-1b's pick (FP-33, the FP chair, 2026-09-24): the lit belief chain re-deals the year-one
      // news (the beats now mint at ids 24 and 36, soak-a -> soak-c), and the golden was
      // re-recorded through the signed door at the lit tree, so it holds the post-refile desks and
      // nothing moves against it. The declared set is asserted directly instead: the realm's
      // misjudgment beats are exactly these two, and every one sits on the knowledge desk in the
      // golden and live. The other refiled kinds still mint nothing here.
      expect(moved).toEqual([]);
      const misjudged = Object.keys(live.sections).filter((id) => kindOfNewsId(id) === 'belief_misjudgment').sort();
      // Under the year window (the Herald lens U2, FP-31) the desk keeps every misjudgment beat of the year:
      // Re-dealt at the urban band's re-record (2026-09-30): the same-seed shift moves the year's
      // news, so two of the three beats mint at new ids. Still three, still all on knowledge.
      // Re-dealt again at J33 (2026-10-01): one beat mints at a new id. Still three, still all on knowledge.
      // Re-dealt at FOOD-1 (2026-11-03, ODQ §934.104): the food pressure re-deals the year; one beat mints at a new id
      // (soak-d -> soak-b, week 47). Still three, still all on knowledge.
      // Re-dealt at X-46 CAR 1 (THE OWNER'S HISTORICAL BANDS) (ODQ §934.105, RUNG 1 OF THE SOAK LADDER, 2026-11-04; record docs/shift-records/2026-11-04-rung1-01-x46-car-1-bands.json): the step re-deals the year;
      // the year's misjudgment beats are now 4 (10, 4, 47, 49), all on knowledge.
      // Re-dealt at X-46 CAR 3 (LANE X46-3-BUDGET) (ODQ §934.105, RUNG 1 OF THE SOAK LADDER, 2026-11-04; record docs/shift-records/2026-11-04-rung1-12-x46-car-3-budget.json):
      // the institution budget re-deals the year; the year's misjudgment beats are now 2 (4, 45), all on knowledge.
      // Re-dealt at PINS, FIRST STEP (UNITS 1–3 AND THE CHAIR'S ADDENDUM) (ODQ §934.105, RUNG 1 OF THE SOAK LADDER, 2026-11-04; record docs/shift-records/2026-11-04-rung1-17-pins-1-density-exemptions.json):
      // the step re-deals the year; the year's misjudgment beats are now 3 (4, 42, 49), all on knowledge.
      // Re-dealt at F1 DEFENCE-WORDS, FIRST STEP (UNITS 1–5) (ODQ §934.105, RUNG 1 OF THE SOAK LADDER, 2026-11-04; record docs/shift-records/2026-11-04-rung1-23-f1-defence-words.json):
      // the step re-deals the year; the year's misjudgment beats are now 2 (4, 42), all on knowledge.
      expect(misjudged).toEqual([
        'wizard_news.4.belief_misjudgment.soak-a.soak-c',
        'wizard_news.42.belief_misjudgment.soak-a.soak-c',
      ]);
      for (const id of misjudged) {
        expect(live.sections[id]).toBe('knowledge');
        expect(manifest[`${live.key}|section|${id}`]).toBe('knowledge');
      }
    }
  }, 240_000);
});
