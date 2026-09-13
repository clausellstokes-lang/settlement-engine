/**
 * proseMarkCard.walker.test.js — SECTION (2b) OF THE MARKER'S CARD: WHAT A FACE MAY NOT DENY
 * OF THE REQUIRED ROWS (brief ADDENDUM 18 ruling 4, the marker writes what would be false;
 * REWRITE car 8b-W-18k).
 *
 * THE MEASURED CAUSE THIS ARM STANDS OVER. On the first pool of the re-cut — DS-DEF-2 ::
 * `Invasion & War: walls with NO force` — BOTH writer seats denied arms of the persons on gate
 * duty ("Nobody who asked him was under arms") on a preimage whose town tier requires a `Town
 * watch`: a row whose service menu turns `Gate duty` on at p 0.8, and which `deriveArmedForces`
 * files under `standing`. And both placed the burial ground outside the wall, on tiers whose
 * catalog row says nothing of the kind. Section (2) of the card NAMED the required rows; it
 * never said what a required row MEANS, so two independent writers inferred the rest — which
 * is floor 1 and floor 2 by inference, the failure mode the Fable sitting found is the real one.
 *
 * THE PROPERTY, IN BOTH DIRECTIONS:
 *   1. THE SECTION IS PROJECTED FROM THE ENGINE'S OWN DATA. Every line is read out of
 *      `institutionalCatalog`, `INSTITUTION_SERVICES` and the AST of `deriveArmedForces`, and
 *      the arms assert the printed line against the value it came from.
 *   2. A PLANT MOVES THE LINE BY NAME. The placement reader and the service reader are pure,
 *      so a planted desc and a planted bar are object literals in memory: a section that
 *      ignored its input would pass arm 1 and fail these.
 *
 * ⛔ NO COMMITTED BYTE IS TOUCHED. The card is read-only and the plants never leave memory.
 *
 * @enforced-by this file
 */
import { describe, expect, it } from 'vitest';

import {
  HEDGE_WORDS, PLACEMENT_PHRASES, SERVICE_P_BAR, armedForcesFiling, placementClaimsIn,
  requiredRowsByTier, servicesAtOrAboveBar,
} from '../../scripts/lib/prose-mark-fields.mjs';
import { buildCard, cardLines } from '../../scripts/prose-mark-card.mjs';

/** The pool the brief names, and the one the failure was measured on. */
const BLOCK = 'DS-DEF-2';
const POOL = 'Invasion & War: walls with NO force';

const card = await buildCard(BLOCK, POOL);
const lines = cardLines(card);
const section = lines.slice(lines.findIndex((l) => l.startsWith('(2b)')), lines.findIndex((l) => l.startsWith('(3)')));

describe('the marker\'s card, section (2b) — what a face may not deny of the required rows (car 8b-W-18k)', () => {
  it('⭐ THE LINE THE BRIEF ASKS FOR: the Town watch seats Gate duty at p 0.8 and is filed under `standing`', () => {
    const watch = section.find((l) => l.trim().startsWith('Town watch'));
    expect(watch, 'the Town watch row is printed at all').toBeTruthy();
    expect(watch).toContain('required at town');
    expect(watch).toContain('a face may not deny:');
    expect(watch).toContain('Gate duty (p 0.8)');
    expect(watch).toContain('Night patrol (p 1)');
    expect(watch, 'the derivation, not a roster name').toContain('filed under standing (deriveArmedForces)');
    // ⛔ AND THE NOTE THAT MAKES IT ACTIONABLE: `standing` is under arms even where the key
    // fixes no garrison and no militia, which is exactly this pool's key.
    expect(section.join('\n')).toContain('is UNDER ARMS in the engine\'s reading even where the key fixes no garrison and no militia');
  });

  it('the three figures on that line are the engine\'s own, read again from the data', () => {
    const services = card.mayNotDeny.find((r) => r.name === 'Town watch').services;
    expect(services.map((s) => [s.service, s.p])).toEqual([['Night patrol', 1], ['Gate duty', 0.8]]);
    expect(services.every((s) => s.p >= SERVICE_P_BAR), 'nothing under the bar is printed').toBe(true);
    expect(SERVICE_P_BAR, 'the brief\'s number, not a tuning').toBe(0.8);
    // The filing is READ FROM THE DERIVATION'S AST, so a car that moved the watch out of
    // `standing` moves this line rather than leaving the card saying something false.
    const filing = armedForcesFiling();
    expect(filing.watch).toBe('standing');
    expect(filing.garrison, 'the other two the same field folds').toBe('standing');
    expect(filing.militia).toBe('standing');
    expect(filing.walls).toBe('fortifications');
    expect(filing.mercenary).toBe('contracted');
  });

  it('every required row of the preimage is printed, with the tiers it is required at', async () => {
    const required = await requiredRowsByTier();
    const want = [...new Set(card.key.preimageTiers.flatMap((t) => required[t].map((r) => r.name)))].sort();
    expect(card.mayNotDeny.map((r) => r.name)).toEqual(want);
    expect(want.length, 'the preimage really has required rows').toBeGreaterThan(10);
    for (const row of card.mayNotDeny) {
      expect(row.at.length, `${row.name} is required somewhere in the preimage`).toBeGreaterThan(0);
      for (const tier of row.at) expect(card.key.preimageTiers).toContain(tier);
      const printed = section.find((l) => l.trim().startsWith(`${row.name} (`));
      expect(printed, `${row.name} is printed`).toBeTruthy();
      expect(printed).toContain(`(required at ${row.at.join(', ')})`);
    }
  });

  it('⭐ THE PLACEMENT BARS: the burial ground the writers moved is barred BY NAME, and the bar says why', () => {
    const burial = card.placementBars.find((p) => p.row === 'Burial ground');
    expect(burial, 'the row both writer seats got wrong').toBeTruthy();
    expect(burial.phrase).toBe('at the edge');
    expect(burial.why, 'stated at one preimage tier and silent at the others').toMatch(/stated only at hamlet/);
    expect(burial.why).toMatch(/silent at thorp, village, town/);
    expect(section.join('\n')).toContain('Burial ground: "at the edge"');
    // The parish grounds state a DIFFERENT placement at the town tier, which is the same bar
    // from the other side: a face drawing on the whole preimage may assert neither.
    const parish = card.placementBars.find((p) => p.row === 'Parish burial grounds');
    expect(parish.phrase).toBe('beyond the gate');
    expect(parish.why).toMatch(/stated only at town/);
    // ⛔ AND THE RULE IS PRINTED, not left for the marker to infer.
    expect(section.join('\n')).toContain('a placement the data states only at the city is an INVENTION on the thorp');
  });

  it('PLANT: a placement the data hedges is barred as a tendency, and one stated at every preimage tier is not barred at all', () => {
    // The reader is pure, so the plants are strings.
    const hedged = placementClaimsIn('The ground lies outside the walls in most towns of this size.');
    expect(hedged).toHaveLength(1);
    expect(hedged[0].phrase).toBe('outside the walls');
    expect(hedged[0].hedged, 'a "most" makes it a tendency').toBe(true);
    const flat = placementClaimsIn('The ground lies outside the walls.');
    expect(flat[0].hedged, 'the same placement, stated flat').toBe(false);
    expect(placementClaimsIn('The households keep it in turn.'), 'no placement at all').toEqual([]);
    // ⛔ THE ALTERNATION BUG THIS SECTION SHIPPED WITH, HELD DOWN BY NAME. An ungrouped
    // `\bat|by the gate` matched the word "Attendance" and put four false bars on the first
    // card printed; every phrase is grouped now and the arm drives the exact string.
    expect(placementClaimsIn('Attendance expected of all residents.'), 'not a placement').toEqual([]);
    expect(placementClaimsIn('The bearers wait by the gates.')[0].phrase).toBe('by the gates');
    for (const re of PLACEMENT_PHRASES) {
      expect(re.source.includes('|') ? /\(\?:/.test(re.source) : true, `ungrouped alternation in ${re}`).toBe(true);
    }
    expect(HEDGE_WORDS.some((h) => h.test('in most towns'))).toBe(true);
    expect(HEDGE_WORDS.some((h) => h.test('the ground lies outside the walls'))).toBe(false);
  });

  it('PLANT: the service bar really bars — a row with nothing at or above it prints so, and a lower bar admits more', async () => {
    const atBar = await servicesAtOrAboveBar('Town watch');
    const lower = await servicesAtOrAboveBar('Town watch', 0.5);
    expect(atBar.map((s) => s.service)).toEqual(['Night patrol', 'Gate duty']);
    expect(lower.map((s) => s.service), 'Crime response is p 0.7 and OFF by default').toEqual(['Night patrol', 'Gate duty', 'Crime response']);
    expect(lower.find((s) => s.service === 'Crime response').on, 'carried, never filtered on').toBe(false);
    expect(await servicesAtOrAboveBar('a row the catalogue does not have'), 'no menu is empty, not a throw').toEqual([]);
    // A row whose menu is empty prints the absence rather than an empty list the marker
    // could read as "denies nothing".
    const noMenu = card.mayNotDeny.find((r) => r.services.length === 0);
    expect(noMenu, 'the preimage has at least one such row').toBeTruthy();
    expect(section.find((l) => l.trim().startsWith(`${noMenu.name} (`)))
      .toContain('(no service menu at or above the bar)');
  });

  it('the section is MECHANICAL: it prints no verdict of its own, and sections (8) and (9) stay the marker\'s', () => {
    // Numbered (2b) and not (3), so the workflow's nine-section MARK prompt is not renumbered.
    expect(lines.filter((l) => /^\(2b\)/.test(l)), 'exactly one (2b) header').toHaveLength(1);
    expect(lines.filter((l) => /^\(3\) THE SAME-PAGE READ SET/.test(l)), '(3) is still the read set').toHaveLength(1);
    expect(lines.filter((l) => /^\(7\) /.test(l)), '(7) is still the universal sources').toHaveLength(1);
    expect(lines.some((l) => /^\(8\)/.test(l)), 'the card prints no (8): it is the marker\'s own').toBe(false);
  });
});
