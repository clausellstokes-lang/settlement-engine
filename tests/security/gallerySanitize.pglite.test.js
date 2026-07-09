/**
 * gallerySanitize.pglite.test.js — EXECUTION test for the SERVER public
 * projection _gallery_sanitize_public_json (migration 050 §3).
 *
 * The drift pin (gallerySanitizeAllowlist.contract.test.js) proves the SQL and
 * JS allowlists are the same SET; this proves the SQL sanitizer actually BEHAVES
 * like the allowlist at runtime — and matches the client twin toPublicSafe
 * output field-for-field on a representative settlement. The function is
 * self-contained (recurses only into itself), so it loads verbatim into pglite
 * with no stubs.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';

const MIGRATION = resolve(process.cwd(), 'supabase', 'migrations', '050_money_and_public_projection_hardening.sql');
const migExists = existsSync(MIGRATION);

function extractFn(sql, name) {
  const m = sql.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'i'));
  if (!m) throw new Error(`could not extract ${name}`);
  return m[0];
}

// A representative settlement: allowlisted public content, generation-time private
// leakers (aiOverlays/userCanon/simulationTrace), the narrated public prose
// (thesis/dailyLife), later-attached DM blocks, a nested DM key inside an allowed
// subtree, and NPCs with private fields.
const SETTLEMENT = {
  name: 'Brackwater', tier: 'town', population: 1200,
  coherenceNotes: 'a public contradiction note',
  history: { founding: 'salt', dmNote: 'the mayor lies', currentTensions: ['visible'] },
  npcs: [{ id: 'n1', name: 'Aldric', role: 'Mayor', influence: 80, goal: 'seize power', secret: 'bastard heir', plotHooks: ['x'], relationships: [{}] }],
  thesis: 'A salt town that forgot its founding.',
  dailyLife: 'Dawn over the brine flats.',
  // generation-time private (denylist MISSED these — the leak the flip closes):
  aiOverlays: [{ prose: 'ai' }], userCanon: { homebrew: 'mine' }, simulationTrace: [{ step: 1 }],
  // later-attached DM blocks + a brand-new key the OLD denylist would miss:
  dmNotes: 'the BBEG is the mayor', aiData: { aiSettlement: {} }, dmCompass: { twist: 't' },
  plotHooks: ['hidden heir'], campaign: { worldState: {} }, pendingEdits: [{}],
  dmBriefingV2: { theTruth: 'must not leak' },
};

let db;

describe.runIf(migExists)('_gallery_sanitize_public_json — execution + client parity (pglite)', () => {
  let serverOut;

  beforeAll(async () => {
    db = new PGlite();
    const sql = readFileSync(MIGRATION, 'utf-8');
    await db.exec(extractFn(sql, '_gallery_sanitize_public_json'));
    const row = (await db.query(
      `select public._gallery_sanitize_public_json($1::jsonb) as j`,
      [JSON.stringify(SETTLEMENT)],
    )).rows[0];
    serverOut = row.j;
  });

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
