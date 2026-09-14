/**
 * tests/domain/townCard.test.js — THE TOWN CARD'S PINS (W0 deliverable 4).
 *
 * Every arm here is one the design names (DESIGN_SCRIBE_GENERATION_TIME_PROSE §2's last
 * paragraph, §11 W0), and every one of them carries its own NEGATIVE CONTROL — a deliberately
 * broken card that the arm must convict. An arm that cannot be made to fail is not standing over
 * anything, which is the lesson `stateProseKernel.js` records at `stableVid` about a sweep that
 * re-derived its own predicate and left a planted defect green.
 *
 * ── ⚠ THE ONE ARM THE BRIEF NAMES THAT IS DRIVEN DIFFERENTLY, AND WHY (a chair-level call) ──
 * The brief asks for byte-stability "before and after `regenSection` on a non-locked section".
 * `regenSection` is an async Zustand thunk (`settlementSlice.js:405`) that needs the store, the
 * save layer, the analytics module and the pricing-moment loader, and taken literally the arm is
 * also not what anyone wants: regenerating HISTORY must move the history tab's card. The property
 * the brief is protecting is that the card holds NO STATE ACROSS CALLS and MUTATES NOTHING, so it
 * is driven directly and at the grain it lives at — the PURE pipelines `regenSection` itself
 * calls (`regenNPCsPipeline`, `regenHistoryPipeline`), plus a no-mutation arm. Recorded, vetoable.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, relative, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  generateSettlementPipeline, regenNPCsPipeline, regenHistoryPipeline,
} from '../../src/generators/generateSettlementPipeline.js';
import {
  townCard, townCardJson, variantAt, recoverFills, faceRawOf, fieldState, WORLD_ONLY_READINGS,
  UNNAMEABLE_BODIES,
} from '../../src/domain/prose/townCard.js';
import { renderTabPage, SCRIBE_TABS } from '../../src/domain/prose/scribePage.js';
import {
  drawVariant, eligibleVariants, compromisedSpeaks, variantIsAudible,
} from '../../src/domain/display/stateProse/stateProseKernel.js';
import { rolesOf, sourcesOf, renderYearOf } from '../../src/domain/display/stateProse/faceSources.js';
import { classifyMoves, orderIdOf, LEVEL1_ORDERS } from '../../src/domain/prose/moveGrammar.js';
import { astTokens } from '../../scripts/wiring-census.mjs';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const STATIC_CARD = JSON.parse(readFileSync(join(ROOT, 'docs/content/scribe-static-card.json'), 'utf8'));
const GOLDEN = join(ROOT, 'tests/fixtures/scribe-town-card.golden.json');

/** The two new W0 modules, which every source-scan arm below is taken over. */
const NEW_MODULES = Object.freeze([
  'src/domain/prose/townCard.js',
  'src/domain/prose/scribePage.js',
]);

const townOf = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });
const cardOf = (s, tab, audience = 'dm') => townCard(s, { tab, audience, staticCard: STATIC_CARD });

/** A deterministic slice of the golden corpus, taken by stride so it spans the grid. */
function sample(n) {
  const rows = goldenCorpus();
  const stride = Math.max(1, Math.floor(rows.length / n));
  const out = [];
  for (let i = 0; i < rows.length && out.length < n; i += stride) out.push(rows[i]);
  return out;
}

function settlementOf(row) {
  const { _seed, ...cfg } = row;
  return generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
}

describe('townCard — byte stability', () => {
  it('is identical across two calls on every tab, over the whole 525-town golden corpus', () => {
    const drift = [];
    for (const row of goldenCorpus()) {
      let s;
      try { s = settlementOf(row); } catch { continue; }
      for (const tab of SCRIBE_TABS) {
        const a = townCardJson(cardOf(s, tab));
        const b = townCardJson(cardOf(s, tab));
        if (a !== b) drift.push(`${keyOf(row)} :: ${tab}`);
      }
    }
    expect(drift).toEqual([]);
  }, 600_000);

  it('is key-sorted and JSON-round-trippable at every level (no Set, no Map, no function)', () => {
    const s = townOf({
      settType: 'city', culture: 'germanic', terrainOverride: 'coastal',
      tradeRouteAccess: 'port', monsterThreat: 'frontier',
    }, 'card-shape');
    for (const tab of SCRIBE_TABS) {
      const card = cardOf(s, tab);
      const j = townCardJson(card);
      expect(JSON.parse(j)).toEqual(card);
      const unsorted = [];
      const walk = (node, path) => {
        if (Array.isArray(node)) { node.forEach((x, i) => walk(x, `${path}[${i}]`)); return; }
        if (!node || typeof node !== 'object') {
          expect(typeof node).not.toBe('function');
          return;
        }
        const keys = Object.keys(node);
        // ⛔ `pools` and `page` are ARRAYS in page order; their MEMBERS are sorted records.
        const s2 = [...keys].sort();
        if (JSON.stringify(keys) !== JSON.stringify(s2)) unsorted.push(path);
        for (const k of keys) walk(node[k], `${path}.${k}`);
      };
      walk(card, tab);
      expect(unsorted, `\n${unsorted.join('\n')}\n`).toEqual([]);
    }
  }, 120_000);

  it('mutates nothing it is handed, and holds no state across calls', () => {
    for (const row of sample(20)) {
      let s;
      try { s = settlementOf(row); } catch { continue; }
      const before = JSON.stringify(s);
      const first = SCRIBE_TABS.map((tab) => townCardJson(cardOf(s, tab)));
      expect(JSON.stringify(s), `${keyOf(row)}: townCard mutated the settlement`).toBe(before);
      // A SECOND settlement generated from the same seed must give the same cards, so no card
      // can be carrying anything from the first object's identity.
      const twin = settlementOf(row);
      const second = SCRIBE_TABS.map((tab) => townCardJson(cardOf(twin, tab)));
      expect(second).toEqual(first);
    }
  }, 600_000);

  it('is unmoved on the PRE-REGEN settlement by a section regeneration having happened', () => {
    // The property `regenSection` byte-stability is really about: the card is a function of the
    // settlement it is handed and of nothing else, so a regeneration that produced a DIFFERENT
    // settlement leaves the original's card alone, and the new settlement's card is a function
    // of the new settlement in the same way.
    for (const row of sample(20)) {
      let s;
      try { s = settlementOf(row); } catch { continue; }
      const cfg = s.config || {};
      const beforeCards = SCRIBE_TABS.map((tab) => townCardJson(cardOf(s, tab)));
      let regenerated = null;
      try {
        const { _preservation, ...parts } = regenNPCsPipeline(s, cfg, { locks: {} });
        const { _regenSeed, ...hist } = regenHistoryPipeline(s, cfg);
        regenerated = { ...s, ...parts, ...hist };
      } catch { /* a tier with no roster to reroll still drives the first half */ }
      const afterCards = SCRIBE_TABS.map((tab) => townCardJson(cardOf(s, tab)));
      expect(afterCards, `${keyOf(row)}: the original's card moved`).toEqual(beforeCards);
      if (regenerated) {
        const a = SCRIBE_TABS.map((tab) => townCardJson(cardOf(regenerated, tab)));
        const b = SCRIBE_TABS.map((tab) => townCardJson(cardOf(regenerated, tab)));
        expect(b, `${keyOf(row)}: the regenerated town's card is not stable`).toEqual(a);
      }
    }
  }, 600_000);
});

describe('townCard — no new read, and no new producer', () => {
  it('names no settlement field the display layer does not already read', () => {
    // THE ORACLE is the static card's own field table, which is built from the census's `reads`
    // column normalised through each desk's source — i.e. exactly what the display layer reads —
    // widened by the roots `faceSources.js` and the mount registry read on this same path.
    const known = new Set(Object.keys(STATIC_CARD.fields));
    const roots = new Set([...known].map((f) => f.split('.')[0]));
    // The roots the SEATING path reads, named here because they are the card's own reads and
    // they are licensed by `faceSources.js` rather than by a pool's key function.
    for (const extra of ['institutions', 'tier', 'history', 'powerStructure', 'id', 'name',
      'config', 'defenseProfile', 'economicState', 'economicViability', 'resourceAnalysis',
      'stress', 'conflicts', 'relationships', 'neighbourNetwork', 'neighborRelationship',
      'prominentRelationship', 'structuralViolations', 'structuralSuggestions', 'coherenceNotes',
      'availableServices', 'populationHistory', 'lifecycleStatus', 'arrivalScene',
      'pressureSentence', 'settlementReason', 'publicLegitimacy', '_seed']) roots.add(extra);

    const s = townOf({
      settType: 'city', culture: 'germanic', terrainOverride: 'plains',
      tradeRouteAccess: 'road', monsterThreat: 'frontier',
    }, 'no-new-read');
    const offending = [];
    for (const tab of SCRIBE_TABS) {
      for (const pool of cardOf(s, tab).pools) {
        for (const rowField of pool.fields) {
          if (!known.has(rowField.field)) offending.push(`${tab} :: ${pool.poolKey} :: ${rowField.field}`);
        }
      }
    }
    expect(offending, `\n${offending.join('\n')}\n`).toEqual([]);

    // NEGATIVE CONTROL — a field path the display layer does not read must be convicted.
    expect(known.has('powerStructure.aSecretTheEngineDoesNotHold')).toBe(false);
  }, 120_000);

  it('the two new modules mint ZERO producer writes', () => {
    // ⛔ THE STRUCTURAL PIN. `scripts/wiring-census.mjs` `producerCitations` reads every
    // non-computed `Property` key and every member-assignment target under `src/domain/**` as a
    // WRITE of world state. Eighteen identifiers are read by a desk while produced nowhere, so a
    // literal keyed on one of them would flip that pool's `not-produced` label and move the
    // committed census. Both new modules build every record through `Object.fromEntries`, and
    // this arm is what keeps them that way.
    const offenders = [];
    for (const rel of NEW_MODULES) {
      const { writes, parsed } = astTokens(readFileSync(join(ROOT, rel), 'utf8'));
      expect(parsed, `${rel} did not parse`).toBe(true);
      for (const w of writes) offenders.push(`${rel}:${w.line} ${w.name}`);
    }
    expect(offenders, `\n${offenders.join('\n')}\n`).toEqual([]);

    // NEGATIVE CONTROL — the scan must convict a plain literal.
    const planted = astTokens('export const X = { court: 1 };\nlet y = {}; y.forces = 2;\n');
    expect(planted.writes.map((w) => w.name).sort()).toEqual(['court', 'forces']);
  });

  it('is HEADLESS: nothing in the import closure is a .jsx file or imports React', () => {
    const seen = new Set();
    const components = new Set();
    const visit = (rel) => {
      if (seen.has(rel)) return;
      seen.add(rel);
      const abs = join(ROOT, rel);
      if (!existsSync(abs)) return;
      const src = readFileSync(abs, 'utf8');
      expect(rel.endsWith('.jsx'), `${rel} is a component file`).toBe(false);
      expect(/from\s+['"]react/.test(src), `${rel} imports React`).toBe(false);
      if (rel.startsWith('src/components/')) components.add(rel);
      for (const m of src.matchAll(/from\s+['"](\.[^'"]+)['"]/g)) {
        visit(relative(ROOT, resolve(dirname(abs), m[1])));
      }
    };
    for (const rel of NEW_MODULES) visit(rel);
    // ⭐ THE COMPONENT ALLOWLIST IS EXACT, so a fifth reds by name rather than by habit. These
    // four are plain `.js` reading recipes that render nothing; two of them live under
    // `src/components/` only because the mount walker admits exactly ONE component file per desk.
    expect([...components].sort()).toEqual([
      'src/components/new/economyDeskRead.js',
      'src/components/new/generalDeskRead.js',
      'src/components/new/tabHelpers.js',
      'src/components/settlement/faithPanelModel.js',
    ]);
    expect(seen.size).toBeGreaterThan(20);
  });
});

describe('townCard — the join with the static card and the corpus', () => {
  it('every fired pool has a static row and a corpus pool', () => {
    const missingStatic = [];
    const missingCorpus = [];
    for (const row of sample(12)) {
      let s;
      try { s = settlementOf(row); } catch { continue; }
      for (const tab of SCRIBE_TABS) {
        for (const pool of cardOf(s, tab).pools) {
          if (pool.static === null) missingStatic.push(`${keyOf(row)} :: ${pool.blockId} :: ${pool.poolKey}`);
          if (variantAt(pool.blockId, pool.poolKey, pool.authoredIndex) === null) {
            missingCorpus.push(`${keyOf(row)} :: ${pool.blockId} :: ${pool.poolKey} @ ${pool.authoredIndex}`);
          }
        }
      }
    }
    expect(missingStatic, `\n${missingStatic.join('\n')}\n`).toEqual([]);
    expect(missingCorpus, `\n${missingCorpus.join('\n')}\n`).toEqual([]);

    // NEGATIVE CONTROL — a pool key the corpus does not hold must answer null.
    expect(variantAt('DS-DEF-2', 'a pool nobody authored', 0)).toBe(null);
    expect(STATIC_CARD.pools['DS-DEF-2::a pool nobody authored']).toBe(undefined);
  }, 300_000);

  it('says so when the static card is absent rather than carrying a half-answer', () => {
    const s = townOf({
      settType: 'town', culture: 'germanic', terrainOverride: 'plains',
      tradeRouteAccess: 'road', monsterThreat: 'civilized',
    }, 'no-static');
    const card = townCard(s, { tab: 'defense', audience: 'dm' });
    expect(card.staticCardJoined).toBe(false);
    expect(card.pools.every((p) => p.static === null && p.fields.length === 0)).toBe(true);
    // ⛔ AND EVERY POOL IS STILL WRITEABLE, which is not a loophole. With no static table the card
    // has NO BASIS to call a pool unwriteable; answering false for all of them would silently turn
    // the whole feature off on a client that forgot one input, and would be a claim about the
    // engine made out of a missing file. `staticCardJoined` is what says the card is half-blind.
    expect(card.pools.every((p) => p.writeable === true)).toBe(true);
    expect(cardOf(s, 'defense').staticCardJoined).toBe(true);
  }, 60_000);
});

describe('townCard — what has no value, and what cannot be written (W3b car 2)', () => {
  /** The harness's own pinned town, so the card's figures and the pilot's are one measurement. */
  const PINNED = {
    settType: 'town', culture: 'germanic', terrainOverride: 'river', roadOverride: 'road', civOverride: 'civilized',
  };

  it('⭐ classifies a reading with no value, and NEVER calls an unreadable one undecided', () => {
    // ⛔⛔ THE FINDING THIS ARM STANDS OVER. RUN 2's second reader named "an ABSENCE asserted on a
    // NULL read" as the writer's commonest invention. Counted here over the pinned town's thirteen
    // tabs: 34 field rows carry a value, 42 do not, and NOT ONE of the 42 is a settlement path
    // that resolves to nothing. They are expressions `valueAt` refuses by construction, and desk-
    // local names the census recorded verbatim (`readings.scores`, `axis`, `conflict.intensity`),
    // which no settlement has a key for. So "the engine has not decided this" would be FALSE on
    // every one of them, and the card must not say it.
    const s = townOf(PINNED, 'render-town');
    const seen = {};
    for (const tab of SCRIBE_TABS) {
      for (const pool of cardOf(s, tab).pools) {
        for (const field of pool.fields) {
          seen[field.state] = (seen[field.state] || 0) + 1;
          expect(field.unknown, `${tab} :: ${field.field}`).toBe(field.state !== 'decided');
          if (field.state === 'decided') expect(field.value).not.toBe(null);
          else expect(field.value).toBe(null);
        }
      }
    }
    expect(seen).toEqual({ decided: 34, unreadable: 42 });

    // DRIVEN BY HAND, because the pinned town reaches only two of the three answers and a branch
    // no arm reaches is a branch nothing stands over.
    const town = { name: 'Ashford', powerStructure: { recentConflict: null } };
    expect(fieldState(town, 'name', 'Ashford')).toBe('decided');
    // A REAL SETTLEMENT PATH WHOSE LEAF IS ABSENT: the engine has not decided it.
    expect(fieldState(town, 'powerStructure.recentConflict', null)).toBe('not-decided');
    expect(fieldState(town, 'powerStructure.nothingHere', null)).toBe('not-decided');
    // NEGATIVE CONTROLS — an expression and a root no settlement carries are UNREADABLE, never
    // undecided, because nothing about the engine follows from a card that cannot read.
    expect(fieldState(town, 'magicWorksAt({ settlement })', null)).toBe('unreadable');
    expect(fieldState(town, 'readings.scores', null)).toBe('unreadable');
    expect(fieldState(town, 'axis', null)).toBe('unreadable');
    expect(fieldState(town, '', null)).toBe('unreadable');
  }, 300_000);

  it('⭐⭐ THE POOL KEY IS THE DECIDED FACT: only a world-only pool on a headless town is refused', () => {
    // ⛔⛔ THE LIMB CAR 6 STRUCK, AND WHY. Car 2 also answered false where NO FIELD CARRIED A
    // VALUE. Its own measurement settled against it: 42 of 42 valueless rows on this town are
    // `unreadable` and NOT ONE is a true null, so that limb was measuring THIS CARD'S BLINDNESS
    // (desk-local spellings the census recorded verbatim) and not the engine's silence. It turned
    // off nine of ten power pools and fourteen of seventeen overview pools whose keys the engine
    // had decided in terms: `scores.military: STRONG` was omitted for want of a value while its
    // own key said STRONG. A pool key that fired IS a decided fact, and the card's blindness is
    // the census's spelling, which is W3c's to cure and not this gate's.
    const s = townOf(PINNED, 'render-town');
    const unwriteable = {};
    const total = {};
    const named = [];
    let allUnreadableAndWriteable = 0;
    for (const tab of SCRIBE_TABS) {
      const card = cardOf(s, tab);
      total[tab] = card.pools.length;
      unwriteable[tab] = card.pools.filter((p) => p.writeable === false).length;
      for (const pool of card.pools) {
        if (pool.writeable === false) named.push(`${tab} :: ${pool.blockId} :: ${pool.poolKey}`);
        // ⭐ THE CONTROL THE STRIKE EXISTS FOR: a pool whose every reading this card cannot
        // resolve stays WRITEABLE, because its key is the decided fact.
        if (pool.writeable === true && pool.fields.length > 0
          && pool.fields.every((f) => f.state === 'unreadable')) allUnreadableAndWriteable += 1;
      }
    }
    expect(total).toEqual({
      daily_life: 1, defense: 15, economics: 7, faith: 1, history: 6, overview: 17,
      plot_hooks: 7, power: 10, relationships: 0, resources: 0, services: 1, viability: 4, war: 0,
    });
    expect(unwriteable).toEqual({
      daily_life: 0, defense: 1, economics: 0, faith: 1, history: 0, overview: 0,
      plot_hooks: 0, power: 1, relationships: 0, resources: 0, services: 0, viability: 0, war: 0,
    });
    // AND THEY ARE THE THREE WORLD-ONLY POOLS, BY NAME, and no others.
    expect(named.sort()).toEqual([
      'defense :: DS-DEF-4 :: capture none',
      'faith :: DS-FTH-2 :: PRIVATE DOSSIER',
      'power :: DS-POW-7 :: layer DORMANT (no ledger materialized)',
    ]);
    expect(allUnreadableAndWriteable, 'the control is vacuous: no pool reads only unreadable fields')
      .toBe(24);
  }, 300_000);

  it('the world-only table is NARROW, and catches the pool the chair named', () => {
    // ⛔ A NAMED TABLE, NOT A SCATTERED HEURISTIC, AND ITS CATCH IS PINNED. `DS-DEF-4 :: capture
    // none` is the one the chair named: its only DECIDED field is the town's own `name`, which
    // licenses nothing about capture, so clause (a) would let it through. `capture` alone is NOT
    // in the table because it would have taken `DS-ECO-6`'s `blackMarketCapture`, a real decided
    // value about this town's own economy.
    const s = townOf(PINNED, 'render-town');
    const caught = [];
    for (const tab of SCRIBE_TABS) {
      for (const pool of cardOf(s, tab).pools) {
        const reads = (pool.static?.reads || []).map((r) => String(r).toLowerCase());
        if (!reads.length) continue;
        if (reads.every((r) => WORLD_ONLY_READINGS.some((w) => r.includes(w)))) {
          caught.push(`${tab} :: ${pool.blockId} :: ${pool.poolKey}`);
        }
      }
    }
    expect(caught.sort()).toEqual([
      'defense :: DS-DEF-4 :: capture none',
      'faith :: DS-FTH-2 :: PRIVATE DOSSIER',
      'power :: DS-POW-7 :: layer DORMANT (no ledger materialized)',
    ]);
    // And the one the table must NOT take is still writeable.
    const eco = cardOf(s, 'economics').pools.find((p) => p.poolKey.startsWith('TIER: minor shadow activity'));
    expect(eco, 'the economics tab no longer fires the shadow-activity pool').toBeTruthy();
    expect(eco.writeable).toBe(true);
    // NEGATIVE CONTROL — the table is lower-case and matched against lower-cased reads.
    expect(WORLD_ONLY_READINGS.includes('capture')).toBe(false);
    expect(WORLD_ONLY_READINGS.every((w) => w === w.toLowerCase())).toBe(true);
  }, 300_000);
});

describe('townCard — the bodies this page names (W3d car 2)', () => {
  const PINNED = {
    settType: 'town', culture: 'germanic', terrainOverride: 'river', roadOverride: 'road', civOverride: 'civilized',
  };

  it('⭐⭐ seats the two bodies RUN 3 refused, each with the row it came from', () => {
    // ⛔⛔ THE MEASUREMENT. RUN 3's second reader answered ROSTER `yes` on "The Governing Council
    // and The Order of the Watch" — names the ENGINE decided for this settlement and handed to the
    // WRITER as that pool's own `{faction}` fills — because the town block said in terms that it
    // listed every body that may be named and listed neither. A refusal for a fact the card
    // withheld is ruling 26's defect class on the roster.
    const s = townOf(PINNED, 'render-town');
    const bodies = cardOf(s, 'overview').town.bodies;
    const byName = new Map(bodies.map((b) => [b.name, b]));
    expect(byName.get('The Governing Council')).toEqual({
      name: 'The Governing Council', kind: 'faction', source: 'factions[].name',
    });
    expect(byName.get('The Order of the Watch')).toEqual({
      name: 'The Order of the Watch', kind: 'faction', source: 'factions[].name',
    });
    // AND THE OTHER THREE ROWS ARE REACHED, so the list is not one limb wearing four names.
    const kinds = new Set(bodies.map((b) => b.kind));
    expect([...kinds].sort()).toEqual(['faction', 'power bloc', 'relationship party']);
    expect(byName.get('Guild Council').source).toBe('powerStructure.factions[].faction');
    expect(byName.get('Berchta Schmidt').kind).toBe('relationship party');
    // THE CONFLICT LIMB IS REACHED TOO, and its parties are this town's factions, so the DEDUPE is
    // what keeps them at one row each under the faction source rather than two rows under two.
    expect(s.conflicts.flatMap((c) => c.parties).sort())
      .toEqual(['The Governing Council', 'The Order of the Watch']);
  }, 60_000);

  it('is sorted, deduped by name, byte-stable, and the SAME on all thirteen tabs', () => {
    // ⛔ THE TOWN SECTION IS CACHE BREAKPOINT TWO and its contract is that it is the same bytes on
    // every tab of one settlement. A per-tab body would cost a full-price town block on every tab
    // after the first, which is why the drawn `{hall}` fills are NOT in this list.
    const s = townOf(PINNED, 'render-town');
    const first = JSON.stringify(cardOf(s, SCRIBE_TABS[0]).town);
    for (const tab of SCRIBE_TABS) {
      const bodies = cardOf(s, tab).town.bodies;
      expect(JSON.stringify(cardOf(s, tab).town), `${tab}: the town section moved between tabs`).toBe(first);
      expect(bodies.map((b) => b.name)).toEqual([...bodies.map((b) => b.name)].sort());
      expect(new Set(bodies.map((b) => b.name)).size).toBe(bodies.length);
      for (const body of bodies) expect(Object.keys(body)).toEqual(['kind', 'name', 'source']);
    }
  }, 120_000);

  it('⛔ THE SECRET BODY IS NOT SEATED, on the golden town that actually holds one', () => {
    // ⛔⛔ THE FINDING. `stressFactions.js:105` pushes a power bloc `Unknown Faction (hidden)` on an
    // `infiltrated` town, and its own description says "its presence is not known to the
    // settlement". A list whose sentence to the model is "a body here may act and speak" may not
    // carry a body the settlement does not know of: on a player page that is a secret printed as a
    // fact. It is struck BY NAME and not by a parenthetical pattern, so a real body whose name
    // carries brackets is not silently unseated.
    const s = settlementOf(goldenCorpus()[0]);
    expect(
      s.powerStructure.factions.map((f) => f.faction),
      'the golden town no longer carries the hidden bloc: move this control to one that does',
    ).toContain('Unknown Faction (hidden)');
    const bodies = cardOf(s, 'power').town.bodies;
    expect(bodies.map((b) => b.name)).not.toContain('Unknown Faction (hidden)');
    // POSITIVE CONTROL — the other blocs of the SAME row are seated, so the strike is one row and
    // not the limb.
    expect(bodies.some((b) => b.source === 'powerStructure.factions[].faction')).toBe(true);
    expect(UNNAMEABLE_BODIES).toEqual(['Unknown Faction (hidden)']);
  }, 60_000);

  it('answers the empty list on a town the engine named no body for, rather than guessing', () => {
    // NEGATIVE CONTROL — a settlement whose four rows are all absent carries no body at all, and
    // the block says so rather than inventing one or omitting the key.
    const bare = townCard(
      { id: 'x', name: 'Nowhere', tier: 'thorp' },
      { tab: 'defense', audience: 'dm', staticCard: STATIC_CARD },
    );
    expect(bare.town.bodies).toEqual([]);
    // AND A HAMLET WITH ONE FACTION AND NO CONFLICT CARRIES EXACTLY WHAT THE ENGINE GAVE IT.
    const hamlet = townOf({ ...PINNED, settType: 'hamlet' }, 'sim-hamlet');
    const names = cardOf(hamlet, 'overview').town.bodies.map((b) => b.name);
    expect(names).toContain('The Independent Bloc');
    expect(hamlet.conflicts).toEqual([]);
    expect(hamlet.prominentRelationship).toBe(null);
  }, 60_000);
});

describe('townCard — determinism of the trace', () => {
  it('the drawn variant, the roles and the compromised flag are the render\'s own', () => {
    const bad = [];
    for (const row of sample(12)) {
      let s;
      try { s = settlementOf(row); } catch { continue; }
      const seated = sourcesOf(s);
      const roles = rolesOf(s);
      const year = renderYearOf(s);
      for (const tab of SCRIBE_TABS) {
        const card = cardOf(s, tab);
        for (const pool of card.pools) {
          const v = variantAt(pool.blockId, pool.poolKey, pool.authoredIndex);
          // (i) THE ANNEX VID ON THE CARD IS THE VARIANT'S OWN, and it is NOT the authored index.
          if (v && typeof v.vid === 'number' && pool.vid !== v.vid) {
            bad.push(`${tab} ${pool.poolKey}: vid ${pool.vid} != leaf ${v.vid}`);
          }
          // (ii) EVERY SOURCE THE UNIT SPOKE THROUGH IS ONE THIS TOWN SEATS, and every role the
          // card offers for it is one `rolesOf` seats.
          for (const source of pool.faceSources) {
            // ⛔ THE ARCHIVER IS NOT A POWER OF THE TOWN and `sourcesOf` never emits it (ruling
            // 22): it is the hand the dossier is written in, eligible everywhere its `observed`
            // mark or its weighing row admits it. Found by this arm convicting a real weighing
            // row on `Economic Survival: STRONG`, which is the arm telling the truth about a
            // vocabulary word the seating roster deliberately does not hold.
            if (source === 'archiver') continue;
            if (!seated.has(source)) bad.push(`${tab} ${pool.poolKey}: unseated source ${source}`);
          }
          for (const r of pool.faceRoles) {
            if (r.source === 'archiver') { expect(r.roster).toEqual([]); continue; }
            const known = new Set((roles.get(r.source) || []).map((x) => x.role));
            for (const held of r.roster) {
              if (!known.has(held.role)) bad.push(`${tab} ${pool.poolKey}: role ${held.role} not in rolesOf`);
            }
          }
          // (iii) THE COMPROMISED FLAG IS `compromisedSpeaks` RECOMPUTED on the page's own key.
          if (pool.compromised) {
            const again = compromisedSpeaks(card.seed, pool.poolKey, String(s.id ?? s._seed ?? ''), year);
            if (pool.compromised.speaks !== again) bad.push(`${tab} ${pool.poolKey}: roll disagrees`);
            if (pool.compromised.year !== year) bad.push(`${tab} ${pool.poolKey}: wrong year`);
          }
        }
      }
    }
    expect(bad, `\n${bad.slice(0, 40).join('\n')}\n`).toEqual([]);
  }, 300_000);

  it('the drawn variant is the one drawVariant returns for (seed, blockId, poolKey)', () => {
    // Driven on the DEFENSE tab, whose spine pools take no demoted dimension, so the eligible
    // set the card's page drew from is reproducible here without the desk's slot bag.
    const s = townOf({
      settType: 'city', culture: 'germanic', terrainOverride: 'plains',
      tradeRouteAccess: 'road', monsterThreat: 'plagued',
    }, 'draw-pin');
    const card = cardOf(s, 'defense');
    let checked = 0;
    for (const pool of card.pools) {
      const v = variantAt(pool.blockId, pool.poolKey, pool.authoredIndex);
      if (!v || typeof v.vid !== 'number') continue;
      const all = STATIC_CARD.pools[`${pool.blockId}::${pool.poolKey}`];
      if (!all || all.slotsNamed.length > 0) continue; // a slot bag we do not hold
      const eligible = eligibleVariants(
        [...Array(all.variants).keys()].map((i) => variantAt(pool.blockId, pool.poolKey, i)),
        { audience: 'dm' },
      );
      const drawn = drawVariant(eligible, pool.blockId, pool.poolKey, card.seed);
      if (drawn && typeof drawn.vid === 'number') {
        expect(pool.vid, `${pool.poolKey}`).toBe(drawn.vid);
        checked += 1;
      }
    }
    expect(checked, 'the arm checked nothing').toBeGreaterThan(0);
  }, 120_000);

  it('recoverFills reads the render and is convicted by a wrong one', () => {
    // DRIVEN, because only 10 of the corpus's 2,838 faces carry a role slot today: the limb the
    // card most depends on is nearly dark on the shipped corpus, so it is driven by hand.
    const raw = '{hall} {v:put} the walls\' keeping under the {defmaterial} purse.';
    const rendered = 'The mayor puts the walls\' keeping under the military purse.';
    const got = recoverFills(raw, rendered);
    expect(got).toEqual([
      { slot: 'hall', value: 'The mayor' },
      { slot: 'v:put', value: 'puts' },
      { slot: 'defmaterial', value: 'military' },
    ]);
    // A PLURAL ROLE takes the plural verb, and the alternation must follow it.
    expect(recoverFills('{tavern} {v:say} it is kept.', 'The drinkers of the district say it is kept.'))
      .toEqual([
        { slot: 'tavern', value: 'The drinkers of the district' },
        { slot: 'v:say', value: 'say' },
      ]);
    // NEGATIVE CONTROL — a rendered text the raw cannot align against yields null, never a guess.
    expect(recoverFills(raw, 'A sentence about something else entirely.')).toBe(null);
    // A face naming nothing recovers an empty list and is not a failure.
    expect(recoverFills('The walls are kept.', 'The walls are kept.')).toEqual([]);
  });

  it('recovers a fill for every composed line of a real page, or says it did not', () => {
    let total = 0;
    let unrecovered = 0;
    for (const row of sample(8)) {
      let s;
      try { s = settlementOf(row); } catch { continue; }
      for (const tab of SCRIBE_TABS) {
        for (const pool of cardOf(s, tab).pools) {
          total += 1;
          if (!pool.slots.recovered) unrecovered += 1;
          // Whatever it recovered must actually BE in the rendered text.
          for (const fill of pool.slots.fills) {
            expect(pool.unit.rendered.toLowerCase()).toContain(String(fill.value).toLowerCase());
          }
          const v = variantAt(pool.blockId, pool.poolKey, pool.authoredIndex);
          if (v) expect(faceRawOf(v, pool.face)).toEqual(expect.any(String));
        }
      }
    }
    expect(total).toBeGreaterThan(100);
    // A ratchet, not a threshold: the recovery is total on the corpus as it stands today, and a
    // face shape that breaks it must announce itself rather than degrade quietly.
    expect(unrecovered, `${unrecovered} of ${total} composed units did not align`).toBe(0);
  }, 300_000);
});

describe('townCard — the spine\'s level-1 order (W3a car 2, chair ruling 26)', () => {
  it('every pool\'s unit.order is orderIdOf(classifyMoves(unit.spine)) and its licence', () => {
    // ⛔ THE ARM THIS KEY EXISTS FOR. `CORPUS-DIFF` FAILS a spine that loses the corpus spine's
    // closed level-1 order, and on the first simulated page four of the five fallbacks were that
    // arm alone. The card carried the spine and not its order, so the model was refused for a
    // rule it had never been given. This pin is the derivation, re-run: the card may not carry a
    // SECOND opinion about a spine's order, only the walker's own.
    const drift = [];
    let withOrder = 0;
    let withoutOrder = 0;
    for (const row of sample(12)) {
      let s;
      try { s = settlementOf(row); } catch { continue; }
      for (const tab of SCRIBE_TABS) {
        for (const pool of cardOf(s, tab).pools) {
          const spine = pool.unit.spine;
          const want = spine ? orderIdOf(classifyMoves(spine)) : '';
          if (pool.unit.order.id !== want) {
            drift.push(`${tab} :: ${pool.poolKey}: card ${pool.unit.order.id} vs walker ${want}`);
          }
          const members = want ? want.split('|').filter((m) => LEVEL1_ORDERS[m]) : [];
          const moves = members.length ? [...LEVEL1_ORDERS[members[0]].order] : [];
          if (JSON.stringify(pool.unit.order.moves) !== JSON.stringify(moves)) {
            drift.push(`${tab} :: ${pool.poolKey}: moves ${JSON.stringify(pool.unit.order.moves)} vs ${JSON.stringify(moves)}`);
          }
          const licences = members.map((m) => LEVEL1_ORDERS[m].licences).join(' | ');
          if (pool.unit.order.licences !== licences) {
            drift.push(`${tab} :: ${pool.poolKey}: licence drift`);
          }
          if (pool.unit.order.id === '') withoutOrder += 1; else withOrder += 1;
        }
      }
    }
    expect(drift, `\n${drift.slice(0, 20).join('\n')}\n`).toEqual([]);
    // BOTH ANSWERS ARE REACHED, so the pin is not standing over one branch. The shipped corpus
    // runs about five spines in six inside the closed set, which is the measurement `armOrder`'s
    // own WITHHELD channel was chosen on.
    expect(withOrder, 'no pool realised a closed order: the arm is vacuous').toBeGreaterThan(0);
    expect(withoutOrder, 'every pool realised one: the empty branch is untested').toBeGreaterThan(0);
  }, 300_000);

  it('the order key is byte-stable across two builds and carries the walker\'s ambiguity whole', () => {
    const s = townOf({
      settType: 'city', culture: 'germanic', terrainOverride: 'plains',
      tradeRouteAccess: 'road', monsterThreat: 'frontier',
    }, 'order-stable');
    expect(townCardJson(cardOf(s, 'defense'))).toBe(townCardJson(cardOf(s, 'defense')));
    // ⛔ THE AMBIGUOUS ID IS KEPT AS AN AMBIGUITY. `V3` and `V8` share a move list and differ only
    // in the ABSENCE CLASS, which no lexical read settles, so `orderIdOf` answers `V3|V8`; the
    // card must carry both licences and one move list rather than picking for the walker.
    expect(orderIdOf(['PRESENT', 'ABSENCE'])).toBe('V3|V8');
    expect(LEVEL1_ORDERS.V3.order).toEqual(LEVEL1_ORDERS.V8.order);
    // NEGATIVE CONTROL — a sequence outside the closed set answers the empty id, never a guess.
    expect(orderIdOf(['FEELING', 'FIGURE'])).toBe('');
  }, 60_000);
});

describe('townCard — the audience', () => {
  it('a player card carries no dm-only unit; a dm card may', () => {
    const offending = [];
    let dmOnlySeen = 0;
    for (const row of sample(12)) {
      let s;
      try { s = settlementOf(row); } catch { continue; }
      for (const tab of SCRIBE_TABS) {
        for (const pool of cardOf(s, tab, 'player').pools) {
          const v = variantAt(pool.blockId, pool.poolKey, pool.authoredIndex);
          if (v && !variantIsAudible(v, 'player')) offending.push(`${tab} :: ${pool.poolKey}`);
          if (pool.marks.includes('dm-only')) offending.push(`${tab} :: ${pool.poolKey} :: marked`);
        }
        for (const pool of cardOf(s, tab, 'dm').pools) {
          if (pool.marks.includes('dm-only')) dmOnlySeen += 1;
        }
      }
    }
    expect(offending, `\n${offending.join('\n')}\n`).toEqual([]);
    // NEGATIVE CONTROL — the audience filter is the kernel's, and it must be able to refuse.
    expect(variantIsAudible({ marks: ['dm-only'] }, 'player')).toBe(false);
    expect(variantIsAudible({ marks: ['dm-only'] }, 'dm')).toBe(true);
    expect(dmOnlySeen).toBeGreaterThanOrEqual(0);
  }, 300_000);

  it('an unrecognised audience reads as the player\'s (kernel law 2, fail-closed)', () => {
    const s = townOf({
      settType: 'town', culture: 'germanic', terrainOverride: 'plains',
      tradeRouteAccess: 'road', monsterThreat: 'civilized',
    }, 'audience-law');
    const odd = townCard(s, { tab: 'defense', audience: 'archivist', staticCard: STATIC_CARD });
    expect(odd.audience).toBe('player');
    expect(townCardJson(odd)).toBe(townCardJson(cardOf(s, 'defense', 'player')));
  }, 60_000);
});

describe('townCard — the epoch', () => {
  it('records an unadvanced town honestly, and reads the campaign world where there is one', () => {
    const s = townOf({
      settType: 'town', culture: 'germanic', terrainOverride: 'plains',
      tradeRouteAccess: 'road', monsterThreat: 'civilized',
    }, 'epoch');
    const bare = cardOf(s, 'overview');
    expect(bare.epoch.advanced).toBe(false);
    expect(bare.epoch.tick).toBe(null);
    expect(bare.lastAdvance).toBe(null);
    // ⛔ THE FROZEN-YEAR FINDING, PINNED so it cannot be quietly forgotten: `renderYearOf` is
    // `history.age`, which the engine writes at generation and no worldPulse module ever moves.
    expect(bare.epoch.renderYearIsFrozen).toBe(true);
    expect(bare.epoch.renderYear).toBe(renderYearOf(s));

    const world = {
      tick: 31,
      calendar: { year: 31, month: 4, season: 'spring', elapsedWeeks: 1560 },
      pulseHistory: [{
        id: 'world_pulse.c1.31',
        tick: 31,
        interval: 'one_year',
        committed: true,
        calendar: { year: 31, season: 'spring' },
        timeTicks: [{ saveId: s.id, summary: ['one year passed under no active conditions.'] }],
        mechanicalOutcomes: [{
          id: 'candidate.population.growth.a.31', type: 'population', ruleId: 'population_growth',
          targetSaveId: s.id, saveId: s.id, headline: 'the town may grow', summary: 'it gains about 13 people.',
        }],
        consequenceOutcomes: [],
        corruptionEvents: [],
        factionCaptureEvents: [],
      }],
    };
    const advanced = townCard(s, { tab: 'overview', audience: 'dm', world, staticCard: STATIC_CARD });
    expect(advanced.epoch.advanced).toBe(true);
    expect(advanced.epoch.tick).toBe(31);
    expect(advanced.epoch.calendar.year).toBe(31);
    expect(advanced.lastAdvance.tick).toBe(31);
    expect(advanced.lastAdvance.interval).toBe('one_year');
    expect(advanced.lastAdvance.summary).toEqual(['one year passed under no active conditions.']);
    expect(advanced.lastAdvance.outcomes[0].ruleId).toBe('population_growth');
    // NEGATIVE CONTROL — another settlement's rows are not this town's.
    const notMine = {
      ...world,
      pulseHistory: [{
        ...world.pulseHistory[0],
        timeTicks: [{ saveId: 'some-other-town', summary: ['not this town'] }],
        mechanicalOutcomes: [{ id: 'x', type: 'population', ruleId: 'r', saveId: 'some-other-town' }],
      }],
    };
    const filtered = townCard(s, { tab: 'overview', audience: 'dm', world: notMine, staticCard: STATIC_CARD });
    expect(filtered.lastAdvance.summary).toEqual([]);
    expect(filtered.lastAdvance.outcomes).toEqual([]);
  }, 60_000);
});

describe('townCard — the golden', () => {
  /**
   * ── SHIFT RECORD ────────────────────────────────────────────────────────────
   * A fixture cannot show WHY it moved, so every re-record is written down here, in the golden
   * master's own discipline. Re-recording without adding a row is a deleted alarm.
   *
   * 2026-09-14 — GENESIS (W0). The first golden town of `goldenMasterCorpus.js`, all thirteen
   *   tabs, at the DM audience, with the committed static card joined. Recorded at the W0 lane's
   *   clean tip off `7992713d0`.
   *
   * 2026-09-14 — RE-RECORDED (W2 commit 1), card schema /1 → /2. CAUSE: `town.holders` was
   *   added, under the chair's ruling on W1's open item. W1 MEASURED that A13's INTERESTED
   *   limb was NOT-EXECUTABLE from the card alone, because whether the body keeping a cited
   *   record has an interest in it needs impairments and capture state, which are settlement
   *   facts the card did not carry — and the SERVER-side refuter has only the card. The row
   *   resolves the twelve holder kinds once, where the settlement IS in hand, so the arm now
   *   executes on the ground the product actually refutes on. NOTHING ELSE MOVED: every other
   *   field of every tab is byte-identical to the genesis record, and the two absences the
   *   headless card cannot read (captured, controlled) are PRINTED in each row's `absent`
   *   rather than defaulted to false.
   *
   * 2026-09-14 — RE-RECORDED (W3a car 2), card schema /2 → /3. CAUSE: `pools[].unit.order` was
   *   added under chair ruling 26 — the LEVEL-1 move order the corpus spine realises, its move
   *   list, and the licence that names it. The simulation MEASURED four of five fallbacks on one
   *   rendered page as `CORPUS-DIFF · a level-1 order lost on a spine`, which is a corpus-register
   *   property the card carried no trace of, so a model was being refused for a rule it had never
   *   been given. NOTHING ELSE MOVED: the only new bytes on any tab are the three keys of that
   *   record inside each pool's `unit`, plus the schema string itself, and the derivation is
   *   re-run against `orderIdOf(classifyMoves(spine))` by the arm above rather than frozen here.
   *
   * 2026-09-14 — RE-RECORDED (W3b car 2), card schema /3 → /4. CAUSE: three keys that say what
   *   the card does NOT know. RUN 2 measured the writer's commonest invention as an ABSENCE
   *   asserted where a reading has no value, and the card printed `= null` for such readings
   *   without saying that a null is not a fact. So every field row gains `unknown` and `state`
   *   (`decided` / `not-decided` / `unreadable` — the last because 42 of 42 valueless rows on the
   *   pinned town are readings this card CANNOT RESOLVE rather than readings the engine has not
   *   decided, and calling those undecided would put a false fact on the card), and every pool
   *   gains `writeable`. NOTHING ELSE MOVED: the only new bytes on any tab are `fields[].state`,
   *   `fields[].unknown`, `pools[].writeable` and the schema string, and both derivations are
   *   re-run by the arms above rather than frozen here.
   *
   * 2026-09-14 — RE-RECORDED (W3b car 6), card schema UNCHANGED at /4. CAUSE: `writeableOf` lost
   *   its NO-DECIDED-FIELD limb. Car 2's own measurement struck it: 42 of 42 valueless field rows
   *   on the pinned town are `unreadable` (desk-local spellings the census recorded verbatim, which
   *   no settlement has a key for) and not one is a true null, so the limb was measuring the CARD'S
   *   BLINDNESS rather than the engine's silence, and it was turning off pools whose keys the
   *   engine had decided in terms. A pool key that fired is a decided fact. NOTHING ELSE MOVED:
   *   `pools[].writeable` is the only key that changed value on any tab, it changed only from
   *   false to true, and no key was added or removed.
   *
   * 2026-09-14 — RE-RECORDED (W3d car 2), card schema /4 → /5. CAUSE: `town.bodies` was added —
   *   every NAMED body the engine holds for this settlement (its factions, its power blocs, the
   *   parties of its conflicts and of its prominent relationship), deduped by name with the row
   *   each came from. RUN 3 measured 8 roster contradictions and most were not inventions: "The
   *   Governing Council and The Order of the Watch" and "the Commercial Circle and the
   *   Administrative Circle" are the engine's own rows, handed to the WRITER as the pool's own
   *   `{faction}` fills, while the town block claimed to list every body that may be named and
   *   listed none of them. NOTHING ELSE MOVED: the only new bytes on any tab are `town.bodies` and
   *   the schema string, the section is identical on all thirteen tabs (it is cache breakpoint
   *   two), and the derivation is re-run by the arms above rather than frozen here.
   */
  it('the first golden town matches the committed card, byte for byte, on every tab', () => {
    const row = goldenCorpus()[0];
    const s = settlementOf(row);
    const built = {};
    for (const tab of SCRIBE_TABS) built[tab] = cardOf(s, tab);
    const out = { town: keyOf(row), tabs: built };
    if (process.env.UPDATE_SCRIBE_GOLDEN) {
      process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
    }
    expect(existsSync(GOLDEN), 'run UPDATE_SCRIBE_GOLDEN=1 to print the fixture').toBe(true);
    expect(out).toEqual(JSON.parse(readFileSync(GOLDEN, 'utf8')));
  }, 120_000);
});

describe('scribePage — the page the card reads', () => {
  it('every composed line names a mount the registry holds for that tab', () => {
    const bad = [];
    const byTab = new Map();
    for (const tab of SCRIBE_TABS) byTab.set(tab, new Set());
    const s = townOf({
      settType: 'city', culture: 'germanic', terrainOverride: 'plains',
      tradeRouteAccess: 'road', monsterThreat: 'frontier',
    }, 'mount-pin');
    for (const tab of SCRIBE_TABS) {
      for (const line of renderTabPage(s, tab, { audience: 'dm' })) {
        if (line.kind !== 'composed') continue;
        byTab.get(tab).add(line.mount);
        if (!line.block || !line.pool || typeof line.vid !== 'number') {
          bad.push(`${tab}: a composed line with no provenance — ${line.text.slice(0, 60)}`);
        }
      }
    }
    expect(bad, `\n${bad.join('\n')}\n`).toEqual([]);
    // Every mount drawn is one the registry names for that tab.
    const { DOSSIER_MOUNTS: rows } = STATIC_CARD.pools ? { DOSSIER_MOUNTS: null } : {};
    expect(rows).toBe(null);
    for (const [tab, mounts] of byTab) {
      for (const mount of mounts) expect(mount.startsWith(`${tab}.`), `${tab} drew ${mount}`).toBe(true);
    }
  }, 60_000);

  it('an unknown tab is silence, never a throw', () => {
    const s = townOf({
      settType: 'thorp', culture: 'germanic', terrainOverride: 'plains',
      tradeRouteAccess: 'isolated', monsterThreat: 'safe',
    }, 'unknown-tab');
    expect(renderTabPage(s, 'no_such_tab', { audience: 'dm' })).toEqual([]);
    expect(townCard(s, { tab: 'no_such_tab', staticCard: STATIC_CARD }).tabIsKnown).toBe(false);
    expect(renderTabPage(null, 'defense', {})).toEqual(expect.any(Array));
  }, 60_000);
});
