/**
 * CENSUS-4h unit 4 — R-AO's per-line `colour` marks on the NPC lane's mixed pools (the chair's
 * answer 2 of block m: marked after the walker, only lines READ, never an unread line).
 *
 * The verdicts are the phase-A ledgers' `colour: true` rows (docs/census/declarations/): the wants
 * (53) and the tie prose's variants were read in phase A; the descriptions and the NPC goals were
 * re-read by CENSUS-4h (each ledger's `pool.colourReRead`). A mark is a no-atom declaration: the
 * draws read it as silence, so it moves no birth.
 * - the wants and the goals carry `colour: true` on the row in place;
 * - the tie prose's variants become `{ line, colour: true }` (`npcData.js :: closureOf` reads `.line`);
 * - the descriptions' marks sit in a text-keyed column beside the table,
 *   `institutionDescColour.js :: DESC_VARIANT_COLOUR_DECLARATIONS` (the table's strings are read by
 *   six string consumers and `DESC_VARIANT_DECLARATIONS` is pinned at the ledger's 62 declaring texts).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { NPC_FACTION_GOALS, NPC_WANTS, STRESS_ECONOMIC_EFFECTS } from '../../src/data/npcData.js';
import * as D from '../../src/data/institutionDescVariants.js';
import * as C from '../../src/data/institutionDescColour.js';
import { declares, declarationOf, isColourLine } from '../../src/domain/facts/factVocabulary.js';

const ledger = (/** @type {string} */ id) => JSON.parse(readFileSync(new URL(`../../docs/census/declarations/${id}.json`, import.meta.url), 'utf8'));
const colourRows = (/** @type {string} */ id) => ledger(id).rows.filter((/** @type {any} */ r) => r.colour === true);

describe('CENSUS-4h: the colour marks follow the ledger, line for line', () => {
  it('the wants: the 53 colour rows are `{ text, colour: true }`, the three declaring rows unchanged', () => {
    const rows = colourRows('npcData.NPC_WANTS');
    expect(rows).toHaveLength(53);
    for (const r of rows) {
      const [cat, i] = r.id.split('#');
      const live = /** @type {any} */ (NPC_WANTS)[cat][Number(i)];
      expect({ id: r.id, live }).toEqual({ id: r.id, live: { text: r.text, colour: true } });
      expect(isColourLine(live)).toBe(true);
    }
    const declaring = Object.values(NPC_WANTS).flat().filter((l) => declares(declarationOf(l)));
    expect(declaring).toHaveLength(3);
    for (const l of Object.values(NPC_WANTS).flat()) expect(typeof l === 'object' && l !== null).toBe(true);
  });

  it('the goals: exactly the re-read colour rows carry `colour: true` (short and long read together)', () => {
    const rows = colourRows('npcData.NPC_FACTION_GOALS');
    const marked = new Set(rows.map((/** @type {any} */ r) => r.id.replace(/\.(short|long)$/, '')));
    expect(marked.size).toBe(35);
    for (const [role, list] of Object.entries(NPC_FACTION_GOALS)) {
      /** @type {any[]} */ (list).forEach((g, i) => {
        const id = `${role}#${i}`;
        expect({ id, colour: g.colour === true }).toEqual({ id, colour: marked.has(id) });
        if (marked.has(id)) expect(isColourLine(g)).toBe(true);
      });
    }
  });

  it('the tie prose: every colour variant is `{ line, colour: true }`, every other row as phase A left it', () => {
    const rows = colourRows('npcData.STRESS_ECONOMIC_EFFECTS').filter((/** @type {any} */ r) => /\.(desc|tension)#\d+$/.test(r.id));
    expect(rows.length).toBeGreaterThan(200);
    const want = new Set(rows.map((/** @type {any} */ r) => r.id));
    let n = 0;
    for (const [key, a] of Object.entries(STRESS_ECONOMIC_EFFECTS)) {
      for (const f of /** @type {const} */ (['desc', 'tension'])) {
        /** @type {any} */ (a)[f].lines.forEach((/** @type {any} */ v, /** @type {number} */ i) => {
          const id = `${key}.${f}#${i}`;
          const colour = typeof v === 'object' && v.colour === true;
          expect({ id, colour }).toEqual({ id, colour: want.has(id) });
          if (colour) { n += 1; expect(typeof v.line).toBe('function'); expect(isColourLine(v)).toBe(true); }
        });
      }
    }
    expect(n).toBe(want.size);
  });

  it('the descriptions: the colour column holds exactly the ledger\'s colour texts, live, and declares nothing else', () => {
    const texts = new Set(colourRows('institutionDescVariants.INSTITUTION_DESC_VARIANTS').map((/** @type {any} */ r) => r.text));
    const col = /** @type {Record<string, any>} */ (C.DESC_VARIANT_COLOUR_DECLARATIONS);
    expect(new Set(Object.keys(col))).toEqual(texts);
    const live = new Set(Object.values(D.INSTITUTION_DESC_VARIANTS).flat());
    for (const [text, d] of Object.entries(col)) {
      expect(live.has(text)).toBe(true);
      expect(d).toEqual({ colour: true });
      expect(text in D.DESC_VARIANT_DECLARATIONS).toBe(false);
      expect(text in D.DESC_VARIANT_SIBLINGS).toBe(false);
    }
  });
});
