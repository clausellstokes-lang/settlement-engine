import { describe, it, expect } from 'vitest';
import { toPublicSafe, PRIVATE_KEY_RE, galleryMemberKey } from '../../../src/domain/display/publicSafe.js';

describe('toPublicSafe (§1k)', () => {
  it('strips DM-private top-level blocks and denied keys', () => {
    const out = toPublicSafe({
      name: 'Foo', tier: 'town',
      aiData: { aiSettlement: {} }, plotHooks: ['x'], dmCompass: {}, dossierNotes: 'n', notes: 'n',
      secretStash: 'hidden', gmGuidance: 'hidden', chronicle: ['e'], narrativeNotes: 'x',
    });
    expect(out.name).toBe('Foo');
    expect(out.tier).toBe('town');
    for (const k of ['aiData', 'plotHooks', 'dmCompass', 'dossierNotes', 'notes', 'secretStash', 'gmGuidance', 'chronicle', 'narrativeNotes']) {
      expect(out[k]).toBeUndefined();
    }
  });

  it('reduces NPCs to a public allowlist (no goal / secret / relationships)', () => {
    const out = toPublicSafe({
      npcs: [{ name: 'Aldric', role: 'Mayor', goal: 'seize power', secret: 'bastard heir', plotHooks: ['x'], relationships: [{}], influence: 80 }],
    });
    expect(out.npcs).toHaveLength(1);
    expect(out.npcs[0].name).toBe('Aldric');
    expect(out.npcs[0].influence).toBe(80);
    for (const k of ['goal', 'secret', 'plotHooks', 'relationships']) {
      expect(out.npcs[0][k]).toBeUndefined();
    }
  });

  it('does not mutate the input', () => {
    const input = { name: 'Foo', aiData: { x: 1 } };
    toPublicSafe(input);
    expect(input.aiData).toEqual({ x: 1 });
  });

  it('handles null / undefined', () => {
    expect(toPublicSafe(null)).toEqual({});
    expect(toPublicSafe(undefined)).toEqual({});
  });

  it('PRIVATE_KEY_RE matches the documented private keys', () => {
    for (const k of ['secret', 'private', 'dmNotes', 'gmGuidance', 'guidance', 'plotHook', 'hook', 'compass', 'chronicle', 'aiData', 'aiSettlement', 'aiDailyLife', 'narrativeNotes', 'pinnedNpc']) {
      expect(PRIVATE_KEY_RE.test(k)).toBe(true);
    }
  });
});

describe('toPublicSafe — full DM view opt-in (gallery_share_dm)', () => {
  const dm = () => ({
    name: 'Foo', tier: 'town',
    plotHooks: ['the heir is hidden'],
    dossierNotes: 'my prep notes',
    dmNotes: 'the BBEG is the mayor', notes: 'scratch pad',
    dmCompass: { twist: 'the mayor is a doppelganger' },
    npcs: [{ name: 'Aldric', role: 'Mayor', goal: 'seize power', secret: 'bastard heir', plotHooks: ['blackmail'], relationships: [{ with: 'x' }], influence: 80 }],
    aiData: { aiSettlement: { x: 1 } }, aiDailyLife: { dawn: 'z' },
    aiSettlement: {
      name: 'Refined Foo', npcs: [{ name: 'Aldric, the refined prose' }], // AI PROSE — must be dropped
      identityMarkers: ['m1'], frictionPoints: ['f1'], connectionsMap: ['c1'], dmCompass: { hooks: ['h'] }, // DM Compass — kept
    },
  });

  it('keeps secrets, plot hooks, compass + NPC goal/secret/relationships', () => {
    const out = toPublicSafe(dm(), { full: true });
    expect(out.plotHooks).toEqual(['the heir is hidden']);
    expect(out.dmCompass).toEqual({ twist: 'the mayor is a doppelganger' });
    expect(out.npcs[0].goal).toBe('seize power');
    expect(out.npcs[0].secret).toBe('bastard heir');
    expect(out.npcs[0].plotHooks).toEqual(['blackmail']);
    expect(out.npcs[0].relationships).toEqual([{ with: 'x' }]);
  });

  it('strips DM notes even in full mode — truly confidential, never shared', () => {
    const out = toPublicSafe(dm(), { full: true });
    expect(out.dossierNotes).toBeUndefined();
    expect(out.dmNotes).toBeUndefined();
    expect(out.notes).toBeUndefined();
    expect(out.narrativeNotes).toBeUndefined();
  });

  // Defense-in-depth for the gallery DM-notes invariant: in production DM notes
  // live NESTED at aiData.dossierNotes.dmNotes, not at the top level. aiData is
  // dropped wholesale in full mode, so the nested secret must never survive.
  // This pins it against any future change (e.g. a per-member gallery reveal)
  // that tries to preserve part of aiData for the DM view: the dmNotes content
  // must appear NOWHERE in the projected output, share-DM on or off.
  it('never leaks the nested aiData.dossierNotes.dmNotes, even in full DM mode', () => {
    const dmSecret = 'the BBEG is the mayor, kill on sight';
    const withNested = {
      name: 'Foo', tier: 'town',
      aiData: { dossierNotes: { dmNotes: dmSecret, aiGuidance: 'campaign lore the model weaves in' } },
    };
    expect(JSON.stringify(toPublicSafe(withNested, { full: true }))).not.toContain(dmSecret);
    expect(JSON.stringify(toPublicSafe(withNested))).not.toContain(dmSecret); // default mode too
    expect(toPublicSafe(withNested, { full: true }).aiData).toBeUndefined();
  });

  it('drops AI prose blobs but keeps ONLY the four DM-Compass fields of aiSettlement', () => {
    const out = toPublicSafe(dm(), { full: true });
    expect(out.aiData).toBeUndefined();
    expect(out.aiDailyLife).toBeUndefined();
    // DM Compass preserved (the owner opted to reveal DM-private content)…
    expect(out.aiSettlement).toEqual({
      identityMarkers: ['m1'], frictionPoints: ['f1'], connectionsMap: ['c1'], dmCompass: { hooks: ['h'] },
    });
    // …but the refined PROSE on aiSettlement (governed by the narrated toggle) is gone.
    expect(out.aiSettlement.name).toBeUndefined();
    expect(out.aiSettlement.npcs).toBeUndefined();
  });

  it('drops aiSettlement entirely when it carries no DM-Compass fields', () => {
    const out = toPublicSafe({ name: 'X', aiSettlement: { name: 'prose only', npcs: [{}] } }, { full: true });
    expect(out.aiSettlement).toBeUndefined();
  });

  it('default (no option / full:false) still strips DM-private content', () => {
    const stripped = toPublicSafe(dm());
    expect(stripped.plotHooks).toBeUndefined();
    expect(stripped.dossierNotes).toBeUndefined();
    expect(stripped.dmCompass).toBeUndefined();
    expect(stripped.npcs[0].secret).toBeUndefined();
    expect(stripped.npcs[0].goal).toBeUndefined();
  });

  it('does not mutate the input in full mode', () => {
    const input = { name: 'X', plotHooks: ['a'], aiData: { x: 1 } };
    toPublicSafe(input, { full: true });
    expect(input.plotHooks).toEqual(['a']);
    expect(input.aiData).toEqual({ x: 1 });
  });

  // The shareNarrated-but-NOT-shareDm gallery path: the server publishes the
  // FULL refined clone (thesis + DM Compass + narrativeNotes at top level) as the
  // dossier data, then runs the DEFAULT projection on it. The gallery renders the
  // narrative lens from this object's `thesis`, so thesis MUST survive while the
  // DM Compass + per-tab narrative notes MUST be stripped (they're DM-private and
  // only the shareDm full mode keeps the compass).
  it('default mode keeps thesis but strips DM Compass + narrativeNotes (narrated-not-DM gallery path)', () => {
    const narratedClone = {
      name: 'Refined', tier: 'town',
      thesis: 'A salt town that forgot its own founding.',
      identityMarkers: ['brine-stained boardwalks'],
      frictionPoints: [{ who: 'A vs B', what: 'a feud' }],
      connectionsMap: [{ from: 'A', to: 'B', nature: 'rivalry' }],
      dmCompass: { hooks: ['h'], redFlags: ['r'], twist: 't' },
      narrativeNotes: { economics: 'per-tab prose' },
    };
    const out = toPublicSafe(narratedClone); // default mode (full:false)
    expect(out.thesis).toBe('A salt town that forgot its own founding.');
    expect(out.identityMarkers).toBeUndefined();
    expect(out.frictionPoints).toBeUndefined();
    expect(out.connectionsMap).toBeUndefined();
    expect(out.dmCompass).toBeUndefined();
    expect(out.narrativeNotes).toBeUndefined();
  });
});

describe('toPublicSafe — per-member overrides (migration 092 mirror)', () => {
  const dm = () => ({
    npcs: [
      { id: 'n1', name: 'Aldric', role: 'mayor', influence: 'high', secret: 'is a spy', goal: 'seize the crown' },
      { id: 'n2', name: 'Mara', role: 'priest', influence: 'mid', secret: 'embezzles tithes', goal: 'flee' },
    ],
  });

  it('galleryMemberKey prefers npc.id, else a name slug (matches the SQL key)', () => {
    expect(galleryMemberKey({ id: 'n1', name: 'Aldric' })).toBe('n1');
    expect(galleryMemberKey({ name: 'Old Tom the Smith!' })).toBe('npc.old_tom_the_smith');
  });

  it('settlement hidden + one member revealed: only that member keeps DM fields', () => {
    const out = toPublicSafe(dm(), { full: false, memberOverrides: { n1: { revealDm: true } } });
    const a = out.npcs.find(n => n.name === 'Aldric');
    const b = out.npcs.find(n => n.name === 'Mara');
    expect(a.secret).toBe('is a spy');
    expect(a.goal).toBe('seize the crown');
    expect(b.secret).toBeUndefined();
    expect(b.goal).toBeUndefined();
  });

  it('settlement revealed + one member hidden: that member is re-stripped', () => {
    const out = toPublicSafe(dm(), { full: true, memberOverrides: { n2: { revealDm: false } } });
    const a = out.npcs.find(n => n.name === 'Aldric');
    const b = out.npcs.find(n => n.name === 'Mara');
    expect(a.secret).toBe('is a spy');
    expect(b.secret).toBeUndefined();
    expect(b.name).toBe('Mara');
  });

  it('no overrides leaves the settlement-level behavior unchanged', () => {
    const hidden = toPublicSafe(dm(), { full: false });
    expect(hidden.npcs.every(n => n.secret === undefined)).toBe(true);
    const shown = toPublicSafe(dm(), { full: true });
    expect(shown.npcs.every(n => n.secret !== undefined)).toBe(true);
  });
});
