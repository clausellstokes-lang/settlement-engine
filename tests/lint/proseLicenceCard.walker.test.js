/**
 * proseLicenceCard.walker.test.js — THE LICENCE CARD IS A PROJECTION OF THE CENSUS ROW, AND
 * THIS IS THE ARM THAT PROVES IT (ARCH-COMPOSED-PROSE-v2 §8.3; TASTE car M-1).
 *
 * THE PROPERTY. A writer authors against the card and against nothing else. If a card line
 * were a sentence somebody typed, the writer would be licensed by an opinion; if it is
 * projected from the wiring census, the writer is licensed by the register and a register
 * that moves moves the card. The two arms below are exactly that claim, in both directions:
 *
 *   1. THE SHIPPED CARD MATCHES ITS ROW FIELD FOR FIELD. `DS-DEF-11 :: WALLED-STRAINED` is
 *      read out of the committed census and out of the committed leaf, and every line the
 *      card prints is asserted against the value it came from.
 *   2. A PLANT THAT EDITS THE ROW MOVES THE LINE BY NAME. The row is copied, one field is
 *      changed, the card is rebuilt, and the arm asserts that the planted value appears on
 *      the named line and that the clean value does not. A card that ignored its input would
 *      pass arm 1 and fail this one.
 *
 * ⛔ THE PLANT NEVER TOUCHES A COMMITTED BYTE. `licenceCardLines` is pure, so the plant is an
 * object literal in memory; no census is written and no leaf is regenerated. That is the whole
 * reason the builder is a lib and not a block inside the script (see the lib's header).
 *
 * @enforced-by this file
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT } from '../helpers/dossierCorpus.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import {
  CARD_LINES, REFUSED_COLUMNS, bagText, echoText, licenceCardLines, mayClaimText, predicateText,
  readsLines, relationWhy, sourceText,
} from '../../scripts/lib/prose-licence-card.mjs';

/** The committed register the card is projected from. */
const CENSUS = JSON.parse(readFileSync(join(ROOT, 'docs/content/wiring-census.json'), 'utf8'));
/** `${block} :: ${pool}` -> the row. */
const ROWS = new Map(CENSUS.rows.map((r) => [`${r.block} :: ${r.pool}`, r]));
/** The echo table, keyed as `factMounts` keys it (the producer-token root). */
const FACTS = new Map((CENSUS.mountsPerFact?.rows || []).map((r) => [r.field, r]));

/** The shipped pool this file's arms are anchored on (ARCH §6.3's own worked block). */
const BLOCK = 'DS-DEF-11';
const POOL = 'WALLED-STRAINED';

/** A tiny shape register, so the arm does not depend on the annex parser. */
const SHAPES = { settlement: 'proper', defwork: 'bare-common' };

/**
 * The card for one (block, pool), optionally over a DOCTORED row — the plant's only entry.
 * @param {object} [override] fields to merge into the census row
 * @returns {string[]}
 */
function card(override) {
  const row = { ...ROWS.get(`${BLOCK} :: ${POOL}`), ...(override || {}) };
  const block = /** @type {any} */ (DOSSIER_STATE_PROSE_DEFENSE)[BLOCK];
  return licenceCardLines({
    blockId: BLOCK,
    poolKey: POOL,
    row,
    poolMeta: block.poolMeta[POOL],
    blockSlots: block.slots,
    shapeOf: (slot) => SHAPES[slot],
    variants: block.pools[POOL],
    factRow: FACTS.get('forces') || null,
    spineRows: [],
    covertPath: false,
  });
}

/** @param {string[]} lines @param {string} label @returns {string} */
function lineOf(lines, label) {
  const at = lines.findIndex((l) => l.startsWith(`  ${label}:`));
  expect(at, `the card carries a \`${label}:\` line`).toBeGreaterThan(-1);
  // A card line may CONTINUE on indented rows (the reads list, the source's second half).
  const out = [lines[at]];
  for (let i = at + 1; i < lines.length && /^ {14}\S/.test(lines[i]); i++) out.push(lines[i]);
  return out.join('\n');
}

describe('the licence card is projected from the census row, field for field', () => {
  it('carries every line ARCH §8.3 names, in its order', () => {
    const lines = card();
    const labels = lines.filter((l) => /^ {2}[a-z/ A-Z]+:/.test(l)).map((l) => l.trim().split(':')[0]);
    for (const label of CARD_LINES) {
      expect(labels, `§8.3's \`${label}\` line`).toContain(label.split('/')[0] === label ? label : label);
    }
    expect(lines[0]).toContain(`block ${BLOCK}`);
    expect(lines[0]).toContain(`key \`${POOL}\``);
    expect(lines[lines.length - 1]).toContain(REFUSED_COLUMNS[0]);
  });

  it('the `reads` line names exactly the row\'s reads, with the row\'s own `absent` kind', () => {
    const row = ROWS.get(`${BLOCK} :: ${POOL}`);
    const line = lineOf(card(), 'reads');
    expect(row.reads.length, 'the anchor pool reads something').toBeGreaterThan(0);
    for (const path of row.reads) {
      expect(line, `the card names the read path ${path}`).toContain(path);
      expect(line, `and the census's absent kind for ${path}`).toContain(row.absent[path]);
    }
    // AND NOTHING ELSE: every field the row does NOT read is absent from the line. Written as
    // a POSITIVE assertion over the offenders rather than as a bare negative per path, so the
    // liveness half is the loop above (every `reads` path proved PRESENT on this same line).
    const outside = row.fieldsRead.filter((f) => !row.reads.includes(f));
    expect(outside.length, 'the anchor pool reads FEWER fields than its key function').toBeGreaterThan(0);
    expect(outside.filter((path) => line.includes(path)),
      'a field in fieldsRead but not in reads must not reach the card').toEqual([]);
    expect(readsLines({ reads: [] })[0]).toContain('recovered no reading');
  });

  it('the `predicate` line carries the row\'s recovered triples verbatim', () => {
    const row = ROWS.get(`${BLOCK} :: ${POOL}`);
    const line = lineOf(card(), 'predicate');
    expect(row.predicate.length, 'the anchor pool has a recovered predicate').toBeGreaterThan(0);
    for (const p of row.predicate) expect(line).toContain(predicateText(p));
  });

  it('the `bag`, `attach`, `covert` and `source` lines equal the leaf and the row', () => {
    const row = ROWS.get(`${BLOCK} :: ${POOL}`);
    const block = /** @type {any} */ (DOSSIER_STATE_PROSE_DEFENSE)[BLOCK];
    const lines = card();
    expect(lineOf(lines, 'bag')).toContain(bagText(block.slots, (s) => SHAPES[s]));
    // A spine's attach set is empty at this tip, and the card says so rather than printing [].
    expect(block.poolMeta[POOL].attach).toEqual([]);
    expect(lineOf(lines, 'attach')).toContain('a spine takes no attach set');
    expect(row.covert).toBe(false);
    expect(lineOf(lines, 'covert')).toContain('no');
    expect(lineOf(lines, 'source')).toContain(row.source.kind);
    expect(lineOf(lines, 'source')).toContain(row.source.standing);
    expect(sourceText(null)).toContain('SOURCE-UNRESOLVED');
  });

  it('the `echo` line is the census\'s own mounts-per-fact row', () => {
    const fact = FACTS.get('forces');
    expect(fact, 'the echo table holds the producer root `forces`').toBeTruthy();
    expect(lineOf(card(), 'echo')).toContain(echoText(fact, 'forces.walls.present'));
    // NOT-EXECUTABLE where the table has no row, never a silent zero.
    expect(echoText(null, 'nothing')).toContain('NOT-EXECUTABLE');
  });
});

describe('a plant that edits the census row moves the card line BY NAME', () => {
  it('a planted `reads` path appears on the reads line and the clean one does not', () => {
    const planted = 'settlement.config.PLANTED_FIELD';
    const clean = lineOf(card(), 'reads');
    const dirty = lineOf(card({
      reads: [planted], absent: { [planted]: 'measured' },
    }), 'reads');
    // anchored: the paired PRESENT assertion on the next line is the liveness half
    expect(clean).not.toContain(planted);
    expect(dirty).toContain(planted);
    // anchored: `clean` above carries this exact path, so the line is proved live before it is proved absent
    expect(dirty).not.toContain('forces.walls.present');
  });

  it('a planted predicate value moves the predicate AND the may-claim line', () => {
    const dirty = card({ predicate: [{ field: 'settlement.plantedGate', op: '>=', value: '99' }] });
    expect(lineOf(dirty, 'predicate')).toContain('settlement.plantedGate >= 99');
    expect(lineOf(dirty, 'may claim')).toContain('plantedGate');
    // anchored: the PRESENT half is the line above, over the same builder and the same label
    expect(lineOf(card(), 'may claim')).not.toContain('plantedGate');
  });

  it('a planted covert row flips the covert and audience lines together', () => {
    const dirty = card({ covert: true });
    expect(lineOf(dirty, 'covert')).toContain('YES');
    expect(lineOf(dirty, 'audience')).toContain('DM only');
    expect(lineOf(card(), 'audience')).toContain('player (no mark)');
  });

  it('a planted source standing withdraws the citation licence in words', () => {
    const licensed = lineOf(card(), 'source');
    const dirty = lineOf(card({ source: { kind: 'court', standing: 'SOURCE-UNRESOLVED' } }), 'source');
    expect(licensed).toContain('is licensed');
    expect(dirty).toContain('NO citation is licensed');
    expect(dirty).toContain('arm A13');
  });

  it('a planted objectClass adds exactly one clause to `may NOT`', () => {
    expect(lineOf(card({ objectClass: 'granary' }), 'may NOT')).toContain('`granary`');
    // anchored: the line above proves the clause is emitted at all, over the same label
    expect(lineOf(card({ objectClass: null }), 'may NOT')).not.toContain('civic object of the class');
  });

  it('the relation line answers differently for a spine, an addition and a consequence', () => {
    expect(relationWhy({ relation: '', seatRows: [], seatReason: '' })).toContain('a spine IS the seat');
    expect(relationWhy({ relation: 'addition', seatRows: [], seatReason: '' })).toContain('claim-free floor');
    expect(relationWhy({ relation: 'consequence', seatRows: [], seatReason: 'no-row' })).toContain('no licensing row');
    expect(relationWhy({ relation: 'consequence', seatRows: ['(c):a|b'], seatReason: 'row' })).toContain('(c):a|b');
  });

  it('may-claim refuses to invent a claim when the census recovered nothing', () => {
    expect(mayClaimText({ reads: [], predicate: [] })).toContain('no claim is licensed');
  });
});
