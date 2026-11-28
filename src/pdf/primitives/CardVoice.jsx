/**
 * pdf/primitives/CardVoice.jsx — THE QUOTE SLOT'S PRINT TWIN (S-G1; VOICES-CARDS' F, "PDF (5)"; the chair's rulings E28
 * points 5 and 11, and G1-5). The same plan as the screen's slot (`domain/voices/voicePlan.js`, the owner's audience: the
 * PDF is the owner's own document, built `dmView`), so a card the PDF prints carries the same quote the screen does: one
 * italic line in quotation marks and its signature. A card the PDF does not print (a person on a name row, a tradition of a
 * town not lit) has no slot, and so no quote (ruling 5). THE TONIGHT SHEET HOLDS NONE, in print as on screen (ruling 5;
 * the chair's G1-7): the print's crisis block lives only in chapter 02, the Tonight sheet, so the crisis card's quote is
 * the screen's alone (Summary/Crisis) and the print, by design, carries fewer.
 *
 * THE PDF WORKER CARRIES NO LINES (G1-5): the plan is computed on the CALLER's thread (`utils/generateSettlementPDF.js` →
 * `voicePlan.js :: printedQuotesOf`), and the document is handed the quotes it prints as a plain map, `<kind>:<id>` → text
 * and signature (`SettlementPDF`'s `voiceQuotes`). This twin reads that map and imports no line and no plan. A document
 * built without the map (a hand-built test document, any other caller) prints no quote.
 *
 * THE LIAR'S LINE IS NOT PRINTED: a printed page cannot keep the DM's mark from the table, so the liar's card is silent
 * in print (ruling 11: "where the mark cannot be shown safely on a surface, the liar's line is not shown there"). The map
 * never holds it.
 *
 *   <CardVoice quotes={voices} kind="power" id={powerCardId(name)} />   inside a card
 * @enforced-by tests/pdf/cardVoicePdf.test.jsx, tests/build/pdfWorkerNoVoices.test.js
 */
import { Text } from '@react-pdf/renderer';
import { palette, type, pt } from '../theme.js';

/** @typedef {Record<string, { text: string, name: string, role: string }>} PrintedQuotes */

/**
 * The quote a printed card carries, or null (silent, no map).
 * @param {PrintedQuotes | null | undefined} quotes @param {string} kind @param {string | null | undefined} id
 */
export function printedQuoteOf(quotes, kind, id) {
  if (!quotes || typeof quotes !== 'object' || !id) return null;
  const key = `${kind}:${id}`;
  return Object.hasOwn(quotes, key) ? quotes[key] : null;
}

/**
 * HOOK-FREE on purpose: the PDF's tests walk the section trees by calling each component as a function.
 * @param {{ quotes: PrintedQuotes | null | undefined, kind: string, id: string | null | undefined }} props
 */
export default function CardVoice({ quotes, kind, id }) {
  const q = printedQuoteOf(quotes, kind, id);
  if (!q) return null;
  return (
    <Text style={{ ...type.body, fontSize: pt['8.5'], color: palette.second, marginTop: 2, lineHeight: 1.35 }}>
      <Text style={{ fontStyle: 'italic' }}>{`“${q.text}”`}</Text>
      <Text style={{ color: palette.muted }}>{` — ${q.name}${q.role ? `, ${q.role}` : ''}`}</Text>
    </Text>
  );
}
