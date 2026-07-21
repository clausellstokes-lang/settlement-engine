/**
 * Traditions — chapter 07B, the PDF's "Traditions" register (THE TRADITIONS wave,
 * Engine Lift #4, slice T-5). It prints the same register the dossier's Traditions
 * tab shows: each observance's name, motif, window ("Harvest, the third week"),
 * owner, last outcome, and the mutationLog as a provenance line.
 *
 * MIRROR-ONLY + SELF-GATING (the byte-identical-when-absent law, DESIGN_TRADITIONS
 * §12): it reads the `settlement.traditions` MIRROR the T-2 mover writes — NOT the
 * genesis preview — so a draft, or any export while the traditions layer is DARK
 * (the flag unlit ⇒ no mirror anywhere), produces a PDF where this chapter never
 * appears, byte-identical to today. It lights only for a lit campaign's settlements
 * once traditionsEnabled turns on at THE ONE REGEN (a declared additive section).
 *
 * The register uses the TEXT motif label (element · act), not the tab's unicode
 * glyph — the embedded PDF fonts do not cover the dingbat set, so a glyph would
 * print as a missing box. The motif reads in words instead.
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { ChapterBand, ChapterHeadline, HairRule } from '../primitives/Dense.jsx';
import { type, palette, space, pt } from '../theme.js';
import { describeTraditionWindow } from '../../domain/traditions/genesis.js';

const OUTCOME_LABEL = {
  triumph: 'a triumph', good: 'well kept', modest: 'modestly kept',
  troubled: 'a troubled year', failure: 'a failure', cancelled: 'set aside',
};

/** Humanize a motif id ("the-dead" → "The Dead"). @param {unknown} id @returns {string} */
function humanizeMotif(id) {
  return String(id || '').split('-').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ');
}

/** The mutationLog rendered as a provenance line (design §10) — count + recent causes. */
function provenanceLine(rec) {
  const log = Array.isArray(rec.mutationLog) ? rec.mutationLog : [];
  if (!log.length) return (rec.expression && typeof rec.expression.epithet === 'string') ? rec.expression.epithet : null;
  const causes = log.map((e) => (e && typeof e.cause === 'string' ? e.cause : '')).filter(Boolean).slice(-3);
  return `${log.length} ${log.length === 1 ? 'change' : 'changes'} recorded: ${causes.join('; ')}`;
}

/**
 * @param {{ settlement?: { traditions?: unknown, name?: string }, narrativeMode?: boolean, vm?: unknown }} props
 */
export function Traditions({ settlement, narrativeMode }) {
  const mirror = settlement && Array.isArray(settlement.traditions) ? settlement.traditions : null;
  if (!mirror || !mirror.length) return null; // dormant / draft ⇒ byte-identical off-state.

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="07B"
        title="Traditions"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub="festivals & rites"
      />
      <ChapterHeadline tone="gold">
        The observances this settlement keeps: its founding rite and the customs it has accrued.
      </ChapterHeadline>

      {mirror.map((rec, i) => {
        const suppressed = !!(rec && rec.suppressedBy);
        const motif = (rec && rec.coreMotif) || {};
        const owner = rec && (rec.ownerLabel || rec.ownerKey) ? String(rec.ownerLabel || rec.ownerKey) : '–';
        const outcome = rec && rec.lastOutcome
          ? (OUTCOME_LABEL[/** @type {string} */ (rec.lastOutcome)] || String(rec.lastOutcome))
          : '–';
        const prov = provenanceLine(rec || {});
        return (
          <View key={(rec && rec.id) || i} style={{ marginBottom: space.sm }} wrap={false}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 1 }}>
              <Text style={{ ...type.body_em, fontSize: pt['11'], color: palette.ink, marginRight: 6 }}>
                {(rec && rec.name) || 'An observance'}
              </Text>
              <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted }}>
                {humanizeMotif(motif.element)} · {humanizeMotif(motif.act)}
                {suppressed ? ' · set aside under an overlord' : ''}
              </Text>
            </View>
            <Text style={{ ...type.body, fontSize: pt['9'], color: palette.second, lineHeight: 1.4 }}>
              Kept in {describeTraditionWindow(rec && rec.window)}. · Owner: {owner} · Last held: {outcome}
            </Text>
            {prov && (
              <Text style={{ ...type.caption, fontSize: pt['8'], color: palette.muted, fontStyle: 'italic', lineHeight: 1.4 }}>
                {prov}
              </Text>
            )}
          </View>
        );
      })}

      <HairRule />
      <Text style={{ ...type.caption, fontSize: pt['7.5'], color: palette.muted, fontStyle: 'italic' }}>
        A settlement&apos;s traditions carry its identity forward. Each holding, or failing, is a mark on the year.
      </Text>
    </PageChrome>
  );
}

export default Traditions;
