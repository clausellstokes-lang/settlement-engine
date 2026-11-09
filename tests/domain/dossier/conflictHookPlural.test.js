/**
 * conflictHookPlural.test.js — A PARTY IS A NAME AND A NUMBER (SW-10 HOOKS, 2026-11-09;
 * FIX-HOOK-OBJECT's intake, SW-9's hand-back).
 *
 * The defect, measured on the soak's 1,000 at bd07005b9: 268 conflict hooks in the 616 towns that
 * hold a plural power printed a singular verb, pronoun or possessive against it — "Religious
 * Authorities has posted guards on what it says is its own, and Merchant Guilds says … was never
 * Religious Authorities's to hold." Every two-party template of every issue family now agrees with
 * the party it slots (`domain/dossier/hookLines.js :: hookPartyOf`); a singular party reads its
 * old sentence byte for byte.
 */
import { describe, expect, it } from 'vitest';

import { HOOK_LINE_POOLS, createConflictHookDraw } from '../../../src/domain/dossier/hookLines.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';

const GUARDED = factsOf({ tier: 'town', institutions: [{ name: 'Town watch' }] });

/** One issue per family (conflictHookDraw.test.js's list, the writer's own strings). */
const ISSUE_OF_FAMILY = Object.freeze({
  licence: 'Control of the market licensing process',
  jurisdiction: 'Jurisdiction over a disputed arrest',
  property: 'Church land claims on guild property',
  revenue: 'Control of the dock taxation authority',
  people: 'Military conscription of guild apprentices',
  seat: 'Succession to a council seat',
  standing: "Access to the criminal network's intelligence",
});

/** Every line of one family, drawn through the collector's own draw (one draw walks the pool once). */
function everyLine(family, a, b) {
  const draw = createConflictHookDraw(GUARDED);
  const n = HOOK_LINE_POOLS.conflict[family].length;
  const out = [];
  for (let k = 0; k < n; k += 1) out.push(...draw({ parties: [a, b], issue: ISSUE_OF_FAMILY[family] }));
  return out;
}

// a party as the SUBJECT of its clause: the sentence's head, after ", and ", or after the seat family's
// bare "<issue> and" (a party named inside "between A and B" or "no part in A or B" is not a subject)
const SINGULAR_AFTER = /(?:^|, and |seat and )(?:Religious Authorities|Merchant Guilds) (?:has|is|says|knows|benefits|does|agrees|owes|answers)\b|than (?:Religious Authorities|Merchant Guilds) does\b/;
const PARTY_PRONOUN = /\bits own\b|\bit (?:says|owes|will|no longer|answers)\b/;

describe('the conflict hooks agree with a plural power', () => {
  it('seven families, every line: a plural party takes a plural verb, possessive and pronoun', () => {
    expect(Object.keys(HOOK_LINE_POOLS.conflict).sort()).toEqual(Object.keys(ISSUE_OF_FAMILY).sort());
    const faults = [];
    for (const family of Object.keys(ISSUE_OF_FAMILY)) {
      const lines = [...everyLine(family, 'Religious Authorities', 'Merchant Guilds'), ...everyLine(family, 'Merchant Guilds', 'Religious Authorities')];
      expect(lines.length).toBe(2 * HOOK_LINE_POOLS.conflict[family].length);
      for (const line of lines) {
        if (SINGULAR_AFTER.test(line) || /s's\b/.test(line) || PARTY_PRONOUN.test(line)) faults.push(`${family}: ${line}`);
      }
    }
    expect(faults).toEqual([]);
  });

  it('a plural party reads its own words: "have", "their", "Guilds\'"', () => {
    const all = Object.keys(ISSUE_OF_FAMILY).flatMap((f) => everyLine(f, 'Religious Authorities', 'Merchant Guilds'));
    expect(all.some((l) => /Religious Authorities have\b/.test(l))).toBe(true);
    expect(all.some((l) => /\btheir own\b/.test(l))).toBe(true);
    expect(all.some((l) => /Merchant Guilds' /.test(l) || /Religious Authorities' /.test(l))).toBe(true);
  });

  it('a singular party reads the old sentence, byte for byte', () => {
    const lines = everyLine('property', 'Elder Council', "Thieves' Guild");
    expect(lines).toContain("Elder Council has posted guards on what it says is its own, and Thieves' Guild says church land claims on guild property was never Elder Council's to hold.");
    // the head word decides: "Military/Guard" and "Thieves' Guild" are one body each
    const mixed = everyLine('licence', 'Military/Guard', 'Merchant Guilds');
    expect(mixed).toContain('Military/Guard has begun issuing its own papers over control of the market licensing process, and Merchant Guilds are refusing to honour them.');
  });
});
