// @ts-check
/**
 * domain/display/galleryWithholdAlways.js — WHAT NO NON-OWNER READ SENDS, WHATEVER THE VEIL (VEIL-21, R2; the sixth
 * chair's VR16 rule 1, the seventh chair's VR28, VR33, VR37, each vetoable by the owner; SUB-BRIEF-VR7 point 5).
 *
 * The client twin of migration 212 :: _gallery_veil_withhold_always (and _gallery_veil_minus_at, _each_minus_at,
 * _gallery_veil_cast), rule for rule, each rule naming its row of the roster-choice registry
 * (src/domain/veil/rosterChoiceRegistry.js). 212 :: _gallery_veil runs it last on every body it returns, an unmarked
 * listing's projection among them; galleryVeil.js :: applyVeil runs it last and projectShareVeil on the unmarked path.
 * The page re-derives what it draws of these from the served document (src/domain/veil/pageRederive.js). The owner's own
 * reads never come here. Pure in kind: works in place on the veil's own copy.
 */
import { withholdCastByServed } from './gallerySecondHomes.js';
import { HIDDEN_POWER_MASK } from './publicSafe.js';

/** @typedef {Record<string, unknown>} Rec */

/** @param {unknown} v @returns {v is Rec} */
function isRec(v) {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}
/** @param {Rec} s @param {string} key @returns {Rec | null} */
function recAt(s, key) {
  const v = s[key];
  return isRec(v) ? v : null;
}

/** The record at `path` (each step an object), or null. @param {Rec} s @param {ReadonlyArray<string>} path @returns {Rec | null} */
function recPath(s, path) {
  /** @type {unknown} */ let v = s;
  for (const k of path) { if (!isRec(v)) return null; v = v[k]; }
  return isRec(v) ? v : null;
}
/** The object at `path` loses `keys` (in place). @param {Rec} s @param {ReadonlyArray<string>} path @param {ReadonlyArray<string>} keys */
function minusAt(s, path, keys) {
  const o = path.length ? recPath(s, path) : s;
  if (o) for (const k of keys) delete o[k];
}
/** Each object of the array at `path` loses `keys` (in place). @param {Rec} s @param {ReadonlyArray<string>} path @param {ReadonlyArray<string>} keys */
function eachMinusAt(s, path, keys) {
  const parent = path.length > 1 ? recPath(s, path.slice(0, -1)) : s;
  const list = parent ? parent[path[path.length - 1]] : null;
  if (Array.isArray(list)) for (const e of list) if (isRec(e)) for (const k of keys) delete e[k];
}
/**
 * VEIL-21 (R2-CURE; VR37 (a), the page re-derives from the served document): A SERVED MEMBERSHIP IS A PUBLIC ONE. Every
 * membership 212 sends on a Reveal-DM-off read passed the server's projection (211's twin of publicSafe.js ::
 * publicMembershipsOf: the entries stamped `veiled: false`), and 212 :: _gallery_veil_withhold_always then withholds the
 * stamp itself (registry: npcs.memberships.veiled). The page re-projects an unmarked body with toPublicSafe, whose
 * per-entry law keeps only stamped entries, so without the stamp it drew every card's memberships EMPTY where the server
 * sent them (tests/security/galleryServerVeil.pglite.test.js, measured at R2's 12a371c0b: the unmarked gallery page, the
 * import and the map member of 7 of its 8 towns). The page restamps what the server sent, on a COPY (the response is not
 * touched); the twin's unmarked path (projectShareVeil -> withholdAlways) removes the stamp again, so the page model equals
 * the served body. Called on the server's own `data` alone (gallery.js :: sanitizeDossier), never on a frozen copy a read
 * carried beside it; an entry that carries a stamp keeps it. It adds nothing the response does not already hold.
 * @template T @param {T} doc @returns {T}
 */
export function restampServedMemberships(doc) {
  if (!isRec(doc) || !Array.isArray(doc.npcs)) return doc;
  /** @param {unknown} m */
  const bare = (m) => isRec(m) && !('veiled' in m);
  let moved = false;
  const npcs = doc.npcs.map((n) => {
    if (!isRec(n) || !Array.isArray(n.memberships) || !n.memberships.some(bare)) return n;
    moved = true;
    return { ...n, memberships: n.memberships.map((m) => (bare(m) ? { .../** @type {Rec} */ (m), veiled: false } : m)) };
  });
  return /** @type {T} */ (moved ? { ...doc, npcs } : doc);
}

/** The power's band word before its cause (VR19 (a), ruling 5): the cause runs from the first '(', em dash or ';', with the spaces before it. */
const STABILITY_CAUSE = /[ ]*[(—;][\s\S]*$/;

/**
 * R5-DESC (212 (36) (a); the chair's E121, E126, E129): THE STANDING FORMS, ONE TABLE, the same literal 212 ::
 * _gallery_veil_withhold_always carries between its STANDING_FORMS markers, GENERATED, never written by hand
 * (`node scripts/veil/standingForms.mjs --print`, from scripts/veil/standingForms.data.json, whose header states the cut):
 * {id: {kind, re}}, each `re` a tail (it ends in $), no backslash. Compiled once, in id order, as the cut asks each row:
 * "(?:^| )(" + re + ")".
 * @type {ReadonlyArray<Readonly<{ id: string, re: RegExp }>>}
 */
const STANDING_ROWS = Object.freeze(Object.entries(/** @type {Record<string, { kind: string, re: string }>} */ (JSON.parse(
  // STANDING_FORMS begin
`{
  "AR-ahead": {"kind": "closed", "re": "Ahead of the religious authorities in current influence, which they hold carefully: too much visible power invites accusations that they prefer to avoid[.]$"},
  "AR-more": {"kind": "closed", "re": "The clergy have more say in public affairs, so the arcane orders work around them and never challenge them openly[.]$"},
  "CM-ahead": {"kind": "closed", "re": "Ahead of the merchant guilds in current influence: an unusual position they intend to hold[.]$"},
  "CM-outvote": {"kind": "closed", "re": "The merchants consistently outvote them on pricing and labour standards, so craft masters now win what they can by adding their own conditions to each deal[.]$"},
  "CM-running": {"kind": "closed", "re": "Running close behind the merchant guilds in a sustained dispute over who sets the terms for finished goods[.]$"},
  "GR-line": {"kind": "pattern", "re": "They and the religious authorities both keep people in line[.] The (?:garrison|guard|hired company|militia|watch) deals with bodies and the clergy with minds, and each wishes the other would keep quieter[.]$"},
  "GT-down": {"kind": "closed", "re": "They are stronger than the guild, enough to keep it down but not to stamp it out[.]$"},
  "GT-slow": {"kind": "closed", "re": "A slow war with the guild: arrests are made, the gangs rebuild, deals are struck and quietly broken[.]$"},
  "GT-stronger": {"kind": "closed", "re": "The guild is stronger than they are[.] They can only make arrests where it is safe to, and everyone knows it[.]$"},
  "H-AR-more-em": {"kind": "closed", "re": "The clergy hold more civic influence — the arcane orders operate by navigating rather than challenging religious authority[.]$"},
  "H-AR-more-hy": {"kind": "closed", "re": "The clergy hold more civic influence - the arcane orders operate by navigating rather than challenging religious authority[.]$"},
  "H-CM-ahead-em": {"kind": "closed", "re": "Ahead of the merchant guilds in current influence — an unusual position they intend to hold[.]$"},
  "H-CM-ahead-hy": {"kind": "closed", "re": "Ahead of the merchant guilds in current influence - an unusual position they intend to hold[.]$"},
  "H-CM-riders-em": {"kind": "closed", "re": "The merchants consistently outvote them on pricing and labour standards — craft masters have learned to attach riders to deals rather than fight directly[.]$"},
  "H-CM-riders-hy": {"kind": "closed", "re": "The merchants consistently outvote them on pricing and labour standards - craft masters have learned to attach riders to deals rather than fight directly[.]$"},
  "H-GR-parallel-em": {"kind": "closed", "re": "They and the religious authorities operate parallel systems of social control — the garrison handles bodies, the clergy handles minds, and both would prefer the other operated at lower volume[.]$"},
  "H-GR-parallel-hy": {"kind": "closed", "re": "They and the religious authorities operate parallel systems of social control - the garrison handles bodies, the clergy handles minds, and both would prefer the other operated at lower volume[.]$"},
  "H-GT-leverage-em": {"kind": "closed", "re": "The guild has more real leverage than they do — selective enforcement is the only tool that still works, and everyone knows it[.]$"},
  "H-GT-leverage-hy": {"kind": "closed", "re": "The guild has more real leverage than they do - selective enforcement is the only tool that still works, and everyone knows it[.]$"},
  "H-GT-outmatch-em": {"kind": "closed", "re": "They outmatch the guild institutionally, which keeps the criminal operation suppressed rather than eliminated — there is a difference[.]$"},
  "H-GT-outmatch-hy": {"kind": "closed", "re": "They outmatch the guild institutionally, which keeps the criminal operation suppressed rather than eliminated - there is a difference[.]$"},
  "H-MC-outweigh-em": {"kind": "closed", "re": "The craft guilds currently outweigh them in raw political numbers — an uncomfortable inversion the merchants are working to correct[.]$"},
  "H-MC-outweigh-hy": {"kind": "closed", "re": "The craft guilds currently outweigh them in raw political numbers - an uncomfortable inversion the merchants are working to correct[.]$"},
  "H-MT-reach-em": {"kind": "closed", "re": "The criminal network has more operational reach than the merchant guilds right now — some merchants are paying protection; others have become silent partners[.]$"},
  "H-MT-reach-hy": {"kind": "closed", "re": "The criminal network has more operational reach than the merchant guilds right now - some merchants are paying protection; others have become silent partners[.]$"},
  "H-NM-ahead-em": {"kind": "closed", "re": "Still ahead of merchant interests in real influence — for now[.] They know the gap is narrowing and are arranging marriages accordingly[.]$"},
  "H-NM-ahead-hy": {"kind": "closed", "re": "Still ahead of merchant interests in real influence - for now[.] They know the gap is narrowing and are arranging marriages accordingly[.]$"},
  "H-NM-more-em": {"kind": "closed", "re": "The merchant guilds now hold more functional leverage — the noble families retain title, hereditary land, and social precedence, but the money has moved[.]$"},
  "H-NM-more-hy": {"kind": "closed", "re": "The merchant guilds now hold more functional leverage - the noble families retain title, hereditary land, and social precedence, but the money has moved[.]$"},
  "H-R1-behind-em": {"kind": "pattern", "re": "Behind (?:(?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}(?: ?/ ?[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5})?(?: [(][A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}[)])?|an unseen interest)|the governing council) by enough margin that direct challenge is not viable — they route their influence through procedure, not confrontation[.]$"},
  "H-R1-behind-hy": {"kind": "pattern", "re": "Behind (?:(?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}(?: ?/ ?[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5})?(?: [(][A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}[)])?|an unseen interest)|the governing council) by enough margin that direct challenge is not viable - they route their influence through procedure, not confrontation[.]$"},
  "H-R1-gap-em": {"kind": "pattern", "re": "The gap between them and (?:(?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}(?: ?/ ?[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5})?(?: [(][A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}[)])?|an unseen interest)|the governing council) is narrow — a single shift in patronage, scandal, or armed muscle could swap their positions[.]$"},
  "H-R1-gap-hy": {"kind": "pattern", "re": "The gap between them and (?:(?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}(?: ?/ ?[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5})?(?: [(][A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}[)])?|an unseen interest)|the governing council) is narrow - a single shift in patronage, scandal, or armed muscle could swap their positions[.]$"},
  "H-R1-shadow-em": {"kind": "pattern", "re": "They operate in the shadow of (?:(?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}(?: ?/ ?[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5})?(?: [(][A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}[)])?|an unseen interest)|the governing council) but not comfortably — they are watching for leverage, not deferring[.]$"},
  "H-R1-shadow-hy": {"kind": "pattern", "re": "They operate in the shadow of (?:(?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}(?: ?/ ?[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5})?(?: [(][A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}[)])?|an unseen interest)|the governing council) but not comfortably - they are watching for leverage, not deferring[.]$"},
  "H-R2-reliable-em": {"kind": "closed", "re": "A reliable third presence — too significant to exclude from negotiations, not strong enough to set their own terms[.]$"},
  "H-R2-reliable-hy": {"kind": "closed", "re": "A reliable third presence - too significant to exclude from negotiations, not strong enough to set their own terms[.]$"},
  "H-R2-threeway-em": {"kind": "closed", "re": "Genuinely three-way territory — no faction has decisively broken from the pack; every council vote is negotiated[.]$"},
  "H-R2-threeway-hy": {"kind": "closed", "re": "Genuinely three-way territory - no faction has decisively broken from the pack; every council vote is negotiated[.]$"},
  "H-RA-shadow-em": {"kind": "closed", "re": "The arcane orders are present but operate in the clergy's shadow — questions of what is sanctioned magic and what is heresy remain deliberately unresolved[.]$"},
  "H-RA-shadow-hy": {"kind": "closed", "re": "The arcane orders are present but operate in the clergy's shadow - questions of what is sanctioned magic and what is heresy remain deliberately unresolved[.]$"},
  "H-RT-outweighs-em": {"kind": "closed", "re": "The criminal network currently outweighs them — the clergy's moral authority is loud and largely unheeded[.]$"},
  "H-RT-outweighs-hy": {"kind": "closed", "re": "The criminal network currently outweighs them - the clergy's moral authority is loud and largely unheeded[.]$"},
  "H-ST-administers-em": {"kind": "closed", "re": "The steward administers in the lord's name — the household is the source of that authority, not a rival to it, but the practical question of who signs what has become genuinely complicated[.]$"},
  "H-ST-administers-hy": {"kind": "closed", "re": "The steward administers in the lord's name - the household is the source of that authority, not a rival to it, but the practical question of who signs what has become genuinely complicated[.]$"},
  "H-TG-even-em": {"kind": "closed", "re": "Running roughly even with the military in actual influence — the garrison can arrest individuals, the guild can make the investigation expensive[.]$"},
  "H-TG-even-hy": {"kind": "closed", "re": "Running roughly even with the military in actual influence - the garrison can arrest individuals, the guild can make the investigation expensive[.]$"},
  "H-TG-outweighs-em": {"kind": "closed", "re": "The garrison outweighs them institutionally — they survive by corrupting the lower ranks and making enforcement selectively unprofitable[.]$"},
  "H-TG-outweighs-hy": {"kind": "closed", "re": "The garrison outweighs them institutionally - they survive by corrupting the lower ranks and making enforcement selectively unprofitable[.]$"},
  "M-AR-more": {"kind": "closed", "re": "The clergy hold more civic influence: the arcane orders operate by navigating rather than challenging religious authority[.]$"},
  "M-CM-riders": {"kind": "closed", "re": "The merchants consistently outvote them on pricing and labour standards[.] Craft masters have learned to attach riders to deals rather than fight directly[.]$"},
  "M-GR-parallel": {"kind": "pattern", "re": "They and the religious authorities operate parallel systems of social control[.] The (?:garrison|guard|hired company|militia|watch) handles bodies, the clergy handles minds, and both would prefer the other operated at lower volume[.]$"},
  "M-GT-leverage": {"kind": "closed", "re": "The guild has more real leverage than they do[.] Selective enforcement is the only tool that still works, and everyone knows it[.]$"},
  "M-GT-outmatch": {"kind": "closed", "re": "They outmatch the guild institutionally, which keeps the criminal operation suppressed rather than eliminated[.] There is a difference[.]$"},
  "M-GT-slow": {"kind": "closed", "re": "Running a slow institutional war with the guild: arrests happen, networks rebuild, deals are struck and quietly violated[.]$"},
  "M-MC-outweigh": {"kind": "closed", "re": "The craft guilds currently outweigh them in raw political numbers[.] An uncomfortable inversion the merchants are working to correct[.]$"},
  "M-MT-reach": {"kind": "closed", "re": "The criminal network has more operational reach than the merchant guilds right now[.] Some merchants are paying protection; others have become silent partners[.]$"},
  "M-MT-tolerate": {"kind": "closed", "re": "They tolerate the guild's cut because fighting it costs more than paying it; the arrangement is not advertised[.]$"},
  "M-NM-closing": {"kind": "closed", "re": "The merchants are closing the gap; the noble families are using every legal and social mechanism to slow a transition that looks increasingly inevitable[.]$"},
  "M-NM-more": {"kind": "closed", "re": "The merchant guilds now hold more functional leverage: the noble families retain title, hereditary land, and social precedence, but the money has moved[.]$"},
  "M-R1-behind": {"kind": "pattern", "re": "Behind (?:(?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}(?: ?/ ?[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5})?(?: [(][A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}[)])?|an unseen interest)|the governing council) by enough margin that direct challenge is not viable: they route their influence through procedure, not confrontation[.]$"},
  "M-R1-cautious": {"kind": "closed", "re": "Close enough to the top to resist, far enough behind to be cautious[.]$"},
  "M-R1-contested": {"kind": "closed", "re": "The dominant order is genuinely contested; a single shift in circumstance could reorder everything[.]$"},
  "M-R1-settled": {"kind": "closed", "re": "The hierarchy is settled for now; their energy goes into consolidating second place, not chasing first[.]$"},
  "M-R1-shadow": {"kind": "pattern", "re": "They operate in the shadow of (?:(?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}(?: ?/ ?[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5})?(?: [(][A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}[)])?|an unseen interest)|the governing council) but not comfortably: they are watching for leverage, not deferring[.]$"},
  "M-R2-buy": {"kind": "pattern", "re": "Close enough to the two above that their support is worth buying; they play (?:(?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}(?: ?/ ?[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5})?(?: [(][A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}[)])?|an unseen interest)|the second faction) and (?:(?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}(?: ?/ ?[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5})?(?: [(][A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}[)])?|an unseen interest)|the top faction) against each other when they can[.]$"},
  "M-R2-reliable": {"kind": "closed", "re": "A reliable third presence: too significant to exclude from negotiations, not strong enough to set their own terms[.]$"},
  "M-R2-threeway": {"kind": "closed", "re": "Genuinely three-way territory: no faction has decisively broken from the pack; every council vote is negotiated[.]$"},
  "M-RA-more": {"kind": "closed", "re": "The arcane orders currently hold more practical influence, which the clergy finds spiritually troubling and politically unacceptable[.]$"},
  "M-RL-narrow": {"kind": "closed", "re": "Their leverage is narrow and issue-specific; on broader questions they follow whoever is willing to deal with them that week[.]$"},
  "M-RT-denounce": {"kind": "closed", "re": "They denounce the guild from the pulpit; the guild funds two charitable institutions and makes the denunciations look selective[.]$"},
  "M-RT-outweighs": {"kind": "closed", "re": "The criminal network currently outweighs them[.] The clergy's moral authority is loud and largely unheeded[.]$"},
  "M-ST-administers": {"kind": "closed", "re": "The steward administers in the lord's name[.] The household is the source of that authority, not a rival to it, but the practical question of who signs what has become genuinely complicated[.]$"},
  "M-ST-arrangement": {"kind": "closed", "re": "The steward and the household have developed a working arrangement, but its terms are renegotiated whenever something important is at stake[.]$"},
  "M-ST-day": {"kind": "closed", "re": "Which one actually governs depends on the day and the question; both would say themselves[.]$"},
  "M-ST-defers": {"kind": "closed", "re": "The steward nominally governs but defers here more than the arrangement was designed to allow[.]$"},
  "M-ST-holds": {"kind": "closed", "re": "The steward holds the day-to-day authority; the household provides the legitimacy[.] In practice the line between them blurs whenever a petitioner finds one more receptive than the other[.]$"},
  "M-ST-overlap": {"kind": "closed", "re": "Overlapping claims with the steward create an ambiguity that everyone exploits: petitioners approach whichever authority is more likely to give the answer they want[.]$"},
  "M-TG-even": {"kind": "pattern", "re": "Running roughly even with the military in actual influence: the (?:garrison|guard|hired company|militia|watch) can arrest individuals, the guild can make the investigation expensive[.]$"},
  "M-TG-outflank": {"kind": "closed", "re": "They currently outflank the military in real leverage; there are officers on payroll and commanders who know better than to ask questions[.]$"},
  "M-TG-outweighs": {"kind": "pattern", "re": "The (?:garrison|guard|hired company|militia|watch) outweighs them institutionally[.] They survive by corrupting the lower ranks and making enforcement selectively unprofitable[.]$"},
  "MC-ahead": {"kind": "closed", "re": "The craft guilds currently carry more weight than they do, and the merchants are working to change that[.]$"},
  "MC-close": {"kind": "closed", "re": "The craft guilds are close behind, contesting every pricing and quality-standard decision they try to push through council[.]$"},
  "MC-outpaced": {"kind": "closed", "re": "The craft guilds are present but outpaced; merchants set prices, craft masters object, and merchants win more often than not[.]$"},
  "MT-reach": {"kind": "closed", "re": "The criminal network reaches further than the merchant guilds right now[.] Some merchants are paying for protection; others have become silent partners[.]$"},
  "MT-tolerate": {"kind": "closed", "re": "They tolerate the guild's cut because fighting it costs more than paying it, and nobody says so aloud[.]$"},
  "NM-ahead": {"kind": "closed", "re": "Still ahead of merchant interests in real influence, for now[.] They know the gap is narrowing and are arranging marriages accordingly[.]$"},
  "NM-closing": {"kind": "closed", "re": "The merchants are closing the gap, and the noble families are using every law and every social tie they have to slow them down[.]$"},
  "NM-guilds": {"kind": "closed", "re": "The merchant guilds now have more say: the noble families keep their titles, their land and their precedence, but the money has moved[.]$"},
  "NM-more": {"kind": "pattern", "re": "(?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}|an unseen interest) (?:has|have) more say now: the noble families keep their titles, their land and their precedence, but the money has moved[.]$"},
  "OC-named": {"kind": "pattern", "re": "It does not bargain for its way: (?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}|an unseen interest) (?:carries|carry) out what it decides, whatever its numbers[.]$"},
  "OC-none": {"kind": "closed", "re": "It does not bargain for its way: what it decides is carried out, whatever its numbers[.]$"},
  "R1-behind": {"kind": "pattern", "re": "Behind (?:(?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}|an unseen interest)|the governing council) by too much to challenge openly, so they get their way through petitions and procedure instead[.]$"},
  "R1-contest": {"kind": "closed", "re": "Close enough now to contest the seat, and they know it[.]$"},
  "R1-gap": {"kind": "pattern", "re": "The gap between them and (?:(?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}(?: ?/ ?[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5})?(?: [(][A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}[)])?|an unseen interest)|the governing council) is narrow[.] A single shift in patronage, scandal, or armed muscle could swap their positions[.]$"},
  "R1-nolead": {"kind": "closed", "re": "No one clearly leads here; one scandal or one lost ally could change who does[.]$"},
  "R1-resist": {"kind": "closed", "re": "They are strong enough to resist those above them, but too far behind to risk an open fight[.]$"},
  "R1-settled": {"kind": "closed", "re": "The order is settled for now; they are busy holding on to second place and make no move on first[.]$"},
  "R1-shadow": {"kind": "pattern", "re": "They operate in the shadow of (?:(?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}|an unseen interest)|the governing council), close enough to matter and too far behind to lead[.]$"},
  "R2-buy": {"kind": "pattern", "re": "Close enough to the two above that their support is worth buying; they play (?:(?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}|an unseen interest)|the second power) and (?:(?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}|an unseen interest)|the leading power) against each other when they can[.]$"},
  "R2-level": {"kind": "pattern", "re": "(?:Five|Four|Many|Six|Three) powers stand almost level here, and no one leads; every (?:council vote|decision) has to be bargained for[.]$"},
  "R2-table": {"kind": "closed", "re": "They are always at the table, but cannot set their own terms[.]$"},
  "RA-more": {"kind": "pattern", "re": "(?:[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}|an unseen interest) (?:has|have) more say right now, and the clergy cannot accept it[.]$"},
  "RA-shadow": {"kind": "closed", "re": "The arcane orders are present but operate in the clergy's shadow[.] Questions of what is sanctioned magic and what is heresy remain deliberately unresolved[.]$"},
  "RL-few": {"kind": "closed", "re": "They have a say on only a few matters; on everything else they side with whoever will deal with them that week[.]$"},
  "RT-denounce": {"kind": "closed", "re": "They denounce the guild from the pulpit; the guild gives openly to the poor and makes the denunciations look selective[.]$"},
  "RT-stronger": {"kind": "closed", "re": "The criminal network is stronger than they are[.] The clergy preach against it loudly, and few people listen[.]$"},
  "ST-claim": {"kind": "closed", "re": "They and the steward both claim the same authority, so petitioners go to whichever is likelier to say yes[.]$"},
  "ST-day": {"kind": "closed", "re": "Which one actually governs depends on the day and the question; each would say it does[.]$"},
  "ST-dayto": {"kind": "closed", "re": "The steward runs things day to day; the household gives the steward the right to[.] When a petitioner finds one of them more willing than the other, the line between them blurs[.]$"},
  "ST-gives": {"kind": "closed", "re": "The steward governs in name, but gives way to them more often than was ever intended[.]$"},
  "ST-tangle": {"kind": "closed", "re": "The steward rules in the lord's name, and the household is where that right comes from, but who signs what has become a tangle[.]$"},
  "ST-why": {"kind": "closed", "re": "They hold more direct influence than the steward appointed to govern in their name, which raises questions about why the steward exists at all[.]$"},
  "ST-worked": {"kind": "closed", "re": "The steward and the household have worked out who does what, but they bargain it again whenever something important is at stake[.]$"},
  "TG-even": {"kind": "pattern", "re": "They are roughly even with the military: the (?:garrison|guard|hired company|militia|watch) can arrest their people, and the guild can make every investigation costly[.]$"},
  "TG-far": {"kind": "pattern", "re": "The (?:garrison|guard|hired company|militia|watch) is far stronger[.] They survive by bribing the lower ranks and making it costly to arrest the wrong people[.]$"},
  "TG-pull": {"kind": "closed", "re": "They have more real pull than the military right now: officers on their payroll, and commanders who know better than to ask questions[.]$"}
}`
  // STANDING_FORMS end
))).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([id, r]) => Object.freeze({ id, re: new RegExp(`(?:^| )(${r.re})`) })));

/**
 * R5-DESC (212 (36) (a)): a power's desc as THE STANDING CUT leaves it (scripts/veil/standingForms.mjs :: cutDesc, the
 * reference; 212 :: _gallery_veil_withhold_always, rule for rule): over every row, the match in what remains; the EARLIEST
 * start (a same-span tie is the smaller id's: the base is the same) removed with its joining space; REPEATED while a row
 * matches (a rank line and its rivalry notes, joined by one space). A desc no row matches is returned as it is (a base:
 * E121 (b)). Also the belt's base (galleryRosterChoices.js :: withholdPowerCopies).
 * @param {string} desc @returns {string}
 */
export function standingBase(desc) {
  let rest = desc;
  for (;;) {
    let at = -1;
    for (const r of STANDING_ROWS) {
      const m = r.re.exec(rest);
      if (m && (at < 0 || m.index < at)) at = m.index;
    }
    if (at < 0) return rest;
    rest = rest.slice(0, at);
  }
}

/**
 * VEIL-21 (R2): every non-owner read's last pass, whatever the veil (in place, on the veil's own copy). Each rule names its
 * row of the roster-choice registry (src/domain/veil/rosterChoiceRegistry.js); 212 :: _gallery_veil_withhold_always holds
 * the same rules in the same order. A fixed-path pass: no text is scanned but the powers' descs, by the standing cut.
 * @param {Rec} s @returns {Rec}
 */
export function withholdAlways(s) {
  if (!isRec(s)) return s;
  // registry: conditions.severity (VR37: the number withheld; its band, severityBand, is sent as stored, tier 2)
  eachMinusAt(s, ['activeConditions'], ['severity']);
  // registry: defence.readiness.score (VR37: the label and its colours stay, tier 2)
  minusAt(s, ['defenseProfile', 'readiness'], ['score']);
  // registry: defence.scores.disaster
  // registry: defence.scores.economic
  // registry: defence.scores.internal
  // registry: defence.scores.magical
  // registry: defence.scores.military
  // registry: defence.scores.monster (VR33)
  minusAt(s, ['defenseProfile', 'scores'], ['disaster', 'economic', 'internal', 'magical', 'military', 'monster']);
  // registry: defence.economicGates (VR33: every gate, so the object goes whole)
  minusAt(s, ['defenseProfile'], ['economicGates']);
  // registry: compound.criminalEffective
  // registry: compound.criminalPreStress
  // registry: compound.economyOutput
  // registry: compound.magicInfluence
  // registry: compound.militaryEffective
  // registry: compound.religionInfluence
  minusAt(s, ['economicState', 'compound'], ['criminalEffective', 'criminalPreStress', 'economyOutput', 'magicInfluence', 'militaryEffective', 'religionInfluence']);
  // registry: safety.compound.criminalEffective
  // registry: safety.compound.criminalPreStress
  // registry: safety.compound.economyOutput
  // registry: safety.compound.magicInfluence
  // registry: safety.compound.militaryEffective
  // registry: safety.compound.religionInfluence
  minusAt(s, ['economicState', 'safetyProfile', 'compound'], ['criminalEffective', 'criminalPreStress', 'economyOutput', 'magicInfluence', 'militaryEffective', 'religionInfluence']);
  // registry: food.storageMonths
  // registry: food.storageNote
  minusAt(s, ['economicState', 'foodSecurity'], ['storageMonths', 'storageNote']);
  // registry: income.weight (item D withholds it in applyVeil and the unmarked read; here the map's unmarked member too)
  eachMinusAt(s, ['economicState', 'incomeSources'], ['weight']);
  // registry: economy.situationDesc
  minusAt(s, ['economicState'], ['situationDesc']);
  // registry: safety.blackMarketCapture
  // registry: safety.safetyRatio
  // registry: safety.crimeTypes (R3-TELL-8, ruling (b): the key on no shared read; the page re-derives it, pageRederive.js ::
  // rederiveCrimeTypes, where the served data proves its grouping open)
  minusAt(s, ['economicState', 'safetyProfile'], ['blackMarketCapture', 'safetyRatio', 'crimeTypes']);
  // registry: safety.flags.anyActive
  // registry: safety.flags.arcaneBlackMarket
  // registry: safety.flags.merchantArmy
  // registry: safety.flags.religiousFraud
  // registry: safety.flags.merchantCriminalBlur
  minusAt(s, ['economicState', 'safetyProfile', 'flags'], ['anyActive', 'arcaneBlackMarket', 'merchantArmy', 'religiousFraud', 'merchantCriminalBlur']);
  // registry: history.timeline.anchored
  // registry: history.timeline.year
  eachMinusAt(s, ['history', 'eventsTimeline'], ['anchored', 'year']);
  // registry: history.event.anchored
  eachMinusAt(s, ['history', 'historicalEvents'], ['anchored']);
  // registry: history.legacy
  // registry: history.siegeNarrative
  minusAt(s, ['history'], ['legacyAnnotations', 'siegeNarrative']);
  // registry: history.tension.maskedParty (R5-DESC, 212 (36) (c); E121 Q4): a current tension's party served as the mask
  // (HIDDEN_POWER_MASK, act T's owner-hidden taker) leaves its list, entry by entry; the tension stays
  const hi = recAt(s, 'history');
  if (hi && Array.isArray(hi.currentTensions)) {
    hi.currentTensions = hi.currentTensions.map((t) => (isRec(t) && Array.isArray(t.factions) ? { ...t, factions: t.factions.filter((f) => f !== HIDDEN_POWER_MASK) } : t));
  }
  // registry: npcs.stressNote
  eachMinusAt(s, ['npcs'], ['stressNote']);
  // registry: npcs.memberships.veiled
  if (Array.isArray(s.npcs)) for (const n of s.npcs) if (isRec(n)) eachMinusAt(n, ['memberships'], ['veiled']);
  // registry: power.fingerprint
  minusAt(s, ['powerStructure'], ['economyInputFingerprint']);
  // registry: power.recentConflict
  // registry: power.recentConflict.pressureSentence
  // (R5-RECENT, E92 (1), E93, E97 (1): the key on no shared read; the page re-derives it, pageRederive.js ::
  // rederiveRecentConflict. Its copy, the top-level pressureSentence wherever it EQUALS the stored recentConflict, judged
  // before the key leaves; the page does not re-fill it in this unit)
  const pw = recAt(s, 'powerStructure');
  if (pw && typeof pw.recentConflict === 'string' && typeof s.pressureSentence === 'string' && s.pressureSentence === pw.recentConflict) delete s.pressureSentence;
  minusAt(s, ['powerStructure'], ['recentConflict']);
  // registry: power.contestsNiche
  // registry: power.rawPower
  // registry: power.factions.legitimacyCrisis
  eachMinusAt(s, ['powerStructure', 'factions'], ['contestsNiche', 'rawPower', 'legitimacyCrisis']);
  // registry: power.relation.ratio (power.relation.direction is DRAWN, VR37: it goes with its relation, per entry)
  eachMinusAt(s, ['powerStructure', 'factionRelationships'], ['ratio']);
  // registry: power.desc
  // (R5-DESC, 212 (36) (a), (b); E115, E121, E126, E129): (b) first, a HIDDEN row (its own `hidden` true) or a MASKED one
  // (its `faction` or `name` HIDDEN_POWER_MASK) is served with no `desc`, both lists (E115 (2)); (a) every other string
  // desc of both lists loses its standing tail by THE ONE TABLE (standingBase); a desc no row matches stays as it is. The
  // page re-derives the standing (pageRederive.js :: rederiveStanding)
  /** @type {ReadonlyArray<unknown>} */
  const powerLists = [recAt(s, 'powerStructure')?.factions, s.factions];
  for (const list of powerLists) {
    if (!Array.isArray(list)) continue;
    for (const f of list) if (isRec(f) && (f.hidden === true || f.faction === HIDDEN_POWER_MASK || f.name === HIDDEN_POWER_MASK)) delete f.desc;
  }
  for (const list of powerLists) {
    if (!Array.isArray(list)) continue;
    for (const f of list) if (isRec(f) && typeof f.desc === 'string') f.desc = standingBase(f.desc);
  }
  // registry: legitimacy.breakdown
  minusAt(s, ['powerStructure', 'publicLegitimacy', 'breakdown'], ['prosperity', 'safety', 'defense']);
  // registry: legitimacy.crimMultiplier
  // registry: legitimacy.govMultiplier
  // registry: legitimacy.flags
  minusAt(s, ['powerStructure', 'publicLegitimacy'], ['crimMultiplier', 'govMultiplier', 'isApproved', 'isContested', 'isEndorsed', 'isTolerated', 'governanceFractured', 'isLegitimacyCrisis']);
  // registry: power.stability (VR19 (a), ruling 5): the band word before its cause stays; the cause goes; a value that is
  // not a string, or no word before its cause, goes
  const ps = recAt(s, 'powerStructure');
  if (ps && 'stability' in ps) {
    const word = typeof ps.stability === 'string' ? ps.stability.replace(STABILITY_CAUSE, '') : '';
    if (word !== '') ps.stability = word; else delete ps.stability;
  }
  // registry: prose.incomeWeight.alias
  // registry: prose.shadowEconomy.alias
  for (const k of ['economy:daily_life', 'economy:resources', 'economy:services']) minusAt(s, ['publicProse', 'blocks', k], ['incomeWeight', 'shadowEconomy']);
  // registry: prose.prosperity.glance
  minusAt(s, ['publicProse', 'blocks', 'economy:economics', 'prosperityHeader'], ['glance']);
  minusAt(s, ['publicProse', 'blocks', 'economy:economics', 'prosperityRung'], ['glance']);
  // registry: prose.conditionSeverity.glance
  minusAt(s, ['publicProse', 'blocks', 'stressors:overview', 'conditionSeverity'], ['glance']);
  // registry: spatial.quarters
  minusAt(s, ['spatialLayout'], ['quarters']);
  // registry: cast.absent
  // registry: cast.stakes
  // registry: cast.roles (castByServed: absent always; a stake or a role row per entry, by what is
  // served of the person, power or house it names)
  withholdCastByServed(s);
  // registry: prose.posture.posture
  // registry: prose.posture.prize
  // registry: prose.posture.terrain
  // registry: prose.state.firstSurvey
  // registry: prose.state.publicOrder.field
  // registry: prose.state.publicOrder.beside
  // registry: prose.state.publicOrder.rung.sentence
  // registry: prose.state.publicOrder.rung.glance
  // registry: prose.threat.economic
  // registry: prose.wall.rationale
  // registry: prose.incomeWeight (N53 (a): re-hosted with the 23)
  // registry: prose.shadowEconomy
  // registry: prose.incomeMix
  // registry: prose.prosperityHeader.detail
  // registry: prose.prosperity.sentence
  // registry: prose.legacyLines.a
  // registry: prose.legacyLines.b
  // registry: prose.legitimacyBanner
  // registry: prose.legitimacyLens
  // registry: prose.stabilityHeader
  // registry: prose.structureFlag
  // registry: prose.successionRisk
  // registry: prose.conditionSeverity
  // registry: prose.templeFraud
  // (N49 (a'), the ninth chair, 2026-11-23: NO publicProse IS SERVED ON ANY SHARED READ. The key leaves WHOLE, last, on
  // every body; the stored record keeps it, and the owner's own page prints it as today. The rules above that trim inside
  // it stand, dead, for the after-deploy unit (b))
  delete s.publicProse;
  return s;
}
