// BAR7-AUDIT-I · LAW 10 WIDENED · 10i ONE PAIR, ONE TIE: the record holds two ties between one pair of people in opposite
// senses (an ally's or another warm kind, and a rival's or an enemy's) and the page prints both (the positive control
// C19351: "Allies (1) · Rivals (1)" for one pair). The ties are written by `src/generators/people/ties.js :: drawTies`
// (one outgoing tie a card, so A->B and B->A are two draws) and the late ties of `steps/assembleSettlement.js`
// ('people-ties-late'); a pair's second tie takes its first's temper (`inTemperOf`), but `data/npcData.js :: TIE_TEMPER`
// gives no temper to `rival` or `ally`, so a rival first tie leaves an ally second tie its kind. Pure; no I/O.
// warm: the kinds that say the two are on one side (and TIE_TEMPER's own warm rungs); cold: rival and enemy. A
// political convenience ("Mutual Leverage"), a debt or a patronage beside a rivalry is not two senses (the 30: 1 of 2).
export const WARM = new Set(['ally', 'family', 'lover', 'friend']);
const WARM_RUNG = { mentor_student: new Set(['devoted', 'lifelong']), respect: new Set(['deep']) };
export const COLD = new Set(['rival', 'enemy']);
const isWarm = (t) => WARM.has(String(t.type)) || !!WARM_RUNG[String(t.type)]?.has(String(t.strength));

export function law10i(T, town) {
  const rec = T.record || {};
  const ties = (rec.relationships || []).filter((t) => t && t.from != null && t.to != null);
  const byPair = new Map();
  for (const t of ties) { const k = [String(t.from), String(t.to)].sort().join('|'); (byPair.get(k) || byPair.set(k, []).get(k)).push(t); }
  const rel = T.tabs['World/Relationships'] || [];
  const out = [];
  for (const [k, ts] of byPair) {
    const warm = ts.filter(isWarm);
    const cold = ts.filter((t) => COLD.has(String(t.type)));
    if (!warm.length || !cold.length) continue;
    const covert = ts.some((t) => t.covert === true || t.handler === true);
    // respect beside a rivalry ("Genuine Respect" and "Professional Rivalry") can both be true of two rivals: apart (the 150: 3 of 7)
    const respectOnly = warm.every((t) => String(t.type) !== 'ally' && String(t.type) !== 'family' && String(t.type) !== 'lover' && String(t.type) !== 'friend');
    // kin who are rivals or enemies can be both (the 720: 9 of 37): apart; counted only an ally's, a friend's or a lover's
    // tie beside a rival's or an enemy's
    const familyOnly = !respectOnly && warm.every((t) => String(t.type) === 'family');
    const a = String(ts[0].npc1Name || ''), b = String(ts[0].npc2Name || '');
    // the printed rows: "<A> · <Kind> · <B>" with both names
    const rows = rel.map((line, i) => ({ line, i })).filter((x) => x.line.includes(' · ') && a && b && x.line.includes(a) && x.line.includes(b));
    const printed = rows.length >= 2;
    // the ties' own descriptions as printed (the line that names the pair's kind: "are allies with ...")
    const texts = ts.map((t) => t.description).filter((s) => typeof s === 'string' && s && rel.some((l) => l.includes(s.slice(0, 40))));
    out.push({ law: 'L10', rule: respectOnly ? '10i.pair-respect' : familyOnly ? '10i.pair-family' : '10i.pair', town, tab: 'World/Relationships', line: rows[0]?.line || `relationships: ${a} / ${b}`,
      sentence: rows.map((r) => r.line).join(' | ') || `${a} / ${b}`, cause: 'other',
      against: { tab: 'record', line: ts.map((t) => `${t.id}: ${t.from} -> ${t.to} ${t.type} (${t.strength})`).join(' ; ') },
      status: covert || !printed || respectOnly || familyOnly ? 'apart' : 'count', pair: k, texts, kinds: ts.map((t) => `${t.type}/${t.strength}`).join(' + '),
      why: `one pair, ${ts.length} ties: ${ts.map((t) => t.type).join(' and ')}${printed ? '; the page prints both' : '; the page does not print both rows (apart)'}${covert ? ' (a covert or handler tie: apart)' : ''}` });
  }
  return out;
}
