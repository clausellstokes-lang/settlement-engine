/**
 * TreatyPanel.jsx — the Realm Inspector's "Treaties" tab (W-PEACE-3 §13 legibility:
 * every treaty a visible, receipted, consequence-bearing document the DM can read).
 *
 * PRESENTATION ONLY. Every value comes from renderAllTreaties — the display read-model
 * over the treaties ledger (peaceTerms.treatyDocument dressed in the house voice) — so
 * nothing here computes or mutates state. A realm with no treaties shows a calm note;
 * a fraying treaty names, term by term, the seam that will tear first.
 *
 * The panel is lazy-loaded by RealmInspector (and its tab self-hides while the treaties
 * ledger is dark), so this and the treatyDocument read-model ride the lazy chunk and add
 * ZERO first-paint bytes.
 */

import { useMemo } from 'react';
import { ScrollText, HeartHandshake, AlertTriangle } from 'lucide-react';

import { useStore } from '../../store/index.js';
import { renderAllTreaties, treatyTrueStateChip } from '../../domain/display/treatyDocument.js';
import { Section } from './WorldPulsePrimitives.jsx';
import WarCausalBrief from './WarCausalBrief.jsx';
import { INK, BODY, MUTED, SECOND, CARD, CARD_ALT, BORDER, BORDER2, RED, RED_BG, GREEN, GREEN_BG, AMBER, AMBER_BG, sans, FS, SP } from '../theme.js';

/** Compliance → semantic tone (routed through design tokens — no raw color). */
const STATE_TONE = { honored: 'good', strained: 'warn', defaulted: 'danger', expired: 'neutral' };
const TONE_COLOR = {
  danger: { fg: RED, bg: RED_BG, border: RED },
  warn: { fg: AMBER, bg: AMBER_BG, border: AMBER },
  good: { fg: GREEN, bg: GREEN_BG, border: GREEN },
  neutral: { fg: SECOND, bg: CARD_ALT, border: BORDER2 },
};

function StateChip({ state }) {
  const c = TONE_COLOR[STATE_TONE[state] || 'neutral'] || TONE_COLOR.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', minHeight: 20, padding: '1px 7px',
      border: `1px solid ${c.border}`, background: c.bg, fontFamily: sans,
      color: c.fg, fontSize: FS.pico, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>{state}</span>
  );
}

/** Resolve a party id to a display name via the shared id→name map. */
function nameOf(nameById, id, fallback) {
  return (nameById && nameById[id]) || fallback || id;
}

function TermRow({ term }) {
  return (
    <li style={{
      display: 'flex', flexDirection: 'column', gap: 3, padding: '7px 9px',
      border: `1px solid ${term.fraying ? TONE_COLOR.danger.border : BORDER}`,
      background: term.fraying ? TONE_COLOR.danger.bg : CARD,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, textTransform: 'capitalize' }}>
          {term.label}{term.good ? ` · ${term.good}` : ''}
        </span>
        {term.fraying && <AlertTriangle size={12} color={RED} aria-label="fraying" />}
        <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.pico, fontWeight: 700 }}>
            {term.yearsRemaining > 0 ? `${term.yearsRemaining}y left` : 'lapsing'}
          </span>
          <StateChip state={term.complianceState} />
        </span>
      </div>
      <span style={{ color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontStyle: 'italic', lineHeight: 1.4 }}>
        {term.strainLine}
      </span>
    </li>
  );
}

function TreatyCard({ doc, nameById, worldState, includeGroundTruth }) {
  // GR-0 THE DM TRUE-STATE CHIP. The read itself is fail-closed on the flag, so this
  // is null for every viewer who is not holding ground-truth authority, and null again
  // whenever nothing actually diverges — an honest term earns no chip.
  const trueStateChip = treatyTrueStateChip(worldState, doc.pairKey, { includeGroundTruth });
  const victor = nameOf(nameById, doc.victorId, doc.victorName);
  const loser = nameOf(nameById, doc.loserId, doc.loserName);
  return (
    <article style={{ border: `1px solid ${BORDER}`, background: CARD_ALT, padding: SP.sm, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <ScrollText size={14} color={INK} />
        {/* THE TITLE AND THE SUBTITLE FOLLOW THE INSTRUMENT (chair ruling CR-WR10-G):
            a WR-10 conveyance is not a peace, and calling its buyer a victor would be a
            sentence the ledger cannot support. `doc.title` is already orientation-aware
            in the display read-model; the role word beside it comes from the same
            reader, with the historic spelling as the fallback. */}
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 900 }}>
          {doc.orientationKind === 'sale' ? doc.title : `The Peace of ${loser}`}
        </span>
        <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.pico, fontWeight: 700 }}>
          {doc.orientationKind === 'sale' ? `${victor} holds it now` : `under ${victor}'s terms`}
        </span>
        <span style={{ marginLeft: 'auto' }}><StateChip state={doc.complianceState} /></span>
      </div>

      {doc.mediatorLine && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', color: SECOND, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.4 }}>
          <HeartHandshake size={12} color={GREEN} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{doc.mediatorLine}</span>
        </div>
      )}
      {doc.coalitionLine && (
        <div style={{ color: doc.separateExit ? RED : SECOND, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.4 }}>
          {doc.coalitionLine}
        </div>
      )}

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {doc.termLines.map((term) => <TermRow key={term.type} term={term} />)}
      </ul>

      {doc.frayingLine && (
        <div style={{ color: RED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 700 }}>{doc.frayingLine}</div>
      )}
      {doc.summary && (
        <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.pico, fontStyle: 'italic' }}>{doc.summary.line}</div>
      )}
      {/* GR-0 the longevity voice — null while the lifecycle-voice flag is dark. */}
      {doc.ageLine && (
        <div data-testid="treaty-age-line" style={{ color: SECOND, fontFamily: sans, fontSize: FS.pico, fontStyle: 'italic' }}>{doc.ageLine}</div>
      )}
      {/* GR-4b-iii-b the open-question dossier line — one per pending succession question
          standing against this instrument, in the read-model's canonical order. Empty until
          a question is actually open. NO WASH and NO native tooltip: the muted italic
          register is the age line's, verbatim. */}
      {doc.successionLines.map((line, index) => (
        <div key={`${index}:${line}`} data-testid="treaty-succession-question-line" style={{ color: SECOND, fontFamily: sans, fontSize: FS.pico, fontStyle: 'italic' }}>{line}</div>
      ))}
      {/* GR-0 the DM true-state chip: what the ledger knows and the owed court does not.
          Rendered ONLY for a ground-truth viewer, and only where the truth diverges.
          NO WASH (kill-list cure, lane AB): it is named for a stamp but renders an authored
          SENTENCE, so a tinted background made it the tinted callout box the deep-craft
          ratchet hunts. The amber RULE and the amber INK carry the DM-only signal on their
          own — the WorldMapToolbar ResumeChip cure (C5-a·iii), applied to a prose plate. */}
      {trueStateChip && (
        <div data-testid="treaty-true-state-chip" style={{ color: AMBER, border: `1px solid ${AMBER}`, fontFamily: sans, fontSize: FS.pico, fontWeight: 700, padding: '3px 7px' }}>{trueStateChip}</div>
      )}
      {/* ambition-fit-1: the dramatic-irony Reasons lane — the war reasons pressing
          this pair apart and the peace reasons pulling them back, receipt by receipt.
          Self-gates to nothing when neither ledger carries a present reason. */}
      <WarCausalBrief worldState={worldState} partyId={doc.victorId} foeId={doc.loserId} />
    </article>
  );
}

/**
 * @param {Object} props
 * @param {any} props.campaign
 * @param {Record<string, string>} [props.nameById]
 */
export default function TreatyPanel({ campaign, nameById }) {
  const worldState = campaign?.worldState || null;
  const treaties = useMemo(() => renderAllTreaties(worldState), [worldState]);
  const tier = useStore(s => s.auth?.tier);
  const elevated = useStore(s => (typeof s.isElevated === 'function' ? s.isElevated() : false));
  // The includeGroundTruth convention (BeliefDivergenceBand's, verbatim): a quiet default
  // is DM knowledge. Premium / elevated only; every other viewer gets the honest public
  // reading of the same treaty, which is that the term is kept. Fail-closed.
  const includeGroundTruth = tier === 'premium' || elevated;

  if (treaties.length === 0) {
    return (
      <div data-testid="treaty-panel" style={{ color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5, padding: SP.xs }}>
        No treaties stand in this realm. When a war ends by a negotiated peace, its terms are
        recorded here, a document the DM can read like history.
      </div>
    );
  }

  return (
    <div data-testid="treaty-panel" style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
      <Section heading="Treaties" count={`${treaties.length}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          {treaties.map((doc) => <TreatyCard key={doc.pairKey} doc={doc} nameById={nameById} worldState={worldState} includeGroundTruth={includeGroundTruth} />)}
        </div>
      </Section>
    </div>
  );
}
