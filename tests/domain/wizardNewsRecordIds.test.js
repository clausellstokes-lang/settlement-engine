/**
 * tests/domain/wizardNewsRecordIds.test.js — THE NEWS ADDRESS LAW's actor layer
 * (T4 ONE-REGEN batch).
 *
 * THE RECORD-GAP THIS CLOSES: a wizard-news entry named its place (`settlementIds`)
 * but never its SUBJECT. The Herald could link the settlement and had to leave the
 * actor as plain prose, because the only place a name existed was inside the
 * headline string — and the law forbids scanning prose for an entity. Composers
 * that already held a typed npc/faction id were throwing it away at the schema
 * boundary.
 *
 * `npcIds` / `factionIds` are that layer. What is pinned here is the SAFETY of
 * adding them to a schema that is already persisted in every save:
 *
 *   • ROUND-TRIP — ids survive normalization, so the renderer sees what a composer
 *     minted (the covert-marker defect in the sibling file was exactly this: a
 *     field the writer set and normalizeEntry silently dropped, leaving a live
 *     reader branch dead against every persisted feed);
 *   • BYTE-NEUTRALITY — an entry with no ids gains NO key, so the entire existing
 *     feed in every existing save serializes exactly as before and the goldens
 *     that pin dormant paths stay byte-identical. This is the property that makes
 *     the change additive rather than a migration;
 *   • FAIL-CLOSED — junk, empty, and all-falsy id lists mint nothing rather than
 *     minting an empty array (an empty array is a KEY, and a key is a byte);
 *   • NORMALIZATION PARITY with the sibling id fields — deduped, stringified,
 *     falsy-dropped, exactly as `settlementIds` has always been.
 */
import { describe, expect, it } from 'vitest';
import { appendWizardNewsEntries, ensureWizardNewsFeed } from '../../src/domain/region/wizardNews.js';

const NOW = '2026-01-01T00:00:00.000Z';
const raw = { id: 'e1', tick: 3, headline: 'A seat changes hands', significance: 'major' };

/** Normalize one raw entry through the real persisted-feed door. */
const one = (extra) => ensureWizardNewsFeed({ entries: [{ ...raw, ...extra }] }, { now: NOW }).entries[0];

describe('wizard-news actor ids — round-trip', () => {
  it('npcIds survive normalization', () => {
    expect(one({ npcIds: ['s1:npc_a', 's1:npc_b'] }).npcIds).toEqual(['s1:npc_a', 's1:npc_b']);
  });

  it('factionIds survive normalization', () => {
    expect(one({ factionIds: ['s1:the_ash_guild'] }).factionIds).toEqual(['s1:the_ash_guild']);
  });

  it('both survive together, alongside the settlement layer they extend', () => {
    const e = one({ npcIds: ['s1:npc_a'], factionIds: ['s1:guild'], settlementIds: ['s1'] });
    expect(e.settlementIds).toEqual(['s1']);
    expect(e.npcIds).toEqual(['s1:npc_a']);
    expect(e.factionIds).toEqual(['s1:guild']);
  });

  it('ids survive the APPEND door too (the path every pulse composer uses)', () => {
    const feed = appendWizardNewsEntries({}, [{ ...raw, npcIds: ['s1:npc_a'] }], { now: NOW });
    expect(feed.entries[0].npcIds).toEqual(['s1:npc_a']);
  });

  it('a persisted id-bearing entry survives RE-normalization unchanged (saves reload)', () => {
    const first = one({ npcIds: ['s1:npc_a'], factionIds: ['s1:guild'] });
    const second = ensureWizardNewsFeed({ entries: [first] }, { now: NOW }).entries[0];
    expect(second.npcIds).toEqual(['s1:npc_a']);
    expect(second.factionIds).toEqual(['s1:guild']);
    expect(second).toEqual(first);           // a full round-trip is a fixed point
  });
});

describe('wizard-news actor ids — byte-neutral on everything that has no actor', () => {
  it('a plain entry gains NEITHER key', () => {
    const e = one({});
    // Anchored: the entry itself is real and normalized (it has the fields the
    // schema always wrote), so these absences cannot be vacuously true.
    expect(e.id).toBe('e1');
    expect(e.settlementIds).toEqual([]);
    expect('npcIds' in e).toBe(false);
    expect('factionIds' in e).toBe(false);
  });

  it('an entry that predates the field set serializes IDENTICALLY to today', () => {
    // The strongest form of the byte-neutrality claim: the exact key set an
    // actor-less entry produces must be unchanged, so no persisted feed and no
    // dormancy golden moves. A new unconditional key would fail this.
    const e = one({ settlementIds: ['s1'], tags: ['world_pulse'] });
    expect(Object.keys(e).sort()).toEqual([
      'channelIds', 'channelType', 'createdAt', 'headline', 'id', 'impactIds',
      'impactKind', 'kind', 'reasons', 'schemaVersion', 'scope', 'score',
      'settlementIds', 'severity', 'significance', 'sourceEventId', 'summary',
      'tags', 'tick',
    ]);
  });

  it('empty / junk / all-falsy id lists mint NO key (an empty array is still a key)', () => {
    for (const junk of [[], null, undefined, 'nope', 42, [null, undefined, '', 0, false]]) {
      const e = one({ npcIds: junk, factionIds: junk });
      expect('npcIds' in e, `npcIds minted for ${JSON.stringify(junk)}`).toBe(false);
      expect('factionIds' in e, `factionIds minted for ${JSON.stringify(junk)}`).toBe(false);
    }
  });
});

describe('wizard-news actor ids — normalization parity with the sibling id fields', () => {
  it('duplicates collapse and values stringify, exactly as settlementIds does', () => {
    const e = one({ npcIds: ['s1:a', 's1:a', 7], settlementIds: ['s1', 's1'] });
    expect(e.npcIds).toEqual(['s1:a', '7']);
    expect(e.settlementIds).toEqual(['s1']);
  });

  it('falsy members are dropped but a surviving member keeps the key', () => {
    const e = one({ factionIds: [null, 's1:guild', '', undefined] });
    expect(e.factionIds).toEqual(['s1:guild']);
  });
});
