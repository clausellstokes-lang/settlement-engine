/**
 * pdf/primitives/CardVoice.jsx — THE QUOTE SLOT'S PRINT TWIN (S-G1; VOICES-CARDS' F, "PDF (5)"; the chair's rulings E28
 * points 5 and 11). The same plan as the screen's slot (`domain/voices/voicePlan.js`, the owner's audience: the PDF is the
 * owner's own document, built `dmView`), so a card the PDF prints carries the same quote the screen does: one italic line in
 * quotation marks and its signature. A card the PDF does not print (a person on a name row, a tradition of a town not lit)
 * has no slot, and so no quote (ruling 5).
 *
 * THE LIAR'S LINE IS NOT PRINTED: a printed page cannot keep the DM's mark from the table, so the liar's card is silent
 * in print (ruling 11: "where the mark cannot be shown safely on a surface, the liar's line is not shown there").
 *
 *   <CardVoice town={settlement} kind="power" id={powerCardId(name)} />   inside a card
 * @enforced-by tests/pdf/cardVoicePdf.test.jsx
 */
import { Text } from '@react-pdf/renderer';
import { palette, type, pt } from '../theme.js';
import { quoteFor, voicePlanOf } from '../../domain/voices/voicePlan.js';

/**
 * The quote a printed card carries, or null (silent, a liar's line, no record).
 * @param {any} settlement @param {string} kind @param {string | null | undefined} id
 */
export function printedQuoteOf(settlement, kind, id) {
  if (!settlement || !id) return null;
  const q = quoteFor(voicePlanOf(settlement, { audience: 'owner' }), kind, id);
  return q && !q.liar ? q : null;
}

/**
 * HOOK-FREE on purpose: the PDF's tests walk the section trees by calling each component as a function.
 * @param {{ town: any, kind: string, id: string | null | undefined }} props `town`: the record the document prints
 */
export default function CardVoice({ town, kind, id }) {
  const q = printedQuoteOf(town, kind, id);
  if (!q) return null;
  const { name, role } = q.speaker;
  return (
    <Text style={{ ...type.body, fontSize: pt['8.5'], color: palette.second, marginTop: 2, lineHeight: 1.35 }}>
      <Text style={{ fontStyle: 'italic' }}>{`“${q.text}”`}</Text>
      <Text style={{ color: palette.muted }}>{` — ${name}${role ? `, ${role}` : ''}`}</Text>
    </Text>
  );
}
