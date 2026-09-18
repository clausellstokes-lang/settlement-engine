/**
 * WarFaithDesk.jsx — THE WAR & FAITH DESK'S ONE CALL SITE, its ONE public-dossier gate,
 * and the seven positions the mount registry routes across two tabs.
 *
 * ── WHY THIS FILE EXISTS, AND IT IS NOT TIDINESS ─────────────────────────────────────
 * `warFaith` is ONE corpus leaf, so it is one `desk` value in every mount row — and the
 * mount walker's ARM 2 admits EXACTLY ONE component file that calls `<desk>StateProse(`:
 *
 *   "Exactly one caller is what keeps the gate auditable: two call sites are two places
 *    to forget, and would also break the one-position reading the registry assumes."
 *
 * The war tab and the faith tab are two tabs. If each called the desk itself there would
 * be two callers and two hand-placed `publicDossier` gates — which is precisely the shape
 * that guard exists to refuse, and precisely how the leak shipped twice before it
 * (economics by hand, then power by hand). So the desk is called HERE, once, behind ONE
 * gate, and both tabs render the components below. That is stricter than the economy and
 * power precedent rather than a workaround for it.
 *
 * ── THE PAID SURFACE (O2GATE, §885.3) ────────────────────────────────────────────────
 * `publicDossier` is `readOnly && !saveId` — a shared gallery dossier with no owning save,
 * i.e. a FREE, ANONYMOUS viewer — and §885.3 rules dossier corpus prose a PAID surface. The
 * gate is the ternary in `warFaithDeskRungs` below: public ⇒ every rung null ⇒
 * `drawnAtMount` answers null at all seven positions ⇒ no corpus sentence renders anywhere
 * on either tab. Every DATUM is untouched: the war block's own lines, the treaty rows, the
 * patron seat, the niche rows and both honest-absence messages never read the desk.
 *
 * ⛔ THE GATE DEFAULTS CLOSED. `publicDossier = true` is the parameter default, so a future
 * caller that forgets the prop draws NOTHING rather than leaking. That is the kernel's own
 * law 2 reasoning one layer up — the restrictive read is the safe one when the caller is
 * wrong.
 *
 * ⛔ AND THE OTHER HALF OF THAT DEFAULT IS UNPROVED, SAID HERE RATHER THAN CLAIMED AWAY.
 * A default-closed gate has two failure directions: it can LEAK (the prop is forgotten and
 * the desk draws for a free viewer) and it can go SILENTLY DARK (the prop is forgotten and
 * a paying reader is shown nothing, which no red anywhere would report). This header used
 * to say "the UI flow tests are what keep the default from being a silent dark: both tabs
 * are proved to SPEAK with the prop passed and to fall silent without it", and named
 * `tests/ui/warTabFlow.test.js` and `tests/ui/faithTabFlow.test.js` as its enforcers.
 * NEITHER FILE HAS EVER EXISTED, and no test in the estate names this component at all —
 * measured, not inferred. `tests/domain/warFaithStateProseDesk.test.js` proves the CORPUS
 * and the pools; it carries no `publicDossier` read. So the leak direction is covered by
 * the registry walker below, and the silent-dark direction is covered by nothing. The
 * claim is withdrawn rather than repointed at a test that does not make it.
 *
 * ── THE ROUTER READ, AND WHY EVERY POSITION HERE IS A REAL DRAW ──────────────────────
 * Every position asks `drawnAtMount(id, rung)` what it may show. THE COMPONENT DOES NOT
 * DECIDE ITS OWN DEPTH — the registry does. Flip `faith.nicheRow` from `glance` to
 * `sentence` in dossierMounts.js and that row starts speaking with no edit here. The
 * walker's reachability arm can only see that each literal appears once under
 * src/components; the honesty of this file is what stands between the registry and a table
 * of citations that cite nothing.
 *
 * @enforced-by tests/lint/dossierMountRegistry.walker.test.js
 * @enforced-by tests/domain/warFaithStateProseDesk.test.js
 */
import { warFaithStateProse } from '../../../domain/display/stateProse/warFaithStateProse.js';
import { drawnAtMount } from '../../../domain/display/stateProse/dossierMounts.js';
import { BODY, BORDER, CARD, FS, MUTED, sans } from '../../theme.js';
import ProseBlock from '../ProseBlock.jsx'; // the shared one-paragraph renderer (see DeskLines)

/** The war tab's three positions. Bound once so the reachability arm counts one literal. */
const STANDING_MOUNT = 'war.standing';
const TREATIES_MOUNT = 'war.treaties';
const DORMANT_MOUNT = 'war.dormantNote';
/** The faith tab's four. `faith.nicheRow` is the leaf's only GLANCE row. */
const PATRON_SEAT_MOUNT = 'faith.patronSeat';
const TEASER_MOUNT = 'faith.teaser';
const CREED_STANDING_MOUNT = 'faith.creedStanding';
const NICHE_ROW_MOUNT = 'faith.nicheRow';

/** Every key `warFaithStateProse` returns, nulled — the public dossier's whole answer. */
const SILENT = Object.freeze({
  warStatus: null, warExhaustion: null, warMobilization: null, warOccupation: null,
  warHoldings: null, treatyTerm: null, treatyFraying: null, treatyDocument: null,
  dormantNote: null, patronRank: null, patronCults: null, devotion: null, pietyArc: null,
  standings: null, sink: null, mandate: null, faithDark: null, faithTeaser: null,
  creedStanding: null, creedLegitimacy: null, creedNiche: null, creedFall: null,
  nicheRow: null,
});

/**
 * THE ONE DESK CALL, and the one gate on it.
 *
 * THE AUDIENCE is the PowerTab and EconomicsTab term exactly (`playerView ? 'player' :
 * 'dm'`). Three warFaith pools are `dm-only` — DS-WAR-1's covert mobilization, DS-WAR-2's
 * strained sovereignty clause and DS-FTH-3's covert congregation — so a desk called without
 * an audience could never reach them and those pools would ship mounted over a lens no
 * world could draw. The default matches the two landed tabs' rather than inventing a third:
 * two tabs disagreeing about who is reading would be the real defect.
 *
 * THE SEED is the settlement's own stable identity, so THE PROMISE holds: same seed + same
 * state ⇒ same sentence, forever.
 *
 * @param {object} args
 * @param {any} args.settlement
 * @param {object} [args.readings] the canonical war / faith readings, as their owners
 *   return them — this desk derives none of them.
 * @param {boolean} [args.publicDossier] DEFAULTS CLOSED; see the docblock.
 * @param {boolean} [args.playerView]
 * @returns {Record<string, any>}
 */
export function warFaithDeskRungs({
  settlement, readings = {}, publicDossier = true, playerView = false,
}) {
  const audience = playerView ? 'player' : 'dm';
  return publicDossier
    ? SILENT
    : warFaithStateProse(settlement, readings, {
      seed: String(settlement?._seed ?? settlement?.id ?? ''), audience,
    });
}

/**
 * One mounted position drawn as prose: every lens the desk built for it, in order, each
 * routed through the registry. Renders NOTHING when the registry says glance, when the
 * corpus was silent, or when the desk was not called — which is R-DST-K, and is why there
 * is no empty-state branch here.
 *
 * The shape is `EconomicsGlance.DeskLines` deliberately: one idiom for "a position that is
 * a paragraph", so a reader who has met one has met both.
 * @param {{mount: string, rungs: ReadonlyArray<object|null>, testId?: string}} props
 */
export function DeskLines({ mount, rungs, testId }) {
  const lines = (rungs || []).map((rung) => drawnAtMount(mount, rung)?.sentence).filter(Boolean);
  if (lines.length === 0) return null;
  // ⭐ ONE PARAGRAPH, THROUGH THE SHARED RENDERER (owner finding 2026-09-18) — the same move
  // as `EconomicsGlance.DeskLines`, in the same shape, because the two renderers are
  // deliberately one idiom. It matters most HERE: `faith.patronSeat` reads EIGHT lenses of
  // DS-FTH-1 at one position, so this file's worst case was an eight-paragraph column about
  // one patron. The mount+position keying is gone with the list — one paragraph needs no
  // keys, and two lenses drawing the same line now simply both appear in it rather than
  // colliding.
  //
  // ⚠ IT WEAVES BUT DOES NOT YET STAND THE NAME DOWN, on the same SCOPE line as its twin:
  // the stand-down needs `settlement.name` and `settlement.tier`, and the five wrappers below
  // are called from WarTab.jsx and FaithTab.jsx, which this lane does not own. Each wrapper
  // takes one `settlement` prop and threads `settlementName`/`tier` through when their owner
  // is free. Deliberately deferred — documented, not a bug to re-find.
  return (
    <div data-testid={testId} style={{ margin: '0 0 12px' }}>
      <ProseBlock lines={lines} style={{
        color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.6,
        margin: '0 0 6px', fontStyle: 'italic',
      }}/>
    </div>
  );
}

/** The war tab's standing paragraph — DS-WAR-1's five lenses at one position. */
export function WarStandingLines({ desk }) {
  return <DeskLines mount={STANDING_MOUNT} testId="war-desk-standing" rungs={[
    desk.warStatus, desk.warExhaustion, desk.warMobilization, desk.warOccupation,
    desk.warHoldings,
  ]} />;
}

/** The war tab's treaty paragraph — DS-WAR-2's clause, fraying and document lenses. */
export function WarTreatyLines({ desk }) {
  return <DeskLines mount={TREATIES_MOUNT} testId="war-desk-treaties" rungs={[
    desk.treatyTerm, desk.treatyFraying, desk.treatyDocument,
  ]} />;
}

/**
 * The war tab's dormant note — the WHOLE PAGE-SET at rest.
 *
 * IT REPLACES the tab's plain empty-state line rather than standing under it. Both say
 * "this settlement is at peace"; printing them an inch apart is the page saying one thing
 * twice, which is the `shadowEconomy` ruling on the economy desk applied here. The plain
 * line remains the standing text for every reader the desk does not draw for — a public
 * dossier, or a town whose faith is not hidden — so nothing is ever lost.
 * @param {{desk: Record<string, any>, fallback: string}} props
 */
export function WarDormantNote({ desk, fallback }) {
  const drawn = drawnAtMount(DORMANT_MOUNT, desk.dormantNote);
  return (
    <div data-testid="war-dormant" style={{
      padding: 24, textAlign: 'center', color: MUTED, fontFamily: sans,
      fontSize: FS.sm, lineHeight: 1.6,
    }}>
      {drawn?.sentence || fallback}
    </div>
  );
}

/** The faith tab's patron-seat paragraph — DS-FTH-1's seven lenses at one position. */
export function FaithSeatLines({ desk }) {
  return <DeskLines mount={PATRON_SEAT_MOUNT} testId="faith-desk-seat" rungs={[
    desk.patronRank, desk.patronCults, desk.devotion, desk.pietyArc, desk.standings,
    desk.sink, desk.mandate, desk.faithDark,
  ]} />;
}

/**
 * The faith tab's creed-standing paragraph — DS-FTH-3's four lenses at one position.
 * Rendered beside the niche rows, which is where the standing and legitimacy words the
 * corpus is talking about already appear.
 */
export function FaithCreedLines({ desk }) {
  return <DeskLines mount={CREED_STANDING_MOUNT} testId="faith-desk-creed" rungs={[
    desk.creedStanding, desk.creedLegitimacy, desk.creedNiche, desk.creedFall,
  ]} />;
}

/**
 * ⭐ THE PATRON-LESS TOWN'S OWN VOICE — DS-FTH-2, and the position that matters most on
 * the corpus the review actually runs against.
 *
 * A settlement with no `config.primaryDeitySnapshot` is the COMMON case, not the edge: the
 * whole 44-settlement review corpus is deity-free today. `faithPanelModel` answers
 * `{ hasEmbed: false }` there and the tab's standing message is "This settlement keeps no
 * named faith." This position draws the corpus's four authored variants for exactly that
 * town — none of which names a creed or a god, because the block was written for it.
 *
 * IT SITS UNDER the standing message rather than replacing it: that message carries a CALL
 * TO ACTION ("Assign a patron deity to awaken its pantheon") which is product furniture and
 * not a fact about the town, so the two are not twins the way the war dormant note and its
 * fallback are.
 */
export function FaithTeaserLines({ desk }) {
  return <DeskLines mount={TEASER_MOUNT} testId="faith-desk-teaser" rungs={[desk.faithTeaser]} />;
}

/**
 * The niche block's GLANCE row — the leaf's one glance position.
 *
 * WHAT A GLANCE ROW RENDERS FROM THE CORPUS IS: NOTHING. `drawnAtMount` strips the sentence
 * AND the provenance for a `glance` row, so this prints the band word the rung carries and
 * no corpus line. That is the point of the rung rather than a limitation of it: the record
 * appears at this position, the page already shows its band, and DS-FTH-3 speaks ONCE — at
 * `faith.creedStanding`, a few inches up. Flip the registry row to `sentence` and this
 * position starts speaking with no edit here.
 * @param {{desk: Record<string, any>}} props
 */
export function FaithNicheGlance({ desk }) {
  const drawn = drawnAtMount(NICHE_ROW_MOUNT, desk.nicheRow);
  if (!drawn?.glance) return null;
  return (
    <div data-testid="faith-desk-niche-glance" style={{
      border: `1px solid ${BORDER}`, background: CARD, padding: '6px 10px', marginBottom: 6,
      color: MUTED, fontFamily: sans, fontSize: FS.pico, fontWeight: 700,
    }}>
      {`The patron's standing · ${drawn.glance}`}
      {drawn.sentence && <span style={{ color: BODY, fontWeight: 400, textTransform: 'none' }}>{`: ${drawn.sentence}`}</span>}
    </div>
  );
}
