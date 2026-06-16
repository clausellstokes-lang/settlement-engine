/**
 * drainQueuedEvents — campaign-clock simultaneity (Phase C1).
 *
 * Player events authored on clock-bound member settlements do NOT resolve
 * immediately. They queue on the campaign (worldState.pendingEvents) and
 * resolve together at the next world-pulse tick, so every settlement's events
 * happen simultaneously — the model the DM asked for ("every event for every
 * settlement happens simultaneously").
 *
 * This is the pure transform the slice runs at the TOP of advanceCampaignWorld,
 * BEFORE the organic pulse. For each member with queued intentions it replays
 * them IN QUEUE ORDER against that settlement's local state, mirroring
 * settlementSlice.applyEvent's local-commit core:
 *     domainApplyEvent → reconcileSettlementChange → layerAuthoredDeltas.
 * (Kept in lockstep with applyEvent — if that core changes, change it here too.)
 *
 * Cross-settlement propagation is intentionally LEFT TO THE PULSE that runs
 * immediately after: the post-drain settlement states feed the pulse's regional
 * engine, so a queued event propagates AT THE TICK rather than at author time.
 * The only world-level side effect surfaced here is the crisis-twin directive
 * (the same `twinDirectiveForEvent` applyEvent's ripple uses); the slice injects
 * those into worldState.stressors before the pulse so roaming crises age this
 * tick.
 *
 * @param {object} args
 * @param {Array}  args.queue  worldState.pendingEvents: [{ queueId, saveId, event, queuedAt }]
 * @param {Array}  args.saves  campaign member saves: [{ id, settlement, campaignState }]
 * @param {string} args.now    one timestamp for the whole tick (simultaneity)
 * @param {number|null} [args.tick] worldState.tick, stamped on each drained entry
 * @returns {{ updates: Array<{ saveId:string, settlement:object, systemState:object, eventLog:Array, authoredEvent:object|null }>,
 *             twinDirectives: Array<{ action:string, stressor?:object, type?:string, originSettlementId:string }>,
 *             partyImpacts: Array<{ action:object, originSettlementId:string }>,
 *             drainedCount: number }}
 */
import { applyEvent as domainApplyEvent } from './applyEvent.js';
import { layerAuthoredDeltas } from './eventPipeline.js';
import { mapEventToPartyImpact } from './partyEventLinkage.js';
import { deriveSystemState } from '../state/deriveSystemState.js';
import { reconcileSettlementChange } from '../settlementReconciliation.js';
import { twinDirectiveForEvent } from '../crisisLifecycle.js';

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

export function drainQueuedEvents({ queue = [], saves = [], now = new Date().toISOString(), tick = null } = {}) {
  const updates = [];
  const twinDirectives = [];
  const partyImpacts = [];
  let drainedCount = 0;
  if (!Array.isArray(queue) || queue.length === 0) {
    return { updates, twinDirectives, partyImpacts, drainedCount };
  }

  // Group queued intentions by save, preserving the global queue order within
  // each settlement (so event 2 builds on event 1 for the same settlement).
  const bySave = new Map();
  for (const item of queue) {
    if (!item || !item.event || item.saveId == null) continue;
    const key = String(item.saveId);
    if (!bySave.has(key)) bySave.set(key, []);
    bySave.get(key).push(item.event);
  }

  const saveById = new Map((saves || []).map(s => [String(s.id), s]));

  for (const [saveId, events] of bySave) {
    const save = saveById.get(saveId);
    if (!save || !save.settlement) continue;

    let settlement = clone(save.settlement);
    let systemState = save.campaignState?.systemState ? clone(save.campaignState.systemState) : null;
    if (!systemState) {
      try { systemState = deriveSystemState(settlement); } catch { systemState = null; }
    }
    const baseLog = Array.isArray(save.campaignState?.eventLog) ? clone(save.campaignState.eventLog) : [];
    const newEntries = [];
    // The LAST successfully-drained event for this save. Only its authored
    // systemState deltas survive (each event re-derives from its settlement and
    // layers only its own deltas — same as consecutive immediate applyEvents).
    // The slice re-layers this single event onto the post-pulse derive so the
    // dossier's SystemState matches the eventLog entry recorded at this tick.
    let authoredEvent = null;

    for (const event of events) {
      let out;
      try {
        out = domainApplyEvent({ settlement, systemState, event });
      } catch {
        // A single malformed queued event must not abort the whole tick.
        continue;
      }
      const nextSettlement = reconcileSettlementChange(out.nextSettlement, settlement, {
        source: 'canon_event',
        changeType: event?.type,
        changeLabel: event?.targetId || event?.payload?.label || event?.id,
        now,
      });
      const nextSystemState = layerAuthoredDeltas(deriveSystemState(nextSettlement), event, settlement);
      newEntries.push({
        ...out.logEntry,
        afterState: nextSystemState,
        appliedAt: now,
        viaTick: tick, // marks this entry as tick-resolved (timeline + pulse-undo)
      });

      // Crisis twin: identical forward directive applyEvent's ripple uses. The
      // slice applies these to worldState.stressors before the pulse runs.
      const directive = twinDirectiveForEvent(event);
      if (directive) twinDirectives.push({ ...directive, originSettlementId: saveId });

      // Party-caused events bridge to the party-impact pipeline the same way
      // rippleEventThroughWorld does for immediate events — the slice replays
      // these through recordPartyImpact after the drain so faction/NPC world
      // state, condition resolution, and Wizard News fire at the tick too.
      if (event?.partyCaused) {
        const action = mapEventToPartyImpact(event, saveId);
        if (action) partyImpacts.push({ action, originSettlementId: saveId });
      }

      settlement = nextSettlement;
      systemState = nextSystemState;
      authoredEvent = event;
      drainedCount += 1;
    }

    if (newEntries.length === 0) continue;
    updates.push({
      saveId,
      settlement,
      systemState,
      eventLog: [...baseLog, ...newEntries],
      authoredEvent,
    });
  }

  return { updates, twinDirectives, partyImpacts, drainedCount };
}
