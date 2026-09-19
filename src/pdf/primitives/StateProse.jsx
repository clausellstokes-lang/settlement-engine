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
 * ⭐ THE KICKERS, IN TWO MAPS, BECAUSE THERE ARE TWO DIFFERENT FACTS HERE (review 4).
 *
 * The first map is the SCREEN'S OWN HEADING, copied character for character from the string
 * the tab renders directly above that position — a `Section title=` or the inline eyebrow
 * `div`. Those are quoted, not paraphrased: a page that writes "Live trade flow" where the
 * dossier writes "Live Trade Flow" is the two surfaces disagreeing about one label, which is
 * the whole defect this car exists to close one level down.
 *
 * The second map is PRINT-NATIVE, and it exists because most mounted positions have NO
 * heading on screen at all: the `DeskLines` idiom renders a bare italic paragraph inside a
 * card whose surroundings say what it is about. A chapter has no cards, so it must name the
 * position or run three unrelated paragraphs together. These strings are therefore the print
 * surface's own, and they are marked as such so nobody "aligns" them with a screen string
 * that does not exist.
 *
 * ⛔ NO `war.*` ROWS. The three war positions are print-deferred by the chair's ruling (see
 * printProse.js), so the builder emits no `war` tab and a kicker for one would be a label for
 * a paragraph that cannot exist.
 * @type {Readonly<Record<string, string>>}
 */
const SCREEN_KICKER = Object.freeze({
  // OverviewTab.jsx — the inline eyebrows and its own Section titles
  'overview.ground': 'The ground and the company it keeps',
  'overview.stressorLifecycle': 'The pressure from outside',
  'overview.activeConditions': 'What the town is living through',
  'overview.origin': 'Settlement Origin',
  'overview.conflicts': 'Tensions & Conflicts',
  'overview.warnings': 'Coherence Notes · First Survey',
  // PowerTab.jsx
  'power.legitimacyBanner': 'Public Legitimacy',
  'power.stabilityHeader': 'Stability',
  'power.criminalUnderside': 'The quieter arithmetic',
  'power.rulingStructure': 'The shape of authority',
  'power.succession': 'Rule and succession',
  // DefenseTab.jsx
  'defense.postureHeader': 'Guard Assessment',
  'defense.threatAssessment': 'Threat Assessment',
  'defense.militaryStatus': 'Military Status',
  'defense.wallRationale': 'Fortifications',
  'defense.criminalStructure': 'Criminal Architecture & Public Order',
  'defense.supportingCapabilities': 'Supporting Capabilities',
  // EconomicsTab.jsx
  'economics.foodSecurity': 'Food Security',
  'economics.tradeFlow': 'Live Trade Flow',
  // HistoryTab.jsx / PlotHooksTab.jsx
  'history.identity': 'What the years have made of it',
  'plot_hooks.framing': 'Plot hooks',
});

/**
 * The positions the screen gives no heading — print's own labels. See the note above.
 * @type {Readonly<Record<string, string>>}
 */
const PRINT_KICKER = Object.freeze({
  'overview.crisisBanners': 'The crisis on the books',
  'overview.populationDirection': 'Which way the roll is going',
  'overview.notableConnection': 'The tie the town names first',
  'defense.publicOrder': 'Public order',
  'defense.armedForces': 'What the town can field',
  'viability.verdict': 'The verdict, in the town\'s own voice',
  'viability.magicDependency': 'What the arcane holds up',
  'economics.prosperityHeader': 'How the town is doing',
  'economics.commercialProfile': 'The commercial profile',
  'economics.shadowEconomy': 'The unrecorded share',
  'economics.exportPosture': 'What goes out',
  'economics.craftReason': 'Why the craft is here',
  'resources.groundAndWorkings': 'The ground and its workings',
  'services.catalogStanding': 'The catalogue and its absences',
  'daily_life.standingOfLiving': 'The standing of living',
  'history.founded': 'How it began, and what the record carries',
  'relationships.network': 'The neighbours it keeps',
  'faith.patronSeat': 'The patron seat',
  'faith.teaser': 'What the town keeps faith with',
  'faith.creedStanding': 'The creed\'s standing',
});

/** The label over one position, from whichever map owns it. */
const kickerOf = (mount) => SCREEN_KICKER[mount] || PRINT_KICKER[mount];

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
          {/* `type.label_plain`, not `type.label` + `textTransform:'none'`. The hand-rolled
              override turned the CAPITALS off and left the 0.2 TRACKING on, so every kicker
              printed sentence case at a spacing cut for capitals — the precise error the
              shared style exists to make unwritable. */}
          {kickerOf(mount) && (
            <Text style={{
              ...type.label_plain, color: palette.gold,
              fontSize: pt['7.5'], marginBottom: 3,
            }}>
              {kickerOf(mount)}
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
