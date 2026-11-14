// THE CORPUS LANE'S CLIP GUARD (W2-WRITE-SIDE-13; the reader's L2 at 70e5e7468 and the twelfth seat's #38: "Kaliburg's market
// grew up on the road's trade." printed under a siege, the clause "and with the siege closing the road ..." never reaching the
// page). The chair's ruling of 2026-11-14: A LINE THAT PRINTS CLIPPED SAYS ITS CRISIS BEFORE THE CLIP.
//
// The Overview's site rungs (generalDeskRead.js :: siteLines: DS-GEN-12's ground, DS-GEN-13's market, commerce and warehouses,
// DS-GEN-17's institutions, cathedral and monastery) print a line through `siteClause`, which keeps it only to its first
// semicolon or its first comma that opens a joined clause. A line of those blocks written FOR a crisis (`crisis: <kind>`) is the
// crisis twin of its pool; if the clip cuts its crisis away, the twin prints as the calm line it was written to replace. So every
// such line must still name its crisis after the clip. The control proves the clip is live on the corpus (some line of the
// blocks is cut), so the guard can never pass because the reader stopped clipping.
import { describe, expect, it } from 'vitest';
import { siteClause } from '../../src/components/new/generalDeskRead.js';
import * as general from '../../src/data/dossierStateProse/general.generated.js';

const leaf = /** @type {Record<string, any>} */ (Object.values(general).find((v) => v && typeof v === 'object'));
/** The words that name each crisis on the page. */
const CRISIS_WORDS = /** @type {Record<string, RegExp>} */ ({
  under_siege: /\bsiege\b|\bbesieg/i,
  plague_onset: /\bsickness\b|\bplague\b/i,
  famine: /\bfamine\b|\bhunger\b|\bharvest\b/i,
  occupied: /\boccupi/i,
});
const SITE_BLOCKS = ['DS-GEN-12', 'DS-GEN-13', 'DS-GEN-17'];
const lines = SITE_BLOCKS.flatMap((id) => Object.entries(leaf[id].pools).flatMap(([key, pool]) => /** @type {any[]} */ (pool)
  .map((v) => ({ id: `${id}::${key} v${v.vid}`, text: /** @type {string} */ (v.text),
    kinds: /** @type {string[]} */ (v.marks || []).map((m) => /^crisis: ([a-z_]+)$/.exec(m)?.[1]).filter((k) => k && k !== 'any') }))));

describe('a crisis twin on a clipped rung names its crisis before the clip', () => {
  it('the control: the clip cuts some line of the site blocks, and some line of them is a crisis twin', () => {
    expect(lines.some((l) => siteClause(l.text) !== l.text)).toBe(true);
    expect(lines.some((l) => l.kinds.length > 0)).toBe(true);
  });
  for (const { id, text, kinds } of lines.filter((l) => l.kinds.length > 0)) {
    it(`${id} (${kinds.join(', ')}): the clipped line still names the crisis`, () => {
      for (const kind of kinds) {
        expect(CRISIS_WORDS[kind], `no crisis words for ${kind}: add them`).toBeDefined();
        expect(siteClause(text), `${id} prints clipped without its ${kind}`).toMatch(CRISIS_WORDS[kind]);
      }
    });
  }
});
