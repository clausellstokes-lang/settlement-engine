/**
 * tests/domain/doorRouter.test.js — THE ONE DOOR's fore-stage routing pins (C13).
 *
 * The cue table is a VETOABLE vocabulary: these pins document the routing behavior so
 * a veto is a one-line cue edit + pin update. The two laws pinned hard:
 *   1. CONTEXT-FIRST — anything without a strong write-stage cue is an ANALYST question
 *      about the current surface, at the innermost scope ring ('settlement').
 *   2. The ring widens ONLY when the text names a wider ring (realm/product cues).
 */
import { describe, it, expect } from 'vitest';
import { DOOR_DESTINATIONS, DOOR_SCOPES, routeDoorPrompt } from '../../src/domain/intent/doorRouter.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

describe('doorRouter — destinations vocabulary', () => {
  it('exposes the analyst + the four routable workshop stage ids (the reachability denominator)', () => {
    expect(DOOR_DESTINATIONS).toEqual(['analyst', 'content', 'construct', 'apply', 'autonomy']);
    expect(DOOR_SCOPES).toEqual(['settlement', 'realm', 'product']);
    // ⚰ 'style' left with the styleOverhaul capability (ODQ §763.2). Driven through the
    // estate's anchored-negative helper, so an emptied or re-keyed vocabulary reds on the
    // ANCHOR rather than passing as "the id is not in the set" — which is also true of
    // every id that never existed. 'content' is the anchor: a sibling workshop stage id
    // travelling the same table.
    expectAbsentWithAnchor(DOOR_DESTINATIONS, 'style', 'content', 'ODQ §763.2 de-list');
  });

  it('every routed destination is a member of DOOR_DESTINATIONS', () => {
    const samples = [
      'The party sacked the customs house.',
      'keep advancing the world until a war starts',
      'reskin the map in a woodcut style',
      'build me a new town on the river',
      'invent a custom item for the temple',
      'why is the harbor failing?',
      '',
    ];
    for (const s of samples) {
      expect(DOOR_DESTINATIONS).toContain(routeDoorPrompt(s).destination);
    }
  });
});

describe('doorRouter — the cue table (vetoable vocabulary, pinned)', () => {
  it('session recaps route to APPLY (S3 accept→mint)', () => {
    expect(routeDoorPrompt('The party sacked the customs house last session.').destination).toBe('apply');
    expect(routeDoorPrompt('quick recap of what happened at the council').destination).toBe('apply');
  });

  it('run-the-world asks route to AUTONOMY (S7)', () => {
    expect(routeDoorPrompt('keep advancing the world until a war starts').destination).toBe('autonomy');
    expect(routeDoorPrompt('set standing instructions for the campaign').destination).toBe('autonomy');
  });

  // ⚰ THE RETIRED 'style' ROW, MIRRORED (ODQ §763.2, Q-STYLE arm 2). The old pin asserted
  // that look-and-feel asks route to STYLE. Deleting it would have left the de-list
  // unwitnessed, and the failure it must catch is SILENT: SurveyorWorkshop falls back to
  // STAGES[0] for an unknown stage id, so a destination removed WITHOUT its cue row
  // mis-routes every one of these prompts to the Content panel and nothing reds. So the
  // whole retired vocabulary is driven, and each of its eight cues must reach the ANALYST.
  it('RETIRED: every look-and-feel cue now falls to the ANALYST, not to a write stage', () => {
    const retiredCues = [
      'reskin the map in a woodcut style',
      're-style the map',
      'redraw the map',
      'change the look and feel',
      'use a warmer palette',
      'make it watercolor',
      'give me a woodcut art style',
      'pick a different map style',
    ];
    for (const q of retiredCues) {
      expect(routeDoorPrompt(q), `"${q}" no longer has a write destination`)
        .toEqual({ destination: 'analyst', scope: 'settlement' });
    }
  });

  it('settlement-shaped making routes to CONSTRUCT (S5/S6), and realm words widen the ring', () => {
    expect(routeDoorPrompt('build me a new town on the river')).toEqual({ destination: 'construct', scope: 'settlement' });
    expect(routeDoorPrompt('construct a realm of warring city-states').scope).toBe('realm');
  });

  it('making without a settlement noun routes to CONTENT (S4)', () => {
    expect(routeDoorPrompt('invent a custom item for the temple').destination).toBe('content');
    expect(routeDoorPrompt('create a new deity of tides').destination).toBe('content');
  });

  it('CONTEXT-FIRST: questions (and empty text) fall to the ANALYST at the innermost ring', () => {
    expect(routeDoorPrompt('why is bread so expensive here?')).toEqual({ destination: 'analyst', scope: 'settlement' });
    expect(routeDoorPrompt('')).toEqual({ destination: 'analyst', scope: 'settlement' });
    // a bare entity NOUN is not a write cue — asking ABOUT a deity stays a question
    expect(routeDoorPrompt('which deity does the harbor temple serve?').destination).toBe('analyst');
  });

  it('the ring widens only when named: realm cue → realm; money/plan cues → product (analyst)', () => {
    expect(routeDoorPrompt('who rules the realm?')).toEqual({ destination: 'analyst', scope: 'realm' });
    expect(routeDoorPrompt('how many credits does an answer cost?')).toEqual({ destination: 'analyst', scope: 'product' });
  });
});
