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
    expect(Object.keys(manifest)).toHaveLength(243);
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
      // THE ONE-TIME SHIFT, RECORDED: the realm's two misjudgment beats, faith to knowledge. The
      // other refiled kinds mint nothing here (their layers are unlit in this preset).
      expect(moved.sort()).toEqual([
        'wizard_news.19.belief_misjudgment.soak-a.soak-c: faith -> knowledge',
        'wizard_news.19.belief_misjudgment.soak-c.soak-d: faith -> knowledge',
      ]);
    }
  }, 240_000);
});
