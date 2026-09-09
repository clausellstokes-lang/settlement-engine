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
import { beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT } from '../helpers/dossierCorpus.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import {
  CARD_LINES, REFUSED_COLUMNS, bagText, echoKeyNote, echoText, licenceCardLines, mayClaimText,
  mayNotText, parseTableRungRead, predicateText, readAsField, readsLines, relationWhy, sourceText,
} from '../../scripts/lib/prose-licence-card.mjs';
import { cardMachine } from '../../scripts/prose-licence-card.mjs';

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

/**
 * ⭐ A TABLE-RUNG READ IS NOT A DOTTED PATH, AND THE CARD MAY NOT PRETEND IT IS
 * (REWRITE car 8b-W-5; the defect car 8b-W found and the chair confirmed).
 *
 * THE DEFECT THESE ARMS EXIST TO KEEP DEAD. The census records a read in one of TWO shapes. A
 * LITERAL-rung pool reads a dotted path, and its last segment is the field it claims. A
 * TABLE-rung pool reads a whole selecting expression, `<reader> (via <TABLE> in <file>)`, which
 * has NO leaf: split it on `.` and the last segment is the tail of the file name. The card
 * derived its claim with `field.split('.').slice(-1)[0]` for both, so on all one hundred
 * twenty-two of the census's table-rung pools it printed
 *
 *     may claim:  that `js)` (=== STRONG) holds, as a STANDING fact of the record
 *
 * and the REWRITE's writers and refuters read exactly that line as their licence.
 *
 * ⛔ THE TWO PLANTS, AND WHY THEY ARE SHAPED THIS WAY.
 *   (a) OVER EVERY POOL, NOT A SAMPLE. The defect was invisible at the anchor pool, because
 *       `DS-DEF-11 :: WALLED-STRAINED` reads a dotted path and printed correctly throughout. A
 *       sample that happens to be literal-rung proves nothing, so the sweep below builds the
 *       SHIPPED card for every row of the census and refuses a claim subject that ends in `)`
 *       or is `js`. Its anti-vacuity guard is the table-rung count: if the sweep stops seeing
 *       table-rung pools the arm reds rather than passing over an empty set.
 *   (b) THE DOTTED FORM IS PINNED BY BYTES. A cure that fixed the table rung by moving the
 *       literal rung would be a different defect wearing this one's clothes, so the three cards
 *       the chair named are pinned line for line. `DS-DEF-11`'s whole card was proved identical
 *       by `cmp` at 1711 bytes across the cure; these are the two lines the cure could reach.
 */
describe('a table-rung pool is licensed to claim a ROW OF A TABLE, never a file name', () => {
  /** @type {{cardFor: (block: string, pool: string) => string[]}} */
  let machine;
  beforeAll(async () => { machine = await cardMachine(); });

  /** Census rows whose first read is a table-rung reading. */
  const TABLE_RUNG = CENSUS.rows.filter((r) => parseTableRungRead((r.reads || [])[0] || ''));

  /**
   * THE BARE CLAIM SUBJECT — the token the card asserts holds, in the dotted form's own
   * sentence `that \`<leaf>\` … holds`. A cured table-rung claim does NOT match: its sentence
   * begins `that the reader \`…\` selects the row …`, and the backticks in it name a reader, a
   * row, a table and a file rather than a subject. So a table-rung pool reaching this at all is
   * the defect, and a dotted pool reaching it with a `)` or `js` is the defect too.
   * @param {string[]} lines @returns {string}
   */
  const claimSubject = (lines) => {
    const line = lines.find((l) => l.startsWith('  may claim:')) || '';
    return line.match(/^ {2}may claim: {2}that `([^`]*)`/)?.[1] || '';
  };

  it('the census carries BOTH read shapes, and the old idiom really did print `js)`', () => {
    expect(TABLE_RUNG.length, 'the census still holds table-rung pools').toBeGreaterThan(0);
    expect(CENSUS.rows.length - TABLE_RUNG.length, 'and dotted-read pools beside them').toBeGreaterThan(0);
    // THE NEGATIVE CONTROL. The arms below are pointed at a real defect and not at a shape that
    // never existed: the cured idiom's predecessor, run here on a live census reading, still
    // yields the nonsense the writers were handed.
    const read = TABLE_RUNG[0].reads[0];
    expect(read.split('.').slice(-1)[0]).toBe('js)');
    expect(parseTableRungRead(read)).not.toBeNull();
  });

  it('EVERY pool in the census prints a claim subject that is neither `js` nor a call tail', () => {
    let built = 0;
    let tableRung = 0;
    /** @type {string[]} */
    const offenders = [];
    for (const row of CENSUS.rows) {
      const lines = machine.cardFor(row.block, row.pool);
      built += 1;
      const subject = claimSubject(lines);
      if (subject.endsWith(')') || subject === 'js') offenders.push(`${row.block} :: ${row.pool} -> \`${subject}\``);
      if (parseTableRungRead((row.reads || [])[0] || '')) {
        tableRung += 1;
        const claim = lines.find((l) => l.startsWith('  may claim:')) || '';
        if (!claim.includes('selects the row') && !claim.includes('selects a row')) {
          offenders.push(`${row.block} :: ${row.pool} -> the claim does not name a table row`);
        }
      }
      // AND THE ECHO NOTE, which derived its root from the same idiom and printed the file.
      const note = lines.find((l) => l.includes('the echo table is keyed on')) || '';
      if (/PRODUCER-TOKEN ROOT `[^`]*(?:\(via |\.js)/.test(note)) {
        offenders.push(`${row.block} :: ${row.pool} -> the echo root names a file`);
      }
    }
    expect(offenders).toEqual([]);
    expect(built, 'every census row has a card in the projected corpus').toBe(CENSUS.rows.length);
    // ANTI-VACUITY: the sweep saw the shape it exists to police, at the census's own count.
    expect(tableRung, 'the sweep saw every table-rung pool').toBe(TABLE_RUNG.length);
  });

  it('pins the three cards the chair named, line for line', () => {
    const lineAt = (block, pool, prefix) => machine.cardFor(block, pool)
      .find((l) => l.trimStart().startsWith(prefix));
    // The two table-rung cards: the claim names the reader, the row, the table and the file.
    expect(lineAt('DS-DEF-2', 'Invasion & War: walls AND professional garrison', 'may claim:'))
      .toBe('  may claim:  that the reader `invasionRowSituation(walls, garrison, militia)`'
        + ' selects the row `walls, professional garrison` of `INVASION_ROW_POOL` in'
        + ' `defenseStateProse.js`, as a STANDING fact of the record');
    expect(lineAt('DS-DEF-1', 'readiness STRONG', 'may claim:'))
      .toBe('  may claim:  that the reader `scoreBand(readinessScore)` selects the row `STRONG`'
        + ' of `READINESS_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record');
    expect(lineAt('DS-DEF-2', 'Invasion & War: walls AND professional garrison', 'the echo table'))
      .toBe('              the echo table is keyed on this pool\'s WHOLE table-rung reading'
        + ' (truncated at the file\'s first dot) and NOT on a producer-token root, so every pool'
        + ' that selects a row of `INVASION_ROW_POOL` shares ONE echo key: a mount counted there'
        + ' may be a sibling ROW of the same table');
    // ⛔ THE DOTTED CARD DOES NOT MOVE BY ONE BYTE. Both lines exactly as they shipped.
    expect(lineAt(BLOCK, POOL, 'may claim:'))
      .toBe('  may claim:  that `military` (< 1) holds, as a STANDING fact of the record');
    expect(lineAt(BLOCK, POOL, 'the echo table'))
      .toBe('              the echo table is keyed on the PRODUCER-TOKEN ROOT `forces`, which is'
        + ' coarser than this pool\'s own read `forces.walls.present`: a mount counted there may'
        + ' be reading a sibling field of the same root');
  });

  it('parses every read shape the census spells, and refuses to parse a dotted path', () => {
    const shapes = new Set(CENSUS.rows.flatMap((r) => r.reads || []).filter((p) => p.includes(' (via ')));
    expect(shapes.size, 'the census spells table-rung readings').toBeGreaterThan(0);
    for (const shape of shapes) {
      const rung = parseTableRungRead(shape);
      expect(rung, `the card parses the reading ${shape}`).not.toBeNull();
      expect(shape, 'and every part it recovered is the census\'s own text')
        .toBe(`${rung.reader} (via ${rung.table} in ${rung.file})`);
    }
    // A CALL keeps its arguments; a bare key expression reports none rather than inventing ().
    expect(parseTableRungRead('scoreBand(readinessScore) (via R in f.js)').args).toBe('readinessScore');
    expect(parseTableRungRead('head (via SAFETY_POOL_OF in generalStateProse.js)').args).toBeNull();
    expect(parseTableRungRead('settlement.defenseProfile.economicGates.military')).toBeNull();
    expect(readAsField('settlement.defenseProfile.economicGates.military'))
      .toBe('settlement.defenseProfile.economicGates.military');
  });

  it('a table-rung SPINE in an attach set is refused as a table row, not as a file', () => {
    // ⛔ A PLANT, BECAUSE NO POOL REACHES IT TODAY. No modifier at this tip attaches to a
    // table-rung spine, so the `may NOT` clause would have printed `... defenseStateProse.js)`
    // as "a field the attached spine tests" the first day one did. The plant is that day.
    const read = 'invasionRowSituation(walls, garrison, militia) (via INVASION_ROW_POOL in defenseStateProse.js)';
    const planted = mayNotText({ spineFields: [read], objectClass: null });
    expect(planted).toContain('the row of `INVASION_ROW_POOL` selected by');
    // anchored: the line above proves this same string carries the cured clause, over the same call
    expect(planted).not.toContain('defenseStateProse.js)');
    // and the dotted set is untouched, in the census's own spelling and order
    expect(mayNotText({ spineFields: ['settlement.tier', 'forces.walls.present'], objectClass: null }))
      .toContain('any field the attached spine tests (forces.walls.present · settlement.tier)');
  });

  it('the echo note tells a table rung its key is the TABLE and a dotted read its root', () => {
    expect(echoKeyNote('forces.walls.present')).toContain('PRODUCER-TOKEN ROOT `forces`');
    const rung = echoKeyNote('scoreBand(readinessScore) (via READINESS_ROW_POOL in defenseStateProse.js)');
    expect(rung).toContain('every pool that selects a row of `READINESS_ROW_POOL` shares ONE echo key');
    expect(rung).not.toContain('PRODUCER-TOKEN ROOT'); // anchored: the line above proves this same note live
    expect(rung).not.toContain('defenseStateProse'); // anchored: the same note, proved present two lines up
    expect(echoKeyNote('')).toContain('PRODUCER-TOKEN ROOT,');
  });

  it('a claim with no recovered row says so rather than inventing one', () => {
    const read = 'text(terrain) (via TERRAIN_PRIZE_OF in defenseStateProse.js)';
    expect(mayClaimText({ reads: [read], predicate: [] }))
      .toBe('that the reader `text(terrain)` selects a row of `TERRAIN_PRIZE_OF` in'
        + ' `defenseStateProse.js`, as a STANDING fact of the record');
    // a non-equality test on a table rung keeps its operator rather than being read as a row
    expect(mayClaimText({ reads: [read], predicate: [{ field: read, op: '!==', value: 'x' }] }))
      .toContain('selects a row of `TERRAIN_PRIZE_OF` in `defenseStateProse.js` (!== x),');
  });
});
