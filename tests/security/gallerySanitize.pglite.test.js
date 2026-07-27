/**
 * gallerySanitize.pglite.test.js — EXECUTION test for the SERVER public
 * projection _gallery_sanitize_public_json (Wave-1 fused migration 123 §3, amended
 * net-current by 128 to strip the latent pantheon).
 *
 * The drift pin (gallerySanitizeAllowlist.contract.test.js) proves the SQL and
 * JS allowlists are the same SET; this proves the SQL sanitizer actually BEHAVES
 * like the allowlist at runtime — and matches the client twin toPublicSafe
 * output field-for-field on a representative settlement. The function is
 * self-contained (recurses only into itself), so it loads verbatim into pglite
 * with no stubs.
 *
 * It loads the NET-CURRENT sanitizer (latest-wins across all migrations), so a
 * later amendment (e.g. `latentPantheon` in 128) is exercised, not a superseded
 * definition.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';

const MIGRATIONS_DIR = resolve(process.cwd(), 'supabase', 'migrations');

/** Latest-wins extraction of the net-current `_gallery_sanitize_public_json`
 *  function body across all migrations (file order). Returns the LAST definition so
 *  the EFFECTIVE server sanitizer is tested, not a superseded one. */
function netCurrentSanitizerSql() {
  if (!existsSync(MIGRATIONS_DIR)) return null;
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => /^\d.*\.sql$/.test(f)).sort();
  // ⚠ ANCHORED AT LINE START (`^` + m) — the unanchored form also matches header
  // prose quoting the statement (see tests/security/moneyRpcNetCurrentGuards.test.js).
  const re = /^create\s+or\s+replace\s+function\s+public\._gallery_sanitize_public_json\b[\s\S]*?\$\$;/igm;
  let last = null;
  for (const f of files) {
    const src = readFileSync(join(MIGRATIONS_DIR, f), 'utf-8');
    const matches = src.match(re);
    if (matches && matches.length) last = matches[matches.length - 1];
  }
  return last;
}

const SANITIZER_SQL = netCurrentSanitizerSql();

// A representative settlement: allowlisted public content, generation-time private
// leakers (aiOverlays/userCanon/simulationTrace), the narrated public prose
// (thesis/dailyLife), later-attached DM blocks, a nested DM key inside an allowed
// subtree, NPCs with private fields, and a `config` carrying the LATENT pantheon
// (unrevealed — must strip) alongside the ACTIVATED live embeds (must survive).
const SETTLEMENT = {
  name: 'Brackwater', tier: 'town', population: 1200,
  coherenceNotes: 'a public contradiction note',
  // (130) economics-attribution notes nested in an allowlisted subtree: PUBLIC
  // annotations that must SURVIVE the narrowed `note` token, beside a dmNotes-class /
  // bare notes key that must still strip. The economics tab renders these publicly.
  economicState: {
    magicFoodNote: 'Divine provision supplements food shortfall',
    storageNote: '8 months strategic reserve',
    activeChains: [{ id: 'grain', upstreamNote: 'Imported inputs: grain', dmNote: 'the miller skims the granary' }],
    dossierNotes: 'DM prep for the famine arc',
    notes: 'scratch pad',
  },
  history: { founding: 'salt', dmNote: 'the mayor lies', currentTensions: ['visible'] },
  // (142) institutions carry a COVERT corruption impairment whose description NAMES the
  // corrupted NPC — hidden DM state that must NOT reach the anon dossier — beside a
  // NON-covert public impairment that must SURVIVE. `institutions` is allowlisted, so
  // this exercises the value-level covert-object drop.
  institutions: [{
    name: 'The Tanners Guild', category: 'Crafts',
    impairments: [
      { type: 'corruption', severity: 'moderate', covert: true, causeEventId: 'evt_capture_9', appliedAt: 42,
        description: "Aldric's capture quietly compromised The Tanners Guild." },
      { type: 'flood_damage', severity: 'minor', description: 'Spring floods damaged the drying racks.' },
    ],
  }],
  npcs: [{ id: 'n1', name: 'Aldric', role: 'Mayor', influence: 80, goal: 'seize power', secret: 'bastard heir', plotHooks: ['x'], relationships: [{}] }],
  thesis: 'A salt town that forgot its founding.',
  dailyLife: 'Dawn over the brine flats.',
  config: {
    // UNREVEALED — the Phase 4 premium gate secret; must never reach anon.
    latentPantheon: { patron: { name: 'The Deep', _deityRef: 'deity:core:the_deep' }, cults: [{ name: 'Ash' }] },
    // ACTIVATED live embeds — a shared premium pantheon is visible read-only to all.
    primaryDeityRef: 'deity:core:sun',
    primaryDeitySnapshot: { name: 'Sun', alignmentAxis: 'good', rankAxis: 'major' },
    cultDeitySnapshots: [{ name: 'Ash', alignmentAxis: 'evil' }],
    faithProfile: { patron: { name: 'Sun', share: 62 } },
  },
  // generation-time private (denylist MISSED these — the leak the flip closes):
  aiOverlays: [{ prose: 'ai' }], userCanon: { homebrew: 'mine' }, simulationTrace: [{ step: 1 }],
  // later-attached DM blocks + a brand-new key the OLD denylist would miss:
  dmNotes: 'the BBEG is the mayor', aiData: { aiSettlement: {} }, dmCompass: { twist: 't' },
  plotHooks: ['hidden heir'], campaign: { worldState: {} }, pendingEdits: [{}],
  dmBriefingV2: { theTruth: 'must not leak' },
};

let db;

// Anti-vacuity ([tests-3]/[test-quality-2]): if `_gallery_sanitize_public_json` is
// renamed or dropped across a migration merge, the extraction returns null and the
// execution suite below silently describe.runIf-skips while vitest stays green. This
// UNCONDITIONAL assert fails loudly — the net-current server sanitizer must exist.
describe('_gallery_sanitize_public_json exists in the migration corpus (guards against silent vacuous skip)', () => {
  it('a net-current _gallery_sanitize_public_json definition is present (renamed/dropped must fail loudly)', () => {
    expect(existsSync(MIGRATIONS_DIR), `migrations dir missing: ${MIGRATIONS_DIR}`).toBe(true);
    expect(SANITIZER_SQL, '_gallery_sanitize_public_json not found in any migration — renamed?').toBeTruthy();
  });
});

describe.runIf(!!SANITIZER_SQL)('_gallery_sanitize_public_json — execution + client parity (pglite)', () => {
  let serverOut;

  beforeAll(async () => {
    db = new PGlite();
    await db.exec(SANITIZER_SQL);
    const row = (await db.query(
      `select public._gallery_sanitize_public_json($1::jsonb) as j`,
      [JSON.stringify(SETTLEMENT)],
    )).rows[0];
    serverOut = row.j;
  }, 30000); // PGlite WASM cold-start is ~8s under parallel load — beyond the 10s default.

  it('keeps the allowlisted public fields (including the narrated prose)', () => {
    for (const k of ['name', 'tier', 'population', 'coherenceNotes', 'history', 'npcs', 'thesis', 'dailyLife']) {
      expect(serverOut, `public key "${k}" must survive`).toHaveProperty(k);
    }
    expect(serverOut.thesis).toBe(SETTLEMENT.thesis);
    expect(serverOut.dailyLife).toBe(SETTLEMENT.dailyLife);
  });

  it('drops every non-allowlisted top-level key (fail closed — leak + future keys)', () => {
    for (const k of [
      'aiOverlays', 'userCanon', 'simulationTrace',
      'dmNotes', 'aiData', 'dmCompass', 'plotHooks', 'campaign', 'pendingEdits',
      'dmBriefingV2',
    ]) {
      expect(serverOut[k], `"${k}" must not leak`).toBeUndefined();
    }
  });

  it('still strips DM-private keys nested inside an allowed subtree', () => {
    expect(serverOut.history.dmNote).toBeUndefined();
    expect(serverOut.history.currentTensions).toEqual(['visible']);
  });

  it('(128) strips config.latentPantheon but keeps the activated live embeds', () => {
    expect(serverOut.config).toBeTruthy();
    expect(serverOut.config.latentPantheon, 'the unrevealed latent pantheon must not leak').toBeUndefined();
    expect(serverOut.config.primaryDeityRef).toBe('deity:core:sun');
    expect(serverOut.config.primaryDeitySnapshot).toEqual({ name: 'Sun', alignmentAxis: 'good', rankAxis: 'major' });
    expect(serverOut.config.cultDeitySnapshots).toEqual([{ name: 'Ash', alignmentAxis: 'evil' }]);
    expect(serverOut.config.faithProfile).toEqual({ patron: { name: 'Sun', share: 62 } });
  });

  it('(130) keeps nested economics-attribution notes but strips the private note keys beside them', () => {
    // The narrowed `note` token: public economics annotations survive server-side
    // (the SETTLEMENT fixture nests them under the allowlisted economicState), while
    // dmNote (via \m(dm|gm)) / dossierNotes / a bare notes key still strip. This is the
    // SQL half of the coupled client+SQL narrowing (migration 130).
    expect(serverOut.economicState).toBeTruthy();
    expect(serverOut.economicState.magicFoodNote).toBe('Divine provision supplements food shortfall');
    expect(serverOut.economicState.storageNote).toBe('8 months strategic reserve');
    expect(serverOut.economicState.activeChains[0].upstreamNote).toBe('Imported inputs: grain');
    // …the DM-private / bare notes keys beside them are gone.
    expect(serverOut.economicState.activeChains[0].dmNote).toBeUndefined();
    expect(serverOut.economicState.dossierNotes).toBeUndefined();
    expect(serverOut.economicState.notes).toBeUndefined();
  });

  it('(142) drops a COVERT institution impairment (NPC-naming description) but keeps the public one', () => {
    // W-DOCTRINE-3 §6: a covert corruption impairment stamped on institutions[].impairments
    // names the corrupted NPC — hidden DM state. The value-level covert drop removes the
    // WHOLE object (a key-strip would leave the naming description). The non-covert public
    // impairment survives. This is the SQL half of the coupled client+SQL covert scrub (142).
    expect(serverOut.institutions).toHaveLength(1);
    expect(serverOut.institutions[0].name).toBe('The Tanners Guild');
    const imps = serverOut.institutions[0].impairments;
    expect(imps).toHaveLength(1);
    expect(imps[0].type).toBe('flood_damage');
    expect(imps.some(i => i && i.covert)).toBe(false);
    // FAIL-CLOSED: the NPC-naming description must appear NOWHERE in the projection.
    expect(JSON.stringify(serverOut)).not.toContain('quietly compromised');
    expect(JSON.stringify(serverOut)).not.toContain("Aldric's capture");
  });

  it('reduces NPCs to the public field allowlist (033, intact)', () => {
    expect(serverOut.npcs).toHaveLength(1);
    expect(serverOut.npcs[0].name).toBe('Aldric');
    expect(serverOut.npcs[0].influence).toBe(80);
    for (const k of ['goal', 'secret', 'plotHooks', 'relationships']) {
      expect(serverOut.npcs[0][k]).toBeUndefined();
    }
  });

  it('matches the client twin toPublicSafe field-for-field', () => {
    // The server and client are twins — same input, same public projection.
    expect(serverOut).toEqual(toPublicSafe(SETTLEMENT));
  });
});
