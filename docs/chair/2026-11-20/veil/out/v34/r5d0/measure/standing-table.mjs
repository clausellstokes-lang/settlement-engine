// R5D-0 (VEIL-34's MEASURE builder V34-R5D0): factionStanding.js's CLOSED TABLE, transcribed by hand from
// src/generators/power/factionStanding.js :: annotateFactionStanding (read whole at 606381cb5), one row per FORM (a sentence
// the function can append; a branch that writes the same text twice is one form). Slots:
//   {X}    a power's prose name (powerSentenceName) or the literal 'the governing council'
//   {Y}{Z} the rank-2 line's two powers (a prose name, or 'the second power' / 'the leading power')
//   {S}    a power's prose name, its verb (have|has, carry|carries) agreeing by pluralPowerName
//   {BODY} the force's body word (defenseFacts.js :: forceWordsOf: garrison, hired company, watch, militia, guard)
//   {N}    LEVEL_COUNT_WORDS (Three..Many); {VOTE} 'council vote' | 'decision'
// The probe EXPANDS the table over a roster (expand) and cuts a description's tail by it (cutTail); the probe also cuts every
// standing the engine itself writes on the pages' rosters, so a form missing here shows as an engine standing that does not cut.
export const SEAT_CONTESTED = 'Close enough now to contest the seat, and they know it.';
export const BODIES = ['garrison', 'hired company', 'watch', 'militia', 'guard'];
const LEVEL = ['Three', 'Four', 'Five', 'Six', 'Many'];
/** [id, slot kind, template] */
export const FORMS = [
  ['R1-gap', 'name', 'The gap between them and {X} is narrow. A single shift in patronage, scandal, or armed muscle could swap their positions.'],
  ['R1-nolead', 'closed', 'No one clearly leads here; one scandal or one lost ally could change who does.'],
  ['R1-contest', 'closed', SEAT_CONTESTED],
  ['R1-shadow', 'name', 'They operate in the shadow of {X}, close enough to matter and too far behind to lead.'],
  ['R1-resist', 'closed', 'They are strong enough to resist those above them, but too far behind to risk an open fight.'],
  ['R1-behind', 'name', 'Behind {X} by too much to challenge openly, so they get their way through petitions and procedure instead.'],
  ['R1-settled', 'closed', 'The order is settled for now; they are busy holding on to second place and make no move on first.'],
  ['R2-level', 'count', '{N} powers stand almost level here, and no one leads; every {VOTE} has to be bargained for.'],
  ['R2-table', 'closed', 'They are always at the table, but cannot set their own terms.'],
  ['R2-buy', 'name', 'Close enough to the two above that their support is worth buying; they play {Y} and {Z} against each other when they can.'],
  ['RL-few', 'closed', 'They have a say on only a few matters; on everything else they side with whoever will deal with them that week.'],
  ['MC-ahead', 'closed', 'The craft guilds currently carry more weight than they do, and the merchants are working to change that.'],
  ['MC-close', 'closed', 'The craft guilds are close behind, contesting every pricing and quality-standard decision they try to push through council.'],
  ['MC-outpaced', 'closed', 'The craft guilds are present but outpaced; merchants set prices, craft masters object, and merchants win more often than not.'],
  ['CM-outvote', 'closed', 'The merchants consistently outvote them on pricing and labour standards, so craft masters now win what they can by adding their own conditions to each deal.'],
  ['CM-running', 'closed', 'Running close behind the merchant guilds in a sustained dispute over who sets the terms for finished goods.'],
  ['CM-ahead', 'closed', 'Ahead of the merchant guilds in current influence: an unusual position they intend to hold.'],
  ['TG-far', 'force', 'The {BODY} is far stronger. They survive by bribing the lower ranks and making it costly to arrest the wrong people.'],
  ['TG-pull', 'closed', 'They have more real pull than the military right now: officers on their payroll, and commanders who know better than to ask questions.'],
  ['TG-even', 'force', 'They are roughly even with the military: the {BODY} can arrest their people, and the guild can make every investigation costly.'],
  ['GT-stronger', 'closed', 'The guild is stronger than they are. They can only make arrests where it is safe to, and everyone knows it.'],
  ['GT-down', 'closed', 'They are stronger than the guild, enough to keep it down but not to stamp it out.'],
  ['GT-slow', 'closed', 'A slow war with the guild: arrests are made, the gangs rebuild, deals are struck and quietly broken.'],
  ['MT-reach', 'closed', 'The criminal network reaches further than the merchant guilds right now. Some merchants are paying for protection; others have become silent partners.'],
  ['MT-tolerate', 'closed', "They tolerate the guild's cut because fighting it costs more than paying it, and nobody says so aloud."],
  ['NM-more', 'name', '{S have} more say now: the noble families keep their titles, their land and their precedence, but the money has moved.'],
  ['NM-closing', 'closed', 'The merchants are closing the gap, and the noble families are using every law and every social tie they have to slow them down.'],
  ['NM-ahead', 'closed', 'Still ahead of merchant interests in real influence, for now. They know the gap is narrowing and are arranging marriages accordingly.'],
  ['ST-tangle', 'closed', "The steward rules in the lord's name, and the household is where that right comes from, but who signs what has become a tangle."],
  ['ST-dayto', 'closed', 'The steward runs things day to day; the household gives the steward the right to. When a petitioner finds one of them more willing than the other, the line between them blurs.'],
  ['ST-why', 'closed', 'They hold more direct influence than the steward appointed to govern in their name, which raises questions about why the steward exists at all.'],
  ['ST-gives', 'closed', 'The steward governs in name, but gives way to them more often than was ever intended.'],
  ['ST-claim', 'closed', 'They and the steward both claim the same authority, so petitioners go to whichever is likelier to say yes.'],
  ['ST-worked', 'closed', 'The steward and the household have worked out who does what, but they bargain it again whenever something important is at stake.'],
  ['ST-day', 'closed', 'Which one actually governs depends on the day and the question; each would say it does.'],
  ['RA-more', 'name', '{S has} more say right now, and the clergy cannot accept it.'],
  ['RA-shadow', 'closed', "The arcane orders are present but operate in the clergy's shadow. Questions of what is sanctioned magic and what is heresy remain deliberately unresolved."],
  ['AR-more', 'closed', 'The clergy have more say in public affairs, so the arcane orders work around them and never challenge them openly.'],
  ['AR-ahead', 'closed', 'Ahead of the religious authorities in current influence, which they hold carefully: too much visible power invites accusations that they prefer to avoid.'],
  ['RT-stronger', 'closed', 'The criminal network is stronger than they are. The clergy preach against it loudly, and few people listen.'],
  ['RT-denounce', 'closed', 'They denounce the guild from the pulpit; the guild gives openly to the poor and makes the denunciations look selective.'],
  ['GR-line', 'force', 'They and the religious authorities both keep people in line. The {BODY} deals with bodies and the clergy with minds, and each wishes the other would keep quieter.'],
  ['OC-none', 'closed', 'It does not bargain for its way: what it decides is carried out, whatever its numbers.'],
  ['OC-named', 'name', 'It does not bargain for its way: {S carries} out what it decides, whatever its numbers.'],
];

/**
 * The table expanded over a roster: every literal the forms can print there. names: the roster's power names.
 * @returns {Array<[string, string, string, string[]]>} [id, kind, literal, the powers it names]
 */
export function expand(names, sentenceName, plural) {
  const said = [...new Set(names)].map((n) => [n, sentenceName(n)]);
  const out = [];
  for (const [id, kind, t] of FORMS) {
    if (t.includes('{X}')) { for (const [n, s] of said) out.push([id, kind, t.replace('{X}', s), [n]]); out.push([id, kind, t.replace('{X}', 'the governing council'), []]); }
    else if (t.includes('{Y}')) {
      const ys = [...said, [null, 'the second power']]; const zs = [...said, [null, 'the leading power']];
      for (const [ny, y] of ys) for (const [nz, z] of zs) out.push([id, kind, t.replace('{Y}', y).replace('{Z}', z), [ny, nz].filter(Boolean)]);
    } else if (t.includes('{S have}')) {
      out.push([id, kind, t.replace('{S have}', 'The merchant guilds now have'), ['Merchant Guilds']]);
      for (const [n, s] of said) out.push([id, kind, t.replace('{S have}', `${s} ${plural(s) ? 'have' : 'has'}`), [n]]);
    } else if (t.includes('{S has}')) { for (const [n, s] of said) out.push([id, kind, t.replace('{S has}', `${s} ${plural(s) ? 'have' : 'has'}`), [n]]); }
    else if (t.includes('{S carries}')) { for (const [n, s] of said) out.push([id, kind, t.replace('{S carries}', `${s} ${plural(s) ? 'carry' : 'carries'}`), [n]]); }
    else if (t.includes('{BODY}')) { for (const b of BODIES) out.push([id, kind, t.replace('{BODY}', b), []]); }
    else if (t.includes('{N}')) { for (const w of LEVEL) for (const v of ['council vote', 'decision']) out.push([id, kind, t.replace('{N}', w).replace('{VOTE}', v), []]); }
    else out.push([id, kind, t, []]);
  }
  return out;
}

/**
 * Cut a description's tail by the expanded table: strip, from the end, the longest literal the text ends in (whole, or after a
 * space), again and again. Returns the base left, the forms cut (in reading order), the powers they name, and the forms whose
 * literal still occurs inside the base (a standing NOT at the tail).
 */
export function cutTail(desc, table) {
  let rest = String(desc ?? ''); const ids = []; const named = [];
  for (;;) {
    let best = null;
    for (const row of table) { const s = row[2]; if (s.length > (best ? best[2].length : 0) && (rest === s || rest.endsWith(` ${s}`))) best = row; }
    if (!best) break;
    ids.unshift(best[0]); named.unshift(...best[3]);
    rest = rest === best[2] ? '' : rest.slice(0, -best[2].length - 1);
  }
  const mid = [...new Set(table.filter((row) => row[2].length >= 25 && rest.includes(row[2])).map((row) => row[0]))];
  return { base: rest, ids, named: [...new Set(named)], mid };
}
