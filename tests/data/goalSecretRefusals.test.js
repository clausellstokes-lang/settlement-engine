/**
 * goalSecretRefusals.test.js — THE CLOSED LIST STANDS IN ITS POOLS (GOALS-1, builder 4; the brief's AMENDMENT 2 item 6 and
 * AMENDMENT 3 item 8; the chair's rulings of 2026-11-20 11:15, 11:24 and 11:32 UTC).
 *
 *   (i) every row of `data/people/goalSecretRefusals.js :: GOAL_SECRET_REFUSAL_ROWS` exists in its pool at its key with its
 *       text (`npcData.js :: NPC_CRIMINAL_SECRETS_BY_HOLDER`, `titleSecretsPresentations.js :: TITLE_SECRETS`,
 *       `stressInstitutionEffects.js :: STRESS_INSTITUTION_EFFECTS`): a reworded or removed secret reds here, never falls
 *       out of the refusal unseen; the refused clusters are PERSONALITY clusters;
 *   (8) every rare key of `GOAL_SECRET_REFUSAL_RARE_KEYS` is a row of `data/rareSecrets.js :: RARE_SECRET_ROWS`.
 */
import { describe, expect, test } from 'vitest';
import { GOAL_SECRET_REFUSAL_RARE_KEYS, GOAL_SECRET_REFUSAL_ROWS, GOAL_SECRET_REFUSED_CLUSTERS } from '../../src/data/people/goalSecretRefusals.js';
import { PERSONALITY_CLUSTERS } from '../../src/data/people/goalFamilies.js';
import { NPC_CRIMINAL_SECRETS_BY_HOLDER } from '../../src/data/npcData.js';
import { TITLE_SECRETS } from '../../src/data/people/titleSecretsPresentations.js';
import { STRESS_INSTITUTION_EFFECTS } from '../../src/data/stressInstitutionEffects.js';
import { RARE_SECRET_FAMILIES, RARE_SECRET_ROWS } from '../../src/data/rareSecrets.js';

/** The pool's text at a closed-list key, or undefined (a key of no pool, a row gone). @param {string} key @returns {unknown} */
function poolTextAt(key) {
  let m = /^criminal\.([^.]+)\.([^[]+)\[(\d+)\]$/.exec(key);
  if (m) return /** @type {any} */ (NPC_CRIMINAL_SECRETS_BY_HOLDER)[m[1]]?.[m[2]]?.[Number(m[3])]?.secret;
  m = /^title:(.+)\[(\d+)\]$/.exec(key);
  if (m) return /** @type {any} */ (TITLE_SECRETS)[m[1]]?.[Number(m[2])]?.secret;
  m = /^stress:(.+)\[(\d+)\]$/.exec(key);
  if (m) return /** @type {any} */ (STRESS_INSTITUTION_EFFECTS)[m[1]]?.[Number(m[2])]?.secret;
  return undefined;
}

/** Every row whose text is not its pool's text at its key, as `key: text`. @param {Record<string, string>} rows */
const offPool = (rows) => Object.entries(rows).filter(([k, t]) => poolTextAt(k) !== t).map(([k, t]) => `${k}: ${t}`);

/**
 * THE PARITY ARM'S READ (the chair's ruling of 2026-11-20 16:04 UTC, R2: the leaf is a matcher, never printed, admitted
 * as an instrument on this arm): every LIVE secret line of the three source pools, wherever it stands.
 * @type {Set<unknown>}
 */
const LIVE_SECRETS = new Set([
  ...Object.values(NPC_CRIMINAL_SECRETS_BY_HOLDER).flatMap((byType) => Object.values(/** @type {any} */ (byType)).flat()),
  ...Object.values(TITLE_SECRETS).flat(),
  ...Object.values(STRESS_INSTITUTION_EFFECTS).flat(),
].map((row) => /** @type {any} */ (row)?.secret).filter((t) => typeof t === 'string'));

/** Every text of the rows that no source pool holds as a live secret line. @param {Record<string, string>} rows */
const orphans = (rows) => Object.values(rows).filter((t) => !LIVE_SECRETS.has(t));

describe('the want refused beside the card\'s own secret: the closed list', () => {
  test('(i) the closed list holds its 119 rows, each in its pool at its key with its text', () => {
    expect(Object.keys(GOAL_SECRET_REFUSAL_ROWS)).toHaveLength(119);
    expect(offPool(GOAL_SECRET_REFUSAL_ROWS)).toEqual([]);
    expect(Object.isFrozen(GOAL_SECRET_REFUSAL_ROWS)).toBe(true);
  });

  test('(i) CONTROL: a reworded row, a moved index and an unknown pool each red the reader', () => {
    const [key, text] = Object.entries(GOAL_SECRET_REFUSAL_ROWS)[0];
    expect(offPool({ [key]: `${text} zq` })).toHaveLength(1);
    expect(offPool({ [key.replace(/\[(\d+)\]$/, (_m, i) => `[${Number(i) + 900}]`)]: text })).toHaveLength(1);
    expect(offPool({ 'rumour:the miller[0]': text })).toHaveLength(1);
  });

  test('(i) PARITY: every text of the closed list is a live secret line of its source pool; a text no pool holds reds', () => {
    expect(LIVE_SECRETS.size, 'anti-vacuity: the three pools are read').toBeGreaterThan(Object.keys(GOAL_SECRET_REFUSAL_ROWS).length);
    expect(orphans(GOAL_SECRET_REFUSAL_ROWS)).toEqual([]);
    expect(offPool(GOAL_SECRET_REFUSAL_ROWS)).toEqual([]);
    // the control: a planted orphan reds the arm's read, beside a live row that does not
    const [key, text] = Object.entries(GOAL_SECRET_REFUSAL_ROWS)[0];
    expect(orphans({ [key]: text, planted: `${text} zq` })).toEqual([`${text} zq`]);
  });

  test('the refused clusters are conviction and duty, both PERSONALITY clusters', () => {
    expect([...GOAL_SECRET_REFUSED_CLUSTERS].sort()).toEqual(['conviction', 'duty']);
    for (const c of GOAL_SECRET_REFUSED_CLUSTERS) expect(PERSONALITY_CLUSTERS).toContain(c);
  });

  test('(8) every rare key is a row of RARE_SECRET_ROWS', () => {
    const keys = RARE_SECRET_FAMILIES.flatMap((f) => /** @type {any[]} */ (/** @type {any} */ (RARE_SECRET_ROWS)[f]).map((r) => r.key));
    expect(GOAL_SECRET_REFUSAL_RARE_KEYS.length).toBe(4);
    expect(GOAL_SECRET_REFUSAL_RARE_KEYS.filter((k) => !keys.includes(k))).toEqual([]);
  });
});
