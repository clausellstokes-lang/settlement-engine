/**
 * domain/npc/livedExperienceSources.js — THE SOURCE ADAPTERS (W-LIVES car L4;
 * DESIGN_W_LIVES.md §3, as amended by §15's panel fold, which OUTRANKS it).
 *
 * WHAT THIS HOLDS. One static registry, one adapter per receipted kind. An adapter
 * is a PURE READ of an outcome the tick ALREADY produced, turned into a lesson
 * entry for `livedExperienceFunnel.js`. Nothing here rolls, writes, or decides that
 * something happened — the source-qualification law (§3) says a source registers
 * only if it already emits a receipted outcome, and this file's whole job is to be
 * the place where that law is checkable rather than remembered.
 *
 * ── THE LAW IS A LOAD-TIME REFUSAL, NOT A CONVENTION ────────────────────────
 *
 * `LIVED_EXPERIENCE_SOURCES` is reconciled against the catalog's own census at
 * module evaluation: a row for a `sourceUnverified` kind THROWS, and so does a
 * receipted kind with no row and no written reason. A phantom source cannot be
 * added to this file by accident, and a real one cannot be dropped in silence.
 * The funnel refuses unverified kinds a second time at its own door; two
 * independent refusals is deliberate, because this one names the coding error and
 * that one names the runtime fact.
 *
 * ── THE POSITIONAL KEY NEVER LEAVES THE TICK (car L2's ruling, honoured) ────
 *
 * Every receipted record in this estate addresses a person by `npcId(saveId, npc,
 * index)` — a composite whose subpart is the ROSTER id, and roster ids in this
 * engine are slot names (`npc_6`). That is precisely the key L2's recon refuted for
 * anything persisted: on a reroll the slot rebinds and a stranger inherits the
 * name. So no adapter parses such a key backwards. Instead `subjectByNpcKey`
 * recomputes the key FORWARD over the live roster and matches, which resolves to a
 * roster RECORD; the funnel then resolves that record to the durable `wnpc_`
 * identity itself. The positional string is a within-tick join and dies here.
 *
 * ⚠ ONE SOURCE SPEAKS THE OTHER LANGUAGE. `npc_pardon` carries ONLY a `wnpcId` and
 * no roster id at all, so its adapter runs the ledger's `originRef` IN REVERSE
 * (durable id → settlement + roster identity → the live record). That is what
 * `originRef` is for, and it is the only lawful direction: minting a roster
 * identity from a durable id any other way would be inventing the linkage.
 *
 * ── THE §856 NON-OVERLAP LAW, AND IT BLOCKS TWO ROWS TONIGHT ────────────────
 *
 * The chair ruled STAND-BESIDE NOW, MIGRATE BY CHARTER, and put the pin here: no
 * signal may feed both this funnel and `worldPulse/npcGrowthKernel.js`, which is a
 * second lived-experience funnel that is LIT in three presets today. The census
 * below is executed, not asserted, and it FOUND TWO COLLISIONS:
 *
 *   `home_liberated`     reads `occupation_lifted`, which is one of the two
 *                        conditions the kernel's `siege_survived` signal matches.
 *   `corruption_exposed` reads the `ousted` exposure, which is one of the two
 *                        facts the kernel's `betrayal` signal matches.
 *
 * Both rows are therefore registered as BLOCKED: they carry their address, their
 * collision and their cure, and they emit NOTHING. A blocked row is not a gap — it
 * is the pin doing its job in the only way that costs something, and a pin that
 * never blocks anything is a pin nobody has tested. ⚠ The block is at the LITERAL
 * grain the ruling names (signal), not at the finer (signal × soul) grain where
 * both collisions arguably dissolve — the kernel teaches a settlement's OFFICE
 * HOLDERS while these adapters teach the PERSON the thing happened to. That
 * narrowing would be worth real ground and it is NOT this seat's to take; it is
 * raised in `SOURCE_PROVENANCE.ownerRows` and both grains are measured, so the
 * chair can rule on numbers. Unblocking is deleting one field per row.
 *
 * PURE. No world state written, no clock, no PRNG, no I/O, no mutation. Every fold
 * is codepoint-ordered. Consumed by nothing in production — the pulse call site is
 * car L5's, and the funnel it feeds is dark at L2's one door.
 *
 * @see docs/DESIGN_W_LIVES.md §3, §12 (R2), §15 (F9 as amended at §853, F12)
 * @see docs/OWNER_DECISION_QUEUE.md §800, §853, §856
 * @enforced-by tests/domain/npc/livedExperienceSources.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
import { INTERVAL_WEEKS } from '../worldPulse/intervalWeeks.js';
import { npcLedgerOf } from '../worldPulse/npcLedger.js';
import { stablePart } from '../worldPulse/stablePart.js';
import { GROWTH_DEPOSIT_MAP } from '../worldPulse/npcGrowthKernel.js';
import {
  EXPERIENCE_TABLE,
  RECEIPTED_EXPERIENCE_KINDS,
  SILENT_EXPERIENCE_KIND,
  experienceRowOf,
} from './livedExperienceCatalog.js';
import { AMBIENT_CADENCE_TICKS } from './livedExperienceFunnel.js';

/**
 * The dwell states the roads mirror can hold (`roads/state.js:WHEREABOUTS_STATES`),
 * MIRRORED rather than imported so this leaf does not take a dependency on the
 * roads family for four word tokens. The reconcile pin asserts the equality.
 * @type {readonly string[]}
 */
export const WHEREABOUTS_STATES_MIRROR = Object.freeze(['traveling', 'visiting', 'returning', 'hostage']);

/**
 * ⭐⭐ THE ONLY DWELL LONG ENOUGH TO TEACH, AND IT IS CAPTIVITY.
 *
 * §800.4 promises "the gentle man in a cruel city". Measured against this tree, the
 * milieu source can reach the ambient cadence through exactly ONE whereabouts
 * state. An ordinary visit is `ROADS_TUNING.STAY_BASE_WEEKS + seeded 0..1` = ONE OR
 * TWO WEEKS against a THIRTEEN-week cadence, so every visiting emission would be
 * sub-floor and honestly refused. A ransom term is `RANSOM_TERM_BASE_WEEKS +
 * round(26 × importance)` = 13..39 weeks — one to three cadences.
 *
 * And `hostage` is also the ONE state whose `sinceTick` means what its name says
 * (the capture tick). For traveling/visiting/returning the mirror carries
 * `departTick` — time since leaving HOME, not time dwelt at the host — so a reader
 * that treated the field uniformly would over-count every visitor's dwell by the
 * whole outbound journey. The field is right for one state and wrong for three,
 * and nothing reds: the estate's undeclared-unit class, fourth sighting.
 *
 * So the milieu adapter reads HOSTAGE dwell only, and says so here rather than
 * silently returning nothing for everybody else.
 */
export const MILIEU_DWELL_STATE = 'hostage';

/**
 * How a source is addressed. Three shapes exist in this estate and pretending
 * otherwise is how an adapter reads a field that is not there.
 *
 *   `news`   the normalized WizardNewsEntry feed (`region/wizardNews.js`), which is
 *            where both emission paths converge — direct minters and, after
 *            `worldPulseFeedCuration.newsEntryForOutcome`, the PulseOutcome ones.
 *   `record` a `pulseRecord` projection (`corruptionEvents`, `factionCaptureEvents`),
 *            which are NARROWED and drop fields their raw sources carry.
 *   `ledger` a worldState ledger read (`spatialLedgers.roads`, `spatialLedgers.npcRulings`).
 * @type {readonly string[]}
 */
export const SOURCE_SURFACES = Object.freeze(['news', 'record', 'ledger']);

/**
 * How an adapter finds the souls a receipt reached. The rung IS the honesty of the
 * address: `npcKey` names one person the record named; `home` is a JOIN this file
 * performs because the record is settlement-addressed and the plane is affiliation.
 * @type {readonly string[]}
 */
export const SUBJECT_RESOLUTIONS = Object.freeze(['npcKey', 'durableId', 'displayName', 'home', 'patronDeity']);

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {unknown[]} */
function asArray(v) {
  return Array.isArray(v) ? v : [];
}

/** @param {unknown} v @returns {string} */
function str(v) {
  return v == null ? '' : String(v);
}

/** @param {unknown} v @returns {number} */
function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * The estate's composite NPC key, RE-DERIVED FORWARD. Never parse one backwards:
 * the subpart may be a roster id, a name slug or (for a nameless row) a positional
 * slug, and only the roster itself can say which.
 * @param {string} settlementId @param {unknown} npc @param {number} index
 * @returns {string}
 */
export function npcKeyOf(settlementId, npc, index) {
  const record = asObject(npc);
  const sub = str(record.id) || stablePart(record.name || record.label || `npc_${index}`);
  return `${settlementId}:${sub}`;
}

/**
 * @typedef {Object} SourceHome  ONE SETTLEMENT, AS THE CALLER RESOLVED IT.
 *
 * The caller builds one of these per settlement it is folding, from the snapshot
 * item it already holds:
 *
 *   placeId   `String(snapshotItem.id)`
 *   placeSeed the seed pulseKernel already computes at `snapshotItem?.save?.seed`
 *   cast      `settlement.npcs`, IN ROSTER ORDER (the composite key is positional)
 *   patronRef `settlement.config.primaryDeitySnapshot._deityRef` (or its legacy spelling)
 *
 * ⚠ THE FIELD NAMES ARE DELIBERATELY NOT A SETTLEMENT'S. This record is derived
 * FROM a settlement and is not one, and the observed-shape ratchet is what taught
 * the distinction: an earlier draft called it `settlement` and gave it `roster` and
 * `settlementId`, so every read looked like a read of a settlement key that no
 * writer in the estate produces. Naming a derived thing after the thing it derives
 * from is how a reader ends up believing the engine writes a shape nobody writes.
 * @property {string} placeId
 * @property {string} placeSeed
 * @property {ReadonlyArray<object>} cast
 * @property {string} patronRef
 */

/**
 * @typedef {Object} SourceContext   everything the tick ALREADY produced
 * @property {number} tick
 * @property {Record<string, unknown>} worldState
 * @property {ReadonlyArray<SourceHome>} homes
 *   RESOLVED BY THE CALLER, and that is a contract rather than a convenience.
 *   ⭐ THE SEED IS THE REASON. pulseKernel.js already computes a settlement seed at
 *   `snapshotItem?.save?.seed` — falling back through the settlement's own and then
 *   the id — and hands it to the verdict lane's `graduateNpc`. The durable-id mint
 *   HASHES that seed, so a second spelling of the line would graduate one person
 *   under two identities and nothing would ever red. Re-deriving it here would have
 *   been exactly that second spelling. The pulse computes it ONCE and passes it,
 *   which is one writer instead of two.
 *   The other reason is the estate's observed-shape ratchet: reading `save.seed`,
 *   `settlement.seed` and `config.primaryDeitySnapshot` here put five reads of
 *   engine shapes into a mapping leaf that has no business knowing them. Both keys
 *   are real (their writers are the SAVE PATH and the AUTHORED-INPUT surfaces, the
 *   ratchet's own M8/M9 classes) — but the plumbing belongs at the pulse seam, and
 *   the ratchet is what made that legible.
 * @property {ReadonlyArray<Record<string, unknown>>} [news]     normalized WizardNewsEntry rows
 * @property {ReadonlyArray<Record<string, unknown>>} [corruptionEvents]
 *   `pulseRecord.corruptionEvents` — the NARROWED projection
 *   `{settlementId, name, kind, criminalInstitution, homeInstitution}`.
 * @property {ReadonlyArray<Record<string, unknown>>} [captureTransitions]
 *   `pulseRecord.factionCaptureEvents` — `{settlementId, name, from, to}`. Named as
 *   its own input rather than reached through the record, for the same reason
 *   `homes` is: an adapter should say which surface it needs, not go rummaging in a
 *   record for it. The two ends matter here — see `factionEntries`.
 */

/**
 * @typedef {Object} SourceAdapter
 * @property {string} kind             a RECEIPTED_EXPERIENCE_KINDS member
 * @property {string} surface          a SOURCE_SURFACES member
 * @property {string} address          the exact token/path the adapter matches on
 * @property {string} resolution       a SUBJECT_RESOLUTIONS member
 * @property {readonly string[]} signals   the tokens this adapter reads — the non-overlap census's input
 * @property {string|null} flagKey     the rules flag whose darkness silences it; null ⇒ none
 * @property {string|null} blocked     non-null ⇒ REGISTERED BUT SILENT, and this is why
 * @property {(ctx: SourceContext) => ReadonlyArray<Record<string, unknown>>} read
 */

// ── SUBJECT RESOLVERS — pure, and none of them guesses ───────────────────────

/**
 * The caller's homes, normalized and codepoint-ordered so a collection is a
 * property of the input set rather than of its arrival order. A home with no id is
 * dropped — an adapter cannot address a place that will not say where it is.
 * @param {SourceContext} ctx @returns {SourceHome[]}
 */
function orderedSettlements(ctx) {
  return asArray(asObject(ctx).homes)
    .map((raw) => {
      const home = asObject(raw);
      return /** @type {SourceHome} */ ({
        placeId: str(home.placeId),
        placeSeed: str(home.placeSeed),
        cast: asArray(home.cast),
        patronRef: str(home.patronRef),
      });
    })
    .filter((home) => home.placeId)
    .sort((a, b) => compareCodepoint(a.placeId, b.placeId));
}

/**
 * The roster record a composite key names, by recomputing the key forward. Returns
 * the settlement beside it because a lesson entry needs the seed too.
 * @param {SourceContext} ctx @param {string} npcKey
 * @returns {{home: SourceHome, npc: object}|null}
 */
export function subjectByNpcKey(ctx, npcKey) {
  const wanted = str(npcKey);
  if (!wanted) return null;
  for (const home of orderedSettlements(ctx)) {
    for (let index = 0; index < home.cast.length; index += 1) {
      if (npcKeyOf(home.placeId, home.cast[index], index) === wanted) {
        return { home, npc: asObject(home.cast[index]) };
      }
    }
  }
  return null;
}

/**
 * The roster record a DURABLE identity names, through the ledger's `originRef` read
 * in reverse. The only lawful direction, and the only source that needs it is the
 * pardon record, which carries no roster id at all.
 * @param {SourceContext} ctx @param {string} wnpcId
 * @returns {{home: SourceHome, npc: object}|null}
 */
export function subjectByDurableId(ctx, wnpcId) {
  const id = str(wnpcId);
  if (!id) return null;
  const ledger = npcLedgerOf(/** @type {{spatialLedgers?: unknown}} */ (asObject(asObject(ctx).worldState)));
  // `asObject` is TOTAL and returns `{}` for a miss, so an `||` chain over it would
  // always take the first branch. The presence test has to be explicit.
  const placed = asObject(ledger.placed);
  const roamers = asObject(ledger.roamers);
  const record = asObject(Object.prototype.hasOwnProperty.call(placed, id) ? placed[id] : roamers[id]);
  const origin = asObject(record.originRef);
  const homeId = str(origin.settlementId);
  const rosterId = str(origin.rosterId);
  const name = str(origin.name);
  if (!homeId || (!rosterId && !name)) return null;
  for (const home of orderedSettlements(ctx)) {
    if (home.placeId !== homeId) continue;
    for (const row of home.cast) {
      const npc = asObject(row);
      // BOTH halves must agree, exactly as the ledger's own identity key does: a
      // slot id alone is the rebind class, and a name alone is not an identity.
      if (str(npc.id) === rosterId && str(npc.name) === name) return { home, npc };
    }
  }
  return null;
}

/**
 * A settlement's whole roster — the AFFILIATION-plane join. A realm event is
 * addressed to a place; the people it happened to are the people who live there.
 * @param {SourceContext} ctx @param {string} settlementId
 * @returns {Array<{home: SourceHome, npc: object}>}
 */
export function subjectsByHome(ctx, settlementId) {
  const wanted = str(settlementId);
  const out = [];
  for (const home of orderedSettlements(ctx)) {
    if (home.placeId !== wanted) continue;
    for (const row of home.cast) out.push({ home, npc: asObject(row) });
  }
  return out;
}

/**
 * The unique roster record carrying a display name in one settlement, or NULL when
 * two people share it. `corruptionEvents` is a NARROWED projection that keeps
 * `name` and drops `npcId`, so a name is the only handle it leaves — and a name is
 * not an identity. AMBIGUITY REFUSES rather than picking the first match: teaching
 * the wrong soul a lesson about somebody else's disgrace is worse than teaching
 * nobody, and it would be unfindable afterwards.
 * @param {SourceContext} ctx @param {string} settlementId @param {string} name
 * @returns {{home: SourceHome, npc: object}|null}
 */
export function subjectByDisplayName(ctx, settlementId, name) {
  const wanted = str(name);
  if (!wanted) return null;
  const hits = subjectsByHome(ctx, settlementId)
    .filter((row) => str(asObject(row.npc).name) === wanted);
  return hits.length === 1 ? hits[0] : null;
}

/**
 * Every roster of every settlement whose patron deity is the named one — §14's own
 * small rule for the affiliation plane's "your god" ("laity → the settlement
 * patron"). The pantheon receipt carries `settlementIds: []` and names no soul, so
 * without this join the two god kinds have a receipt and no reachable subject.
 * @param {SourceContext} ctx @param {string} deityId
 * @returns {Array<{home: SourceHome, npc: object}>}
 */
export function subjectsByPatronDeity(ctx, deityId) {
  const wanted = str(deityId);
  if (!wanted) return [];
  const out = [];
  for (const home of orderedSettlements(ctx)) {
    if (str(home.patronRef) !== wanted) continue;
    for (const row of home.cast) out.push({ home, npc: asObject(row) });
  }
  return out;
}

// ── ENTRY CONSTRUCTION ───────────────────────────────────────────────────────

/**
 * One lesson entry. The KIND owns its plane, so no adapter declares one — the
 * funnel refuses a declaration that disagrees, and an adapter that never declares
 * one cannot disagree in the first place.
 * @param {string} kind @param {{home: SourceHome, npc: object}} subject
 * @param {string} eventId @param {Record<string, unknown>} [extra]
 * @returns {Record<string, unknown>}
 */
function entry(kind, subject, eventId, extra = {}) {
  return Object.freeze({
    kind,
    settlementId: subject.home.placeId,
    settlementSeed: subject.home.placeSeed,
    npc: subject.npc,
    eventId,
    ...extra,
  });
}

/**
 * The tick's normalized news rows matching a predicate, codepoint-ordered by id so
 * a collection cannot depend on feed order.
 * @param {SourceContext} ctx @param {(row: Record<string, unknown>) => boolean} match
 * @returns {Array<Record<string, unknown>>}
 */
function newsRows(ctx, match) {
  return asArray(asObject(ctx).news)
    .map((row) => asObject(row))
    .filter((row) => str(row.id) && match(row))
    .sort((a, b) => compareCodepoint(str(a.id), str(b.id)));
}

/**
 * The rows of one caller-supplied record projection, in order. These arrays are
 * already capped and ordered by their producer; they carry no id, so the adapter
 * mints the evidence id from the row's own fields plus the tick.
 * @param {SourceContext} ctx @param {string} key
 * @returns {Array<Record<string, unknown>>}
 */
function recordRows(ctx, key) {
  return asArray(asObject(ctx)[key]).map((row) => asObject(row));
}

/** @param {SourceContext} ctx @returns {number} */
function tickOf(ctx) {
  return Math.max(0, Math.floor(num(asObject(ctx).tick)));
}

/**
 * Every soul a news row's `npcIds` names, resolved to roster records. Rows that
 * resolve to nobody are DROPPED rather than guessed at — a receipt naming a person
 * this tree cannot find is a receipt about somebody who is not here.
 * @param {SourceContext} ctx @param {Record<string, unknown>} row @param {number} [slot]
 *   when given, only that position of `npcIds` (the ladder's array is positional:
 *   challenger first, defender second)
 * @returns {Array<{home: SourceHome, npc: object}>}
 */
function subjectsOfRow(ctx, row, slot) {
  const ids = asArray(row.npcIds).map((v) => str(v)).filter(Boolean);
  const wanted = slot === undefined ? ids : ids.slice(slot, slot + 1);
  const out = [];
  for (const id of wanted) {
    const hit = subjectByNpcKey(ctx, id);
    if (hit) out.push(hit);
  }
  return out;
}

// ── THE ADAPTERS ─────────────────────────────────────────────────────────────

/**
 * @param {string} kind @param {string} surface @param {string} address
 * @param {string} resolution @param {readonly string[]} signals
 * @param {(ctx: SourceContext) => ReadonlyArray<Record<string, unknown>>} read
 * @param {Partial<SourceAdapter>} [extra]
 * @returns {SourceAdapter}
 */
const adapter = (kind, surface, address, resolution, signals, read, extra = {}) => Object.freeze({
  kind,
  surface,
  address,
  resolution,
  signals: Object.freeze([...signals]),
  flagKey: null,
  blocked: null,
  read,
  ...extra,
});

/**
 * THE LADDER — one beat carries both outcomes, and the third `npc_ladder` emitter
 * (`investitureBeat`) rides the same `impactKind`. `tags` is the ONLY discriminator
 * that survives onto the record, so both adapters read it, and the investiture rows
 * are excluded EXPLICITLY rather than by hoping no third kind ever lands.
 * @param {SourceContext} ctx @param {string} outcomeTag @param {number} slot
 * @param {string} kind @returns {Array<Record<string, unknown>>}
 */
function ladderEntries(ctx, outcomeTag, slot, kind) {
  const out = [];
  for (const row of newsRows(ctx, (r) => str(r.impactKind) === 'npc_ladder'
    && asArray(r.tags).map(str).includes(outcomeTag)
    && !asArray(r.tags).map(str).includes('investiture'))) {
    for (const subject of subjectsOfRow(ctx, row, slot)) {
      out.push(entry(kind, subject, str(row.id)));
    }
  }
  return out;
}

/**
 * A settlement-addressed news row taught to everybody who lives there — the
 * affiliation join, written once because four kinds need exactly it.
 * @param {SourceContext} ctx @param {(row: Record<string, unknown>) => boolean} match
 * @param {string} kind @returns {Array<Record<string, unknown>>}
 */
function homeEntries(ctx, match, kind) {
  const out = [];
  for (const row of newsRows(ctx, match)) {
    const ids = asArray(row.settlementIds).map(str).filter(Boolean);
    for (const settlementId of [...new Set(ids)].sort(compareCodepoint)) {
      for (const subject of subjectsByHome(ctx, settlementId)) {
        out.push(entry(kind, subject, str(row.id)));
      }
    }
  }
  return out;
}

/**
 * THE MILIEU ADAPTER — F9 as amended at §853, and the only ambient row that emits.
 *
 * INTERVAL CADENCE WITH TIME-INTEGRATED MAGNITUDE, and the integration is done HERE
 * rather than left to the funnel: the adapter emits only when a dwell has completed
 * at least one whole cadence, and declares the COMPLETED CADENCES as its span. A
 * partial cadence emits NOTHING — not a small pull, nothing — so this adapter can
 * never trigger the funnel's `sub_floor_pull` refusal. The refusal remains the
 * funnel's backstop for a future source that gets this wrong; a backstop that the
 * only live source constantly trips would be a backstop nobody could read.
 *
 * THE VECTOR IS THE HOST'S, NOT A CONSTANT (§800.4 (5)). The table declares
 * `dwell_milieu` ambient and holds NO pulls, because the pull is a read of the
 * settlement the soul is dwelling IN. The host's conduct plane is car L5's seam and
 * is not built here, so the vector arrives from the caller through
 * `ctx.milieuVectorOf(hostSettlementId)`; absent that, the adapter emits nothing and
 * says so, rather than inventing a direction for a city it has not read.
 *
 * ⚠ THE ONE-TICK LAG IS INHERITED, NOT INTRODUCED. Roads writes the mirror in its
 * PASS 6, last of the mission chain, so every consumer reads last tick's
 * whereabouts. The dwell arithmetic below is therefore one tick stale by
 * construction — which is correct for an integrated quantity and wrong for nothing.
 *
 * @param {SourceContext & {milieuVectorOf?: (hostId: string) => unknown}} ctx
 * @returns {Array<Record<string, unknown>>}
 */
function milieuEntries(ctx) {
  const vectorOf = typeof asObject(ctx).milieuVectorOf === 'function'
    ? /** @type {(hostId: string) => unknown} */ (asObject(ctx).milieuVectorOf)
    : null;
  if (!vectorOf) return [];
  const now = tickOf(ctx);
  const out = [];
  for (const home of orderedSettlements(ctx)) {
    for (const row of home.cast) {
      const npc = asObject(row);
      const where = asObject(npc.whereabouts);
      // ONE STATE ONLY, and the constant says why. `sinceTick` is the capture tick
      // here and the DEPARTURE tick everywhere else; reading it uniformly would
      // over-count every visitor's dwell by the whole outbound journey.
      if (str(where.state) !== MILIEU_DWELL_STATE) continue;
      const host = str(where.placeId);
      if (!host) continue;
      const dwelt = now - num(where.sinceTick);
      const cadences = Math.floor(dwelt / AMBIENT_CADENCE_TICKS);
      // A DWELL SHORTER THAN THE CADENCE EMITS NOTHING. Not a faint pull that would
      // be refused; nothing at all. This is where the source law is met.
      if (cadences < 1) continue;
      const pulls = vectorOf(host);
      if (!Array.isArray(pulls) || pulls.length === 0) continue;
      out.push(entry('dwell_milieu', { home, npc }, `dwell.${host}.${str(where.missionId)}.${now}`, {
        spanTicks: cadences * AMBIENT_CADENCE_TICKS,
        pulls: Object.freeze([...pulls]),
      }));
    }
  }
  return out;
}

/**
 * THE REGISTRY. One row per receipted kind, statically written — never minted by a
 * loop over the catalog, because a registry generated from the thing it is supposed
 * to reconcile against can only ever agree with itself.
 * @type {readonly SourceAdapter[]}
 */
export const LIVED_EXPERIENCE_SOURCES = Object.freeze([
  // ── PERSONAL ──────────────────────────────────────────────────────────────
  // ⛔ BLOCKED BY §856. The kernel's `betrayal` signal matches `npc.ousted === true`,
  // which is the very flag this exposure sets (`npcAgency.js:230/836`). Same signal,
  // two funnels. The strongest source in the table, and the pin costs it.
  adapter('corruption_exposed', 'record', 'pulseRecord.corruptionEvents (kind: ousted|demoted)',
    'displayName', ['ousted', 'demoted'],
    (ctx) => {
      const now = tickOf(ctx);
      const out = [];
      for (const row of recordRows(ctx, 'corruptionEvents')) {
        const kind = str(row.kind);
        if (kind !== 'ousted' && kind !== 'demoted') continue;
        // ⚠ A NAME IS THE ONLY HANDLE THIS PROJECTION LEAVES: pulseKernel narrows the
        // live exposure to five fields and DROPS `npcId`. Ambiguity refuses.
        const subject = subjectByDisplayName(ctx, str(row.settlementId), str(row.name));
        if (!subject) continue;
        out.push(entry('corruption_exposed', subject,
          `corruption.${str(row.settlementId)}.${stablePart(row.name)}.${kind}.${now}`));
      }
      return out;
    },
    { blocked: 'npcGrowthKernel betrayal <- npc.ousted (§856 non-overlap; TE-GROWTH-MIG is the cure)' }),

  adapter('goal_culminated', 'news', "impactKind 'npc_goal_culmination' (selectedOutcomes keeps npcId)",
    'npcKey', ['npc_goal_culmination'],
    (ctx) => {
      const out = [];
      for (const row of newsRows(ctx, (r) => str(r.impactKind) === 'npc_goal_culmination')) {
        // This is the best-addressed source in the set: `compactOutcomeForHistory`
        // KEEPS `npcId`, so the person survives into the persisted record.
        const named = str(row.npcId);
        const subjects = named ? [subjectByNpcKey(ctx, named)] : subjectsOfRow(ctx, row);
        for (const subject of subjects) if (subject) out.push(entry('goal_culminated', subject, str(row.id)));
      }
      return out;
    }),

  adapter('promotion_won', 'news', "impactKind 'npc_ladder' + tag 'rise' (challenger)",
    'npcKey', ['npc_ladder', 'rise'],
    (ctx) => ladderEntries(ctx, 'rise', 0, 'promotion_won')),

  adapter('rung_lost', 'news', "impactKind 'npc_ladder' + tag 'failed' (challenger)",
    'npcKey', ['npc_ladder', 'failed'],
    (ctx) => ladderEntries(ctx, 'failed', 0, 'rung_lost')),

  adapter('caught_lying_exposed', 'news', "kind 'infowar_lie_exposed' (npcIds only when npcCredibility is lit)",
    'npcKey', ['infowar_lie_exposed'],
    (ctx) => {
      const out = [];
      // ⚠ This one matches on `kind`, not `impactKind` — informationStatecraft mints
      // NO impactKind at all (heraldRouting routes it on `kind` for that reason).
      // An adapter that reached for `impactKind` here would match nothing, forever,
      // and look exactly like a dark flag.
      for (const row of newsRows(ctx, (r) => str(r.kind) === 'infowar_lie_exposed')) {
        for (const subject of subjectsOfRow(ctx, row)) out.push(entry('caught_lying_exposed', subject, str(row.id)));
      }
      return out;
    },
    { flagKey: 'npcCredibilityEnabled' }),

  adapter('turned_by_crime', 'news', "impactKind 'npc_verdict' + verdict 'criminal_founding'",
    'npcKey', ['npc_verdict', 'criminal_founding'],
    (ctx) => {
      const out = [];
      for (const row of newsRows(ctx, (r) => str(r.impactKind) === 'npc_verdict'
        && str(r.verdict) === 'criminal_founding')) {
        for (const subject of subjectsOfRow(ctx, row)) out.push(entry('turned_by_crime', subject, str(row.id)));
      }
      return out;
    },
    { flagKey: 'npcConsequencesEnabled' }),

  adapter('pardoned_released', 'ledger', 'spatialLedgers.npcRulings.entries (candidateType npc_pardon)',
    'durableId', ['npc_pardon'],
    (ctx) => {
      const out = [];
      const entries = asArray(asObject(asObject(asObject(asObject(ctx).worldState).spatialLedgers).npcRulings).entries);
      for (const raw of entries) {
        const row = asObject(raw);
        if (str(row.candidateType) !== 'npc_pardon') continue;
        if (num(row.tick) !== tickOf(ctx)) continue;
        // THE ONLY SOURCE THAT SPEAKS THE DURABLE LANGUAGE: a pardon record carries
        // `wnpcId` and no roster id, so the ledger's originRef runs in reverse.
        const subject = subjectByDurableId(ctx, str(row.wnpcId));
        if (subject) out.push(entry('pardoned_released', subject, str(row.id)));
      }
      return out;
    },
    { flagKey: 'npcConsequencesEnabled' }),

  adapter('captured_held', 'ledger', 'spatialLedgers.roads.ransoms (startedTick === tick)',
    'npcKey', ['roads.ransoms'],
    (ctx) => {
      const now = tickOf(ctx);
      const out = [];
      const ransoms = asObject(asObject(asObject(asObject(ctx).worldState).spatialLedgers).roads).ransoms;
      for (const key of Object.keys(asObject(ransoms)).sort(compareCodepoint)) {
        const rec = asObject(asObject(ransoms)[key]);
        // THE TICK IT STARTED, not every tick it persists: a ransom record lives for
        // its whole term, and teaching from its presence would teach the capture
        // once a week for thirty-nine weeks.
        if (num(rec.startedTick) !== now) continue;
        const subject = subjectByNpcKey(ctx, str(rec.npcKey));
        if (subject) out.push(entry('captured_held', subject, str(rec.id)));
      }
      return out;
    },
    { flagKey: 'roadsEnabled' }),

  adapter('ransomed_home', 'ledger', 'spatialLedgers.roads.missions (releasedFromRansom, phase returning)',
    'npcKey', ['roads.missions.releasedFromRansom'],
    (ctx) => {
      const out = [];
      const missions = asObject(asObject(asObject(asObject(ctx).worldState).spatialLedgers).roads).missions;
      for (const key of Object.keys(asObject(missions)).sort(compareCodepoint)) {
        const rec = asObject(asObject(missions)[key]);
        // `releasedFromRansom` is the marker roads itself uses to keep a freed
        // captive's homecoming SILENT in the news — so the ledger is the only place
        // this outcome is legible at all.
        if (rec.releasedFromRansom !== true) continue;
        if (num(rec.departTick) !== tickOf(ctx)) continue;
        const subject = subjectByNpcKey(ctx, str(rec.npcKey));
        if (subject) out.push(entry('ransomed_home', subject, `ransomed.${str(rec.id)}`));
      }
      return out;
    },
    { flagKey: 'roadsEnabled' }),

  // ── AFFILIATION ───────────────────────────────────────────────────────────
  adapter('faction_captured', 'record', 'pulseRecord.factionCaptureEvents (to === capture)',
    'home', ['faction_capture:to=capture'],
    (ctx) => factionEntries(ctx, 'faction_captured')),

  adapter('faction_cleansed', 'record', 'pulseRecord.factionCaptureEvents (from === capture)',
    'home', ['faction_capture:from=capture'],
    (ctx) => factionEntries(ctx, 'faction_cleansed')),

  adapter('home_occupied', 'news', "impactKind 'conquest' (targetSaveId is the CONQUERED town)",
    'home', ['conquest'],
    (ctx) => homeEntries(ctx, (r) => str(r.impactKind) === 'conquest', 'home_occupied'),
    { flagKey: 'warLayerEnabled' }),

  // ⛔ BLOCKED BY §856. The kernel's `siege_survived` signal matches the
  // `occupation_lifted` condition archetype — the same event, reaching the same
  // souls through a second vocabulary.
  adapter('home_liberated', 'news', "impactKind 'occupation_lifted' (targetSaveId is the freed home)",
    'home', ['occupation_lifted'],
    (ctx) => homeEntries(ctx, (r) => str(r.impactKind) === 'occupation_lifted', 'home_liberated'),
    {
      flagKey: 'warLayerEnabled',
      blocked: 'npcGrowthKernel siege_survived <- occupation_lifted (§856 non-overlap; TE-GROWTH-MIG is the cure)',
    }),

  adapter('coup_at_home', 'news', "impactKind 'coup_succeeded' | 'coup_suppressed'",
    'home', ['coup_succeeded', 'coup_suppressed'],
    (ctx) => homeEntries(ctx, (r) => str(r.impactKind) === 'coup_succeeded'
      || str(r.impactKind) === 'coup_suppressed', 'coup_at_home')),

  adapter('god_fortunes_rose', 'news', "impactKind 'pantheon_ascendancy' (settlementIds is EMPTY — patron join)",
    'patronDeity', ['pantheon_ascendancy'],
    (ctx) => pantheonEntries(ctx, 'pantheon_ascendancy', 'god_fortunes_rose')),

  adapter('god_fortunes_fell', 'news', "impactKind 'pantheon_twilight' (settlementIds is EMPTY — patron join)",
    'patronDeity', ['pantheon_twilight'],
    (ctx) => pantheonEntries(ctx, 'pantheon_twilight', 'god_fortunes_fell')),

  // ── WITNESS ───────────────────────────────────────────────────────────────
  adapter('dwell_milieu', 'ledger', 'roster npc.whereabouts (state hostage; placeId is the host)',
    'npcKey', ['whereabouts.hostage'],
    milieuEntries,
    { flagKey: 'roadsEnabled' }),

  adapter('festival_kept', 'news', "impactKind 'tradition' x roads observance journey",
    'npcKey', ['tradition', 'observance'],
    (ctx) => {
      const out = [];
      const missions = asObject(asObject(asObject(asObject(ctx).worldState).spatialLedgers).roads).missions;
      for (const row of newsRows(ctx, (r) => str(r.impactKind) === 'tradition')) {
        const hosts = new Set(asArray(row.settlementIds).map(str));
        // THE PER-SOUL JOIN THE HEADER DEMANDS. The tradition beat is AGGREGATE by
        // its own words ("the town's festival, never a named soul's fate"), so the
        // legitimate hook is the roads `observance` journey that sent a NAMED person
        // to that settlement — the crossing, never the beat alone.
        for (const key of Object.keys(asObject(missions)).sort(compareCodepoint)) {
          const mission = asObject(asObject(missions)[key]);
          if (str(asObject(mission.purpose).kind) !== 'observance') continue;
          if (!hosts.has(str(mission.destId))) continue;
          const subject = subjectByNpcKey(ctx, str(mission.npcKey));
          if (subject) out.push(entry('festival_kept', subject, `${str(row.id)}.${str(mission.id)}`));
        }
      }
      return out;
    },
    { flagKey: 'traditionsEnabled' }),
]);

/**
 * The faction-capture rungs, read from the RECORD projection rather than the news
 * entry — and the difference is the whole adapter. The news entry's tags carry
 * `t.to` and NOT `t.from`, so a CLEANSING (from === capture) is indistinguishable
 * there from an ordinary de-escalation into the same rung. `pulseRecord.
 * factionCaptureEvents` keeps both ends, so it is the only surface on which these
 * two kinds are different events.
 * @param {SourceContext} ctx @param {string} kind @returns {Array<Record<string, unknown>>}
 */
function factionEntries(ctx, kind) {
  const now = tickOf(ctx);
  const out = [];
  for (const raw of recordRows(ctx, 'captureTransitions')) {
    const transition = asObject(raw);
    const from = str(transition.from);
    const to = str(transition.to);
    const matched = kind === 'faction_captured' ? to === 'capture' : from === 'capture';
    if (!matched) continue;
    const settlementId = str(transition.settlementId);
    for (const subject of subjectsByHome(ctx, settlementId)) {
      out.push(entry(kind, subject,
        `faction_capture.${settlementId}.${stablePart(transition.name)}.${from}.${to}.${now}`));
    }
  }
  return out;
}

/**
 * The pantheon join. §14's small rule for the affiliation plane's "your god" —
 * laity take the settlement patron — is the only reachable address, because the
 * pantheon beat carries `settlementIds: []` and names no soul at all.
 *
 * ⚠ THE DEVOTION SCALING IS ABSENT, NOT GUESSED. §14 says "the settlement patron
 * SCALED BY DEVOTION", and no per-NPC devotion or faith field exists anywhere in
 * this tree (the SimNpc schema carries none; the only NPC↔deity link is a DERIVED
 * coherence score). Inventing one would answer an owner question in code, so every
 * adherent takes the table's vector unscaled and the omission is an owner row.
 * @param {SourceContext} ctx @param {string} impactKind @param {string} kind
 * @returns {Array<Record<string, unknown>>}
 */
function pantheonEntries(ctx, impactKind, kind) {
  const out = [];
  for (const row of newsRows(ctx, (r) => str(r.impactKind) === impactKind)) {
    // The deity id rides the tags, which is where realmEvents puts it — the entry
    // has no deity field of its own.
    const deityId = asArray(row.tags).map(str).slice(3)[0] || '';
    for (const subject of subjectsByPatronDeity(ctx, deityId)) {
      out.push(entry(kind, subject, str(row.id)));
    }
  }
  return out;
}

/** kind -> its adapter, DERIVED so a lookup and the registry can never disagree. */
export const SOURCE_ADAPTER_OF = Object.freeze(Object.fromEntries(
  LIVED_EXPERIENCE_SOURCES.map((row) => [row.kind, row]),
));

/** The kinds a source adapter exists for. @type {readonly string[]} */
export const ADAPTED_EXPERIENCE_KINDS = Object.freeze(
  LIVED_EXPERIENCE_SOURCES.map((row) => row.kind).sort(compareCodepoint),
);

/** The kinds registered but SILENCED by the §856 non-overlap law. @type {readonly string[]} */
export const NON_OVERLAP_BLOCKED_KINDS = Object.freeze(
  LIVED_EXPERIENCE_SOURCES.filter((row) => row.blocked !== null)
    .map((row) => row.kind).sort(compareCodepoint),
);

/**
 * ⭐⭐ THE KINDS WHOSE ADAPTER IS REAL BUT LIVES IN ANOTHER LEAF — added at the
 * substrate coupling, and it is a WIDENING OF WHAT THE GUARD CAN SAY rather than a
 * hole punched in it.
 *
 * The totality guard below reds when a receipted kind lands with nobody to read it,
 * and that claim is exactly right. What it could not previously EXPRESS is the case
 * the coupling produced: `faith_milieu`'s adapter is real, is 268 lines of tested
 * pure code, and is homed in `worldPulse/faithWitnessSource.js` because it needs
 * `faithField.memberWeight` and `piety.pietyMultOf` — neither of which belongs in an
 * npc leaf. Before this map the only two things sayable about that kind were both
 * FALSE: mark it `sourceUnverified` (it has a receipt) or claim an adapter here
 * (there isn't one).
 *
 * ⛔ THIS IS A CITATION, NOT A DEPENDENCY, AND DELIBERATELY SO. The value is a path
 * plus an exported symbol, held as data — this file imports nothing new, so the
 * family's closure and the coupling's cross-layer pair count are both untouched. The
 * binding census in `tests/domain/npc/livedExperienceSources.test.js` RESOLVES each
 * entry against the live tree (module must exist; the symbol must be declared there),
 * so a rename, a typo, or a deleted export reds here rather than rotting quietly.
 * That is strictly more than the guard could check before.
 *
 * ⚠ AN ENTRY HERE IS A DEBT, NOT AN EXEMPTION. It records that some OTHER car owes
 * the registration: `faith_milieu`'s is W-FAITH car 6 (the faith-pull source adapter
 * + the clergy consumers' re-route, §806/F14). When that car lands, the kind moves
 * into `LIVED_EXPERIENCE_SOURCES` and its row leaves this map.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const ADAPTER_HOMED_ELSEWHERE = Object.freeze({
  faith_milieu: 'src/domain/worldPulse/faithWitnessSource.js#faithWitnessEntries',
  // ENC-3. The chance-meeting adapter is homed in the STAGE and not here, for the same
  // reason the faith one is homed in its witness leaf: the vector is a function of the
  // RECEIPT — which two charts met, and on which axes they differ — so only the module
  // that resolved the meeting can build it. Homing it here would mean re-deriving the
  // meeting inside the sources leaf, which is a second resolution of the same event.
  // ⛔ The row, this entry and the stage's exported symbol are ONE COMMIT: the load-time
  // reconciliation below throws at MODULE EVALUATION for a receipted kind with no
  // adapter, and seven importers go down with it.
  met_a_foreigner: 'src/domain/worldPulse/envoyChanceMeetingStage.js#chanceMeetingLessonEntries',
});

/**
 * THE EIGHT SIGNALS THE OTHER FUNNEL EATS, and the tokens each one actually matches
 * on upstream — walked against this tree, not transcribed from the map. The map's
 * `signal` names are the kernel's INTERNAL vocabulary; these are the strings a
 * producer has to emit for that signal to fire, which is the only grain at which
 * "does anything feed both" is a real question.
 *
 * ⚠ TWO OF THE EIGHT ARE STRUCTURALLY DEAD, measured: nothing in this tree ever
 * writes `archetype: 'bust'` (the one bust minter writes `custom_crisis`) and
 * nothing ever writes `relationshipType: 'war'` (the estate's war vocabulary is
 * `hostile`/`cold_war`). A non-overlap claim that assumed all eight were live would
 * overstate the kernel's footprint in both directions.
 * @type {Readonly<Record<string, readonly string[]>>}
 */
export const GROWTH_SIGNAL_TOKENS = Object.freeze({
  calamity: Object.freeze(['calamityHistory']),
  bust: Object.freeze(['archetype:bust']),
  besieged: Object.freeze(['relationshipType:war']),
  siege_survived: Object.freeze(['siege_lifted', 'occupation_lifted']),
  reconstruction: Object.freeze(['reconstruction']),
  betrayal: Object.freeze(['corruptTies.revealed', 'ousted']),
  boom: Object.freeze(['boom']),
  flourishing: Object.freeze(['flourishing']),
});

/**
 * THE §856 NON-OVERLAP CENSUS, computed rather than declared. Returns every
 * (adapter kind, growth signal) pair that reads the same token — so the pin asserts
 * a MEASUREMENT, and a future adapter that reaches for a kernel signal shows up
 * here without anybody remembering to look.
 * @returns {ReadonlyArray<Readonly<{kind: string, signal: string, token: string}>>}
 */
export function nonOverlapCollisions() {
  /** @type {Array<{kind: string, signal: string, token: string}>} */
  const out = [];
  for (const row of LIVED_EXPERIENCE_SOURCES) {
    for (const signal of Object.keys(GROWTH_SIGNAL_TOKENS).sort(compareCodepoint)) {
      for (const token of GROWTH_SIGNAL_TOKENS[signal]) {
        // Substring both ways: an adapter signal `faction_capture:to=capture` and a
        // kernel token `capture` must collide, and so must the reverse.
        const hit = row.signals.some((s) => s === token || s.includes(`.${token}`) || s.endsWith(token));
        if (hit) out.push(Object.freeze({ kind: row.kind, signal, token }));
      }
    }
  }
  return Object.freeze(out.sort((a, b) => compareCodepoint(a.kind, b.kind) || compareCodepoint(a.signal, b.signal)));
}

/**
 * COLLECT one tick's lesson entries, every adapter in codepoint order. A BLOCKED
 * adapter contributes nothing and is not called at all — the block is structural,
 * not a filter over its output, so a blocked source cannot leak through a bug in
 * the filter.
 * @param {SourceContext} ctx
 * @returns {ReadonlyArray<Record<string, unknown>>}
 */
export function collectLivedExperience(ctx) {
  /** @type {Array<Record<string, unknown>>} */
  const out = [];
  // The registry is walked in DECLARATION order and the OUTPUT is sorted below.
  // A mutation pass proved a second sort here unobservable — the adapters are pure
  // reads with no side effects, so only the output order can be seen, and one
  // guarantee that is pinned beats two of which only one is.
  for (const row of LIVED_EXPERIENCE_SOURCES) {
    if (row.blocked !== null) continue;
    for (const item of row.read(ctx)) out.push(item);
  }
  return Object.freeze(out.sort((a, b) => compareCodepoint(str(a.kind), str(b.kind))
    || compareCodepoint(str(a.settlementId), str(b.settlementId))
    || compareCodepoint(str(a.eventId), str(b.eventId))
    || compareCodepoint(str(asObject(a.npc).id), str(asObject(b.npc).id))));
}

/**
 * Provenance, in the module, the L1 catalog's idiom.
 * @type {Readonly<{status: string, signedBy: string|null, censusCorrections: readonly string[],
 *   ownerRows: readonly string[], consumers: string}>}
 */
export const SOURCE_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (the registry is measurement; the blocks are a chair row)',
  signedBy: null,
  // Walked against THIS tree, and each one moves a verdict L3's census recorded.
  // Carried in code because a receipt rots and the next car will read this file.
  censusCorrections: Object.freeze([
    'festival_kept is NOT receipt-dark: traditionsEnabled sits in the ONE_REGEN fragment (simulationRules.js:666) and is lit in dramatic_campaign, living_realm, full_simulation AND, since the lighting wave lit the default preset (L-DEFAULT hunk 1, 2026-09-06), realistic_regional — the same FOUR presets as roads and the ladder, which share that one fragment and therefore move together. This row read THREE until that hunk. Its address read :499, which was ALREADY stale before the hunk and is corrected here by measurement',
    'coup_at_home is DEFAULT-ON: stressorsEnabled is true in DEFAULT_SIMULATION_RULES, making it the FIFTH default-on kind, which L3 counted as four',
    'home_occupied and home_liberated are lit in TWO presets, not three: warLayerEnabled is false in the defaults and true only in dramatic_campaign and full_simulation — living_realm inherits it false deliberately',
    'faction_cleansed is NOT readable from the news entry: its tags carry `to` and never `from`, so a cleansing is indistinguishable there from a de-escalation. The record projection pulseRecord.factionCaptureEvents keeps both ends and is the only honest surface',
    'corruption_exposed has NO per-person address on the persisted record: pulseKernel narrows the live exposure to five fields and drops npcId, leaving a display NAME as the only handle',
    'god_fortunes_rose/fell carry settlementIds: [] and name no soul — the subject is reachable only through the settlement patron-deity join §14 already rules',
    'abandoned_unransomed RE-CONFIRMED unreachable: ABANDONMENT_GRIEVANCE_KIND and abandonmentGrievance have zero consumers in src/, exactly as L3 measured',
  ]),
  ownerRows: Object.freeze([
    '⚠⚠ THE NON-OVERLAP GRAIN (§856): the ruling says "no SIGNAL may feed both funnels" and this car honoured it literally, blocking corruption_exposed and home_liberated. At the finer (signal x soul) grain both dissolve — npcGrowthKernel deposits on a settlement\'s OFFICE HOLDERS by domain, while these adapters teach the PERSON the thing happened to. Ruling the finer grain unblocks the strongest source in the table and costs one field per row',
    'the milieu vector: the host settlement\'s conduct plane is car L5\'s seam, so ctx.milieuVectorOf supplies it and this car computes nothing about a city',
    'god_fortunes_*: §14 says "the settlement patron SCALED BY DEVOTION" and no per-NPC devotion field exists anywhere in the tree — the scaling is ABSENT rather than invented',
    'whether an affiliation-plane realm event should teach EVERY roster member of a settlement or only its seated/important ones (this car teaches everybody, which is the register\'s plain reading)',
  ]),
  consumers: 'NONE in production by design; the pulse call site is car L5\'s',
});

// ── LOAD-TIME RECONCILIATION — the source law, refused rather than remembered ──

// A row for a kind the census marked unverified is a PHANTOM SOURCE, which is the
// one thing §3 forbids by name. Throwing at module evaluation means such a row can
// never reach a test run, let alone a tick.
for (const row of LIVED_EXPERIENCE_SOURCES) {
  const spec = experienceRowOf(row.kind);
  if (spec.sourceUnverified) {
    throw new Error(`livedExperienceSources: ${row.kind} has NO receipt in this tree — a source may not be wired for it (§3)`);
  }
  if (!SOURCE_SURFACES.includes(row.surface) || !SUBJECT_RESOLUTIONS.includes(row.resolution)) {
    throw new Error(`livedExperienceSources: ${row.kind} declares an unknown surface or resolution`);
  }
}

// And the reverse direction, which is the one that reds when a receipted kind lands
// with nobody to read it: every receipted kind except the silent one must have a row
// HERE, or a named out-of-leaf home in ADAPTER_HOMED_ELSEWHERE. The second arm was
// added at the substrate coupling; it does not weaken the claim, because "nobody
// reads it" and "somebody named, resolvable, and provably present reads it" are
// different facts and the guard previously could only say the first.
for (const kind of RECEIPTED_EXPERIENCE_KINDS) {
  if (kind === SILENT_EXPERIENCE_KIND) continue;
  if (Object.prototype.hasOwnProperty.call(SOURCE_ADAPTER_OF, kind)) continue;
  if (Object.prototype.hasOwnProperty.call(ADAPTER_HOMED_ELSEWHERE, kind)) continue;
  throw new Error(`livedExperienceSources: ${kind} carries a receipt (${str(EXPERIENCE_TABLE[kind].receipt)}) but no adapter reads it`);
}

// ...and the map may not drift into a second registry: an entry that ALSO has a row
// here is a fork, and an entry for a kind the catalog does not carry is a ghost.
for (const kind of Object.keys(ADAPTER_HOMED_ELSEWHERE)) {
  if (Object.prototype.hasOwnProperty.call(SOURCE_ADAPTER_OF, kind)) {
    throw new Error(`livedExperienceSources: ${kind} is registered here AND declared homed elsewhere — one kind, one adapter`);
  }
  if (!Object.prototype.hasOwnProperty.call(EXPERIENCE_TABLE, kind)) {
    throw new Error(`livedExperienceSources: ${kind} is declared homed elsewhere but the catalog carries no such kind`);
  }
}

// The cadence this file integrates against must be the funnel's own, not a second
// spelling of one season. A rename there reds here rather than silently halving
// every dwell.
if (AMBIENT_CADENCE_TICKS !== INTERVAL_WEEKS.one_season) {
  throw new Error('livedExperienceSources: the ambient cadence is not the estate\'s one season');
}

// The kernel's map must still hold the eight signals this census walks. A ninth
// signal landing with no token row here is a silent hole in the non-overlap proof.
if (GROWTH_DEPOSIT_MAP.length !== Object.keys(GROWTH_SIGNAL_TOKENS).length) {
  throw new Error('livedExperienceSources: npcGrowthKernel\'s signal count moved — the non-overlap census needs its token row');
}
