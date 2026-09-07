/**
 * galleryReactionVocab.test.js — pins for the six structured gallery reactions
 * (GALLERY-2 phase 2).
 *
 * Three lists carry the same vocabulary and MUST never drift:
 *   1. src/data/galleryReactionVocab.js (REACTION_VOCAB — the client truth)
 *   2. the gallery_reactions.reaction_key CHECK constraint (migration 146)
 *   3. the toggle_gallery_reaction in-body vocabulary guard (migration 146)
 * This file extracts 2 + 3 from the migration SQL verbatim and compares them to
 * 1, and pins the owner-approved labels VERBATIM so a well-meaning copy edit
 * can't ship silently.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { REACTION_VOCAB, REACTION_KEYS, REACTION_LABELS } from '../../src/data/galleryReactionVocab.js';

const MIG_145 = resolve(process.cwd(), 'supabase', 'migrations', '145_gallery_reactions.sql');

/** Every quoted key list of the form in ('a', 'b', ...) found in the SQL. */
function extractKeyLists(sql) {
  const lists = [];
  const re = /in\s*\(\s*((?:'[a-z_]+'\s*,?\s*)+)\)/gi;
  let m;
  while ((m = re.exec(sql)) !== null) {
    const keys = [...m[1].matchAll(/'([a-z_]+)'/g)].map(k => k[1]);
    // Only reaction-shaped lists (skip unrelated IN-lists if the file grows).
    if (keys.includes('worth_walking')) lists.push(keys);
  }
  return lists;
}

describe('gallery reaction vocabulary (GALLERY-2 phase 2)', () => {
  it('has exactly the six owner-approved labels, VERBATIM', () => {
    expect(REACTION_VOCAB.map(r => r.label)).toEqual([
      'A world worth walking',
      'Finely wrought',
      'Steeped in history',
      "I'd run a campaign here",
      'The map speaks',
      'True to life',
    ]);
  });

  it('is deeply frozen (a mutation attempt must not stick)', () => {
    expect(Object.isFrozen(REACTION_VOCAB)).toBe(true);
    expect(REACTION_VOCAB.every(entry => Object.isFrozen(entry))).toBe(true);
    expect(Object.isFrozen(REACTION_KEYS)).toBe(true);
    expect(Object.isFrozen(REACTION_LABELS)).toBe(true);
    expect(() => { REACTION_VOCAB[0].label = 'Nice map'; }).toThrow();
  });

  it('keys are unique, snake_case identifiers', () => {
    expect(new Set(REACTION_KEYS).size).toBe(REACTION_KEYS.length);
    for (const key of REACTION_KEYS) expect(key).toMatch(/^[a-z][a-z_]*$/);
  });

  // Anti-vacuity: if migration 146 is renamed/renumbered the parity pins below
  // would silently skip — fail loudly instead (actionVelocity.pglite idiom).
  it('migration 145_gallery_reactions.sql exists (renumber must fail loudly)', () => {
    expect(existsSync(MIG_145), `migration missing: ${MIG_145}`).toBe(true);
  });

  it('matches the SQL vocabulary — the table CHECK and the RPC guard both list exactly these keys', () => {
    const sql = readFileSync(MIG_145, 'utf-8');
    const lists = extractKeyLists(sql);
    // One list in the CHECK constraint + one in the toggle RPC's guard.
    expect(lists.length, 'expected the CHECK-constraint list and the RPC-guard list').toBeGreaterThanOrEqual(2);
    for (const list of lists) {
      expect([...list].sort()).toEqual([...REACTION_KEYS].sort());
    }
  });
});
