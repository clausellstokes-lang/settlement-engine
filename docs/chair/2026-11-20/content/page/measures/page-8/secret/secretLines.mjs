// PAGE-8 SECRET-LINES (brief: docs/chair/2026-11-20/content/page/briefs/SECRET-LINES.md), the measure, the lines' lint
// and the projection, in one script. Writes nothing under src/ or tests/; never imports a module it would change.
//
//   forge:   node <this> forge "$PWD" <cache.json> [nPerSize=150]
//            the chair's recipe (untouched settings, seeds hxd-<size>-<i>; the first 50 a size are the chair's 300),
//            each place reduced to what the measure reads; run it through `sh scripts/gate-mutex.sh --run -- …`.
//   measure: node <this> measure "$PWD" <cache.json>
//            reads the cache only: step 3 (the bar), step 4 (the wordings a family needs, under ten keys), the lines'
//            lint, and the bar after with the drafted lines in place.
//
// THE BAR (the chair's, by the SENTENCE, over ALL places of a size): a place counts once for a sentence when any card of
// it carries that sentence in npcs[].secret.what (or .stakes); every roster name, every power's name and the place's own
// name are masked to `#` (longest first, as rosterFrame.js masks), and the text is cut into sentences after . ! or ?.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const [, , MODE, L = process.cwd(), CACHE, nA = '150'] = process.argv;
const say = (...a) => console.log(...a);
const pct = (a, b) => (b ? `${(100 * a / b).toFixed(1)}%` : 'n/a');

if (MODE === 'forge') {
  const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
  const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
  await loadGenerationLawPayloads();
  const towns = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : [];
  const have = new Set(towns.map((t) => t.seed));
  const t0 = Date.now();
  for (const size of SIZES) for (let i = 0; i < +nA; i++) {
    const seed = `hxd-${size}-${i}`;
    if (have.has(seed)) continue;
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    towns.push({
      seed, size, name: t.name,
      powers: (t.powerStructure?.factions || []).map((f) => f.faction).filter(Boolean),
      npcs: (t.npcs || []).map((n, idx) => ({
        idx, id: n.id ?? null, name: n.name, title: n.institution?.title || n.title || null, role: n.role || null, age: n.age ?? null,
        what: n.secret ? (typeof n.secret === 'string' ? n.secret : n.secret.what ?? null) : null,
        stakes: n.secret && typeof n.secret === 'object' ? n.secret.stakes ?? null : null,
      })),
    });
  }
  writeFileSync(CACHE, JSON.stringify(towns));
  say(`forged ${towns.length} places in ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${CACHE}`);
  process.exit(0);
}

// ── THE LINES (the four CRIME_KNOWLEDGE frames, npcGenerator.js :: generateCrimeLevel; `#` = the other card's name) ──
// Wording 0 of each family is the line as it stands; 1..10 are the drafted siblings (SECRET-LINES-TO-CHAIR.md).
export const FAMILIES = [
  { key: 'K0 knows', re: /^Knows something about .+ that .+ believes no one else knows/, lines: [
    ["Knows something about # that # believes no one else knows, and has been deciding for months whether to use it", '# would move against them immediately if they suspected'],
    ["Knows that # broke a promise that everyone believes was kept, and has not yet decided what to do about it", '# has been praised for keeping that promise, and would not take the truth well'],
    ['Knows what # really said in a quarrel that everyone else remembers differently, and has let the other version stand', '# has repeated the other version often enough to be caught out by it'],
    ['Knows why # turned back from a journey last year, and has kept the reason to themselves', '# told everyone the weather turned them back, and would not like the true reason heard'],
    ["Knows that # once took the blame for something they did not do, and has never asked them why", 'If it came out, # would have to say whom they were shielding'],
    ['Knows that # once made ready to go away for good and was talked into staying, and has never brought it up', '# has since spoken as if going had never crossed their mind'],
    ["Knows where # really goes on the evenings they say they are out walking, and has kept it quiet", '# has never given a reason for those walks, and would not want to be asked for one'],
    ["Knows that # lost something they were trusted to keep, and has watched them hide the loss ever since", '# has never owned to the loss, and could not make it good now'],
    ["Knows that the choice everyone blames on someone else was #'s, and has never said a word", '# has let another carry the blame for it, and would have that to answer for as well'],
    ['Knows that # started a rumour that did someone real harm, and has never told the one it hurt', '# would lose a friend over it, and perhaps more than one'],
    ['Knows that # turned down help when it was offered, then told everyone none was offered', '# has made much of being left to manage alone, and would look small if the truth came out'],
  ] },
  { key: 'K1 present', re: /^Was present when .+ did something they've never accounted for publicly/, lines: [
    ["Was present when # did something they've never accounted for publicly. Neither has acknowledged the other was there", "The situation they're both ignoring is becoming relevant again"],
    ["Was still up when # came by very late one night, and saw the state they were in. Neither has spoken of it since", 'Someone has started asking where everyone was that night'],
    ["Overheard # make a promise to someone who has since been turned away. Neither has mentioned it", 'The one the promise was made to has begun to talk about it'],
    ['Stood by while # turned away someone who badly needed help. They have not spoken of it since', 'The one turned away has come back, and remembers who was there'],
    ['Was there when # lost their temper and broke something that was not theirs. Neither has brought it up', 'The owner still wonders what became of it, and has started asking'],
    ['Watched # put something in the fire that others have been looking for ever since. Neither has said a word', 'The search for it has started up again'],
    ["Saw # meet someone at first light. # claims never to have met them. They have never talked about it", 'That someone has come back, and greeted them both like old acquaintances'],
    ["Was with # the day they said something cruel to a friend, and has never repeated it. Neither has raised it", 'The friend has heard part of it from someone else, and wants the rest'],
    ['Saw # weep after a meeting that everyone else thinks went well. Neither has let on', 'Another such meeting is coming, and they will both be in the room'],
    ['Was close by when # made a choice that cost someone else dearly, and kept still. Both have kept still since', 'The one who bore the cost has begun to wonder who else was there'],
    ["Heard # tell a lie that settled a quarrel in their favour, and said nothing. The two of them have left it there", 'The quarrel has started up again, and the lie will not hold a second time'],
  ] },
  { key: 'K2 owes', re: /^Owes .+ a debt from before either of them held/, lines: [
    ['Owes # a debt from before either of them held their current position: one that # has never formally called in', 'The silence feels like patience, and it is not forgiveness'],
    ["Owes # a debt for lodging given when they had nowhere to go. # has never once mentioned it", 'Being let off so lightly sits worse with them every year'],
    ["Owes # a debt for a word put in at the right moment, and they have never asked for anything in return", 'A favour of that size is bound to be asked for one day'],
    ["Owes # a debt for keeping quiet about a mistake, and they have never said what it will cost", 'They have begun to dread the day # names a price'],
    ["Owes # a debt from a bad year. # carried them through it and has never asked for it back", 'Others have noticed how readily they side with # on every question'],
    ["Owes # a debt on a promise made in a hard hour. # has never held them to it", 'A promise left lying that long is only waiting for its moment'],
    ["Owes # a debt that neither of them ever wrote down. # has never once raised it", 'With nothing written, # may ask for whatever they please'],
    ["Owes # a debt for a loan made in friendship, and they have never asked for it back", 'The friendship has cooled, and the loan has not been forgotten'],
    ["Owes # a debt for taking their side when no one else would. # has never said so aloud", 'If # ever needs someone to stand up for them, they will be expected to'],
    ["Owes # a debt for a kindness done in secret, and they have never let on who did it", 'They have only lately learned whose kindness it was, and cannot tell what is expected of them'],
    ["Owes # a debt for an introduction that made their name. # has never called it in", 'Everyone assumes they rose on their own, and # is aware it is not so'],
  ] },
  { key: 'K3 reading', re: /^Has been reading .+'s correspondence through an intermediary/, lines: [
    ["Has been reading #'s correspondence through an intermediary. Nothing damaging yet. But they keep looking", 'The intermediary has recently started asking for more money'],
    ["Has been keeping a note of every visitor to #'s door for most of a year. Nothing has come of it. The note grows longer", 'Someone has noticed them watching the door'],
    ["Has been asking after #'s comings and goings through a friend of a friend. Little has turned up. They have not stopped asking", 'The friend of a friend has begun to wonder why'],
    ['Has been lingering within earshot whenever # thinks no one is near. Most of it is dull. They linger all the same', '# has started choosing quieter corners'],
    ["Has been piecing together #'s past from what visitors let slip. The pieces do not fit yet. They go on gathering them", 'One of those visitors has mentioned the questions to # directly'],
    ['Has set someone to trail # on errands for months. The reports are dull. They keep the trailing up', 'The one doing the trailing has grown fond of #, and may say something'],
    ['Has been reading the letters # leaves lying about, whenever the chance comes. There has been nothing worth having. They read on regardless', '# has begun to put the letters away'],
    ["Has been keeping count of the hours # spends away and where they say they went. The accounts mostly match. Mostly is not enough for them", '# has noticed that the questions always come from the same direction'],
    ["Has been making a friend of #'s closest friend in the hope of hearing something useful. Nothing useful yet. The friendship goes on", 'The friend has begun to repeat the questions to #'],
    ['Has been noting every promise # makes in front of others and checking which are kept. So far most are. The tally goes on', 'A tally like that would be hard to explain if it were found'],
    ["Has been watching who sits with # and who is kept at a distance, and drawing conclusions. None of them is firm yet. The watching goes on", 'Someone has asked them, half in jest, why they always seem to be wherever # is'],
  ] },
];
if (MODE !== 'measure') { say('mode: forge | measure'); process.exit(2); }

const { fnv1a32 } = await import(`${L}/src/kernel/proseHash.js`);
// pickVariantMixed's finalizer (origin lane/kernel-mix-2026-11-20 bd42d63c7, src/kernel/proseHash.js :: mix32), copied
// verbatim because the lane commit (a614d7664) does not carry it yet.
const mix32 = (h) => { h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return h >>> 0; };
const pickMixed = (n, seed) => (n <= 1 || !seed ? 0 : mix32(fnv1a32(String(seed))) % n);

const towns = JSON.parse(readFileSync(CACHE, 'utf8'));
const SIZES = [...new Set(towns.map((t) => t.size))];
const maskerOf = (t) => {
  const names = [...new Set([...t.npcs.map((n) => n.name), ...(t.powers || []), t.name].filter((x) => typeof x === 'string' && x.trim()))].sort((a, b) => b.length - a.length);
  return (s) => { let o = String(s); for (const n of names) o = o.split(n).join('#'); return o; };
};
const sentences = (s) => String(s).split(/(?<=[.!?])\s+/).map((x) => x.trim().replace(/[.]$/, '')).filter(Boolean);
const famOf = (what) => FAMILIES.findIndex((f) => f.re.test(String(what || '')));

/** per size: Map sentence -> places; `textOf(t, n, field)` gives the card's text, already masked when `masked` */
function tallyBy(field, textOf = null) {
  const out = new Map();
  for (const size of SIZES) {
    const ts = towns.filter((t) => t.size === size); const per = new Map();
    for (const t of ts) {
      const mask = maskerOf(t); const seen = new Set();
      for (const n of t.npcs) {
        const p = textOf ? textOf(t, n, field) : null;
        const text = p ? p.text : n[field] ? mask(n[field]) : null;
        if (!text) continue;
        for (const s of sentences(text)) seen.add(s);
      }
      for (const s of seen) per.set(s, (per.get(s) || 0) + 1);
    }
    out.set(size, { n: ts.length, per });
  }
  return out;
}
const topLines = (tb, k = 5) => { for (const [size, { n, per }] of tb) { say(`  ${size} (${n} places):`); for (const [s, c] of [...per].sort((a, b) => b[1] - a[1]).slice(0, k)) say(`    ${pct(c, n).padStart(6)} ${String(c).padStart(3)}/${n}  ${s}`); } };

say(`SECRET-LINES measure: ${towns.length} places (${SIZES.map((s) => `${s} ${towns.filter((t) => t.size === s).length}`).join(', ')}); cache ${CACHE}`);
say('\n§3 THE BAR, BEFORE — secret.what (NPCInlineCard prints it on every card): the five commonest sentences a size');
const whatBefore = tallyBy('what'); topLines(whatBefore);
say('\n§3 THE BAR, BEFORE — secret.stakes (viewModel.js prints "what: stakes" in the PDF): the five commonest a size');
const stakesBefore = tallyBy('stakes'); topLines(stakesBefore);

say('\n§3b THE FOUR FRAMES ON THE RECORD: cards and places by size (a frame twice in one place: the held refusal forbids it)');
for (const size of SIZES) {
  const ts = towns.filter((t) => t.size === size); const cards = ts.reduce((a, t) => a + t.npcs.length, 0);
  const fam = FAMILIES.map((f, j) => { const c = ts.reduce((a, t) => a + t.npcs.filter((n) => famOf(n.what) === j).length, 0); const p = ts.filter((t) => t.npcs.some((n) => famOf(n.what) === j)).length; const tw = ts.filter((t) => t.npcs.filter((n) => famOf(n.what) === j).length > 1).length; return `${f.key} ${c} cards/${p} places (${pct(p, ts.length)}), twice ${tw}`; });
  const any = ts.reduce((a, t) => a + t.npcs.filter((n) => famOf(n.what) >= 0).length, 0);
  say(`  ${size}: ${cards} cards (mean ${(cards / ts.length).toFixed(1)}), on a frame ${any} (${pct(any, cards)}); ${fam.join(' | ')}`);
}
say('\n§3c THE NAMED STAKES "Those they\'ve sold out would not be forgiving" (npcData.js criminal.any.political[5], drawn by factionLeaderSecret.js): places by size');
say('  ' + SIZES.map((size) => { const ts = towns.filter((t) => t.size === size); const c = ts.filter((t) => t.npcs.some((n) => /^Treason\. Those they've sold out/.test(n.stakes || ''))).length; return `${size} ${c}/${ts.length} = ${pct(c, ts.length)}`; }).join(' | '));
const FRAME_SENTENCES = new Set(FAMILIES.flatMap((f) => sentences(f.lines[0][0]).concat(sentences(f.lines[0][1]))));
say('\n§3d OUTSIDE THE FOUR FRAMES: how many other sentences stand at or above 15% of a size\'s places, and the commonest');
for (const [label, tb] of [['what', whatBefore], ['stakes', stakesBefore]]) for (const [size, { n, per }] of tb) {
  const over = [...per].filter(([s, c]) => !FRAME_SENTENCES.has(s) && c / n >= 0.15).sort((a, b) => b[1] - a[1]);
  say(`  ${label.padEnd(6)} ${size.padEnd(10)} ${String(over.length).padStart(3)} sentences >= 15%${over[0] ? `; commonest ${pct(over[0][1], n)} "${over[0][0].slice(0, 90)}"` : ''}`);
}

// ── STEP 4: the family is drawn exactly as now; its WORDING is a keyed pick (pickVariantMixed) among k ───────────────
const KEYS = [(t, j, n) => `${t.seed}::npcGenerator:CRIME_KNOWLEDGE:${j}::${n.idx}`, (t, j) => `${t.seed}::npcGenerator:CRIME_KNOWLEDGE:${j}`, (t, j, n) => `${t.seed}::${n.name}::${j}`,
  ...[1, 2, 3, 4, 5, 6, 7].map((s) => (t, j, n) => `${t.seed}::crime-knowledge-${s}::${j}::${n.idx}`)];
say('\n§4 HOW MANY WORDINGS A FAMILY NEEDS: the commonest single wording\'s share of a size\'s places, all four families at k wordings each, under ten keys (median / worst); expected = the family\'s share / k');
for (const k of [7, 8, 9, 10, 11, 12]) {
  const row = SIZES.map((size) => {
    const ts = towns.filter((t) => t.size === size);
    const maxes = KEYS.map((key) => { const c = new Map(); for (const t of ts) { const seen = new Set(); for (const n of t.npcs) { const j = famOf(n.what); if (j < 0) continue; seen.add(`${j}:${pickMixed(k, key(t, j, n))}`); } for (const s of seen) c.set(s, (c.get(s) || 0) + 1); } return Math.max(0, ...c.values()) / ts.length; }).sort((a, b) => a - b);
    return `${size} ${(100 * maxes[4]).toFixed(1)}/${(100 * maxes[9]).toFixed(1)}`;
  });
  say(`  k=${String(k).padStart(2)} (${k - 1} new lines a family, ${4 * (k - 1)} in all): ${row.join(' | ')}`);
}

// ── THE LINES' LINT: every law a script can read ─────────────────────────────────────────────────────────────────────
say('\n§5 THE LINES\' LINT (each drafted line, what and stakes):');
const STRESS_WORDS = ['negotiating', 'selling information', 'selling patrol', 'feeding information', 'feeding', 'betrayer', 'infiltrator', 'patrol routes', 'occupation authority', 'without the council', 'passed information', 'cell', 'surrendered', 'names to avoid', 'legitimise', 'names to', 'abandon', 'leave before', 'personal arrangements', 'privately', 'private arrangement', 'side payment', 'embezzl', 'hidden cache', 'suppress', 'false report', 'false harvest', 'covert route', 'private source', 'documentation proving', 'private terms', 'hoarding', 'documentation', 'evidence', 'knows', 'original', 'clause'];
const VENAL = /embezzl|fencing|payroll|brib|protection scheme|for a fee|contraband|skim|selling|\bsells\b|betting against|exploitative labour|suppress a finding|been paid|paid to|is paid|for a share|pocket|keeping back|on the side|smuggl|overcharg|charges the families|cut of|kickback|monthly payment|for a purse|who pays? for it|families can pay|taking offerings|give generously|for money|for gold|for coin/i;
const REWRITTEN = /merchant|thieves|guild|criminal/i; // npcGenerator.js :: mergeNPCLists' no-market and underworld rewrites
const HOUSE_WORDS = /\b(inn|tavern|alehouse|mill|miller|smithy|forge|temple|chapel|church|shrine|priest|market|stall|court|magistrate|gaol|jail|prison|watch|guard|garrison|council|granary|dock|harbour|wharf|quay|boat|ship|river|sea|shore|forest|mine|school|hospital|bank|warehouse|shop|workshop)\b/i;
const CRIME_WORDS = /\b(theft|thief|stole|stolen|steal|murder|kill|killed|crime|smuggl\w*|gang|racket|bribe\w*|forged|forgery|forging|fraud|break-in|robbed|robbery)\b/i;
const AGE_HOUSEHOLD = /\b(young|youth|child|children|boy|girl|lad|aged?|years old|elderly|wife|husband|son|daughter|brother|sister|mother|father|family|household|widow\w*|married|marriage|grand\w+)\b/i;
let bad = 0; const allSentences = new Map();
for (const [j, f] of FAMILIES.entries()) for (const [i, [what, stakes]] of f.lines.entries()) {
  for (const s of [...sentences(what), ...sentences(stakes)]) allSentences.set(s, (allSentences.get(s) || []).concat(`${f.key}[${i}]`));
  if (i === 0) continue;
  const lw = what.toLowerCase(); const errs = [];
  const sw = STRESS_WORDS.filter((w) => lw.includes(w));
  if (j === 0 ? sw.join() !== 'knows' : sw.length) errs.push(`getStressHistory words ${JSON.stringify(sw)} (the base row's: ${j === 0 ? '["knows"]' : '[]'})`);
  if (VENAL.test(`${what} ${stakes}`)) errs.push('venal (F5 list)');
  if (REWRITTEN.test(`${what} ${stakes}`)) errs.push('a word the merge rewrites');
  if (HOUSE_WORDS.test(`${what} ${stakes}`)) errs.push(`a house or a place-feature word (${`${what} ${stakes}`.match(HOUSE_WORDS)[0]})`);
  if (CRIME_WORDS.test(`${what} ${stakes}`)) errs.push('a crime word');
  if (AGE_HOUSEHOLD.test(`${what} ${stakes}`)) errs.push(`an age or household word (${`${what} ${stakes}`.match(AGE_HOUSEHOLD)[0]})`);
  if (!what.includes('#')) errs.push('no # in what (the rare deal reads a name in another card\'s secret)');
  if (j === 0 && !stakes.includes('#')) errs.push('K0 stakes carry # as the base does');
  if (j === 2 && !what.startsWith('Owes # a debt')) errs.push('K2 must open "Owes # a debt" (npcData.js :: secretOwes)');
  if (/[.!?]$/.test(what) || /[.!?]$/.test(stakes)) errs.push('closing stop');
  if (f.re.test(what)) errs.push('matches the base frame regex');
  if (errs.length) { bad += 1; say(`  ${f.key}[${i}] ${errs.join('; ')}`); }
}
const shared = [...allSentences].filter(([, w]) => w.length > 1);
say(`  lines ${FAMILIES.reduce((a, f) => a + f.lines.length - 1, 0)}; failing ${bad}; a sentence shared by two lines: ${shared.length ? shared.map(([s, w]) => `"${s}" ${w.join(',')}`).join(' · ') : 'none'}`);

// ── THE BAR AFTER: the drafted lines in place, the projected key `${seed}::npcGenerator:CRIME_KNOWLEDGE:<family>::<card>` ─
const K = FAMILIES[0].lines.length;
const projected = (t, n, field) => {
  const j = famOf(n.what); if (j < 0) return null;
  const i = pickMixed(K, KEYS[0](t, j, n)); if (i === 0) return null;
  return { text: FAMILIES[j].lines[i][field === 'what' ? 0 : 1] };
};
say(`\n§6 THE BAR AFTER (projected: k=${K}, key KEYS[0]) — secret.what, the five commonest a size`);
const whatAfter = tallyBy('what', projected); topLines(whatAfter);
say(`\n§6 THE BAR AFTER (projected) — secret.stakes, the five commonest a size`);
const stakesAfter = tallyBy('stakes', projected); topLines(stakesAfter);
say('\n§6a WHAT MOVES (projected): cards whose wording is not the base, by size (only secret.what and secret.stakes, given the builder keeps the held key, the stress-history class, the debt opening and the # in what):');
say('  ' + SIZES.map((size) => { const ts = towns.filter((t) => t.size === size); let fam = 0, moved = 0; for (const t of ts) for (const n of t.npcs) { const j = famOf(n.what); if (j < 0) continue; fam += 1; if (pickMixed(K, KEYS[0](t, j, n)) !== 0) moved += 1; } return `${size} ${moved}/${fam}`; }).join(' | '));
say('\n§6b THE COMMONEST FRAME SENTENCE (any wording), before -> after, by size:');
const ALL_FRAME = new Set(FAMILIES.flatMap((f) => f.lines.flatMap(([w, s]) => [...sentences(w), ...sentences(s)])));
const famMax = (tb) => new Map([...tb].map(([size, { n, per }]) => { const m = [...per].filter(([s]) => ALL_FRAME.has(s)).sort((a, b) => b[1] - a[1])[0]; return [size, m ? `${pct(m[1], n)} (${m[1]}/${n})` : '0']; }));
for (const [label, b, a] of [['what', whatBefore, whatAfter], ['stakes', stakesBefore, stakesAfter]]) { const fb = famMax(b), fa = famMax(a); say(`  ${label.padEnd(6)} ${SIZES.map((s) => `${s} ${fb.get(s)} -> ${fa.get(s)}`).join(' | ')}`); }

// ── SECRET-LINES-BUILD: on a cache forged from the BUILT tree, §3 is the bar measured; this reads the frames off it ───
say('\n§7 THE COMMONEST FRAME SENTENCE (any wording, the drawn rows and their siblings) AS THIS CACHE WAS FORGED (forged on the built tree: MEASURED):');
for (const [label, tb] of [['what', whatBefore], ['stakes', stakesBefore]]) { const fm = famMax(tb); say(`  ${label.padEnd(6)} ${SIZES.map((s) => `${s} ${fm.get(s)}`).join(' | ')}`); }
say('  siblings on the record by size: ' + SIZES.map((size) => { const ts = towns.filter((t) => t.size === size); const mask = (t) => maskerOf(t); let sib = 0; for (const t of ts) { const m = mask(t); for (const n of t.npcs) if (n.what && FAMILIES.some((f) => f.lines.slice(1).some(([w]) => w === m(n.what)))) sib += 1; } return `${size} ${sib}`; }).join(' | '));
