/**
 * rosterChoiceComposedHosts.walker.test.js — THE WALKER R5 WANTS FIRST (the chair's E78 (2), 2026-11-22 12:21 UTC, vetoable
 * by the owner; docs/chair/2026-11-20/veil/briefs/R5-RECENT-BRIEF.md, THE RED FIRST, item 2; written by VEIL-33's V33-R5R).
 *
 * ── THE CLASS ────────────────────────────────────────────────────────────
 * A COMPOSED row of the roster-choice registry (src/domain/veil/rosterChoiceRegistry.js: a row whose `inputs` is non-empty,
 * VR12) is a path built from other rows; its rule is derived from theirs. Where its host is PLANNED in REGISTRY_HOSTS (R5's
 * `public._gallery_veil_composed` / `gallerySecondHomes.js :: withholdComposed`) the rule is BUILT IN NEITHER ENGINE: the
 * composed value is served as the generator wrote it. E78 found one such row serving a withheld power's name on a shared
 * read (`power.recentConflict`, the join probe's act K). The registry walker's ARM C binds every row to a DECLARED host,
 * and ARM D binds a BUILT row's rule to its host's body; neither reds while a composed row sits on a host that does not
 * exist. This walker does.
 *
 * ── THE ARM ──────────────────────────────────────────────────────────────
 * Every composed row names a server host and a twin host, each declared in REGISTRY_HOSTS for its own engine; a row whose
 * server or twin host is PLANNED reds, ONE TEST PER ROW, named by row id, in the registry's order (`power.recentConflict`
 * was walked first, E78; it has LEFT the composed form, below).
 *
 * RED TODAY BY DESIGN: the failing list IS R5's worklist. It stays as a standing test: a row leaves the list when R5
 * builds its host (the host's state 'exists', the registry walker's ARM C then proving it exists) or moves the row to a
 * host that exists. The judgment is proven on synthetic rows first (its own controls), so a green row is not a vacuous one.
 *
 * ── THE ROW THAT LEFT (R5-RECENT; the chair's E92 (1), E93 and E97 (5) of 2026-11-22; V33-R5C6) ─────────────
 * `power.recentConflict` LEFT THE COMPOSED FORM: its inputs are gone and it is withheld ALWAYS on R2's always-host in both
 * engines (212 :: _gallery_veil_withhold_always, galleryWithholdAlways.js :: withholdAlways), the page re-deriving the
 * sentence (pageRederive.js :: rederiveRecentConflict), as `safety.crimeTypes`. It is walked BY NAME below as that row:
 * not composed, withhold / always / page re-derive / built, both hosts existing. A row that left can come back only by a
 * registry edit this arm reds. The census pin on ORDERED[0] is RE-TAKEN (E97 (5)): with the row gone from the composed
 * list, ORDERED[0] is the first composed row in the registry's own order (`history.founding.overcoming`); the pin
 * holds that `power.recentConflict` is NOT among the composed rows, so the walk cannot silently re-admit it. The 26
 * composed rows still on R5's planned host are R5-DESC's worklist (the chair's E97 (5)), red by design.
 */
import { describe, expect, test } from 'vitest';
import { REGISTRY_HOSTS, REGISTRY_ROWS } from '../../src/domain/veil/rosterChoiceRegistry.js';

/** E78 (2): R5's worklist started at this row; E92 (1), E93, E97 (5): it LEFT the composed form, and is walked by name. */
const LEFT = 'power.recentConflict';
/** E97 (5), the census pin re-taken: the first composed row in the registry's own order once LEFT is gone from the list. */
const FIRST = 'history.founding.overcoming';

/** A composed row (VR12): its `inputs` non-empty. */
const isComposed = (r) => Array.isArray(r.inputs) && r.inputs.length > 0;

/**
 * The faults of one composed row against a host table: a missing host, a host not declared for its own engine, a host
 * declared PLANNED. Each fault names the row id.
 * @param {{ id: string, server: string, twin: string }} r
 * @param {Readonly<Record<string, { engine: string, state: string, stage: string }>>} hosts
 * @returns {string[]}
 */
function hostFaultsOf(r, hosts) {
  const out = [];
  for (const [field, engine] of [['server', 'server'], ['twin', 'twin']]) {
    const sym = r[field];
    if (typeof sym !== 'string' || sym === '') { out.push(`${r.id}: no ${field} host`); continue; }
    const h = Object.prototype.hasOwnProperty.call(hosts, sym) ? hosts[sym] : null;
    if (!h || h.engine !== engine) { out.push(`${r.id}: ${field} ${sym} is not a declared ${engine} host`); continue; }
    if (h.state !== 'exists') out.push(`${r.id}: ${field} host ${sym} is ${String(h.state).toUpperCase()} (${h.stage}): its rule is built in neither engine`);
  }
  return out;
}

const COMPOSED = REGISTRY_ROWS.filter(isComposed);
const ORDERED = [...COMPOSED];

describe('the judgment proves itself on synthetic rows (its own controls)', () => {
  const HOSTS = Object.freeze({
    's.exists': { engine: 'server', state: 'exists', stage: 'S' },
    't.exists': { engine: 'twin', state: 'exists', stage: 'S' },
    's.planned': { engine: 'server', state: 'planned', stage: 'R9' },
    't.planned': { engine: 'twin', state: 'planned', stage: 'R9' },
  });

  test('a composed row on two existing hosts has no fault; one on a PLANNED server or twin host reds, named by its id', () => {
    // anchored: the same judgment that names three faults below names none here, so an empty list is the judgment's own
    expect(hostFaultsOf({ id: 'x.ok', server: 's.exists', twin: 't.exists' }, HOSTS)).toEqual([]);
    expect(hostFaultsOf({ id: 'x.s', server: 's.planned', twin: 't.exists' }, HOSTS)).toEqual(['x.s: server host s.planned is PLANNED (R9): its rule is built in neither engine']);
    expect(hostFaultsOf({ id: 'x.t', server: 's.exists', twin: 't.planned' }, HOSTS)).toEqual(['x.t: twin host t.planned is PLANNED (R9): its rule is built in neither engine']);
    expect(hostFaultsOf({ id: 'x.st', server: 's.planned', twin: 't.planned' }, HOSTS)).toHaveLength(2);
  });

  test('a composed row with no host, an undeclared host, or a host of the other engine reds, named by its id', () => {
    expect(hostFaultsOf({ id: 'x.none', server: '', twin: 't.exists' }, HOSTS)).toEqual(['x.none: no server host']);
    expect(hostFaultsOf({ id: 'x.undeclared', server: 's.exists', twin: 't.nowhere' }, HOSTS)).toEqual(['x.undeclared: twin t.nowhere is not a declared twin host']);
    expect(hostFaultsOf({ id: 'x.crossed', server: 't.exists', twin: 's.exists' }, HOSTS)).toEqual(['x.crossed: server t.exists is not a declared server host', 'x.crossed: twin s.exists is not a declared twin host']);
  });

  test('a row with no inputs is not composed; one with inputs is', () => {
    expect(isComposed({ inputs: [] })).toBe(false);
    expect(isComposed({ inputs: ['power.entry'] })).toBe(true);
  });

  test('the census is not vacuous: the registry holds composed rows, walked in its own order from the first; power.recentConflict is not among them (E97 (5): the pin re-taken, the row having left the composed form)', () => {
    expect(COMPOSED.length).toBeGreaterThanOrEqual(10);
    expect(ORDERED[0]?.id).toBe(FIRST);
    expect(ORDERED.map((r) => r.id)).not.toContain(LEFT);
    expect(ORDERED.map((r) => r.id).sort()).toEqual(COMPOSED.map((r) => r.id).sort());
    expect(Object.keys(REGISTRY_HOSTS).length).toBeGreaterThan(0);
  });
});

describe('THE ROW THAT LEFT THE COMPOSED FORM, walked by name (R5-RECENT: E92 (1), E93, E97 (5))', () => {
  test(`${LEFT}: not composed; withheld ALWAYS, the page re-deriving it, built on R2's always-host in both engines (hosts that exist)`, () => {
    const r = REGISTRY_ROWS.find((x) => x.id === LEFT);
    expect(r, `the registry holds ${LEFT}`).toBeTruthy();
    if (!r) return;
    expect(isComposed(r), `${LEFT} has left the composed form (no inputs)`).toBe(false);
    expect({ rule: r.rule, when: r.when, page: r.page, built: r.built }).toEqual({ rule: 'withhold', when: 'always', page: 're-derive', built: true });
    expect({ server: r.server, twin: r.twin }).toEqual({ server: 'public._gallery_veil_withhold_always', twin: 'src/domain/display/galleryWithholdAlways.js :: withholdAlways' });
    // anchored: the same judgment names faults on the synthetic planned rows above, so an empty list is a judgment
    expect(hostFaultsOf(r, REGISTRY_HOSTS)).toEqual([]);
  });
});

describe('every COMPOSED row of the registry names a host that exists in both engines (E78 (2): RED today by design, R5\'s worklist)', () => {
  for (const r of ORDERED) {
    test(`${r.id}: its server and twin hosts are declared and exist (not PLANNED)`, () => {
      // anchored: hostFaultsOf names three faults on the synthetic planned rows above, so an empty list here is a judgment
      expect(hostFaultsOf(r, REGISTRY_HOSTS)).toEqual([]);
    });
  }
});
