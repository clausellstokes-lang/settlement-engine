/**
 * Pick the private pressure carried by a generated faction leader.
 *
 * Secret selection used to be policy-blind: every NPC weighted the magical
 * bucket even when magic was impossible, and a later prose pick could therefore
 * contradict the settlement's institutions. Keeping this concern outside the
 * already-large NPC orchestrator makes the rule explicit without hiding its
 * load-bearing RNG sequence.
 */

import { CRIMINAL_SECRET_HOLDER_TAGS, criminalSecretsForHolder, NPC_PRESENTATION_MODES, SECRETS_DENIED_BY_TEMPERAMENT } from '../../data/npcData.js'; // S9 (PAGE-6): the holder tags, the secret-bound presentations and the venal words, one line so no cited line moves
import { classOfRole } from '../../domain/roles/roleClass.js';
import { random as rng } from '../../kernel/rngContext.js';
import { drawRefusingHeldThrough } from '../hookVariety.js';
import { resolveGenerationWorldLaw } from '../generationContext.js';
import { institutionCategoryFlags } from '../roleCategory.js'; import { TITLE_LINE_DECLARATIONS, TITLE_SECRETS } from '../../data/people/titleSecretsPresentations.js'; // F5-NARROW (PAGE-8): a narrow card's title rows and their declarations, one line so no cited line moves

const STRESS_SECRET_BOOSTS = Object.freeze({
  under_siege: { military: 3, political: 2, personal: 1.5, criminal: 0.5 },
  famine: { economic_betrayal: 3, criminal: 2, personal: 2, political: 1.5 },
  occupied: { political: 3, military: 2.5, identity: 2.5, historical: 1.8, criminal: 1.5 },
  politically_fractured: { political: 3, criminal: 2, family: 1.8, historical: 1.5 },
  indebted: { economic_betrayal: 3, criminal: 2, political: 1.8, personal: 1.5 },
  recently_betrayed: { political: 3, military: 2.5, criminal: 2, historical: 2, identity: 1.5 },
  infiltrated: { political: 2.5, military: 2.5, criminal: 2.5, identity: 2 },
  plague_onset: { personal: 2.5, religious: 2, criminal: 2, economic_betrayal: 1.5 },
  succession_void: { political: 3, family: 2.5, criminal: 1.8, historical: 1.5 },
  monster_pressure: { military: 2.5, personal: 2, historical: 1.5, magical: 1.3 },
  insurgency: { political: 3, military: 2, criminal: 2, identity: 1.8 },
  mass_migration: { identity: 2.5, personal: 2, criminal: 1.8, historical: 1.5 },
  wartime: { military: 3, political: 2, economic_betrayal: 1.8, personal: 1.5 },
  religious_conversion: { religious: 3, political: 2, historical: 1.8, family: 1.5 },
  slave_revolt: { political: 2.5, military: 2.5, criminal: 2, identity: 2 },
});

const SAFE_SECRET_FALLBACK = Object.freeze({
  secret: 'Has quietly concealed a costly personal failure from their allies',
  stakes: 'Exposure would damage the trust on which their present authority depends',
});

/**
 * The enabled-world path deliberately retains the historic two draws: one for
 * the weighted bucket and one for the final prose variant. Removing an
 * ineligible bucket changes probabilities, but never introduces an extra draw.
 *
 * BOTH ROLLS READ THE HOLDER (CENSUS-1i unit 3; the chair's R-AX, refined at
 * 09:3x). The religious and military secrets presume the holder's role, so the
 * rows are keyed by it (CENSUS-4g, `npcData.js :: NPC_CRIMINAL_SECRETS_BY_HOLDER`)
 * and the picker reads the holder's role class (`classOfRole`, the fact's own
 * reader, R-AP). The TYPE roll is drawn over the full weights exactly as before;
 * if the rolled type has no admitted row for this holder while the type does
 * hold admitted rows for some holder (the key, not the world, emptied it), the
 * SAME roll is re-mapped inside its band over the types that do — no further
 * roll, so only that refused draw moves, and the result is distributed as if
 * the empty type had never been weighted. The ROW draw reads
 * `criminalSecretsForHolder(type, class)`, the historic order with the rows of
 * another role left out, so a matching holder's pool is the flat pool itself.
 * The personal fallback stays the last resort for a pool the world empties for
 * every holder. No role (`holderRole` absent) reads the flat view, unchanged.
 *
 * @param {Record<string, unknown>} config
 * @param {Array<Record<string, unknown>>} institutions
 * @param {unknown} generationContext
 * @param {string} [holderRole] the holder's role (keys both rolls)
 * @param {Set<string>} [heldSecrets] - the secrets the roster already carries (REVIEW-INTAKE-4):
 *   the final draw refuses them and falls through the pool in seed order, then (on the same roll)
 *   through the personal bucket, then the safe line; every one held answers `null`, a figure
 *   without a secret rather than a repeated one. MERGE-R2: composed with CENSUS-1i's holder-keyed
 *   rows (the chain is the holder's rows; the one roll is `pick`'s own index).
 */
export function generateFactionLeaderSecret(
  config = {},
  institutions = [],
  generationContext = null,
  holderRole = undefined,
  heldSecrets = null,
  source = null, // S9 (PAGE-6): an object the draw fills with the pool its row was taken from and the holder's class (settleMisfitSecrets)
) {
  const worldLaw = resolveGenerationWorldLaw(generationContext, config);
  const pri = {
    economy: Number(config.priorityEconomy ?? 50),
    military: Number(config.priorityMilitary ?? 50),
    religion: Number(config.priorityReligion ?? 50),
    magic: Number(config.priorityMagic ?? 50),
    criminal: Number(config.priorityCriminal ?? 50),
  };
  const { hasCriminal, hasMagic, hasReligion } =
    institutionCategoryFlags(institutions);
  const weights = {
    criminal: (hasCriminal ? 1.4 : 0.8) * (1 + pri.criminal / 100),
    personal: 1.5,
    political: 1 + pri.military / 100,
    magical: (hasMagic ? 1.3 : 0.6) * (1 + pri.magic / 100),
    religious: (hasReligion ? 1.3 : 0.6) * (1 + pri.religion / 100),
    family: 1.2,
    historical: 0.8,
    military: pri.military > 50 ? 1.2 : 0.6,
    economic_betrayal: pri.economy > 50 ? 1.1 : 0.7,
    identity: 0.9,
  };
  if (!worldLaw.magicFunctions()) delete weights.magical;

  const stresses = Array.isArray(config.stressTypes) && config.stressTypes.length
    ? config.stressTypes
    : (config.stressType ? [config.stressType] : []);
  for (const stress of stresses) {
    const boosts = STRESS_SECRET_BOOSTS[String(stress)] || {};
    for (const [key, multiplier] of Object.entries(boosts)) {
      if (weights[key] !== undefined) weights[key] *= multiplier;
    }
  }

  const holderClass = typeof holderRole === 'string' && holderRole ? classOfRole(holderRole) : null;
  /** @param {string} type @param {string|null} cls */
  const rowsFor = (type, cls) => (criminalSecretsForHolder(type, cls) || criminalSecretsForHolder('personal', cls) || []).filter(worldLaw.allowsSecret);
  /** A type the holder's KEY empties (it holds admitted rows for some holder, none for this one). @param {string} type */
  const keyEmptied = (type) => holderClass !== null && rowsFor(type, holderClass).length === 0 && rowsFor(type, null).length > 0;

  const secretTypes = Object.keys(weights);
  const total = secretTypes.reduce((sum, type) => sum + weights[type], 0);
  let roll = rng() * total;
  let chosenType = secretTypes[0];
  for (const type of secretTypes) {
    const before = roll;
    roll -= weights[type];
    if (roll <= 0) {
      chosenType = type;
      if (keyEmptied(type)) {
        // R-AX: re-map the same roll inside the refused band over the admitted types (no roll).
        const admitted = secretTypes.filter((t) => !keyEmptied(t));
        let x = (before / weights[type]) * admitted.reduce((sum, t) => sum + weights[t], 0);
        chosenType = admitted[0];
        for (const t of admitted) {
          x -= weights[t];
          if (x <= 0) { chosenType = t; break; }
        }
      }
      break;
    }
  }

  const preferredPool = rowsFor(chosenType, holderClass);
  const fallbackPool = rowsFor('personal', holderClass);
  const eligiblePool = preferredPool.length ? preferredPool : fallbackPool;
  if (!eligiblePool.length) return heldSecrets?.has(SAFE_SECRET_FALLBACK.secret) ? null : SAFE_SECRET_FALLBACK;
  // The chosen bucket first, then (on the same roll) the personal bucket, the pool's own fallback.
  const chain = preferredPool.length ? [preferredPool, fallbackPool] : [fallbackPool];
  const drawn = drawRefusingHeldThrough(chain, heldSecrets, (row) => row.secret);
  if (drawn && source) Object.assign(source, { rows: chain.find((pool) => pool.includes(drawn)), holderClass });
  if (drawn) return drawn;
  return heldSecrets?.has(SAFE_SECRET_FALLBACK.secret) ? null : SAFE_SECRET_FALLBACK;
}

/**
 * S9 (PAGE-6, 2026-11-20; docs/chair/2026-11-20/content/page/briefs/S9-POST.md, the chair's ruling of 13:50): is a secret row
 * admitted to its holder? Refused: a row whose holder tag (`npcData.js :: CRIMINAL_SECRET_HOLDER_TAGS`) does not name the
 * holder's role class, and a VENAL row (its money words: the `incorruptible` pattern of
 * `npcData.js :: SECRETS_DENIED_BY_TEMPERAMENT`, read, not edited) to a holder whose drawn temperament is `principled`. No
 * class (no role) reads no tag. Pure. (The predicate of the refused first cut f2957d5be, re-read whole.)
 * @param {{ secret?: string } | null | undefined} row @param {string | null | undefined} holderClass
 * @param {string | null | undefined} temperament
 * @returns {boolean}
 */
export function admitsSecretRow(row, holderClass, temperament) {
  const text = String(row?.secret ?? '');
  const tag = Object.hasOwn(CRIMINAL_SECRET_HOLDER_TAGS, text) ? CRIMINAL_SECRET_HOLDER_TAGS[text] : null;
  if (tag && holderClass != null && !tag.includes(holderClass)) return false;
  return !(temperament === 'principled' && SECRETS_DENIED_BY_TEMPERAMENT.incorruptible.test(text));
}

/**
 * THE POOL A CARD'S SECRET WAS TAKEN FROM (S9), noted at the deal and read by the town's post-pass; never stored on the
 * card. Keyed by the card's `personality` object: the one object every copy of the card shares from its birth to the
 * post-pass (the overlay's and the merge's shallow copies keep it; the mint's rewrite of its secret does not touch it).
 * @type {WeakMap<object, Readonly<{ rows: ReadonlyArray<Readonly<{ secret: string, stakes: string }>>, holderClass: string | null }>>}
 */
const SECRET_SOURCES = new WeakMap();

/**
 * S9: NOTE THE POOL a card's secret was dealt from, so the town's post-pass walks it. THE REGISTRATION POINT, pool-generic:
 * the role's draw notes its chain pool here (`npcGenerator.js :: generateSingleNPC`); a later settle that deals the card a
 * row of ANOTHER pool notes that pool in its place (L4: `noteSecretSource(card, { rows: OFFICE_SECRETS[title], holderClass })`
 * right after it sets the office row), and the post-pass then walks that pool. Returns the card.
 * @template {Record<string, any>} C
 * @param {C} card
 * @param {{ rows?: ReadonlyArray<Readonly<{ secret: string, stakes: string }>>, holderClass?: string | null } | null | undefined} source
 * @returns {C}
 */
export function noteSecretSource(card, source) {
  const key = card?.personality;
  if (key && typeof key === 'object' && Array.isArray(source?.rows) && source.rows.length) {
    SECRET_SOURCES.set(key, Object.freeze({ rows: source.rows, holderClass: source.holderClass ?? null }));
  }
  return card;
}

/** S9: the pool a card's secret was noted from, or null. @param {Record<string, any> | null | undefined} card */
export function secretSourceOf(card) {
  const key = card?.personality;
  return key && typeof key === 'object' ? SECRET_SOURCES.get(key) ?? null : null;
}

/** The presentation modes a secret's words draw (`npcGenerator.js :: getStressHistory`; as `people/rareSecrets.js` reads them). */
const SECRET_BOUND_PRESENTATIONS = new Set(['dangerous_presents_safe', 'compromised_presents_professional', 'significant_presents_ordinary']
  .flatMap((k) => /** @type {Record<string, unknown[]>} */ (NPC_PRESENTATION_MODES)[k] || []).map((p) => JSON.stringify(p)));
/** The guild words a draw-free rewrite of the text reads (`npcGenerator.js :: mergeNPCLists`, `crimeSignal.js :: withTownsOwnUnderworld`). */
const GUILD_REWRITTEN_WORDS = /thieves|guild/i;

/**
 * S9 AS A POST-PASS (PAGE-6, 2026-11-20; S9-POST.md, the chair's ruling of 13:50): A SECRET THAT FITS ITS HOLDER. Run ONCE
 * per town after every card is dealt (the births, the overlay, the mints: `narrativeGenerator.js :: enrichNpcCoherence`,
 * right after `landMemberships`) and before anything reads the cast's secrets as settled (`castPowers.js :: rankPowers`'
 * temperament yield, the rare secrets). A card whose secret is a row of its noted pool (`noteSecretSource`) that the card
 * is not admitted to (`admitsSecretRow`: a tag that does not name its class; a venal row to a principled card) takes ITS
 * NEXT ADMITTED LINE THAT NO CARD OF THE TOWN HOLDS: the next row after its own in the same pool, in row order, wrapping.
 * Two more refusals keep every other field of the card true: a card whose presentation was drawn from its secret's words
 * (the three secret-bound modes) keeps its secret; a row the guild rewrite reads (thieves, guild) is passed.
 * THE TOWN'S CARRY (`options.carry`): the draw-free rewrite the merge gave the town's secrets before the pass (a town with
 * no market: `npcGenerator.js :: withoutMarketWords`). A card's text is its row's or the row's carried form; a settled row
 * is printed carried (its secret and its stakes), and held as carried.
 * None left: the card keeps its draw (counted). No draw: a card that is no misfit keeps its secret byte for byte, and no
 * other card's draw reads the result. Mutates the moved cards' `secret`; returns the receipt.
 * @param {Array<Record<string, any>> | null | undefined} cards the town's whole cast
 * @param {{ carry?: (text: string) => string, narrow?: boolean }} [options] `narrow: true`: F5-NARROW's walk (`settleNarrowVenalSecrets`) instead
 * @returns {{ misfits: number, moved: number, kept: number }}
 */
export function settleMisfitSecrets(cards, options = {}) {
  const carry = typeof options.carry === 'function' ? options.carry : (/** @type {string} */ text) => text; if (options.narrow === true) return settleNarrowVenalSecrets(cards, carry); // F5-NARROW (PAGE-8): the narrow walk, called after the last temperament writer
  const receipt = { misfits: 0, moved: 0, kept: 0 };
  if (!Array.isArray(cards)) return receipt;
  const held = new Set(cards.map((c) => c?.secret?.what).filter((w) => typeof w === 'string').map((w) => w.trim()));
  for (const card of cards) {
    const source = secretSourceOf(card);
    const what = card?.secret?.what;
    if (!source || typeof what !== 'string') continue;
    const { rows, holderClass } = source;
    const at = rows.findIndex((r) => r.secret === what || carry(r.secret) === what);
    if (at < 0) continue; // the overlay or a guild rewrite has replaced the dealt text: not this pool's row
    const temperament = card.personality?.dominant ?? null;
    if (admitsSecretRow(rows[at], holderClass, temperament)) continue;
    receipt.misfits += 1;
    let next = null;
    if (!SECRET_BOUND_PRESENTATIONS.has(JSON.stringify(card.presentation ?? null))) {
      for (let k = 1; k < rows.length && !next; k += 1) {
        const r = rows[(at + k) % rows.length];
        if (admitsSecretRow(r, holderClass, temperament) && !held.has(carry(r.secret).trim()) && !GUILD_REWRITTEN_WORDS.test(`${r.secret} ${r.stakes}`)) next = r;
      }
    }
    if (!next) { receipt.kept += 1; continue; }
    held.delete(what.trim());
    held.add(carry(next.secret).trim());
    card.secret = { what: carry(next.secret), stakes: carry(next.stakes) };
    receipt.moved += 1;
  }
  return receipt;
}

/**
 * R2-CODE-A-7 (step 1 item 4; the chair's ruling): a town with no market hears the protection scheme of its households, each
 * rewrite the whole phrase as the pool spells it; draw-free. Read by `npcGenerator.js :: mergeNPCLists` (its one writer) and, since S9 (PAGE-6),
 * by the town's secret post-pass (`settleMisfitSecrets`), which carries a settled row the same way. Lifted out of
 * mergeNPCLists unchanged, so one spelling serves both (here, beside the pass, so the merge's file keeps its size ceiling).
 * @template T @param {T} text @returns {T}
 */
export const withoutMarketWords = (text) => /** @type {T} */ (/** @type {unknown} */ (typeof text !== 'string' ? text : text.replace("the very merchants they're supposed to serve", "the very households they're supposed to serve").replace('the merchants have been keeping records', 'the households have been keeping records')));

/**
 * F5'S VENAL LIST (PAGE-1's measure, origin `lane/page-1-2026-11-20-card`, `docs/chair/2026-11-20/content/page/measures/C/f5.mjs`
 * `venalRe`, verbatim): crime for gain, money taken, goods moved, records sold or forged. Read by F5-NARROW's walk only.
 */
const F5_VENAL_WORDS = /embezzl|fencing|payroll|brib|protection scheme|for a fee|contraband|skim|selling|\bsells\b|betting against|exploitative labour|suppress a finding|been paid|paid to|is paid|for a share|pocket|keeping back|on the side|smuggl|overcharg|charges the families|cut of|kickback|monthly payment|for a purse|who pays? for it|families can pay|taking offerings|give generously|for money|for gold|for coin/i;
/** The narrow four (the chair's ruling of 18:26): the temperaments that cannot be bought. */
const NARROW_TEMPERAMENTS = new Set(['principled', 'honest', 'incorruptible', 'plain-dealing']);

/**
 * A row a narrow card may walk to (F5-NARROW): S9's admission (`admitsSecretRow`: the row's holder tag names the card's class;
 * a principled card refuses the incorruptible words) AND no word of F5's venal list AND no word the card's own temperament
 * denies (`npcData.js :: SECRETS_DENIED_BY_TEMPERAMENT`, read, not edited: so the temperament yield, which ran before the walk,
 * would not fire on the new row) AND no guild word (S9's) AND, for a title row, no declaration (`TITLE_LINE_DECLARATIONS`: a
 * row that holds in some towns only is never walked to). The printed (carried) text is read. Pure.
 * @param {Readonly<{ secret: string, stakes: string }>} row @param {string | null} holderClass (null for a title row: no tag) @param {string} temperament
 * @param {boolean} titleRow @param {(text: string) => string} carry
 * @returns {boolean}
 */
function admitsNarrowRow(row, holderClass, temperament, titleRow, carry) {
  const text = carry(row.secret);
  if (!admitsSecretRow({ secret: text }, holderClass, temperament) || !admitsSecretRow(row, holderClass, temperament)) return false;
  if (F5_VENAL_WORDS.test(text) || GUILD_REWRITTEN_WORDS.test(`${row.secret} ${row.stakes}`)) return false;
  const denied = Object.hasOwn(SECRETS_DENIED_BY_TEMPERAMENT, temperament) ? /** @type {Record<string, RegExp>} */ (SECRETS_DENIED_BY_TEMPERAMENT)[temperament] : null;
  if (denied && denied.test(text)) return false;
  return !(titleRow && Object.hasOwn(TITLE_LINE_DECLARATIONS.secret, row.secret));
}

/**
 * The narrow card's own pool: the pool its secret was dealt from (`secretSourceOf`, S9's note) where its printed secret is a
 * row of it (or the row's carried form); else its title's own rows (`TITLE_SECRETS`, by its house's title, then its own) where
 * the secret is one of them; else null (a frame naming another person, an overlay's or a crisis's text, a rare row).
 * @param {Record<string, any>} card @param {string} what @param {(text: string) => string} carry
 * @returns {{ rows: ReadonlyArray<Readonly<{ secret: string, stakes: string }>>, at: number, holderClass: string | null, titleRow: boolean } | null}
 */
function narrowPoolOf(card, what, carry) {
  const source = secretSourceOf(card);
  if (source) {
    const at = source.rows.findIndex((r) => r.secret === what || carry(r.secret) === what);
    if (at >= 0) return { rows: source.rows, at, holderClass: source.holderClass, titleRow: false };
  }
  for (const title of [card.institution?.title, card.title]) {
    if (typeof title !== 'string' || !Object.hasOwn(TITLE_SECRETS, title)) continue;
    const rows = /** @type {Record<string, ReadonlyArray<Readonly<{ secret: string, stakes: string }>>>} */ (TITLE_SECRETS)[title];
    const at = rows.findIndex((r) => r.secret === what || carry(r.secret) === what);
    if (at >= 0) return { rows, at, holderClass: null, titleRow: true };
  }
  return null;
}

/**
 * F5-NARROW (PAGE-8, 2026-11-20; docs/chair/2026-11-20/content/page/briefs/F5-NARROW.md, the chair's ruling of 18:26): A PERSON
 * WHO CANNOT BE BOUGHT KEEPS NO BOUGHT SECRET. Run ONCE per town AFTER the last writer of `personality.dominant`
 * (`castPowers.js :: rankPowers`' temperament yield; `narrativeGenerator.js :: enrichNpcCoherence`, appended to its
 * rankPowers line, through `settleMisfitSecrets(cards, { carry, narrow: true })`), so the temperament it reads is the one the
 * record ends with. A card whose temperament is one of the narrow four and whose printed secret is on F5's venal list takes,
 * draw-free, the next row of its own pool (`narrowPoolOf`) that it is admitted to (`admitsNarrowRow`) and that no card of the
 * town holds: S9's walk (row order, wrapping; the town's carry; a card whose presentation was drawn from its secret's words
 * keeps it). None left: it keeps its draw (counted). No draw; a card that is not narrow and venal keeps its secret byte for
 * byte; no temperament is written. Mutates the moved cards' `secret`; returns the receipt (`misfits`: the narrow venal cards).
 * @param {Array<Record<string, any>> | null | undefined} cards the town's whole cast @param {(text: string) => string} carry
 * @returns {{ misfits: number, moved: number, kept: number }}
 */
export function settleNarrowVenalSecrets(cards, carry) {
  const receipt = { misfits: 0, moved: 0, kept: 0 };
  if (!Array.isArray(cards)) return receipt;
  const held = new Set(cards.map((c) => c?.secret?.what).filter((w) => typeof w === 'string').map((w) => w.trim()));
  for (const card of cards) {
    const temperament = card?.personality?.dominant;
    const what = card?.secret?.what;
    if (typeof temperament !== 'string' || !NARROW_TEMPERAMENTS.has(temperament) || typeof what !== 'string' || !F5_VENAL_WORDS.test(what)) continue;
    receipt.misfits += 1;
    const pool = SECRET_BOUND_PRESENTATIONS.has(JSON.stringify(card.presentation ?? null)) ? null : narrowPoolOf(card, what, carry);
    let next = null;
    for (let k = 1; pool && k < pool.rows.length && !next; k += 1) {
      const r = pool.rows[(pool.at + k) % pool.rows.length];
      if (admitsNarrowRow(r, pool.holderClass, temperament, pool.titleRow, carry) && !held.has(carry(r.secret).trim())) next = r;
    }
    if (!next) { receipt.kept += 1; continue; }
    held.delete(what.trim());
    held.add(carry(next.secret).trim());
    card.secret = { what: carry(next.secret), stakes: carry(next.stakes) };
    receipt.moved += 1;
  }
  return receipt;
}
