/**
 * whole-world-soak-deity-fixture.mjs — WF-0's ONE authored deity-bearing soak case,
 * "wf0-deity-bearing" (docs/DESIGN_FP_ARCH_WF.md "### WF-0 — THE OBSERVATION FLOOR";
 * docs/DESIGN_FP_ARCHITECTURE.md §5 block #32 — the case's id is program-owned).
 * Sits BESIDE whole-world-soak.mjs's own grid, mirroring the sibling-fixture pattern
 * whole-world-soak-spatial-fixture.mjs already established for the spatial canon, so
 * the main script's own edit is a wire-in rather than a growth (JUDGMENT — a new leaf
 * beside the soak, not inside it; the design's "New leaves: none" names the DOMAIN
 * side, where WF-0 mints no production module — this is fixture/script-side).
 *
 * The case seats TWO authored, OPPOSED-QUADRANT deities onto the soak's historical
 * four-settlement grid through the product's own affordances (SET_PRIMARY_DEITY /
 * IMPOSE_CULT) — never by poking config — so three of the four settlements bear a
 * deity and the fourth (soak-d) stays deity-free, the dormancy control every WF
 * fixture carries beside its positive arm:
 *
 *   soak-a — SET_PRIMARY_DEITY(The Dawn Warden)                      [patron host]
 *   soak-b — SET_PRIMARY_DEITY(The Ash Tyrant) + IMPOSE_CULT(The Dawn Warden)  [rival host]
 *   soak-c — IMPOSE_CULT(The Ash Tyrant)
 *   soak-d — deity-free
 *
 * soak-a and soak-b are the TWO PATRON HOSTS sacredClaim.js's `natural_enemy` quadrant
 * needs (a rival PATRON, not merely a cult — a cult embed carries no `primaryDeitySnapshot`
 * for `patronRefOf` to read); soak-b's cult additionally makes it the one settlement
 * bearing BOTH kinds (the mutant's half-predicate control: a bearer count collapsed to
 * either half alone must still read two, never three, on this fixture).
 *
 * soak-a is the PATRON HOST for WF-2's precondition: its seeded genesis founding set
 * (deriveFoundingTraditions, off the soak's own archetype + seed, AS SEATED — genesis
 * is deterministic from the settlement's current identity including its embedded
 * patron, so the same call the pulse makes at first-lit-mint is the call this fixture
 * previews) already carries a grand observance (scaleBand >= 3, act in {procession,
 * offering, fair} — pilgrimage.js's own drawsPilgrims bar, DESIGN_FP_ARCH_WF.md V24)
 * with soak-b/soak-c mapped and reachable through the soak's spatial canon. MEASURED,
 * not authored: soak-a (city/germanic/river/crossroads) draws five qualifying records
 * under this exact case; the case selects among the historical grid's fixed archetypes
 * rather than forcing a motif.
 *
 * "Deities round-trip the custom-content path" (WF-0 arm c): both are minted through
 * buildRegistry/mintDeityRef exactly as a DM's authored deity is, and each seat's
 * event.payload.snapshot is deitySnapshotFrom(raw) — the same resolution the store
 * performs before an event ever reaches the pure domain handler — so the embed the
 * handler commits (commitDeityEmbed, inside setPrimaryDeity/imposeCult) is
 * byte-identical to a DM's own SET_PRIMARY_DEITY/IMPOSE_CULT.
 *
 * J1 (RULINGS-OVER-THE-DRAFTS.md R-1): the SAME seat plan drains as tick-resolved
 * decrees on canon (campaignState.eventLog entries stamped viaTick: 0 — the
 * head-of-tick drain) and replays as plain corrections through the domain applyEvent
 * on a draft (no tick, no viaTick key at all); both arms are pinned to agree
 * byte-for-byte on the resulting embed.
 */
import { buildRegistry, mintDeityRef } from '../../src/lib/customRegistry.js';
import { deitySnapshotFrom } from '../../src/domain/deitySnapshot.js';
import { applyEvent } from '../../src/domain/events/applyEvent.js';
import { deriveFoundingTraditions } from '../../src/domain/traditions/genesis.js';
import { drawsPilgrims } from '../../src/domain/traditions/pilgrimage.js';

/** The case's program-owned id (DESIGN_FP_ARCH_WF.md WF-0: "spelling of the case id
 *  is program-owned"). Never derived from wizard_news.* ids, per the same law the
 *  bearer count itself keeps (behavioral-observation.mjs's isDeityBearer). */
export const WF0_DEITY_BEARING_CASE_ID = 'wf0-deity-bearing';

// The two authored deities. OPPOSED quadrant: good+lawful vs evil+chaotic reads
// deityAxes.js evil01/chaos01 as 0/0 versus 1/1 — sacredClaim.js's 'natural_enemy'
// quadrant (rival patron, opposed alignment), the highest CLAIM_BY_QUADRANT tension.
const DAWN_WARDEN = Object.freeze({
  id: 'wf0-dawn-warden',
  localUid: 'wf0-dawn-warden',
  name: 'The Dawn Warden',
  alignmentAxis: 'good',
  lawAxis: 'lawful',
  rankAxis: 'major',
  domain: 'light',
});
const ASH_TYRANT = Object.freeze({
  id: 'wf0-ash-tyrant',
  localUid: 'wf0-ash-tyrant',
  name: 'The Ash Tyrant',
  alignmentAxis: 'evil',
  lawAxis: 'chaotic',
  rankAxis: 'major',
  domain: 'ruin',
});

/**
 * THE SEAT PLAN: who bears which deity, through which affordance, in head-of-tick
 * drain order (and the draft-correction replay order — J1 pins both to agree).
 * `raw` is the exact authored record object (by reference, so the registry's own
 * enumeration of `customContent.deities` resolves back to it — never a re-authored
 * copy that would only coincidentally match).
 */
const SEAT_PLAN = Object.freeze([
  Object.freeze({ saveId: 'soak-a', type: 'SET_PRIMARY_DEITY', raw: DAWN_WARDEN }),
  Object.freeze({ saveId: 'soak-b', type: 'SET_PRIMARY_DEITY', raw: ASH_TYRANT }),
  Object.freeze({ saveId: 'soak-b', type: 'IMPOSE_CULT', raw: DAWN_WARDEN }),
  Object.freeze({ saveId: 'soak-c', type: 'IMPOSE_CULT', raw: ASH_TYRANT }),
]);

export const WF0_DEITY_BEARING_CASE = Object.freeze({
  id: WF0_DEITY_BEARING_CASE_ID,
  customContent: Object.freeze({ deities: Object.freeze([DAWN_WARDEN, ASH_TYRANT]) }),
  patronHostId: 'soak-a',
  rivalHostId: 'soak-b',
});

/**
 * Build the SEAT PLAN's typed events — product-shaped SET_PRIMARY_DEITY / IMPOSE_CULT
 * events, mirroring the store's own resolve-then-dispatch (`payload.snapshot` is
 * `deitySnapshotFrom(raw)`, never the raw authored record or an already-committed
 * embed; the handler itself calls `commitDeityEmbed`) — and the WF-2 precondition
 * read on the plan's declared patron host. Pure: no tick, no clock beyond the
 * caller's own pinned `now`.
 * @param {Array<{ id: unknown, settlement: unknown }>} saves the generated (unseated) realm
 * @param {typeof WF0_DEITY_BEARING_CASE} deityCase
 * @param {{ now: string }} options
 */
export function planDeityBearingSeats(saves, deityCase, { now } = {}) {
  if (!now) throw new Error('planDeityBearingSeats: a pinned `now` is required (no wall-clock read)');
  const registry = buildRegistry(deityCase.customContent);
  const authored = registry.listCustom('deities');
  const seats = SEAT_PLAN.map((slot) => {
    const entry = authored.find((candidate) => candidate.raw === slot.raw);
    if (!entry) throw new Error(`planDeityBearingSeats: ${slot.saveId} names a deity the case's own customContent does not author`);
    const deityRef = mintDeityRef(entry.raw);
    return {
      saveId: slot.saveId,
      type: slot.type,
      deityRef,
      event: {
        id: `wf0-seat-${slot.saveId}-${slot.type}-${deityRef}`,
        type: slot.type,
        targetId: '',
        payload: { deityRef, snapshot: deitySnapshotFrom(entry.raw) },
        cause: 'player_action',
      },
    };
  });

  const byId = new Map((Array.isArray(saves) ? saves : []).map((save) => [String(save?.id), save]));
  const host = byId.get(deityCase.patronHostId);
  const qualifying = host ? deriveFoundingTraditions(host.settlement).filter(drawsPilgrims) : [];

  return {
    seats,
    patronHostId: deityCase.patronHostId,
    rivalHostId: deityCase.rivalHostId,
    preconditionsMet: qualifying.length > 0,
  };
}

/**
 * Seat the case onto a GENERATED (unseated) realm through the product's own
 * affordances: each seat's event is committed via the domain `applyEvent` (the exact
 * mechanism a draft correction routes through — J1), threaded as a head-of-tick
 * DECREE for canon: `campaignState.eventLog` gains one entry per seat, stamped
 * `viaTick: 0`. A vetoed seat is a fixture-authoring error (the case is authored, not
 * drawn) and throws rather than silently producing an under-seated realm. Pure.
 * @param {Array<{ id: unknown, settlement: unknown, campaignState?: { eventLog?: unknown[] } }>} saves
 * @param {typeof WF0_DEITY_BEARING_CASE} deityCase
 * @param {{ now: string }} options
 */
export function seatDeityBearingCase(saves, deityCase, { now } = {}) {
  if (!now) throw new Error('seatDeityBearingCase: a pinned `now` is required (no wall-clock read)');
  const plan = planDeityBearingSeats(saves, deityCase, { now });
  const bySave = new Map((Array.isArray(saves) ? saves : []).map((save) => [
    String(save?.id),
    {
      ...save,
      campaignState: {
        ...(save?.campaignState || {}),
        eventLog: [...(save?.campaignState?.eventLog || [])],
      },
    },
  ]));

  for (const seat of plan.seats) {
    const save = bySave.get(seat.saveId);
    if (!save) continue;
    const out = applyEvent({ settlement: save.settlement, systemState: null, event: seat.event, now });
    if (out.veto) {
      throw new Error(`seatDeityBearingCase: ${seat.saveId} ${seat.type} was vetoed — ${out.veto.detail || out.veto.severity || 'unknown reason'}`);
    }
    save.settlement = out.nextSettlement;
    save.campaignState.eventLog.push({ ...out.logEntry, viaTick: 0 });
  }

  return { saves: [...bySave.values()], plan };
}

/**
 * The soak's `--deity-case` flag resolution: empty is the historical deity-free
 * corpus (no change, no refusal), the case id is the case, anything else is REFUSED
 * BY NAME — never a silent fall-through to the corpus (the soak's own §0 harness-seam
 * law: an unknown id is refused, exactly like an unknown `--preset`).
 * @param {string} id
 * @returns {{ deityCase: typeof WF0_DEITY_BEARING_CASE | null, refusals: string[] }}
 */
export function resolveDeityCase(id) {
  const value = String(id || '');
  if (!value) return { deityCase: null, refusals: [] };
  if (value === WF0_DEITY_BEARING_CASE_ID) return { deityCase: WF0_DEITY_BEARING_CASE, refusals: [] };
  return {
    deityCase: null,
    refusals: [`REFUSED: --deity-case "${value}" is not a known case (known: ${WF0_DEITY_BEARING_CASE_ID})`],
  };
}
