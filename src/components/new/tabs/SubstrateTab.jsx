/**
 * SubstrateTab — the Substrate sub-tab (Phase 5 W4e dossier depth). Surfaces OUR
 * 16-variable causal engine read (`deriveCausalState`) as a legible grid: every
 * system variable with its health band + 0–100 score, the systems under pressure
 * called out first.
 *
 * Settlement-only + pure read-model. OUR substrate reads the settlement's OWN
 * activeConditions (siege / outbreak / drawdown are already baked into the
 * scores), so — unlike THEIRS' SubstrateTab — no live campaign `worldState` is
 * threaded in. That keeps this tab a pure read of already-public settlement facts
 * with no leak surface, and it renders honestly for a standalone (non-campaign)
 * settlement too.
 *
 * Dormancy-correct: a settlement whose read-model yields nothing degrades to a
 * short note rather than a fabricated grid.
 */

import InfoPill from '../../primitives/InfoPill.jsx';
import { SECTION_HELP } from '../../../copy/sectionHelp.js';
import { statusCase, tokenCase } from '../labelLadder.js';
import { useMemo } from 'react';
import { causalBandWord, deriveCausalState, variablePolarity } from '../../../domain/causalState.js';
import { activeConditionWords, conditionsSentence } from '../../../domain/display/conditionWords.js';
import { humanizeToken } from '../../../domain/display/humanizeEngineTokens.js';
import { deriveMagicRelianceView, magicRowsGated } from '../../../domain/display/dossierViewModel.js';
import { FS, INK, MUTED, BODY, BORDER, CARD, CARD_HDR, GREEN, AMBER, RED, sans, SP, swatch } from '../../theme.js';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { offersFoodSurplus } from '../../../domain/foodSurplus.js';
import NameColumns from '../../primitives/NameColumns.jsx';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';

// Humanized labels for the 16 SYSTEM_VARIABLES (mirrors causalState.js's internal
// VARIABLE_LABEL, kept here so the display layer owns its own copy).
const VAR_LABEL = {
  food_security: 'Food', // GS-3a (G1 U2, ODQ §934.101): the score reads the food balance and reserves, the chains as a mean (causalState.js :: deriveFoodSecurity); ruling 4's "Food supply chains" retired with the chain sum
  labor_capacity: 'Labor capacity',
  public_legitimacy: 'Public legitimacy',
  ruling_authority: 'Ruling authority',
  faction_power: 'Strength of the powers',
  trade_connectivity: 'Trade connectivity',
  healing_capacity: 'Healing capacity',
  defense_readiness: 'Defense readiness',
  criminal_opportunity: 'Criminal opportunity',
  religious_authority: 'Religious authority',
  housing_pressure: 'Housing pressure',
  infrastructure_condition: 'Infrastructure condition',
  magical_stability: 'Magical stability',
  social_trust: 'Social trust',
  economic_capacity: 'Economic capacity',
  law_order: 'Law & order',
};

// The band vocabulary IS the model's health signal (it drives summary + pressuresOn),
// so colour by band directly — worst (collapsed) → best (surplus).
const BAND_TONE = {
  surplus: GREEN,
  adequate: '#3f7d3f',
  strained: AMBER,
  critical: '#b15a1f',
  collapsed: RED,
};
const BAND_RANK = { collapsed: 0, critical: 1, strained: 2, adequate: 3, surplus: 4 };

// Convert the raw score onto the same higher-is-healthier axis used to compute
// the band. Sorting this ascending therefore keeps the most pressured row first
// inside a shared band without treating high criminal opportunity as healthy.
function healthOrientedScore(row) {
  if (typeof row.score !== 'number' || !Number.isFinite(row.score)) return 100;
  const score = row.score;
  return variablePolarity(row.key) === 'lower_is_better' ? 100 - score : score;
}

/**
 * `band` is the MODEL band (the machine value, kept on data-band so tests and
 * tooling still read one vocabulary); `word` is what a human sees. They differ
 * for the lone lower-is-better variable: criminal_opportunity bands off the
 * INVERTED score, so maximal crime carries band 'collapsed' and this pill used to
 * print "COLLAPSED" beside it, which reads as "the crime is gone". causalBandWord
 * is the function that already existed to fix precisely this, and had no caller.
 */
function BandPill({ variable, band, word: recordWord = null, tone: recordTone = null }) {
  const mobile = useIsMobile();
  const tone = recordTone || BAND_TONE[band] || MUTED;
  const word = recordWord || tokenCase(causalBandWord(variable, band));
  return (
    <span data-band={band} style={{
      display: 'inline-block', minWidth: 66, textAlign: 'center', padding: '1px 7px',
      fontSize: chromeFontSize(FS.pico, mobile), fontWeight: 800,
      color: swatch.white, background: tone,
    }}>{word}</span>
  );
}

/**
 * ⭐ THE FOOD ROW READS THE FOOD RECORD'S OWN WORD (R3-TABS, round three's cut #494 and #1317; the
 * chair's ruling (c): a line that disagrees with another home on the same page reads the home the record
 * bears out). The Food row banded the causal score on the causal ladder and printed "Strained" beside the
 * Overview's "Food Security · Deficit" (a siege, a 68% deficit) and "Adequate" beside "Pressured". The
 * food record's band is the page's one food reading (the Overview, the Crisis tab and this row now print
 * the same word, `economicState.foodSecurity.label`, cased as the Overview cases it, in its colour). The
 * causal band stays on `data-band` and orders the rows; a record without a label keeps the band word.
 * @param {any} settlement
 * @returns {{ word: string, tone: string | null } | null}
 */
function foodRecordWord(settlement) {
  const fs = settlement?.economicState?.foodSecurity;
  const label = typeof fs?.label === 'string' ? fs.label.trim() : '';
  if (!label) return null;
  return { word: statusCase(label), tone: typeof fs.color === 'string' && fs.color ? fs.color : null };
}

/**
 * ⭐ UNDER A SIEGE THE TRADE ROW SAYS SO (R3-TABS, round two's #329 and #858; the chair's ruling of
 * 2026-11-13: the tab does not print a connectivity word the town's own crisis contradicts). The reading
 * (`causalState.js :: deriveTradeConnectivity`) folds a siege in as wartime pressure, so the row read
 * "Adequate" in 29 of 82 siege births at aac79b808 (Surplus in 1) while every one of those crises' own
 * summary says nothing comes in by road. Under a siege in force the row prints the crisis's own label.
 * @param {any} settlement
 * @returns {{ word: string, tone: string } | null}
 */
function siegeCrisisWord(settlement) {
  const stresses = Array.isArray(settlement?.stress) ? settlement.stress : settlement?.stress ? [settlement.stress] : [];
  const siege = stresses.find((x) => x?.type === 'under_siege');
  const label = typeof siege?.label === 'string' ? siege.label.trim() : '';
  return label ? { word: statusCase(label), tone: RED } : null;
}

/**
 * @param {{ settlement: any }} props
 */
export default function SubstrateTab({ settlement }) {
  // THE PHONE PROSE FLOOR — the framing paragraph, the pressures callout and the
  // unassessed note. Bound above the early return so the hook order is stable;
  // the variable labels and their band pills keep their own steps.
  const mobile = useIsMobile();
  const model = useMemo(() => (settlement ? deriveCausalState(settlement) : null), [settlement]);

  const rows = useMemo(() => {
    if (!model?.variables) return [];
    // ONE PREDICATE, ASKED ONCE (lane MAGIC, chair ruling 1, 2026-11-03): the variable list
    // passes the shared magic gate, so "Magical stability" steps aside where magic does not
    // work instead of grading "Adequate" off a base of 50 that never read the switch.
    return magicRowsGated(settlement, Object.entries(model.variables), ([key]) => key)
      .map(([key, v]) => ({
        key,
        label: VAR_LABEL[key] || humanizeToken(key) || 'Recorded condition',
        // FOOD-EXPORTS residue (the chair's ruling, 2026-11-04): the shared band ladder's top rung
        // reads "Food · Surplus", a claim on the food record. Food is graded Surplus only where
        // the record holds one (domain/foodSurplus.js :: offersFoodSurplus); otherwise Adequate.
        band: key === 'food_security' && v.band === 'surplus'
          && !offersFoodSurplus(settlement?.economicState?.foodSecurity?.foodRecord) ? 'adequate' : v.band,
        score: typeof v.score === 'number' ? v.score : (model.scores?.[key] ?? null),
      }))
      // Pressures first: worst band, then worst polarity-oriented score, then
      // stable by label.
      .sort((a, b) =>
        (BAND_RANK[a.band] ?? 5) - (BAND_RANK[b.band] ?? 5)
        || healthOrientedScore(a) - healthOrientedScore(b)
        || a.label.localeCompare(b.label));
  }, [model, settlement]);
  // THE ONE RELIANCE READING (lane MAGIC, chair ruling 2): the same word the Overview and the
  // Magic tab print, from the one derivation; absent where magic does not work.
  const magicReliance = useMemo(() => deriveMagicRelianceView(settlement), [settlement]);
  // THE TRIM (the owner, 2026-11-01, ODQ §934.103; rubric R4): the sentence under the rows
  // names the conditions the reading folds in, and says nothing when there are none
  // (domain/display/conditionWords.js, shared with print).
  const conditionWords = useMemo(() => activeConditionWords(settlement), [settlement]);

  if (!model || rows.length === 0) {
    return (
      <div data-testid="substrate-tab" style={{ padding: 24, color: MUTED, fontFamily: sans, fontSize: proseFontSize(FS.sm, mobile) }}>
        The settlement&apos;s underlying conditions have not been assessed.
      </div>
    );
  }

  return (
    <div data-testid="substrate-tab" style={{ padding: '12px 14px', fontFamily: sans }}>
      {/* ⭐ UX CONSOLIDATION 2026-10-30 (RULINGS-T2 T2-25; RULINGS-CROSS X-12). The page title
          agrees with the tab's new label, "Foundations", and the sub-line keeps the old title's
          words. The framing paragraph is TRIMMED to its one fact (the readings include current
          conditions, which is why a row can disagree with its home page's first-survey reading)
          and the "Under pressure" callout is CUT: it restated the rows sorted worst-first right
          below it (999/1000). The sixteen rows are the engine view and stay (R7). */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <div data-testid="substrate-title" style={{ fontSize: FS.lg, fontWeight: 800, color: INK }}>
          Foundations
        </div>
        <InfoPill text={SECTION_HELP.foundations} />
      </div>
      <div style={{ fontSize: proseFontSize(FS.sm, mobile), fontWeight: 700, color: BODY, marginBottom: 12 }}>
        What is holding, what is strained
      </div>

      {/* The 16-variable grid. */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        <div style={{
          fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 800, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em',
          background: CARD_HDR, padding: `${SP.sm}px ${SP.md}px`, borderBottom: `1px solid ${BORDER}`,
        }}>Settlement foundations</div>
        {/* ⭐ THE FOUNDATIONS RUN IN COLUMNS (owner order 2026-09-19 — "sections like
            these … in two or three columns to conserve space"). Sixteen rows of a
            label and a band word is sixteen lines of page for sixteen readings, and
            the reading is a glance rather than a passage. NameColumns keeps DOM order
            as reading order DOWN each column, so the model's own row order survives.
            Each row keeps its flex box, so the band word still sits at the right edge
            of its column exactly as it sat at the right edge of the page. */}
        <NameColumns count={rows.length} style={{ padding: `0 ${SP.md}px` }}>
          {rows.map(row => {
            const recordRead = row.key === 'food_security' ? foodRecordWord(settlement)
              : row.key === 'trade_connectivity' ? siegeCrisisWord(settlement) : null;
            return (
            <div key={row.key} data-substrate-row style={{
              display: 'flex', alignItems: 'center', gap: SP.sm,
              padding: `${SP.sm}px 0`, borderBottom: `1px solid ${BORDER}`,
            }}>
              <span style={{ flex: 1, fontSize: FS.sm, fontWeight: 600, color: INK }}>{row.label}</span>
              <BandPill variable={row.key} band={row.band} word={recordRead?.word} tone={recordRead?.tone} />
            </div>
            );
          })}
        </NameColumns>
      </div>
      {magicReliance.shown && (
        <p data-testid="substrate-magic-reliance" style={{ fontSize: proseFontSize(FS.sm, mobile), color: BODY, lineHeight: 1.5, margin: '12px 0 0' }}>
          Reliance on magic: {magicReliance.word}
        </p>
      )}
      {/* THE BLOCK LAW (X-16; BUILD-W2-BLOCKLAW U3): the one fact sentence sits UNDER the rows
          it qualifies, never above them. It prints only when there is a condition to name. */}
      {conditionWords.length > 0 && (
        <p data-testid="substrate-conditions-note" style={{ fontSize: proseFontSize(FS.sm, mobile), color: BODY, lineHeight: 1.5, margin: '12px 0 0' }}>
          {conditionsSentence(conditionWords)}
        </p>
      )}
    </div>
  );
}
