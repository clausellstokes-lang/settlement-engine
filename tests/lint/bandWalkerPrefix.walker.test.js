/**
 * bandWalkerPrefix.walker.test.js - THE Q10 BAND-WALKER PREFIX.
 *
 * CHARTER: ODQ §99.3, the oldest unpaid instrument debt on the foreign-policy path
 * (2026-08-15): "the Q10 BAND-WALKER PREFIX is confirmed STILL OWED (it rode neither eff
 * train) - it must land before any LG band; docketed to the next infra member." The volume
 * side of the same charter is `docs/DESIGN_FP_ARCH_LG.md` §2 Q10 ("the LG prefix joins the
 * band-walker alternation IN THE NEXT INFRA ACT, BEFORE any LG band lands; an LG wave
 * landing a band before that prefix exists is a STOP, the CR-HB0B-BANDGAP class, pre-cured")
 * and §5 ("no band before the Q10 prefix"). FIRST CONSUMER: long-tail #33, the LG family -
 * nearly every LG wave lands a band, and none of them may land until this file is green.
 *
 * ── WHAT A BAND IS, AND WHY A PREFIX CAN SWALLOW ONE ────────────────────────────
 * A BAND is a tuned value a wave proposes and the owner signs. Its declaration is a
 * `**Bands:**` line inside the wave's block in a design volume; the owner's signature
 * surface is that volume's tuning table. Two walkers reconcile the two sides for two
 * families (SP and HB). Both find their wave blocks by matching a line against a regex that
 * spells the prefix, so A WAVE WHOSE ID SHAPE THE REGEX DOES NOT SPELL IS INVISIBLE, and an
 * invisible wave's bands reach nobody. That is CR-HB0B-BANDGAP, recorded rather than cured
 * at HB-0B: a block headed `**HB-0b` does not match `/^\*\*(HB-\d+) /` and "would be silently
 * invisible to the reconciliation". MEASURED at this landing: ELEVEN letter-suffixed wave ids
 * already carry bands in the volumes (WF-2b, WF-5b, IN-0a..IN-0d, INT-3b, POP-5a, POP-5b,
 * TB-1b, WR-7d), so the class is live habitat and not a hypothetical.
 *
 * ── THE MEASURED REFUSAL: WIDENING THE ALTERNATION IS NOT THIS CURE ─────────────
 * §99.4 banks the trap "a counterfactual that convicts for the WRONG reason is not a proof",
 * and the obvious reading of Q10 walks straight into it. The nine-prefix alternation in
 * `tests/lint/spBandFamilies.walker.test.js` reads like the estate's band gate, but it is
 * applied to ONE document, the SP volume, and to nothing else. Adding `LG` to it would have
 * changed no behaviour whatsoever and would have closed the docket on a no-op. That refusal
 * is ASSERTED below rather than argued: the arm pins that the alternation has exactly one
 * call site and that the call site is the SP volume.
 *
 * ── WHAT THIS FILE IS INSTEAD ───────────────────────────────────────────────────
 * The gate is a ROSTER, and the prefix is a row in it. Every `**Bands:**` line in every
 * design volume is discovered SHAPE-AGNOSTICALLY (heading, bold paragraph, or bullet
 * paragraph; digit or letter suffix), attributed to the wave block above it, and classified:
 *
 *   RECONCILED  a walker reconciles this prefix, and every band-bearing wave in its volume
 *               is VISIBLE to that walker's own block regex (the BANDGAP arm);
 *   FROZEN      the prefix bore bands before this instrument existed. Shrink-only: a prefix
 *               may move to RECONCILED, never back, and the set may not grow;
 *   REQUIRED    the prefix may not bear a band until a reconciler exists. LG is the only
 *               member, and that row IS ODQ §99.3.
 *
 * A band under a prefix on no row is a STOP. So is a band with no wave block above it. The
 * cure is therefore the CLASS rather than the instance: the next family to author a band
 * stops in exactly the way LG stops, without anyone remembering to widen a literal.
 *
 * ⭐ DERIVED, NEVER TRANSCRIBED. The band population, the wave ids, the prefixes and each
 * reconciler's visible-wave set are all read off disk at run time. The file holds no band
 * phrase, no wave list and no per-prefix count. What it does hold is each reconciler's block
 * regex AS THE LITERAL TEXT THAT APPEARS IN ITS SOURCE, and the arm asserts that literal
 * occurs EXACTLY ONCE in that file before using it - so the day a reconciler re-spells its
 * parser, this walker says so out loud instead of measuring a regex nobody uses.
 *
 * ⚠ THE LG VOLUME IS NOT ON THIS BRANCH. `docs/DESIGN_FP_ARCH_LG.md` lives on the ledger
 * branch only; its own header carries an unpaid fold obligation ("to the build branch,
 * CLAIM_RE-checked, at the next integration point"). That absence is WHY the LG row is
 * REQUIRED rather than RECONCILED, and it is why the bullet block shape - the shape LG's §4
 * wave ladder actually uses - is exercised by a planted control rather than by the live
 * tree. The other two shapes are proven live before any absence below is asserted.
 *
 * @enforced-by itself (doc parsing plus a source read of two sibling walkers; no runtime coupling)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The block separator the volumes use. Spelled as an escape so no raw byte enters this file. */
const DASH = '—';

/** A wave id: a two-to-four letter family prefix, a hyphen, then the wave's own token. */
const WAVE_ID = '[A-Z]{2,4}-[A-Za-z0-9]+';

/**
 * The three block shapes the estate's volumes use to open a wave. Leading decoration (a star,
 * a section sign) is skipped rather than spelled. The letter suffix is admitted by
 * construction - it is the whole of CR-HB0B-BANDGAP - and so is the hyphen spelling of the
 * separator, so a volume that never adopted the em dash is not silently unreadable.
 */
const BLOCK_SHAPES = Object.freeze([
  Object.freeze({ shape: 'heading', re: new RegExp(`^#{3,4} (?:[^\\w\\s]+ )*(${WAVE_ID})(?=\\b)`) }),
  Object.freeze({ shape: 'bold', re: new RegExp(`^\\*\\*(?:[^\\w\\s]+ )*(${WAVE_ID}) [-${DASH}] `) }),
  Object.freeze({ shape: 'bullet', re: new RegExp(`^- \\*\\*(?:[^\\w\\s]+ )*(${WAVE_ID}) [-${DASH}] `) }),
]);

/** A band declaration. Both spellings the volumes use: column zero, and under a bullet. */
const BANDS_LINE = /^(?:- )?\*\*Bands\b/;

/** A `## ` heading closes a wave block: attribution never reaches across a section. */
const SECTION_BREAK = /^## /;

/** The design volumes. A band's home, and the document the owner signs against. */
const DESIGN_VOLUME = /^docs\/DESIGN_[^/]+\.md$/;

/** Where a Bands line may legitimately appear outside a volume: a packet's own manifest field. */
const PACKET_TREE = 'docs/implementation/packets/';

/**
 * The prefixes a walker reconciles, with that walker's block regex AS SPELLED IN ITS SOURCE.
 * The literal is a coupling pin, not a transcription of behaviour: it is asserted to occur
 * exactly once in the named file before it is compiled and used.
 */
const RECONCILED = Object.freeze({
  HB: Object.freeze({
    volume: 'docs/DESIGN_FP_ARCH_HB.md',
    walker: 'tests/lint/habitBandsReconciliation.walker.test.js',
    blockLiteral: `/^\\*\\*(HB-\\d+) ${DASH} /`,
  }),
  SP: Object.freeze({
    volume: 'docs/DESIGN_FP_ARCH_SP.md',
    walker: 'tests/lint/spBandFamilies.walker.test.js',
    blockLiteral: '/^### ((?:SP|WR|GR|TR|WF|POP|IN|INT|CW)-[A-Z0-9]+)\\b/',
  }),
});

/**
 * Prefixes that were already bearing bands when this instrument landed (2026-09-15). SHRINK
 * ONLY: a prefix leaves this list by gaining a reconciler, and the list may not grow - a new
 * family's first band is a STOP exactly as LG's is.
 */
const FROZEN_UNRECONCILED = Object.freeze(['CV', 'CW', 'GR', 'IN', 'INT', 'POP', 'TB', 'TR', 'WF', 'WR']);

/** The measured size of that backlog at the landing. A ceiling, never a floor. */
const FROZEN_CEILING = 10;

/**
 * ⭐ THE Q10 ROW. A prefix here may not bear a band at all until a reconciler exists for it.
 * LG is the member ODQ §99.3 names, and long-tail #33 is the consumer that will trip it.
 */
const REQUIRE_RECONCILIATION = Object.freeze(['LG']);

const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

function tree(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) tree(p, out);
    else out.push(p);
  }
  return out;
}

/**
 * The wave a line opens, in whichever shape it uses, or null.
 * @param {string} line @returns {{ waveId: string, shape: string } | null}
 */
function waveOpenedBy(line) {
  for (const { shape, re } of BLOCK_SHAPES) {
    const m = line.match(re);
    if (m) return { waveId: m[1], shape };
  }
  return null;
}

/**
 * Every band declaration in one document, attributed to the wave block above it.
 * @param {string} rel @param {string} src
 * @returns {{ file: string, line: number, waveId: string | null, prefix: string | null, shape: string | null }[]}
 */
function bandsIn(rel, src) {
  const lines = src.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (!BANDS_LINE.test(lines[i])) continue;
    let owner = null;
    for (let j = i; j >= 0; j -= 1) {
      const hit = waveOpenedBy(lines[j]);
      if (hit) { owner = hit; break; }
      if (j !== i && SECTION_BREAK.test(lines[j])) break;
    }
    out.push({
      file: rel,
      line: i + 1,
      waveId: owner ? owner.waveId : null,
      prefix: owner ? owner.waveId.split('-')[0] : null,
      shape: owner ? owner.shape : null,
    });
  }
  return out;
}

/**
 * ⭐ THE PREDICATE UNDER TEST. Every reason a band may not stand where it stands, in the
 * words the lane that trips it will read. Pure over its argument, so the planted controls
 * below drive the SAME code the live assertion drives.
 * @param {ReturnType<typeof bandsIn>} bands @returns {string[]}
 */
function stopsFor(bands) {
  const stops = [];
  for (const band of bands) {
    const at = `${band.file}:${band.line}`;
    if (!band.waveId) {
      stops.push(`${at}: a Bands line with no wave block above it. A band nobody can attribute`
        + ' to a wave reaches no tuning table and therefore no signature.');
      continue;
    }
    if (RECONCILED[band.prefix]) continue;
    if (FROZEN_UNRECONCILED.includes(band.prefix)) continue;
    if (REQUIRE_RECONCILIATION.includes(band.prefix)) {
      stops.push(`${at}: ${band.waveId} declares a band under prefix ${band.prefix}, and`
        + ` ${band.prefix} is the prefix ODQ §99.3 holds open. Land the reconciling walker for`
        + ' this volume and move the prefix to RECONCILED in the same commit; the band may not'
        + ' land first.');
      continue;
    }
    stops.push(`${at}: ${band.waveId} bands under prefix ${band.prefix}, which is on no roster`
      + ' row. A new family may not author its first band before a walker reconciles it against'
      + " the volume's tuning table.");
  }
  return stops;
}

/**
 * The wave ids one reconciler's own block regex can see in one document.
 * @param {string} blockLiteral @param {string} src @returns {Set<string>}
 */
function visibleWaves(blockLiteral, src) {
  const re = new RegExp(blockLiteral.slice(1, -1));
  const seen = new Set();
  for (const line of src.split('\n')) {
    const m = line.match(re);
    if (m) seen.add(m[1]);
  }
  return seen;
}

/** The band-bearing wave ids of one document, sorted. */
const bearingIn = (bands, rel) => [...new Set(bands.filter((b) => b.file === rel).map((b) => b.waveId))].sort();

const DOC_FILES = tree(join(ROOT, 'docs'))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .filter((rel) => rel.endsWith('.md'))
  .sort();
const VOLUMES = DOC_FILES.filter((rel) => DESIGN_VOLUME.test(rel));
const MEASURED = VOLUMES.flatMap((rel) => bandsIn(rel, read(rel)));
const BEARING_PREFIXES = [...new Set(MEASURED.map((b) => b.prefix))].sort();
const ROSTERED_BEARING = [...new Set([...Object.keys(RECONCILED), ...FROZEN_UNRECONCILED])].sort();
const NON_VOLUME_BANDS = DOC_FILES
  .filter((rel) => !DESIGN_VOLUME.test(rel))
  .map((rel) => ({ rel, count: (read(rel).match(/^(?:- )?\*\*Bands\b/gm) || []).length }))
  .filter(({ count }) => count > 0);

describe('Q10 - the band-prefix roster (ODQ §99.3; first consumer: long-tail #33, the LG family)', () => {
  test('guard the guard: the discovery sees a real denominator, in more than one block shape', () => {
    // Every absence asserted below rests on these four. A parser that stopped matching would
    // report an empty population and pass having proved nothing at all.
    expect(VOLUMES.length).toBeGreaterThanOrEqual(50);
    expect(MEASURED.length).toBeGreaterThanOrEqual(60);
    expect(BEARING_PREFIXES.length).toBeGreaterThanOrEqual(10);
    // LIVENESS, NOT AN EXACT SET. Two shapes are exercised by the tree today (heading and
    // bold); the third is LG's bullet ladder and is exercised by the planted control below.
    // Pinning the set exactly would have made a volume adopting a new shape red HERE, on the
    // guard, and a guard that reds for the wrong reason hides the arm it is guarding.
    const shapes = [...new Set(MEASURED.map((b) => b.shape))].sort();
    expect(shapes.length, 'the discovery attributed every band through one block shape, so the'
      + ' shape-agnostic claim is untested').toBeGreaterThanOrEqual(2);
    for (const shape of ['bold', 'heading']) {
      expect(shapes, `the ${shape} block shape parsed nothing in the live tree`).toContain(shape);
    }
  });

  test('the letter-suffixed wave ids that already bear bands are SEEN (CR-HB0B-BANDGAP habitat)', () => {
    // The gap HB-0B recorded and declined to close is not hypothetical: eleven waves in the
    // tree today carry a letter suffix AND a band. Proving the discovery sees them is what
    // makes the visibility arm below a measurement rather than a hope.
    const suffixed = [...new Set(MEASURED.map((b) => b.waveId).filter((w) => /\d[a-z]$/.test(w)))].sort();
    expect(suffixed.length, 'no letter-suffixed wave bears a band, so the suffix tolerance'
      + ' below would be unexercised').toBeGreaterThanOrEqual(8);
  });

  test('every Bands line in a design volume belongs to a wave block: there is no orphan band', () => {
    const orphans = MEASURED.filter((b) => !b.waveId).map((b) => `${b.file}:${b.line}`);
    expect(orphans, 'a band declaration stands under no wave. It names a tuned value that no'
      + ' wave owns, so no compile prices it and no signature reaches it').toEqual([]);
  });

  test('the band-bearing prefixes are EXACTLY the roster: a new prefix STOPS, a spent row is banked', () => {
    expect(
      BEARING_PREFIXES,
      'the measured band-bearing prefixes and the roster disagree. A prefix in the tree and not'
      + ' on the roster is the Q10 STOP and needs a reconciler, not a row; a prefix on the roster'
      + ' bearing nothing is a win that must be banked by deleting its row.',
    ).toEqual(ROSTERED_BEARING);
  });

  test('no prefix is both reconciled and frozen, and the backlog may only shrink', () => {
    const both = Object.keys(RECONCILED).filter((p) => FROZEN_UNRECONCILED.includes(p));
    expect(both, 'a prefix claims a reconciler and a frozen row at once').toEqual([]);
    expect(
      FROZEN_UNRECONCILED.length,
      'the unreconciled backlog grew. A prefix leaves this list by gaining a walker; it never'
      + ' joins, because joining is how the Q10 debt was allowed to sit open since 2026-08-15.',
    ).toBeLessThanOrEqual(FROZEN_CEILING);
    const requiredAlsoRostered = REQUIRE_RECONCILIATION
      .filter((p) => RECONCILED[p] || FROZEN_UNRECONCILED.includes(p));
    expect(requiredAlsoRostered, 'a prefix held open for a reconciler also claims a row').toEqual([]);
  });

  test('⭐ THE STOP IS ARMED AND CLEAR: the live tree carries no band this roster refuses', () => {
    // The predicate every planted control below drives, driven here against the real tree.
    // Its denominator was proven live in the first arm, so an empty result is a measurement.
    expect(
      stopsFor(MEASURED),
      'a band stands where this roster refuses it. The message names the file, the line, the'
      + ' wave and the reason; do not widen the roster to silence one.',
    ).toEqual([]);
  });

  test('⭐ LG bears no band yet, and its row demands a reconciler before the first one', () => {
    // ODQ §99.3, and DESIGN_FP_ARCH_LG.md §5's refusal "no band before the Q10 prefix".
    expect(REQUIRE_RECONCILIATION).toEqual(['LG']);
    expect(BEARING_PREFIXES.filter((p) => p === 'LG')).toEqual([]);
    expect(Object.keys(RECONCILED).filter((p) => p === 'LG')).toEqual([]);
  });

  test('every band-bearing wave is VISIBLE to the walker that reconciles its prefix', () => {
    /** @type {string[]} */
    const problems = [];
    for (const [prefix, row] of Object.entries(RECONCILED)) {
      const walkerSrc = read(row.walker);
      const occurrences = walkerSrc.split(row.blockLiteral).length - 1;
      if (occurrences !== 1) {
        problems.push(`${prefix}: the block regex pinned here appears ${occurrences} times in`
          + ` ${row.walker} rather than once. Re-anchor this row against that file's parser`
          + ' before trusting anything measured through it.');
        continue;
      }
      const volumeSrc = read(row.volume);
      const visible = visibleWaves(row.blockLiteral, volumeSrc);
      if (visible.size === 0) {
        problems.push(`${prefix}: the reconciler's block regex matches nothing in ${row.volume}`);
        continue;
      }
      const invisible = bearingIn(MEASURED, row.volume).filter((w) => !visible.has(w));
      if (invisible.length > 0) {
        problems.push(`${prefix}: ${row.volume} declares bands for ${invisible.join(', ')}, and`
          + ` ${row.walker} cannot see those blocks. This is CR-HB0B-BANDGAP: their bands reach`
          + " no tuning table and no owner's signature. Widen that walker's block regex, or"
          + ' re-spell the wave heading it already admits.');
      }
    }
    expect(problems).toEqual([]);
  });

  test('a Bands line outside the design volumes lives in a packet manifest, nowhere else', () => {
    expect(NON_VOLUME_BANDS.length, 'no document outside the volumes carries a Bands line, so'
      + ' this arm would assert nothing').toBeGreaterThanOrEqual(1);
    const escaped = NON_VOLUME_BANDS
      .filter(({ rel }) => !rel.startsWith(PACKET_TREE))
      .map(({ rel }) => rel);
    expect(
      escaped,
      'a Bands line was authored outside both the design volumes and the packet tree. A band'
      + ' declared where no roster looks is exactly the invisibility Q10 exists to refuse.',
    ).toEqual([]);
  });

  test('MEASURED REFUSAL: the nine-prefix alternation is applied to the SP volume alone', () => {
    // Why widening that alternation would have been a no-op, asserted rather than argued.
    const src = read(RECONCILED.SP.walker);
    expect(src.split('waveBlocks(').length - 1, 'the SP walker\'s block parser gained or lost a'
      + ' call site. If its alternation now reads a second document, this refusal is stale and'
      + ' Q10\'s wording may have become literal after all.').toBe(2);
    expect(src.includes('waveBlocks(spSrc)')).toBe(true);
    expect(src.includes('LG-'), 'the SP walker names no LG wave, which is the point: joining the'
      + ' alternation there would have changed nothing').toBe(false);
  });
});

describe('Q10 - the planted controls: what the roster must refuse', () => {
  test('NEGATIVE CONTROL: a planted LG band is REFUSED, and the bullet shape is exercised', () => {
    // LG's §4 wave ladder on the ledger branch authors its waves as bullet paragraphs, so the
    // plant is the real shape this prefix will arrive in rather than a convenient one.
    const planted = [
      '## §4 THE WAVE LADDER (declared)',
      '',
      `- **LG-2 ${DASH} FLEETS** (mints \`vesselFleetsEnabled\`): derived counts, stored commitments.`,
      '- **Bands:** the airship speed factor · the two capacity families · the rebuild coefficients',
      '',
    ].join('\n');
    const bands = bandsIn('docs/DESIGN_FP_ARCH_LG.md', planted);
    // The plant is PROVEN to have landed before any refusal is asserted: a control that plants
    // nothing passes while measuring nothing.
    expect(bands.map((b) => `${b.waveId}/${b.shape}`)).toEqual(['LG-2/bullet']);
    const stops = stopsFor(bands);
    expect(stops.length).toBe(1);
    expect(stops[0]).toContain('LG-2');
    expect(stops[0]).toContain('§99.3');
    // ...and the same band under a prefix that HAS a reconciler is not refused, so the refusal
    // discriminates rather than rejecting every band it is shown.
    expect(stopsFor(bandsIn('docs/DESIGN_FP_ARCH_SP.md', planted.replace(/LG-2/g, 'SP-A')))).toEqual([]);
  });

  test('NEGATIVE CONTROL: a planted band under an unrostered prefix is REFUSED (the class)', () => {
    const planted = [
      '## §5 THE WAVES',
      '',
      `### XQ-1 ${DASH} A FAMILY NOBODY HAS ROSTERED`,
      '',
      '**Bands:** a weight nobody signed · a half-life nobody derived',
      '',
    ].join('\n');
    const bands = bandsIn('docs/DESIGN_FP_ARCH_XQ.md', planted);
    expect(bands.map((b) => b.waveId)).toEqual(['XQ-1']);
    const stops = stopsFor(bands);
    expect(stops.length).toBe(1);
    expect(stops[0]).toContain('on no roster row');
  });

  test('NEGATIVE CONTROL: a letter-suffixed block its reconciler cannot see is REFUSED (BANDGAP)', () => {
    // The gap HB-0B recorded, executed. The block is spliced into the real HB volume, in the
    // real HB block shape, with the one difference the record names: a letter suffix.
    const row = RECONCILED.HB;
    const volumeSrc = read(row.volume);
    const anchor = `**HB-9 ${DASH} `;
    expect(volumeSrc.split(anchor).length - 1, 'the HB volume\'s last wave heading moved').toBe(1);
    const mutated = volumeSrc.replace(anchor, [
      `**HB-9b ${DASH} THE LETTER-SUFFIXED MICRO-ACT.**`,
      '**Bands:** a rung weight nobody signed',
      '',
      anchor,
    ].join('\n'));
    const mutatedBands = bandsIn(row.volume, mutated);
    const mutatedBearing = [...new Set(mutatedBands.map((b) => b.waveId))].sort();
    // The plant landed: this roster sees the suffixed wave.
    expect(mutatedBearing).toContain('HB-9b');
    expect(mutatedBearing.length).toBe(bearingIn(MEASURED, row.volume).length + 1);
    // The reconciler does not: exactly the invisibility CR-HB0B-BANDGAP describes.
    const visible = visibleWaves(row.blockLiteral, mutated);
    const invisible = mutatedBearing.filter((w) => !visible.has(w));
    expect(invisible, 'the HB walker now sees a letter-suffixed block, so this control plants'
      + ' nothing and the visibility arm above proves nothing').toEqual(['HB-9b']);
    // ...and the arm above is what reports it, so the STOP is the instrument's and not this
    // control's private arithmetic.
    expect(bearingIn(MEASURED, row.volume).filter((w) => !visible.has(w))).toEqual([]);
  });

  test('NEGATIVE CONTROL: a Bands line with no wave block above it is REFUSED as an orphan', () => {
    const planted = [
      '## §7 THE TUNING SURFACE',
      '',
      '**Bands:** a row that floated free of every wave',
      '',
    ].join('\n');
    const bands = bandsIn('docs/DESIGN_FP_ARCH_SP.md', planted);
    expect(bands.map((b) => b.waveId)).toEqual([null]);
    const stops = stopsFor(bands);
    expect(stops.length).toBe(1);
    expect(stops[0]).toContain('no wave block above it');
  });
});
