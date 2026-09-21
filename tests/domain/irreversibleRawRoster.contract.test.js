/**
 * irreversibleRawRoster.contract.test.js — EM-B1k2: AN IRREVERSIBLE CONSEQUENCE IS
 * COMPUTED FROM THE RAW ROSTER, NEVER MERELY REFUSED AFTER THE FACT.
 *
 * WHAT EM-B1k LEFT BEHIND. EM-B1k made the tick's WRITE BASE the raw save roster
 * (`pulseKernel.js`'s `buildSettlementMap` and its `localSettlements` seed), which stops
 * the data loss. It did not change what the density lane READS. `advanceFactionDensity`
 * still took its tick-start picture from `item.settlement` — the OFF-STAGE participation
 * view (DESIGN_THE_ROADS.md §8) — so `readFactionLifecycle` was handed a roster somebody
 * had been filtered out of, PRODUCED a `faction_dissolved` reaction for a house whose one
 * member was merely shelved, and the only thing standing between that reaction and a
 * permanent sweep was `applyReactions`' second `stillEmpty` guard over the raw `fresh`.
 *
 * §810.4 R18 is explicit: an IRREVERSIBLE consequence may only be triggered by IRREVERSIBLE
 * causes. Shelving is a reversible stage mark. A dissolution computed from a projection and
 * rescued by a downstream guard is one edit away from firing — and the fallback at
 * `fresh = … : tickStart` is that edit already written: when the update entry carries no
 * `.settlement` the guard re-reads the projection too, and the house dies (A4).
 *
 * THE CURE, one token in `factionDensityKernel.js`: the tick-start read prefers
 * `item.save?.settlement` — `worldSnapshot.js`'s own `saveSettlement()` meaning, inlined —
 * so the law reads truth. Every REVERSIBLE reading in the file keeps the participation
 * view; the roads chokepoint is not reopened.
 *
 * ⛔ THE SEAM IS THE SUBJECT, NEVER A RE-IMPLEMENTATION OF IT. Every arm drives a SHIPPED
 * entry — `buildWorldSnapshot` mints the participation view, `advanceFactionDensity` is the
 * mover, `applySettlementLifecycleOutcomeToSettlement` and `applyOrganicNpcVerdicts` are the
 * two permanent roster writers at their own triggers. Nothing here recomputes
 * `item.save?.settlement || item.settlement` by hand; A1 OBSERVES the base the kernel hands
 * the law by wrapping the law itself.
 *
 * ⛔ AND A2'S EXHAUSTIVE CLAIM IS DERIVED FROM ITS PRODUCER (CURE-H's idiom, 2026-09-20).
 * "the reading is consumed for two members and nothing else" is what makes a one-token swap
 * provably isolated to the irreversible decision — so the two members are READ OUT OF
 * `factionDensityKernel.js`, inside a span whose opening and closing anchors are both
 * asserted FOUND and asserted ORDERED before a single character is sliced. A hardcoded pair
 * would drift from the mover in silence the day a third consumer lands, which is exactly the
 * class `tests/lint/contractTestAntiVacuity.walker.test.js` Rule 2 exists to refuse.
 *
 * @enforced-by the EM-B1k2 acceptance matrix (A1, A2, A4, A5, A6)
 */
import { readFileSync } from 'node:fs';
import { describe, it, expect, vi } from 'vitest';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { advanceFactionDensity, CADENCE_CLOCK } from '../../src/domain/worldPulse/factionDensityKernel.js';
import { applySettlementLifecycleOutcomeToSettlement } from '../../src/domain/worldPulse/settlementLifecycleFirstClass.js';
import { applyOrganicNpcVerdicts } from '../../src/domain/worldPulse/npcVerdictPulse.js';
import { DENSITY_LAW_CONFIG_KEY, REGISTER_VII_DENSITY_LAW_VERSION } from '../../src/domain/density/densityLaw.js';
import { isOffStage } from '../../src/domain/roads/state.js';
import { npcId } from '../../src/domain/worldPulse/npcAgency.js';
import { stablePart } from '../../src/domain/worldPulse/stablePart.js';

const SID = 'ashford';
const TICK = 4;
const SHELVED_ID = 'npc.shelved';
const OUSTED_ID = 'npc.ousted';
/** The world the density law is LIT in; a v1 config is A2's dormancy half. */
const LIT_CONFIG = Object.freeze({ [DENSITY_LAW_CONFIG_KEY]: REGISTER_VII_DENSITY_LAW_VERSION });
/** The deciding line, named once, so every failure points at it. */
const READ_SITE = 'src/domain/worldPulse/factionDensityKernel.js — the `tickStart` read inside advanceFactionDensity, which hands readFactionLifecycle the roster an IRREVERSIBLE dissolution is computed from (EM-B1k2; EM-B1k made the WRITE base raw before it)';

const CROWN = Object.freeze({ id: 'fac.crown', name: 'The Crown', faction: 'The Crown', isGoverning: true, power: 40 });
const WEAVERS = Object.freeze({ id: 'fac.weavers', name: 'The Weavers', faction: 'The Weavers', power: 12 });
/** The already-empty house: the NON-VACUITY control. It must keep minting its dissolution. */
const CHANDLERS = Object.freeze({ id: 'fac.chandlers', name: 'The Chandlers', faction: 'The Chandlers', power: 4 });

/** @param {string} id @param {string} house @param {Record<string, unknown>} [extra] */
function member(id, house, extra = {}) {
  return { id, name: `Factor of ${house}`, factionAffiliation: house, status: 'active', importance: 'notable', ...extra };
}

/**
 * A town whose density law is lit, whose CADENCE is held shut by its own clock (so the only
 * thing observable here is R18's lifecycle lane), and whose Weavers hold exactly one member —
 * optionally SHELVED through the stasis mark the DM's Availability control writes.
 * @param {{shelved?: boolean, config?: Record<string, unknown>}} [a]
 */
function ashford({ shelved = false, config = LIT_CONFIG } = {}) {
  return {
    id: SID,
    name: 'Ashford',
    tier: 'town',
    config,
    npcs: [member('npc.crown', 'The Crown'), member(SHELVED_ID, 'The Weavers', shelved ? { stasis: { reason: 'sequestered' } } : {})],
    powerStructure: {
      governingName: 'The Crown',
      factions: [CROWN, WEAVERS, CHANDLERS],
      seatOfPower: 'The Crown',
      publicLegitimacy: { score: 55 },
      factionRelationships: [],
      [CADENCE_CLOCK]: TICK,
    },
  };
}

/** A bottom-rung thorp with three souls, one of them shelved — A5 and A6's base. */
function thorp() {
  return {
    id: SID,
    name: 'Ashford',
    tier: 'thorp',
    population: 40,
    config: {},
    institutions: [],
    npcs: [
      member('npc.reeve', 'The Crown', { name: 'Godric the Reeve' }),
      member(OUSTED_ID, 'The Crown', { name: 'Wulfric the Bailiff' }),
      member(SHELVED_ID, 'The Crown', { name: 'Aelfwyn the Sequestered', stasis: { reason: 'sequestered' } }),
    ],
  };
}

/** The REAL snapshot, so the participation view under test is the shipped one.
 *  @param {Record<string, unknown>} settlement */
function snapshotOf(settlement) {
  const worldState = { tick: TICK, simulationRules: {} };
  const save = { id: SID, name: 'Ashford', phase: 'canon', settlement, campaignState: { phase: 'canon', eventLog: [], locks: {} } };
  return buildWorldSnapshot({ campaign: { id: 'c-em-b1k2', settlementIds: [SID], worldState }, saves: [save], worldState });
}

/** The update entry the tick writes onto — RAW in every arm, because EM-B1k landed.
 *  @param {Record<string, unknown>} settlement */
function updatesOf(settlement) {
  return [{ saveId: SID, save: {}, settlement }];
}

/** @param {any} settlement @returns {string[]} the seated house names */
function housesOf(settlement) {
  const factions = settlement && settlement.powerStructure && settlement.powerStructure.factions;
  return (Array.isArray(factions) ? factions : []).map((/** @type {any} */ f) => String(f.name));
}

/**
 * The houses a tick actually dissolved, keyed on the beat's own IDENTITY rather than on its
 * prose. `dissolvedBeat` composes its headline as `the ${houseName}` over a seat key that
 * already carries its article, so the rendered line reads "the The Chandlers" — a real defect,
 * but not this file's, and a contract test that pinned the rendering would red the day somebody
 * cures it. `sourceEventId` is the address the chronicle joins on and it moves for one reason
 * only: a different house was swept.
 * @param {any[]} beats @returns {string[]}
 */
function dissolvedHouses(beats) {
  return beats.filter((b) => String(b.impactKind) === 'faction_dissolved').map((b) => String(b.sourceEventId)).sort();
}

/** The address `dissolvedBeat` mints for one house, composed with the producer's own speller.
 *  @param {string} house @returns {string} */
function dissolutionAddress(house) {
  return `faction_dissolved.${SID}.${stablePart(house)}.${TICK}`;
}

/** @param {any} settlement @returns {string[]} */
function rosterIds(settlement) {
  const npcs = settlement && settlement.npcs;
  return (Array.isArray(npcs) ? npcs : []).map((/** @type {any} */ n) => String(n.id)).sort();
}

/** @param {any} settlement @returns {string[]} */
function dispersedIds(settlement) {
  const npcs = settlement && settlement.npcs;
  return (Array.isArray(npcs) ? npcs : []).filter((/** @type {any} */ n) => n.dispersed === true).map((/** @type {any} */ n) => String(n.id)).sort();
}

// ── A2's derivation: the mover's own source, comment-blanked ────────────────────────────
const KERNEL_SOURCE = readFileSync(new URL('../../src/domain/worldPulse/factionDensityKernel.js', import.meta.url), 'utf8');
/** The two anchors that bound the mover, and the declaration the swap lands on. */
const MOVER_OPENER = 'export function advanceFactionDensity(';
const MOVER_CLOSER = '// ── THE PULSE SEAM';
const TICK_START_ANCHOR = 'const tickStart =';

/**
 * Comment-blanked source, length-preserving and quote-aware. The mover's own commentary
 * SPELLS `reading.reactions` in prose (the "NOT `|| !reading.reactions.length`" note), so
 * without this a sentence about a consumer would be derived as a consumer.
 * @param {string} src @returns {string}
 */
function commentBlanked(src) {
  let out = ''; let i = 0; let quote = '';
  while (i < src.length) {
    const c = src[i]; const c2 = src[i + 1];
    if (quote) {
      if (c === '\\') { out += src.slice(i, i + 2); i += 2; continue; }
      if (c === quote) quote = '';
      out += c; i += 1; continue;
    }
    if (c === '"' || c === "'" || c === '`') { quote = c; out += c; i += 1; continue; }
    if (c === '/' && c2 === '/') { while (i < src.length && src[i] !== '\n') { out += ' '; i += 1; } continue; }
    if (c === '/' && c2 === '*') {
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) { out += src[i] === '\n' ? '\n' : ' '; i += 1; }
      out += '  '; i += 2; continue;
    }
    out += c; i += 1;
  }
  return out;
}

/** Every member of the law's reading that the given CODE actually consumes, sorted.
 *  @param {string} code @returns {string[]} */
function readingMembersIn(code) {
  return [...new Set([...code.matchAll(/\breading\.([A-Za-z_$][\w$]*)/g)].map((m) => m[1]))].sort();
}

describe('EM-B1k2 — the irreversible reads take the raw roster, and the habitat is gone', () => {
  it('A1 — the dissolution is never PROPOSED: the law reads the raw roster, so a shelved sole member mints no reaction', async () => {
    const town = ashford({ shelved: true });
    const snapshot = snapshotOf(town);
    expect(isOffStage(town.npcs.find((n) => String(n.id) === SHELVED_ID)), 'the fixture must really shelve somebody, or this arm measures nothing').toBe(true);
    expect(rosterIds(snapshot.settlements[0].settlement), 'the participation view must really be short by the shelved soul — that shortfall IS the habitat').toEqual(['npc.crown']);
    expect(snapshot.settlements[0].save.settlement, 'the snapshot item must carry the RAW save beside the view').toBe(town);

    // THE OBSERVATION, NOT A RE-IMPLEMENTATION. The law itself is wrapped, so what is recorded
    // is the roster the MOVER chose to hand it — the whole subject of this packet. Under EM-B1k
    // the reaction below is still PRODUCED from the filtered view and merely REFUSED downstream
    // by `stillEmpty` over the raw `fresh`; this arm measures the production.
    /** @type {string[][]} */
    const produced = [];
    vi.resetModules();
    vi.doMock('../../src/domain/density/factionLifecycle.js', async (importOriginal) => {
      const original = /** @type {Record<string, any>} */ (await importOriginal());
      return {
        ...original,
        readFactionLifecycle: (/** @type {any} */ settlement, /** @type {any} */ opts) => {
          const reading = original.readFactionLifecycle(settlement, opts);
          produced.push(reading.reactions.map((/** @type {any} */ r) => `${String(r.kind)}::${String(r.factionKey)}`));
          return reading;
        },
      };
    });
    const { advanceFactionDensity: observedMover } = await import('../../src/domain/worldPulse/factionDensityKernel.js');
    observedMover({ snapshot, worldState: {}, settlementUpdates: updatesOf(town), tick: TICK, now: null });
    vi.doUnmock('../../src/domain/density/factionLifecycle.js');

    expect(produced.length, 'the law must really have been read once at the tick-start base').toBe(1);
    const minted = produced[0];
    // NON-VACUITY: the already-empty house still earns its dissolution in the same call, so an
    // empty reaction list can never be mistaken for a cure.
    expect(minted, 'the already-empty house must still mint its dissolution — without it an empty reaction list proves nothing').toContain(`faction_dissolved::${CHANDLERS.name}`);
    expect(
      minted.filter((row) => row.endsWith(`::${WEAVERS.name}`)),
      `A PERMANENT CONSEQUENCE WAS PROPOSED FOR A HOUSE WHOSE ONE MEMBER IS MERELY SHELVED (the law was handed ${JSON.stringify(minted)}). Shelving is a reversible stage mark and §810.4 R18 admits only irreversible causes, so the reaction must never be minted at all — being refused downstream is one edit away from being applied. ${READ_SITE}`,
    ).toEqual([]);
  });

  it('A2 — nothing moves: the chain is deep-equal with and without the raw base, and the reading is consumed for two members and nothing else', () => {
    // HALF ONE — THE BEHAVIOUR SHIFT, MEASURED AT ZERO. Nobody is off-stage, so the snapshot
    // passes the settlement through BY REFERENCE (worldSnapshot.js's `else` branch) and the two
    // drives differ only in whether the item carries `save` at all: the first exercises the new
    // read, the second the `||` fallback that `densityLaw.test.js`'s save-less `snapOf` shape has
    // always taken. Their outputs may not differ by one key.
    const town = ashford({ shelved: false });
    const snapshot = snapshotOf(town);
    expect(snapshot.settlements[0].settlement, 'with nobody off-stage the view IS the raw settlement').toBe(town);
    const withSave = advanceFactionDensity({ snapshot, worldState: {}, settlementUpdates: updatesOf(town), tick: TICK, now: null });
    const withoutSave = advanceFactionDensity({ snapshot: { settlements: [{ id: SID, settlement: town }] }, worldState: {}, settlementUpdates: updatesOf(town), tick: TICK, now: null });
    // Liveness: a deep-equality between two no-ops is worth nothing.
    expect(withSave.changed, 'the lit drive must really have moved something').toBe(true);
    expect(dissolvedHouses(withSave.newsEntries), 'the already-empty house must really dissolve, or this arm compares two empty outputs').toEqual([dissolutionAddress(CHANDLERS.name)]);
    expect(
      { changed: withoutSave.changed, newsEntries: withoutSave.newsEntries, settlementUpdates: withoutSave.settlementUpdates },
      `THE READ CHANGE MOVED THE CHAIN. It was priced as behaviour-neutral on every world where nobody is off-stage, because there the participation view and the save settlement are the SAME OBJECT. ${READ_SITE}`,
    ).toEqual({ changed: withSave.changed, newsEntries: withSave.newsEntries, settlementUpdates: withSave.settlementUpdates });

    // HALF TWO — DORMANCY BY REFERENCE. A v1 world never reaches a roster at all.
    const v1World = {};
    const v1Updates = updatesOf(ashford({ shelved: true, config: {} }));
    const dormant = advanceFactionDensity({ snapshot: snapshotOf(ashford({ shelved: true, config: {} })), worldState: v1World, settlementUpdates: v1Updates, tick: TICK, now: null });
    expect(dormant.changed, 'a v1 world is an exact no-op').toBe(false);
    expect(dormant.worldState, 'the dormant path returns the SAME worldState reference').toBe(v1World);
    expect(dormant.settlementUpdates, 'the dormant path returns the SAME settlementUpdates reference').toBe(v1Updates);
    expect(dormant.newsEntries, 'a dormant world earns no beats').toEqual([]);

    // HALF THREE — THE PREMISE, DERIVED FROM THE MOVER ITSELF. Both anchors found, the span
    // asserted ordered, and the declaration the swap lands on asserted present inside it: four
    // ways for the producer to move, four loud reds, none of them a scan over an empty string.
    const moverFrom = KERNEL_SOURCE.indexOf(MOVER_OPENER);
    expect(moverFrom, `factionDensityKernel.js no longer opens \`${MOVER_OPENER}\`. Re-anchor this derivation on whatever replaced it rather than typing the consumer names back in.`).toBeGreaterThanOrEqual(0);
    const moverTo = KERNEL_SOURCE.indexOf(MOVER_CLOSER, moverFrom + MOVER_OPENER.length);
    expect(moverTo, `no \`${MOVER_CLOSER}\` banner follows the mover any more, so the span would run to the end of the file and the derivation would leave the function without saying so.`).toBeGreaterThanOrEqual(0);
    expect(moverFrom, 'the mover no longer precedes the pulse-seam banner — an inverted span slices to the empty string in silence, which is the class CURE-E closed.').toBeLessThan(moverTo);
    const mover = commentBlanked(KERNEL_SOURCE.slice(moverFrom, moverTo));
    expect(mover, `the mover no longer declares \`${TICK_START_ANCHOR}\`, so the swap this packet makes has no home`).toContain(TICK_START_ANCHOR);
    // The derivation is its own harness, on a fixture, so both directions execute every run: a
    // consumer named only in prose is not a consumer, and a consumer spliced into the code is.
    const harness = ['const reading = readFactionLifecycle(tickStart, { tick });', '// ⚠ NOT `|| !reading.ghost.length` — named in prose, never consumed', '/* reading.ghostTwo */', 'if (!reading.governed) continue;', 'applyReactions(fresh, reading.reactions, ctx);'].join('\n');
    expect(readingMembersIn(commentBlanked(harness)), 'a member named only in a comment must not be derived as a consumer — the walk reads code, not prose').toEqual(['governed', 'reactions']);
    expect(
      readingMembersIn(commentBlanked(`${harness}\nconst c = reading.census.length;`)),
      "a consumer spliced INTO the mover must appear in the derived population, or a third reader escapes this claim in silence — the whole reason the population is derived",
    ).toEqual(['census', 'governed', 'reactions']);
    expect(
      readingMembersIn(mover),
      `A THIRD CONSUMER OF THE LIFECYCLE READING APPEARED. The one-token base swap was priced as isolated to the IRREVERSIBLE decision precisely because the reading is consumed for \`governed\` (the v1 gate) and \`reactions\` (the R18 lane) and nothing else — a new consumer is a new thing now reading the raw roster, and it needs its own judgement before this claim can stand. ${READ_SITE}`,
    ).toEqual(['governed', 'reactions']);
  });

  it('A4 — the fallback arm: with no settlement on the update entry, the shelved sole member house survives the tick', () => {
    // ⛔ DEFENCE IN DEPTH BY CONSTRUCTION. `fresh` falls back to `tickStart` when the update
    // entry carries no `.settlement`, so under a filtered tick-start read BOTH the law and its
    // confirmation see the shortened roster and EM-B1k's raw write base never gets a vote. The
    // pre-proof traced both producers of that entry and neither can mint such a shape today —
    // but nothing in the tree ASSERTED it, which is the difference between a defence and a
    // coincidence.
    const town = ashford({ shelved: true });
    const out = advanceFactionDensity({ snapshot: snapshotOf(town), worldState: {}, settlementUpdates: [{ saveId: SID, save: {} }], tick: TICK, now: null });
    expect(
      dissolvedHouses(out.newsEntries),
      `THE TICK NARRATED A DISSOLUTION THAT DID NOT HAPPEN, or the already-empty house stopped dissolving and the arm below is a claim about an entry the mover never wrote. ${READ_SITE}`,
    ).toEqual([dissolutionAddress(CHANDLERS.name)]);
    expect(
      housesOf(out.settlementUpdates[0].settlement),
      `A HOUSE WAS SWEPT OUT OF THE POWER STRUCTURE BECAUSE ITS ONE MEMBER WAS SHELVED, through the \`fresh\` fallback: with no settlement on the update entry the confirmation re-reads the very projection the law read. ${READ_SITE}`,
    ).toEqual([CROWN.name, WEAVERS.name]);
  });

  it('A5 — the dispersal carries the off-stage soul: every soul in the raw roster is stamped dispersed, and the participation view drops them', () => {
    // THE FIRST PERMANENT ROSTER WRITER, AT ITS REAL TRIGGER. A `terminal_death` lifecyclePatch
    // on a bottom-rung thorp is the shape `applyWorldPulse.js` hands this writer, and
    // `settlementLifecycleEnabled` is lit in all four presets including the default. The writer
    // takes NO save: its base is whatever its caller passes, made raw by EM-B1k — so the cure
    // available here is the WRITTEN CONTRACT, and this arm is what makes that contract true.
    const town = thorp();
    const snapshot = snapshotOf(town);
    const raw = snapshot.settlements[0].save.settlement;
    const view = snapshot.settlements[0].settlement;
    const everyone = rosterIds(town);
    const onStage = everyone.filter((id) => id !== SHELVED_ID);
    expect(raw, 'the snapshot item must carry the RAW save settlement').toBe(town);
    expect(everyone.length, 'the thorp must have a roster to lose somebody from').toBe(3);
    expect(rosterIds(view), 'the participation view really is short by the shelved soul').toEqual(onStage);

    const outcome = { id: 'outcome.em-b1k2-a5', lifecyclePatch: { kind: 'terminal_death' }, metadata: { tick: TICK } };
    const rawOut = applySettlementLifecycleOutcomeToSettlement(/** @type {any} */ (raw), outcome);
    const viewOut = applySettlementLifecycleOutcomeToSettlement(/** @type {any} */ (view), outcome);
    const viewIds = rosterIds(viewOut);
    const counterforce = `roster out ${viewIds.length} | dispersed stamps ${dispersedIds(viewOut).length} | the shelved soul present: ${viewIds.includes(SHELVED_ID)}`;

    expect(
      rosterIds(rawOut),
      `THE DISPERSAL DROPPED A NAMED SOUL. Over the raw base every resident must survive the settlement's death as a dispersal STAMP (law 6 conservation); the participation counterforce measures ${counterforce} against the raw base's full roster.`,
    ).toEqual(everyone);
    expect(dispersedIds(rawOut), 'every soul in the raw roster carries the dispersal stamp, the shelved one included').toEqual(everyone);
    // THE COUNTERFORCE, EXECUTED. Handed the projection, the same writer silently loses the
    // shelved soul — precisely what the file's written base contract forbids.
    expect(viewIds.includes(SHELVED_ID), `the counterforce must lose the shelved soul (${counterforce})`).toBe(false);
    expect(viewIds, `the counterforce keeps exactly the on-stage roster (${counterforce})`).toEqual(onStage);
  });

  it('A6 — the successor pass keeps the off-stage soul, and the name join hits exactly one person', () => {
    // THE SECOND PERMANENT ROSTER WRITER, AT ITS REAL TRIGGER. An `ousted` exposure is the kind
    // `advanceNpcCorruption` mints, and `pulseKernel.js` calls that unconditionally. The drive
    // goes through the shipped caller `applyOrganicNpcVerdicts`, whose `replacementSource` is the
    // settlement it was handed — `pulseKernel.js`'s `localSettlements` entry, made raw by EM-B1k.
    // Like the dispersal, `replaceOustedNpcs` receives no save and cannot read raw itself.
    const town = thorp();
    const snapshot = snapshotOf(town);
    const raw = snapshot.settlements[0].save.settlement;
    const view = snapshot.settlements[0].settlement;
    const ousted = town.npcs.find((n) => String(n.id) === OUSTED_ID);
    const exposure = { kind: 'ousted', npcId: npcId(SID, ousted, 1), name: ousted.name };
    /** @param {any} base */
    const drive = (base) => applyOrganicNpcVerdicts({ worldState: {}, settlement: base, exposures: [exposure], settlementSeed: 'em-b1k2-a6', settlementId: SID, settlementName: String(base.name), tick: TICK, successorRng: null }).settlement;

    // ⭐ THE NAME JOIN IS SAFE HERE, AND IT IS PROVEN RATHER THAN RECITED (the chair's Q4
    // ruling). `replaceOustedNpcs` matches on `String(name).toLowerCase()`, so a duplicate
    // display name would replace two souls with one successor and quietly delete a person. The
    // measured corpus fact behind the ruling: 0 duplicates across 525 golden rows / 5,171 NPCs.
    const lowered = (raw.npcs || []).map((/** @type {any} */ n) => String(n.name).toLowerCase());
    expect(lowered.length, 'the drive must carry a roster for the join to be a question at all').toBe(3);
    expect(new Set(lowered).size, 'TWO SOULS SHARE A DISPLAY NAME under the exact key the successor join uses, so one ouster would replace both and a named person would be deleted without a receipt.').toBe(lowered.length);

    const rawIds = rosterIds(drive(raw));
    const viewIds = rosterIds(drive(view));
    const counterforce = `roster out ${viewIds.length} | the ousted replaced: ${!viewIds.includes(OUSTED_ID)} | the shelved soul present: ${viewIds.includes(SHELVED_ID)}`;

    // Liveness: the successor pass must really have fired, or "nobody was lost" is trivially true.
    expect(rawIds.includes(OUSTED_ID), `the ousted person must really be replaced (${counterforce})`).toBe(false);
    expect(rawIds.length, 'the successor takes the ousted seat one-for-one').toBe(3);
    expect(
      rawIds.includes(SHELVED_ID),
      `THE SUCCESSOR PASS DROPPED THE OFF-STAGE SOUL. Over the raw base the ousted person is replaced and everybody else stays; the participation counterforce measures ${counterforce}, which is the roster this writer returns when its caller hands it a projection instead of the save.`,
    ).toBe(true);
    // THE COUNTERFORCE, EXECUTED.
    expect(viewIds.includes(SHELVED_ID), `the counterforce must lose the shelved soul (${counterforce})`).toBe(false);
    expect(viewIds.length, `the counterforce returns a roster short by one (${counterforce})`).toBe(2);
  });
});
