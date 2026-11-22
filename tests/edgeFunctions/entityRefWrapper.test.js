/**
 * entityRefWrapper (server post-processor) — wraps known entity names in
 * id-bearing tokens with the RIGHT id (parity with the client index helpers),
 * longest-first, no double-wrap. The wrapped tokens must tokenize back to the
 * same segments the client renders.
 *
 * ⛔ The parity block is the load-bearing assertion: the id the server writes
 * must be byte-identical to the id buildDossierEntityIndex assigns, or the
 * link silently degrades to plain text.
 */
import { describe, it, expect } from 'vitest';
import {
  wrapEntityRefsInProse,
  collectEntityNameRefs,
  collectPronounResolver,
  normalizePronounTokens,
  stripTokens,
  slugifyEntity as serverSlugify,
  factionIdFromName as serverFactionId,
} from '../../supabase/functions/generate-narrative/entityRefWrapper.ts';
import { tokenizeProse } from '../../src/lib/entityRefTokenizer.js';
import {
  buildDossierEntityIndex,
  entityIdFor,
} from '../../src/domain/dossier/entityLinks.js';
import { factionIdFromName } from '../../src/lib/entities.js';

function sampleSettlement() {
  return {
    name: 'Hollowmere',
    thesis: 'A salt town where Jon Aldermere and the Iron Guild circle the same coin.',
    narrativeNotes: {
      power: 'The Iron Guild outmuscles every rival here.',
    },
    npcs: [
      { id: 'npc.jon_aldermere', name: 'Jon Aldermere', goal: { short: 'Jon Aldermere wants the docks back from the Iron Guild.' } },
      { name: 'Mara', goal: { short: 'Mara keeps the ledgers honest.' } },
    ],
    powerStructure: {
      factions: [{ faction: 'Iron Guild' }],
    },
    neighbourNetwork: [{ neighbourName: 'Vale End' }],
  };
}

describe('wrapEntityRefsInProse — id parity with the client index', () => {
  it('wraps a faction name with factionIdFromName, byte-identical to the index id', () => {
    const s = sampleSettlement();
    wrapEntityRefsInProse(s);
    const refs = tokenizeProse(s.narrativeNotes.power).filter(x => x.type === 'ref');
    const guild = refs.find(r => r.displayText === 'Iron Guild');
    expect(guild).toBeTruthy();
    // Parity: server id === client factionIdFromName === index entry id.
    expect(guild.id).toBe(factionIdFromName('Iron Guild'));
    const index = buildDossierEntityIndex(s);
    expect(index.resolve(guild.id)).toBeTruthy();
  });

  it("wraps an NPC name with entityIdFor('npc', npc), resolvable in the index", () => {
    const s = sampleSettlement();
    const npc = s.npcs[0];
    wrapEntityRefsInProse(s);
    const refs = tokenizeProse(s.npcs[0].goal.short).filter(x => x.type === 'ref');
    const jon = refs.find(r => r.displayText === 'Jon Aldermere');
    expect(jon).toBeTruthy();
    expect(jon.id).toBe(entityIdFor('npc', npc));
    const index = buildDossierEntityIndex(sampleSettlement());
    expect(index.resolve(jon.id)).toBeTruthy();
  });

  it('exposes ported id helpers byte-identical to the client', () => {
    expect(serverFactionId('Iron Guild')).toBe(factionIdFromName('Iron Guild'));
    expect(serverSlugify('Vale End')).toBe('vale-end');
  });
});

describe('wrapEntityRefsInProse — wrapping rules', () => {
  it('prefers the LONGER name first ("Jon Aldermere" not "Jon")', () => {
    const s = {
      npcs: [
        { id: 'npc.jon', name: 'Jon' },
        { id: 'npc.jon_aldermere', name: 'Jon Aldermere' },
      ],
      thesis: 'Jon Aldermere speaks for Jon.',
    };
    wrapEntityRefsInProse(s);
    const refs = tokenizeProse(s.thesis).filter(x => x.type === 'ref');
    // First match is the full name resolving to the long id; the bare "Jon"
    // later still resolves to the short id.
    expect(refs[0].id).toBe('npc.jon_aldermere');
    expect(refs[0].displayText).toBe('Jon Aldermere');
    expect(refs.some(r => r.id === 'npc.jon' && r.displayText === 'Jon')).toBe(true);
  });

  it('never double-wraps a name already inside a token', () => {
    const s = sampleSettlement();
    wrapEntityRefsInProse(s);
    const onceWrapped = s.npcs[0].goal.short;
    // A second pass over already-wrapped prose must be a no-op (idempotent).
    const s2 = { ...s, npcs: [{ ...s.npcs[0], goal: { short: onceWrapped } }, s.npcs[1]] };
    wrapEntityRefsInProse(s2);
    // No nested ⟦entity inside an existing token.
    expect(s2.npcs[0].goal.short).toBe(onceWrapped);
    expect((onceWrapped.match(/⟦entity:/g) || []).length).toBeGreaterThan(0);
    // Token count is identical (no accumulation).
    expect((s2.npcs[0].goal.short.match(/⟦entity:/g) || []).length)
      .toBe((onceWrapped.match(/⟦entity:/g) || []).length);
  });

  it('matches whole words case-insensitively, not substrings', () => {
    const s = {
      npcs: [{ id: 'npc.al', name: 'Al' }],
      thesis: 'Alabaster halls — but al is named here too: AL.',
    };
    wrapEntityRefsInProse(s);
    const refs = tokenizeProse(s.thesis).filter(x => x.type === 'ref');
    // "Alabaster" must NOT be wrapped; the standalone "al"/"AL" should be.
    expect(refs.every(r => r.id === 'npc.al')).toBe(true);
    expect(s.thesis).toContain('Alabaster halls');
  });

  it('only wraps entities present in the settlement', () => {
    const s = { npcs: [{ id: 'npc.jon', name: 'Jon' }], thesis: 'Jon and the unknown Stranger.' };
    wrapEntityRefsInProse(s);
    const refs = tokenizeProse(s.thesis).filter(x => x.type === 'ref');
    expect(refs.map(r => r.displayText)).toEqual(['Jon']);
  });

  it('does not throw on missing/empty prose fields', () => {
    expect(() => wrapEntityRefsInProse({})).not.toThrow();
    expect(() => wrapEntityRefsInProse(null)).not.toThrow();
    expect(() => wrapEntityRefsInProse({ npcs: [], thesis: '' })).not.toThrow();
  });
});

describe('degrade + backward compat', () => {
  it('an unresolved id tokenizes to a ref whose display is the fallback (renders plain via primitives)', () => {
    // A token whose id is absent from the index: the tokenizer still yields a
    // ref segment, and EntityLink/EntityRef render `displayText` as plain text.
    const out = tokenizeProse('Met ⟦entity:npc.ghost|Ghost⟧ once.');
    const ref = out.find(x => x.type === 'ref');
    expect(ref.id).toBe('npc.ghost');
    expect(ref.displayText).toBe('Ghost');
    const index = buildDossierEntityIndex({ npcs: [] });
    expect(index.resolve(ref.id)).toBeNull(); // -> primitive shows plain text
  });

  it('old prose with no tokens renders as one plain text segment', () => {
    const old = 'Generated before the entity-link layer existed.';
    expect(tokenizeProse(old)).toEqual([{ type: 'text', value: old }]);
  });
});

describe('collectEntityNameRefs — client-shaped (non-array) collections', () => {
  // Regression: a truthy NON-array (e.g. {}) in a client-supplied settlement
  // used to throw TypeError in the `for…of` (the `|| []` guard is falsy-only).
  // wrapEntityRefsInProse runs post-generation inside the caller's refund
  // catch-all, so the crash refunded a fully-streamed generation.
  it('does not throw when npcs/factions/neighbourNetwork are truthy non-arrays', () => {
    const s = {
      thesis: 'Nothing to wrap here.',
      npcs: {},
      powerStructure: { factions: { faction: 'Iron Guild' } },
      neighbourNetwork: { neighbourName: 'Vale End' },
    };
    expect(() => collectEntityNameRefs(s)).not.toThrow();
    expect(collectEntityNameRefs(s)).toEqual([]);
    expect(() => wrapEntityRefsInProse(s)).not.toThrow();
    expect(s.thesis).toBe('Nothing to wrap here.');
  });

  it('falls back to top-level factions when powerStructure.factions is a non-array', () => {
    const refs = collectEntityNameRefs({
      powerStructure: { factions: 'corrupt' },
      factions: [{ faction: 'Iron Guild' }],
    });
    expect(refs).toEqual([{ name: 'Iron Guild', id: 'faction.iron_guild' }]);
  });

  it('still prefers an EMPTY powerStructure.factions array over top-level factions (pre-fix semantics)', () => {
    const refs = collectEntityNameRefs({
      powerStructure: { factions: [] },
      factions: [{ faction: 'Iron Guild' }],
    });
    expect(refs).toEqual([]);
  });
});

describe('collectEntityNameRefs', () => {
  it('drops names shorter than 2 chars and dedups by name', () => {
    const refs = collectEntityNameRefs({
      npcs: [{ id: 'a', name: 'X' }, { id: 'b', name: 'Bo' }, { id: 'c', name: 'Bo' }],
    });
    expect(refs.map(r => r.name)).toEqual(['Bo']);
    expect(refs[0].id).toBe('b'); // first id wins
  });
});

// ── Pronoun links (the contract extension) ──────────────────────────────────
// The clerk emits ⟦pronoun:<entityName>|<word>⟧ (name-anchored). The wrapper
// validates each anchor against the real entity set and rewrites it to the stable
// id — or unwraps it to plain text (fail-open). Names stay the server's job.

describe('collectPronounResolver — mirrors the client index id set', () => {
  it('resolves NPC / faction names and the settlement itself to their index ids', () => {
    const s = sampleSettlement();
    const { nameToId, linkableIds } = collectPronounResolver(s);
    expect(nameToId.get('jon aldermere')).toBe(entityIdFor('npc', s.npcs[0]));
    expect(nameToId.get('iron guild')).toBe(factionIdFromName('Iron Guild'));
    // The settlement is linkable (owner order: "link to that settlement").
    expect(nameToId.get('hollowmere')).toBe('hollowmere'); // no s.id → slug(name)
    expect(linkableIds.has(factionIdFromName('Iron Guild'))).toBe(true);
  });

  it('is total on garbage', () => {
    expect(() => collectPronounResolver(null)).not.toThrow();
    expect(collectPronounResolver(null).linkableIds.size).toBe(0);
  });
});

describe('normalizePronounTokens — validate + resolve + fail-open', () => {
  const resolver = collectPronounResolver({
    name: 'Hollowmere', id: 'settlement.hollowmere',
    npcs: [{ id: 'npc.jon_aldermere', name: 'Jon Aldermere' }],
    powerStructure: { factions: [{ faction: 'Iron Guild' }] },
  });

  it('rewrites a NAME anchor to the stable id (the clerk works in names)', () => {
    const out = normalizePronounTokens('Jon holds the docks; ⟦pronoun:Jon Aldermere|he⟧ answers to no one.', resolver);
    expect(out).toContain('⟦pronoun:npc.jon_aldermere|he⟧');
  });

  it('links a pronoun to the settlement itself', () => {
    const out = normalizePronounTokens('The town endures; ⟦pronoun:Hollowmere|it⟧ feeds itself.', resolver);
    expect(out).toContain('⟦pronoun:settlement.hollowmere|it⟧');
  });

  it('UNWRAPS an unknown anchor to the bare word (fail-open plain text)', () => {
    expect(normalizePronounTokens('and ⟦pronoun:Nobody|he⟧ vanished', resolver)).toBe('and he vanished');
  });

  it('is idempotent: an already-resolved id anchor is kept verbatim', () => {
    const once = normalizePronounTokens('x ⟦pronoun:Iron Guild|they⟧ y', resolver);
    expect(once).toBe(normalizePronounTokens(once, resolver));
    expect(once).toContain(`⟦pronoun:${factionIdFromName('Iron Guild')}|they⟧`);
  });

  it('leaves prose with no pronoun token untouched (and never throws)', () => {
    expect(normalizePronounTokens('A quiet town.', resolver)).toBe('A quiet town.');
    expect(() => normalizePronounTokens(42, resolver)).not.toThrow();
  });
});

describe('wrapEntityRefsInProse — pronoun links end to end', () => {
  function pronounSettlement() {
    return {
      name: 'Hollowmere', id: 'settlement.hollowmere',
      thesis: 'Jon Aldermere holds the docks; ⟦pronoun:Jon Aldermere|he⟧ answers to the Iron Guild, and ⟦pronoun:Iron Guild|they⟧ own the coin.',
      npcs: [{ id: 'npc.jon_aldermere', name: 'Jon Aldermere' }],
      powerStructure: { factions: [{ faction: 'Iron Guild' }] },
    };
  }

  it('resolves pronoun anchors to ids AND wraps names, both resolvable in the index', () => {
    const s = pronounSettlement();
    wrapEntityRefsInProse(s);
    const refs = tokenizeProse(s.thesis).filter(x => x.type === 'ref');
    const he = refs.find(r => r.verbatim && r.value === 'he');
    const they = refs.find(r => r.verbatim && r.value === 'they');
    expect(he.id).toBe(entityIdFor('npc', { id: 'npc.jon_aldermere', name: 'Jon Aldermere' }));
    expect(they.id).toBe(factionIdFromName('Iron Guild'));
    // The names in the same thesis are still wrapped as NAME links (not verbatim).
    expect(refs.some(r => !r.verbatim && r.displayText === 'Jon Aldermere')).toBe(true);
    // Every pronoun link resolves to a real card.
    const index = buildDossierEntityIndex(pronounSettlement());
    expect(index.resolve(he.id)).toBeTruthy();
    expect(index.resolve(they.id)).toBeTruthy();
  });

  it('re-running is idempotent (no accumulation, ids preserved)', () => {
    const s = pronounSettlement();
    wrapEntityRefsInProse(s);
    const once = s.thesis;
    const s2 = { ...pronounSettlement(), thesis: once };
    wrapEntityRefsInProse(s2);
    expect(s2.thesis).toBe(once);
  });

  it('SANITIZES secret.what — the editable field stays raw (all tokens stripped)', () => {
    const s = pronounSettlement();
    s.npcs[0].secret = { what: 'A plot ⟦entity:npc.jon_aldermere|Jon Aldermere⟧ hides ⟦pronoun:Jon Aldermere|his⟧ coin.' };
    wrapEntityRefsInProse(s);
    expect(s.npcs[0].secret.what).toBe('A plot Jon Aldermere hides his coin.');
    expect(s.npcs[0].secret.what).not.toMatch(/⟦/);
  });

  it('name-wrapping never reaches inside a kept pronoun token', () => {
    const s = pronounSettlement();
    wrapEntityRefsInProse(s);
    // No nested ⟦ inside any token (pronoun tokens are frozen during name-wrapping).
    expect(s.thesis).not.toMatch(/⟦[^⟧]*⟦/);
  });
});

describe('stripTokens', () => {
  it('collapses every entity/pronoun token to its display text', () => {
    expect(stripTokens('⟦entity:npc.jon|Jon⟧ and ⟦pronoun:npc.jon|he⟧ left.')).toBe('Jon and he left.');
    expect(stripTokens('no tokens here')).toBe('no tokens here');
  });
});
