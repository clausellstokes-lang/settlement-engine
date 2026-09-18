/**
 * StateProse — the PRINT side of the dossier's fifty-one sentence-rung positions.
 *
 * ── WHAT IT IS ───────────────────────────────────────────────────────────────────────
 * The screen renders each mounted position as one woven paragraph through `ProseBlock`.
 * This is that component's twin for the page: one `Callout` per position, in page order,
 * in the print prose slot (`theme.js` `type.prose` — Lora 10.5 / 1.55) and in ITALIC,
 * because every one of the screen's call sites sets `fontStyle:'italic'` and the voice the
 * corpus writes in is the same voice on both surfaces.
 *
 * ── ⛔ IT CARRIES NO DESK, AND THAT IS THE WHOLE POINT ───────────────────────────────
 * The paragraphs arrive already built, as plain strings, on the `stateProse` prop that
 * `utils/generateSettlementPDF.js` computes on the MAIN THREAD and posts to the render
 * worker. `src/pdf/**` therefore never imports `domain/display/stateProse/**`: the corpus
 * leaves (182 kB general, 90 kB economy, and five more) stay out of the worker bundle that
 * is fetched during the export the user is already waiting on, and out of every byte budget
 * `tests/build/vendorPdfLazy.test.js` prices.
 *
 * ── SILENCE IS THE DEFAULT ───────────────────────────────────────────────────────────
 * An absent prop, an absent tab and an absent position all render NOTHING. That is R-DST-K
 * — the corpus being silent about a state must never blank or placeholder the page — and it
 * is why there is no empty-state branch here. A pre-`stateProse` caller (a test that builds
 * `SettlementPDF` by hand, the campaign book, the foundry module) therefore produces exactly
 * the bytes it produced before.
 *
 * ── THE KICKERS ARE THE SCREEN'S OWN SECTION TITLES, IN THE SCREEN'S OWN CASE ────────
 * They live here rather than beside the builder so that `src/pdf` keeps its zero-import
 * distance from the corpus (above).
 *
 * ⚠ AND THE KICKER IS RENDERED HERE RATHER THAN THROUGH `Callout`'s OWN `kicker` SLOT, for
 * one reason: that slot renders through `type.label`, which carries `textTransform:
 * 'uppercase'`. The dossier's kickers became SENTENCE CASE on screen (the typography lane,
 * 2026-09-18) — "The ground and the company it keeps", not "THE GROUND AND THE COMPANY IT
 * KEEPS" — and a page that shouts a heading the screen speaks is the two surfaces
 * disagreeing about the same string. The slot stays correct for every OTHER caller, which
 * passes an already-upper-case label ("THESIS", "VERDICT", "STRATEGIC VALUE") where the
 * transform is a no-op, so `Callout` is left exactly as it is. Everything else about the
 * kicker — family, weight, size, tracking, the tone accent, the 3pt gap — is the slot's own
 * styling, reproduced rather than reinvented. A position with no entry still prints, with no
 * kicker, because a missing label must never swallow a paragraph.
 *
 * @enforced-by tests/pdf/statePrintParity.test.jsx
 */
import { Text } from '@react-pdf/renderer';
import { Callout } from './Callout.jsx';
import { proseToPlainText } from './ProseText.jsx';
import { type, palette, pt } from '../theme.js';

/**
 * Mount id → the heading the SCREEN prints over that position (OverviewTab.jsx:291,
 * HistoryTab.jsx:132, PowerTab.jsx:379/392/403/415, WarFaithDesk.jsx and the tabs' own
 * `Section title=` strings).
 * @type {Readonly<Record<string, string>>}
 */
const KICKER_OF = Object.freeze({
  'overview.ground': 'The ground and the company it keeps',
  'overview.crisisBanners': 'Active crisis',
  'overview.stressorLifecycle': 'The pressure from outside',
  'overview.activeConditions': 'What the town is living through',
  'overview.origin': 'Settlement origin',
  'overview.conflicts': 'Tensions & conflicts',
  'overview.warnings': 'Coherence notes',
  'overview.populationDirection': 'Population',
  'overview.notableConnection': 'Notable connection',
  'power.legitimacyBanner': 'Public legitimacy',
  'power.stabilityHeader': 'Stability',
  'power.criminalUnderside': 'The quieter arithmetic',
  'power.rulingStructure': 'The shape of authority',
  'power.succession': 'Rule and succession',
  'defense.postureHeader': 'Defense posture',
  'defense.publicOrder': 'Public order',
  'defense.threatAssessment': 'Threat assessment',
  'defense.militaryStatus': 'Military status',
  'defense.armedForces': 'Armed forces',
  'defense.wallRationale': 'Fortifications',
  'defense.criminalStructure': 'Criminal architecture',
  'defense.supportingCapabilities': 'Supporting capabilities',
  'viability.verdict': 'Verdict',
  'viability.magicDependency': 'Magic dependency',
  'economics.prosperityHeader': 'Prosperity',
  'economics.foodSecurity': 'Food security',
  'economics.commercialProfile': 'The commercial profile',
  'economics.shadowEconomy': 'Shadow economy',
  'economics.tradeFlow': 'Live trade flow',
  'economics.exportPosture': 'Export posture',
  'economics.craftReason': 'Economic flows',
  'resources.groundAndWorkings': 'The ground and its workings',
  'services.catalogStanding': 'The catalog and its absences',
  'daily_life.standingOfLiving': 'Standing of living',
  'history.identity': 'What the years have made of it',
  'history.founded': 'Founding and record',
  'plot_hooks.framing': 'What this town offers',
  'relationships.network': 'The neighbour network',
  'war.standing': 'War standing',
  'war.treaties': 'Treaties',
  'war.dormantNote': 'At peace',
  'faith.patronSeat': 'The patron seat',
  'faith.teaser': 'Faith',
  'faith.creedStanding': "The creed's standing",
});

/**
 * Every position one chapter carries, in page order.
 *
 * ⚠ THE ORDER IS THE BUILDER'S INSERTION ORDER, not a list held here. `buildPrintProse`
 * inserts each position in the order the screen reads it and the object's string keys keep
 * it; a second ordered list in this file would be a table that drifts from the page.
 *
 * @param {object} props
 * @param {Record<string, Record<string, string>>|null|undefined} [props.stateProse] the
 *   whole tab → mount → paragraph map, as `generateSettlementPDF` built it.
 * @param {string} props.tab the tab key this chapter is the print twin of.
 */
export function StateProse({ stateProse, tab }) {
  const rows = stateProse && typeof stateProse === 'object' ? stateProse[tab] : null;
  if (!rows || typeof rows !== 'object') return null;
  const entries = Object.entries(rows).filter(([, p]) => typeof p === 'string' && p !== '');
  if (entries.length === 0) return null;
  return (
    <>
      {entries.map(([mount, paragraph]) => (
        <Callout key={mount} tone="gold">
          {KICKER_OF[mount] && (
            <Text style={{
              ...type.label, textTransform: 'none', color: palette.gold,
              fontSize: pt['7.5'], marginBottom: 3,
            }}>
              {KICKER_OF[mount]}
            </Text>
          )}
          <Text style={{ ...type.prose, fontStyle: 'italic' }}>
            {proseToPlainText(paragraph)}
          </Text>
        </Callout>
      ))}
    </>
  );
}

export default StateProse;
