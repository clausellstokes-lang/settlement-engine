/**
 * governmentLabelFromKindTable.walker.test.js — E94 (c): EVERY WRITER OF THE GOVERNMENT'S LABEL DRAWS FROM A KIND TABLE (the
 * chair's E94 (c) of 2026-11-22, vetoable by the owner; R5DESC-MEASURE M4's proposed pin, VEIL-34 out/v34/r5desc/R5DESC-MEASURE.md;
 * written by VEIL-37's R5D-PAGE-A, brief item 6).
 *
 * THE CLASS. `powerStructure.governingName` and `powerStructure.government` are served on every read and printed by the
 * governance account. R5DESC-MEASURE found every writer drawing the label from a KIND TABLE, never composing it from a
 * house's or a power's own name (no STOP): the power step (rulingStructure.js :: generatePowerStructure, the governing row's
 * `faction`, chosen through rulerKin.js :: drawCouncilOfAKind from governanceLabelMap, the council modifier table and the
 * tier tables), its replay (economyReconciliation.js :: reconcilePowerStructure, copying the replay's two), the transfer
 * (rulingPower.js :: transferRulingPower via resolveGovernmentLabel: GOVERNMENT_PREFERENCES, ALT_GOVERNMENT_LABELS, else
 * `<label> Ascendant`) and the DM's own rename (factionRename.js, by rewriteKey). One dormant writer would break the class:
 * densityAscension.js :: planSeatAscension mints a seat row named by a POWER'S OWN NAME (`ascendingPower`) and has NO CALLER
 * in src/.
 *
 * THE WALKER. (1) Every code line under src/ that WRITES the label onto a power structure (`powerStructure.governingName =`,
 * `powerStructure.government =`, `rewriteKey(<x>, 'governingName' | 'government', ...)`, or a `governingName:` /
 * `government:` key in the power structure the power step or the transfer returns) is a SITE, registered below with its
 * source; a new writer reds until it is registered with its table (and the chair says so). (2) planSeatAscension GAINING A
 * CALLER under src/ reds (its row would carry a power's own name to the seat).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DECL_RE = /^(?:export\s+)?(?:default\s+)?(?:async\s+)?(?:function\s*\*?\s*([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=)/;
/** A write of the label onto a power structure (see the header). */
const WRITE = /powerStructure\.(?:governingName|government)\s*=(?!=)|rewriteKey\([^,]+,\s*'(?:governingName|government)'|^\s*(?:governingName|government)\s*:\s*(?:\(factions\.find|toGovernment\b)/;

/** @type {Readonly<Record<string, { n: number, table: string }>>} */
const REGISTER = Object.freeze({
  'src/generators/power/rulingStructure.js :: generatePowerStructure': { n: 2, table: 'the governing row\'s faction, chosen through rulerKin.js :: drawCouncilOfAKind from governanceLabelMap, the council modifier table and the tier tables' },
  'src/generators/power/economyReconciliation.js :: reconcilePowerStructure': { n: 2, table: 'copies the power step\'s replay (the tables above)' },
  'src/domain/rulingPower.js :: transferRulingPower': { n: 2, table: 'resolveGovernmentLabel: GOVERNMENT_PREFERENCES, ALT_GOVERNMENT_LABELS, else <label> Ascendant' },
  'src/domain/factionRename.js :: applyFactionRenameToSettlement': { n: 2, table: 'the DM\'s own new name for the seat (the rename ledger): the owner\'s hand' },
});

/** @param {string} d @returns {string[]} */
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : /\.(m?js|jsx)$/.test(n) ? [p] : []; });
/** Every site matching `re` under src/: { '<path> :: <symbol>': count }. */
function census(re) {
  /** @type {Record<string, number>} */ const out = {};
  for (const f of walk(join(ROOT, 'src'))) {
    const rel = relative(ROOT, f).split('\\').join('/');
    let sym = '(module)';
    for (const line of readFileSync(f, 'utf8').split('\n')) {
      const m = DECL_RE.exec(line);
      if (m) sym = m[1] || m[2];
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) continue;
      if (re.test(line)) out[`${rel} :: ${sym}`] = (out[`${rel} :: ${sym}`] || 0) + 1;
    }
  }
  return out;
}

describe('the judgment proves itself on synthetic lines (its own controls)', () => {
  it('WRITE matches a write of the label and not a read of it', () => {
    for (const l of ['  powerStructure.governingName = projected.governingName;', "    mark('x', rewriteKey(power, 'government', a, b));", '    governingName: (factions.find((f) => f.isGoverning) || {}).faction || null,', '        government: toGovernment,']) expect(WRITE.test(l), l).toBe(true);
    for (const l of ['  const governingName = s.powerStructure?.governingName || \'\';', '      governingName: r.powerStructure?.governingName,', "  government: 'Government', noble: 'Noble',", '  if (powerStructure.governingName === x) return;']) expect(WRITE.test(l), l).toBe(false);
  });
});

describe('E94 (c): every writer of the government\'s label draws from a kind table', () => {
  it('every writer is registered with its table; none is stale; a new writer reds', () => {
    const got = census(WRITE);
    expect(Object.keys(got).length, 'the census is not vacuous').toBeGreaterThanOrEqual(3);
    const unregistered = Object.entries(got).filter(([k]) => !REGISTER[k]).map(([k, n]) => `${k} (${n}): a writer of the government's label not registered with its kind table`);
    const stale = Object.keys(REGISTER).filter((k) => !got[k]).map((k) => `${k}: registered, not found`);
    const moved = Object.entries(REGISTER).filter(([k, r]) => got[k] && got[k] !== r.n).map(([k, r]) => `${k}: count ${got[k]}, registered ${r.n}`);
    expect({ unregistered, stale, moved }).toEqual({ unregistered: [], stale: [], moved: [] });
  });

  it('densityAscension.js :: planSeatAscension (a seat row named by a power\'s own name) has NO CALLER under src/: gaining one reds', () => {
    const got = census(/\bplanSeatAscension\b/);
    // anchored: the census finds the declaration itself, so the empty caller list is a judgment over a census that ran
    expect(got['src/generators/density/densityAscension.js :: planSeatAscension'], 'the declaration is found').toBe(1);
    const callers = Object.keys(got).filter((k) => k !== 'src/generators/density/densityAscension.js :: planSeatAscension');
    expect(callers, 'planSeatAscension gained a caller: its seat row carries a power\'s own name (E94 (c)); register its label\'s table and have the chair rule').toEqual([]);
  });
});
