/**
 * factionRename.js — THE ONE ENTITY-RENAME WRITER (owner queue #14).
 *
 * IT OWNS TWO CASCADES, NOT ONE. The faction cascade landed first and named the
 * file; the NPC cascade (applyNpcRenameToSettlement, further down) joined it
 * because the two share the mechanism that makes either of them hard — a
 * character is stored at TWO homes whose alias JSON splits on reload (NPC_HOMES
 * below), and both cascades must heal both. Declaring the homes once and reusing
 * the same rewrite primitives is the whole reason the NPC cascade lives beside
 * the faction one instead of in a module of its own.
 *
 * WHY THIS MODULE EXISTS. Until this landed, a faction could be renamed by two
 * divergent lanes that were invisible to each other (atlas presentation-scene
 * gaps 1 / 1b / 2, power-faith gap 1):
 *
 *   • the STORE lane (settlementSlice.renameFaction) resolved the CANONICAL
 *     `powerStructure.factions` list and dual-wrote `.faction` + `.name` — but
 *     cascaded NOTHING, and had zero callers, so it was a dead op;
 *   • the LIBRARY lane (SettlementsPanel.applyRename) cascaded broadly
 *     (relationships, cross-save neighbour refs, ai_data) — but wrote only
 *     `.name` on `settlement.factions`, the "usually-empty legacy mirror",
 *     so on a GENERATED settlement it renamed nothing at all.
 *
 * The recorded convergence is the store lane's list resolution + dual-write AND
 * the library lane's cascade. Both lanes now call the functions below, so a
 * faction rename means the same thing everywhere and can only regress in one
 * place.
 *
 * FACTION-ACCESS LAW. A powerStructure faction record's canonical display name
 * is `.faction`, with `.name` a legacy alias (see nameOf in rulingPower.js).
 * Every read here goes through `nameOf`; every write sets BOTH spellings when
 * the record already carries them, so no downstream reader can see a half-
 * renamed record.
 *
 * NAMES ARE JOIN KEYS. That is the whole difficulty. Factions are referenced by
 * DISPLAY NAME from more than twenty stored fields across the save (and from the
 * neighbour saves that link to it). A rename that misses one does not merely
 * look wrong: it silently detaches NPCs from their faction, orphans the
 * governing seat, and breaks institution attribution. FACTION_RENAME_SURFACES
 * below is the enumerated denominator, and tests/domain/factionRename.test.js
 * pins that every surface in it actually moves on REAL pipeline data.
 *
 * THE DENOMINATOR IS NO LONGER SELF-ASSESSED (R-5 closing cure). The pin used to
 * measure this list against a hand-written probe map naming the same paths, so a
 * stored field this module had never heard of could not fail it. The pin now
 * walks the WHOLE settlement blob for strings carrying a roster faction name and
 * requires every path it finds to appear in FACTION_RENAME_SURFACES or in
 * NON_CASCADED_SURFACES. That walk found four reader-visible surfaces this
 * cascade had always missed (both NPC homes' affiliation links, and the tension
 * party roster the dossier renders as chips), plus a fifth defect of scope: the
 * faction BLURB was rewritten only on the renamed record, so every rival blurb
 * naming that faction went stale. All are cured below.
 *
 * DELIBERATELY NOT CASCADED (each a decision, not an oversight — see
 * NON_CASCADED_SURFACES for the machine-readable ledger):
 *   • `powerStructure.previousGovernments[]` — the regime LINEAGE. It records
 *     what the seat used to be; rewriting it would falsify recorded history.
 *   • the event log / chronicle / campaign wizardNews — recorded history, and
 *     unreachable anyway: renames are refused in canon phase, and a settlement
 *     that never canonized has none of these.
 *   • a faction's stored `id` (`faction.<slug>`, minted by the ADD_FACTION
 *     mutation) — the durable identity. Undo keys on it (createdByEventId), so
 *     a rename changes the LABEL, never the identity.
 *   • 3D scene labels — derived per compile from the roster, and the scene
 *     schema carries no district-to-faction identity at all
 *     (townScene/sceneSemantics.js: `factionRefs: []`), so they follow for free.
 *   • the ai_data narrative blob — cascaded by its own registered operation,
 *     `applyCosmeticRename` (aiSlice), which both lanes invoke after this one.
 *   • `simulationTrace[].causes[].reason` — the GENERATION RECEIPT. It records
 *     what the generator decided while the faction still bore its old name, so
 *     rewriting it would falsify the trace, exactly as with previousGovernments.
 *     It is not a live reference either: the fingerprint extractors read the
 *     trace's enums and drop its reason prose.
 *   • `economicState.safetyProfile.criminalInstitutions[]` — entries come from
 *     the fixed CRIMINAL_INST_LABELS table in generators/safetyProfile.js and
 *     name an INSTITUTION ("Thieves' Guild Chapter"), not the faction. That a
 *     criminal power faction is often generated with a similar name is
 *     incidental; the faction reference on an institution is `factionSource`,
 *     which IS cascaded.
 *
 * PURE. No store, no persistence, no React. Callers own the write-back.
 */

import { substituteWholeWord } from '../lib/narrativeMutations.js';
import { deepClone } from './clone.js';
import { nameOf } from './rulingPower.js';

/**
 * A stored record as this module sees one: an object whose keys resolve to
 * `unknown`. Deliberately NOT `Record<string, any>` — the domain any-cast
 * ratchet gives a new file a budget of zero, and every read here is guarded by
 * a typeof check anyway, so `unknown` costs nothing and buys real checking.
 *
 * @typedef {{ [key: string]: unknown }} StoredRecord
 */
/** @typedef {import('./rulingPower.js').RulingFaction} RulingFaction */

/**
 * The settlement-level buckets the in-settlement cascade can reach. Used to
 * build a minimal clone for the immutable (library-lane) caller, so a rename
 * never deep-copies the whole settlement.
 */
const CASCADE_BUCKETS = Object.freeze([
  'powerStructure',
  'npcs',
  'institutions',
  'factions',
  'interSettlementRelationships',
  // ADDED 2026-08-01 for exactly TWO paths: `relationships[].npc1Role` and
  // `npc2Role`, the per-end TITLES on the in-settlement edge list, which carry the
  // faction token. The bucket MUST be listed here and not merely walked: the
  // immutable (library-lane) caller spreads only the buckets named in this list, so
  // a walk over an unlisted bucket would write straight through into the caller's
  // own object. The edge list is otherwise untouched by the faction lane; the NAME
  // halves of each edge belong to the NPC cascade (NPC_CASCADE_BUCKETS below).
  'relationships',
  // `history` is listed for exactly ONE path: `currentTensions[].factions[]`,
  // the party roster the dossier renders as chips (tabs/HistoryTab.jsx) and the
  // PDF prints as tension parties (pdf/lib/viewModel.js). Nothing else under
  // `history` is read or written here — the timeline and the founding record
  // are recorded history and stay put. The whole bucket is cloned because the
  // immutable caller spreads TOP-LEVEL buckets, not sub-paths; history is small
  // beside the map and the economy tables this list still excludes.
  'history',
  // A top-level STRING rather than a bucket. The generated pressure sentence
  // names the governing faction and is rendered on the summary tab, the map
  // quick-inspector, the PDF overview and the Foundry journal page.
  'pressureSentence',
]);

/**
 * The same minimal-clone contract for the NPC cascade. `relationships` is the
 * in-settlement edge list (a DIFFERENT bucket from the neighbour links), and it
 * is joined by display name even though every edge also carries npc1Id/npc2Id.
 */
const NPC_CASCADE_BUCKETS = Object.freeze([
  'npcs',
  // The second home a character is stored in — see NPC_HOMES.
  'factions',
  'relationships',
  'interSettlementRelationships',
]);

// The two `powerStructure` path prefixes are composed rather than spelled
// inline for one specific reason: the FACTION-KEY no-fallback scan
// (tests/lint/factionNamePrecedenceScan.test.js) is a same-line text scan, and a
// literal `'powerStructure.factions[].name'` reads to it as a bare `.name`
// access off the roster. Composing keeps that guard sharp instead of teaching it
// an exception. Do NOT inline these back.
const ROSTER = 'powerStructure.factions[]';
const PAIRWISE = 'powerStructure.factionRelationships[]';

/**
 * THE TWO HOMES OF ONE NPC. A pipeline character is stored TWICE: once in
 * `settlement.npcs`, and once inside the NPC-grouping list as
 * `settlement.factions[].members[]`. At generation those are the SAME OBJECT —
 * power/factionGrouping.js pushes the very npc reference into `members` — so a
 * rename applied in memory appears to move both and every in-memory probe
 * agrees. A SAVED settlement is JSON, and JSON has no aliases: on reload the
 * two copies are independent objects. The cascade that walked only `npcs[]`
 * therefore looked correct on a live settlement and left every member copy
 * holding the dead name on every reloaded one.
 *
 * The cure is structural rather than a second hand-written loop: the fields are
 * declared ONCE here and applied at BOTH homes, so a field added for one can
 * never be forgotten at the other.
 */
const NPC_HOMES = Object.freeze(['npcs[]', 'factions[].members[]']);

/**
 * Every faction-name-bearing field an NPC record carries. `list` marks a field
 * holding an ARRAY of names rather than one; `kind` is the declared surface kind
 * (exact-key rewrite vs whole-word prose substitution).
 *
 * @type {ReadonlyArray<{ parent: string | null, key: string, kind: 'key' | 'prose', list?: boolean, why: string }>}
 */
const NPC_FACTION_FIELDS = Object.freeze([
  { parent: null, key: 'factionAffiliation', kind: 'key',
    why: 'the display-name link every pipeline NPC carries to its faction' },
  { parent: null, key: 'secondaryAffiliation', kind: 'key',
    why: 'the second display-name link npcGenerator writes for a character with a criminal tie' },
  { parent: null, key: 'linkedFactionIds', kind: 'key', list: true,
    why: 'id-bearing seats store a durable id; legacy generated seats without ids store the canonical display key, which must follow the rename' },
  { parent: 'secret', key: 'what', kind: 'prose',
    why: 'the secret itself is faction-token prose (npcGenerator substitutes the faction token into it)' },
  { parent: 'secret', key: 'stakes', kind: 'prose',
    why: 'the stakes sentence names the faction that would pay to bury the secret' },
  // ADDED 2026-08-01. Both fields were always faction-token prose; they were simply
  // absent from every seed the denominator happened to sample until wave I1 translated
  // the town/city streams and two of the 25 denominator cases began generating them.
  // The staleness they caused is therefore LATENT AND PRE-EXISTING, not new: any world
  // that rolled a faction-named role or goal has been surviving renames with a dead
  // name in it for as long as both fields have existed. Cascading is repair under the
  // faction lane's ALREADY-RATIFIED prose policy (the same policy that moves
  // secret.what and secret.stakes on these very records); the owner gate recorded in
  // NPC_NON_CASCADED_SURFACES governs rewriting prose about a PERSON during a PERSON
  // rename, which is a different lane and is untouched here.
  { parent: null, key: 'role', kind: 'prose',
    why: 'the character\'s title is faction-token prose ("Thieves\' Guild Master"); leaving it stale renders a member chip that still names the dissolved faction' },
  { parent: null, key: 'factionGoal', kind: 'prose',
    why: 'the generated goal line names the faction whose position the character maintains' },
]);

/**
 * The stored path of one NPC field under one of its two homes.
 * @param {string} home
 * @param {{ parent: string|null, key: string, list?: boolean }} field
 */
function npcFieldPath(home, field) {
  const owner = field.parent ? `${home}.${field.parent}` : home;
  return `${owner}.${field.key}${field.list ? '[]' : ''}`;
}

/**
 * The affiliation keys the MEMBERSHIP PREDICATE accepts that this cascade does
 * NOT rewrite, with the reason each is excluded. npcInFaction
 * (worldPulse/npcLadderState.js) resolves an NPC's faction through
 * `factionAffiliation | factionId | factionLink | faction | organizationId`,
 * first present wins; only the first is in NPC_FACTION_FIELDS. The other four are
 * declared here so the divergence reads as a decision rather than an oversight.
 *
 * @type {ReadonlyArray<{ key: string, why: string }>}
 */
const NPC_HANDLE_KEYS_NOT_CASCADED = Object.freeze([
  { key: 'factionId', why: 'an identity, not a label: a rename changes the label only (the same ruling as the roster id); no writer for it exists in src' },
  { key: 'factionLink', why: 'derived read-model output (npcProfile.js mints it from factionAffiliation via factionIdFromName), not stored generator state, and it holds an id' },
  { key: 'organizationId', why: 'an identity the membership predicate accepts; no writer for it exists in src, and an id never follows a label' },
  { key: 'faction', why: 'a name-shaped alternate affiliation key the membership predicate accepts, written by no generator; widening the cascade to a key only imported or custom content could carry is a persistence-shape judgement, recorded as latent rather than taken here' },
]);

/**
 * The enumerated cascade denominator. Every entry is a stored field that holds
 * a faction DISPLAY NAME (or prose naming one) on a saved settlement. `kind`
 * separates exact-key rewrites from whole-word prose substitution, because the
 * two carry different risks: a key rewrite must match exactly or it corrupts a
 * join, while prose substitution must respect word boundaries or it mangles an
 * unrelated word.
 *
 * @type {ReadonlyArray<{ path: string, kind: 'key' | 'prose', why: string }>}
 */
export const FACTION_RENAME_SURFACES = Object.freeze([
  { path: `${ROSTER}.faction`, kind: 'key', why: 'the canonical display name' },
  { path: `${ROSTER}.name`, kind: 'key', why: 'the legacy alias every tolerant reader falls back to' },
  { path: 'powerStructure.governingName', kind: 'key', why: 'the exact name of the faction holding the governing seat' },
  { path: 'powerStructure.government', kind: 'key', why: 'the government TYPE, which at generation equals the governing name' },
  { path: `${PAIRWISE}.pair[]`, kind: 'key', why: 'each pairwise relationship is keyed by the two faction names' },
  // The NPC family, declared once and mirrored across both homes a character is
  // stored in (see NPC_HOMES). Spread rather than hand-listed so the two homes
  // cannot drift — the drift IS the bug this replaced.
  ...NPC_HOMES.flatMap(home => NPC_FACTION_FIELDS.map(field => ({
    path: npcFieldPath(home, field),
    kind: field.kind,
    why: field.why,
  }))),
  { path: 'institutions[].factionSource', kind: 'key', why: 'the exact marker naming the faction that raised an institution' },
  { path: 'factions[].name', kind: 'key', why: 'the legacy top-level mirror the gallery rename surface renders' },
  { path: 'factions[].powerFactionName', kind: 'key', why: 'the NPC grouping list back-link to its power faction' },
  // The relationship edge list stores each end's TITLE alongside its name, and that
  // title carries the faction token exactly as the NPC-home `role` does. Declared here
  // rather than in NPC_FACTION_FIELDS because these live on the edge, not under either
  // NPC home. Same 2026-08-01 cause and same ratified prose policy as `role` above.
  { path: 'relationships[].npc1Role', kind: 'prose', why: 'the first end\'s title on a relationship edge, faction-token prose like the NPC-home role it copies' },
  { path: 'relationships[].npc2Role', kind: 'prose', why: 'the second end\'s title on that same edge; it moves if and only if its twin does' },
  { path: 'interSettlementRelationships[].factionName', kind: 'key', why: 'this settlement side of a neighbour link' },
  { path: 'interSettlementRelationships[].partnerFactionName', kind: 'key', why: 'the neighbour side of a link naming this faction' },
  { path: `${ROSTER}.desc`, kind: 'prose', why: 'the faction blurb names the faction' },
  { path: `${PAIRWISE}.narrative`, kind: 'prose', why: 'generated relationship prose names both factions' },
  { path: `${PAIRWISE}.dmNote`, kind: 'prose', why: 'the DM aside can name the faction' },
  { path: 'powerStructure.recentConflict', kind: 'prose', why: 'the recent-conflict line is faction-phrased prose' },
  { path: 'history.currentTensions[].factions[]', kind: 'prose', why: 'the tension PARTY roster: the dossier renders each entry as a faction chip and the PDF prints it as a tension party' },
  { path: 'pressureSentence', kind: 'prose', why: 'the generated pressure line names the governing faction on the summary tab, the map inspector, the PDF overview and the Foundry journal' },
]);

/**
 * The ledger of stored fields that DO hold a faction name and are deliberately
 * left alone. Kept beside the cascade so a future sweep reads a decision rather
 * than finding an apparent miss.
 *
 * @type {ReadonlyArray<{ path: string, why: string }>}
 */
export const NON_CASCADED_SURFACES = Object.freeze([
  { path: 'powerStructure.previousGovernments[].label', why: 'regime lineage is recorded history, not a live reference' },
  { path: `${ROSTER}.id`, why: 'the durable identity undo keys on; a rename changes the label only' },
  { path: 'campaignState.eventLog[].narrativeSummary', why: 'recorded history, and unreachable: renames are refused in canon phase' },
  { path: 'campaign.wizardNews.entries[]', why: 'campaign state this writer never holds, and a byte-identity golden surface: rewriting it would be a declared golden shift' },
  { path: 'townScene manifest labels', why: 'derived per compile from the roster; the scene schema carries no district-to-faction identity at all' },
  { path: 'aiData', why: 'cascaded by the registered applyCosmeticRename operation instead' },
  { path: 'simulationTrace[].causes[].reason', why: 'the generation TRACE, a recorded statement of what the generator decided while the faction still bore its old name; rewriting it would falsify the receipt, the same ruling as previousGovernments. It is also not a live reference: the fingerprint extractors read the trace enums and drop the reason prose' },
  { path: 'economicState.safetyProfile.criminalInstitutions[]', why: 'a fixed vocabulary label from the CRIMINAL_INST_LABELS table in generators/safetyProfile.js, naming an INSTITUTION rather than referring to the faction; that a criminal power faction is often generated with a similar name is incidental, and an institution owns its own name' },
  // THE MEMBERSHIP PREDICATE READS A WIDER KEY FAMILY THAN THIS LIST WRITES —
  // see NPC_HANDLE_KEYS_NOT_CASCADED above for the per-key reasons. Only one of
  // the four is an open question (`faction`); the rest hold identities, and an
  // identity never follows a label.
  // Spread across BOTH homes for the same reason NPC_FACTION_FIELDS is: a key
  // declared at one home and forgotten at the other IS the bug this module exists
  // to close, and that holds for a written ruling as much as for a rewrite.
  ...NPC_HOMES.flatMap(home => NPC_HANDLE_KEYS_NOT_CASCADED.map(field => ({
    path: `${home}.${field.key}`,
    why: field.why,
  }))),
]);

/**
 * The enumerated denominator for a PERSON rename. A character's display name is
 * a join key in fewer stored fields than a faction's, but it is stored at BOTH
 * homes (NPC_HOMES) and it keys the relationship edge list, so the same alias
 * split that hid the faction bug hides this one: a cascade that walked only
 * `npcs[]` looked complete on a live settlement and left every member copy
 * holding the dead name on every reloaded save. That member copy is what the
 * dossier renders as a faction member chip (tabs/RelationshipsTab.jsx).
 *
 * KEY SURFACES ONLY. Every entry is an exact-name join; the prose that NAMES a
 * character is ruled out in writing below rather than substituted.
 *
 * @type {ReadonlyArray<{ path: string, kind: 'key' | 'prose', why: string }>}
 */
export const NPC_RENAME_SURFACES = Object.freeze([
  { path: `${NPC_HOMES[0]}.name`, kind: 'key', why: 'the character record\'s own display name at the canonical home' },
  { path: `${NPC_HOMES[1]}.name`, kind: 'key', why: 'the grouping copy the dossier renders as a faction member chip; a separate object on every reloaded save' },
  { path: 'relationships[].npc1Name', kind: 'key', why: 'the first end of an NPC relationship edge, joined by display name' },
  { path: 'relationships[].npc2Name', kind: 'key', why: 'the second end of an NPC relationship edge, joined by display name' },
  { path: 'interSettlementRelationships[].npcName', kind: 'key', why: 'this settlement side of a neighbour NPC contact (the partner save holds the same person as partnerName)' },
]);

/**
 * The ledger of stored fields that DO hold a character's name and are left
 * alone. Every one of them is PROSE, and the ruling is the same for all:
 *
 *   NO RENAME LANE HAS EVER REWRITTEN GENERATED PROSE ABOUT A PERSON. The
 *   faction cascade substitutes faction names into prose under a ratified
 *   policy (see FACTION_RENAME_SURFACES' prose entries); that policy was
 *   decided for organizations and does not extend itself to people. Making a
 *   character rename rewrite the generated sentences about that character is
 *   NEW CAPABILITY rather than repair of the two-lane divergence this module
 *   closes, so it is owner-gated and recorded here rather than taken silently.
 *   Until it is ruled, these fields keep the name the generator wrote — stale
 *   after a rename, and deliberately so.
 *
 * @type {ReadonlyArray<{ path: string, why: string }>}
 */
export const NPC_NON_CASCADED_SURFACES = Object.freeze([
  { path: `${NPC_HOMES[0]}.secret.what`, why: 'the secret is generated prose that names the characters it implicates; prose policy for people is owner-gated (see above)' },
  { path: `${NPC_HOMES[0]}.secret.stakes`, why: 'the stakes sentence names who would pay to bury the secret; prose policy for people is owner-gated' },
  { path: `${NPC_HOMES[1]}.secret.what`, why: 'the grouping copy of the same secret prose; it moves if and only if its twin does' },
  { path: `${NPC_HOMES[1]}.secret.stakes`, why: 'the grouping copy of the same stakes prose; it moves if and only if its twin does' },
  { path: 'relationships[].description', why: 'the generated relationship paragraph names both ends; prose policy for people is owner-gated' },
  { path: 'relationships[].tension', why: 'the generated tension line names both ends; prose policy for people is owner-gated' },
  { path: 'interSettlementRelationships[].description', why: 'the generated contact sentence names both people and the partner settlement; prose policy for people is owner-gated' },
  // The prominent-relationship record, enumerated from its PRODUCER rather than
  // from whichever fields a sample seed happened to fill: genRelNarrative
  // (generators/power/settlementNarrative.js) emits exactly npc1, npc2, type,
  // phrasing, full, tension — and `type` is a relationship label, never a person.
  // It is a rendered quotation of one relationship, so it moves as a unit or not
  // at all, and the unit is prose.
  { path: 'prominentRelationship.npc1', why: 'the first end of a generated micro-record whose reader-facing half is prose; the record moves as a unit or not at all' },
  { path: 'prominentRelationship.npc2', why: 'the second end of that same generated micro-record' },
  { path: 'prominentRelationship.full', why: 'the quoted relationship description inside that record; prose policy for people is owner-gated' },
  { path: 'prominentRelationship.tension', why: 'the quoted tension line inside that record; prose policy for people is owner-gated' },
  { path: 'prominentRelationship.phrasing', why: 'the overview line drawn from that record; it is also a registered EDITABLE prose path (domain/userEdits.js), so a user may already own its wording' },
  { path: 'pressureSentence', why: 'the generated pressure line can name a character; it is a faction-rename PROSE surface, and extending it to people is the same owner-gated decision' },
]);

/**
 * @param {unknown} value
 * @returns {value is StoredRecord}
 */
function isRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * @param {unknown} value
 * @returns {unknown[] | null}
 */
function listOf(value) {
  return Array.isArray(value) ? value : null;
}

/**
 * Exact-name comparison used by every key rewrite. Trimmed on both sides so a
 * stored value carrying incidental whitespace still joins, but NOT case-folded:
 * two factions may legitimately differ only in case, and folding would rename
 * the wrong one.
 *
 * @param {unknown} value
 * @param {string} oldName
 */
function isSameName(value, oldName) {
  return typeof value === 'string' && value.trim() === oldName;
}

/**
 * Rewrite one string field when it exactly names the renamed faction.
 * Returns whether anything moved, so callers can report an honest `changed`.
 *
 * @param {StoredRecord} target
 * @param {string} key
 * @param {string} oldName
 * @param {string} newName
 */
function rewriteKey(target, key, oldName, newName) {
  if (!isSameName(target?.[key], oldName)) return false;
  target[key] = newName;
  return true;
}

/**
 * Set a field the record ALREADY declares, without minting it when absent.
 * `in` rather than a truthiness test so an empty-string alias is still healed,
 * and because it reads correctly through an Immer draft proxy.
 *
 * @param {StoredRecord} target
 * @param {string} key
 * @param {string} newName
 */
function rewriteOwn(target, key, newName) {
  if (!(key in target) || target[key] === newName) return false;
  target[key] = newName;
  return true;
}

/**
 * Whole-word substitute inside one prose field. Reuses the SAME substitution
 * the ai_data cosmetic rename uses, so settlement prose and narrative prose can
 * never disagree about what counts as a word boundary.
 *
 * @param {StoredRecord} target
 * @param {string} key
 * @param {string} oldName
 * @param {string} newName
 */
function rewriteProse(target, key, oldName, newName) {
  const current = target?.[key];
  if (typeof current !== 'string' || !current) return false;
  const next = substituteWholeWord(current, oldName, newName);
  if (next === current) return false;
  target[key] = next;
  return true;
}

/**
 * Rewrite every entry of a string ARRAY that exactly names the renamed faction.
 * Used for the name-keyed link lists. An entry holding a real slug id
 * (`faction.<slug>`) can never equal a display name, so a MIXED list heals only
 * its name-keyed half, which is precisely the half that dangles after a rename.
 *
 * @param {StoredRecord} target
 * @param {string} key
 * @param {string} oldName
 * @param {string} newName
 */
function rewriteNameList(target, key, oldName, newName) {
  const list = listOf(target?.[key]);
  if (!list) return false;
  let moved = false;
  for (let i = 0; i < list.length; i += 1) {
    if (!isSameName(list[i], oldName)) continue;
    list[i] = newName;
    moved = true;
  }
  return moved;
}

/**
 * Whole-word substitute inside every entry of a string ARRAY, using the same
 * substitution single-field prose gets. Entries here are roster names written
 * by a template substitution, so most are the bare name, but the substitution
 * can also land inside a longer party phrase; whole-word handles both and
 * cannot mangle a merely similar word.
 *
 * @param {StoredRecord} target
 * @param {string} key
 * @param {string} oldName
 * @param {string} newName
 */
function rewriteProseList(target, key, oldName, newName) {
  const list = listOf(target?.[key]);
  if (!list) return false;
  let moved = false;
  for (let i = 0; i < list.length; i += 1) {
    const current = list[i];
    if (typeof current !== 'string' || !current) continue;
    const next = substituteWholeWord(current, oldName, newName);
    if (next === current) continue;
    list[i] = next;
    moved = true;
  }
  return moved;
}

/**
 * Rewrite every faction-name-bearing field on ONE NPC record. Both homes run
 * this same function over the same declared field list, so the roster copy and
 * the grouping copy of one character can never disagree about their faction.
 *
 * @param {unknown} npc
 * @param {string} home  which of NPC_HOMES this record was reached through
 * @param {string} oldName
 * @param {string} newName
 * @param {(surface: string, moved: boolean) => void} mark
 */
function renameNpcRecord(npc, home, oldName, newName, mark) {
  if (!isRecord(npc)) return;
  for (const field of NPC_FACTION_FIELDS) {
    // A nested field's parent record must ALREADY exist; this module never
    // mints one, exactly as it never mints a missing name spelling.
    const owner = field.parent ? npc[field.parent] : npc;
    if (!isRecord(owner)) continue;
    const moved = field.list
      ? rewriteNameList(owner, field.key, oldName, newName)
      : field.kind === 'key'
        ? rewriteKey(owner, field.key, oldName, newName)
        : rewriteProse(owner, field.key, oldName, newName);
    mark(npcFieldPath(home, field), moved);
  }
}

/**
 * The canonical faction display name, through the ONE accessor
 * (FACTION-ACCESS LAW). The cast is the bridge from a loose stored record to
 * the accessor's declared shape: a NAMED cast, never `any`, written once so no
 * reader here is tempted to hand-roll the `.faction || .name` chain.
 *
 * @param {StoredRecord} record
 * @returns {string}
 */
function factionLabel(record) {
  return nameOf(/** @type {RulingFaction} */ (/** @type {unknown} */ (record)));
}

/**
 * Locate the faction record a rename addresses, using the STORE lane's
 * resolution: the canonical `powerStructure.factions` list first, the legacy
 * `settlement.factions` array only as a fallback for pre-pipeline saves.
 *
 * @param {unknown} settlement
 * @param {number} factionIndex
 * @returns {{ list: unknown[], record: StoredRecord, currentName: string } | null}
 */
export function resolveFactionForRename(settlement, factionIndex) {
  if (!isRecord(settlement)) return null;
  const power = isRecord(settlement.powerStructure) ? settlement.powerStructure : null;
  const canonical = listOf(power?.factions);
  const legacy = listOf(settlement.factions);
  const list = canonical && canonical.length ? canonical : legacy;
  if (!list) return null;
  const record = list[factionIndex];
  if (!isRecord(record)) return null;
  const currentName = factionLabel(record);
  if (!currentName) return null;
  return { list, record, currentName };
}

/**
 * Rename every supported settlement-reference field on ONE inter-settlement
 * relationship. Moved here from src/components/settlements/helpers.js so the
 * store lane and the library lane share one implementation; helpers.js
 * re-exports it for its existing importers.
 *
 * @param {StoredRecord} relationship
 * @param {string} oldName
 * @param {string} newName
 * @returns {StoredRecord}
 */
export function renameInterSettlementReference(relationship, oldName, newName) {
  /** @param {unknown} value */
  const rename = (value) => (value === oldName ? newName : value);
  return {
    ...relationship,
    partnerName: rename(relationship.partnerName),
    partnerFactionName: rename(relationship.partnerFactionName),
    npcName: rename(relationship.npcName),
    factionName: rename(relationship.factionName),
  };
}

/**
 * Rewrite ONLY the two faction-name fields on one relationship.
 *
 * Deliberately narrower than renameInterSettlementReference, which also rewrites
 * `partnerName` and `npcName`. Those are a SETTLEMENT name and a PERSON name: a
 * faction that happens to share a name with a neighbouring town or one of its
 * characters must not drag them along. The broad helper stays for the NPC and
 * settlement rename lanes that legitimately want it.
 *
 * @param {StoredRecord} relationship
 * @param {string} oldName
 * @param {string} newName
 * @returns {{ relationship: StoredRecord, changed: boolean }}
 */
function renameFactionFieldsOnLink(relationship, oldName, newName) {
  const factionMoved = isSameName(relationship.factionName, oldName);
  const partnerMoved = isSameName(relationship.partnerFactionName, oldName);
  if (!factionMoved && !partnerMoved) return { relationship, changed: false };
  return {
    relationship: {
      ...relationship,
      ...(factionMoved ? { factionName: newName } : {}),
      ...(partnerMoved ? { partnerFactionName: newName } : {}),
    },
    changed: true,
  };
}

/**
 * Apply a faction rename across every in-settlement surface in
 * FACTION_RENAME_SURFACES.
 *
 * MUTATES `settlement` IN PLACE. That is deliberate: both call sites already
 * hold a draft they own — the store lane inside an Immer producer, the library
 * lane on a structural clone it just made — and a pure copy here would either
 * fight Immer's proxy or force a second deep clone on every rename. The
 * function never reaches outside the object it is handed.
 *
 * @param {unknown} settlement  the settlement draft to rewrite
 * @param {string} oldName  the faction's current display name
 * @param {string} newName  the new display name (already trimmed by the caller)
 * @returns {{ changed: boolean, touched: string[] }} `touched` names the
 *   surfaces that actually moved, for receipts and for the cascade pin.
 */
export function applyFactionRenameToSettlement(settlement, oldName, newName) {
  /** @type {string[]} */
  const touched = [];
  if (!isRecord(settlement) || !oldName || !newName || oldName === newName) {
    return { changed: false, touched };
  }
  const mark = (/** @type {string} */ surface, /** @type {boolean} */ moved) => {
    if (moved && !touched.includes(surface)) touched.push(surface);
  };

  const power = isRecord(settlement.powerStructure) ? settlement.powerStructure : null;

  // 1-2. The canonical roster record itself. Every entry whose current name
  // matches is renamed, not just the addressed index: a duplicate-named record
  // is a data defect, and leaving one behind would silently split the join.
  for (const record of listOf(power?.factions) || []) {
    if (!isRecord(record)) continue;
    // THE BLURB IS REWRITTEN ON EVERY RECORD, not only the renamed one. A
    // rival's description routinely names the faction it is rival TO, and
    // scoping the prose to the matching record left every one of those stale on
    // the page. Whole-word substitution is name-scoped, so a record that never
    // mentions the old name is untouched. This runs BEFORE the label check
    // because the check reads the name the two lines below are about to change.
    mark(`${ROSTER}.desc`, rewriteProse(record, 'desc', oldName, newName));
    if (factionLabel(record) !== oldName) continue;
    // DUAL-WRITE, SHAPE-PRESERVING. Both spellings the record ALREADY carries
    // are set, so a divergent legacy record (`.faction` renamed long ago,
    // `.name` left stale) heals to the canonical name instead of keeping a
    // second answer alive. Neither spelling is MINTED: generator output carries
    // `.faction` only, and adding a redundant `.name` key to every renamed
    // faction would be a persistence-shape change for no reader's benefit.
    mark(`${ROSTER}.faction`, rewriteOwn(record, 'faction', newName));
    mark(`${ROSTER}.name`, rewriteOwn(record, 'name', newName));
  }

  // 3-4. The governing seat and the government TYPE. governingName must always
  // name the entry carrying isGoverning; `government` equals it at generation
  // and transferRulingPower keeps the two in step, so both follow the rename
  // only when they currently spell the old name.
  if (power) {
    mark('powerStructure.governingName', rewriteKey(power, 'governingName', oldName, newName));
    mark('powerStructure.government', rewriteKey(power, 'government', oldName, newName));
    mark('powerStructure.recentConflict', rewriteProse(power, 'recentConflict', oldName, newName));
  }

  // 5. Pairwise faction relationships: the `pair` tuple is the join key, the
  // narrative and DM note are prose that names both sides.
  for (const relationship of listOf(power?.factionRelationships) || []) {
    if (!isRecord(relationship)) continue;
    const pair = listOf(relationship.pair);
    if (pair) {
      let pairMoved = false;
      for (let i = 0; i < pair.length; i += 1) {
        if (!isSameName(pair[i], oldName)) continue;
        pair[i] = newName;
        pairMoved = true;
      }
      mark(`${PAIRWISE}.pair[]`, pairMoved);
    }
    mark(`${PAIRWISE}.narrative`, rewriteProse(relationship, 'narrative', oldName, newName));
    mark(`${PAIRWISE}.dmNote`, rewriteProse(relationship, 'dmNote', oldName, newName));
  }

  // 6. Every pipeline NPC's faction links are display NAMES. Miss these and the
  // roster silently regroups under "Unaffiliated".
  for (const npc of listOf(settlement.npcs) || []) {
    renameNpcRecord(npc, NPC_HOMES[0], oldName, newName, mark);
  }

  // 6b. The in-settlement relationship edges carry each end's TITLE, and a title
  // spells the faction ("Thieves' Guild Master"). The NAME halves of the same edge
  // belong to the NPC cascade; only the roles hold a faction token.
  for (const relationship of listOf(settlement.relationships) || []) {
    if (!isRecord(relationship)) continue;
    mark('relationships[].npc1Role', rewriteProse(relationship, 'npc1Role', oldName, newName));
    mark('relationships[].npc2Role', rewriteProse(relationship, 'npc2Role', oldName, newName));
  }

  // 7. Institutions raised BY this faction carry its exact name.
  for (const institution of listOf(settlement.institutions) || []) {
    if (!isRecord(institution)) continue;
    mark('institutions[].factionSource', rewriteKey(institution, 'factionSource', oldName, newName));
  }

  // 8-9. The legacy top-level mirror. This is a DIFFERENT record type (the NPC
  // grouping list): `.name` is its own label and `.powerFactionName` is its
  // back-link to the power faction, so both are checked independently.
  for (const group of listOf(settlement.factions) || []) {
    if (!isRecord(group)) continue;
    mark('factions[].name', rewriteKey(group, 'name', oldName, newName));
    mark('factions[].powerFactionName', rewriteKey(group, 'powerFactionName', oldName, newName));
    // The group's MEMBERS are NPC records — the second home (see NPC_HOMES).
    // On a live settlement these are the same objects the npcs[] walk above
    // already healed and every rewrite here is a no-op; on a settlement that
    // has been saved and reloaded they are separate copies, and this walk is
    // the only thing that moves them.
    for (const member of listOf(group.members) || []) {
      renameNpcRecord(member, NPC_HOMES[1], oldName, newName, mark);
    }
  }

  // 10-11. This save's own neighbour links.
  const links = listOf(settlement.interSettlementRelationships);
  if (links) {
    for (let i = 0; i < links.length; i += 1) {
      const before = links[i];
      if (!isRecord(before)) continue;
      const { relationship: after, changed } = renameFactionFieldsOnLink(before, oldName, newName);
      if (!changed) continue;
      links[i] = after;
      mark('interSettlementRelationships[].factionName', after.factionName !== before.factionName);
      mark('interSettlementRelationships[].partnerFactionName', after.partnerFactionName !== before.partnerFactionName);
    }
  }

  // 12. The tension PARTY roster. This is the ONLY path under `history` this
  // module touches (see CASCADE_BUCKETS): the timeline, the founding record and
  // the historical character are recorded history and are left exactly alone.
  const history = isRecord(settlement.history) ? settlement.history : null;
  for (const tension of listOf(history?.currentTensions) || []) {
    if (!isRecord(tension)) continue;
    mark(
      'history.currentTensions[].factions[]',
      rewriteProseList(tension, 'factions', oldName, newName),
    );
  }

  // 13. The generated pressure line, which names the governing faction.
  mark('pressureSentence', rewriteProse(settlement, 'pressureSentence', oldName, newName));

  return { changed: touched.length > 0, touched };
}

/**
 * The IMMUTABLE form of the cascade, for callers that hold a saved row rather
 * than a draft (the gallery lane maps over React state).
 *
 * Returns only the top-level settlement buckets the cascade actually touched,
 * ready to spread over the existing settlement. Nothing outside CASCADE_BUCKETS
 * is cloned, so renaming a faction never copies the map, the chronicle, or the
 * economy tables.
 *
 * @param {unknown} settlement
 * @param {string} oldName
 * @param {string} newName
 * @returns {{ changed: boolean, touched: string[], changes: StoredRecord }}
 */
export function factionRenameChanges(settlement, oldName, newName) {
  if (!isRecord(settlement)) return { changed: false, touched: [], changes: {} };
  /** @type {StoredRecord} */
  const draft = {};
  for (const bucket of CASCADE_BUCKETS) {
    if (settlement[bucket] === undefined) continue;
    draft[bucket] = deepClone(settlement[bucket]);
  }
  const { changed, touched } = applyFactionRenameToSettlement(draft, oldName, newName);
  if (!changed) return { changed: false, touched: [], changes: {} };
  return { changed: true, touched, changes: draft };
}

/**
 * Cascade a faction rename into ONE neighbour save. A partner settlement never
 * holds the renamed faction's roster; it holds name-keyed links back to the
 * host settlement, and those links are what dangle after a rename.
 *
 * Returns a NEW settlement object (or the original reference when nothing
 * moved), because the library lane maps over immutable save rows here rather
 * than mutating a draft.
 *
 * @param {unknown} partnerSettlement  the neighbour save's settlement
 * @param {string} hostName        the renamed faction's OWN settlement name
 * @param {string} oldName
 * @param {string} newName
 * @returns {{ settlement: unknown, changed: boolean }}
 */
export function applyFactionRenameToPartner(partnerSettlement, hostName, oldName, newName) {
  const partner = isRecord(partnerSettlement) ? partnerSettlement : null;
  const links = partner ? listOf(partner.interSettlementRelationships) : null;
  if (!partner || !links || !hostName || !oldName || !newName || oldName === newName) {
    return { settlement: partnerSettlement, changed: false };
  }
  let changed = false;
  const next = links.map((relationship) => {
    // Scoped to links that point AT the host settlement. Two neighbours may
    // each have a faction of the same name; renaming one must not rewrite the
    // other's link.
    if (!isRecord(relationship) || relationship.partnerSettlement !== hostName) return relationship;
    const result = renameFactionFieldsOnLink(relationship, oldName, newName);
    if (!result.changed) return relationship;
    changed = true;
    return result.relationship;
  });
  if (!changed) return { settlement: partnerSettlement, changed: false };
  return {
    settlement: { ...partner, interSettlementRelationships: next },
    changed: true,
  };
}

/**
 * Apply an NPC rename across every in-settlement surface in
 * NPC_RENAME_SURFACES — THE ONE NPC-RENAME WRITER.
 *
 * Both rename lanes call this. Before it, the store lane wrote exactly
 * `npcs[index].name` and the library lane wrote `npcs[].name` plus the
 * relationship and neighbour joins; NEITHER walked `factions[].members[]`, so
 * on every reloaded save the dossier's member chips kept the dead name.
 *
 * KEYED BY NAME, ALL MATCHING RECORDS. The caller addresses one character (by
 * index in the store lane, by id in the library lane) but the cascade rewrites
 * every record whose name matches, exactly as the faction roster walk does. Two
 * characters sharing a display name is a data defect, and the joins below CANNOT
 * tell them apart — `relationships[].npc1Name` is a name, not an id — so
 * renaming only one of them would silently split the join instead of healing it.
 *
 * MUTATES `settlement` IN PLACE, on the same reasoning as
 * applyFactionRenameToSettlement: both callers already hold a draft they own.
 *
 * @param {unknown} settlement  the settlement draft to rewrite
 * @param {string} oldName  the character's current display name
 * @param {string} newName  the new display name (already trimmed by the caller)
 * @returns {{ changed: boolean, touched: string[] }} `touched` names the
 *   surfaces that actually moved, for receipts and for the cascade pin.
 */
export function applyNpcRenameToSettlement(settlement, oldName, newName) {
  /** @type {string[]} */
  const touched = [];
  if (!isRecord(settlement) || !oldName || !newName || oldName === newName) {
    return { changed: false, touched };
  }
  const mark = (/** @type {string} */ surface, /** @type {boolean} */ moved) => {
    if (moved && !touched.includes(surface)) touched.push(surface);
  };

  // 1. The canonical home.
  for (const npc of listOf(settlement.npcs) || []) {
    if (!isRecord(npc)) continue;
    mark(`${NPC_HOMES[0]}.name`, rewriteKey(npc, 'name', oldName, newName));
  }

  // 2. The grouping home. On a live settlement these ARE the objects above and
  // every rewrite here is a no-op; on a reloaded save they are separate copies,
  // and this walk is the only thing that moves them.
  for (const group of listOf(settlement.factions) || []) {
    if (!isRecord(group)) continue;
    for (const member of listOf(group.members) || []) {
      if (!isRecord(member)) continue;
      mark(`${NPC_HOMES[1]}.name`, rewriteKey(member, 'name', oldName, newName));
    }
  }

  // 3. The in-settlement relationship edges. Both ends are display names: miss
  // one and the edge points at a character who no longer exists.
  for (const relationship of listOf(settlement.relationships) || []) {
    if (!isRecord(relationship)) continue;
    mark('relationships[].npc1Name', rewriteKey(relationship, 'npc1Name', oldName, newName));
    mark('relationships[].npc2Name', rewriteKey(relationship, 'npc2Name', oldName, newName));
  }

  // 4. This save's own neighbour contacts. Scoped to links whose `npcName` IS
  // this character: on any save that field holds THAT save's own person, while
  // `partnerName` holds the neighbour's — so the broad reference rewrite is
  // correct for a link about this person and would rename a stranger on any
  // other link that happened to share the name.
  const links = listOf(settlement.interSettlementRelationships);
  if (links) {
    for (let i = 0; i < links.length; i += 1) {
      const before = links[i];
      if (!isRecord(before) || before.npcName !== oldName) continue;
      links[i] = renameInterSettlementReference(before, oldName, newName);
      mark('interSettlementRelationships[].npcName', true);
    }
  }

  return { changed: touched.length > 0, touched };
}

/**
 * The IMMUTABLE form of the NPC cascade, for the library lane's saved rows.
 * Returns only the top-level buckets the cascade touched, ready to spread over
 * the existing settlement.
 *
 * @param {unknown} settlement
 * @param {string} oldName
 * @param {string} newName
 * @returns {{ changed: boolean, touched: string[], changes: StoredRecord }}
 */
export function npcRenameChanges(settlement, oldName, newName) {
  if (!isRecord(settlement)) return { changed: false, touched: [], changes: {} };
  /** @type {StoredRecord} */
  const draft = {};
  for (const bucket of NPC_CASCADE_BUCKETS) {
    if (settlement[bucket] === undefined) continue;
    draft[bucket] = deepClone(settlement[bucket]);
  }
  const { changed, touched } = applyNpcRenameToSettlement(draft, oldName, newName);
  if (!changed) return { changed: false, touched: [], changes: {} };
  return { changed: true, touched, changes: draft };
}

/**
 * Cascade an NPC rename into ONE neighbour save. A partner settlement never
 * holds the renamed character's record; it holds contact links back to the host,
 * and on those links the host's person is `partnerName` (the partner's OWN
 * person is `npcName` — see buildInterSettlementNPCs and
 * crossSettlementConflicts, which build both sides from the same pair).
 *
 * Scoped twice over: to links pointing AT the host settlement, and to the field
 * that actually holds the host's person. Two neighbours may each have someone of
 * the same name, and renaming one must not rewrite the other's contact.
 *
 * Returns a NEW settlement object (or the original reference when nothing
 * moved), because the library lane maps over immutable save rows.
 *
 * @param {unknown} partnerSettlement  the neighbour save's settlement
 * @param {string} hostName  the renamed character's OWN settlement name
 * @param {string} oldName
 * @param {string} newName
 * @returns {{ settlement: unknown, changed: boolean }}
 */
export function applyNpcRenameToPartner(partnerSettlement, hostName, oldName, newName) {
  const partner = isRecord(partnerSettlement) ? partnerSettlement : null;
  const links = partner ? listOf(partner.interSettlementRelationships) : null;
  if (!partner || !links || !hostName || !oldName || !newName || oldName === newName) {
    return { settlement: partnerSettlement, changed: false };
  }
  let changed = false;
  const next = links.map((relationship) => {
    if (!isRecord(relationship)) return relationship;
    if (relationship.partnerSettlement !== hostName || relationship.partnerName !== oldName) return relationship;
    changed = true;
    return renameInterSettlementReference(relationship, oldName, newName);
  });
  if (!changed) return { settlement: partnerSettlement, changed: false };
  return {
    settlement: { ...partner, interSettlementRelationships: next },
    changed: true,
  };
}
