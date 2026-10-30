import { describe, it, expect } from 'vitest';
import { toPublicSafe, PRIVATE_KEY_RE, galleryMemberKey } from '../../../src/domain/display/publicSafe.js';
import {
  parseVeilAddress, isHideable, resolveVeil, applyVeil, isVeiled, readShareVeil, writeShareVeil, clampVeilDeltas,
  defaultVeilFor, DEFAULT_VEIL_RULES,
  CARD_KINDS, SETTLEMENT_FLOOR, GROUPING_REMOVERS, VEIL_OVERRIDE_KEY, VEIL_VERSION, VEIL_MAX_DELTAS, VEIL_EXCEPTION_PREFIX,
} from '../../../src/domain/display/galleryVeil.js';

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

  it('W-DOCTRINE-3b §6 — the corruption BENEFICIARY identity never reaches the player projection', () => {
    // The default (stripped) NPC allowlist carries none of the corruption fields — corrupt,
    // corruptionVector, or corruptTies (incl. the leash's foreign patron). The beneficiary
    // rides the DM-truth block only; publicNpc is auto-safe (no allowlist entry to leak it).
    const out = toPublicSafe({
      npcs: [{
        name: 'Reeve Var', role: 'Reeve', influence: 40,
        corrupt: true, corruptionVector: 'forbidden_patron',
        corruptTies: { leash: { kind: 'foreign_settlement', settlementId: 'crown', covert: true } },
      }],
    });
    expect(out.npcs).toHaveLength(1);
    expect(out.npcs[0].name).toBe('Reeve Var');
    for (const k of ['corrupt', 'corruptionVector', 'corruptTies']) {
      expect(out.npcs[0][k]).toBeUndefined();
    }
    // Belt-and-braces: no serialized projection mentions the patron id anywhere.
    expect(JSON.stringify(out)).not.toContain('crown');
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

  it('(130) narrows `note`: keeps public economics-attribution notes, still strips the private note keys', () => {
    // domain-readmodels-2: the bare `note` token over-matched public economics
    // annotations (the food-deficit / supply-chain explanation the dossier's
    // economics tab renders). The narrowing keeps them while the genuinely-private
    // note keys — dossierNotes / tabNotes / a bare notes|note / dmNote — still strip.
    // Public economics-attribution notes survive the token (camelCase — no \b before "Note").
    for (const k of ['magicFoodNote', 'magicNote', 'upstreamNote', 'storageNote', 'viabilityNote', 'priorityNote', 'coherenceNotes']) {
      expect(PRIVATE_KEY_RE.test(k), `public analytical note "${k}" must NOT trip the denylist`).toBe(false);
    }
    // …while the genuinely-private note keys still strip.
    for (const k of ['dossierNotes', 'tabNotes', 'notes', 'note', 'dmNote', 'narrativeNotes']) {
      expect(PRIVATE_KEY_RE.test(k), `private note key "${k}" must still trip the denylist`).toBe(true);
    }

    // End-to-end at the NESTED level (the deeper denylist): economics notes nested in
    // an allowlisted subtree survive the projection; a dmNotes-class / bare notes key
    // beside them still strips. (economicState is allowlisted; its children go through
    // the recursive denylist.)
    const out = toPublicSafe({
      name: 'Brackwater', tier: 'town',
      economicState: {
        magicFoodNote: 'Divine provision supplements food shortfall',
        storageNote: '8 months strategic reserve',
        activeChains: [{ id: 'grain', upstreamNote: 'Imported inputs: grain', dmNote: 'the miller skims the granary' }],
        dossierNotes: 'DM prep for the famine arc',
        notes: 'scratch pad',
      },
      // top-level DM-private note — dropped by the fail-closed allowlist regardless.
      dmNotes: 'the BBEG is the mayor',
    });
    expect(out.economicState.magicFoodNote).toBe('Divine provision supplements food shortfall');
    expect(out.economicState.storageNote).toBe('8 months strategic reserve');
    expect(out.economicState.activeChains[0].upstreamNote).toBe('Imported inputs: grain');
    // …the dmNotes-class + bare notes fields beside them still strip.
    expect(out.economicState.activeChains[0].dmNote).toBeUndefined();
    expect(out.economicState.dossierNotes).toBeUndefined();
    expect(out.economicState.notes).toBeUndefined();
    expect(out.dmNotes).toBeUndefined();
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

  it('(142) drops a COVERT corruption impairment (NPC-naming description) but keeps the public one', () => {
    // W-DOCTRINE-3 §6 / GALLERY-2 precondition: imposeCorruption stamps a covert
    // impairment onto institutions[].impairments whose description NAMES the corrupted
    // NPC. `institutions` is allowlisted, and none of the impairment's keys trip the
    // deeper denylist, so without the value-level covert drop the WHOLE object — naming
    // description included — rode through to the anon dossier. A key-strip is insufficient
    // (it leaves the description); the whole covert object must go. FAIL-CLOSED.
    const out = toPublicSafe({
      name: 'Brackwater', tier: 'town',
      institutions: [{
        name: 'The Tanners Guild', category: 'Crafts',
        impairments: [
          { type: 'corruption', severity: 'moderate', covert: true, causeEventId: 'evt_capture_9', appliedAt: 42,
            description: "Aldric's capture quietly compromised The Tanners Guild." },
          { type: 'flood_damage', severity: 'minor', description: 'Spring floods damaged the drying racks.' },
        ],
      }],
    });
    expect(out.institutions).toHaveLength(1);
    expect(out.institutions[0].name).toBe('The Tanners Guild');
    const imps = out.institutions[0].impairments;
    expect(imps).toHaveLength(1);
    expect(imps[0].type).toBe('flood_damage');
    expect(imps.some(i => i && i.covert)).toBe(false);
    // The NPC-naming description must appear NOWHERE in the projection.
    expect(JSON.stringify(out)).not.toContain('quietly compromised');
    expect(JSON.stringify(out)).not.toContain("Aldric's capture");
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

  it('(142) KEEPS covert corruption impairments in full mode (the DM-content share)', () => {
    // JUDGMENT (vetoable — mirrors migration 142's scope note): the covert drop guards the
    // ANON surface only (W-DOCTRINE-3 §6). gallery_share_dm is the owner's explicit
    // DM-content publish (secrets, hooks, NPC goals) — a covert corruption fact is DM
    // narrative consistent with that opt-in, so full mode preserves it. Full mode never
    // calls sanitizePublicValue (it deep-clones + drops named blocks), so the covert
    // impairment rides through by construction; this pins that intent. To flip: add the
    // covert drop to the full-mode clone path + _gallery_dm_full_json and invert this pin.
    const out = toPublicSafe({
      name: 'Foo', tier: 'town', plotHooks: ['the heir is hidden'],
      institutions: [{
        name: 'The Tanners Guild', category: 'Crafts',
        impairments: [
          { type: 'corruption', severity: 'moderate', covert: true,
            description: "Aldric's capture quietly compromised The Tanners Guild." },
        ],
      }],
    }, { full: true });
    expect(out.institutions[0].impairments).toHaveLength(1);
    expect(out.institutions[0].impairments[0].covert).toBe(true);
    expect(JSON.stringify(out)).toContain('quietly compromised');
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

describe('toPublicSafe — per-member overrides (migration 093 mirror)', () => {
  const dm = () => ({
    // Settlement-level DM content that a per-member reveal must NEVER leak (the 092 bug).
    plotHooks: ['the mayor is a doppelganger'],
    dmCompass: { frictionPoints: 'the guild versus the crown' },
    npcs: [
      { id: 'n1', name: 'Aldric', role: 'mayor', influence: 'high', secret: 'is a spy', goal: 'seize the crown' },
      { id: 'n2', name: 'Mara', role: 'priest', influence: 'mid', secret: 'embezzles tithes', goal: 'flee' },
    ],
  });

  it('galleryMemberKey prefers npc.id, else a name slug (matches the SQL key)', () => {
    expect(galleryMemberKey({ id: 'n1', name: 'Aldric' })).toBe('n1');
    expect(galleryMemberKey({ name: 'Old Tom the Smith!' })).toBe('npc.old_tom_the_smith');
  });

  it('REGRESSION (092 leak): hidden settlement + one member revealed leaks NO settlement-level DM content', () => {
    const out = toPublicSafe(dm(), { full: false, memberOverrides: { n1: { revealDm: true } } });
    // Settlement-level DM content stays stripped (the fix).
    expect(out.plotHooks).toBeUndefined();
    expect(out.dmCompass).toBeUndefined();
    // Only the revealed member gets its DM fields.
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

// ── THE GALLERY VEIL (RULINGS-CROSS X-21, X-21b; build lane W2-VEIL-A U1) ──────────────
// The model: the address grammar, the identity floor, resolve and apply. Hidden facts are
// ABSENT from the projection (deleted, never blanked); a card is never hidden whole.
describe('galleryVeil — the model (X-21 / X-21b, W2-VEIL-A U1)', () => {
  // A trimmed real record: seed ux-audit-v2-2026-10-30-35 (Vikhavn), NPC npc_11.
  const dalla = () => ({
    id: 'npc_11', name: 'Dalla Njálsson', gender: 'female', role: 'Council Member', title: 'Ráðgjafi', category: 'government',
    personality: { flaw: 'paranoid', modifier: 'detached' }, physical: { age: 'late thirties' },
    goal: { short: 'Stay useful to the wrong people so they stay breathing.' },
    secret: { what: "Has been reading Ljot Randversson's correspondence through an intermediary." },
    plotHooks: ['Their most trusted advisor has not been seen in four days.'],
    influence: 'low', factionAffiliation: 'Council', secondaryAffiliation: 'Underground network',
    corrupt: true, corruptionVector: 'fear', corruptTies: { criminalInstitution: 'Underground network' },
  });
  const town = () => ({
    id: 's1', name: 'Vikhavn', tier: 'metropolis', population: 45380, config: { culture: 'norse' },
    npcs: [dalla(), { id: 'npc_2', name: 'Ulf', role: 'Smith', personality: { flaw: 'proud' }, institution: 'Smithy' }],
    institutions: [
      { name: 'Smithy', category: 'Crafts', priorityCategory: 'crafts', desc: 'Iron work.', tags: ['metalwork'] },
      { name: 'Underground network', category: 'Criminal', priorityCategory: 'criminal', catalogId: 'underground_network',
        desc: 'A warren of tunnels beneath the city.', tags: ['criminal', 'smuggling', 'underground'],
        facets: { clandestine: 'clandestine', subterranean: 'subterranean' } },
    ],
    availableServices: {
      equipment: [{ name: 'Tools', desc: 'Iron tools', institution: 'Smithy' }, { name: 'Passage', desc: 'Unseen passage', institution: 'Underground network' }],
      criminal: [{ name: 'Contraband delivery', desc: 'Move restricted goods.', institution: 'Underground network' }],
    },
  });

  it('parses the address grammar and refuses anything outside it', () => {
    expect(parseVeilAddress('tab:plot_hooks')).toEqual({ type: 'tab', id: 'plot_hooks' });
    expect(parseVeilAddress('block:defense.criminalStructure')).toEqual({ type: 'block', id: 'defense.criminalStructure' });
    expect(parseVeilAddress('card:npc:npc_11')).toEqual({ type: 'card', kind: 'npc', id: 'npc_11' });
    // An id may itself carry ':' (the field is the last segment).
    expect(parseVeilAddress('field:npc:npc.a:b:secret')).toEqual({ type: 'field', kind: 'npc', id: 'npc.a:b', field: 'secret' });
    expect(parseVeilAddress('class:npc:secret')).toEqual({ type: 'class', kind: 'npc', field: 'secret' });
    for (const bad of ['', 'tab:', 'npc:secret', 'field:npc:secret', 'class:npc:', 'card:npc:', 'x'.repeat(301), 42, null]) {
      expect(parseVeilAddress(bad)).toBe(null);
    }
  });

  it('EXISTENCE IS PUBLIC: a card address is never hideable; a card-level delta hides its depth, the card and its identity stay', () => {
    expect(isHideable('card:npc:npc_11')).toBe(false);
    const veil = resolveVeil([], [{ address: 'card:npc:npc_11', hidden: true }]);
    expect(veil.has('card:npc:npc_11')).toBe(false);
    expect(veil.has('field:npc:npc_11:secret')).toBe(true);
    const out = applyVeil(town(), veil);
    expect(out.npcs).toHaveLength(2);
    const d = out.npcs.find(n => n.id === 'npc_11');
    for (const k of CARD_KINDS.npc.floor) expect(d[k]).toEqual(dalla()[k]);
    for (const k of ['personality', 'physical', 'goal', 'secret', 'plotHooks', 'corrupt', 'corruptTies']) expect(k in d).toBe(false);
    // The other card is untouched.
    expect(out.npcs.find(n => n.id === 'npc_2').personality).toEqual({ flaw: 'proud' });
  });

  it('THE IDENTITY FLOOR can never be hidden: refused, dropped, and spared even by a malformed set', () => {
    for (const k of CARD_KINDS.npc.floor) expect(isHideable(`field:npc:npc_11:${k}`)).toBe(false);
    for (const k of CARD_KINDS.institution.floor) expect(isHideable(`class:institution:${k}`)).toBe(false);
    for (const k of SETTLEMENT_FLOOR) expect(isHideable(`field:settlement:s1:${k}`)).toBe(false);
    expect(resolveVeil(['field:npc:npc_11:name', 'class:institution:name'], [{ address: 'field:npc:npc_11:role', hidden: true }]).size).toBe(0);
    // Every grouping, every depth class of every kind, and the floor addresses forced in.
    const everything = [
      ...Object.keys(GROUPING_REMOVERS),
      ...Object.entries(CARD_KINDS).flatMap(([kind, k]) => Object.keys(k.fields).map(f => `class:${kind}:${f}`)),
      'field:npc:npc_11:name', 'field:settlement:s1:name', 'class:npc:role',
    ];
    const src = town();
    const out = applyVeil(src, everything);
    for (const k of SETTLEMENT_FLOOR) expect(out[k]).toEqual(src[k]);
    expect(out.npcs.map(n => n.name)).toEqual(['Dalla Njálsson', 'Ulf']);
    expect(out.institutions.map(i => [i.name, i.category])).toEqual([['Smithy', 'Crafts'], ['Underground network', 'Criminal']]);
    for (const k of CARD_KINDS.npc.floor) expect(out.npcs[0][k]).toEqual(src.npcs[0][k]);
  });

  it('a hidden fact is ABSENT, never blanked, and the input is never mutated', () => {
    const src = town();
    const before = JSON.stringify(src);
    const out = applyVeil(src, resolveVeil(['field:institution:underground-network:description', 'class:npc:secret'], []));
    const inst = out.institutions.find(i => i.name === 'Underground network');
    expect('desc' in inst).toBe(false);
    expect(out.npcs.every(n => !('secret' in n))).toBe(true);
    expect(out.institutions.find(i => i.name === 'Smithy').desc).toBe('Iron work.');
    expect(JSON.stringify(src)).toBe(before);
  });

  it('an institution hides its services (its rows in every category) and its people (their link, never the person)', () => {
    const out = applyVeil(town(), resolveVeil(['field:institution:underground-network:services', 'field:institution:smithy:people'], []));
    expect(out.availableServices.equipment.map(r => r.name)).toEqual(['Tools']);
    expect(out.availableServices.criminal).toEqual([]);
    const ulf = out.npcs.find(n => n.id === 'npc_2');
    expect(ulf.name).toBe('Ulf');
    expect('institution' in ulf).toBe(false);
  });

  it('a field-class master switch hides the field on every card; a per-card eye is its exception', () => {
    const veil = resolveVeil(['class:npc:personality'], [{ address: 'field:npc:npc_2:personality', hidden: false }]);
    expect(veil.has(`${VEIL_EXCEPTION_PREFIX}field:npc:npc_2:personality`)).toBe(true);
    const out = applyVeil(town(), veil);
    expect('personality' in out.npcs[0]).toBe(false);
    expect(out.npcs[1].personality).toEqual({ flaw: 'proud' });
    // Deltas apply in order: the last word on an address wins.
    expect(resolveVeil([], [
      { address: 'field:npc:npc_11:secret', hidden: true },
      { address: 'field:npc:npc_11:secret', hidden: false },
    ]).has('field:npc:npc_11:secret')).toBe(false);
  });

  it('groupings remove their data and are listed on the projection; field and class addresses are never listed', () => {
    const src = { ...town(), structuralViolations: [{ type: 'x', reason: 'r' }], coherenceNotes: [{ note: 'n' }] };
    const out = applyVeil(src, resolveVeil(['block:services.criminal', 'block:housekeeping.coherenceNotes', 'class:npc:secret', 'block:not.registered'], []));
    expect('criminal' in out.availableServices).toBe(false);
    expect('coherenceNotes' in out).toBe(false);
    expect(out.structuralViolations).toEqual([{ type: 'x', reason: 'r' }]);
    expect(out.galleryVeil).toEqual({ v: VEIL_VERSION, hidden: ['block:housekeeping.coherenceNotes', 'block:services.criminal'] });
    expect(isVeiled(out, 'block:services.criminal')).toBe(true);
    expect(isVeiled(out, 'class:npc:secret')).toBe(false);
  });

  it('the per-NPC overrides fold in as card-level deltas, read both ways; a pre-veil share is unmarked', () => {
    // A share exported before the veil (no reserved key) is unmarked: projected as before.
    expect(readShareVeil({ npc_11: { revealDm: false } })).toEqual({ marked: false, deltas: [] });
    // revealDm:false reads as a card-level hide; revealDm:true stays the door, never a veil entry.
    const read = readShareVeil({ npc_11: { revealDm: false }, npc_2: { revealDm: true }, [VEIL_OVERRIDE_KEY]: { v: 1, deltas: [{ address: 'class:npc:physical', hidden: true }] } });
    expect(read).toEqual({ marked: true, deltas: [{ address: 'card:npc:npc_11', hidden: true }, { address: 'class:npc:physical', hidden: true }] });
    // Written back: the NPC card delta becomes revealDm:false (the 093 server splice enforces
    // it today); everything else rides the reserved key; allowImport is kept.
    const written = writeShareVeil({ npc_2: { allowImport: false } }, [
      { address: 'card:npc:npc_2', hidden: true },
      { address: 'field:institution:smithy:description', hidden: true },
      { address: 'not an address', hidden: true },
    ]);
    expect(written).toEqual({
      npc_2: { allowImport: false, revealDm: false },
      [VEIL_OVERRIDE_KEY]: { v: VEIL_VERSION, deltas: [{ address: 'field:institution:smithy:description', hidden: true }] },
    });
    // …and un-hiding the card clears the revealDm:false it wrote.
    expect(writeShareVeil(written, [{ address: 'card:npc:npc_2', hidden: false }]).npc_2).toEqual({ allowImport: false });
    expect(clampVeilDeltas(Array.from({ length: VEIL_MAX_DELTAS + 5 }, (_, i) => ({ address: `field:npc:n${i}:secret`, hidden: true })))).toHaveLength(VEIL_MAX_DELTAS);
  });
});

// ── THE ONE DEFAULT SET (RULINGS-CROSS X-21c as corrected by X-21d; W2-VEIL-A U2) ──────
// Derived from the DATA (classifier category, declared facets, catalog service keys,
// present fields), never from a label. Fixtures are trimmed real records from the
// ux-audit-v2-2026-10-30 thousand (seeds named per fixture).
describe('galleryVeil — the one default set (X-21c / X-21d, W2-VEIL-A U2)', () => {
  // seed ux-audit-v2-2026-10-30-22, Bailthwaite (city): a thieves' guild, a whisper market,
  // a criminal faction, a parish church, and criminal-category services.
  const bailthwaite = () => ({
    id: 'b1', name: 'Bailthwaite', tier: 'city', population: 18764, config: { culture: 'celtic' },
    institutions: [
      { name: "Thieves' guild chapter", category: 'Criminal', priorityCategory: 'criminal', catalogId: 'thieves_guild_chapter',
        desc: 'A chapter of organised crime, workable only past 10,000 people. Thirty to a hundred members.', tags: ['criminal'] },
      { name: 'Whisper market', category: 'Criminal', priorityCategory: 'criminal', catalogId: 'whisper_market',
        desc: 'The covert guild scale. Brokers deal in knowledge by the piece.', tags: ['criminal', 'information', 'brokerage'],
        serviceKeys: ['info_calibration', 'info_query', 'info_feed', 'info_plant'] },
      { name: 'Parish churches (10-30)', category: 'Religious', priorityCategory: 'religion', catalogId: 'parish_churches_10_30',
        desc: 'One for each neighbourhood.', tags: ['essential', 'religious', 'church'] },
    ],
    availableServices: {
      equipment: [{ name: 'Graded purchase', desc: "Buy a piece of knowledge with the seller's own grade attached to it.", institution: 'Whisper market' }],
      healing: [{ name: 'Weekly rite', desc: 'The weekly service.', institution: 'Parish churches (10-30)' }],
      criminal: [{ name: 'Contraband goods', desc: 'Restricted, stolen, or untaxed goods.', institution: 'Black market' }],
    },
    powerStructure: {
      factions: [
        { faction: "Thieves' Guild", power: 5, rawPower: 4, powerLabel: 'Suppressed', category: 'criminal',
          desc: 'Organised criminal network controls the black market.', members: [{ id: 'npc_9', name: 'Fenn' }] },
        { faction: 'Merchant Guilds', power: 30, powerLabel: 'Strong', category: 'economic', desc: 'The trades.' },
      ],
      criminalCaptureState: 'adversarial',
      factionRelationships: [{ pair: ["Thieves' Guild", 'Merchant Guilds'], type: 'rivalry', captureState: 'adversarial' }],
    },
    economicState: { safetyProfile: {
      criminalInstitutions: ['Smuggling Network', "Thieves' Guild Chapter"], crimeTypes: [{ type: 'Smuggling', desc: 'x' }],
      blackMarketCapture: 22, safetyLabel: 'Strained' } },
    history: { historicalEvents: [{ name: 'The Iron Dispute', type: 'economic', yearsAgo: 79, severity: 'major',
      description: 'Rights to the local iron deposits became the subject of a prolonged dispute.',
      plotHooks: ['Old deed to the iron rights has resurfaced in an estate sale'] }] },
    conflicts: [{ parties: ['The Free Alliance', 'The Administrative Circle'], issue: 'Military conscription', stakes: 'Labor control',
      intensity: 'moderate', plotHooks: ['A neutral figure is being pressured by both.'] }],
  });
  // seed ux-audit-v2-2026-10-30-35, Vikhavn (metropolis): the catalog's clandestine and
  // subterranean facets, and a corrupt council member with a secret (a DM-opened share).
  const vikhavn = () => ({
    id: 'v1', name: 'Vikhavn', tier: 'metropolis', population: 45380, config: { culture: 'norse' },
    institutions: [
      { name: 'Underground network', category: 'Criminal', priorityCategory: 'criminal', catalogId: 'underground_network',
        desc: 'A warren of tunnels beneath the city, wide enough for cargo.', tags: ['criminal', 'smuggling', 'underground'],
        facets: { clandestine: 'clandestine', subterranean: 'subterranean' } },
      { name: 'Underground city', category: 'Criminal', priorityCategory: 'criminal', catalogId: 'underground_city',
        desc: 'An old warren of catacombs and passages.', tags: ['criminal', 'underground'], facets: { subterranean: 'subterranean' } },
    ],
    npcs: [{ id: 'npc_11', name: 'Dalla Njálsson', role: 'Council Member', personality: { flaw: 'paranoid' },
      secret: { what: "Has been reading Ljot Randversson's correspondence." }, plotHooks: ['A contract they signed has a clause.'],
      corrupt: true, corruptionVector: 'fear', corruptTies: { criminalInstitution: 'Underground network' } }],
  });
  // seed ux-audit-v2-2026-10-30-0, Temürpolis (thorp): no criminal anything, no secrets.
  const temurpolis = () => ({
    id: 't1', name: 'Temürpolis', tier: 'thorp', population: 55, config: { culture: 'generic' },
    institutions: [{ name: 'Subsistence farming', category: 'Economy', priorityCategory: 'economy', catalogId: 'subsistence_farming',
      desc: 'Each household farms ~12-16 acres for survival.', tags: ['essential', 'agriculture'] }],
    npcs: [{ id: 'npc_1', name: 'Oyuun', role: 'Elder', personality: { flaw: 'stubborn' } }],
    availableServices: { food: [{ name: 'Meals and drink', desc: 'Food and ale', institution: 'Dwellings (4-16)' }], criminal: [] },
  });
  // seed ux-audit-v2-2026-10-30-15, Roccavilla: the LICENSED listening post (catalog tag 'legal').
  const listeningPost = { name: 'Listening post', category: 'Economy', priorityCategory: 'economy', catalogId: 'listening_post',
    desc: 'A small licensed register office among much larger trades.', tags: ['legal', 'information', 'brokerage'],
    serviceKeys: ['info_calibration', 'info_query'] };

  const rowsOf = (s, cls) => defaultVeilFor(s).filter(d => d.cls === cls).map(d => d.address);
  const project = (s) => applyVeil(s, resolveVeil(defaultVeilFor(s), []));

  it('criminal institution: a town with a thieves\' guild hides its depth (name and category stay); a town without has no such row', () => {
    expect(rowsOf(bailthwaite(), 'criminal-institution')).toEqual(expect.arrayContaining([
      "field:institution:thieves-guild-chapter:description", 'field:institution:thieves-guild-chapter:services',
      'field:institution:thieves-guild-chapter:people', 'field:institution:thieves-guild-chapter:function',
    ]));
    expect(rowsOf(temurpolis(), 'criminal-institution')).toEqual([]);
    const out = project(bailthwaite());
    const guild = out.institutions.find(i => i.name === "Thieves' guild chapter");
    expect(guild.category).toBe('Criminal');
    expect('desc' in guild).toBe(false);
    expect('tags' in guild).toBe(false);
    expect(out.institutions.find(i => i.category === 'Religious').desc).toBe('One for each neighbourhood.');
  });

  it('criminal services category: the classifier category goes whole, and a criminal house\'s rows in other categories go with it', () => {
    const out = project(bailthwaite());
    expect('criminal' in out.availableServices).toBe(false);
    expect(out.availableServices.equipment).toEqual([]);
    expect(out.availableServices.healing.map(r => r.name)).toEqual(['Weekly rite']);
    expect(project(temurpolis()).availableServices.food.map(r => r.name)).toEqual(['Meals and drink']);
  });

  it('clandestine institution: the declared clandestine/subterranean facets hide the true function; the front (name) stays', () => {
    expect(DEFAULT_VEIL_RULES.find(r => r.cls === 'clandestine-institution').select(vikhavn())).toEqual(expect.arrayContaining([
      'field:institution:underground-network:description', 'field:institution:underground-network:function',
      'field:institution:underground-city:description',
    ]));
    // A criminal house with no declared facet is not clandestine (it is still criminal).
    expect(DEFAULT_VEIL_RULES.find(r => r.cls === 'clandestine-institution').select(bailthwaite())).toEqual([]);
    const out = project(vikhavn());
    expect(out.institutions.map(i => i.name)).toEqual(['Underground network', 'Underground city']);
    expect(out.institutions.every(i => !('desc' in i) && !('facets' in i))).toBe(true);
  });

  it('covert brokerage: the catalog\'s illegal house (brokerage keys plus the criminal tag) is hidden; the licensed listening post is shown', () => {
    expect(rowsOf(bailthwaite(), 'covert-brokerage')).toEqual(expect.arrayContaining(['field:institution:whisper-market:description']));
    const withPost = { ...temurpolis(), institutions: [listeningPost] };
    expect(rowsOf(withPost, 'covert-brokerage')).toEqual([]);
    expect(project(withPost).institutions[0].desc).toBe('A small licensed register office among much larger trades.');
  });

  it('criminal faction: members, goals, conflicts and description hidden; name, category and standing stay', () => {
    expect(rowsOf(bailthwaite(), 'criminal-faction')).toEqual(expect.arrayContaining(["field:faction:faction.thieves_guild:members"]));
    const f = project(bailthwaite()).powerStructure.factions;
    expect(f[0]).toEqual({ faction: "Thieves' Guild", power: 5, rawPower: 4, powerLabel: 'Suppressed', category: 'criminal' });
    expect(f[1].desc).toBe('The trades.');
    expect(rowsOf(temurpolis(), 'criminal-faction')).toEqual([]);
  });

  it('NPC secrets and corruption flags: class switches where the data carries them (a DM-opened share), none where it does not', () => {
    expect(rowsOf(vikhavn(), 'npc-secret')).toEqual(['class:npc:secret']);
    expect(rowsOf(vikhavn(), 'npc-corruption')).toEqual(['class:npc:corruption']);
    expect(rowsOf(temurpolis(), 'npc-secret')).toEqual([]);
    expect(rowsOf(temurpolis(), 'npc-corruption')).toEqual([]);
    const d = project(vikhavn()).npcs[0];
    for (const k of ['secret', 'corrupt', 'corruptionVector', 'corruptTies']) expect(k in d).toBe(false);
    expect(d.personality).toEqual({ flaw: 'paranoid' });
  });

  it("Defense's criminal architecture and Power's capture reading: their data goes and the groupings are listed", () => {
    const out = project(bailthwaite());
    const sp = out.economicState.safetyProfile;
    expect('criminalInstitutions' in sp || 'crimeTypes' in sp || 'blackMarketCapture' in sp).toBe(false);
    expect(sp.safetyLabel).toBe('Strained');
    expect('criminalCaptureState' in out.powerStructure).toBe(false);
    expect(out.powerStructure.factionRelationships[0]).toEqual({ pair: ["Thieves' Guild", 'Merchant Guilds'], type: 'rivalry' });
    expect(isVeiled(out, 'block:defense.criminalStructure')).toBe(true);
    expect(isVeiled(out, 'block:power.criminalUnderside')).toBe(true);
  });

  it('defense vulnerabilities and engine housekeeping: hidden by default', () => {
    // Constructed: the thousand carries no row the Defense predicate selects (measured, 0 / 1000).
    const s = { ...temurpolis(), structuralViolations: [{ type: 'defense_gap', reason: 'No garrison despite a frontier position.', severity: 'warning' }],
      structuralSuggestions: [{ type: 'add', suggested: 'Palisade', reason: 'r' }],
      coherenceNotes: [{ type: 'power_economic', severity: 'notable', tab: 'power', note: 'Economic activity flows through religious institutions.' }] };
    const just = applyVeil(s, ['block:defense.vulnerabilities']);
    expect(just.structuralViolations).toEqual([]);
    const out = project(s);
    for (const k of ['structuralViolations', 'structuralSuggestions', 'coherenceNotes']) expect(k in out).toBe(false);
    for (const g of ['block:housekeeping.firstSurvey', 'block:housekeeping.receipt', 'block:housekeeping.decrees', 'block:rumors.dmTruth', 'block:war.truthVsBelief']) {
      expect(isVeiled(out, g)).toBe(true);
    }
  });

  it('every plot hook (X-21d): the Plot Hooks tab and every hook field on every card', () => {
    const s = { ...bailthwaite(), ...{ npcs: vikhavn().npcs }, stress: [{ type: 'succession_void', label: 'Succession Void', crisisHook: 'Three factions approach the players.' }] };
    expect(rowsOf(s, 'plot-hooks')).toEqual(expect.arrayContaining(['tab:plot_hooks', 'class:npc:hooks', 'class:event:hooks', 'class:conflict:hooks']));
    const out = project(s);
    expect(/plotHooks|crisisHook/.test(JSON.stringify(out))).toBe(false);
    expect(JSON.stringify(out).includes('Old deed')).toBe(false);
    expect(out.history.historicalEvents[0].description).toMatch(/iron deposits/);
    expect(out.stress[0].label).toBe('Succession Void');
  });

  it('the groupings are static: every share lists the same ones, so the list never betrays what a town had', () => {
    const groupingsOf = (s) => project(s).galleryVeil.hidden;
    expect(groupingsOf(temurpolis())).toEqual(groupingsOf(bailthwaite()));
    expect(groupingsOf({})).toEqual(groupingsOf(bailthwaite()));
  });

  it('everything else is shown: a town with nothing to hide loses only its housekeeping and hooks', () => {
    const s = temurpolis();
    const out = project(s);
    expect(out.institutions).toEqual(s.institutions);
    expect(out.npcs).toEqual(s.npcs);
    expect(out.availableServices.food).toEqual(s.availableServices.food);
  });
});
