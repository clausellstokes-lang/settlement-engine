/**
 * proseTasteInterested.walker.test.js — THE INTERESTED FACT, BOTH WAYS (TASTE car M-6;
 * SITTING §Q.3 and §R c-22; the owner's 2026-09-08 "Do it").
 *
 * THE RULE THE ARMS HOLD. A fact whose record-holder is a POWER has two licensed faces on ONE
 * pool: the PLAYER's states it as the office compiled it; the DM's names the holder and its
 * interest, from typed capture, corruption and control facts only. §R c-22 fixes when a fact
 * IS interested — a settlement-wide capture of the ruling structure makes the STATE'S OWN
 * ORGANS (office, court, treasury, watch) interested parties in their own records, and NO
 * OTHER KIND — and the taste composes its example on a BIRTH town whose
 * `powerStructure.criminalCaptureState` is `corrupted`, over a treasury-held fact.
 *
 * ⛔ THE PAIR IS THE INSTRUMENT. One town alone proves nothing: a rule that marked every
 * holder interested and a rule that marked the right ones look identical from inside a single
 * captured town. The CLEAN control is the other half, and every figure below is asserted on
 * both towns.
 *
 * @enforced-by this file
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT } from '../helpers/dossierCorpus.js';
import { spineRows } from '../../src/domain/prose/wiringCensus.js';
import { sourceOfForTown, STATE_ORGAN_KINDS } from '../../src/domain/prose/holderTable.js';
import { INTERESTED_ROW, standingOfTown } from '../../scripts/taste-holders.mjs';
import { INTERESTED_TOWNS, tasteTown } from '../fixtures/tasteTowns.js';

const CENSUS = JSON.parse(readFileSync(join(ROOT, 'docs/content/wiring-census.json'), 'utf8'));
const ROWS = spineRows(CENSUS.rows);

const captured = tasteTown(INTERESTED_TOWNS[0]);
const clean = tasteTown(INTERESTED_TOWNS[1]);

describe('the two fixture towns are the ones §R c-22 names, taken as the generator makes them', () => {
  it('the captured town carries the birth fact and the clean control does not', () => {
    expect(INTERESTED_TOWNS[0].seed).toBe('rate-9-2');
    expect(INTERESTED_TOWNS[1].seed).toBe('rate-3-0');
    expect(captured.powerStructure?.criminalCaptureState, 'the chair\'s own worked example').toBe('corrupted');
    expect(clean.powerStructure?.criminalCaptureState, 'and the control').toBe('none');
    // The tier matters: §R c-22 measured INTERESTED on town and above, and both are towns, so
    // the pair differs by the CAPTURE and not by the size.
    expect(captured.tier).toBe('town');
    expect(clean.tier).toBe(captured.tier);
  });
});

describe('⭐⭐ THE STANDING, PRINTED AND ASSERTED ON BOTH TOWNS', () => {
  const capturedStanding = standingOfTown(captured, ROWS);
  const cleanStanding = standingOfTown(clean, ROWS);

  it('prints the per-kind table and holds the four organs against every other kind', () => {
    const line = (label, s, town) => `\n[interested] ${label} · ${town.name} · ${town.tier}`
      + ` · criminalCaptureState ${town.powerStructure?.criminalCaptureState}`
      + `\n  LICENSED rows ${s.licensed} · holder named on ${s.named} · INTERESTED ${s.interested.length}`
      + `\n  by kind (named/interested): ${[...s.byKind].sort()
        .map(([k, v]) => `${k} ${v.named}/${v.interested}`).join(' · ')}`;
    console.log(`${line('CAPTURED', capturedStanding, captured)}`
      + `${line('CLEAN', cleanStanding, clean)}`
      + `\n  the STATE'S ORGANS: ${STATE_ORGAN_KINDS.join(' · ')}\n`);

    // THE SAME REGISTER IS WALKED ON BOTH: 114 LICENSED rows, which is the census's own count.
    expect(capturedStanding.licensed).toBe(CENSUS.totals.sourceLicensedRows);
    expect(cleanStanding.licensed).toBe(CENSUS.totals.sourceLicensedRows);
    // THE CAPTURED TOWN: interested on the STATE ORGANS and on nothing else.
    expect(capturedStanding.interested.length).toBeGreaterThan(0);
    const organKinds = [...capturedStanding.byKind]
      .filter(([, v]) => v.interested > 0).map(([k]) => k).sort();
    expect(organKinds.every((k) => STATE_ORGAN_KINDS.includes(k)),
      `every interested kind is a state organ: ${organKinds.join(' · ')}`).toBe(true);
    for (const [kind, seat] of capturedStanding.byKind) {
      if (STATE_ORGAN_KINDS.includes(kind)) continue;
      expect(seat.interested, `${kind} is not a state organ and cannot be interested`).toBe(0);
    }
    // THE CLEAN CONTROL: no row is interested at all, though it names as many holders.
    expect(cleanStanding.interested).toEqual([]);
    expect(cleanStanding.named).toBeGreaterThan(0);
  });

  it('the taste\'s own row is INTERESTED on the captured town and LICENSED on the clean one', () => {
    const row = ROWS.find((r) => r.block === INTERESTED_ROW.block && r.pool === INTERESTED_ROW.pool);
    expect(row, 'the row the taste composes its interested fact on is in the register').toBeTruthy();
    expect(row.source.kind, 'and it is treasury-held').toBe('treasury');
    const onCaptured = sourceOfForTown(row, captured, {});
    const onClean = sourceOfForTown(row, clean, {});
    expect(onCaptured.standing).toBe('INTERESTED');
    expect(onCaptured.holder, 'the holder is THIS town\'s institution').toBe('Town hall');
    expect(onCaptured.marks.join(' '), 'and the mark names the typed fact it came from')
      .toContain('captured-at-birth');
    expect(onCaptured.marks.join(' ')).toContain('criminalCaptureState corrupted');
    expect(onClean.standing, 'the clean control is licensed and not interested').toBe('LICENSED');
    expect(onClean.holder, 'and its treasury record is kept by a different institution').toBe('Weekly market');
    // ⭐ THE DM FACE HAS A MODEL IN THE CORPUS RATHER THAN AN INVENTION: this pool is one of
    // the seven whose SHIPPED variants already cite a record holder (SEAM car 5b's A13 walk),
    // which is why the chair named it.
    expect(row.source.standing).toBe('LICENSED');
  });

  it('a captured town cannot make a NON-organ holder interested, driven on the fixture', () => {
    // The generalisation the pair cannot show by itself: take every LICENSED row of the
    // captured town whose kinds exclude the four organs, and assert not one is interested.
    const nonOrgan = ROWS.filter((r) => r.source?.standing === 'LICENSED'
      && !(r.source.kinds || []).some((k) => STATE_ORGAN_KINDS.includes(k)));
    expect(nonOrgan.length, 'the register holds rows the rule must NOT reach').toBeGreaterThan(20);
    const wrong = nonOrgan
      .filter((r) => sourceOfForTown(r, captured, {}).standing === 'INTERESTED')
      .map((r) => `${r.block} :: ${r.pool}`);
    expect(wrong, 'a capture of the ruling structure reaches the state\'s own organs and no other kind')
      .toEqual([]);
  });
});
