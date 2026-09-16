/**
 * tests/domain/surveyorShell.test.js — THE SURVEYOR SHELL pins
 * (DESIGN_AI_CONTROL_SURFACE §2c). The two constitutional guarantees of the Shell's
 * pure core:
 *
 *   PIN 1 (ANCHOR FOLLOWS THE PAGE + IS VISIBLE): the context anchor tracks the current
 *     page/selection (dossier ⇒ settlement · realm/map ⇒ realm · chronicle ⇒ advance · map
 *     selection ⇒ the picked settlement), and carries a human-readable "Reading: …" label
 *     the panel shows — transparency about what the AI sees.
 *   PIN 2 (SUGGESTED QUESTIONS ARE ZERO-COST): the empty-state questions are derived from
 *     read-models with NO provider call — structurally (the module imports no transport)
 *     and behaviourally (a pure call returns 3-4 questions).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { deriveAnchor, anchorSettlement, ANCHOR_SCOPES } from '../../src/domain/ai/contextAnchor.js';
import { suggestedQuestions } from '../../src/domain/ai/suggestedQuestions.js';

const SAVED = [{ id: 's1', name: 'Ashford' }, { id: 's2', name: 'Thornwall' }];

// ── PIN 1: the anchor follows the page + is visible ────────────────────────────

describe('shell — the context anchor follows the page (PIN 1)', () => {
  it('a settlement dossier anchors to that settlement, visibly', () => {
    const a = deriveAnchor({ view: 'settlements', params: { id: 's1' }, savedSettlements: SAVED, tick: 12 });
    expect(a.scope).toBe('settlement');
    expect(a.entityId).toBe('s1');
    expect(a.label).toBe('Reading: Ashford · Week 12');   // VISIBLE + named + the week
    expect(a.retrieval.settlementId).toBe('s1');
  });

  it('the realm/map dashboard anchors to the realm', () => {
    const a = deriveAnchor({ view: 'realm', activeCampaign: { name: 'The Marches' }, tick: 5 });
    expect(a.scope).toBe('realm');
    expect(a.label).toBe('Reading: The Marches · Week 5');
    expect(a.retrieval.realm).toBe(true);
  });

  it('a map SELECTION overrides the realm default (the picked settlement is the subject)', () => {
    const a = deriveAnchor({ view: 'map', selectedSettlementId: 's2', savedSettlements: SAVED, tick: 8 });
    expect(a.scope).toBe('map');
    expect(a.entityId).toBe('s2');
    expect(a.label).toBe('Reading: Thornwall · Week 8');
  });

  it('the chronicle anchors to the advance in view', () => {
    const a = deriveAnchor({ view: 'chronicle', tick: 20 });
    expect(a.scope).toBe('chronicle');
    expect(a.label).toBe('Reading: the chronicle · Week 20');
  });

  it('no specific page ⇒ the whole world (the honest default), still visible', () => {
    const a = deriveAnchor({ view: 'account' });
    expect(a.scope).toBe('none');
    expect(a.label).toBe('Reading: your world');
    expect(ANCHOR_SCOPES).toContain(a.scope);
  });

  it('the anchor RESOLVES to the in-scope settlement object for the slicers', () => {
    const settlement = { id: 's1', name: 'Ashford', npcs: [] };
    const a = deriveAnchor({ view: 'settlements', params: { id: 's1' }, settlement });
    expect(anchorSettlement(a, { settlement })).toBe(settlement);
    expect(anchorSettlement(deriveAnchor({ view: 'realm' }), { settlement })).toBeNull();
  });

  it('the SAME panel gives DIFFERENT anchors as the page changes (it truly follows)', () => {
    const onDossier = deriveAnchor({ view: 'settlements', params: { id: 's1' }, savedSettlements: SAVED, tick: 3 });
    const onRealm = deriveAnchor({ view: 'realm', activeCampaign: { name: 'The Marches' }, tick: 3 });
    expect(onDossier.label).not.toBe(onRealm.label);
    expect(onDossier.scope).not.toBe(onRealm.scope);
  });
});

// ── PIN 2: suggested questions are zero-cost ───────────────────────────────────

describe('shell — suggested questions are zero-cost (PIN 2)', () => {
  it('STRUCTURAL: the module imports NO transport (no provider call is even possible)', () => {
    const src = readFileSync(resolve(process.cwd(), 'src/domain/ai/suggestedQuestions.js'), 'utf8');
    expect(/supabase|functions\.invoke|fetch\(|askAnalyst|http/i.test(src)).toBe(false);
    // and it is pure: no imports at all (nothing that could reach a network)
    expect(/^\s*import\s/m.test(src)).toBe(false);
  });

  it('a settlement anchor yields 3-4 read-model-derived questions (naming the settlement)', () => {
    const settlement = { id: 's1', name: 'Ashford', factions: [{ id: 'f1' }], npcs: [{ id: 'n1' }] };
    const anchor = deriveAnchor({ view: 'settlements', params: { id: 's1' }, settlement });
    const qs = suggestedQuestions(anchor, { settlement });
    expect(qs.length).toBeGreaterThanOrEqual(3);
    expect(qs.length).toBeLessThanOrEqual(4);
    expect(qs.some((q) => q.includes('Ashford'))).toBe(true);        // derived from the anchor
    expect(qs.some((q) => /faction/i.test(q))).toBe(true);           // derived from its factions
    expect(new Set(qs).size).toBe(qs.length);                        // no duplicates
  });

  it('a realm anchor yields realm-scale questions; the empty world still yields 3-4', () => {
    const realmQs = suggestedQuestions(deriveAnchor({ view: 'realm' }), { worldState: { spatialLedgers: { treaties: { t1: {} } } } });
    expect(realmQs.length).toBeGreaterThanOrEqual(3);
    expect(realmQs.some((q) => /realm|region|conflict|session/i.test(q))).toBe(true);
    const bare = suggestedQuestions(deriveAnchor({ view: 'account' }), {});
    expect(bare.length).toBeGreaterThanOrEqual(3);
    expect(bare.length).toBeLessThanOrEqual(4);
  });

  it('a settlement with no factions/NPCs still returns a valid 3-4 set (never bare, never a dump)', () => {
    const settlement = { id: 's9', name: 'Emptyton' };
    const qs = suggestedQuestions(deriveAnchor({ view: 'settlements', params: { id: 's9' }, settlement }), { settlement });
    expect(qs.length).toBeGreaterThanOrEqual(3);
    expect(qs.length).toBeLessThanOrEqual(4);
  });
});
