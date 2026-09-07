/**
 * narrativeArchiveDisclosure.test.js — Wave R-1 Lane D: the
 * eventNarrativeSnapshots cap disclosure pin (SETTLEMENT_CAPABILITY_ATLAS
 * A20 / VI.4 #76b), extended by the R-1 must-fix conditional-truth pins.
 *
 * Applying a canon event on a narrated save stamps the pre-event settlement
 * narrative into the save's `aiData.eventNarrativeSnapshots` archive, which
 * silently FIFO-drops past MAX_EVENT_NARRATIVE_SNAPSHOTS entries (both
 * writers — settlementSlice applyEvent tail and canonEventCommandTransaction
 * — route through the shared appendEventNarrativeSnapshot helper). The
 * archive is paid AI output; dropping it undisclosed was the hidden-FIFO
 * class of atlas gap VI.4.
 *
 * The disclosure lives in the StaleNarrativeModal body (`staleNarrative.body`
 * in src/copy/en.js) — the modal fires post-apply on narrated saves, the
 * exact user-facing moment of the stamp. The archive has NO reader surface
 * yet; Wave R-2 mounts the reader and carries the disclosure to it (recorded
 * in the copy block comment).
 *
 * THE CLAIM MUST BE CONDITIONAL (R-1 must-fix): the modal's gate is
 * `aiSettlement || aiDailyLife` (EventComposer), but BOTH stamp writers
 * archive only when the save row carries a SETTLEMENT narrative (and the
 * event an id). An unconditional "is stamped into the archive" sentence lied
 * to a daily-life-only save. The sentence now keys the claim on exactly the
 * writers' condition, so every reachable modal state reads a true sentence:
 *   1. settlement-narrated  → antecedent true, stamp happens (helper pin);
 *   2. daily-life-only      → antecedent false, no promise made (writer-read pin);
 *   3. no-eventId           → helper no-ops, AND the state is unreachable from
 *      the modal surface because buildEvent unconditionally mints an id
 *      (reachability pin below).
 *
 * The cap pin couples the copy to the REAL constant: raising or lowering
 * MAX_EVENT_NARRATIVE_SNAPSHOTS without updating the user-facing sentence
 * fails here instead of silently lying.
 */
import { describe, expect, test } from 'vitest';
import { en } from '../../src/copy/index.js';
import {
  appendEventNarrativeSnapshot,
  MAX_EVENT_NARRATIVE_SNAPSHOTS,
} from '../../src/store/eventNarrativeSnapshots.js';
import { buildEvent } from '../../src/components/settlement/eventComposer/buildEvent.js';

describe('eventNarrativeSnapshots cap disclosure (atlas A20)', () => {
  test('the stale-narrative modal body discloses the archive and its cap, using the live constant', () => {
    const body = en.staleNarrative.body;
    expect(body).toMatch(/archive/);
    expect(body).toContain(`last ${MAX_EVENT_NARRATIVE_SNAPSHOTS}`);
  });

  test('the disclosure does not overclaim a reader surface before Wave R-2 mounts one', () => {
    // "stamped into the save's archive" states retention, not readability —
    // the copy must not promise browsing/viewing until the reader exists.
    expect(en.staleNarrative.body).not.toMatch(/browse|view them|read them|revisit/i);
  });

  test('the archive claim is scoped by the settlement-narrative conditional, in the same sentence', () => {
    // De-conditionalizing the sentence re-breaks the daily-life-only state
    // (modal shows, nothing archives). The sentence that mentions the archive
    // must BE the conditional sentence, keyed on the save carrying a
    // settlement narrative — the exact condition both stamp writers read.
    const sentences = en.staleNarrative.body.split(/(?<=\.)\s+/);
    const archiveSentence = sentences.find(s => /archive/.test(s));
    expect(archiveSentence).toBeTruthy();
    expect(archiveSentence).toMatch(/^If this save carries a settlement narrative/);
  });
});

describe('the conditional sentence is true in every reachable modal state (R-1 must-fix)', () => {
  const settlementNarrative = { thesis: 'the town endures' };
  const dailyLife = { dawn: 'bread carts creak' };

  test('state 1 — settlement-narrated: the promised stamp actually happens', () => {
    // Mirrors both writers: aiData carries aiSettlement, the event has an id.
    const aiData = { aiSettlement: settlementNarrative, aiDailyLife: dailyLife };
    const next = appendEventNarrativeSnapshot(aiData, {
      eventId: 'e1', aiSettlement: aiData.aiSettlement, ts: 't1',
    });
    expect(next.eventNarrativeSnapshots).toHaveLength(1);
    expect(next.eventNarrativeSnapshots[0].eventId).toBe('e1');
  });

  test('state 2 — daily-life-only: the writers read no settlement narrative, so nothing stamps', () => {
    // Both stamp sites read `beforeSave?.aiData?.aiSettlement` before calling
    // the helper; on a daily-life-only save that read is undefined and the
    // helper no-ops (same-reference return = no archive write). The copy's
    // antecedent ("carries a settlement narrative") is false here, so the
    // sentence promises nothing — conditional truth, not a broken promise.
    const aiData = { aiDailyLife: dailyLife };
    const next = appendEventNarrativeSnapshot(aiData, {
      eventId: 'e1', aiSettlement: aiData.aiSettlement, ts: 't1',
    });
    expect(next).toBe(aiData);
    expect(next.eventNarrativeSnapshots).toBeUndefined();
  });

  test('state 3 — no-eventId: the helper no-ops, and the modal surface cannot reach this state', () => {
    // Helper half: without an event id there is no archive write.
    const aiData = { aiSettlement: settlementNarrative };
    expect(appendEventNarrativeSnapshot(aiData, { aiSettlement: settlementNarrative })).toBe(aiData);

    // Reachability half: the StaleNarrativeModal is raised only by
    // EventComposer, and every event it applies goes through buildEvent,
    // which unconditionally mints an id when the compose session has none
    // (`id: sessionEventId || mintComposeEventId()`). So the conditional
    // sentence can never render against a stamp skipped for a missing id.
    const minimalForm = {
      type: 'DAMAGE_INSTITUTION', effectiveTarget: 'inst_1', description: '',
      severity: 0.7, phase: 'canon', settlement: {},
      // sessionEventId deliberately absent — the composer's empty-session case.
    };
    const event = buildEvent(minimalForm);
    expect(event.id).toMatch(/^ev_/);
    const withEmptySession = buildEvent({ ...minimalForm, sessionEventId: '' });
    expect(withEmptySession.id).toMatch(/^ev_/);
  });
});
