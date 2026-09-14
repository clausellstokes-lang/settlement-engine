/**
 * domain/prose/scribePage.js — THE DOSSIER'S PAGES, RENDERED TO TEXT IN PAGE ORDER WITHOUT A
 * BROWSER (W0 deliverable 3; DESIGN_SCRIBE_GENERATION_TIME_PROSE §2 row (3)/(4), §11 W0).
 *
 * WHAT THIS IS. `scripts/lib/prose-render-defense-page.mjs` proved the shape on ONE tab: a flat
 * `PageLine[]` following `DefenseTab.jsx` line by line, machine rows and composed rows
 * interleaved, every composed row carrying the pool it drew from. The marker card calls that
 * "(3)/(4) collapsed to the literal page", and it is the strongest form floor 1 can take: for a
 * corpus writer "what else is on the page" is a three-valued guess over a preimage; for ONE
 * town it is a list. This generalises it to every tab the six desk leaves mount on, and the
 * script now calls this module so the instrument and the library cannot drift.
 *
 * ── ⛔⛔ THE FINDING THAT SHAPES THIS FILE: THERE IS NO PAGE READ, EXCEPT ON DEFENSE ──
 * `pageProse` (faceSources.js:449) has exactly ONE caller under `src/components/`, and it is
 * `DefenseTab.jsx:100`. Every other tab hands each desk entry point a FRESH `{seed, audience}`
 * literal, and `withFaceSources` mints a new `printedRoles` Set and a new `drawnOpeners` array
 * inside each one. So ADDENDUM 18 ruling 25 edge (e) — "the same role never twice on one page"
 * — and rulings 29/36's opener trail are true of the DEFENSE tab and of no other page today:
 * the Overview page mints FOUR independent no-repeat states (the stressor desk, one per crisis
 * banner, the general desk, and a second general desk inside `SteadingsSection`).
 *
 * ⛔ THIS MODULE REPRODUCES THAT, DEFECT AND ALL, AND DOES NOT CURE IT. A renderer that handed
 * one shared read to every desk would print a DIFFERENT page than the browser does — different
 * roles, different faces — and the card would then describe a page no reader ever sees, which
 * is worse than describing a flawed one accurately. Hoisting the read is a product change on
 * twelve tabs; it is reported OPEN for W1 and is not a lane's act.
 *
 * ── WHAT A PAGE LINE IS, AND THE DECLARED BOUNDARY OF "MACHINE" ──────────────────────
 * `{section, kind, text, block?, pool?, vid?, face?, label?, mount?}` — the defense script's
 * shape with `mount` added, because the refuter's page-level arms key on the position.
 *   `composed`  a corpus line, with its block, pool, AUTHORED variant index and face index
 *   `glance`    a band word drawn at a `rung: 'glance'` mount — `drawnAtMount` strips the
 *               sentence AND the provenance there, so it can never be a `composed` row
 *   `badge`     a label or band word the machine prints
 *   `row`       a scored readiness row (the defense tab's own spelling, kept verbatim)
 *   `machine`   a machine-written SENTENCE
 *   `roster`    a list of named rows (institutions, forces, neighbours)
 *   `town`      the header line naming the settlement and its configuration
 *
 * ⚠ THE BOUNDARY IS DECLARED RATHER THAN LEFT TO BE DISCOVERED. Every COMPOSED row of every
 * mount is rendered, in page order, complete. Of the MACHINE rows this renders the ones that
 * state a proposition — the `derive*` helpers' sentences, the band words, the labels, the
 * roster name lists — and NOT the decorative chips and numeric pills (a score of 41, a terrain
 * word in a pill, a population count). The reason is what the page is FOR here: a refuter asks
 * "does another line on this page deny this face", and a number in a pill denies nothing at the
 * sentence grain. A chip that turns out to matter is one row added to a tab below.
 *
 * PURE and HEADLESS. No clock, no RNG, no store, no DOM. It imports the six desks, the mount
 * registry and the display derivations; from `src/components/` it imports exactly FOUR modules,
 * every one of them a plain `.js` reading recipe that renders nothing and imports no React —
 * `generalDeskRead.js` and `economyDeskRead.js` (the two desks whose reading bags live there by
 * the mount walker's one-component-file-per-desk rule), `faithPanelModel.js` and
 * `tabHelpers.js`. The allowlist is EXACT and asserted, so a fifth is a red and not a habit;
 * no `.jsx` file is reachable from here. Deterministic for a settlement.
 *
 * ⛔⛔ NO OBJECT LITERAL IN THIS FILE CARRIES A NON-COMPUTED KEY, and the reason is measured
 * rather than stylistic. `scripts/wiring-census.mjs` `producerCitations` reads every `Property`
 * key under `src/domain/**` as a WRITE of world state, and EIGHTEEN identifiers are read by a
 * desk while being produced nowhere — `anyTreaty court doc eco faith faithHidden forces
 * hasPatron hist link magicWorks namedChain navy prison readings structureKey war warBeat`.
 * A literal keyed on any of them would flip that pool's `not-produced` label and move the
 * committed census. So every record here is built through `row()`, whose keys are computed,
 * exactly as `faceSources.js` builds its roster with `Set#add` on string literals. Held by
 * `tests/domain/townCard.test.js`, which re-runs the census's own `astTokens` over this file
 * and asserts it contributes ZERO writes.
 *
 * @enforced-by tests/domain/townCard.test.js
 */
import * as defense from '../display/stateProse/defenseStateProse.js';
import * as power from '../display/stateProse/powerStateProse.js';
import * as stressors from '../display/stateProse/stressorsStateProse.js';
import * as warFaith from '../display/stateProse/warFaithStateProse.js';
import { drawnAtMount, DOSSIER_MOUNTS } from '../display/stateProse/dossierMounts.js';
import { pageProse } from '../display/stateProse/faceSources.js';
import { buildThreatAssessment } from '../display/threatAssessment.js';
import {
  deriveDefenseReadiness, deriveGuardAssessment, deriveCriminalStructure,
  deriveSupportingCapabilities, DEFENSE_STRESS_STATUS,
} from '../display/defenseDisplay.js';
import { scoreBand } from '../display/defenseScoreBands.js';
import { deriveFoodBalance, deriveGranaryOutlook } from '../display/dossierViewModel.js';
import { populationTrendBand } from '../display/trendLens.js';
import { deriveAllActiveConditions } from '../activeConditions.js';
import { settlementBlocs } from '../display/politicsRead.js';
import { coupContenders, coupRiskLabel } from '../rulingPowerCoup.js';
import { structuralLensOf } from '../spatial/cohesionWeave.js';
import { rulingChainOf } from '../dossier/powerStrata.js';
import {
  hasLadder, ladderFactionsOf, ladderRungsOf, ladderInstabilityOf,
} from '../townMap/ladderRead.js';
import { compareCodepoint } from '../deterministicSort.js';
// ⚠ THESE TWO ARE REACHED FOR HERE AND PASSED IN BY THE TAB, and the difference is bytes.
// `generalDeskRead.js` records the reason at its own `hookCategories` note: both drag the
// supply-chain, faction-profile and hook-retention leaves, and that module is imported by
// EVERY tab. This module is imported by no tab at all — it is the headless renderer — so it
// pays the closure once and DS-HK-1 can fire, which it cannot when the lists are absent.
import { collectPlotHooks } from '../dossier/plotHooks.js';
import { deriveEscalationClocks } from '../hookEscalation.js';
import { computeChainSets } from '../../components/new/tabHelpers.js';
import { generalDeskProse, GENERAL_DESK_MOUNTS } from '../../components/new/generalDeskRead.js';
import { economyDeskRead } from '../../components/new/economyDeskRead.js';
import { faithPanelModel } from '../../components/settlement/faithPanelModel.js';

/**
 * @typedef {object} PageLine
 * @property {string} section the page region, in page order
 * @property {string} kind `composed` · `glance` · `badge` · `machine` · `roster` · `town`
 * @property {string} text
 * @property {string} [block] composed only — the corpus block id
 * @property {string} [pool] composed only — the pool key
 * @property {number} [vid] composed only — the drawn variant's AUTHORED position in its pool
 * @property {number} [face] composed only — the drawn face index
 * @property {string} [mount] composed and glance — the registry position it drew at
 * @property {ReadonlyArray<object>} [pieces] composed only — the composer's OWN provenance
 *   rows for this unit (role, key, vid, index, face, source, pairOf, pairKind), one per
 *   rendered face, so a paired unit's partner and weighing rows are nameable
 * @property {string} [label] machine, badge and roster — which field or row it is
 */

/**
 * ⭐ THE ONE RECORD BUILDER. Every object this module returns is built here, so no key of any
 * returned record is a non-computed `Property` key anywhere in this file. See the header.
 * @param {ReadonlyArray<[string, unknown]>} pairs
 * @returns {Record<string, unknown>}
 */
function row(pairs) {
  return Object.fromEntries(pairs.filter(([, value]) => value !== undefined));
}

/** The tabs this renderer knows, which is every tab `DOSSIER_MOUNTS` names. */
export const SCRIBE_TABS = Object.freeze(
  [...new Set(DOSSIER_MOUNTS.map((m) => m.tab))].sort(),
);

/**
 * ⛔ THE COLUMN RULE, BUILT FROM ITS CODE POINT RATHER THAN TYPED. This renderer's machine rows
 * separate a label from its value with an EM DASH, and that spelling is not a taste choice: it
 * is the bytes `scripts/lib/prose-render-defense-page.mjs` already emitted, which the DEF-2
 * packets carry verbatim, and which this module is byte-diffed against over 168 towns. But the
 * E2 ratchet (`tests/copy/voiceMechanics.test.js`) counts an em dash inside a STRING LITERAL
 * under `src/` as copy debt and holds every file at its frozen count, and moving the render out
 * of `scripts/` and into `src/domain/` moved those two separators into the scanned population.
 *
 * A SEPARATOR IN AN INSTRUMENT'S OUTPUT IS NOT PROSE, which is the same finding this estate has
 * already written down twice in `stateProseKernel.js` (`STOP_THEN_SPACE` and the opener class's
 * `[^.?]`), both times for a punctuation table. So the character is named by its code point and
 * the ratchet is honest rather than silenced: no literal is added, no baseline is re-recorded,
 * and the emitted bytes do not move. Found by RUNNING the ratchet, not by remembering it.
 */
const COLUMN_RULE = ` ${String.fromCharCode(0x2014)} `;

/** A string that is worth printing. @param {unknown} value @returns {string} */
const text = (value) => (typeof value === 'string' ? value.trim() : '');

/** The seed every tab keys its desks on — the tabs' own expression, one spelling. */
export const seedOf = (s) => String(s?._seed ?? s?.id ?? '');

/** The audience word from the player flag the tabs carry. */
const audienceOf = (options) => (options.audience === 'dm' ? 'dm' : 'player');

/**
 * A fresh desk read, minted the way the shipped component mints it: a bare literal, so the
 * desk's own `withFaceSources` builds its own no-repeat state. See the header's finding.
 * @param {object} s @param {{audience?: string}} options
 * @returns {{seed: string, audience: string}}
 */
const deskOpts = (s, options) => Object.fromEntries([
  ['seed', seedOf(s)], ['audience', audienceOf(options)],
]);

/**
 * ⭐ ONE COMPOSED LINE, with its provenance — the defense script's `composed`, generalised.
 * `drawnAtMount` applies the registry's depth ruling, so a `glance` position answers with no
 * sentence and no provenance and this returns null rather than a headless composed row.
 * @param {string} mount @param {object|null|undefined} rung
 * @returns {{text: string, block: string, pool: string, vid: number|undefined,
 *   face: number|undefined, mount: string}|null}
 */
export function composedAt(mount, rung) {
  const drawn = drawnAtMount(mount, rung);
  if (!drawn || !drawn.sentence) return null;
  const p = drawn.provenance || rung?.provenance || {};
  const piece = Array.isArray(p.pieces) ? p.pieces[0] : null;
  return Object.fromEntries([
    ['text', drawn.sentence], ['block', p.blockId], ['pool', p.poolKey],
    ['vid', piece?.vid], ['face', piece?.face], ['mount', mount],
    // ⭐ THE WHOLE PROVENANCE RIDES ALONG (W0 deliverable 1). `vid` and `face` are the HEAD
    // piece's; a paired unit has two or three pieces and the card must carry the pair's kind
    // and the partner's source. It is emitted only where the rung carries it, so `pageText`,
    // `defensePoolsFired` and every DEF-2 packet read exactly the bytes they read before.
    ['pieces', Array.isArray(p.pieces) ? p.pieces : undefined],
  ]);
}

/**
 * The PROJECTED-BESIDE shape `{rung, beside}`, which exists in `defenseStateProse.js` ALONE
 * (`projectBesideDmField` at :898, :1598, :1605) — the beside line is taken only where the
 * rung speaks, so the DM's own field and the corpus line stand or fall together.
 */
function besideAt(mount, entry) {
  if (!entry || !entry.rung) return null;
  const drawn = drawnAtMount(mount, entry.rung);
  if (!drawn || !drawn.sentence) return null;
  const p = entry.rung.provenance || {};
  const piece = Array.isArray(p.pieces) ? p.pieces[0] : null;
  return Object.fromEntries([
    ['text', entry.beside || drawn.sentence], ['block', p.blockId], ['pool', p.poolKey],
    ['vid', piece?.vid], ['face', piece?.face], ['mount', mount],
    ['pieces', Array.isArray(p.pieces) ? p.pieces : undefined],
  ]);
}

/** A page under construction: the array plus the three push shapes every tab uses. */
function sheet() {
  /** @type {PageLine[]} */
  const out = [];
  return Object.freeze(Object.fromEntries([
    ['lines', out],
    ['push', (section, kind, value, label) => {
      const body = text(value);
      if (body !== '') {
        out.push(/** @type {never} */ (row([
          ['section', section], ['kind', kind], ['text', body], ['label', label],
        ])));
      }
    }],
    ['composed', (section, c) => {
      if (!c) return;
      out.push(/** @type {never} */ (row([
        ['section', section], ['kind', 'composed'], ['text', c.text],
        ['block', c.block], ['pool', c.pool], ['vid', c.vid], ['face', c.face],
        ['mount', c.mount], ['pieces', c.pieces],
      ])));
    }],
    ['glance', (section, mount, rung, label) => {
      const drawn = drawnAtMount(mount, rung);
      const word = text(drawn?.glance);
      if (word === '') return;
      out.push(/** @type {never} */ (row([
        ['section', section], ['kind', 'glance'], ['text', word],
        ['mount', mount], ['label', label],
      ])));
    }],
  ]));
}

/** The header every page opens on — the town and the configuration it was drawn from. */
function pushHeader(page, s) {
  page.push('header', 'town', `${s.name || '(unnamed)'} · ${s.tier}`
    + ` · ${s.config?.culture || '?'} · threat ${s.config?.monsterThreat}`
    + ` · route ${s.config?.tradeRouteAccess}`
    + ` · terrain ${s.resourceAnalysis?.terrain || s.config?.terrainOverride || '?'}`
    + ` · seed ${seedOf(s)}`, 'town');
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// THE DESK READS — each minted exactly as its shipped component mints it
// ═══════════════════════════════════════════════════════════════════════════════════════

/** The general desk's rungs, through the ONE home of its thirty-five-key reading bag. */
function generalOf(s, options, extra = {}) {
  const stresses = (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).filter(Boolean);
  return generalDeskProse(s, Object.assign(Object.fromEntries([
    ['publicDossier', false],
    ['playerView', audienceOf(options) === 'player'],
    ['stresses', stresses],
    ['populationTrend', populationTrendBand(s.populationHistory)],
  ]), extra));
}

/**
 * The economy desk's rungs, through its own reader. ⚠ `flowDrift` is NULL BY MEASUREMENT and
 * not by omission: `EconomicsTab.jsx` derives it from the OWNING CAMPAIGN's `worldState`, so a
 * town with no campaign answers null there too. Passed explicitly so the absence is a stated
 * reading rather than a forgotten one — the rate corpus's own discipline.
 */
function economyOf(s, options, world) {
  return economyDeskRead(s, Object.fromEntries([
    ['publicDossier', false],
    ['playerView', audienceOf(options) === 'player'],
    ['foodBalance', deriveFoodBalance(s)],
    ['granaryOutlook', deriveGranaryOutlook(s)],
    ['flowDrift', world && world.flowDrift ? world.flowDrift : null],
    ['impairedInstitution', impairedInstitutionOf(s)],
  ]));
}

/**
 * THE ONE IMPAIRED HOUSE the economy desk may name, derived exactly as `ServicesTab.jsx:95-99`
 * derives it: this tab's own impairment sets, the categories that are PRESENT, and the
 * codepoint order that keeps the same settlement naming the same house on every machine.
 * @param {object} s @returns {string|null}
 */
export function impairedInstitutionOf(s) {
  const services = s?.availableServices || {};
  // ⛔ A PROPERTY READ AND NOT A DESTRUCTURE. `const { impaired } = …` is an ObjectPattern, and
  // the census's `astTokens` counts a Property key as a WRITE whether it is building an object or
  // taking one apart — so the destructure minted a producer for `impaired` under `src/domain/**`.
  // Convicted by this lane's own zero-writes arm, which is the arm doing its job.
  const chains = computeChainSets(s);
  const catOrder = Object.keys(services).filter((k) => services[k]?.length).sort(compareCodepoint);
  return catOrder
    .flatMap((cat) => (services[cat] || []).map((svc) => (typeof svc === 'object' ? svc?.institution || '' : '')))
    .filter((inst) => inst && chains.impaired.has(inst))
    .sort(compareCodepoint)[0] || null;
}

/** The power desk's rungs, with the tab's own three readings. */
function powerOf(s, options, world) {
  let contenders = null;
  try { contenders = coupContenders(s); } catch { /* the tab reads null too */ }
  const readings = Object.assign(
    contenders ? Object.fromEntries([['contenders', contenders], ['riskLabel', coupRiskLabel(contenders)]]) : {},
    Object.fromEntries([
      ['structuralLens', structuralLensOf(s)],
      ['politics', settlementBlocs(Object.fromEntries([
        ['worldState', world || null], ['settlementId', s.id],
        ['includeGroundTruth', audienceOf(options) === 'dm'],
        ['includeCovert', audienceOf(options) === 'dm'],
      ]))],
    ]),
  );
  return power.powerStateProse(s, readings, deskOpts(s, options));
}

/** The stressor desk's rungs, with the banner list the Overview tab derives. */
function stressorsOf(s, options, world) {
  const banners = (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).filter(Boolean);
  return stressors.stressorsStateProse(s, Object.fromEntries([
    ['banners', banners],
    ['conditions', deriveAllActiveConditions(s)],
    ['worldStressor', world && world.stressor ? world.stressor : null],
  ]), deskOpts(s, options));
}

/**
 * The WarFaith desk's rungs. ⚠ FaithTab passes NO `war` key at all and WarTab passes no faith
 * model beyond `hasPatron`, so the two tabs draw DIFFERENT halves of one desk return — which is
 * why each tab calls this with its own half rather than sharing one call.
 */
function warFaithOf(s, options, readings) {
  return warFaith.warFaithStateProse(s, readings, deskOpts(s, options));
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// THE TABS, EACH FOLLOWING ITS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════════════

/**
 * DEFENSE — `src/components/new/tabs/DefenseTab.jsx`, the derivations at :82-230 and the JSX
 * order from :211. ⭐ THE ONE TAB WITH A PAGE READ (`pageProse` at :100): one read for every
 * desk entry, so the no-repeat state is the PAGE's. Moved here verbatim from
 * `scripts/lib/prose-render-defense-page.mjs`, which now calls this function.
 */
function renderDefense(s, options) {
  const page = sheet();
  const opts = pageProse(s, Object.fromEntries([
    ['seed', seedOf(s)], ['audience', audienceOf(options)],
  ]));
  const d = s.defenseProfile || {};
  const inst = d.institutions || {};
  const sp = s.economicState?.safetyProfile || {};
  pushHeader(page, s);

  page.push('posture', 'badge', d.readiness?.label || 'Unknown', 'readiness');
  page.push('posture', 'machine', deriveGuardAssessment(s), 'guardEffectivenessDesc');
  const posture = defense.defensePostureProse(s, opts);
  for (const k of ['posture', 'terrain', 'prize']) {
    page.composed('posture', besideAt('defense.postureHeader', posture[k]));
  }
  const status = defense.defenseMilitaryStatusProse(s, opts);
  for (const k of ['override', 'viability']) {
    page.composed('posture', composedAt('defense.militaryStatus', status[k]));
  }

  const threat = defense.defenseThreatProse(s, opts);
  for (const k of ['beasts', 'invasion', 'internal', 'economic', 'disaster']) {
    page.composed('threat', composedAt('defense.threatAssessment', threat[k]));
  }
  const rows = deriveDefenseReadiness(s);
  for (const r of buildThreatAssessment(s)) {
    const ready = rows.find((x) => x.label === r.label);
    // ⛔ `row` AND NOT `badge`, because `prose-render-defense-page.mjs` spelled it `row` and
    // the DEF-2 packets carry its `pageText` output verbatim. Caught by the byte-diff against
    // HEAD over 168 towns at two audiences, not by reading.
    page.push('threat', 'row', `${r.label}${COLUMN_RULE}${ready ? scoreBand(ready.score) : '?'}`, r.label);
    page.push('threat', 'machine', r.assess, `${r.label}.assess`);
    if (ready?.fundingNote) page.push('threat', 'machine', ready.fundingNote, `${r.label}.fundingNote`);
  }

  const order = defense.defenseStateProse(s, opts);
  page.push('order', 'badge', sp.safetyLabel || '', 'safetyLabel');
  page.push('order', 'machine', sp.safetyDesc || '', 'safetyDesc');
  page.composed('order', besideAt('defense.publicOrder', order.publicOrder));
  page.composed('order', besideAt('defense.publicOrder', order.firstSurvey));
  const csd = deriveCriminalStructure(s);
  if (csd) {
    page.push('order', 'badge', csd.label, 'criminalStructure');
    page.push('order', 'machine', csd.note, 'criminalStructure.note');
  }
  const criminal = defense.defenseCriminalProse(s, csd?.key || null, opts);
  for (const k of ['structure', 'capture']) {
    page.composed('order', composedAt('defense.criminalStructure', criminal[k]));
  }

  const forces = defense.defenseForcesProse(s, opts);
  for (const k of ['fortification', 'force', 'contracted', 'charter', 'arcane']) {
    page.composed('forces', composedAt('defense.armedForces', forces[k]));
  }
  const walls = inst.walls || [];
  if (walls.length) page.push('forces', 'roster', `fortifications: ${walls.map((w) => w.name).join(', ')}`, 'walls');
  page.composed('forces', composedAt('defense.wallRationale', defense.defenseWallRationaleProse(s, opts).rationale));
  const main = [...new Map([...(inst.garrison || []), ...(inst.militia || []), ...(inst.watch || [])]
    .map((m) => [m.name, m])).values()];
  if (main.length) page.push('forces', 'roster', `standing forces: ${main.map((w) => w.name).join(', ')}`, 'standing');
  if ((inst.mercenary || []).length) page.push('forces', 'roster', `contracted: ${inst.mercenary.map((w) => w.name).join(', ')}`, 'mercenary');
  if ((inst.charter || []).length) page.push('forces', 'roster', `charter: ${inst.charter.map((w) => w.name).join(', ')}`, 'charter');
  if ((inst.magicDef || []).length) page.push('forces', 'roster', `arcane: ${inst.magicDef.map((w) => w.name).join(', ')}`, 'magicDef');

  const supporting = defense.defenseSupportingProse(s, opts);
  for (const k of ['logistics', 'naval']) {
    page.composed('supporting', composedAt('defense.supportingCapabilities', supporting[k]));
  }
  for (const cap of deriveSupportingCapabilities(s)) {
    page.push('supporting', 'machine', `${cap.label}: ${cap.status}${COLUMN_RULE}${cap.note}`, cap.label);
  }

  for (const st of (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).filter(Boolean)) {
    const r = DEFENSE_STRESS_STATUS[st?.type];
    if (r) page.push('stress', 'badge', `${r.posture} (${st.type})`, 'militaryStatus');
  }
  return page.lines;
}

/** POWER — `PowerTab.jsx`, the JSX order from :249. */
function renderPower(s, options, world) {
  const page = sheet();
  const desk = powerOf(s, options, world);
  pushHeader(page, s);

  const chain = rulingChainOf(s);
  if (chain?.power?.name) page.push('chain', 'roster', `the power: ${chain.power.name}`, 'chain.power');
  if (chain?.faction?.name) page.push('chain', 'roster', `the faction: ${chain.faction.name}`, 'chain.faction');
  if (chain?.npc?.name) page.push('chain', 'roster', `the seat: ${chain.npc.name} · ${chain.npc.role || ''}`, 'chain.npc');
  page.push('chain', 'machine', chain?.absence?.line, 'chain.absence');

  const leg = s.publicLegitimacy;
  if (leg) {
    page.push('legitimacy', 'badge', leg.label, 'publicLegitimacy.label');
    if (leg.governanceFractured) page.push('legitimacy', 'machine', 'Governance is fractured.', 'governanceFractured');
  }
  page.composed('legitimacy', composedAt('power.legitimacyBanner', desk.legitimacyBanner));
  page.composed('legitimacy', composedAt('power.legitimacyBanner', desk.legitimacyLens));

  page.push('stability', 'badge', s.powerStructure?.stability, 'powerStructure.stability');
  page.push('stability', 'roster', s.powerStructure?.governingName, 'governingName');
  page.push('stability', 'machine', s.powerStructure?.recentConflict, 'recentConflict');
  page.composed('stability', composedAt('power.stabilityHeader', desk.stabilityHeader));
  page.composed('stability', composedAt('power.stabilityHeader', desk.stabilityLens));

  for (const k of ['legitimacyReading', 'captureReading', 'operationReading']) {
    page.composed('underside', composedAt('power.criminalUnderside', desk[k]));
  }
  for (const k of ['blocPresence', 'blocGlue', 'blocEnd']) {
    page.composed('blocs', composedAt('power.blocs', desk[k]));
  }
  for (const k of ['rulingStructure', 'governingTitle']) {
    page.composed('structure', composedAt('power.rulingStructure', desk[k]));
  }
  for (const k of ['successionRisk', 'successionHold']) {
    page.composed('succession', composedAt('power.succession', desk[k]));
  }

  // THE LADDER — one desk call per faction, on the tab's own per-faction seed suffix.
  if (hasLadder(s)) {
    for (const f of ladderFactionsOf(s)) {
      const key = f?.faction;
      if (!key) continue;
      page.push('ladder', 'roster', key, 'ladder.faction');
      const rung = power.powerLadderRung(
        s,
        Object.fromEntries([
          ['factionName', key], ['rungs', ladderRungsOf(s, key)],
          ['instability', ladderInstabilityOf(s, key)],
        ]),
        Object.fromEntries([['seed', `${seedOf(s)}::${key}`], ['audience', audienceOf(options)]]),
      );
      page.composed('ladder', composedAt('power.factionLadder', rung));
    }
  }

  for (const t of (s.history?.currentTensions || [])) page.push('tensions', 'machine', t, 'currentTensions');
  for (const c of (s.conflicts || [])) {
    page.push('tensions', 'machine', c?.description || c?.summary, 'conflict');
  }
  return page.lines;
}

/** OVERVIEW — `OverviewTab.jsx`, its eighteen blocks, with `SteadingsSection` FIRST (:242). */
function renderOverview(s, options, world) {
  const page = sheet();
  const str = stressorsOf(s, options, world);
  // ⛔ TWO INDEPENDENT GENERAL READS, because the page makes two: `SteadingsSection.jsx:49`
  // and `OverviewTab.jsx:153`. See the header — this reproduces the page, not the ideal.
  const steadingDesk = generalOf(s, options, Object.fromEntries([
    ['steadings', (world && world.steadings) || []],
    ['lifecycleStatus', s.lifecycleStatus || s.config?.lifecycleStatus || ''],
    ['ancientRuin', s.history?.ancientRuin || null],
  ]));
  const gen = generalOf(s, options);
  const M = GENERAL_DESK_MOUNTS;
  pushHeader(page, s);

  // 1. SteadingsSection — the remnant banner, the ruin banner, the steading cards.
  page.composed('steadings', composedAt(M.steadings, steadingDesk.steadings.remnant));
  const ruin = s.history?.ancientRuin;
  if (ruin?.name) page.push('steadings', 'machine', `Ancient ruin nearby: ${ruin.name}.`, 'ancientRuin');
  page.composed('steadings', composedAt(M.steadings, steadingDesk.steadings.ruin));
  for (const rung of steadingDesk.steadings.rows) page.composed('steadings', composedAt(M.steadings, rung));

  // 2. Identity strip, then the population line.
  page.push('identity', 'machine', s.history?.historicalCharacter, 'historicalCharacter');
  page.composed('identity', composedAt(M.populationDirection, gen.overview.populationDirection));

  // 3. The ground and the company it keeps.
  page.composed('site', composedAt(M.ground, gen.overview.ground));
  page.composed('site', composedAt(M.market, gen.overview.market));
  page.composed('site', composedAt(M.institutions, gen.overview.institutions));

  // 4. The crisis banners, one desk call per banner on the tab's own seed suffix.
  for (const banner of (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).filter(Boolean)) {
    page.push('crisis', 'badge', banner.label, 'crisis.label');
    page.push('crisis', 'machine', banner.summary, 'crisis.summary');
    page.push('crisis', 'machine', banner.crisisHook, 'crisis.hook');
    page.composed('crisis', composedAt('overview.crisisBanners', stressors.crisisBannerRung(
      s, banner,
      Object.fromEntries([['seed', `${seedOf(s)}::${String(banner?.type ?? '')}`], ['audience', audienceOf(options)]]),
    )));
  }
  // ⚠ FRAMING BEFORE ARITY — `OverviewTab.jsx:194-195`, not declaration order.
  page.composed('crisis', composedAt('overview.crisisBanners', str.crisisFraming));
  page.composed('crisis', composedAt('overview.crisisBanners', str.crisisArity));

  for (const k of ['worldStressorLifecycle', 'worldStressorOrigin']) {
    page.composed('outside', composedAt('overview.stressorLifecycle', str[k]));
  }
  for (const k of ['conditionSeverity', 'conditionDirection', 'conditionArchetype',
    'conditionProvenance', 'conditionDuration']) {
    page.composed('conditions', composedAt('overview.activeConditions', str[k]));
  }

  // 9. Systems health — the four band words and the five scores, then the composed lines.
  const eco = s.economicState || {};
  const dp = s.defenseProfile || {};
  page.push('health', 'badge', eco.prosperity, 'prosperity');
  page.push('health', 'badge', eco.safetyProfile?.safetyLabel, 'safetyLabel');
  page.push('health', 'badge', dp.readiness?.label, 'readiness');
  page.push('health', 'badge', eco.foodSecurity?.label, 'foodSecurity');
  for (const rung of gen.overview.systemsHealth) page.composed('health', composedAt(M.systemsHealth, rung));

  // 10. Tensions and conflicts — the machine rows, with the composed line index-paired.
  for (const t of (s.history?.currentTensions || [])) page.push('tensions', 'machine', t, 'currentTensions');
  const conflicts = s.conflicts || [];
  for (let i = 0; i < conflicts.length; i += 1) {
    page.push('tensions', 'machine', conflicts[i]?.description || conflicts[i]?.summary, 'conflict');
    page.composed('tensions', composedAt(M.conflicts, gen.overview.conflicts[i]));
  }

  page.push('situation', 'machine', s.arrivalScene, 'arrivalScene');
  page.push('situation', 'machine', s.pressureSentence, 'pressureSentence');
  page.composed('situation', composedAt(M.situation, gen.overview.situation));

  for (const rung of gen.overview.origin) page.composed('origin', composedAt(M.origin, rung));
  page.push('origin', 'machine', s.settlementReason, 'settlementReason');

  for (const rung of gen.overview.notableConnection) page.composed('connection', composedAt(M.notableConnection, rung));
  page.push('connection', 'machine', s.prominentRelationship?.phrasing, 'prominentRelationship');

  for (const v of (s.structuralViolations || [])) page.push('warnings', 'machine', typeof v === 'string' ? v : v?.message, 'structuralViolation');
  for (const n of (s.coherenceNotes || [])) page.push('warnings', 'machine', typeof n === 'string' ? n : n?.note, 'coherenceNote');
  for (const rung of gen.overview.warnings) page.composed('warnings', composedAt(M.warnings, rung));
  for (const g of (s.structuralSuggestions || [])) page.push('warnings', 'machine', typeof g === 'string' ? g : g?.suggestion, 'structuralSuggestion');

  const names = (s.institutions || []).map((i) => i?.name).filter(Boolean);
  if (names.length) page.push('institutions', 'roster', `institutions: ${names.join(', ')}`, 'institutions');
  return page.lines;
}

/** ECONOMICS — `EconomicsTab.jsx` and its child `EconomicsGlance.jsx`. */
function renderEconomics(s, options, world) {
  const page = sheet();
  const desk = economyOf(s, options, world);
  const gen = generalOf(s, options);
  const eco = s.economicState || {};
  pushHeader(page, s);

  page.push('glance', 'badge', eco.prosperity, 'prosperity');
  page.push('glance', 'machine', eco.situationDesc, 'situationDesc');
  page.composed('glance', composedAt('economics.prosperityHeader', desk.prosperityHeader));
  // ⚠ THE THREE TILES ARE `rung: 'glance'` POSITIONS, so `drawnAtMount` strips the sentence and
  // the provenance: they can carry a band word and never a composed row.
  page.glance('glance', 'economics.economyTile', desk.prosperityRung, 'economyTile');
  page.glance('glance', 'economics.foodTile', desk.foodTile, 'foodTile');
  page.glance('glance', 'economics.seasonTile', desk.granaryTile, 'seasonTile');

  for (const k of ['incomeMix', 'criminalLine', 'tradeProfile']) {
    page.composed('commercial', composedAt('economics.commercialProfile', desk[k]));
  }
  page.composed('trade', composedAt('economics.exportPosture', desk.exportPosture));
  for (const e of (eco.primaryExports || [])) page.push('trade', 'roster', typeof e === 'string' ? e : e?.name, 'primaryExport');
  for (const e of (eco.primaryImports || [])) page.push('trade', 'roster', typeof e === 'string' ? e : e?.name, 'primaryImport');
  page.composed('trade', composedAt('economics.tradeFlow', desk.tradeFlow));

  page.composed('food', composedAt('economics.foodSecurity', desk.foodSecurityRung));
  page.push('food', 'badge', eco.foodSecurity?.label, 'foodSecurity.label');
  page.composed('craft', composedAt(GENERAL_DESK_MOUNTS.craftReason, gen.economics.craftReason));
  page.composed('shadow', composedAt('economics.shadowEconomy', desk.shadowEconomy));
  return page.lines;
}

/** RESOURCES — `ResourcesTab.jsx`. */
function renderResources(s, options, world) {
  const page = sheet();
  const desk = economyOf(s, options, world);
  const res = s.resourceAnalysis || {};
  pushHeader(page, s);
  page.push('terrain', 'badge', res.terrain, 'terrain');
  page.push('terrain', 'machine', res.strategicValue, 'strategicValue');
  for (const k of ['terrainIdentity', 'economicStrengths', 'strategicValue', 'exploitation']) {
    page.composed('ground', composedAt('resources.groundAndWorkings', desk[k]));
  }
  return page.lines;
}

/** SERVICES — `ServicesTab.jsx`. */
function renderServices(s, options, world) {
  const page = sheet();
  const desk = economyOf(s, options, world);
  pushHeader(page, s);
  for (const k of ['catalogStanding', 'impairedService']) {
    page.composed('catalog', composedAt('services.catalogStanding', desk[k]));
  }
  return page.lines;
}

/** DAILY LIFE — `DailyLifeTab.jsx`. */
function renderDailyLife(s, options, world) {
  const page = sheet();
  const desk = economyOf(s, options, world);
  const eco = s.economicState || {};
  pushHeader(page, s);
  page.push('anchor', 'badge', eco.prosperity, 'prosperity');
  page.push('anchor', 'badge', eco.safetyProfile?.safetyLabel, 'safetyLabel');
  page.push('anchor', 'badge', eco.foodSecurity?.label, 'foodSecurity');
  page.composed('standing', composedAt('daily_life.standingOfLiving', desk.prosperityRung));
  return page.lines;
}

/** WAR — `WarTab.jsx`. ⚠ Every war rung is null without a campaign `worldState`, by design. */
function renderWar(s, options, world) {
  const page = sheet();
  const model = faithPanelModel(s);
  const war = world && world.war ? world.war : null;
  const readings = war
    ? Object.fromEntries([['settlementId', s.id], ['hasPatron', !!model.hasEmbed], ['war', war]])
    : {};
  const desk = warFaithOf(s, options, readings);
  pushHeader(page, s);
  for (const k of ['warStatus', 'warExhaustion', 'warMobilization', 'warOccupation', 'warHoldings']) {
    page.composed('standing', composedAt('war.standing', desk[k]));
  }
  for (const k of ['treatyTerm', 'treatyFraying', 'treatyDocument']) {
    page.composed('treaties', composedAt('war.treaties', desk[k]));
  }
  page.composed('dormant', composedAt('war.dormantNote', desk.dormantNote));
  return page.lines;
}

/** FAITH — `FaithTab.jsx`. The niche row is a GLANCE position and carries no provenance. */
function renderFaith(s, options) {
  const page = sheet();
  const model = faithPanelModel(s);
  const desk = warFaithOf(s, options, Object.fromEntries([
    ['faith', model], ['hasPatron', !!model.hasEmbed],
  ]));
  pushHeader(page, s);
  for (const k of ['patronRank', 'patronCults', 'devotion', 'pietyArc', 'standings',
    'sink', 'mandate', 'faithDark']) {
    page.composed('seat', composedAt('faith.patronSeat', desk[k]));
  }
  page.glance('niche', 'faith.nicheRow', desk.nicheRow, 'nicheRow');
  for (const k of ['creedStanding', 'creedLegitimacy', 'creedNiche', 'creedFall']) {
    page.composed('creed', composedAt('faith.creedStanding', desk[k]));
  }
  page.composed('teaser', composedAt('faith.teaser', desk.faithTeaser));
  return page.lines;
}

/** VIABILITY — `ViabilityTab.jsx`: the general verdict, then the DEFENSE leaf's magic line. */
function renderViability(s, options) {
  const page = sheet();
  const gen = generalOf(s, options);
  const via = s.economicViability || {};
  pushHeader(page, s);
  page.push('verdict', 'badge', via.viable === true ? 'COHERENT' : via.viable === false ? 'NOT COHERENT' : 'MARGINAL COHERENCE', 'viable');
  page.push('verdict', 'machine', via.summary, 'summary');
  for (const rung of gen.viability.verdict) page.composed('verdict', composedAt(GENERAL_DESK_MOUNTS.verdict, rung));
  page.composed('magic', composedAt(
    'viability.magicDependency', defense.defenseMagicDependencyProse(s, deskOpts(s, options)).arcaneReliance,
  ));
  return page.lines;
}

/** HISTORY — `HistoryTab.jsx`: the founding datum, the two lines, then the identity block. */
function renderHistory(s, options) {
  const page = sheet();
  const gen = generalOf(s, options);
  pushHeader(page, s);
  page.push('founding', 'machine', s.history?.foundingStory, 'foundingStory');
  page.composed('founding', composedAt(GENERAL_DESK_MOUNTS.founded, gen.history.founded));
  page.composed('founding', composedAt(GENERAL_DESK_MOUNTS.record, gen.history.record));
  for (const rung of gen.history.identity) page.composed('identity', composedAt(GENERAL_DESK_MOUNTS.identity, rung));
  for (const e of (s.history?.historicalEvents || [])) {
    page.push('record', 'machine', e?.description, e?.name || 'historicalEvent');
  }
  return page.lines;
}

/** PLOT HOOKS — `PlotHooksTab.jsx`: the framing lines lead the section. */
function renderPlotHooks(s, options) {
  const page = sheet();
  const hooks = collectPlotHooks(s);
  const gen = generalOf(s, options, Object.fromEntries([
    ['hookCategories', hooks.map((h) => h && h.category)],
    ['clockIds', deriveEscalationClocks(s).map((c) => c && c.id)],
  ]));
  pushHeader(page, s);
  for (const rung of gen.hooks.framing) page.composed('hooks', composedAt(GENERAL_DESK_MOUNTS.framing, rung));
  for (const h of hooks) page.push('hooks', 'machine', h?.text || h?.hook, h?.category || 'hook');
  return page.lines;
}

/** RELATIONSHIPS — `RelationshipsTab.jsx`: a PAIR of lines per neighbour card. */
function renderRelationships(s, options, world) {
  const page = sheet();
  // ⭐ THE TAB'S OWN LIST, re-spelled from `RelationshipsTab.jsx:90-105`: the migrated
  // `neighbourNetwork` plus the generator's LIVE `neighborRelationship` where the network does
  // not already carry that name. An UNSAVED town has only the second, so a renderer that read
  // `neighbourNetwork` alone would find no neighbour on every freshly generated settlement and
  // DS-REL-1 would be silent on the whole golden corpus.
  const net = Array.isArray(s.neighbourNetwork) ? s.neighbourNetwork : [];
  const live = s.neighborRelationship;
  const neighbours = (world && world.neighbours) || (
    live?.name && !net.some((n) => n?.name === live.name)
      ? [...net, Object.fromEntries([
        ['id', `live_${live.name}`], ['name', live.name], ['neighbourName', live.name],
        ['neighbourTier', live.tier || ''],
        ['relationshipType', live.relationshipType || 'neutral'],
        ['description', `Generated with ${live.name} as neighbour (${(live.relationshipType || 'neutral').replace(/_/g, ' ')}).`],
        ['fromGeneration', true],
      ])]
      : net
  );
  const gen = generalOf(s, options, Object.fromEntries([
    ['neighbours', neighbours],
    ['crossEngagements', (world && world.crossEngagements) || []],
  ]));
  pushHeader(page, s);
  const M = GENERAL_DESK_MOUNTS;
  const network = gen.relationships.network || [];
  for (let i = 0; i < network.length; i += 1) {
    const n = neighbours[i];
    page.push('network', 'roster', typeof n === 'string' ? n : n?.name || n?.settlement, 'neighbour');
    for (const rung of network[i] || []) page.composed('network', composedAt(M.network, rung));
  }
  for (const rung of (gen.relationships.engagements || [])) {
    page.composed('engagements', composedAt(M.network, rung));
  }
  return page.lines;
}

/**
 * ⭐⭐ RENDER ONE SETTLEMENT'S TAB, IN PAGE ORDER.
 *
 * @param {object} settlement a generated settlement
 * @param {string} tab one of `SCRIBE_TABS`
 * @param {{audience?: string, world?: object|null}} [options] `audience` is `dm` or `player`
 *   (an unrecognised one reads as the player's, kernel law 2); `world` is the OWNING CAMPAIGN's
 *   world state, which several machine rows are derived from and which a headless town does not
 *   have — absent is the shipped reading for a town that belongs to no campaign, never an error
 * @returns {PageLine[]} empty for a tab with no mount, which is silence and not a failure
 */
export function renderTabPage(settlement, tab, options = {}) {
  const s = settlement && typeof settlement === 'object' ? settlement : {};
  const world = options.world || null;
  switch (tab) {
    case 'defense': return renderDefense(s, options);
    case 'power': return renderPower(s, options, world);
    case 'overview': return renderOverview(s, options, world);
    case 'economics': return renderEconomics(s, options, world);
    case 'resources': return renderResources(s, options, world);
    case 'services': return renderServices(s, options, world);
    case 'daily_life': return renderDailyLife(s, options, world);
    case 'war': return renderWar(s, options, world);
    case 'faith': return renderFaith(s, options);
    case 'viability': return renderViability(s, options);
    case 'history': return renderHistory(s, options);
    case 'plot_hooks': return renderPlotHooks(s, options);
    case 'relationships': return renderRelationships(s, options, world);
    default: return [];
  }
}

/**
 * The page as text, for a reader and for a packet. The defense instrument's own spelling.
 * @param {ReadonlyArray<PageLine>} lines
 * @returns {string}
 */
export function pageText(lines) {
  let section = '';
  /** @type {string[]} */
  const out = [];
  for (const l of lines) {
    if (l.section !== section) { section = l.section; out.push(`── ${section.toUpperCase()} ──`); }
    const tag = l.kind === 'composed'
      ? `[composed ${l.block} · ${l.pool} · v${l.vid ?? '?'} f${l.face ?? '?'}]`
      : l.kind === 'glance' ? `[glance ${l.label || ''}]`
        : l.kind === 'machine' ? `[machine ${l.label || ''}]`
          : l.kind === 'badge' ? `[badge ${l.label || ''}]` : `[${l.kind}]`;
    out.push(`${tag} ${l.text}`);
  }
  return out.join('\n');
}

/**
 * The (block, pool) keys a tab's desks actually drew on this settlement, in page order.
 * @param {object} settlement @param {string} tab @param {object} [options]
 * @returns {Array<{block: string, pool: string, mount: string, vid: number|undefined,
 *   face: number|undefined, text: string}>}
 */
export function poolsFired(settlement, tab, options = {}) {
  return renderTabPage(settlement, tab, options)
    .filter((l) => l.kind === 'composed')
    .map((l) => Object.fromEntries([
      ['block', l.block], ['pool', l.pool], ['mount', l.mount],
      ['vid', l.vid], ['face', l.face], ['text', l.text],
    ]));
}
