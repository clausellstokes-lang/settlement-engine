/**
 * pricing/PricingBands.jsx — W-DOC: the five-band pricing page's new band
 * components (brief §3), split out of PricingPage.jsx for the 600-line ceiling.
 * Statically imported by the lazy PricingPage chunk — same chunk, zero eager.
 *
 *   - SurveyorBand        — band 2's walled violet AI lane (ruling #3)
 *   - FounderCharterBand  — the charter object (live meter + arithmetic +
 *                           sustainability, config-derived)
 *   - TaskMenu            — band 3's named tasks · flat credits · ≈$ anchor
 *   - ComparisonTable     — band 4, THE ENTITLEMENT LADDER rendered
 *   - PricingFaq          — band 5, objection-first, config-interpolated
 *
 * Copy: the lazy pricingPage namespace (copy/pricingPage.js tp()) + the legacy
 * pricing.* keys where the old cards already own them. Numbers: config only.
 */

import { getActiveAiCosts, TIERS } from '../../config/pricing.js';
import { resolveLiveStandardCost } from '../../config/livePricing.js';
import {
  getCreditAnchor, approxDollarsForCredits, SURVEYOR_SURFACE, } from '../../config/pricingDisplay.js';
import { ENTITLEMENT_LADDER, RETENTION_MONTHS } from '../../config/entitlementLadder.js';
import { FREE_SAVE_LIMIT } from '../../config/tierFacts.js';
import { FOUNDER_SEAT_CAP } from '../../lib/founderSeats.js';
import { purchasesOpen } from '../../lib/launchGate.js';
import { tp } from '../../copy/pricingPage.js';
import {
  GOLD, GOLD_DEEP, INK, BORDER, sans, serif_, SP, FS, BODY, SLATE, SLATE_BG, SLATE_DEEP, PROSE_MAX } from '../theme.js';
import { space } from '../../design/tokens.js';
// ⭐ THE ESTATE'S FLOORS ON THE PAGE THAT ASKS FOR MONEY (ODQ §934.63 F9, under §934.24
// item 4). Every band below binds `mobile` with useIsMobile() at the top of its own
// component — a band is its own component, so one binding per band is the only shape
// that keeps the flag in scope at every site. Desktop is untouched: both helpers are the
// identity above the breakpoint (tests/components/publicChromeFloor.census.test.js).
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';
import FounderBadge from '../primitives/FounderBadge.jsx';
import Button from '../primitives/Button.jsx';
import AvailableAtLaunchPill from '../primitives/AvailableAtLaunchPill.jsx';

const SECTION_GAP = space['space-8']; // 48 — between major page regions (PricingPage's rhythm)
const TIER_ROW_MAX = 3 * 320 + 2 * 16; // 992 — the page's shared column edge

// ── W-DOC band components (brief §3) ─────────────────────────────────────────
// The violet AI channel (the §03-landing/faith-chip token family). Surveyor is
// WALLED (ruling #3): a visually distinct violet band at the row's end, never
// the badge, never a lookalike subscription — task-priced + BYOK, early access.
const SURVEYOR_SLATE = SLATE;
const SURVEYOR_SLATE_BG = SLATE_BG;
const SURVEYOR_SLATE_TEXT = SLATE_DEEP;

export function SurveyorBand({ onSeeMenu }) {
  const mobile = useIsMobile();
  return (
    <article
      aria-labelledby="tier-surveyor-name"
      style={{
        flex: '1 1 240px', minWidth: 240, maxWidth: 320,
        background: SURVEYOR_SLATE_BG,
        border: `1px solid ${SURVEYOR_SLATE}`,
        padding: `${SP.md}px ${SP.lg}px ${SP.lg}px`,
        display: 'flex', flexDirection: 'column', gap: SP.md,
      }}
    >
      <header style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, flexWrap: 'wrap' }}>
        <h3 id="tier-surveyor-name" style={{ margin: 0, fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: BODY }}>
          {tp('band2.surveyor.name')}
        </h3>
        <span style={{
          fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
          color: SURVEYOR_SLATE_TEXT,
        }}>
          {tp('band2.surveyor.badge')}
        </span>
      </header>
      <p style={{ margin: 0, fontSize: FS.lg, fontWeight: 700, color: INK, fontFamily: sans, lineHeight: 1.4 }}>
        {tp('band2.surveyor.lead')}
      </p>
      {/* The card stretches to the tallest card in the tier row. Its prose reads
          straight down, and the spare height sits above the CTA, as it does on the
          sibling cards, so the CTA stays level with theirs (owner orders 2026-09-17:
          the body paragraph used to grow and left a dead gap mid-card). */}
      <p style={{ margin: 0, fontSize: proseFontSize(FS.sm, mobile), color: BODY, fontFamily: sans, lineHeight: 1.55 }}>
        {tp('band2.surveyor.body')}
      </p>
      <p style={{ margin: 0, fontSize: proseFontSize(FS.sm, mobile), color: BODY, fontFamily: sans, lineHeight: 1.55 }}>
        {tp('band2.surveyor.byok')}
      </p>
      <Button type="button" variant="secondary" size="lg" fullWidth style={{ minHeight: 44, marginTop: 'auto' }} onClick={onSeeMenu}>
        {tp('band2.surveyor.menuLink')}
      </Button>
    </article>
  );
}

// The Founder charter — a different KIND of object (ruling #3): a full-width
// band in the document register (rules + whitespace, organic-craft law), never
// a fourth lookalike column. The sustainability sentence derives from config;
// the live meter reuses the founder_seats RPC machinery.
//
// ⛔ THIS BAND SELLS NOTHING (DESIGN_FOUNDERS_HALL §1/§5, ODQ §118). The price
// pair and the break-even arithmetic are DELETED — an arithmetic sentence prices
// a chair, and a chair is given rather than sold. `isPrimaryCta` survives as a
// prop but can no longer elect this band: PricingPage only ever hands it a
// `navigate` cta, and the loud-primary selector requires kind === 'purchase'.
// The meter counts chairs HELD, in the Hall's own vocabulary.
//
// MB-4 — THE THREE DEAD PURCHASE-KIND READS ARE GONE. `disabled`, the `isConfigured` import, and
// the `variant` ternary all keyed off `cta.kind === 'purchase'`, which DOM-3 made unreachable
// here (PricingPage's own comment: NEVER kind:'purchase'). ⚠ The variant was removed as a WHOLE
// dead conditional, not by deleting the named arm: `isPrimaryCta && cta.kind === 'purchase'` is
// always false, so the rendered variant is always 'secondary'. Deleting only the purchase arm
// would have left `isPrimaryCta ? 'primary' : 'secondary'` and let the prop newly elect a band
// the comment above says it can no longer elect — a behaviour change wearing a cleanup's name.
// The prop is still ACCEPTED (callers pass it) and is now explicitly unread.
export function FounderCharterBand({ founderSeatsRemaining, cta, isPrimaryCta: _isPrimaryCta }) {
  const mobile = useIsMobile();
  const seats = FOUNDER_SEAT_CAP;
  return (
    <section
      aria-labelledby="founder-charter-name"
      style={{
        maxWidth: TIER_ROW_MAX, margin: `0 auto ${SECTION_GAP}px`,
        borderTop: `2px solid ${GOLD}`, borderBottom: `1px solid ${BORDER}`,
        padding: `${SP.xl}px ${SP.lg}px`,
        display: 'flex', flexWrap: 'wrap', gap: SP.xl, alignItems: 'flex-start',
      }}
    >
      <div style={{ flex: '2 1 380px', minWidth: 300 }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.sm }}>
          <h3 id="founder-charter-name" style={{ margin: 0, fontFamily: serif_, fontSize: FS.xxl, fontWeight: 600, color: INK }}>
            {tp('band2.charter.name')}
          </h3>
          <FounderBadge force size="sm" />
        </header>
        <p style={{ margin: `0 0 ${SP.sm}px`, fontSize: FS.lg, fontWeight: 700, color: INK, fontFamily: sans, lineHeight: 1.4 }}>
          {tp('band2.charter.lead', { seats })}
        </p>
        <p style={{ margin: `0 0 ${SP.xs}px`, fontSize: proseFontSize(FS.sm, mobile), color: BODY, fontFamily: sans, lineHeight: 1.55 }}>
          {tp('band2.charter.sustainability', { seats })}
        </p>
        <p style={{ margin: 0, fontSize: proseFontSize(FS.sm, mobile), color: BODY, fontFamily: sans, fontWeight: 600, lineHeight: 1.55 }}>
          {tp('band2.charter.capNote', { seats })}
          {' '}
          {typeof TIERS.founder.oneTimeCredits === 'number' && tp('band2.charter.credits', { credits: TIERS.founder.oneTimeCredits })}
        </p>
      </div>
      <div style={{ flex: '1 1 240px', minWidth: 240, display: 'flex', flexDirection: 'column', gap: SP.sm }}>
        <p style={{ margin: 0, fontSize: proseFontSize(FS.xs, mobile), color: BODY, fontFamily: sans, fontWeight: 600 }}>
          {typeof founderSeatsRemaining === 'number'
            ? tp('band2.charter.chairsHeld', { held: seats - founderSeatsRemaining, seats })
            : tp('band2.charter.chairsFallback', { seats })}
        </p>
        {typeof founderSeatsRemaining === 'number' && (
          <div aria-hidden="true" style={{ height: 4, overflow: 'hidden', background: BORDER }}>
            <div style={{
              height: '100%', background: GOLD,
              width: `${Math.min(100, Math.max(0, ((seats - founderSeatsRemaining) / seats) * 100))}%`,
            }} />
          </div>
        )}
        <Button
          type="button"
          onClick={cta.onCta}
          variant="secondary"
          size="lg"
          fullWidth
          style={{ minHeight: 44 }}
        >
          {cta.label}
        </Button>
      </div>
    </section>
  );
}

// Band 3's task menu: named tasks · flat credits · ≈-dollar anchor. Rows derive
// from SURVEYOR_SURFACE.taskCosts (PROVISIONAL, owner-queued) + the active
// narrative schedule; the ≈$ derives from the starter-pack anchor. A geometric
// instrument (a real table), quiet and fully accessible (craft-law split).
export function TaskMenu({ livePricing = null }) {
  const mobile = useIsMobile();
  const anchor = getCreditAnchor();
  const narrativeCosts = Object.fromEntries(
    Object.keys(getActiveAiCosts()).map((feature) => [
      feature,
      resolveLiveStandardCost(feature, livePricing),
    ]),
  );
  const rows = [
    ...Object.entries(SURVEYOR_SURFACE.taskCosts),
    ...Object.entries(narrativeCosts),
  ];
  const taskNames = tp('band3.taskMenu.tasks') || {};
  const workedRows = (tp('band3.taskMenu.worked') || []).map((w) => {
    const credits = w.tasks.reduce((sum, [key, n]) => {
      const cost = SURVEYOR_SURFACE.taskCosts[key] ?? narrativeCosts[key] ?? 0;
      return sum + cost * n;
    }, 0);
    const detail = w.tasks
      .map(([key, n]) => `${taskNames[key] || key} ×${n}`)
      .join(' + ');
    return { persona: w.persona, detail, credits, approx: approxDollarsForCredits(credits) };
  });
  return (
    <div id="task-menu" style={{ maxWidth: PROSE_MAX, margin: `${SP.xl}px auto 0` }}>
      <h3 style={{ margin: `0 0 ${SP.xs}px`, fontFamily: serif_, fontSize: FS.xl, color: INK }}>
        {tp('band3.taskMenu.heading')}
      </h3>
      <p style={{ margin: `0 0 ${SP.md}px`, fontSize: proseFontSize(FS.sm, mobile), color: BODY, lineHeight: 1.55 }}>
        {tp('band3.taskMenu.intro')}
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: sans, fontSize: FS.sm }}>
        <tbody>
          {rows.map(([key, credits]) => (
            <tr key={key} style={{ borderBottom: `1px solid ${BORDER}` }}>
              <td style={{ padding: '8px 8px 8px 0', color: INK, fontWeight: 600 }}>{taskNames[key] || key}</td>
              <td style={{ padding: '8px 0', textAlign: 'right', color: BODY, whiteSpace: 'nowrap' }}>
                {tp('band3.taskMenu.perTask', { credits, approx: approxDollarsForCredits(credits) })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {anchor && (
        <p style={{ margin: `${SP.md}px 0 0`, fontSize: proseFontSize(FS.sm, mobile), color: BODY, lineHeight: 1.55 }}>
          {tp('band3.taskMenu.anchor', { perCredit: anchor.perCreditLabel })}
        </p>
      )}
      <h4 style={{ margin: `${SP.lg}px 0 ${SP.xs}px`, fontFamily: serif_, fontSize: FS.lg, color: INK }}>
        {tp('band3.taskMenu.workedHeading')}
      </h4>
      {workedRows.map((w) => (
        <p key={w.persona} style={{ margin: `0 0 ${SP.xs}px`, fontSize: proseFontSize(FS.sm, mobile), color: BODY, lineHeight: 1.55 }}>
          {tp('band3.taskMenu.workedLine', { persona: w.persona, detail: w.detail, credits: w.credits, approx: w.approx })}
        </p>
      ))}
      <p style={{ margin: `${SP.md}px 0 0`, fontSize: proseFontSize(FS.xs, mobile), color: BODY, fontStyle: 'italic', lineHeight: 1.5 }}>
        {tp('band3.taskMenu.estimate')}
      </p>
      <p style={{ margin: `${SP.sm}px 0 0`, fontSize: FS.sm, color: INK, fontWeight: 700, lineHeight: 1.5 }}>
        {tp('band3.taskMenu.failurePolicy')}
      </p>
    </div>
  );
}

// Band 4: the comparison table from THE ENTITLEMENT LADDER (the owner's
// 2026-07-17 ruling as config). Cells render the config vocabulary verbatim;
// grouped area headers; a plain accessible table inside an overflow container.
/**
 * ⛔ WHAT READS AS MONEY IN A LADDER CELL — the SAME detector
 * tests/components/lockedPriceSlots.census.test.js applies to the tier-card slots, written
 * once here so the render and the census cannot come to disagree about which cells are
 * priced. A currency mark, not a bare digit: a ladder cell legitimately says "3 saves" and
 * "1 sample per settlement", and neither is an offer.
 */
const CELL_QUOTES_MONEY = /[$£€]/;

export function ComparisonTable() {
  const mobile = useIsMobile();
  const purchasesAreOpen = purchasesOpen();
  const areas = tp('band4.areas') || {};
  const rowLabels = tp('band4.rows') || {};
  const cell = (v) => (v === true ? tp('band4.included') : v === false ? tp('band4.notIncluded') : String(v));
  /**
   * ⭐ NO PRICE PRINTS UNRESOLVED WHILE PURCHASES ARE LOCKED (ODQ §934.63 F16, under the
   * §934.24 addendum). Every other `$` on this page sits beside the lock mark; the ladder's
   * one priced cell ("$2.99 per settlement", ENTITLEMENT_LADDER `export-bundle`.free) did
   * not, because the lock had been read as a rule about CONTROLS and this cell is not a
   * control. It is still a figure a reader is asked to believe resolves today. Derived from
   * the cell's own text rather than from the row id, so a second priced cell arrives already
   * marked.
   * @param {string} text the cell's rendered words
   */
  const lockedCell = (text) => !purchasesAreOpen && CELL_QUOTES_MONEY.test(text);
  return (
    <section aria-labelledby="comparison-heading" style={{ maxWidth: TIER_ROW_MAX, margin: `0 auto ${SECTION_GAP}px` }}>
      <h2 id="comparison-heading" style={{ margin: `0 0 ${SP.xs}px`, fontFamily: serif_, fontSize: FS.xxl, color: INK, textAlign: 'center' }}>
        {tp('band4.heading')}
      </h2>
      <p style={{ margin: `0 0 ${SP.lg}px`, textAlign: 'center', fontSize: proseFontSize(FS.sm, mobile), color: BODY, fontStyle: 'italic' }}>
        {tp('band4.engineNote')}
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: sans, fontSize: FS.sm }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${GOLD}` }}>
              <th scope="col" style={{ textAlign: 'left', padding: '8px 8px 8px 0', color: INK }}>{tp('band4.columns.feature')}</th>
              <th scope="col" style={{ textAlign: 'right', padding: '8px 0', color: INK }}>{tp('band4.columns.free')}</th>
              <th scope="col" style={{ textAlign: 'right', padding: '8px 0 8px 24px', color: INK }}>{tp('band4.columns.cartographer')}</th>
            </tr>
          </thead>
          {ENTITLEMENT_LADDER.map((group) => (
            <tbody key={group.area}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={3}
                  style={{
                    textAlign: 'left', padding: `${SP.md}px 0 ${SP.xs}px`,
                    fontFamily: sans, fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 800,
                    letterSpacing: '0.08em', textTransform: 'uppercase', color: GOLD_DEEP,
                  }}
                >
                  {areas[group.area] || group.area}
                </th>
              </tr>
              {group.rows.map((row) => {
                const free = cell(row.free);
                const carto = cell(row.cartographer);
                return (
                  <tr key={row.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: '6px 8px 6px 0', color: INK }}>{rowLabels[row.id] || row.id}</td>
                    {/* `normal` wrapping only where the pill joins the figure: the cells are
                        `nowrap` so a two-word value never breaks mid-phrase, and the pill
                        needs a line of its own inside a narrow column. */}
                    <td style={{ padding: '6px 0', textAlign: 'right', color: BODY, whiteSpace: lockedCell(free) ? 'normal' : 'nowrap' }}>
                      {free}
                      {lockedCell(free) && <AvailableAtLaunchPill style={{ marginLeft: 6 }} />}
                    </td>
                    <td style={{ padding: '6px 0 6px 24px', textAlign: 'right', color: BODY, whiteSpace: lockedCell(carto) ? 'normal' : 'nowrap' }}>
                      {carto}
                      {lockedCell(carto) && <AvailableAtLaunchPill style={{ marginLeft: 6 }} />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          ))}
        </table>
      </div>
      {/* Surveyor is in the tier row above but has no column here, and a reader
          comparing plans should not have to guess why. A note, not a column: the
          ladder's own surveyor-stages row already reads 'per task' under both
          plan columns, so a third column would repeat one value down an empty
          table and imply a subscription that does not exist. */}
      <p style={{ margin: `${SP.md}px 0 0`, fontSize: proseFontSize(FS.sm, mobile), color: BODY, fontStyle: 'italic', textAlign: 'center' }}>
        {tp('band4.surveyorNote')}
      </p>
    </section>
  );
}

// Band 5: the objection-first FAQ — native details/summary (geometric
// instrument layer, zero-JS accessible), config facts interpolated.
export function PricingFaq() {
  const mobile = useIsMobile();
  const items = tp('band5.items') || [];
  const vars = { seats: FOUNDER_SEAT_CAP, freeSaves: FREE_SAVE_LIMIT, retentionMonths: RETENTION_MONTHS };
  const fill = (s) => String(s).replace(/\{(\w+)\}/g, (m, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : m);
  return (
    <section aria-labelledby="pricing-faq-heading" style={{ maxWidth: PROSE_MAX, margin: `0 auto ${SECTION_GAP}px` }}>
      <h2 id="pricing-faq-heading" style={{ margin: `0 0 ${SP.md}px`, fontFamily: serif_, fontSize: FS.xxl, color: INK }}>
        {tp('band5.heading')}
      </h2>
      {items.map((item) => (
        <details key={item.q} style={{ borderBottom: `1px solid ${BORDER}`, padding: `${SP.sm}px 0` }}>
          <summary style={{ cursor: 'pointer', fontFamily: sans, fontSize: FS.md, fontWeight: 700, color: INK, lineHeight: 1.5 }}>
            {item.q}
          </summary>
          <p style={{ margin: `${SP.sm}px 0 0`, fontFamily: sans, fontSize: proseFontSize(FS.sm, mobile), color: BODY, lineHeight: 1.6 }}>
            {fill(item.a)}
          </p>
        </details>
      ))}
    </section>
  );
}
