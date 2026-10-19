function battleInputs(rec) {
  return {
    armyId: rec.armyId,
    size: rec.strength,
    readiness: rec.readiness,
    supplyQuality: rec.supplyQuality,
    funding: rec.funding,
    groundAdvantage01: clamp01(1 - rec.position01),
    fatigue01: rec.position01,
  };
}

/**
 * A field-battle wizard-news entry (house voice, AGGREGATE — no npc named as a
 * casualty). Deterministic id from the sorted pair + tick. When `blind` is set (the
 * courier umbilical fog crossed FOUGHT_BLIND_FOG for a combatant — spatial-engine-4), a
 * "fought half-blind" receipt is stamped: the mis-assessment is the DM-legible CAUSE
 * while the true strengths still resolved the outcome (the physics are real).
 * @param {{ winnerId: string, loserId: string, region: string }} battle
 * @param {Snapshot} snapshot @param {number} tick @param {string|null} now
 * @param {number} loserBefore @param {number} loserAfter
 * @param {{ blind?: boolean, loserFog?: number, loserBelievedFoe?: number }} [fog]
 * @returns {Record<string, unknown>}
 */
function fieldBattleNews(battle, snapshot, tick, now, loserBefore, loserAfter, fog = {}) {
  const winner = nameOf(snapshot, battle.winnerId);
  const loser = nameOf(snapshot, battle.loserId);
  const lost = Math.max(0, Math.round(loserBefore - loserAfter));
  const pair = [battle.winnerId, battle.loserId].sort();
  const reasons = [`A crossing-path collision in ${nameOf(snapshot, battle.region)}'s approaches.`];
  if (fog.blind) {
    reasons.push(`${loser} fought half-blind. Its couriers home were cut, so it mis-read the enemy's strength (believed ~${formatCount(Math.max(0, Math.round(Number(fog.loserBelievedFoe) || 0)))}).`);
  }
  return {
    id: `wizard_news.${tick}.field_battle.${pair[0]}.${pair[1]}`,
    tick,
    scope: 'regional',
    significance: 'notable',
    score: 62,
    headline: `${winner}'s army breaks ${loser}'s in the field`,
    summary: `The marching hosts of ${winner} and ${loser} met between settlements. ${winner} held the field; ${loser}'s column falls back mauled${lost > 0 ? ` (${formatCount(lost)} strength lost)` : ''} to regroup.`,
    kind: 'applied',
    impactKind: 'field_battle',
    channelType: null,
    severity: 0.55,
    settlementIds: [battle.winnerId, battle.loserId],
    impactIds: [],
    channelIds: [],
    sourceEventId: `field_battle.${pair[0]}.${pair[1]}.${tick}`,
    // Q-W4 — THE PLACE, PERSISTED AS AN ID. Until now the battle's site existed only
    // inside `reasons[0]`'s display name and was lost the moment the sentence was
    // written, so the engagement narrative had to say nothing about where a field
    // battle happened rather than parse its own prose back into a fact. Conditional:
    // absent when the transit layer resolved no region — never '' and never a null
    // sentinel — so a world that fights no field battle is byte-identical, and the
    // terrain class is deliberately NOT derived here (two terrain vocabularies exist;
    // the id is persisted and terrain resolves through its one reader).
    ...(String(battle.region || '').trim() ? { region: String(battle.region).trim() } : {}),
    tags: fog.blind ? ['world_pulse', 'war', 'field_battle', 'fought_blind'] : ['world_pulse', 'war', 'field_battle'],
    reasons,
    createdAt: now,
  };
}

/**
 * Advance the army-transit layer one tick: derive/advance transit records from the
 * live deployments, resolve crossing-path field battles (bounded), advance the courier
 * umbilical, persist the ledger, and write mauled strengths back onto the deployments.
 * DORMANT (no marker) ⇒ { worldState, changed:false, newsEntries:[] } — byte-identical.
 *
 * @param {Object} args
 * @param {Snapshot} args.snapshot
 * @param {Record<string, unknown> & { spatialCanonVersion?: unknown, deployments?: Record<string, DeploymentRecord>, spatialLedgers?: unknown }} args.worldState
 * @param {SpatialDigest|null|undefined} args.digest
 * @param {Graph|null|undefined} args.graph
 * @param {Rng|null|undefined} args.rng
 * @param {string|null} [args.season]
 * @param {number} args.tick
 * @param {string|null} [args.now]
 * @returns {{ worldState: Record<string, unknown>, changed: boolean, newsEntries: Array<Record<string, unknown>> }}
 */
