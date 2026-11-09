/**
 * headlines — single-line "TLDR" insight for each chapter.
 *
 * Each function takes the relevant viewModel slice and returns either:
 *   - a string headline ready to render in <ChapterHeadline>
 *   - or null if there's nothing strong enough to surface
 *
 * Keep the logic conservative: only call something out when the data
 * actually warrants it. A weak or generic headline is worse than none —
 * it forces the DM to read past empty noise on every chapter opener.
 */
import { cap, humanize, label as labelOf } from './format.js';
import { coverageRatioPct } from './foodCoverage.js';
import { institutionDisplayName } from '../../domain/display/institutionDisplayName.js';
import { plotHookSourcePage } from '../../domain/dossier/plotHooks.js';

// ── Shared plain-word helpers (the owner's style law of 2026-11-07: the label stays as the
// first word, the machinery leaves, the town's own nouns fill the slots) ──────────────────
const NUMBER_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
/** @param {number} n @returns {string} a count in words up to twelve, digits above */
const countWord = (n) => (n >= 0 && n < NUMBER_WORDS.length ? NUMBER_WORDS[n] : String(n));
/** @param {string} w @returns {string} */
const capFirst = (w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w);
/** A catalogue name in running prose: no "(3-10)" / "(district)" suffix, first letter lowered. */
const plainName = (name) => {
  const bare = String(name || '').replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
  return bare && !/^[A-Z]{2}/.test(bare) ? bare.charAt(0).toLowerCase() + bare.slice(1) : bare;
};
/** "a palisade" / "an earthwork" / "massive walls and fortifications" (a plural takes no article). */
const withArticle = (phrase) => {
  if (!phrase) return phrase;
  if (/s$/i.test(phrase.split(/\s+and\s+/)[0]) && !/ss$/i.test(phrase)) return phrase;
  return `${/^[aeiou]/i.test(phrase) ? 'an' : 'a'} ${phrase}`;
};
/** "a", "a and b", "a, b and c" */
const listOf = (items) => (items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`);
/** A label in sentence case: "Lightly Defended" → "Lightly defended", "Well-Defended" → "Well-defended". */
const sentenceCase = (labelText) => {
  const t = String(labelText || '').toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
};
/**
 * THE SEED CHOOSES (WIRING-RULINGS §8(3)): one stable variant per town, from a string the
 * town always carries. The same town prints the same variant forever; a sibling town under the
 * same circumstance prints another.
 * @template T @param {string} key @param {ReadonlyArray<T>} variants @returns {T}
 */
function seedPick(key, variants) {
  let h = 2166136261;
  const k = String(key || '');
  for (let i = 0; i < k.length; i++) { h ^= k.charCodeAt(i); h = Math.imul(h, 16777619); }
  return variants[(h >>> 0) % variants.length];
}
/** How much of a food gap imports close, in words (the per cent stays in the section's table). */
function coverageWords(pct) {
  if (!(pct > 0)) return null;
  if (pct >= 90) return 'nearly all';
  if (pct >= 60) return 'most';
  if (pct >= 40) return 'about half';
  return 'some';
}

// ── Overview ────────────────────────────────────────────────────────────────
export function overviewHeadline(o, identity) {
  if (!o) return null;
  // THE LABEL FIRST ("Struggling."), then the town, its size and the trouble it is in, in the
  // crisis's own label. The safety label and the chip count were machinery (STYLE-AUDIT §2a #1).
  // The crisis is named and never described, so the line holds for arrivals and departures alike.
  const name = identity?.name || null;
  // "Thorpe" on every reader surface (ODQ §934.63 F14): the tier LABEL, never the token.
  const tierWord = (identity?.tier || identity?.tierKey || '').toLowerCase() || null;
  const pop = Number(identity?.population);
  const place = tierWord
    ? `${name ? `${name}, ` : ''}a ${tierWord}${Number.isFinite(pop) && pop > 0 ? ` of ${pop.toLocaleString('en-US')}` : ''}${name ? ',' : ''}`
    : (name || null);
  if (!place && !o.prosperity) return null;
  const lead = o.prosperity ? `${cap(String(o.prosperity).toLowerCase())}. ` : '';
  const crises = (o.stress || []).map((x) => String(x?.label || '').toLowerCase()).filter(Boolean);
  const where = place || 'the place';
  let body;
  if (crises.length) {
    const what = listOf(crises);
    const one = crises.length === 1;
    const variants = [
      // [traveller · F] what you walk into
      () => `You reach ${where} in a hard season, with ${one ? 'one trouble' : `${countWord(crises.length)} troubles`} on it: ${what}`,
      // [local · F] how daily life talks about it
      () => `In ${where} the talk in every house is of ${one ? 'one thing' : `${countWord(crises.length)} things`}: ${what}`,
      // [official · F] what those in charge must manage
      () => `${capFirst(where)} has ${one ? 'one crisis' : `${countWord(crises.length)} crises`} to manage this season: ${what}`,
      // [newcomer · F] what you hear when you ask
      () => `Ask in ${where} what is wrong and you hear of ${one ? 'one thing' : `${countWord(crises.length)} things`}: ${what}`,
    ];
    body = seedPick(name || tierWord || '', variants)();
  } else {
    body = `${capFirst(where)} has no crisis on its hands this season`;
  }
  const tail = o.viability === false ? ' It may not survive as it stands.' : '';
  return `${lead}${body}.${tail}`;
}

export function overviewTone(o) {
  if (o?.stress?.length) return 'bad';
  if (o?.prosperityTone === 'good') return 'good';
  if (o?.prosperityTone === 'warn') return 'warn';
  return 'gold';
}

// ── Power Structure ─────────────────────────────────────────────────────────
export function powerHeadline(power, _identity) {
  if (!power) return null;
  const govType = power.governmentType ? humanize(power.governmentType) : null;
  const factions = power.factions || [];
  const top = factions.find(f => f?.isGoverning) || factions[0];
  const challenger = factions.filter(f => !f?.isGoverning).sort((a, b) => (b?.power || 0) - (a?.power || 0))[0];

  if (!govType && !top) return null;
  const bits = [];
  // powerSlice factions expose `.name` (mapped from f.faction); the old `.faction`
  // reads were always undefined so the headline never named the governing body.
  if (top?.name) bits.push(`${top.name}${govType ? ` (${govType.toLowerCase()})` : ''} governs`);
  else if (govType) bits.push(`${govType} rule`);
  // The ', with …' continuation weaves onto a LEAD clause — only add it when a lead
  // exists, or a nameless governing faction with no governmentType (no lead pushed)
  // would make the comma clause the first and only element, opening the headline on a comma.
  if (bits.length && challenger?.name && challenger?.power && top?.power && challenger.power >= top.power * 0.7) {
    bits.push(`, with ${challenger.name} pressing close behind`);
  } else if (bits.length && factions.length > 2) {
    bits.push(`, with ${factions.length - 1} other power${factions.length - 1 === 1 ? '' : 's'} competing for influence`);
  }
  if (!bits.length) return null;
  return bits.join('') + '.';
}

export function powerTone(power) {
  if (!power) return 'gold';
  const stab = (power.stability || '').toLowerCase();
  if (stab === 'unstable' || stab === 'fragile' || stab === 'volatile') return 'bad';
  if (stab === 'tense' || stab === 'contested') return 'warn';
  return 'gold';
}

// ── Economics ───────────────────────────────────────────────────────────────
export function economicsHeadline(eco) {
  if (!eco) return null;
  // THE LABEL FIRST ("Struggling."), then what the place lives on and whether it feeds itself,
  // in words. The complexity gloss doubled "economy economy" and the per cent was machinery
  // (STYLE-AUDIT §2a #2); both stay in the section's own rows.
  const lead = eco.prosperity ? `${cap(String(eco.prosperity).toLowerCase())}.` : null;
  const topExport = eco.primaryExports?.[0] ? plainName(labelOf(eco.primaryExports[0])).toLowerCase() : null;
  const fb = eco.foodBalance || {};
  let food = null;
  if (fb?.deficit > 0) {
    // Shared coverage formula (foodCoverage), banded into words.
    const shareWords = coverageWords(coverageRatioPct(fb.importCoverage, fb.rawDeficit) ?? 0);
    food = shareWords
      ? `it grows less food than it eats, and imports make up ${shareWords} of the gap`
      : 'it grows less food than it eats, and nothing comes in to make up the gap';
  } else if (fb?.surplus > 0) {
    food = 'it grows more food than it eats';
  }
  let body = null;
  if (topExport) {
    const variants = [
      // [trade · S] what it sells
      () => `Most of what it sells is ${topExport}`,
      // [local · S] what households live on
      () => `Its people make their living from ${topExport}`,
      // [official · S] what the purse rests on
      () => `Its income rests on ${topExport}`,
      // [traveller · S] what you see going out
      () => `What goes out of here is mostly ${topExport}`,
    ];
    body = seedPick(`${topExport}|${eco.prosperity || ''}`, variants)();
    if (food) body += `; ${food}`;
  } else if (food) {
    body = capFirst(food);
  }
  if (!lead && !body) return null;
  return [lead, body ? `${body}.` : null].filter(Boolean).join(' ');
}

export function economicsTone(eco) {
  if (!eco) return 'gold';
  const fb = eco.foodBalance || {};
  if (fb?.deficit > 0) {
    // Compare the RAW (un-rounded) ratio at the 60% boundary — rounding here would
    // flip the tone for values like 59.6%.
    const pct = coverageRatioPct(fb.importCoverage, fb.rawDeficit) ?? 0;
    return pct < 60 ? 'bad' : 'warn';
  }
  return 'gold';
}

// ── Defense ────────────────────────────────────────────────────────────────
export function defenseHeadline(def, _identity) {
  if (!def) return null;
  // THE LABEL FIRST ("Lightly defended"), the score in plain figures, then what stands: the
  // enclosure and the force by their roster names (READS `defenseProfile.institutions`, the
  // buckets the defence purse pays for). "Defense for a thorpe:" and "avg defense" were
  // machinery (STYLE-AUDIT §2a #3).
  const readiness = def.readiness?.label || (typeof def.readiness === 'string' ? def.readiness : null);
  const avg = def.scoreAvg ?? null;
  if (!readiness && avg == null) return null;
  const inst = def.institutions || {};
  const wallName = plainName(institutionDisplayName(inst.walls?.[0] || '')) || null;
  const forceRow = [inst.garrison, inst.watch, inst.militia, inst.mercenary, inst.charter]
    .map((rows) => institutionDisplayName(rows?.[0] || '')).find(Boolean);
  const force = forceRow ? `the ${plainName(forceRow)}` : null;
  const wall = wallName ? withArticle(wallName) : null;
  let what;
  if (wall && force) what = `${wall}, held by ${force}`;
  else if (wall) what = `${wall}, and no one trained to hold it`;
  else if (force) what = `no walls; ${force} is all that stands guard`;
  else what = 'no walls and no one under arms';
  // The readiness label carries the grade; the 0-100 mean stays in the section's bars (a digit
  // in prose is the machinery the owner struck).
  const head = readiness ? sentenceCase(readiness) : 'Defences';
  const magic = def.magicDependency ? ' It leans on magic to hold.' : '';
  return `${head}: ${what}.${magic}`;
}

export function defenseTone(def) {
  if (!def) return 'gold';
  const r = (def.readiness?.label || def.readiness || '').toString().toLowerCase();
  if (r.includes('critical') || r.includes('underdef') || r.includes('vulnerab')) return 'bad';
  if (r.includes('marginal') || r.includes('thin')) return 'warn';
  return 'good';
}

// ── Services ───────────────────────────────────────────────────────────────
const CATEGORY_WORDS = Object.freeze({
  economy: 'trade and farming', crafts: 'crafts', religious: 'faith', government: 'government',
  infrastructure: 'infrastructure', defense: 'defence', adventuring: 'adventuring', criminal: 'crime',
  entertainment: 'entertainment', magic: 'magic', exotic: 'the exotic',
});
export function servicesHeadline(services) {
  if (!services) return null;
  const list = services.detailed || [];
  const total = list.length;
  if (!total) return null;
  // SLOTTED FROM THE ROSTER ONLY (STYLE-RULINGS §1, #6): a small place names its houses; a
  // large one names its two largest groups with their counts. "On the books" and "heaviest in"
  // were machinery.
  if (total <= 8) {
    // Each house by its display name, through the one institution label seam.
    const names = [...new Set(list.map((inst) => plainName(institutionDisplayName(inst))).filter(Boolean))];
    return `${capFirst(countWord(total))} institution${total === 1 ? '' : 's'}: ${listOf(names)}.`;
  }
  const byCat = {};
  for (const inst of list) {
    const c = String(inst?.category || 'other').toLowerCase();
    byCat[c] = (byCat[c] || 0) + 1;
  }
  const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const groups = sorted.slice(0, 2).map(([c, n]) => `${CATEGORY_WORDS[c] || humanize(c).toLowerCase()} (${n})`);
  return `${capFirst(countWord(total))} institutions; the largest groups are ${listOf(groups)}.`;
}

// ── Resources ──────────────────────────────────────────────────────────────
export function resourcesHeadline(resources) {
  if (!resources) return null;
  // The resources slice exposes exportPotential ({ product, chain, value }) + nearbyDepleted
  // (resource keys). The old read took `labelOf` of the export row, which has no label, and
  // printed "Exports , ;" (STYLE-AUDIT §2b-6).
  const exports = resources.exportPotential || resources.primaryExports || [];
  const depleted = resources.nearbyDepleted || [];
  const goods = [...new Set(exports.slice(0, 2)
    .map((e) => (typeof e === 'string' ? e : e?.product || labelOf(e)))
    .flatMap((g) => String(g || '').replace(/_/g, ' ').split(/\s*,\s*/))
    .map((g) => plainName(g).toLowerCase())
    .filter(Boolean))].slice(0, 4);
  const spent = depleted.map((k) => humanize(String(k)).toLowerCase()).filter(Boolean);
  const bits = [];
  if (goods.length) bits.push(`It sends out ${listOf(goods)}`);
  if (spent.length) {
    const plural = spent.length > 1 || /s$/.test(spent[0]);
    bits.push(spent.length > 2
      ? `${capFirst(countWord(spent.length))} nearby resources are used up: ${listOf(spent)}`
      : `The nearby ${listOf(spent)} ${plural ? 'are' : 'is'} used up`);
  }
  if (!bits.length) return null;
  return bits.join('. ') + '.';
}

// ── Viability ──────────────────────────────────────────────────────────────
export function viabilityHeadline(viability) {
  if (!viability) return null;
  // THE VERDICT FIRST ("Viable,"), then the ONE reason in plain words, from the record's own
  // food balance, dependency count and first critical issue. The lowercase enum ("viable.") and
  // the verdict printed twice were machinery (STYLE-AUDIT §2a #4); the chapter keeps the summary.
  const notViable = viability.viable === false || viability.verdict === 'notViable';
  if (notViable) {
    const issues = viability.criticalIssues || [];
    const first = String(issues[0]?.description || issues[0]?.message || '').trim().replace(/\.$/, '');
    const more = issues.length > 1 ? ` ${capFirst(countWord(issues.length - 1))} more problem${issues.length - 1 === 1 ? '' : 's'} as grave stand${issues.length - 1 === 1 ? 's' : ''} behind it.` : '';
    return first ? `Not viable. ${capFirst(first)}.${more}` : 'Not viable: it cannot last as it stands.';
  }
  if (viability.viable !== true && !viability.verdict) return null;
  const fb = viability.metrics?.foodBalance || {};
  const deps = viability.metrics?.dependencyCount || 0;
  if (fb.deficit > 0) {
    const shareWords = coverageWords(coverageRatioPct(fb.importCoverage, fb.rawDeficit) ?? 0);
    const channel = fb.importChannel ? plainName(fb.importChannel) : 'trade';
    return shareWords
      ? `Viable, but it cannot feed itself: ${shareWords} of the food it lacks comes in by ${channel}.`
      : 'Viable, but it cannot feed itself, and nothing comes in to close the gap; it lives on its stores.';
  }
  if (deps > 0) {
    return `Viable, as long as the ${countWord(deps)} trade ${deps === 1 ? 'route it depends on stays' : 'routes it depends on stay'} open.`;
  }
  return 'Viable: it feeds itself and needs no outside trade to survive.';
}

export function viabilityTone(viability) {
  if (!viability) return 'gold';
  if (viability.viable === false) return 'bad';
  if (viability.viable === true) return 'good';
  return 'warn';
}

// ── History ────────────────────────────────────────────────────────────────
export function historyHeadline(history) {
  if (!history) return null;
  // The age, the events and the open tensions, counted in words. The historical character is
  // NOT repeated here: it prints as the chapter's lead two lines below (STYLE-AUDIT §3).
  const age = history.age;
  const events = (history.events || []).length;
  const tensions = (history.tensions || []).length;
  const counts = [];
  if (events) counts.push(`${countWord(events)} event${events === 1 ? '' : 's'} on record`);
  if (tensions) counts.push(`${countWord(tensions)} tension${tensions === 1 ? '' : 's'} still unresolved`);
  if (!age && !counts.length) return null;
  if (!age) return `${capFirst(listOf(counts))}.`;
  return `Founded ${age} year${age === 1 ? '' : 's'} ago${counts.length ? `, with ${listOf(counts)}` : ''}.`;
}

// ── NPCs ───────────────────────────────────────────────────────────────────
export function npcsHeadline(npcs) {
  if (!npcs) return null;
  const list = npcs.all || [];
  if (!list.length) return null;
  const sorted = npcs.sorted || list.slice().sort((a, b) => (b.power || 0) - (a.power || 0));
  const top = sorted[0];
  const total = list.length;
  if (!top) return null;
  // W7 HOOKS (the owner's style law of 2026-11-07; STYLE-RULINGS §1 #7): the people by name, TITLE and RANK
  // (the people car's card: `title` is the house's title, `powerLine` the rank in its power, "first of Elder
  // Council"); "(power N)" was machinery, and the struck variant's "the fisherman" is never written — the
  // card's own title is.
  // the first rank only: a card backed by two powers prints "first of A · member of B"; the headline keeps the first.
  const who = [top.title, String(top.powerLine || '').split(' · ')[0]].filter(Boolean).join(', ');
  const named = `${top.name}${who ? `, ${who},` : ''}`;
  if (total === 1) return `One person worth knowing: ${named.replace(/,$/, '')}.`;
  const count = capFirst(countWord(total));
  const variants = [
    // [official · S] who carries the weight
    () => `${count} people worth knowing; ${named} carries the most weight.`,
    // [newcomer · S] what you hear when you ask
    () => `Ask who matters here and you hear ${countWord(total)} names; ${named} comes first.`,
  ];
  return seedPick(String(top.name || ''), variants)();
}

// ── Hooks ──────────────────────────────────────────────────────────────────
/** The group a reader knows, by the page the chapter prints the hook under (plotHooks.js :: PLOT_HOOK_SOURCE_PAGES). */
const HOOK_GROUP_PLAIN = Object.freeze({
  npcs: 'the people', relationships: 'the town\'s ties', history: 'its history and its tensions',
  traditions: 'its traditions', viability: 'its outlook', defense: 'its defence',
});
export function hooksHeadline(hooks) {
  if (!hooks) return null;
  const all = hooks.all || [];
  if (!all.length) return null;
  // W7 HOOKS (the owner's style law of 2026-11-07; STYLE-RULINGS §1 #5): tallied by the GROUP THE CHAPTER
  // PRINTS (the source page), never by the collector's category key ("heaviest from tension" named a group
  // the page does not print). One hook per card since the people car, so the people's group is the cast.
  const byPage = {};
  for (const h of all) {
    const id = plotHookSourcePage({ category: h?.category, source: h?.sourceName ?? h?.source }).id;
    byPage[id] = (byPage[id] || 0) + 1;
  }
  const [topId, topCount] = Object.entries(byPage).sort((a, b) => b[1] - a[1])[0];
  const where = HOOK_GROUP_PLAIN[topId] || 'the town';
  const total = all.length;
  const count = total <= 12 ? capFirst(countWord(total)) : String(total);
  if (topCount === total) return `${count} hook${total === 1 ? '' : 's'} to pull, all of them belonging to ${where}.`;
  return topCount * 2 > total
    ? `${count} hooks to pull; most of them belong to ${where} (${topCount}).`
    : `${count} hooks to pull; the largest group belongs to ${where} (${topCount}).`;
}

// ── Relationships ──────────────────────────────────────────────────────────
export function relationshipsHeadline(rel) {
  if (!rel) return null;
  // The relationships slice exposes `neighbours` (external) + `internal`, not the
  // `all`/`relationships` the old code read.
  const neighbours = rel.neighbours || rel.all || [];
  const internal = rel.internal || rel.relationships || [];
  const total = neighbours.length + internal.length;
  if (!total) return null;
  // W7 HOOKS (the owner's style law of 2026-11-07): the ties in words; "links … on file" was machinery.
  // Since the people car each card holds ONE outgoing tie (R-P7), so the internal count is the people's ties.
  const bits = [];
  if (neighbours.length) bits.push(`ties to ${countWord(neighbours.length)} neighbouring place${neighbours.length === 1 ? '' : 's'}`);
  if (internal.length) bits.push(`${countWord(internal.length)} tie${internal.length === 1 ? '' : 's'} among its own people`);
  return `${capFirst(listOf(bits))}.`;
}
