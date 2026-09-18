/**
 * domain/display/stateProse/printProse.js — THE PRINT DESK: the sentence-rung dossier
 * positions, woven, for the paid PDF.
 *
 * ── THE DEFECT THIS EXISTS FOR (owner order "impliment every fix", 2026-09-18) ────────
 * `dossierMounts.js` routes 56 positions, 51 of them at the SENTENCE rung. The screen draws
 * every one of them. THE PDF DREW NONE. A paying reader who exports the dossier they just
 * read on screen gets a document with the corpus's whole voice missing — the tiles, bars and
 * generator paragraphs print, and the fifty-one sentences the desks composed do not. The law
 * this breaks is the estate's oldest: screen and PDF derive from ONE model.
 *
 * ── WHY THE BUILDER IS HEADLESS, AND CALLER-SIDE ─────────────────────────────────────
 * The obvious cure — call the desks inside `src/pdf/sections/*.jsx` — is the wrong one three
 * times over:
 *   1. `src/pdf/**` is rendered INSIDE THE RENDER WORKER. The desks would have to be fetched
 *      with the worker bundle on the export the user is already waiting on.
 *   2. The mount registry's REACHABILITY arm counts mount-id string LITERALS under
 *      `src/components` and refuses a position named twice. This file names all fifty-one,
 *      and lives outside that tree ON PURPOSE. `src/pdf` is outside it too, but see (1).
 *   3. A section that called a desk would be a second `publicDossier` gate per chapter —
 *      exactly the shape `generalDeskRead.js` and `WarFaithDesk.jsx` exist to refuse.
 * So the CALLER (`utils/generateSettlementPDF.js`) builds the strings on the main thread and
 * posts them to the worker as a plain `stateProse` prop. Only strings cross the boundary,
 * the worker bundle is untouched, and the document stays structured-cloneable.
 *
 * ⛔ AND IT IS NOT A VIEW-MODEL FIELD. `pdf/lib/viewModel.js` is pinned byte-for-byte by
 * `tests/pdf/__snapshots__/goldenViewModel.test.js.snap`; hoisting fifty-one paragraphs into
 * `vm` would move that golden for a reason that has nothing to do with the view model. The
 * prose is a SEPARATE PROP with a separate lifetime, so the parity contract stays still.
 *
 * ── THE ARRANGEMENT IS THE SCREEN'S, EXACTLY ─────────────────────────────────────────
 * Every position weaves through `weaveBlock` with `tierNounFor(settlement.tier)` and the
 * settlement's own name, which is character for character what `ProseBlock` does. Not one
 * authored word is added here: the desks draw the sentences they already drew, `drawnAtMount`
 * rules on every one of them, and no pool, candidate leaf or mount row moves for this file.
 * A position whose desk was silent yields NOTHING and the chapter prints nothing there
 * (R-DST-K) — which is why there is no empty-state string anywhere below.
 *
 * ⛔ PURE. Same settlement + same context ⇒ same strings, forever. No clock, no RNG, no
 * store: the seed is the settlement's own (`String(_seed ?? id ?? '')`, the spelling every
 * desk reader in the estate uses) and the audience is `'dm'` — the pools doc's §0e
 * "DM-truth by default", and the PDF has no player view to read.
 *
 * ── ⚠ TWO CROSS-LAYER IMPORTS, DELIBERATE AND NARROW ─────────────────────────────────
 * `generalDeskRead.js` and `economyDeskRead.js` live under `src/components` for one reason:
 * the registry's ARM 2 admits exactly ONE component file per desk that imports its corpus
 * leaf and calls it. They are PLAIN MODULES — no React, no DOM, no store — and they own the
 * §885.3 gate and every argument those two desks need. Importing them here is what makes the
 * print strings the SAME derivation as the screen's rather than a second one that drifts.
 * A domain module reaching into `src/components` inverts the layer; a second copy of two
 * desks' argument assembly would be worse, and the estate's own rule ("a second derivation
 * of the same fact is a fork that drifts") decides it.
 *
 * ── ⚠⚠ FOUR DESKS ARE ASSEMBLED HERE AND THAT IS A DEFERRAL, NOT A DESIGN ────────────
 * `power`, `defense`, `stressors` and `warFaith` have no `*DeskRead.js` sibling: their
 * argument assembly lives INSIDE the tab components, so it cannot be imported headlessly.
 * The assemblies below MIRROR those tabs line for line and each names the file and line it
 * mirrors. THE CURE IS THE OTHER TWO DESKS' OWN SHAPE — lift each assembly into
 * `src/components/new/<desk>DeskRead.js` and have the tab consume it, which leaves ARM 2
 * satisfied (still exactly one caller) and deletes the mirror here. It is not done in this
 * car because `src/components/new/tabs/**` is owned by the concurrent typography lane and a
 * lift is an edit to every one of those files. Deliberately deferred — documented, not a bug
 * to re-find. Until then `tests/pdf/statePrintParity.test.jsx` pins the mirrors against the
 * desks themselves, which is what a mirror can be held to.
 *
 * @enforced-by tests/pdf/statePrintParity.test.jsx
 */
import { drawnAtMount } from './dossierMounts.js';
import { tierNounFor, weaveBlock } from './weaveBlock.js';
import {
  defenseCriminalProse, defenseForcesProse, defenseMagicDependencyProse,
  defenseMilitaryStatusProse, defensePostureProse, defenseStateProse,
  defenseSupportingProse, defenseThreatProse, defenseWallRationaleProse,
} from './defenseStateProse.js';
import { flagDrivenPoolKey, notableConnectionPoolKey } from './generalStateProse.js';
import { powerStateProse } from './powerStateProse.js';
import { stressorsStateProse } from './stressorsStateProse.js';
import { warFaithStateProse } from './warFaithStateProse.js';
import { deriveAllActiveConditions } from '../../activeConditions.js';
import { deriveCriminalStructure } from '../defenseDisplay.js';
import { deriveFoodBalance, deriveGranaryOutlook } from '../dossierViewModel.js';
import { populationTrendBand } from '../trendLens.js';
import { normalizeStressor } from '../../worldPulse/stressorsCore.js';
import { coupContenders, coupRiskLabel } from '../../rulingPowerCoup.js';
import { structuralLensOf } from '../../spatial/cohesionWeave.js';
import { collectPlotHooks } from '../../dossier/plotHooks.js';
import { deriveEscalationClocks } from '../../hookEscalation.js';
// The two desk readers the screen uses, imported rather than re-derived. See the docblock.
import { generalDeskLines } from '../../../components/new/generalDeskRead.js';
import { economyDeskRead } from '../../../components/new/economyDeskRead.js';
import { FALL_SENTENCE, faithPanelModel } from '../../../components/settlement/faithPanelModel.js';

/**
 * ⭐⭐ THE CHAIR'S PRINT RULING, 2026-09-18, under the owner's "impliment every fix" —
 * RECORDED HERE AND IN `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` BESIDE THE W4 TABLE.
 *
 * Every sentence-rung mount prints, EXCEPT the cells the pools doc marks PRINT-DEFERRED or
 * dm-only-versus-player. The thirty unruled mounts (WRITER-1 ECO/SUP, WRITER-3 FTH/STR/CND/
 * POP, CT-1a/2/3 including DS-GEN-12/13/17) are ruled PARITY. The History (:5704) and
 * Relationships (:5702) PRINT-DEFERRED rows are STALE — both chapters exist — and are ruled
 * PARITY.
 *
 * THE WHOLE POSITIONS THAT DO NOT PRINT, and the doc row each one answers:
 *   power.factionLadder   DS-POW-3 — the rung mirror is a `townMap` read the PDF cannot reach
 *   power.blocs           DS-POW-7 — `politicsLedgers` is world state `liveWorld.js` does not
 *                                    slice, and every bloc cell is dm-only besides
 *   overview.situation    DS-GEN-5 — the printed chapter already opens on the frozen
 *                                    `arrivalScene`; a second approach sentence competes with
 *                                    it on a page that cannot collapse either
 *   overview.steadings    DS-GEN-8 — `SteadingsSection` reads the CAMPAIGN STORE, which no
 *                                    export boundary reaches; deferring is honest and
 *                                    inventing a read is not
 *
 * ⚠ AND ONE DEFERRAL THAT IS THIS LANE'S OWN JUDGMENT, NOT THE CHAIR'S — recorded so it can
 * be vetoed rather than discovered. THE THREE `war.*` POSITIONS DO NOT PRINT. Their reading
 * is not a function of the settlement: `WarTab.jsx:500-524` assembles it from the campaigns
 * store through eight canonical readers plus a `nameFor` closure over the saved settlements.
 * Reproducing that here would be a second derivation of a LIVE reading — the exact fork this
 * file's own design refuses for the economy and general desks — and the export receives a
 * campaign only on a premium canon export. The FAITH half ships, because its whole reading is
 * `faithPanelModel(settlement)`, a pure reader of the record. The cure is the same as for the
 * four mirrored desks above: a `warDeskRead.js` sibling that both WarTab and this file call.
 * @type {ReadonlySet<string>}
 */
const PRINT_DEFERRED_MOUNTS = new Set([
  'power.factionLadder',
  'power.blocs',
  'overview.situation',
  'overview.steadings',
  'war.standing',
  'war.treaties',
  'war.dormantNote',
]);

/**
 * THE CELLS A PRINTING POSITION STILL WITHHOLDS, keyed the only way a render-time filter
 * honestly can: on the PROVENANCE the rung already carries (`{blockId, poolKey, angle}`).
 *
 * ⛔ KEYED ON THE POOL, NEVER ON THE SENTENCE. A filter that matched printed text would be a
 * second spelling of the corpus and would drift from it the first time a variant was
 * re-authored. The rung's provenance is the producer's own answer to "which cell is this",
 * and `legibilityRung` has emitted it since the block weave landed.
 *
 * `angles` absent ⇒ the WHOLE pool is withheld. `angles` present ⇒ only those standpoints,
 * which is how the pools doc marks a cell rather than a pool.
 * @type {ReadonlyArray<{blockId: string, poolKey: string, angles?: ReadonlyArray<string>}>}
 */
const PRINT_DEFERRED_CELLS = Object.freeze([
  // DS-POW-6 — "parity except the seat-rank cells (PRINT-DEFERRED)". Both pools are
  // `dm-only` on every variant and the seat rank an operator has reached is the sharpest
  // covert fact in the cluster; the print chapter carries no audience gate of its own.
  Object.freeze({ blockId: 'DS-POW-6', poolKey: 'capture reached an AGENT of a faction' }),
  Object.freeze({ blockId: 'DS-POW-6', poolKey: 'capture reached a LEADER' }),
  // DS-DEF-4 — "parity for structure; PRINT-DEFERRED for capture rungs at `corrupted` and
  // above". `criminalCapturePoolKey` spells them `capture <state>`.
  Object.freeze({ blockId: 'DS-DEF-4', poolKey: 'capture corrupted' }),
  Object.freeze({ blockId: 'DS-DEF-4', poolKey: 'capture capture' }),
  // DS-DEF-6 — "parity, EXCEPT the blockade bypass cells". Two of the four variants under the
  // blockade pool carry the *(print-deferred)* mark, and they are told apart from their two
  // printing siblings by ANGLE: `[unfolding]` and `[counterforce · dm-only]`.
  Object.freeze({
    blockId: 'DS-DEF-6',
    poolKey: 'Naval Defense: Under blockade',
    angles: Object.freeze(['unfolding', 'counterforce']),
  }),
  // DS-REL-2 — "PARITY for the prominent tie, PRINT-DEFERRED for the emergent banner". The
  // banner is `flagDrivenPoolKey`'s two pools; it is a UI affordance about the generator's
  // behaviour and has no print equivalent worth minting.
  Object.freeze({ blockId: 'DS-REL-2', poolKey: 'flagDriven count > 0' }),
  Object.freeze({ blockId: 'DS-REL-2', poolKey: 'flagDriven count zero' }),
]);

/**
 * One rung as `legibilityRung` builds it and `drawnAtMount` routes it.
 * @typedef {{glance: string, sentence: string|null,
 *   detail: ReadonlyArray<{label: string, value: string}>,
 *   provenance: {blockId?: unknown, poolKey?: unknown, angle?: unknown}|null}} DrawnRung
 */

/**
 * Whether one drawn cell is withheld from print by the ruling above.
 *
 * ⚠ IT TAKES THE PROVENANCE, NOT THE RUNG, and that is the observation ratchet rather than
 * taste: `check-observed-shape-readers.mjs` grounds an ungrounded receiver by its SINGLE-HOME
 * rule, so a `drawn?.provenance` chain over a value this scan cannot resolve is convicted as
 * "a key no writer produces". It is the same false positive `generalDeskRead.js:260-268`
 * records for `prose.history.identity`, and it takes the same cure — the read, not a
 * baseline. The caller destructures once and hands the field over.
 * @param {{blockId?: unknown, poolKey?: unknown, angle?: unknown}|null|undefined} p
 * @returns {boolean}
 */
function cellIsDeferred(p) {
  if (!p) return false;
  return PRINT_DEFERRED_CELLS.some((rule) => {
    if (rule.blockId !== p.blockId || rule.poolKey !== p.poolKey) return false;
    return rule.angles ? rule.angles.includes(String(p.angle || '')) : true;
  });
}

/**
 * The sentence one rung prints at one position, or null.
 *
 * THE REGISTRY STILL RULES FIRST, exactly as it does on screen: `drawnAtMount` strips the
 * sentence from a GLANCE row and answers null for an unmounted position, so flipping a row
 * in `dossierMounts.js` silences the PDF with no edit here. The print ruling is applied
 * AFTER it and only ever subtracts.
 * ⚠ THE PARAMETER IS `object` AND THE NARROWING IS INTERNAL, which is the accurate way round
 * rather than the lax one. THE SIX DESKS DECLARE THEIR RUNGS AS `object|null` — that is their
 * published contract, not a laxity of this file — while `drawnAtMount` declares the full
 * `LegibilityRung` shape on both sides. Spelling this parameter as the rung shape would make
 * all sixty-odd call sites below type-errors against their own desks. So the boundary is
 * crossed ONCE, here, where the registry's own parameter type names what is required; the
 * shape is a runtime fact every desk satisfies through `legibilityRung`.
 * @param {string} mount
 * @param {object|null|undefined} rung
 * @returns {string|null}
 */
function printed(mount, rung) {
  if (PRINT_DEFERRED_MOUNTS.has(mount)) return null;
  const drawn = /** @type {DrawnRung|null} */ (
    drawnAtMount(mount, /** @type {Parameters<typeof drawnAtMount>[1]} */ (rung)));
  if (!drawn) return null;
  // DESTRUCTURED RATHER THAN CHAINED, for the reason recorded on `cellIsDeferred`.
  const { sentence, provenance } = drawn;
  return cellIsDeferred(provenance) ? null : sentence ?? null;
}

/**
 * The world stressor this settlement sits inside, normalized — or null in a world that has
 * not been played. MIRRORS `OverviewTab.jsx:120-134` (`worldStressorFor`) exactly: a world
 * stressor names its settlements in `affectedSettlementIds`, so this is a membership
 * SELECTION and the FIRST match is the one DS-STR-2's two lenses describe.
 * @param {{stressors?: unknown}|null|undefined} worldState
 * @param {unknown} settlementId
 * @returns {object|null}
 */
function worldStressorFor(worldState, settlementId) {
  if (settlementId == null) return null;
  const all = Array.isArray(worldState?.stressors) ? worldState.stressors : [];
  const mine = all.find((s) => {
    const ids = Array.isArray(/** @type {{affectedSettlementIds?: unknown}} */ (s)?.affectedSettlementIds)
      ? /** @type {{affectedSettlementIds: Array<unknown>}} */ (s).affectedSettlementIds
      : [];
    return ids.some((id) => String(id) === String(settlementId));
  });
  return mine ? normalizeStressor(mine) : null;
}

/**
 * The TYPED CAUSE of a patron seat that changed hands, recovered by inverting the producer's
 * own exported map. MIRRORS `FaithTab.jsx:226-240`, including its reason for not reading
 * `config.faithProfile.patronFall.cause` directly: the reader-with-no-writer walker convicts
 * that read, because its observation corpus is deity-free and no observed settlement carries
 * the key. Inverting an exported map adds no observed read at all.
 * @param {unknown} sentence the model's finished patron-fall sentence
 * @returns {string|undefined}
 */
function patronFallCauseOf(sentence) {
  if (typeof sentence !== 'string' || sentence === '') return undefined;
  const found = Object.entries(FALL_SENTENCE).find(([, text]) => text === sentence);
  return found ? found[0] : undefined;
}

/**
 * THE FRAMING CAP — `PlotHooksTab.jsx:52`'s ruling, held here too. DS-HK-1 draws one line per
 * hook category plus one per live escalation clock, so a busy town reaches ten framing
 * sentences; composer order puts the category lines first, so the first three frame the hooks
 * the page actually carries. The PDF has the same problem for the same reason and takes the
 * same answer, rather than printing a page of preamble above the hook list.
 */
const FRAMING_CAP = 3;

/**
 * One woven position.
 * @param {ReadonlyArray<string|null|undefined>} lines
 * @param {{name?: unknown, tier?: unknown}} r
 * @returns {string}
 */
function weave(lines, r) {
  return weaveBlock(lines, {
    settlementName: typeof r.name === 'string' ? r.name : '',
    tierNoun: tierNounFor(r.tier),
  }).paragraph;
}

/**
 * THE PRINT DESK.
 *
 * @param {object|null|undefined} settlement the NORMALIZED settlement the export is about
 * @param {{worldState?: object|null, neighbours?: ReadonlyArray<object>|null,
 *   crossEngagements?: ReadonlyArray<object>|null}} [ctx] `worldState` is the owning campaign's, threaded
 *   only on a premium canon export. Absent, the two world-fed lenses (DS-STR-2's lifecycle
 *   and origin) fall silent, which is a true statement about an unplayed world rather than a
 *   gap — the same answer the screen gives a settlement with no campaign.
 * @returns {Readonly<Record<string, Readonly<Record<string, string>>>>} tab → mount →
 *   paragraph. A tab with nothing to say is ABSENT, and so is a mount: the chapters render
 *   what is there and nothing for what is not (R-DST-K). KEY ORDER IS PAGE ORDER, and the
 *   chapters rely on it — the positions are inserted in the order the screen reads them.
 */
export function buildPrintProse(settlement, ctx = {}) {
  const r = settlement || {};
  if (!settlement) return Object.freeze({});
  const worldState = ctx.worldState || null;
  const seed = String(
    /** @type {{_seed?: unknown, id?: unknown}} */ (r)._seed
    ?? /** @type {{id?: unknown}} */ (r).id ?? '',
  );
  // ⛔ THE AUDIENCE IS THE DM'S, STATED RATHER THAN DEFAULTED. §0e is "DM-truth by default"
  // and a printed dossier is the DM's document — there is no player view to export. The
  // covert cells the pools doc withholds from print are withheld by the ruling above, at the
  // CELL, which is finer than an audience flag and is what the doc actually rules on.
  const opts = { seed, audience: /** @type {'dm'} */ ('dm') };
  // ⛔ AND `publicDossier` IS FALSE, STATED. An export is a PAID artifact by construction —
  // §885.3's free anonymous gallery viewer has no export button — so the desks draw.
  const paid = { publicDossier: false, playerView: false };

  // ── THE GENERAL DESK, through its ONE caller, exactly as seven tabs read it ─────────
  // MIRRORS `OverviewTab.jsx:149` exactly, including the one-or-many read: the record carries
  // `stress` as an array on a multi-crisis town and as a bare object on a single-crisis one.
  const stressField = /** @type {{stress?: unknown}} */ (r).stress;
  const stresses = /** @type {ReadonlyArray<{type?: unknown}|null>} */ (
    (Array.isArray(stressField) ? stressField : stressField ? [stressField] : []).filter(Boolean)
  );
  const general = generalDeskLines(r, {
    ...paid,
    stresses,
    populationTrend: populationTrendBand(/** @type {{populationHistory?: unknown}} */ (r).populationHistory),
    hookCategories: collectPlotHooks(r).map((h) => h && h.category),
    clockIds: deriveEscalationClocks(r).map((c) => c && c.id),
    // ⛔ DS-REL-1'S TWO LISTS ARRIVE OR THEY DO NOT — THIS FILE MAY NOT REACH FOR THEM, and
    // the reason is a MEASURED ratchet red rather than taste. `RelationshipsTab.jsx:73-105`
    // merges `neighbourNetwork`, `interSettlementRelationships` and `crossSettlementConflicts`
    // into the lists it renders; all three are written at SAVE time, so no generated world
    // carries one, and `check-observed-shape-readers.mjs` convicts a reader of all three —
    // measured, three NEW identities against this file on the first run. The scan is right
    // that no generated town carries them and the estate's accepted cure is the one
    // `generalDeskRead.js:223-232` already spells for `lifecycleStatus`: read the field where
    // the read is already accepted and hand it over. `src/components/` is the excluded scope
    // (CR-OSR-SCOPE-1) and RelationshipsTab is that site.
    // ⚠ SO THE SEAM IS OPEN AND NOTHING FEEDS IT YET: `relationships.network` prints nothing
    // today. That is not a loss on any generated settlement — the lists are empty there, so
    // the desk was silent anyway — but it IS a loss on a saved one, and it is recorded rather
    // than carried quietly. THE ONE ACT THAT LIGHTS IT: a `relationshipsDeskRead.js` sibling
    // under `src/components/new/` holding that merge, called by both RelationshipsTab and
    // this builder's caller — the shape `generalDeskRead.js` and `economyDeskRead.js` already
    // have, and the same act the four mirrored desks above are waiting on. Deliberately
    // deferred — documented, not a bug to re-find.
    neighbours: ctx.neighbours || [],
    crossEngagements: ctx.crossEngagements || [],
    // `steadings` / `lifecycleStatus` / `ancientRuin` are the campaign store's and
    // `overview.steadings` is print-deferred by the ruling above, so none is supplied.
  });

  // ── THE ECONOMY DESK, through its ONE caller ────────────────────────────────────────
  // ⚠ `flowDrift` IS NULL AND THAT IS A READING, NOT A GAP. `EconomicsTab.jsx:251-257`
  // projects the live trade-flow drift out of the campaigns store; no export boundary carries
  // it, and DS-ECO-3's flow lens is written for a town whose flow has moved. A town with no
  // live flow draws nothing there on screen either.
  // ⚠ `impairedInstitution` IS NULL for the same class of reason: it is ServicesTab's own
  // impairment SET (`computeChainSets`), assembled beside the chips so the sentence and the
  // chips can never name different houses. Re-deriving it here would be the fork that drifts;
  // DS-SUP-3's catalog lens prints, its impaired-house lens does not.
  const economy = economyDeskRead(r, {
    ...paid,
    foodBalance: deriveFoodBalance(r),
    granaryOutlook: deriveGranaryOutlook(r),
    flowDrift: null,
    impairedInstitution: null,
  });

  // ── THE STRESSOR DESK — mirrors OverviewTab.jsx:179-200 ─────────────────────────────
  const stressor = stressorsStateProse(r, {
    banners: stresses,
    conditions: deriveAllActiveConditions(r),
    worldStressor: worldStressorFor(worldState, /** @type {{id?: unknown}} */ (r).id),
  }, opts);

  // ── THE POWER DESK — mirrors PowerTab.jsx:202-227 ───────────────────────────────────
  // ⛔ `politics` IS NOT SUPPLIED, and the omission is the ruling rather than an oversight:
  // it feeds DS-POW-7's three bloc pools and nothing else, and `power.blocs` is print-
  // deferred. Not calling `politicsBlocsOf` also keeps the 61.9 KB politics kernel out of the
  // export path for a position that would print nothing.
  const contenders = coupContenders(r);
  const power = powerStateProse(r, {
    ...(contenders ? { contenders, riskLabel: coupRiskLabel(contenders) } : {}),
    structuralLens: structuralLensOf(r),
  }, opts);

  // ── THE DEFENSE DESK — mirrors DefenseTab.jsx:119-215 and ViabilityTab.jsx:47-52 ────
  // Eight pure calls, each `(settlement, {seed, audience})`: this desk reaches for its own
  // readings, so the mirror is the call list and nothing else.
  const order = defenseStateProse(r, opts);
  const threat = defenseThreatProse(r, opts);
  const forces = defenseForcesProse(r, opts);
  const posture = defensePostureProse(r, opts);
  const status = defenseMilitaryStatusProse(r, opts);
  const wall = defenseWallRationaleProse(r, opts);
  const supporting = defenseSupportingProse(r, opts);
  const magic = defenseMagicDependencyProse(r, opts);
  const criminal = defenseCriminalProse(r, deriveCriminalStructure(r)?.key || null, opts);

  // ── THE FAITH HALF OF THE WAR & FAITH DESK — mirrors FaithTab.jsx:218-242 ───────────
  // The war half is print-deferred (see PRINT_DEFERRED_MOUNTS), so the war readings are
  // absent and every war rung comes back null — which is exactly what FaithTab itself gets,
  // because that tab holds no worldState either.
  const faithModel = faithPanelModel(r);
  const faith = warFaithStateProse(r, {
    faith: faithModel,
    hasPatron: !!faithModel.hasEmbed,
    patronFallCause: patronFallCauseOf(faithModel.patronFallSentence),
  }, opts);

  // ── THE POSITIONS, IN PAGE ORDER ────────────────────────────────────────────────────
  // ⚠ THREE POSITIONS WEAVE MORE THAN ONE MOUNT, because the SCREEN does: DS-GEN-12/13/17
  // are one paragraph under "The ground and the company it keeps" (OverviewTab.jsx:289-295)
  // and DS-GEN-14/16 are one paragraph in the founding card (HistoryTab.jsx:115-121). A
  // grouped position is keyed on its FIRST mount and the siblings are woven into it, so the
  // printed paragraph is the screen's paragraph and not a re-cut of it.
  /** @type {Record<string, Record<string, string>>} */
  const out = {};
  /**
   * @param {string} tab @param {string} mount
   * @param {ReadonlyArray<string|null|undefined>} lines
   */
  const put = (tab, mount, lines) => {
    const paragraph = weave(lines, r);
    if (!paragraph) return;
    (out[tab] = out[tab] || {})[mount] = paragraph;
  };

  const g = general.overview;
  // ⚠ THE GENERAL DESK HANDS OVER STRINGS, so the cell filter above cannot see a provenance
  // here — the reader consumed it. Only ONE general-desk cell is deferred (DS-REL-2's
  // emergent banner) and it is resolved at its own position below; the other two deferred
  // general positions are whole mounts and are simply never put.
  put('overview', 'overview.ground', g.siteLines);
  put('overview', 'overview.crisisBanners', [printed('overview.crisisBanners', stressor.crisisArity)]);
  put('overview', 'overview.stressorLifecycle', [
    printed('overview.stressorLifecycle', stressor.worldStressorLifecycle),
    printed('overview.stressorLifecycle', stressor.worldStressorOrigin),
  ]);
  put('overview', 'overview.activeConditions', [
    printed('overview.activeConditions', stressor.conditionSeverity),
    printed('overview.activeConditions', stressor.conditionDirection),
    printed('overview.activeConditions', stressor.conditionArchetype),
    printed('overview.activeConditions', stressor.conditionProvenance),
    printed('overview.activeConditions', stressor.conditionDuration),
  ]);
  put('overview', 'overview.origin', g.originLines);
  put('overview', 'overview.conflicts', g.conflictLines);
  put('overview', 'overview.warnings', g.warningLines);
  put('overview', 'overview.populationDirection', [g.populationLine]);
  // ⭐ DS-REL-2: THE PROMINENT TIE PRINTS AND THE EMERGENT BANNER DOES NOT, and the two are
  // told apart WITHOUT reading a printed sentence. `generalStateProse.js:2007-2010` composes
  // the two lenses in a fixed order — the tie first — and drops a lens that did not draw, so
  // the line's identity is its INDEX and the index is only trustworthy when every candidate
  // lens actually drew. The two pool-key functions are the candidates' own producers and are
  // pure, so the count is derivable; when it disagrees with the drawn count a lens was lost
  // to anchoring, the index no longer identifies anything, and the position prints NOTHING
  // rather than risk printing the deferred banner. Conservative by construction: this can
  // only under-print, never leak.
  const tieKey = notableConnectionPoolKey(/** @type {{prominentRelationship?: unknown}} */ (r).prominentRelationship);
  const bannerKey = flagDrivenPoolKey(/** @type {{relationships?: unknown}} */ (r).relationships);
  const candidates = (tieKey ? 1 : 0) + (bannerKey ? 1 : 0);
  put('overview', 'overview.notableConnection',
    tieKey && g.connectionLines.length === candidates ? g.connectionLines.slice(0, 1) : []);

  put('power', 'power.legitimacyBanner', [
    printed('power.legitimacyBanner', power.legitimacyBanner),
    printed('power.legitimacyBanner', power.legitimacyLens),
  ]);
  put('power', 'power.stabilityHeader', [
    printed('power.stabilityHeader', power.stabilityHeader),
    printed('power.stabilityHeader', power.stabilityLens),
  ]);
  put('power', 'power.criminalUnderside', [
    printed('power.criminalUnderside', power.legitimacyReading),
    printed('power.criminalUnderside', power.captureReading),
    printed('power.criminalUnderside', power.operationReading),
  ]);
  put('power', 'power.rulingStructure', [
    printed('power.rulingStructure', power.rulingStructure),
    printed('power.rulingStructure', power.governingTitle),
  ]);
  put('power', 'power.succession', [
    printed('power.succession', power.successionRisk),
    printed('power.succession', power.successionHold),
  ]);

  // ⚠ EVERY LENS IS READ BY NAME rather than through a key list. The desks return frozen
  // records, and a `record[variable]` read is an implicit `any` under the domain's strict
  // typecheck — but the better reason is that the NAMES are the reading order the screen
  // prints in, and a list of strings hides that behind an iteration.
  /**
   * A DM-FIELD PROJECTION, taken only when the registry lets its rung speak — the shape
   * `DefenseTab.jsx:136` uses at the same two positions. The DM's own field is never touched.
   * @param {string} mount @param {{rung?: object|null, beside?: unknown}|null|undefined} lens
   * @returns {string|null}
   */
  const beside = (mount, lens) => (printed(mount, lens?.rung)
    ? /** @type {string|null} */ (lens?.beside ?? null) : null);
  put('defense', 'defense.postureHeader', [
    beside('defense.postureHeader', posture.posture),
    beside('defense.postureHeader', posture.terrain),
    beside('defense.postureHeader', posture.prize),
  ]);
  put('defense', 'defense.publicOrder', [
    beside('defense.publicOrder', order.publicOrder),
    beside('defense.publicOrder', order.firstSurvey),
  ]);
  put('defense', 'defense.threatAssessment', [
    printed('defense.threatAssessment', threat.beasts),
    printed('defense.threatAssessment', threat.invasion),
    printed('defense.threatAssessment', threat.internal),
    printed('defense.threatAssessment', threat.economic),
    printed('defense.threatAssessment', threat.disaster),
  ]);
  put('defense', 'defense.militaryStatus', [
    printed('defense.militaryStatus', status.override),
    printed('defense.militaryStatus', status.viability),
  ]);
  put('defense', 'defense.armedForces', [
    printed('defense.armedForces', forces.fortification),
    printed('defense.armedForces', forces.force),
    printed('defense.armedForces', forces.contracted),
    printed('defense.armedForces', forces.charter),
    printed('defense.armedForces', forces.arcane),
  ]);
  put('defense', 'defense.wallRationale', [printed('defense.wallRationale', wall.rationale)]);
  put('defense', 'defense.criminalStructure', [
    printed('defense.criminalStructure', criminal.structure),
    printed('defense.criminalStructure', criminal.capture),
  ]);
  put('defense', 'defense.supportingCapabilities', [
    printed('defense.supportingCapabilities', supporting.logistics),
    printed('defense.supportingCapabilities', supporting.naval),
  ]);

  put('viability', 'viability.verdict', general.viability.verdictLines);
  put('viability', 'viability.magicDependency', [
    printed('viability.magicDependency', magic.arcaneReliance),
  ]);

  put('economics', 'economics.prosperityHeader', [
    printed('economics.prosperityHeader', economy.prosperityHeader),
  ]);
  put('economics', 'economics.foodSecurity', [
    printed('economics.foodSecurity', economy.foodSecurityRung),
  ]);
  put('economics', 'economics.commercialProfile', [
    printed('economics.commercialProfile', economy.incomeMix),
    printed('economics.commercialProfile', economy.criminalLine),
    printed('economics.commercialProfile', economy.tradeProfile),
  ]);
  put('economics', 'economics.shadowEconomy', [
    printed('economics.shadowEconomy', economy.shadowEconomy),
  ]);
  put('economics', 'economics.tradeFlow', [printed('economics.tradeFlow', economy.tradeFlow)]);
  put('economics', 'economics.exportPosture', [
    printed('economics.exportPosture', economy.exportPosture),
  ]);
  put('economics', 'economics.craftReason', [general.economics.craftReasonLine]);

  put('resources', 'resources.groundAndWorkings', [
    printed('resources.groundAndWorkings', economy.terrainIdentity),
    printed('resources.groundAndWorkings', economy.economicStrengths),
    printed('resources.groundAndWorkings', economy.strategicValue),
    printed('resources.groundAndWorkings', economy.exploitation),
  ]);

  put('services', 'services.catalogStanding', [
    printed('services.catalogStanding', economy.catalogStanding),
    printed('services.catalogStanding', economy.impairedService),
  ]);

  put('daily_life', 'daily_life.standingOfLiving', [
    printed('daily_life.standingOfLiving', economy.prosperityRung),
  ]);

  // DESTRUCTURED RATHER THAN CHAINED — `generalDeskRead.js:260-268` records this exact false
  // positive and this exact cure: `history` has a single home in the corpus, so the scan
  // grounds `general.history` to the settlement's history container and reads these three as
  // keys no writer produces there. They are this reader's own frozen return value.
  const { identityLines, foundedLine, recordLine } = general.history;
  put('history', 'history.identity', identityLines);
  put('history', 'history.founded', [foundedLine, recordLine]);

  put('plot_hooks', 'plot_hooks.framing', general.hooks.framingLines.slice(0, FRAMING_CAP));

  // DS-REL-1 draws an inner PAIR per link (the standing, then the named-people line) plus one
  // line per typed engagement. The screen renders each pair beside its own neighbour card;
  // print has no cards, so the position is one paragraph in the desk's own order.
  put('relationships', 'relationships.network', [
    ...general.relationships.networkLines.flat(),
    ...general.relationships.engagementLines,
  ]);

  put('faith', 'faith.patronSeat', [
    printed('faith.patronSeat', faith.patronRank),
    printed('faith.patronSeat', faith.patronCults),
    printed('faith.patronSeat', faith.devotion),
    printed('faith.patronSeat', faith.pietyArc),
    printed('faith.patronSeat', faith.standings),
    printed('faith.patronSeat', faith.sink),
    printed('faith.patronSeat', faith.mandate),
    printed('faith.patronSeat', faith.faithDark),
  ]);
  put('faith', 'faith.teaser', [printed('faith.teaser', faith.faithTeaser)]);
  put('faith', 'faith.creedStanding', [
    printed('faith.creedStanding', faith.creedStanding),
    printed('faith.creedStanding', faith.creedLegitimacy),
    printed('faith.creedStanding', faith.creedNiche),
    printed('faith.creedStanding', faith.creedFall),
  ]);

  return Object.freeze(Object.fromEntries(
    Object.entries(out).map(([tab, rows]) => [tab, Object.freeze(rows)]),
  ));
}

export default buildPrintProse;
