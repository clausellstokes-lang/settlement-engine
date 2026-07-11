import { describe, it, expect } from 'vitest';
import { toPublicSafe, PRIVATE_KEY_RE } from '../../../src/domain/display/publicSafe.js';

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
    for (const k of ['secret', 'private', 'dmNotes', 'gmGuidance', 'guidance', 'plotHook', 'hook', 'compass', 'chronicle', 'aiData', 'aiSettlement', 'aiDailyLife', 'narrativeNotes', 'pinnedNpc', 'latentPantheon']) {
      expect(PRIVATE_KEY_RE.test(k)).toBe(true);
    }
  });

  it('strips config.latentPantheon (unrevealed seed) but keeps the activated live embeds', () => {
    // Phase 4 premium gate: config is allowlisted at the top level, so a nested
    // latentPantheon would ride through without the denylist token. The ACTIVATED
    // embeds (primaryDeitySnapshot / cultDeitySnapshots / primaryDeityRef /
    // faithProfile) carry no such token and stay visible — a shared premium
    // pantheon displays read-only to all viewers, the latent seed never does.
    const out = toPublicSafe({
      name: 'Brackwater', tier: 'town',
      config: {
        latentPantheon: { patron: { name: 'The Deep', _deityRef: 'deity:core:the_deep' } },
        primaryDeityRef: 'deity:core:sun',
        primaryDeitySnapshot: { name: 'Sun', alignmentAxis: 'good', rankAxis: 'major' },
        cultDeitySnapshots: [{ name: 'Ash', alignmentAxis: 'evil' }],
        faithProfile: { patron: { name: 'Sun', share: 62 } },
      },
    });
    expect(out.config).toBeTruthy();
    expect(out.config.latentPantheon).toBeUndefined();
    expect(out.config.primaryDeityRef).toBe('deity:core:sun');
    expect(out.config.primaryDeitySnapshot).toEqual({ name: 'Sun', alignmentAxis: 'good', rankAxis: 'major' });
    expect(out.config.cultDeitySnapshots).toEqual([{ name: 'Ash', alignmentAxis: 'evil' }]);
    expect(out.config.faithProfile).toEqual({ patron: { name: 'Sun', share: 62 } });
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

  it('(129) strips config.latentPantheon even in full mode but keeps the activated embeds', () => {
    // W-F7 premium gate: the DM-full opt-in reveals the owner's OWN DM-private
    // content, but the latent pantheon is content the dossier has not yet NAMED —
    // unrevealed by definition, so it NEVER leaves the account, not even here.
    // Mirrors server migration 129 (_gallery_dm_full_json).
    const out = toPublicSafe({
      name: 'Brackwater', tier: 'town',
      plotHooks: ['the heir is hidden'],
      config: {
        latentPantheon: { patron: { name: 'The Deep', _deityRef: 'deity:core:the_deep' }, cults: [{ name: 'Ash' }] },
        primaryDeityRef: 'deity:core:sun',
        primaryDeitySnapshot: { name: 'Sun', alignmentAxis: 'good', rankAxis: 'major' },
        cultDeitySnapshots: [{ name: 'Ash', alignmentAxis: 'evil' }],
        faithProfile: { patron: { name: 'Sun', share: 62 } },
        tradeRouteAccess: 'road',
      },
    }, { full: true });
    // The owner's DM content survives full mode…
    expect(out.plotHooks).toEqual(['the heir is hidden']);
    expect(out.config).toBeTruthy();
    // …but the unrevealed latent seed does not.
    expect(out.config.latentPantheon).toBeUndefined();
    // The activated live embeds + benign config stay.
    expect(out.config.primaryDeityRef).toBe('deity:core:sun');
    expect(out.config.primaryDeitySnapshot).toEqual({ name: 'Sun', alignmentAxis: 'good', rankAxis: 'major' });
    expect(out.config.cultDeitySnapshots).toEqual([{ name: 'Ash', alignmentAxis: 'evil' }]);
    expect(out.config.faithProfile).toEqual({ patron: { name: 'Sun', share: 62 } });
    expect(out.config.tradeRouteAccess).toBe('road');
  });

  it('(121/129) strips BOTH generation-seed carriers (_seed / _regenSeed / _config) in full mode', () => {
    // W-F8 diagnostic: full mode deep-clones and only deletes named DM blocks, so it
    // skipped the fail-closed allowlist that drops seeds in default mode — leaking a
    // reproducibility secret on a DM-full share. Mirrors server migration 121/129
    // (`- '_seed' - '_regenSeed' - '_config'` on _gallery_dm_full_json, plus config._seed).
    const out = toPublicSafe({
      name: 'Foo', tier: 'town',
      _seed: 'seed-abc', _regenSeed: 'regen-xyz', _config: { intent: 'x' },
      plotHooks: ['the heir is hidden'],
      config: { _seed: 'nested-seed', primaryDeityRef: 'deity:core:sun', tradeRouteAccess: 'road' },
    }, { full: true });
    // The owner's DM content survives full mode…
    expect(out.plotHooks).toEqual(['the heir is hidden']);
    // …but a generation seed is confidential in EVERY gallery view, DM-full included.
    expect(out._seed).toBeUndefined();
    expect(out._regenSeed).toBeUndefined();
    expect(out._config).toBeUndefined();
    // config survives with its own nested _seed removed; benign config + embeds stay.
    expect(out.config).toBeTruthy();
    expect(out.config._seed).toBeUndefined();
    expect(out.config.primaryDeityRef).toBe('deity:core:sun');
    expect(out.config.tradeRouteAccess).toBe('road');
  });

  it('does not mutate the input in full mode when stripping seed carriers', () => {
    const input = { name: 'X', _seed: 's', _regenSeed: 'r', _config: {}, config: { _seed: 'ns', primaryDeityRef: 'd' } };
    toPublicSafe(input, { full: true });
    expect(input._seed).toBe('s');
    expect(input._regenSeed).toBe('r');
    expect(input.config._seed).toBe('ns');
  });

  it('does not mutate the input config in full mode when stripping latentPantheon', () => {
    const input = { name: 'X', config: { latentPantheon: { patron: { name: 'The Deep' } }, primaryDeityRef: 'deity:core:sun' } };
    toPublicSafe(input, { full: true });
    expect(input.config.latentPantheon).toEqual({ patron: { name: 'The Deep' } });
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
