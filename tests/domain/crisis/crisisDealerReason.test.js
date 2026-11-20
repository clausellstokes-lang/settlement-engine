/**
 * FRAME-5 · C1 — THE DEALER'S REASON IS NEVER SAID TO THE DM (the chair's ruling 22 of 2026-11-20, FRAME-4-HANDBACK;
 * vetoable by the owner). "…; next in line, the first choice already holding a role that contradicts this one" is how the
 * cast was DEALT, not a fact of the town. The chair read it on a forged town's Crisis tab and on a hook of the Open
 * Tonight sheet.
 *
 *   1. STORED: `crisisCast.js :: take` stores the candidate's own reason, the fact alone (measured: 22 brunt rows of B7's
 *      690 carried the tail at 8b45003ef; the golden's 457 rows and the calm pool none). Pinned here on five of those
 *      towns, each re-born.
 *   2. THE RENDER STRIP: a town saved before C1 keeps its stored string, so every surface that prints a cast reason reads
 *      it through ONE function, `crisisCast.js :: castReasonShown` (the crisis page: the Crisis tab, the PDF chapter and
 *      the Foundry journal; the crisis hooks: the dossier's hooks and the Tonight sheet's). A STORED OLD ROW (the tail
 *      planted on every cast row) composes byte for byte as the row without it.
 *   3. THE CENSUS AND ITS GUARD: every cast-reason string a surface can print (the closed sets of crisisCast.js,
 *      `CAST_ABSENCES`, the stake reasons, each person's form) carries no dealer's clause; the clause is composed nowhere
 *      in `src/` but by the strip that cuts it.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import * as castModule from '../../../src/domain/crisis/crisisCast.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { composeCrisisPage } from '../../../src/domain/crisis/crisisPage.js';
import { crisisHookFor, crisisHooksOf } from '../../../src/domain/crisis/crisisHooks.js';
import { collectPlotHooks } from '../../../src/domain/dossier/plotHooks.js';
import { composeTonightSheet } from '../../../src/domain/summary/tonightSheet.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const { CAST_REASONS, CAST_ABSENCES, STAKE_REASONS, CAST_REASON_SIBLINGS, CAST_CRISIS_SIBLINGS } = castModule;

/** The dealer's clause, from its one home (never a second copy of the words). */
const CLAUSE = CAST_REASONS.nextInLine;
const TAIL = `; ${CLAUSE}`;

/**
 * Five towns of B7's pool whose brunt was the next of the house at 8b45003ef, and the reason each now stores (the
 * candidate's own: a person's possessive, a power's "its").
 * @type {Array<[seed: string, tier: string, kind: string, reason: string]>}
 */
const PASSED_OVER = [
  ['b7-monster_pressure-city-1', 'city', 'monster_pressure', 'her people stand on the walls'],
  ['b7-monster_pressure-metropolis-2', 'metropolis', 'monster_pressure', 'his people stand on the walls'],
  ['b7-famine-village-1', 'village', 'famine', CAST_REASONS.bruntMember],
  ['b7-plague_onset-village-0', 'village', 'plague_onset', CAST_REASONS.bruntBase.healing_capacity],
  ['b7-mass_migration-village-0', 'village', 'mass_migration', CAST_REASONS.bruntBase.social_trust],
];

/** @param {any} s */
const stressOf = (s) => (Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : [])).filter(Boolean);

/** Every surface that prints a cast reason, composed from one record. @param {any} s */
const surfaces = (s) => ({
  page: composeCrisisPage(s),
  plotHooks: collectPlotHooks(s),
  tonightOwner: composeTonightSheet(s, { audience: 'owner' }),
  tonightPlayer: composeTonightSheet(s),
  crisisHooks: stressOf(s).map((e) => crisisHooksOf(s, e)),
  crisisHookFor: stressOf(s).map((e) => crisisHookFor(s, e)),
});

/**
 * A STORED OLD ROW: the record as a town saved before C1 holds it, the dealer's tail on every cast row's reason (both
 * homes of the container: `stress` and its alias `stressors`). @param {any} s
 */
function plantOldRows(s) {
  const old = JSON.parse(JSON.stringify(s));
  for (const key of ['stress', 'stressors']) {
    const list = Array.isArray(old[key]) ? old[key] : (old[key] ? [old[key]] : []);
    for (const e of list) for (const r of e?.cast?.roles || []) r.reason = `${r.reason}${TAIL}`;
  }
  return old;
}

/** @type {Record<string, any>} */
const born = {};
beforeAll(() => {
  for (const [seed, tier, kind] of PASSED_OVER) {
    born[seed] = generateSettlementPipeline({ settType: tier, stressType: kind }, null, { seed, customContent: {} });
  }
}, 120_000);

describe('FRAME-5 · C1 (1) STORED: the cast stores the candidate\'s own reason, never how it was dealt', () => {
  it('the brunt taken in the first choice\'s place stores its own reason alone (five towns of B7\'s pool)', () => {
    const got = PASSED_OVER.map(([seed, , kind]) => {
      const e = stressOf(born[seed]).find((x) => x.type === kind);
      return [seed, e?.cast?.roles?.find((/** @type {any} */ r) => r.role === 'brunt')?.reason];
    });
    expect(got).toEqual(PASSED_OVER.map(([seed, , , reason]) => [seed, reason]));
  });
  it('GUARD: no stored cast reason, in either home of the container, carries the dealer\'s clause', () => {
    const carrying = [];
    for (const [seed] of PASSED_OVER) {
      for (const key of ['stress', 'stressors']) {
        const list = Array.isArray(born[seed][key]) ? born[seed][key] : (born[seed][key] ? [born[seed][key]] : []);
        for (const e of list) for (const r of e?.cast?.roles || []) if (String(r.reason).includes(CLAUSE)) carrying.push(`${seed} ${key} ${e.type}/${r.role}`);
      }
    }
    expect(carrying).toEqual([]);
  });
});

describe('FRAME-5 · C1 (2) THE RENDER STRIP: a row saved before C1 prints without the dealer\'s tail on every surface', () => {
  it('the one strip cuts the tail and returns every other reason byte for byte', () => {
    expect(typeof castModule.castReasonShown).toBe('function');
    const shown = /** @type {(r: unknown) => string} */ (castModule.castReasonShown);
    expect(shown(`${CAST_REASONS.bruntMember}${TAIL}`)).toBe(CAST_REASONS.bruntMember);
    expect(shown(`her people stand on the walls${TAIL}`)).toBe('her people stand on the walls');
    for (const text of censusOfPrintableReasons()) expect(shown(text)).toBe(text);
  });
  it('a STORED OLD ROW composes byte for byte as the row without the tail: the crisis page, the hooks, the Tonight sheet', () => {
    const failures = collectSeedFailures(PASSED_OVER.map(([seed]) => seed), (seed) => {
      const old = plantOldRows(born[seed]);
      expect(JSON.stringify(old), seed).toContain(CLAUSE); // the plant took
      const printed = JSON.stringify(surfaces(old));
      expect(printed.includes(CLAUSE), `${seed}: a surface printed the dealer's clause`).toBe(false);
      expect(printed, seed).toBe(JSON.stringify(surfaces(born[seed])));
    });
    expectNoSeedFailures(failures, 'a stored old row composes as the row without the dealer\'s tail, on every surface');
  });
});

/**
 * THE CENSUS: every cast-reason string a surface can print. The closed sets of crisisCast.js (`CAST_REASONS` with its
 * brunt bases, the declared siblings), each person's form of a holder's "its" sentence, `CAST_ABSENCES`, and the stake
 * reasons the page prints beside them. The dealer's own entry is the strip's, never printed, and is not in it.
 * @returns {string[]}
 */
function censusOfPrintableReasons() {
  /** @type {string[]} */
  const out = [];
  /** @param {unknown} v */
  const walk = (v) => {
    if (typeof v === 'string') out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(Object.entries(CAST_REASONS).filter(([key]) => key !== 'nextInLine').map(([, v]) => v));
  walk(Object.values(CAST_REASON_SIBLINGS).flat().map((line) => line.text));
  walk(Object.values(CAST_CRISIS_SIBLINGS).flat().map((line) => line.text));
  walk(Object.values(CAST_ABSENCES));
  walk(Object.values(STAKE_REASONS));
  const persons = out.filter((t) => /\bits\b/.test(t)).flatMap((t) => ['her', 'his', 'their'].map((p) => t.replace(/\bits\b/, p)));
  return [...new Set([...out, ...persons])];
}

describe('FRAME-5 · C1 (3) THE CENSUS AND ITS GUARD: no printable cast reason carries a dealer\'s clause', () => {
  it('the census is whole, and not one of its strings carries the clause', () => {
    const census = censusOfPrintableReasons();
    expect(census.length).toBeGreaterThan(100);
    expect(census.filter((t) => t.includes(CLAUSE) || t.includes('next in line'))).toEqual([]);
  });
  it('GUARD: the clause is read in src/ at exactly one site, the strip (no writer composes it onto a stored reason)', () => {
    /** @type {string[]} */
    const sites = [];
    /** @param {string} dir */
    const scan = (dir) => {
      for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) scan(p);
        else if (/\.(?:js|jsx|mjs|ts|tsx)$/.test(ent.name)) {
          fs.readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
            if (/CAST_REASONS\.nextInLine|\bnextInLine\b(?!:)/.test(line) && !/^\s*(?:\*|\/\/)/.test(line)) sites.push(`${path.relative(process.cwd(), p)}:${i + 1}`);
          });
        }
      }
    };
    scan(path.resolve(HERE, '../../../src'));
    expect(sites.map((s) => s.replace(/:\d+$/, ''))).toEqual(['src/domain/crisis/crisisCast.js']);
    const castSrc = fs.readFileSync(path.resolve(HERE, '../../../src/domain/crisis/crisisCast.js'), 'utf8');
    const strip = castSrc.slice(castSrc.indexOf('export function castReasonShown'));
    expect(strip.slice(0, strip.indexOf('\n}\n'))).toContain('CAST_REASONS.nextInLine');
  });
});
