/**
 * powerDeskRead.js — THE POWER DESK'S ONE CALLER (STYLE-RULINGS-2 B10(a); lane SW-B7b
 * PROJECTION, the fourth seat), in the `economyDeskRead.js` idiom.
 *
 * WHY A MODULE: `tests/lint/dossierMountRegistry.walker.test.js` ARM 2 admits EXACTLY ONE file
 * that calls `powerStateProse(`, and ARM 3 grades the ladder producer it hands out. The Power
 * tab's reads now have two readers — the tab, and the public prose composer
 * (`publicProseCompose.js`), which draws the owner's player view at the save — so the calls move
 * here, each gated in its own statement, and both readers consume drawn rungs.
 *
 * THE PUBLIC BRANCH. A shared page (`publicDossier`) prints what the owner's player view drew,
 * shipped as text at the owner's save (`publicProse.js`): the desk (`power:desk`), the governance
 * account paragraph (`power:governance`) and the ladder's per-faction lines (`power:ladder`); an
 * absent or stale projection is SILENT, never a seedless re-draw.
 *
 * CAMPAIGN READINGS ARE OWNER-ONLY (the chair's ruling, §7.1 of the lane record): the blocs
 * (DS-POW-7) read the played world's politics ledger, which the save boundary does not hold, so
 * the composer ships no bloc rung and the shared page prints nothing there.
 *
 * @enforced-by tests/lint/dossierMountRegistry.walker.test.js (ARM 2 + ARM 3)
 * @enforced-by tests/components/publicProseEquality.test.jsx (`power:*`)
 */
import { powerStateProse, powerLadderRung } from '../../domain/display/stateProse/powerStateProse.js';
import { tierNounFor } from '../../domain/display/stateProse/weaveBlock.js';
import { publicProseOf } from '../../domain/display/publicProse.js';
import { coupContenders, coupRiskLabel } from '../../domain/rulingPowerCoup.js';
import { structuralLensOf } from '../../domain/spatial/cohesionWeave.js';
import { settlementBlocs as politicsBlocsOf } from '../../domain/display/politicsRead.js';
import { governanceAccountOf, governanceStressTypesOf } from '../../domain/display/governanceAccount.js';
import { resolvePrimaryStress } from '../../generators/stressPriority.js';
import { ladderRungsOf, ladderInstabilityOf, ladderFactionKeyOf } from '../../domain/townMap/ladderRead.js';

/** THE SILENT DESK: every key the desk returns, all null (written out). */
export const SILENT_POWER_DESK = Object.freeze({
  legitimacyBanner: null, legitimacyLens: null, stabilityHeader: null, stabilityLens: null,
  legitimacyReading: null, captureReading: null, operationReading: null,
  successionRisk: null, successionHold: null,
  rulingStructure: null, governingTitle: null, structureFlag: null, gmAdvisory: null,
  blocPresence: null, blocGlue: null, blocEnd: null,
});

/** The bloc rungs: campaign-only, so never shipped (owner-only). */
export const POWER_BLOC_RUNGS = Object.freeze(['blocPresence', 'blocGlue', 'blocEnd']);

/**
 * The shipped desk at `power:desk`, every key the SILENT desk names and nothing else.
 * @param {any} settlement @returns {Readonly<Record<string, any>>}
 */
function publicPowerDesk(settlement) {
  const shipped = publicProseOf(settlement, 'power:desk');
  if (!shipped || typeof shipped !== 'object') return SILENT_POWER_DESK;
  const rungs = /** @type {Record<string, unknown>} */ (shipped);
  return Object.freeze(Object.fromEntries(Object.keys(SILENT_POWER_DESK).map((key) => [key, rungs[key] ?? null])));
}

/**
 * Read the power desk for one settlement, gated.
 * @param {object|null|undefined} settlement
 * @param {{publicDossier?: boolean, playerView?: boolean, readings?: object}} [options]
 *   `readings` is the host's own derivation (`deskHostArgs.js :: powerDeskReadings`).
 * @returns {Readonly<Record<string, any>>}
 */
export function powerDeskRead(settlement, options = {}) {
  if (!settlement) return SILENT_POWER_DESK;
  const s = /** @type {any} */ (settlement);
  // ⛔ THE GATE IS IN THE READ'S OWN STATEMENT (ARM 3). The audience is load-bearing (DS-POW-6's
  // capture pools are all `dm-only`), so it is stated, never defaulted.
  return options.publicDossier ? publicPowerDesk(s) : powerStateProse(s, options.readings ?? {}, {
    seed: String(s._seed ?? s.id ?? ''), audience: options.playerView ? 'player' : 'dm', tierNoun: tierNounFor(s.tier),
  });
}

/**
 * DS-POW-3, one faction's ladder rung, gated. On a shared page, the line the owner's player view
 * drew for that faction (`power:ladder`, a list of `{faction, rung}`), or null.
 *
 * ⛔ AN EMPTY DESK SEED MUST STAY EMPTY THROUGH THE JOIN: `${''}::${faction}` is truthy, so the
 * kernel's seedless line (law 4, canonical-at-zero) would be skipped and the rung drawn by a hash
 * of a bare faction name.
 * @param {any} settlement
 * @param {{publicDossier?: boolean, playerView?: boolean, factionName: string,
 *   rungs: ReadonlyArray<any>, instability: unknown}} options
 * @returns {any}
 */
export function powerLadderRead(settlement, options) {
  const s = /** @type {any} */ (settlement);
  const deskSeed = String(s?._seed ?? s?.id ?? '');
  return options.publicDossier ? publicLadderRung(s, options.factionName) : powerLadderRung(
    s,
    { factionName: options.factionName, rungs: options.rungs, instability: options.instability },
    { seed: deskSeed ? `${deskSeed}::${options.factionName}` : '', audience: options.playerView ? 'player' : 'dm' },
  );
}

/**
 * @param {any} settlement @param {string} factionName @returns {any}
 */
function publicLadderRung(settlement, factionName) {
  const shipped = publicProseOf(settlement, 'power:ladder');
  if (!Array.isArray(shipped)) return null;
  const row = shipped.find((entry) => entry && typeof entry === 'object' && entry.faction === factionName);
  return row?.rung ?? null;
}

/**
 * THE HOST'S READINGS, EXTRACTED (one derivation for the tab and the composer). They live here
 * rather than in `deskHostArgs.js` because that module rides the Overview and Economics chunks,
 * and rulingPowerCoup's 13.9 KB must stay out of them (the zero-slack ceiling): this module is
 * reached only by the Power tab and the lazily loaded composer.
 *
 * The coup contenders and the structural lens are the caller's own derivations, handed to the
 * desk. DS-POW-7's politics is the DISPLAY projection of the played world's ledger: campaign-only,
 * so the composer passes no world and ships no bloc rung (owner-only).
 * @param {any} settlement
 * @param {{playerView?: boolean, worldState?: any, settlementId?: unknown}} [opts]
 * @returns {Record<string, unknown>}
 */
export function powerDeskReadings(settlement, opts = {}) {
  const contenders = coupContenders(settlement);
  return {
    ...(contenders ? { contenders, riskLabel: coupRiskLabel(contenders) } : {}),
    structuralLens: structuralLensOf(settlement),
    politics: politicsBlocsOf({
      worldState: opts.worldState ?? null,
      settlementId: opts.settlementId ?? settlement?.id,
      includeGroundTruth: !opts.playerView,
      includeCovert: !opts.playerView,
    }),
  };
}

/**
 * The governance account paragraph (OWNER-WORDS-DOSSIER item 3), gated: on a shared page, the
 * paragraph the owner's view read off the record, shipped as `power:governance` (`{text}`).
 * @param {any} settlement @param {{publicDossier?: boolean}} [options]
 * @returns {{text?: string}|null}
 */
export function governanceAccountRead(settlement, options = {}) {
  if (!settlement) return null;
  if (options.publicDossier) {
    const shipped = publicProseOf(settlement, 'power:governance');
    return shipped && typeof shipped === 'object' && !Array.isArray(shipped) ? /** @type {{text?: string}} */ (shipped) : null;
  }
  const account = governanceAccountOf(settlement, { primaryStress: resolvePrimaryStress(governanceStressTypesOf(settlement)) });
  return account?.text ? { text: account.text } : null;
}

/**
 * The ladder rows the Power tab renders: each faction with a non-empty ladder, its rungs and
 * its instability (the tab's own loop, extracted).
 * @param {any} settlement @param {ReadonlyArray<any>} factions
 * @returns {Array<{f: any, i: number, rungs: any[], instab: any}>}
 */
export function powerLadderRowsOf(settlement, factions) {
  return (factions || [])
    .map((f, i) => {
      const key = ladderFactionKeyOf(f);
      return { f, i, rungs: ladderRungsOf(settlement, key), instab: ladderInstabilityOf(settlement, key) };
    })
    .filter((row) => row.rungs.length > 0);
}
