/**
 * tests/domain/successionQuestionPrint.pin.test.js — THE SUCCESSION QUESTION PRINTS NAMES, NEVER IDS
 * (STYLE-RULINGS-2 C1 row added by the chair to SW-11 from FIX-PULSE-DEFECTS' STOP 2: the audit's C2·26).
 *
 * The succession-decision outcome is PERSISTED and deep-validated (treatySuccessionDecision.js ::
 * successionQuestionPayloadTuple pins its headline and summary to the question's ids, and the question
 * carries no names), so the stored strings keep their ids. The cure is at the PRINT SITES: the news card
 * (newsBody.js :: newsCardFace, the queued copy worldPulseFeedCuration files) and the World Pulse panel's
 * proposal card (WorldPulsePanel.jsx, through newsBody.js :: readerHeadline / readerSummary). A planted
 * succession outcome prints the towns' names; the ids never reach the page.
 */
import { describe, expect, it } from 'vitest';

import * as newsBody from '../../src/domain/display/newsBody.js';
import { newsEntryForOutcome } from '../../src/domain/worldPulse/worldPulseFeedCuration.js';

const SETTLEMENT = 'save-7f3a';
const OTHER = 'save-91bc';
const nameById = new Map([[SETTLEMENT, 'Kleinwalde'], [OTHER, 'Bergburg']]);

/** The outcome exactly as treatySuccessionDecision.js :: outcomeFor files it (the validated strings). */
const outcome = Object.freeze({
  id: 'world_pulse.succession_question.k', candidateId: 'world_pulse.succession_question.k',
  candidateType: 'treaty_breached', type: 'treaty', applyMode: 'proposal',
  targetSaveId: SETTLEMENT, affectedSettlementIds: [SETTLEMENT, OTHER], openedTick: 4,
  severity: 0.5,
  headline: `Succession oath decision for ${SETTLEMENT}`,
  summary: `Apply to disavow the oath to ${OTHER}; dismissing or leaving it unanswered honors the oath.`,
  reasons: ['A successor must decide whether to own the fallen holder\'s oath.'],
});

/** The print-site readers, or the raw strings the sites printed before them. */
const headlineOf = (item) => (typeof newsBody.readerHeadline === 'function' ? newsBody.readerHeadline(item, nameById) : item.headline);
const summaryOf = (item) => (typeof newsBody.readerSummary === 'function' ? newsBody.readerSummary(item, nameById) : item.summary);

describe('the succession question at its print sites (C2·26)', () => {
  it('the proposal card names both towns and prints no id', () => {
    const lines = [headlineOf(outcome), summaryOf(outcome)].join(' ');
    expect(lines).toContain('Kleinwalde');
    expect(lines).toContain('Bergburg');
    expect(lines).not.toContain(SETTLEMENT);
    expect(lines).not.toContain(OTHER);
  });

  it('the queued news copy prints the same names on the card face', () => {
    const entry = newsEntryForOutcome(outcome, 4, 'proposal');
    const face = typeof newsBody.newsCardFace === 'function' ? newsBody.newsCardFace(entry, { nameById }) : { body: entry.summary };
    const printed = [face.headline ?? entry.headline, face.body].join(' ');
    expect(printed).toContain('Kleinwalde');
    expect(printed).not.toContain(SETTLEMENT);
    expect(printed).not.toContain(OTHER);
  });

  it('an ordinary headline passes through the readers unchanged', () => {
    const plain = { headline: 'Kleinwalde mobilizes for war', summary: 'Kleinwalde arms.' };
    expect(headlineOf(plain)).toBe(plain.headline);
    expect(summaryOf(plain)).toBe(plain.summary);
  });
});
