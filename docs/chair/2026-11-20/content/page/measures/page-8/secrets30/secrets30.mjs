// PAGE-8 SECRETS-30 (brief: docs/chair/2026-11-20/content/page/briefs/SECRETS-30.md): the secrets outside the four
// CRIME_KNOWLEDGE frames that stand on 30% or more of a size's places, ranked, with their pools, rows, draw, cost and the
// lines each needs; the first tranche's lines as data, their lint, and the bar after with them in place. Writes nothing
// under src/ or tests/; imports only modules it never changes (data, the kernel hash, the world law's two text readers, the
// title pool map).
//
//   the forge is SECRET-LINES' own (no new forge): from the tree's root
//     sh scripts/gate-mutex.sh --run -- node docs/chair/2026-11-20/content/page/measures/page-8/secret/secretLines.mjs forge "$PWD" <cache.json> 150
//   measure: node <this> measure "$PWD" <cache.json>   (reads the cache only)
//
// THE BAR (the chair's, by the SENTENCE, over ALL places of a size), exactly as secretLines.mjs reads it: a place counts once
// for a sentence when any card of it carries that sentence in npcs[].secret.what (or .stakes); every roster name, every power's
// name and the place's own name masked to `#`; the text cut into sentences after . ! or ?.
import { readFileSync } from 'node:fs';

const [, , MODE, L = process.cwd(), CACHE] = process.argv;
const say = (...a) => console.log(...a);
const pct = (a, b) => (b ? `${(100 * a / b).toFixed(1)}%` : 'n/a');
if (MODE !== 'measure') { say('mode: measure <tree> <cache.json>'); process.exit(2); }

const { TITLE_SECRETS } = await import(`${L}/src/data/people/titleSecretsPresentations.js`);
const { NPC_CRIMINAL_SECRETS_BY_HOLDER, CRIMINAL_SECRET_LEGACY_ORDER, CRIMINAL_SECRET_HOLDER_TAGS, SECRETS_DENIED_BY_TEMPERAMENT } = await import(`${L}/src/data/npcData.js`);
const { fnv1a32 } = await import(`${L}/src/kernel/proseHash.js`);
const { POOL_BY_TITLE } = await import(`${L}/src/generators/people/poolMap.js`);
const { generatedContentTopicsOf } = await import(`${L}/src/domain/generationContentProfile.js`);
const { textAssertsFunctionalMagic } = await import(`${L}/src/domain/magicAssertionText.js`);
// pickVariantMixed's finalizer (origin lane/kernel-mix-2026-11-20 bd42d63c7, src/kernel/proseHash.js :: mix32), copied verbatim
// as secretLines.mjs copies it (the lane tip 575936eac does not carry it yet).
const mix32 = (h) => { h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return h >>> 0; };
const pickMixed = (n, seed) => (n <= 1 || !seed ? 0 : mix32(fnv1a32(String(seed))) % n);

// ── THE FIRST TRANCHE (SECRETS-30-TO-CHAIR.md §4): each row's base, then its drafted siblings [what, stakes] ─────────────
export const TRANCHE = [
  { base: ['Secretly receives what they believe are genuine divine visions, which terrifies them', 'Acting on the visions would be seen as madness; ignoring them may be worse'], houses: [], lines: [
    ['Hears a voice at prayer that answers back, and has told no one what it asks of them', 'If it came out, some would call them touched and others would start to follow them'],
    ['Has begun to see the same stranger in every crowd, and is certain the figure was sent as a warning', 'Speaking of it would end their standing, and silence is costing them sleep'],
    ['Wakes most nights from one recurring dream of fire, and has come to believe it means something', 'Anyone who relies on their judgement would think twice if word of it got out'],
    ['Has felt a presence at their shoulder ever since a night they refuse to describe, and fears it', 'Talk of it would make them a curiosity at best, and their rivals would see that it went worse'],
    ['Believes a sign was given to them alone, and has been quietly arranging their affairs around it', 'Those whose dealings have been bent to suit it will want an account when they find out'],
    ['Has been given words in a vision that they write down each morning and destroy each night', 'Someone has found a scrap that was missed, and has been trying to read it'],
  ] },
  { base: ['Built a roof with green timber to save the cost, and the beams have started to split', 'When that roof comes down, the people under it and the people who paid for it will know who built it'], houses: [], lines: [
    ['Put up a floor on joists set too far apart, and it has begun to bow under a heavy table', 'If it gives way with a room full of people on it, everyone will remember who laid it'],
    ['Fitted a staircase with a tread cut short, and has said nothing though two people have fallen on it', 'Someone will break a bone on it before long, and the owner has started asking questions'],
    ['Skipped half the bracing on a big job to finish by the promised day, and the frame has started to lean', 'Anyone passing can see it now, and the customer has begun to ask why'],
    ['Glued and painted over a cracked beam rather than replace it, and told the owner the work was sound', 'A coat of colour does not carry weight, and the room above is used more every year'],
    ['Has been using nails where the trade calls for pegs, to finish faster, and the joints are coming loose', 'Every piece made that way will fail together, and all of it can be traced back to one bench'],
  ] },
  { base: ["Lit the fire that burned out a rival's shop three years ago, and told everyone it was an accident with a lamp", "The rival's family never believed it, and a witness has turned up"], houses: ['shop'], lines: [
    ["Left a lamp burning in the storeroom one night, and the fire that followed was laid at the next-door hearth", 'The one who was blamed paid for the damage and has never stopped wondering how it started'],
    ['Mixes something into the tallow to make it burn brighter, and the fumes have been making customers ill', 'Someone has begun asking what the sick have in common, and the answer is on the shelves'],
    ['Let a lamp they knew was faulty go out to a buyer, and the blaze it started was put down to bad luck', 'The burnt fitting was kept, and someone has just recognised the maker\'s mark on it'],
    ['Has been pouring spent lye into the gutter behind the shop, and the ground there has turned foul', 'Those who live nearby have noticed the stink, and are asking where it comes from'],
  ] },
  { base: ['Has been embezzling from the organisation they oversee for three years', 'Exposure means disgrace, legal prosecution, and enemies who feel personally betrayed'], houses: [], lines: [
    ['Has been privately skimming what passes through their hands, a little at a time, for longer than anyone would guess', 'When the accounts are finally checked, the shortfall will lead straight to them'],
    ['Has been embezzling from the funds placed in their keeping, and covering each loss with the next', 'One honest audit would bring the whole chain down, and they have run out of ways to delay it'],
    ['Has been skimming the common purse to settle their own debts, and privately calls it a loan', 'Those who trusted them with the money would see it very differently'],
    ['Has been embezzling small sums through an assistant who believes the gaps are honest mistakes', 'The one who made the entries has begun to see a pattern, and is deciding whom to tell'],
  ] },
  { base: ["Knows the settlement's most important legal document was fraudulently created", 'Revealing it destabilises everything; not revealing it makes them complicit'], houses: [], lines: [
    ['Knows the boundary everyone accepts was falsified when it was first drawn, and by whom', 'Saying so would unsettle every claim that rests on it; staying silent makes them part of it'],
    ['Knows the oldest grant the place holds was falsified by the very hand that witnessed it', 'Every right that hangs on it would be open to challenge, beginning with theirs'],
    ['Knows the tally of who owes what to whom was fabricated long ago to settle a quarrel', 'Putting it right would reopen old wounds and show who did the work'],
    ['Knows the agreement everyone cites was made up after the fact, and that nobody ever put their hand to it', 'Whoever raises it will be asked how long they have kept quiet'],
  ] },
  { base: ['Has been drugging fighters before bouts so they lose on the day the money says they should', 'A fighter who died after a bout had something in his blood, and his friends saw it'], houses: ['school'], lines: [
    ['Sends fighters back out on wounds that have not closed, and tells the crowd they are fit', 'One of them collapsed in the middle of a bout last time, and the others have begun to talk'],
    ['Has been matching a favoured fighter only against those who are carrying hidden injuries', 'The ones who lost have compared notes, and the pattern is plain to them'],
    ['Lets the practice weapons go unchecked, and one that should have been blunted laid open a trainee\'s arm', 'That fighter has kept the scar, and the edge that made it, and is waiting for the right listener'],
  ] },
  { base: ['Secretly directs a fencing operation through a trusted intermediary', 'Criminal liability and the end of any political or social standing'], houses: [], lines: [
    ['Quietly sells on goods that arrive without papers, through a go-between who carries the risk', 'If that middleman is ever caught, the trail runs straight back to them'],
    ['Holds a hidden stake in a back-room trade selling goods no one asks the origin of', 'Exposure would end their standing, and the partners would not take the loss kindly'],
    ['Arranges the selling of goods no honest owner would part with, and never touches any of it themselves', 'One careless buyer could tie them to all of it'],
  ] },
  { base: ['Was directly responsible for a death that was ruled an accident', 'Criminal liability and the complete destruction of their reputation'], houses: [], lines: [
    ['Caused the fall that lamed a neighbour, and let everyone believe the ladder simply gave way', 'The one who was hurt has never walked well since, and would not forgive being deceived'],
    ['Gave the order that sent someone into a danger they never came back from, and let it be called misfortune', 'If the truth were known, the friends of the one who was lost would want more than an apology'],
    ['Struck a stranger in a quarrel that ended badly, and let it be put down to a stumble in the dark', 'Someone saw more than they have said, and has begun to hint at it'],
  ] },
  { base: ['Has been feeding strategic intelligence to outsiders who pay for it', 'Treason charges; execution or exile in most jurisdictions'], houses: [], lines: [
    ["Has been selling information on the place's weak points to a buyer from outside", 'If it is ever acted on, the charge would be treason, and few would speak for them'],
    ['Has passed information from every important gathering to outsiders, for coin', 'Those buyers keep records too, and one bad day for them would be a far worse one here'],
  ] },
  { base: ['Ran up gambling debts and has been quietly selling the tools of the shop one by one to pay them', 'The shop cannot fill its orders much longer, and the people owed the shoes have already paid'], houses: ['shop'], lines: [
    ['Has been selling the leather set aside for orders already taken, to cover a debt kept hidden from everyone at the bench', 'Customers who paid in advance are still waiting, and their patience is running short'],
    ["Sold the shop's best lasts for coin to cover a loan that went wrong, and works now with borrowed ones", 'Their owner wants them back within the month, and there is nothing left to buy them with'],
    ["Has been selling shoes made to one person's order to anyone who offers more, and telling the first the work was spoiled", 'That buyer has since seen the pair walking past on someone else'],
  ] },
  { base: ['Ordered what was officially ruled an accident, and sleeps fine about it', "Murder charge, loss of everything, and the victim's family who suspects the truth"], houses: [], lines: [
    ["Arranged the mishap that everyone calls bad luck, and has never lost a night's sleep over it", 'Someone who was there that day has started to remember it differently'],
    ['Had a rival ruined by a rumour of their own making, and watched them leave without a word of regret', 'That old opponent has come back, and is asking where the story began'],
  ] },
  { base: ['Has been recording lower duties than were paid and keeping the difference', 'Anyone who checks the receipts against the books would find years of missing coin'], houses: [], lines: [
    ['Has been weighing loads short on the scales and keeps the extra duty for themselves', 'One trader has started checking every cargo before it arrives, and the figures do not agree'],
    ['Lets favoured carts through at a lower rate because someone paid them to look away', 'The drivers charged in full have noticed which wagons never wait'],
  ] },
  { base: ["Copied a rival's pattern stitch for stitch and sold it for years as their own design", 'The rival has the original drawings and has been waiting for the right moment to show them'], houses: [], lines: [
    ['Takes the credit for a weave an apprentice worked out, and has never once said whose it was', 'The true inventor has moved on, and tells the story to anyone who will listen'],
    ['Wove a commissioned piece with a mistake near its heart and covered it with the border', 'The buyer displays it to every visitor, and the fault is beginning to come through'],
    ['Has been passing off a cheaper yarn in the finest work and charging for the best', 'Anyone at a loom who handles the cloth could tell, and one already has'],
  ] },
  { base: ['Keeps a prisoner in the cells long after their sentence ended, at the request of someone who pays for it', "The prisoner's family thinks they are dead; if they learn otherwise, they will want to know why"], houses: [], lines: [
    ['Hands out the better cells for coin, and puts anyone who cannot find it on bare stone', 'One inmate who fell ill down there has friends outside, and they have heard how it happened'],
    ['Has been selling word of who sits in which cell to anyone who asks', 'A prisoner found that way has had unwelcome visitors since, and their friends want to know who talked'],
  ] },
  { base: ['Has been delaying vital information from reaching the decision-makers', 'When the consequences emerge, the delay will be investigated and traced'], houses: [], lines: [
    ['Has been holding back warnings that should have gone up the line, until it was too late to act on them', 'Sooner or later someone will ask why the news always reached the top a day behind'],
    ['Has been sitting on reports that would change minds at the head of things, and letting the old course run on', 'When it goes wrong, those papers will be found with the day of their arrival on them'],
    ['Has been steering what is put to those in charge so that the awkward matters never come up', 'Someone whose question was struck off has noticed, and wants to know who did it'],
  ] },
  { base: ['Lets the furnace smoke and run-off poison the stream below the smelter, and pays a man to keep quiet', 'The families downstream whose animals died would want someone to blame, and it would not be the man who was paid'], houses: [], lines: [
    ['Has been tipping slag into an old pit behind the works, and nothing will grow for a long way round', 'The ground is spreading the damage, and the neighbours have begun to ask why'],
    ['Keeps the furnace running harder than its walls were built for, and the cracks have been patched rather than mended', 'When it gives, those working beside it will be the first to learn of it'],
  ] },
  { base: ['Sells green planks as seasoned and the buildings made from them warp within a year', 'The builders who used the wood would want their losses back, and their customers would want them first'], houses: [], lines: [
    ['Sells boards with the rot cut out and the gaps filled, and they give way under load', 'Whoever built with them will want their losses made good, and soon'],
    ['Has been selling short lengths as full ones, using a measuring rod that was cut down', 'One customer has checked a load at home and found what is missing'],
  ] },
  { base: ['Takes a monthly payment to keep patrols away from certain streets on certain nights', 'The streets that were left alone have seen crimes, and the payments are written down somewhere'], houses: [], lines: [
    ['Has been paid to look the other way when certain carts come in after dark', 'What came in on those nights has started turning up where it should not, and questions are being asked'],
    ['Has debtors picked up on small charges for a moneylender, for a share of whatever is recovered', 'Those taken in have begun comparing notes, and the same creditor stands behind every one'],
  ] },
  { base: ['Lets families who give generously jump the line for beds while the poor wait in the hall', "A patient died in the hall last winter while a bed stood empty for a patron's servant"], houses: [], lines: [
    ['Keeps the quiet rooms for patients whose patrons give generously, and puts the rest on pallets in the corridor', 'One of those left outside did not recover, and the people who brought them have started asking why'],
    ['Sells the best care in the place to whoever offers most, and leaves everyone else to the novices', 'A mistake by one of the untrained cost a life lately, and the master signed the roster that day'],
  ] },
  { base: ['Sells cheap colours as costly ones, and they wash out at the first rain', 'Every tailor who bought the cloth would want the difference back, and so would their customers'], houses: [], lines: [
    ['Sells a single dipping as a double one, and the colour fades within weeks of wear', 'Buyers have begun holding old pieces up against new ones, and seeing the difference'],
    ['Has been selling a cheap blue as the costly kind that comes from far away, and few can tell until it runs', 'One customer who noticed has kept quiet until now, and has been collecting samples'],
  ] },
];

const towns = JSON.parse(readFileSync(CACHE, 'utf8'));
const SIZES = [...new Set(towns.map((t) => t.size))];
const maskerOf = (t) => {
  const names = [...new Set([...t.npcs.map((n) => n.name), ...(t.powers || []), t.name].filter((x) => typeof x === 'string' && x.trim()))].sort((a, b) => b.length - a.length);
  return (s) => { let o = String(s); for (const n of names) o = o.split(n).join('#'); return o; };
};
const sentences = (s) => String(s).split(/(?<=[.!?])\s+/).map((x) => x.trim().replace(/[.]$/, '')).filter(Boolean);

// The four frames (SECRET-LINES-BUILD's): left out, by their base rows' sentences.
const FRAME_ROWS = [
  ['Knows something about # that # believes no one else knows, and has been deciding for months whether to use it', '# would move against them immediately if they suspected'],
  ["Was present when # did something they've never accounted for publicly. Neither has acknowledged the other was there", "The situation they're both ignoring is becoming relevant again"],
  ['Owes # a debt from before either of them held their current position: one that # has never formally called in', 'The silence feels like patience, and it is not forgiveness'],
  ["Has been reading #'s correspondence through an intermediary. Nothing damaging yet. But they keep looking", 'The intermediary has recently started asking for more money'],
];
const FRAME_SENTENCES = new Set(FRAME_ROWS.flatMap(([w, s]) => [...sentences(w), ...sentences(s)]));

// ── THE POOLS, BY SYMBOL: every row a card's secret can be dealt from outside the frames ──────────────────────────────────
/** @type {Array<{ pool: string, i: number, n: string, secret: string, stakes: string, draw: string }>} */
const ROWS = [];
for (const [title, rows] of Object.entries(TITLE_SECRETS)) rows.forEach((r, i) => ROWS.push({
  pool: `titleSecretsPresentations.js TITLE_SECRETS["${title}"]`, i, n: `${rows.length}`, secret: r.secret, stakes: r.stakes, title,
  draw: 'pickFromArray (rngContext.pick, ONE roll) over the title\'s unheld rows (npcGenerator.js :: generateSingleNPC); settleTitleLines\' next admitted row where a declaration refuses it',
}));
for (const [holder, types] of Object.entries(NPC_CRIMINAL_SECRETS_BY_HOLDER)) for (const [type, rows] of Object.entries(types)) rows.forEach((r, i) => {
  const order = CRIMINAL_SECRET_LEGACY_ORDER[type];
  const n = order ? `${NPC_CRIMINAL_SECRETS_BY_HOLDER.any[type]?.length ?? 0} for any holder; ${order.length} for a ${order.find((k) => k !== 'any')} holder` : `${rows.length}`;
  ROWS.push({ pool: `npcData.js NPC_CRIMINAL_SECRETS_BY_HOLDER.${holder}.${type}`, i, n, secret: r.secret, stakes: r.stakes, type,
    draw: `factionLeaderSecret.js :: generateFactionLeaderSecret: the TYPE roll (weights by the place's houses and settings), then drawRefusingHeldThrough (ONE roll) over criminalSecretsForHolder("${type}", class), the personal bucket behind it; S9's post-pass moves a misfit (tag, venal to principled) to the next admitted row` });
});
/** sentence -> [{ row, field }] */
const BY_SENTENCE = new Map();
for (const r of ROWS) for (const [field, text] of [['what', r.secret], ['stakes', r.stakes]]) for (const s of sentences(text)) BY_SENTENCE.set(s, (BY_SENTENCE.get(s) || []).concat({ r, field }));
const rowKey = (r) => `${r.pool}[${r.i}]`;
const ROW_BY_SECRET = new Map(ROWS.map((r) => [r.secret, r]));
// A card whose dealt text a draw-free carry rewrote (the guild rewrite of mergeNPCLists, the underworld carry of castPowers,
// the no-market carry) is matched by its row's stakes, where no other row shares them.
const stakesCount = new Map(); for (const r of ROWS) stakesCount.set(r.stakes, (stakesCount.get(r.stakes) || 0) + 1);
const ROW_BY_STAKES = new Map(ROWS.filter((r) => stakesCount.get(r.stakes) === 1).map((r) => [r.stakes, r]));
const rowOfCard = (n) => ROW_BY_SECRET.get(n.what) || ROW_BY_STAKES.get(n.stakes) || null;
/** A title row's house is of a hideable kind (cardVeil.js :: isHideableHouse reads a criminal category first): the title's
 *  pool category (poolMap.js :: POOL_BY_TITLE) is criminal. */
const hideable = (r) => !!r.title && POOL_BY_TITLE[r.title]?.[1] === 'criminal';

// ── THE BAR, BEFORE ───────────────────────────────────────────────────────────────────────────────────────────────────────
/** per size: Map sentence -> places. `wordingOf(t, n)` may hand a card another [what, stakes] (the projection). */
function tally(field, wordingOf = null) {
  const out = new Map();
  for (const size of SIZES) {
    const ts = towns.filter((t) => t.size === size); const per = new Map();
    for (const t of ts) {
      const mask = maskerOf(t); const seen = new Set();
      for (const n of t.npcs) {
        const w = wordingOf ? wordingOf(t, n) : null;
        const text = w ? w[field === 'what' ? 0 : 1] : n[field] ? mask(n[field]) : null;
        if (!text) continue;
        for (const s of sentences(text)) seen.add(s);
      }
      for (const s of seen) per.set(s, (per.get(s) || 0) + 1);
    }
    out.set(size, { n: ts.length, per });
  }
  return out;
}
const before = { what: tally('what'), stakes: tally('stakes') };
const shareOf = (tb, s) => Object.fromEntries(SIZES.map((size) => { const { n, per } = tb.get(size); return [size, (per.get(s) || 0) / n]; }));

say(`SECRETS-30 measure: ${towns.length} places (${SIZES.map((s) => `${s} ${towns.filter((t) => t.size === s).length}`).join(', ')}); cache ${CACHE}`);

// every sentence at or above 30% of some size, outside the frames
const over = [];
for (const field of ['what', 'stakes']) {
  const seen = new Set();
  for (const [, { n, per }] of before[field]) for (const [s, c] of per) if (c / n >= 0.30 && !FRAME_SENTENCES.has(s) && !seen.has(s)) { seen.add(s); over.push({ field, s, share: shareOf(before[field], s) }); }
}
const top = (x) => Math.max(...Object.values(x.share));
over.sort((a, b) => top(b) - top(a) || a.s.localeCompare(b.s));
const unmatched = over.filter((x) => !BY_SENTENCE.has(x.s));
say(`\n§1 SENTENCES ON 30%+ OF A SIZE'S PLACES, OUTSIDE THE FOUR FRAMES: what ${over.filter((x) => x.field === 'what').length}, stakes ${over.filter((x) => x.field === 'stakes').length}; by size (what/stakes): ${SIZES.map((size) => `${size} ${over.filter((x) => x.field === 'what' && x.share[size] >= 0.3).length}/${over.filter((x) => x.field === 'stakes' && x.share[size] >= 0.3).length}`).join(' | ')}; no pool found for ${unmatched.length}${unmatched.length ? `: ${unmatched.map((x) => `"${x.s}"`).join(' · ')}` : ''}`);

// ── THE ROWS BEHIND THEM, AND WHAT EACH NEEDS ─────────────────────────────────────────────────────────────────────────────
// A row's card set (raw text, exact): a card whose secret.what IS the row's secret. The held refusal (hookRegistry.secrets,
// REVIEW-INTAKE-4) deals a row at most once a place; counted below.
const holdersOf = new Map();
for (const t of towns) t.npcs.forEach((n) => { const r = rowOfCard(n); if (r) { const k = rowKey(r); if (!holdersOf.has(k)) holdersOf.set(k, []); holdersOf.get(k).push({ t, n }); } });
const KEYS = [(t, r, n) => `${t.seed}::${r.pool}:${r.i}::${n.idx}`, (t, r) => `${t.seed}::${r.pool}:${r.i}`, (t, r, n) => `${t.seed}::${n.name}::${r.i}`,
  ...[1, 2, 3, 4, 5, 6, 7].map((s) => (t, r, n) => `${t.seed}::secrets30-${s}::${rowKey(r)}::${n.idx}`)];
/** the commonest single wording's share of a size's places, the row at k wordings, under key K: max over sizes */
function rowMaxAt(r, k, key) {
  const hs = holdersOf.get(rowKey(r)) || []; let worst = 0;
  for (const size of SIZES) {
    const nPlaces = towns.filter((t) => t.size === size).length; const c = new Map();
    for (const { t, n } of hs) if (t.size === size) { const w = pickMixed(k, key(t, r, n)); const id = `${t.seed}`; c.set(w, (c.get(w) || new Set()).add(id)); }
    for (const v of c.values()) worst = Math.max(worst, v.size / nPlaces);
  }
  return worst;
}
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor((xs.length - 1) / 2)];
function kFor(r, bar) { for (let k = 1; k <= 40; k += 1) { const m = median(KEYS.map((key) => rowMaxAt(r, k, key))); if (m < bar) return k; } return Infinity; }

const VENAL = /embezzl|fencing|payroll|brib|protection scheme|for a fee|contraband|skim|selling|\bsells\b|betting against|exploitative labour|suppress a finding|been paid|paid to|is paid|for a share|pocket|keeping back|on the side|smuggl|overcharg|charges the families|cut of|kickback|monthly payment|for a purse|who pays? for it|families can pay|taking offerings|give generously|for money|for gold|for coin/i; // F5's (f5.mjs :: venalRe)
const rowsSeen = new Map();
for (const x of over) for (const { r } of BY_SENTENCE.get(x.s) || []) if ((holdersOf.get(rowKey(r)) || []).length && !rowsSeen.has(rowKey(r))) rowsSeen.set(rowKey(r), r);
const RANKED = [...rowsSeen.values()].map((r) => {
  const hs = holdersOf.get(rowKey(r)) || [];
  const placeShare = Object.fromEntries(SIZES.map((size) => { const ts = towns.filter((t) => t.size === size); return [size, new Set(hs.filter((h) => h.t.size === size).map((h) => h.t.seed)).size / ts.length]; }));
  const twice = towns.filter((t) => hs.filter((h) => h.t === t).length > 1).length;
  const holders = new Map(); for (const { n } of hs) holders.set(n.title || n.role || '?', (holders.get(n.title || n.role || '?') || 0) + 1);
  return { r, hs, placeShare, twice, holders: [...holders].sort((a, b) => b[1] - a[1]), k30: kFor(r, 0.30), k15: kFor(r, 0.15),
    venal: VENAL.test(r.secret), s9venal: SECRETS_DENIED_BY_TEMPERAMENT.incorruptible.test(r.secret), tag: CRIMINAL_SECRET_HOLDER_TAGS[r.secret] || null };
}).sort((a, b) => Math.max(...Object.values(b.placeShare)) - Math.max(...Object.values(a.placeShare)) || (a.r.n === '1' ? -1 : 0));
const sh = (o) => SIZES.filter((s) => o[s] >= 0.005).map((s) => `${s.slice(0, 4)} ${(100 * o[s]).toFixed(1)}`).join(' ');
say(`\n§2 THE ROWS (by the row's share of a size's places, its highest size first): ${RANKED.length} rows; dealt twice in one place: ${RANKED.reduce((a, x) => a + x.twice, 0)} places`);
RANKED.forEach((x, j) => say(`  ${String(j + 1).padStart(3)}. ${sh(x.placeShare)} | rows ${x.r.n} | ${x.r.pool}[${x.r.i}] | lines <30%: ${x.k30 - 1}, <15%: ${x.k15 - 1} | venal ${x.venal ? 'Y' : 'n'}${x.s9venal ? ' (S9 word)' : ''}${x.tag ? ` | tag ${x.tag.join('/')}` : ''} ${hideable(x.r) ? ' | HIDEABLE HOUSE (criminal)' : ''} | holders ${x.holders.slice(0, 4).map(([h, c]) => `${h} ${c}`).join(', ')} | "${x.r.secret}" / "${x.r.stakes}"`));
const sum = (f) => RANKED.reduce((a, x) => a + f(x), 0);
say(`  TOTAL lines for every row under 30%: ${sum((x) => x.k30 - 1)}; under 15%: ${sum((x) => x.k15 - 1)} (median of ten keys, the row's worst size)`);
say(`  by pool kind: ${['TITLE_SECRETS', 'NPC_CRIMINAL_SECRETS_BY_HOLDER'].map((k) => { const xs = RANKED.filter((x) => x.r.pool.includes(k)); return `${k} ${xs.length} rows, <30% ${xs.reduce((a, x) => a + x.k30 - 1, 0)} lines, <15% ${xs.reduce((a, x) => a + x.k15 - 1, 0)}`; }).join(' | ')}`);
const shared = over.filter((x) => (BY_SENTENCE.get(x.s) || []).length > 1);
say(`  sentences held by more than one row: ${shared.length ? shared.map((x) => `"${x.s}" (${BY_SENTENCE.get(x.s).map(({ r }) => rowKey(r)).join(', ')})`).join(' · ') : 'none'}`);

say('\n§3 EVERY SENTENCE ON 30%+ (rank by its highest size; what/stakes; its row):');
over.forEach((x, j) => say(`  ${String(j + 1).padStart(3)}. ${x.field.padEnd(6)} ${sh(x.share)} | ${(BY_SENTENCE.get(x.s) || []).map(({ r }) => rowKey(r)).join(', ')} | "${x.s}"`));

// ── THE TRANCHE'S LINT ────────────────────────────────────────────────────────────────────────────────────────────────────
const STRESS = { dangerous: ['negotiating', 'selling information', 'selling patrol', 'feeding information', 'feeding', 'betrayer', 'infiltrator', 'patrol routes', 'occupation authority', 'without the council', 'passed information', 'cell', 'surrendered', 'names to avoid', 'legitimise', 'names to', 'abandon', 'leave before', 'personal arrangements'],
  compromised: ['privately', 'private arrangement', 'side payment', 'embezzl', 'hidden cache', 'suppress', 'false report', 'false harvest', 'covert route', 'private source', 'documentation proving', 'private terms', 'hoarding'],
  significant: ['documentation', 'evidence', 'knows', 'original', 'clause'] }; // npcGenerator.js :: getStressHistory
const stressClass = (what) => { const w = what.toLowerCase(); return JSON.stringify({ d: STRESS.dangerous.some((x) => w.includes(x)) || (w.includes('resistance') && w.includes('identified')), c: STRESS.compromised.some((x) => w.includes(x)) || (w.includes('secret') && w.includes('cache')), s: STRESS.significant.some((x) => w.includes(x)) }); };
const temperClass = (what) => JSON.stringify(Object.fromEntries(Object.entries(SECRETS_DENIED_BY_TEMPERAMENT).map(([k, re]) => [k, re.test(what)]))); // npcData.js :: deniesSecret
const REWRITTEN = /merchant|thieves|guild|criminal/i; // npcGenerator.js :: mergeNPCLists, factionLeaderSecret.js :: withoutMarketWords, crimeSignal.js :: withTownsOwnUnderworld
const HOUSE_WORDS = /\b(inn|tavern|alehouse|mill|miller|smithy|forge|temple|chapel|church|shrine|priests?|market|stall|court|judge|magistrate|gaol|jail|prison|watch|guard|garrison|council|granary|dock|harbour|wharf|quay|boats?|ships?|river|stream|sea|shore|forest|woods|mine|school|hospital|bank|warehouse|shop|workshop|yard|guildhall|bakery|brewery|college|academy|library|arena|theatre|baths|healer|physician|smiths?|tailors?|bakers?|builders?|masons?|carpenters?|weavers?|apothecary|brewers?|butchers?|fishermen|farmers?|fields?|barns?|lords?)\b/i; // a house, a place-feature or another trade: only those the line LISTS (its holder's own)
const CRIME_WORDS = /\b(theft|thief|stole|stolen|steal|murder|kill|killed|crime|smuggl\w*|gang|racket|bribe\w*|forged|forgery|forging|fraud|break-in|robbed|robbery|poison\w*|fence|fencing)\b/i;
const AGE_HOUSEHOLD = /\b(young|youth|child|children|boy|girl|lad|aged?|years old|elderly|old age|wife|husband|son|daughter|brother|sister|mother|father|family|families|household|households|widow\w*|married|marriage|grand\w+|heir|parent\w*|kin)\b/i;
const SEASON = /\b(winter|summer|spring|autumn|season\w*|harvest\w*|rain\w*|snow\w*|frost\w*|storm\w*|drought|weather|cold|heat|hot|thaw|ice|icy|wet|dry)\b/i;
const MAGIC = /\b(magic\w*|spell\w*|wizard\w*|arcane|enchant\w*|charm\w*|ritual\w*|curse\w*)\b/i;
const STOP = new Set('a an and are as at be been but by for from had has have he her his i if in into is it its no nor not of on one or our out over she so than that the their them then there they this those to too up us was we were what when where which while who whom why will with would you your all any each every more most much other some such only own same few both just ever never yet once about after again against before between down off under until very can could may might must shall should do does did done being having'.split(' '));
const stem = (w) => w.toLowerCase().replace(/['’]s$/, '').replace(/(ings?|ed|es|s|ly)$/, '').slice(0, 6);
const echoes = (text) => { const ws = text.toLowerCase().match(/[a-z’']+/g) || []; const seen = new Map(); const out = []; for (const w of ws) { if (STOP.has(w) || w.length < 3) continue; const k = stem(w); if (seen.has(k) && seen.get(k) !== w) out.push(`${seen.get(k)}~${w}`); else if (seen.has(k)) out.push(w); else seen.set(k, w); } return out; };

say('\n§4 THE TRANCHE\'S LINT (each drafted line, what and stakes, against its base row):');
let bad = 0; const allTexts = new Map(); let lines = 0;
for (const tr of TRANCHE) {
  const r = ROW_BY_SECRET.get(tr.base[0]);
  if (!r || r.stakes !== tr.base[1]) { say(`  BASE NOT FOUND: "${tr.base[0]}"`); bad += 1; continue; }
  tr.row = r;
  if (hideable(r)) { say(`  ${rowKey(r)}: its house is of a hideable kind; no line is drafted for it`); bad += 1; }
  for (const s of [...sentences(r.secret), ...sentences(r.stakes)]) allTexts.set(s, (allTexts.get(s) || []).concat(`${rowKey(r)} base`));
  tr.lines.forEach(([what, stakes], j) => {
    lines += 1; const both = `${what} ${stakes}`; const errs = [];
    for (const s of [...sentences(what), ...sentences(stakes)]) allTexts.set(s, (allTexts.get(s) || []).concat(`${rowKey(r)} #${j + 1}`));
    if (stressClass(what) !== stressClass(r.secret)) errs.push(`getStressHistory class ${stressClass(what)} (base ${stressClass(r.secret)})`);
    if (temperClass(what) !== temperClass(r.secret)) errs.push(`temperament-denial class ${temperClass(what)} (base ${temperClass(r.secret)})`);
    if (VENAL.test(what) !== VENAL.test(r.secret)) errs.push(`F5 venal ${VENAL.test(what)} (base ${VENAL.test(r.secret)})`);
    if (VENAL.test(stakes) && !VENAL.test(r.secret)) errs.push('venal stakes on a non-venal row');
    if (REWRITTEN.test(both)) errs.push('a word the merge or the underworld carry rewrites');
    const topics = (x) => JSON.stringify(generatedContentTopicsOf(x)); // generationContentProfile.js: the settings' content boundaries
    if (generatedContentTopicsOf(both).some((tp) => !generatedContentTopicsOf(`${r.secret} ${r.stakes}`).includes(tp))) errs.push(`a content topic its base lacks ${topics(both)}`);
    if (textAssertsFunctionalMagic(both) && !textAssertsFunctionalMagic(`${r.secret} ${r.stakes}`)) errs.push('asserts working magic where its base does not (generationContext.js :: allowsSecret)');
    if (/\b(?:binding pact|placed compulsion)\b/i.test(both)) errs.push('allowsSecret\'s local magic words');
    const houses = [...both.matchAll(new RegExp(HOUSE_WORDS.source, 'gi'))].map((m) => m[0].toLowerCase()).filter((w) => !(tr.houses || []).includes(w));
    if (houses.length) errs.push(`a house or place-feature word not listed (${houses.join(', ')})`);
    if (CRIME_WORDS.test(both) && !CRIME_WORDS.test(`${r.secret} ${r.stakes}`)) errs.push(`a crime word (${both.match(CRIME_WORDS)[0]})`);
    if (AGE_HOUSEHOLD.test(both)) errs.push(`an age or household word (${both.match(AGE_HOUSEHOLD)[0]})`);
    if (SEASON.test(both)) errs.push(`a season or climate word (${both.match(SEASON)[0]})`);
    if (MAGIC.test(both) && !MAGIC.test(`${r.secret} ${r.stakes}`)) errs.push(`a magic word (${both.match(MAGIC)[0]})`);
    const e = echoes(both); if (e.length) errs.push(`echo (${e.join(', ')})`);
    if (/#/.test(both)) errs.push('a name slot (no row here names a card)');
    if (/[.!?]$/.test(what) || /[.!?]$/.test(stakes)) errs.push('closing stop');
    if (ROW_BY_SECRET.has(what)) errs.push('is already a row');
    if (errs.length) { bad += 1; say(`  ${rowKey(r)} #${j + 1}: ${errs.join('; ')}`); }
  });
}
const dup = [...allTexts].filter(([, w]) => w.length > 1);
say(`  lines ${lines}; failing ${bad}; a sentence shared by two lines: ${dup.length ? dup.map(([s, w]) => `"${s}" ${w.join(',')}`).join(' · ') : 'none'}`);
for (const tr of TRANCHE) if (tr.row) { const e = echoes(`${tr.row.secret} ${tr.row.stakes}`); if (e.length) say(`  (base echo, not ours: ${rowKey(tr.row)} ${e.join(', ')})`); }

// ── THE BAR AFTER: the tranche in place, wording = pickVariantMixed([base, ...lines], `${seed}::<pool>:<row>::<card>`) ────────
const TR_BY_SECRET = new Map(TRANCHE.filter((tr) => tr.row).map((tr) => [tr.row.secret, tr]));
const wordingOf = (t, n) => {
  const tr = TR_BY_SECRET.get(n.what); if (!tr) return null;
  const all = [tr.base, ...tr.lines]; return all[pickMixed(all.length, KEYS[0](t, tr.row, n))];
};
const after = { what: tally('what', wordingOf), stakes: tally('stakes', wordingOf) };
say(`\n§5 THE BAR AFTER (projected; key KEYS[0]): each tranche row's commonest wording, before -> after, by size (what; its stakes the same cards)`);
for (const tr of TRANCHE) if (tr.row) {
  const k = tr.lines.length + 1; const hs = holdersOf.get(rowKey(tr.row)) || [];
  const row = SIZES.map((size) => { const nP = towns.filter((t) => t.size === size).length; const c = new Map(); for (const { t, n } of hs) if (t.size === size) { const w = pickMixed(k, KEYS[0](t, tr.row, n)); c.set(w, (c.get(w) || new Set()).add(t.seed)); } const b = new Set(hs.filter((h) => h.t.size === size).map((h) => h.t.seed)).size; const a = Math.max(0, ...[...c.values()].map((v) => v.size)); return b ? `${size.slice(0, 4)} ${pct(b, nP)}->${pct(a, nP)}` : null; }).filter(Boolean);
  const med = median(KEYS.map((key) => rowMaxAt(tr.row, k, key))); const worst = Math.max(...KEYS.map((key) => rowMaxAt(tr.row, k, key)));
  say(`  ${rowKey(tr.row)} k=${k}: ${row.join(' | ')} | ten keys: median ${(100 * med).toFixed(1)}%, worst ${(100 * worst).toFixed(1)}%`);
}
say('\n§5b SENTENCES ON 30%+ OUTSIDE THE FRAMES, before -> after (what/stakes, by size):');
for (const size of SIZES) {
  const c = (tb, bar) => { const { n, per } = tb.get(size); return [...per].filter(([s, v]) => !FRAME_SENTENCES.has(s) && v / n >= bar).length; };
  say(`  ${size.padEnd(10)} >=30%: what ${c(before.what, 0.3)} -> ${c(after.what, 0.3)}, stakes ${c(before.stakes, 0.3)} -> ${c(after.stakes, 0.3)} | >=15%: what ${c(before.what, 0.15)} -> ${c(after.what, 0.15)}, stakes ${c(before.stakes, 0.15)} -> ${c(after.stakes, 0.15)} | commonest after: ${(() => { const { n, per } = after.what.get(size); const m = [...per].filter(([s]) => !FRAME_SENTENCES.has(s)).sort((a, b) => b[1] - a[1])[0]; return m ? `${pct(m[1], n)} "${m[0].slice(0, 70)}"` : '-'; })()}`);
}
say('\n§5c WHAT MOVES (projected): cards whose wording is not the base, by size (only secret.what and secret.stakes, given the conditions of SECRETS-30-TO-CHAIR.md §3):');
say('  ' + SIZES.map((size) => { let all = 0, moved = 0; for (const t of towns.filter((x) => x.size === size)) for (const n of t.npcs) { const tr = TR_BY_SECRET.get(n.what); if (!tr) continue; all += 1; if (pickMixed(tr.lines.length + 1, KEYS[0](t, tr.row, n)) !== 0) moved += 1; } return `${size} ${moved}/${all}`; }).join(' | '));

// ── THE OTHER BUDGET, for the chair's choice: the same 60 lines spent at <30% (each row in rank order its k30, the hideable
// houses' rows left out), projected with placeholder wordings (the count of sentences on 30%+ only) ─────────────────────
{
  const plan = []; let used = 0;
  for (const x of RANKED) { if (hideable(x.r)) continue; const need = x.k30 - 1; if (need < 1 || used + need > 60) continue; used += need; plan.push({ r: x.r, k: x.k30 }); }
  const byS = new Map(plan.map((p) => [p.r.secret, p]));
  const wo = (t, n) => { const p = byS.get(rowOfCard(n)?.secret); if (!p) return null; const w = pickMixed(p.k, KEYS[0](t, p.r, n)); return w === 0 ? null : [`placeholder ${rowKey(p.r)} ${w} what`, `placeholder ${rowKey(p.r)} ${w} stakes`]; };
  const alt = { what: tally('what', wo), stakes: tally('stakes', wo) };
  say(`\n§6 THE OTHER BUDGET (60 lines at <30%: ${plan.length} rows, ${used} lines, rank order, hideable houses left out), sentences on 30%+ outside the frames, before -> after (what/stakes):`);
  say('  ' + SIZES.map((size) => { const c = (tb) => { const { n, per } = tb.get(size); return [...per].filter(([s, v]) => !FRAME_SENTENCES.has(s) && !s.startsWith('placeholder') && v / n >= 0.3).length; }; return `${size} ${c(before.what)}/${c(before.stakes)} -> ${c(alt.what)}/${c(alt.stakes)}`; }).join(' | '));
}
