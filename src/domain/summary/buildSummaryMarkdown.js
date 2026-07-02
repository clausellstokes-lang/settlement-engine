/**
 * buildSummaryMarkdown.js — the single source of truth for the at-the-table
 * Summary clipboard export.
 *
 * Both the magazine SummaryTabV2 and the legacy SummaryTab paste the night's
 * prep into a GM's notes / VTT; they used to carry two divergent inline
 * builders. This module owns the shape so the two copy paths can never drift
 * (P2 coherence / P11 cross-surface consistency).
 *
 * Pure: no DOM, no store, no React. Callers pass the settlement plus the
 * already-derived collections each surface has on hand (the tonight-at-the-table
 * cast for V2, or the NPC/hook rosters for the legacy tab), so this helper does
 * no engine work of its own and never reaches past what its caller computed.
 */

/** @param {import('../settlement.schema.js').SimSettlement} s @returns {string} */
function metaLine(s) {
  return [
    s.tierLabel || (s.tier != null && String(s.tier)),
    s.population != null && `Pop. ${s.population.toLocaleString('en-US')}`,
    s.tradeAccess || (s.config?.tradeRouteAccess && String(s.config.tradeRouteAccess).replace(/_/g, ' ')),
    s.age != null && `${s.age} years old`,
  ].filter(Boolean).join(' · ');
}

/**
 * V2 magazine shape: the "Tonight at the table" cast is the body. Mirrors the
 * cards a GM sees on screen so the paste matches the read.
 *
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @param {Array<{kind:string,title:string,body?:string}>} tableEntries
 */
export function buildSummaryMarkdown(settlement, tableEntries) {
  if (!settlement) return '';
  const meta = metaLine(settlement);
  const lines = [
    `# ${settlement.name || 'Untitled settlement'}`,
    meta ? `*${meta}*` : '',
    settlement.pressureSentence ? `\n${settlement.pressureSentence}` : '',
    settlement.arrivalScene ? `\n> ${settlement.arrivalScene}` : '',
    (tableEntries && tableEntries.length)
      ? '\n**Tonight at the table:**\n' + tableEntries
          .map(row => `- [${row.kind}] ${row.title}${row.body ? ` — ${row.body}` : ''}`)
          .join('\n')
      : '',
  ].filter(Boolean).join('\n');
  return lines;
}

/**
 * Legacy tab shape: the fuller dossier dump (character sentence, power/economy/
 * defense one-liners, full NPC + plot-hook rosters). The caller passes the
 * pre-derived strings/rosters it already computed so this stays pure.
 *
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @param {object} parts
 * @param {string} [parts.tierLabel]
 * @param {string} [parts.tradeAccess]
 * @param {number} [parts.age]
 * @param {Array<any>} [parts.stresses]        active-crisis records ({label,crisisHook})
 * @param {string} [parts.characterSentence]
 * @param {string} [parts.powerLine]
 * @param {string} [parts.economyLine]
 * @param {string} [parts.defenseLine]
 * @param {Array<any>} [parts.npcs]            [{ line }] pre-formatted NPC bullet bodies
 * @param {Array<any>} [parts.hooks]           [{ source, text }]
 */
export function buildLegacySummaryMarkdown(settlement, parts = {}) {
  if (!settlement) return '';
  const meta = metaLine({
    tierLabel: parts.tierLabel,
    population: settlement.population,
    tradeAccess: parts.tradeAccess,
    age: parts.age,
  });
  const lines = [
    `# ${settlement.name || 'Untitled settlement'}`,
    meta ? `*${meta}*` : '',
    parts.stresses?.length
      ? '\n**Active Crisis:** ' + parts.stresses.map(v => `${v.label} - ${v.crisisHook}`).join(' | ')
      : '',
    settlement.arrivalScene ? `\n> ${settlement.arrivalScene}` : '',
    parts.characterSentence ? `\n**${parts.characterSentence}**` : '',
    parts.powerLine ? `\n**Power:** ${parts.powerLine}` : '',
    parts.economyLine ? `**Economy:** ${parts.economyLine}` : '',
    parts.defenseLine ? `**Defense:** ${parts.defenseLine}` : '',
    parts.npcs?.length ? '\n**Key NPCs:**' : '',
    ...(parts.npcs || []).map(n => `- ${n.line}`),
    parts.hooks?.length ? '\n**Plot Hooks:**' : '',
    ...(parts.hooks || []).map(h => `- [${h.source}] ${h.text}`),
  ].filter(Boolean).join('\n');
  return lines;
}
