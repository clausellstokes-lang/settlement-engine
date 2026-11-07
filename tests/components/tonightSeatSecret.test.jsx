/**
 * Lane R11, unit 2 (R7, the chair's ruling): the seam "Wants to <a sentence>" cured at its SOURCE.
 *
 * Measured at the base (docs/READER_R11_TONIGHT_WANTS_2026-11-04.md §2): on the sixty, all twelve
 * seam lines are ONE mechanism — the seat-holder who also keeps the crisis's own secret is voiced
 * once, with the secret, but kept `why: 'seat'`, so every renderer printed the secret after
 * "Wants to". No `goal.short` held a sentence (0 of 597 NPCs). The sheet now says what the line
 * is (`says`), and the three renderers print a secret as a secret (`printsAsWant`).
 *
 * Seeds: the twelve seam settlements of the base sixty, born the soak's way.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { htmlToText } from '../../scripts/audit/soak-review/renderHarness.mjs';
import TonightSheet from '../../src/components/TonightSheet.jsx';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { composeTonightSheet, printsAsWant, secretLeadOf, TONIGHT_COPY } from '../../src/domain/summary/tonightSheet.js';
import { tonightWantsFindings } from '../../src/domain/coherence/readerBattery.js';

const SEAM_SEEDS = [2, 10, 14, 18, 22, 37, 38, 42, 45, 51, 53, 59];
/** @type {Record<number, any>} */
const born = {};
beforeAll(async () => {
  await ensureLaws();
  for (const i of SEAM_SEEDS) born[i] = birth(i).settlement;
}, 300_000);

describe('R11 · R7: a kept secret never prints after "Wants to"', () => {
  it.each(SEAM_SEEDS)('soak1k-%i: the seat-holder who keeps the crisis secret is voiced with it, as a secret', (i) => {
    const sheet = composeTonightSheet(born[i]);
    const seat = sheet.people.find((p) => p.why === 'seat');
    expect(seat, 'the seat-holder is voiced').toBeDefined();
    expect(seat.says).toBe('secret');
    expect(printsAsWant(seat)).toBe(false);
    expect(secretLeadOf(seat)).toBe(`${TONIGHT_COPY.secret}:`);
    const text = htmlToText(renderToStaticMarkup(React.createElement(TonightSheet, { sheet, palette: {} })));
    expect(tonightWantsFindings(born[i], { tonight: text }).filter((f) => f.detail.startsWith('[sentence-not-a-want]'))).toEqual([]);
    expect(text).toContain(`${TONIGHT_COPY.secret}: ${seat.line}`);
  });

  it('the Foundry journal prints the kept secret as a secret too', () => {
    const s = born[22];
    const seat = composeTonightSheet(s).people.find((p) => p.why === 'seat');
    const page = JSON.stringify(buildJournalPages(buildViewModel({ settlement: s }))).replace(/\\'|&#39;|&#x27;/g, "'");
    expect(page).toContain(`${TONIGHT_COPY.secret}: ${seat.line.slice(0, 40)}`);
    expect(page).not.toContain(`${TONIGHT_COPY.wants} ${seat.line}`); // anchored: the secret line is matched in this same page on the line above
    expect(page).not.toMatch(/Wants to [A-Z]/); // anchored: this same page is proven to carry the seat's secret line two lines above
    expect(page).toContain(TONIGHT_COPY.title);
  });

  it('printsAsWant reads a hand-built person by its why', () => {
    expect(printsAsWant({ why: 'seat' })).toBe(true);
    expect(printsAsWant({ why: 'secret' })).toBe(false);
    expect(printsAsWant({ why: 'cleric', says: 'temperament' })).toBe(false);
  });
});
