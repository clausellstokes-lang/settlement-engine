/**
 * Supabase Edge Function: generate-narrative
 *
 * AI NARRATIVE LAYER — REFINEMENT-IN-PLACE ARCHITECTURE
 *
 * Phase 1 (Opus 4.7): write a 2-3 sentence IDENTITY STATEMENT for the settlement.
 *   Acts as authorial voice for phase 2.
 *
 * Phase 2 (Haiku 4.5, parallel): 8 refinement passes that rewrite specific
 *   prose fields in place. The server starts from a deep clone of the
 *   source settlement, applies refinements on top, and returns the merged
 *   object. Fields the AI never touched fall back to raw data.
 *
 * Field targets are chosen to match what the UI ACTUALLY RENDERS, not a
 * hypothetical schema. Sources:
 *   - src/components/new/tabs/*Tab.jsx  (render paths)
 *   - src/generators/generateSettlement.js  (generated fields)
 *
 * Daily life is a separate type: 5 parallel Opus calls (dawn → night).
 *
 * Streaming NDJSON:
 *   { field: 'thesis', value: string }
 *   { field: '<pass-path>', value: <snapshot> }   per pass
 *   { field: '<pass-key>', error: string }        on pass failure
 *   { done: true, result, creditsRemaining, type, partialFailure?, failedFields? }
 *
 * Partial-failure policy: if the thesis succeeds and some passes fail, we
 * keep what succeeded and do NOT refund — the user got the Opus thesis
 * plus whatever polish completed. If the thesis itself fails, full refund.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;

// Hybrid model strategy:
//   • Opus 4.7 — thesis (highest-visibility prose) + daily life (atmospheric showcase).
//   • Haiku 4.5 — 8 parallel refinement passes. Thesis is passed in as
//     explicit authorial voice so tone stays coherent.
const THESIS_MODEL     = 'claude-opus-4-7';
const REFINEMENT_MODEL = 'claude-haiku-4-5-20251001';
const DAILY_LIFE_MODEL = 'claude-opus-4-7';

const CREDIT_COSTS: Record<string, number> = {
  narrative:   8,
  dailyLife:   10,
  // Progression is pricier than full narrative because it runs the Opus thesis
  // over the prior thesis + the new state + the diff label (much larger input
  // context) and because it preserves voice — the "guarantee of continuity"
  // is the value, not the raw token count.
  progression: 12,
};

// ── Prompt building blocks ──────────────────────────────────────────────────

const HOUSE_STYLE = `Voice: confident, unhurried, a little wry. Prose that earns each sentence. No adjective fatigue, no "nestled," no "bustling," no "quiet dignity," no "tapestry of," no "belies," no "whispers of." No game mechanics language, no stat numbers, no parenthetical asides explaining lore. Present tense where apt. Always replace generic detail with something specific to THIS settlement's data.`;

const PRESERVATION_RULES = `STRICT FACT PRESERVATION:
- Keep every proper noun from the source: names, titles, places, relationships.
- Keep every numerical fact and categorical fact.
- Do not invent new NPCs, factions, institutions, or events.
- Do not contradict any source fact.
- You MAY restructure sentences, improve rhythm, add sensory texture, and tie details to the thesis.
- If a source string is already concrete and specific, you may lightly polish or leave it alone — a non-change is better than drift.`;

const THESIS_INSTRUCTION = `Write a 2-3 sentence IDENTITY STATEMENT for this settlement. In the first sentence, name what it IS at its core — the single specific truth that defines it. In the second (and optional third) sentence, name the central tension or contradiction that animates daily life here. This is the authorial voice that every subsequent description will inherit.

Ground ALL claims in specific data from the context — a specific stressor, a specific faction, a specific trade fact, a specific NPC. If you'd be comfortable writing the same sentence about a different settlement, rewrite it.

${HOUSE_STYLE}

Return ONLY the identity statement. No preamble, no markdown, no headings. Plain prose, one paragraph.`;

// ── Settlement summary ──────────────────────────────────────────────────────

function summarizeSettlement(settlement: Record<string, unknown>): Record<string, unknown> {
  const s = settlement as Record<string, any>;
  const ps = s.powerStructure || {};
  const factions = (ps.factions || []) as any[];
  const governing = factions.find((f: any) => f?.isGoverning);
  const stressArr = Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : [];

  return {
    name: s.name,
    tier: s.tier,
    population: s.population,
    terrain: s.config?.terrainOverride || s.config?.terrainType || s.config?.terrain,
    culture: s.config?.culture,
    tradeRouteAccess: s.config?.tradeRouteAccess,
    monsterThreat: s.config?.monsterThreat,
    prosperity: s.economicViability?.summary || null,
    safetyLabel: s.economicState?.safetyProfile?.safetyLabel || null,
    defenseReadiness: s.defenseProfile?.readiness?.label || null,
    government: {
      type: ps.government?.type,
      governingFaction: governing?.name || null,
    },
    factions: factions.slice(0, 6).map((f: any) => ({
      name: f?.name || f?.faction,
      isGoverning: !!f?.isGoverning,
      desc: f?.desc,
      power: f?.power || f?.powerLabel,
    })),
    conflicts: (ps.conflicts || []).slice(0, 4).map((c: any) => ({
      issue: c?.issue,
      stakes: c?.stakes,
      factions: c?.factions,
    })),
    institutions: (s.institutions || []).slice(0, 12).map((i: any) => ({
      name: i?.name,
      category: i?.category,
      desc: i?.desc,
    })),
    signatureNPCs: (s.npcs || []).slice(0, 6).map((n: any) => ({
      name: n?.name,
      role: n?.role,
      goal: n?.goal?.short,
      secret: n?.secret?.what,
      personality: n?.personality,
    })),
    stressors: stressArr.slice(0, 3).map((t: any) => ({
      type: t?.type,
      label: t?.label,
      summary: t?.summary,
      crisisHook: t?.crisisHook,
    })),
    recentTensions: (s.history?.currentTensions || []).slice(0, 4).map((t: any) => ({
      type: t?.type,
      description: t?.description,
      severity: t?.severity,
    })),
    historicalCharacter: s.history?.historicalCharacter,
    founding: s.history?.founding,
    arrivalScene: s.arrivalScene,
    pressureSentence: s.pressureSentence,
    settlementReason: (
      typeof s.settlementReason === 'string' ? s.settlementReason :
      Array.isArray(s.settlementReason) ? s.settlementReason.filter((x: unknown) => typeof x === 'string').join(' ') :
      s.settlementReason?.primary || null
    ),
    prominentRelationship: s.prominentRelationship?.phrasing,
  };
}

function buildThesisPrompt(summary: Record<string, unknown>): string {
  return `You are the authorial voice of a worldbuilding narrator for tabletop RPGs.

${THESIS_INSTRUCTION}

Settlement context:
${JSON.stringify(summary, null, 2)}`;
}

// ── Refinement pass infrastructure ──────────────────────────────────────────

/**
 * Runtime context threaded into every pass's `extract`. Currently just
 * `pinnedNpcIds` — the set of NPC ids the DM has flagged to preserve across
 * regenerations. Passes that touch NPC prose (currently only `npcs`) must
 * drop pinned entries from their payload so the model never rewrites them.
 */
type PassContext = {
  pinnedNpcIds: string[];
};

type PassSpec = {
  /** Path on the settlement that best represents what this pass modifies (for streaming snapshot) */
  snapshotPath: string;
  /** Extract the source items/value from the full settlement */
  extract: (s: any, ctx?: PassContext) => unknown;
  /** Apply refined value onto the clone */
  apply: (clone: any, refined: any) => void;
  /** Max tokens */
  max_tokens: number;
  /** Instruction to the model for this pass */
  instruction: string;
};

const REFINEMENT_PASSES: Record<string, PassSpec> = {
  // ── 1. Opening prose — the DM's first read: arrival, pressure, reason, history ──
  opening: {
    snapshotPath: '__opening',
    max_tokens: 1400,
    extract: (s) => {
      const out: Record<string, string> = {};
      if (typeof s.arrivalScene === 'string')                    out.arrivalScene = s.arrivalScene;
      if (typeof s.pressureSentence === 'string')                out.pressureSentence = s.pressureSentence;
      // settlementReason can be string | string[] | { primary: string, ... }
      if (typeof s.settlementReason === 'string') {
        out.settlementReason = s.settlementReason;
      } else if (Array.isArray(s.settlementReason)) {
        const joined = s.settlementReason.filter((x: unknown) => typeof x === 'string').join('\n\n');
        if (joined) out.settlementReason = joined;
      } else if (typeof s.settlementReason?.primary === 'string') {
        out.settlementReason = s.settlementReason.primary;
      }
      if (typeof s.history?.historicalCharacter === 'string')    out.historicalCharacter = s.history.historicalCharacter;
      if (typeof s.prominentRelationship?.phrasing === 'string') out.prominentRelationshipPhrasing = s.prominentRelationship.phrasing;
      return out;
    },
    apply: (clone, r) => {
      if (typeof r?.arrivalScene === 'string')     clone.arrivalScene = r.arrivalScene;
      if (typeof r?.pressureSentence === 'string') clone.pressureSentence = r.pressureSentence;
      if (typeof r?.settlementReason === 'string') {
        const orig = clone.settlementReason;
        if (Array.isArray(orig)) {
          // Preserve array shape — split refined prose on blank lines
          const parts = r.settlementReason.split(/\n\n+/).map((p: string) => p.trim()).filter(Boolean);
          if (parts.length >= orig.length) {
            clone.settlementReason = parts.slice(0, orig.length);
          } else if (parts.length > 0) {
            // Refiner returned fewer parts than source; keep the refined ones
            // and leave remaining raw entries untouched.
            clone.settlementReason = [...parts, ...orig.slice(parts.length)];
          } else {
            clone.settlementReason = [r.settlementReason];
          }
        } else if (orig && typeof orig === 'object' && typeof orig.primary === 'string') {
          clone.settlementReason = { ...orig, primary: r.settlementReason };
        } else {
          clone.settlementReason = r.settlementReason;
        }
      }
      if (typeof r?.historicalCharacter === 'string') {
        clone.history = clone.history || {};
        clone.history.historicalCharacter = r.historicalCharacter;
      }
      if (typeof r?.prominentRelationshipPhrasing === 'string') {
        clone.prominentRelationship = clone.prominentRelationship || {};
        clone.prominentRelationship.phrasing = r.prominentRelationshipPhrasing;
      }
    },
    instruction: `Refine the OPENING NARRATIVE FIELDS. These are the most visible prose in the entire settlement — the DM reads these first.

- arrivalScene: the scene the party sees approaching the settlement. Sensory, present tense, grounded in the terrain and trade specifics. 3-5 sentences.
- pressureSentence: one sentence capturing the political/social pressure this settlement is under RIGHT NOW. Hard-edged, specific, names a tension.
- settlementReason: why this settlement exists where it exists. If the source has multiple paragraphs separated by blank lines, return the SAME NUMBER of paragraphs separated by blank lines, each refined. Keep it tight — 1-2 sentences per paragraph.
- historicalCharacter: a short sentence characterizing the settlement's historical pattern (prosperity/calamity/resilience etc.).
- prominentRelationshipPhrasing: one sentence on the settlement's most important relational dynamic (a patron, a faction tie, a signature rivalry).

Let the thesis color what matters in each one. A sentence that could describe any settlement must be replaced.

${PRESERVATION_RULES}

Return JSON: { "arrivalScene": "<refined>", "pressureSentence": "<refined>", "settlementReason": "<refined>", "historicalCharacter": "<refined>", "prominentRelationshipPhrasing": "<refined>" }. OMIT any key whose source was missing. No preamble, no markdown.`,
  },

  // ── 2. Coherence notes — the "what to watch for" aside ──
  coherenceNotes: {
    snapshotPath: 'coherenceNotes',
    max_tokens: 1000,
    extract: (s) => (s.coherenceNotes || []).slice(0, 8).map((n: any, idx: number) => ({
      id: idx,
      note: typeof n === 'string' ? n : n?.note,
    })).filter((x: any) => typeof x.note === 'string' && x.note.length > 0),
    apply: (clone, r) => {
      const items = r?.items || [];
      if (!Array.isArray(clone.coherenceNotes)) return;
      for (const item of items) {
        if (typeof item?.id !== 'number' || typeof item.note !== 'string') continue;
        const target = clone.coherenceNotes[item.id];
        if (typeof target === 'string') clone.coherenceNotes[item.id] = item.note;
        else if (target && typeof target === 'object') target.note = item.note;
      }
    },
    instruction: `Refine each COHERENCE NOTE. These are DM asides that point at the contradictions and seams in the settlement — what's tonally off, what data points are fighting each other. Let the thesis sharpen the specific contradiction each note is calling out. 1-2 sentences each, incisive, specific.

${PRESERVATION_RULES}

Return JSON: { "items": [{ "id": <number>, "note": "<refined>" }, ...] }. Include every input item. No preamble, no markdown.`,
  },

  // ── 3. Stressors — what's pressing on the settlement ──
  stressors: {
    snapshotPath: 'stress',
    max_tokens: 1000,
    extract: (s) => {
      const arr = Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : []);
      return arr.slice(0, 6).map((t: any, idx: number) => ({
        id: idx,
        type: t?.type,
        label: t?.label,
        summary: t?.summary,
        crisisHook: t?.crisisHook,
      })).filter((x: any) => x.summary || x.crisisHook);
    },
    apply: (clone, r) => {
      const items = r?.items || [];
      const arrRef = Array.isArray(clone.stress) ? clone.stress : (clone.stress ? [clone.stress] : []);
      const wasSingle = !Array.isArray(clone.stress) && !!clone.stress;
      for (const item of items) {
        if (typeof item?.id !== 'number') continue;
        const target = arrRef[item.id];
        if (!target || typeof target !== 'object') continue;
        if (typeof item.summary === 'string')    target.summary = item.summary;
        if (typeof item.crisisHook === 'string') target.crisisHook = item.crisisHook;
      }
      if (wasSingle && arrRef[0]) clone.stress = arrRef[0];
    },
    instruction: `Refine each stressor's SUMMARY and CRISIS HOOK. Keep type and label EXACT.

- summary: 2 sentences capturing what the stressor IS in THIS settlement — who it hurts, who benefits, the specific mechanism it uses to squeeze.
- crisisHook: 1 sentence pointing at the next escalation — what happens if one more thing tips.

${PRESERVATION_RULES}

Return JSON: { "items": [{ "id": <number>, "summary": "<refined>", "crisisHook": "<refined>" }, ...] }. Include every input item. Omit a key if source was empty. No preamble, no markdown.`,
  },

  // ── 4. Factions — who holds what ──
  factions: {
    snapshotPath: 'powerStructure.factions',
    max_tokens: 1800,
    extract: (s) => (s.powerStructure?.factions || []).slice(0, 10).map((f: any, idx: number) => ({
      id: idx,
      name: f?.name || f?.faction,
      isGoverning: !!f?.isGoverning,
      power: f?.power || f?.powerLabel,
      desc: f?.desc,
    })).filter((x: any) => typeof x.desc === 'string' && x.desc.length > 0),
    apply: (clone, r) => {
      const items = r?.items || [];
      const factions = clone.powerStructure?.factions;
      if (!Array.isArray(factions)) return;
      for (const item of items) {
        if (typeof item?.id !== 'number' || typeof item.desc !== 'string') continue;
        const target = factions[item.id];
        if (target && typeof target === 'object') target.desc = item.desc;
      }
    },
    instruction: `Refine each faction's DESC (this is the field the UI displays). Keep name, governing status, and power level EXACT.

Aim for 2-3 sentences per faction. What are they actually doing here RIGHT NOW in THIS settlement? What do they want that they'd never admit? The thesis should color how you frame their role.

${PRESERVATION_RULES}

Return JSON: { "items": [{ "id": <number>, "desc": "<refined>" }, ...] }. Include every input item. No preamble, no markdown.`,
  },

  // ── 5. Conflicts — active power tensions ──
  conflicts: {
    snapshotPath: 'powerStructure.conflicts',
    max_tokens: 1400,
    extract: (s) => {
      const conflicts = (s.powerStructure?.conflicts || []).slice(0, 8).map((c: any, idx: number) => ({
        id: idx,
        factions: c?.factions,
        issue: c?.issue,
        stakes: c?.stakes,
      })).filter((x: any) => x.issue || x.stakes);
      const recentConflict = typeof s.powerStructure?.recentConflict === 'string' ? s.powerStructure.recentConflict : null;
      return { conflicts, recentConflict };
    },
    apply: (clone, r) => {
      const items = r?.items || [];
      const conflicts = clone.powerStructure?.conflicts;
      if (Array.isArray(conflicts)) {
        for (const item of items) {
          if (typeof item?.id !== 'number') continue;
          const target = conflicts[item.id];
          if (!target || typeof target !== 'object') continue;
          if (typeof item.issue === 'string')  target.issue = item.issue;
          if (typeof item.stakes === 'string') target.stakes = item.stakes;
        }
      }
      if (typeof r?.recentConflict === 'string') {
        clone.powerStructure = clone.powerStructure || {};
        clone.powerStructure.recentConflict = r.recentConflict;
      }
    },
    instruction: `Refine each conflict's ISSUE and STAKES, plus the top-level RECENT CONFLICT line. Keep faction names EXACT.

- issue: 1 sentence — what is actually being fought over, concretely.
- stakes: 1 sentence — what each side loses if they back down.
- recentConflict: 1-2 sentences — the most recent flashpoint or current tension, named specifically.

${PRESERVATION_RULES}

Return JSON: { "items": [{ "id": <number>, "issue": "<refined>", "stakes": "<refined>" }, ...], "recentConflict": "<refined>" }. Omit keys/arrays whose source was empty. No preamble, no markdown.`,
  },

  // ── 6. History — founding + events + current tensions ──
  history: {
    snapshotPath: 'history',
    max_tokens: 2000,
    extract: (s) => {
      const h = s.history || {};
      const founding = h.founding && {
        reason: h.founding.reason,
        initialChallenge: h.founding.initialChallenge,
        overcoming: h.founding.overcoming,
        stressNote: h.founding.stressNote,
        foundedBy: h.founding.foundedBy,
      };
      const events = (h.historicalEvents || []).slice(0, 6).map((e: any, idx: number) => ({
        id: idx,
        type: e?.type,
        name: e?.name,
        yearsAgo: e?.yearsAgo,
        description: e?.description,
      })).filter((x: any) => typeof x.description === 'string' && x.description.length > 0);
      const currentTensions = (h.currentTensions || []).slice(0, 6).map((t: any, idx: number) => ({
        id: idx,
        type: t?.type,
        severity: t?.severity,
        description: t?.description,
      })).filter((x: any) => typeof x.description === 'string' && x.description.length > 0);
      return { founding, events, currentTensions };
    },
    apply: (clone, r) => {
      if (!clone.history) clone.history = {};
      if (r?.founding && typeof r.founding === 'object' && clone.history.founding && typeof clone.history.founding === 'object') {
        for (const k of ['reason', 'initialChallenge', 'overcoming', 'stressNote', 'foundedBy']) {
          if (typeof r.founding[k] === 'string') clone.history.founding[k] = r.founding[k];
        }
      }
      const events = r?.events || [];
      if (Array.isArray(clone.history.historicalEvents)) {
        for (const item of events) {
          if (typeof item?.id !== 'number' || typeof item.description !== 'string') continue;
          const target = clone.history.historicalEvents[item.id];
          if (target && typeof target === 'object') target.description = item.description;
        }
      }
      const tensions = r?.currentTensions || [];
      if (Array.isArray(clone.history.currentTensions)) {
        for (const item of tensions) {
          if (typeof item?.id !== 'number' || typeof item.description !== 'string') continue;
          const target = clone.history.currentTensions[item.id];
          if (target && typeof target === 'object') target.description = item.description;
        }
      }
    },
    instruction: `Refine the HISTORICAL NARRATIVE: founding, events, and current tensions.

- founding.reason / initialChallenge / overcoming / stressNote / foundedBy: keep factual anchors, polish phrasing to feel like lived history — what do old-timers still say about this? 1-2 sentences per field.
- events[].description: 2-3 sentences each. Ground each event in specific consequence — what did this change that's still true today?
- currentTensions[].description: 1-2 sentences each, tied to named factions where possible.

${PRESERVATION_RULES}

Return JSON: { "founding": { "reason": "...", "initialChallenge": "...", "overcoming": "...", "stressNote": "...", "foundedBy": "..." }, "events": [{ "id": <number>, "description": "<refined>" }, ...], "currentTensions": [{ "id": <number>, "description": "<refined>" }, ...] }. Omit any key/array whose source was empty. No preamble, no markdown.`,
  },

  // ── 7. Institutions — buildings and what they mean here ──
  institutions: {
    snapshotPath: 'institutions',
    max_tokens: 1800,
    extract: (s) => (s.institutions || []).slice(0, 20).map((i: any, idx: number) => ({
      id: idx,
      name: i?.name,
      category: i?.category,
      desc: i?.desc,
    })).filter((x: any) => typeof x.desc === 'string' && x.desc.length > 0),
    apply: (clone, r) => {
      const items = r?.items || [];
      if (!Array.isArray(clone.institutions)) return;
      for (const item of items) {
        if (typeof item?.id !== 'number' || typeof item.desc !== 'string') continue;
        const target = clone.institutions[item.id];
        if (target && typeof target === 'object') target.desc = item.desc;
      }
    },
    instruction: `Refine each institution's DESC (this is the field the UI displays). Keep name and category EXACT.

Aim for 2 sentences per description. Don't just describe what the building is — say what it's FOR in THIS settlement, who really runs it, what's peculiar about how it operates here.

${PRESERVATION_RULES}

Return JSON: { "items": [{ "id": <number>, "desc": "<refined>" }, ...] }. Include every input item. No preamble, no markdown.`,
  },

  // ── 8. NPCs — the characters the party will meet ──
  //   Honors `ctx.pinnedNpcIds`: entries whose real NPC id appears in the
  //   set are dropped from the payload so the model never rewrites them.
  //   The synthetic `id: idx` used by apply() still maps to the correct
  //   clone.npcs[idx], so unfiltered entries round-trip as before.
  npcs: {
    snapshotPath: 'npcs',
    max_tokens: 2000,
    extract: (s, ctx) => {
      const pinnedSet = new Set((ctx?.pinnedNpcIds || []).map(String));
      // Pin key matches the client's `npc.id ?? npc.name` fallback so a DM
      // can pin NPCs that lack a stable id (shouldn't happen in production
      // but keeps the filter defensive).
      return (s.npcs || []).slice(0, 15).map((n: any, idx: number) => ({
        id: idx,
        pinKey: n?.id != null ? String(n.id)
              : n?.name != null ? String(n.name)
              : null,
        name: n?.name,
        role: n?.role,
        goalShort: n?.goal?.short,
        secretWhat: n?.secret?.what,
      })).filter((x: any) => {
        if (x.pinKey && pinnedSet.has(x.pinKey)) return false;
        return x.goalShort || x.secretWhat;
      }).map(({ pinKey: _omit, ...rest }: any) => rest);
    },
    apply: (clone, r) => {
      const items = r?.items || [];
      if (!Array.isArray(clone.npcs)) return;
      for (const item of items) {
        if (typeof item?.id !== 'number') continue;
        const target = clone.npcs[item.id];
        if (!target || typeof target !== 'object') continue;
        if (typeof item.goalShort === 'string') {
          target.goal = target.goal || {};
          target.goal.short = item.goalShort;
        }
        if (typeof item.secretWhat === 'string') {
          target.secret = target.secret || {};
          target.secret.what = item.secretWhat;
        }
      }
    },
    instruction: `For each NPC, refine their GOAL.SHORT and SECRET.WHAT. Keep name and role EXACT.

- goalShort: 1 concrete sentence — what this person is TRYING to get or do, specific to this settlement.
- secretWhat: 1 sentence — what they're hiding. Make it dramatically useful — something the party could leverage.

Both should feel like they belong in THIS settlement, not a generic fantasy town.

${PRESERVATION_RULES}

Return JSON: { "items": [{ "id": <number>, "goalShort": "<refined>", "secretWhat": "<refined>" }, ...] }. Include every input item. Omit a key if source was empty. No preamble, no markdown.`,
  },

  // ── 9. Safety / viability — the "what's actually dangerous here" prose ──
  safety: {
    snapshotPath: '__safety',
    max_tokens: 1600,
    extract: (s) => {
      const sp = s.economicState?.safetyProfile || {};
      const out: any = {};
      if (typeof s.economicViability?.summary === 'string')      out.viabilitySummary = s.economicViability.summary;
      if (typeof sp.guardEffectivenessDesc === 'string')         out.guardEffectivenessDesc = sp.guardEffectivenessDesc;
      if (typeof sp.safetyDesc === 'string')                     out.safetyDesc = sp.safetyDesc;
      if (typeof sp.economicDragDesc === 'string')               out.economicDragDesc = sp.economicDragDesc;
      if (Array.isArray(sp.crimeTypes)) {
        out.crimeTypes = sp.crimeTypes.slice(0, 6).map((c: any, idx: number) => ({
          id: idx,
          type: c?.type,
          desc: c?.desc,
        })).filter((x: any) => typeof x.desc === 'string' && x.desc.length > 0);
      }
      return out;
    },
    apply: (clone, r) => {
      if (typeof r?.viabilitySummary === 'string') {
        clone.economicViability = clone.economicViability || {};
        clone.economicViability.summary = r.viabilitySummary;
      }
      const sp = clone.economicState?.safetyProfile;
      if (sp && typeof sp === 'object') {
        if (typeof r?.guardEffectivenessDesc === 'string') sp.guardEffectivenessDesc = r.guardEffectivenessDesc;
        if (typeof r?.safetyDesc === 'string')             sp.safetyDesc = r.safetyDesc;
        if (typeof r?.economicDragDesc === 'string')       sp.economicDragDesc = r.economicDragDesc;
        if (Array.isArray(r?.crimeTypes) && Array.isArray(sp.crimeTypes)) {
          for (const item of r.crimeTypes) {
            if (typeof item?.id !== 'number' || typeof item.desc !== 'string') continue;
            const target = sp.crimeTypes[item.id];
            if (target && typeof target === 'object') target.desc = item.desc;
          }
        }
      }
    },
    instruction: `Refine the SAFETY and VIABILITY PROSE. These are field-specific descriptions the DM reads to understand the settlement's survival odds and danger level.

- viabilitySummary: 2-3 sentences, concrete. If NOT VIABLE, preserve the "✗ NOT VIABLE:" prefix exactly and refine only the explanation after.
- guardEffectivenessDesc: 1-2 sentences on how competent/present the guard actually is here.
- safetyDesc: 1-2 sentences on what walking the streets is actually like.
- economicDragDesc: 1-2 sentences on how crime/unsafety drags on the economy.
- crimeTypes[].desc: 1-2 sentences each on what THIS type of crime actually looks like in THIS settlement.

${PRESERVATION_RULES}

Return JSON: { "viabilitySummary": "<refined>", "guardEffectivenessDesc": "<refined>", "safetyDesc": "<refined>", "economicDragDesc": "<refined>", "crimeTypes": [{ "id": <number>, "desc": "<refined>" }, ...] }. Omit any key whose source was empty. No preamble, no markdown.`,
  },

  // ── 10. Identity markers — short sensory details that make THIS settlement specific ──
  //   DM-facing texture. 4-6 one-liners the DM can drop into description.
  identityMarkers: {
    snapshotPath: 'identityMarkers',
    max_tokens: 600,
    extract: (s) => {
      const out: Record<string, unknown> = {
        name: s.name,
        tier: s.tier,
        terrain: s.config?.terrainOverride || s.config?.terrainType || s.config?.terrain,
        culture: s.config?.culture,
      };
      const insts = (s.institutions || []).slice(0, 6).map((i: any) => ({
        name: i?.name, category: i?.category,
      })).filter((x: any) => x.name);
      if (insts.length) out.institutions = insts;
      const exports_ = (s.economicState?.primaryExports || []).slice(0, 4).map((e: any) =>
        typeof e === 'string' ? e : e?.name || e?.good
      ).filter(Boolean);
      if (exports_.length) out.exports = exports_;
      // Need at least *something* tangible to ground on.
      return (insts.length || exports_.length) ? out : {};
    },
    apply: (clone, r) => {
      if (Array.isArray(r?.items)) {
        clone.identityMarkers = r.items.filter((x: unknown) => typeof x === 'string' && x.length > 0);
      }
    },
    instruction: `Write 4-6 IDENTITY MARKERS for this settlement. Each is ONE concrete sensory or physical detail — an architectural quirk, a characteristic sound, a recurring smell, a visual motif, a habit of the townsfolk, the one thing travellers remember. Each must be specific to THIS settlement's data (terrain, culture, institutions, exports). If you'd be comfortable writing it about a different settlement, rewrite it.

${HOUSE_STYLE}

Return JSON: { "items": ["<marker 1>", "<marker 2>", ...] }. One sentence each. No numbering inside the strings. No preamble, no markdown.`,
  },

  // ── 11. Friction points — small-scale interpersonal grievances ──
  //   Sits below settlement-wide stressors. Names specific parties.
  frictionPoints: {
    snapshotPath: 'frictionPoints',
    max_tokens: 800,
    extract: (s) => {
      const npcs = (s.npcs || []).slice(0, 6).map((n: any) => ({
        name: n?.name, role: n?.role, faction: n?.factionAffiliation,
      })).filter((x: any) => x.name);
      const factions = (s.powerStructure?.factions || []).slice(0, 4).map((f: any) => ({
        name: f?.name || f?.faction, isGoverning: !!f?.isGoverning,
      })).filter((x: any) => x.name);
      const institutions = (s.institutions || []).slice(0, 3).map((i: any) => ({
        name: i?.name, category: i?.category,
      })).filter((x: any) => x.name);
      // Need at least some named parties to generate interpersonal friction.
      if (!npcs.length && !factions.length) return {};
      return { npcs, factions, institutions };
    },
    apply: (clone, r) => {
      if (Array.isArray(r?.items)) {
        clone.frictionPoints = r.items
          .filter((x: any) => x && typeof x.who === 'string' && typeof x.what === 'string')
          .map((x: any) => ({ who: x.who, what: x.what }));
      }
    },
    instruction: `Write 3-5 FRICTION POINTS — small-scale interpersonal grievances the DM can surface in scenes. These sit one level BELOW settlement-wide stressors: personal, local, named.

Each item MUST name specific parties drawn from the provided NPCs, factions, or institutions. Each item's \`what\` is one sentence capturing the specific grievance — a slight, a debt, a rivalry, an obligation, a resentment.

${PRESERVATION_RULES}

Return JSON: { "items": [{ "who": "<named party or parties>", "what": "<1 sentence grievance>" }, ...] }. Do not invent names. No preamble, no markdown.`,
  },

  // ── 12. Connections map — explicit NPC↔faction↔institution edges ──
  //   Lets the DM navigate politics at the table without re-reading prose.
  connectionsMap: {
    snapshotPath: 'connectionsMap',
    max_tokens: 1000,
    extract: (s) => {
      const npcs = (s.npcs || []).slice(0, 8).map((n: any) => ({
        name: n?.name, role: n?.role, faction: n?.factionAffiliation,
      })).filter((x: any) => x.name);
      const factions = (s.powerStructure?.factions || []).slice(0, 6).map((f: any) => ({
        name: f?.name || f?.faction, isGoverning: !!f?.isGoverning,
      })).filter((x: any) => x.name);
      const institutions = (s.institutions || []).slice(0, 5).map((i: any) => ({
        name: i?.name, category: i?.category,
      })).filter((x: any) => x.name);
      if ((npcs.length + factions.length + institutions.length) < 2) return {};
      return { npcs, factions, institutions };
    },
    apply: (clone, r) => {
      if (Array.isArray(r?.items)) {
        clone.connectionsMap = r.items
          .filter((x: any) => x && typeof x.from === 'string' && typeof x.to === 'string' && typeof x.nature === 'string')
          .map((x: any) => ({
            from:   x.from,
            to:     x.to,
            via:    typeof x.via === 'string' ? x.via : '',
            nature: x.nature,
          }));
      }
    },
    instruction: `Extract 4-8 CONNECTIONS between named entities in this settlement — NPC↔faction, NPC↔institution, faction↔institution, or faction↔faction.

ONLY use names that appear in the provided NPCs / factions / institutions lists. Do NOT invent names. \`nature\` is a short phrase naming the relationship (e.g. "reports to", "funds", "competes with", "hides behind", "owes money to"). \`via\` is optional — use it when the edge is mediated (e.g. "reports to Silver Chain VIA the Moot Hall"); empty string when not.

${PRESERVATION_RULES}

Return JSON: { "items": [{ "from": "<name>", "to": "<name>", "via": "<name or empty>", "nature": "<short phrase>" }, ...] }. No preamble, no markdown.`,
  },

  // ── 13. DM compass — ready-to-run guidance for the table ──
  //   3 hooks + 2 red flags + 1 twist. The "how do I actually RUN this" field.
  dmCompass: {
    snapshotPath: 'dmCompass',
    max_tokens: 900,
    extract: (s) => {
      const stressArr = Array.isArray(s.stress) ? s.stress : (s.stress ? [s.stress] : []);
      const out: Record<string, unknown> = {
        name: s.name,
        tier: s.tier,
        prosperity: s.economicViability?.summary || null,
        safetyLabel: s.economicState?.safetyProfile?.safetyLabel || null,
      };
      const stressors = stressArr.slice(0, 3).map((t: any) => ({
        label: t?.label, summary: t?.summary, crisisHook: t?.crisisHook,
      })).filter((x: any) => x.label);
      if (stressors.length) out.stressors = stressors;
      const conflicts = (s.powerStructure?.conflicts || []).slice(0, 3).map((c: any) => ({
        factions: c?.factions, issue: c?.issue, stakes: c?.stakes,
      })).filter((x: any) => x.issue);
      if (conflicts.length) out.conflicts = conflicts;
      const npcs = (s.npcs || []).slice(0, 3).map((n: any) => ({
        name: n?.name, role: n?.role,
      })).filter((x: any) => x.name);
      if (npcs.length) out.npcs = npcs;
      const factions = (s.powerStructure?.factions || []).slice(0, 3).map((f: any) => ({
        name: f?.name || f?.faction, isGoverning: !!f?.isGoverning,
      })).filter((x: any) => x.name);
      if (factions.length) out.factions = factions;
      return out;
    },
    apply: (clone, r) => {
      const hooks = Array.isArray(r?.hooks)
        ? r.hooks.filter((x: unknown) => typeof x === 'string' && x.length > 0).slice(0, 3)
        : [];
      const redFlags = Array.isArray(r?.redFlags)
        ? r.redFlags.filter((x: unknown) => typeof x === 'string' && x.length > 0).slice(0, 2)
        : [];
      const twist = typeof r?.twist === 'string' ? r.twist : '';
      if (hooks.length || redFlags.length || twist) {
        clone.dmCompass = { hooks, redFlags, twist };
      }
    },
    instruction: `Write DM COMPASS — ready-to-run guidance for running this settlement at the table.

- hooks: exactly 3 adventure hooks, one sentence each. Each hook must be tied to a NAMED stressor, faction, or NPC from the source.
- redFlags: exactly 2 things that might get the party in trouble here (political missteps, custom they'll violate by accident, authority they shouldn't cross). One sentence each.
- twist: exactly 1 sentence — "if the session is dragging, try this." A specific dramatic turn that leverages something already on the page.

${HOUSE_STYLE}

${PRESERVATION_RULES}

Return JSON: { "hooks": ["<hook 1>", "<hook 2>", "<hook 3>"], "redFlags": ["<flag 1>", "<flag 2>"], "twist": "<twist>" }. No preamble, no markdown.`,
  },
};

function buildRefinementPrompt(
  instruction: string,
  thesis: string,
  summary: Record<string, unknown>,
  payload: unknown,
  /** Prior refined value for this pass — used in progression mode to evolve rather than rewrite */
  priorValue?: unknown,
  /** Human-readable change label ("Add market: Silver Crescent") — used in progression mode */
  changeLabel?: string,
): string {
  const priorBlock = priorValue != null && !isEmptyPayload(priorValue)
    ? `

PRIOR VERSION (evolve this, do not discard its best lines):
${JSON.stringify(priorValue, null, 2)}

CHANGE THAT PROMPTED THIS EVOLUTION:
${changeLabel || '(unlabeled change)'}

Your job is to EVOLVE the prior prose to match the new facts. Keep every sentence from the prior version that is still accurate. Rewrite only what the change invalidates. Do not introduce material that wasn't in the prior version AND isn't demanded by the new facts.`
    : '';

  return `You are a worldbuilding narrator for tabletop RPGs. You wrote the thesis below. Now you are REFINING prose in-place for specific data fields.

THESIS (inherit this voice; reference its themes subtly; do not repeat it):
"""
${thesis}
"""

TASK:
${instruction}

SETTLEMENT CONTEXT (for grounding only — do not repeat):
${JSON.stringify(summary, null, 2)}

ITEMS TO REFINE:
${JSON.stringify(payload, null, 2)}${priorBlock}

CRITICAL: Return ONLY valid JSON matching the schema in the task. No markdown code fences, no preamble, no commentary.`;
}

// ── Progression ─────────────────────────────────────────────────────────────
//
// A `progression` run surgically evolves an existing narrative against a
// change (from classifyChange) instead of regenerating it from scratch.
// The DM keeps voice and pinned NPCs; we only re-run the passes whose output
// the change plausibly invalidates.
//
// Thesis ALWAYS re-runs — the settlement's identity may have shifted subtly.
// NPCs are deliberately NOT in any default set: structural edits don't
// invalidate NPCs, and a DM who wants them re-rolled can use full regenerate.
// Seismic changes are blocked by the client; if one arrives here anyway we
// fall back to thesis-only (conservative).

const PROGRESSION_AFFECTED_FIELDS: Record<string, Array<keyof typeof REFINEMENT_PASSES>> = {
  addInstitution:    ['opening', 'factions', 'safety'],
  removeInstitution: ['opening', 'factions', 'safety'],
  addStressor:       ['stressors', 'opening', 'dmCompass', 'conflicts'],
  removeStressor:    ['stressors', 'dmCompass'],
  addTradeGood:      ['safety', 'identityMarkers'],
  removeTradeGood:   ['safety'],
  addResource:       ['safety'],
  removeResource:    ['safety'],
  setResourceState:  ['safety', 'stressors'],
  setPrioritySlider: ['safety', 'dmCompass'],
};

function buildProgressionThesisPrompt(
  priorThesis: string,
  changeLabel: string,
  summary: Record<string, unknown>,
): string {
  return `You are the authorial voice of a worldbuilding narrator for tabletop RPGs.

You wrote the previous identity statement for this settlement:
"""
${priorThesis || '(no prior thesis was recorded)'}
"""

The settlement has changed: ${changeLabel || '(unlabeled change)'}

Update the identity statement to acknowledge this shift without throwing away what was true. Keep the voice. Two to three sentences. Ground the new claim in a specific data point from the new state — name a faction, a stressor, an institution, a trade fact, or an NPC.

${HOUSE_STYLE}

Return ONLY the identity statement. No preamble, no markdown, no headings. Plain prose, one paragraph.

Settlement context (new state):
${JSON.stringify(summary, null, 2)}`;
}

/**
 * Overlay prior refined prose onto the new-settlement clone.
 *
 * Progression starts clone = deepClone(new raw settlement) so every mechanical
 * fact (including the newly added/removed item) is correct. But the raw clone
 * has RAW prose for every field — losing every prior refinement.
 *
 * This helper copies refined prose from `prior` onto `clone` for every
 * refinable field, matching items by stable key (id/name/label) rather than
 * by array index. Affected passes will then OVERWRITE the copied prose with
 * freshly evolved prose. Non-affected passes keep the prior text, which is
 * the whole point of progression.
 */
function overlayPriorRefinedProse(clone: any, prior: any): void {
  if (!prior || typeof prior !== 'object' || !clone || typeof clone !== 'object') return;

  // ── Scalar string fields: copy if prior had something ──────────────────
  const copyStr = (path: string) => {
    const keys = path.split('.');
    let srcRef: any = prior;
    let dstRef: any = clone;
    for (let i = 0; i < keys.length - 1; i++) {
      srcRef = srcRef?.[keys[i]];
      if (!dstRef || typeof dstRef !== 'object') return;
      if (typeof dstRef[keys[i]] !== 'object' || dstRef[keys[i]] === null) dstRef[keys[i]] = {};
      dstRef = dstRef[keys[i]];
    }
    const last = keys[keys.length - 1];
    if (typeof srcRef?.[last] === 'string' && srcRef[last].length > 0) {
      dstRef[last] = srcRef[last];
    }
  };

  for (const p of [
    'arrivalScene',
    'pressureSentence',
    'history.historicalCharacter',
    'prominentRelationship.phrasing',
    'economicViability.summary',
    'economicState.safetyProfile.guardEffectivenessDesc',
    'economicState.safetyProfile.safetyDesc',
    'economicState.safetyProfile.economicDragDesc',
    'powerStructure.recentConflict',
    'history.founding.reason',
    'history.founding.initialChallenge',
    'history.founding.overcoming',
    'history.founding.stressNote',
    'history.founding.foundedBy',
  ]) copyStr(p);

  // settlementReason: string | string[] | { primary, ... }. Copy only when the
  // shape matches — otherwise the prior prose won't slot back cleanly.
  if (prior.settlementReason != null && clone.settlementReason != null) {
    if (typeof prior.settlementReason === 'string' && typeof clone.settlementReason === 'string') {
      clone.settlementReason = prior.settlementReason;
    } else if (Array.isArray(prior.settlementReason) && Array.isArray(clone.settlementReason)
               && prior.settlementReason.length === clone.settlementReason.length) {
      clone.settlementReason = prior.settlementReason.slice();
    } else if (typeof prior.settlementReason === 'object' && typeof prior.settlementReason.primary === 'string'
               && typeof clone.settlementReason === 'object' && clone.settlementReason) {
      clone.settlementReason = { ...clone.settlementReason, primary: prior.settlementReason.primary };
    }
  }

  // ── Array fields: match by stable key, copy refined fields ─────────────

  // NPCs — match by id (fall back name)
  if (Array.isArray(prior.npcs) && Array.isArray(clone.npcs)) {
    const npcKey = (n: any) => n?.id != null ? String(n.id) : String(n?.name || '');
    const priorMap = new Map(prior.npcs.map((n: any) => [npcKey(n), n]));
    for (const cn of clone.npcs) {
      const p: any = priorMap.get(npcKey(cn));
      if (!p) continue;
      if (typeof p?.goal?.short === 'string') {
        cn.goal = cn.goal || {};
        cn.goal.short = p.goal.short;
      }
      if (typeof p?.secret?.what === 'string') {
        cn.secret = cn.secret || {};
        cn.secret.what = p.secret.what;
      }
    }
  }

  // Institutions — match by name
  if (Array.isArray(prior.institutions) && Array.isArray(clone.institutions)) {
    const priorMap = new Map(prior.institutions.map((i: any) => [String(i?.name || ''), i]));
    for (const ci of clone.institutions) {
      const p: any = priorMap.get(String(ci?.name || ''));
      if (p && typeof p.desc === 'string') ci.desc = p.desc;
    }
  }

  // Factions — match by name/faction
  if (Array.isArray(prior.powerStructure?.factions) && Array.isArray(clone.powerStructure?.factions)) {
    const facKey = (f: any) => String(f?.name || f?.faction || '');
    const priorMap = new Map(prior.powerStructure.factions.map((f: any) => [facKey(f), f]));
    for (const cf of clone.powerStructure.factions) {
      const p: any = priorMap.get(facKey(cf));
      if (p && typeof p.desc === 'string') cf.desc = p.desc;
    }
  }

  // Stressors — match by type+label (single-object or array)
  {
    const priorStress = Array.isArray(prior.stress) ? prior.stress : (prior.stress ? [prior.stress] : []);
    const cloneStressRef = Array.isArray(clone.stress) ? clone.stress : (clone.stress ? [clone.stress] : []);
    if (priorStress.length && cloneStressRef.length) {
      const sKey = (t: any) => `${t?.type || ''}|${t?.label || ''}`;
      const priorMap = new Map(priorStress.map((t: any) => [sKey(t), t]));
      for (const ct of cloneStressRef) {
        const p: any = priorMap.get(sKey(ct));
        if (!p) continue;
        if (typeof p.summary === 'string')    ct.summary    = p.summary;
        if (typeof p.crisisHook === 'string') ct.crisisHook = p.crisisHook;
      }
    }
  }

  // Conflicts — match by factions tuple (sorted) or issue text
  if (Array.isArray(prior.powerStructure?.conflicts) && Array.isArray(clone.powerStructure?.conflicts)) {
    const cKey = (c: any) => Array.isArray(c?.factions) ? c.factions.slice().sort().join('|') : String(c?.issue || '');
    const priorMap = new Map(prior.powerStructure.conflicts.map((c: any) => [cKey(c), c]));
    for (const cc of clone.powerStructure.conflicts) {
      const p: any = priorMap.get(cKey(cc));
      if (!p) continue;
      if (typeof p.issue === 'string')  cc.issue  = p.issue;
      if (typeof p.stakes === 'string') cc.stakes = p.stakes;
    }
  }

  // Historical events — match by type+name
  if (Array.isArray(prior.history?.historicalEvents) && Array.isArray(clone.history?.historicalEvents)) {
    const eKey = (e: any) => `${e?.type || ''}|${e?.name || ''}`;
    const priorMap = new Map(prior.history.historicalEvents.map((e: any) => [eKey(e), e]));
    for (const ce of clone.history.historicalEvents) {
      const p: any = priorMap.get(eKey(ce));
      if (p && typeof p.description === 'string') ce.description = p.description;
    }
  }

  // Current tensions — match by type+severity (descriptions are fuzzy so type
  // is the stable handle)
  if (Array.isArray(prior.history?.currentTensions) && Array.isArray(clone.history?.currentTensions)) {
    const tKey = (t: any) => `${t?.type || ''}|${t?.severity || ''}`;
    const priorMap = new Map(prior.history.currentTensions.map((t: any) => [tKey(t), t]));
    for (const ct of clone.history.currentTensions) {
      const p: any = priorMap.get(tKey(ct));
      if (p && typeof p.description === 'string') ct.description = p.description;
    }
  }

  // Crime types — match by type
  if (Array.isArray(prior.economicState?.safetyProfile?.crimeTypes)
      && Array.isArray(clone.economicState?.safetyProfile?.crimeTypes)) {
    const priorMap = new Map(
      prior.economicState.safetyProfile.crimeTypes.map((c: any) => [String(c?.type || ''), c]),
    );
    for (const cc of clone.economicState.safetyProfile.crimeTypes) {
      const p: any = priorMap.get(String(cc?.type || ''));
      if (p && typeof p.desc === 'string') cc.desc = p.desc;
    }
  }

  // Coherence notes — match by positional index (no stable identity). When
  // lengths differ, copy only the overlap and leave extras as raw.
  if (Array.isArray(prior.coherenceNotes) && Array.isArray(clone.coherenceNotes)) {
    const n = Math.min(prior.coherenceNotes.length, clone.coherenceNotes.length);
    for (let i = 0; i < n; i++) {
      const pn = prior.coherenceNotes[i];
      const cn = clone.coherenceNotes[i];
      const pStr = typeof pn === 'string' ? pn : pn?.note;
      if (typeof pStr === 'string' && pStr.length > 0) {
        if (typeof cn === 'string') clone.coherenceNotes[i] = pStr;
        else if (cn && typeof cn === 'object') cn.note = pStr;
      }
    }
  }

  // ── Synthesized arrays (exist only in refined output): wholesale copy ──
  if (Array.isArray(prior.identityMarkers)) clone.identityMarkers = prior.identityMarkers.slice();
  if (Array.isArray(prior.frictionPoints))  clone.frictionPoints  = prior.frictionPoints.map((x: any) => ({ ...x }));
  if (Array.isArray(prior.connectionsMap))  clone.connectionsMap  = prior.connectionsMap.map((x: any) => ({ ...x }));
  if (prior.dmCompass && typeof prior.dmCompass === 'object') {
    clone.dmCompass = {
      hooks:    Array.isArray(prior.dmCompass.hooks)    ? prior.dmCompass.hooks.slice()    : [],
      redFlags: Array.isArray(prior.dmCompass.redFlags) ? prior.dmCompass.redFlags.slice() : [],
      twist:    typeof prior.dmCompass.twist === 'string' ? prior.dmCompass.twist : '',
    };
  }
}

// ── Daily life (Opus, 5 parallel paragraphs) ────────────────────────────────

type FieldCfg = { max_tokens: number; instruction: string };

const DAILY_LIFE_FIELDS: Record<string, FieldCfg> = {
  dawn: {
    max_tokens: 280,
    instruction: `Write ONE paragraph (4-5 sentences) on DAWN in this settlement. Who wakes first, what's the first sound after the roosters, which fire gets lit. Ground in the settlement's trade and stressors. Present tense. ${HOUSE_STYLE}`,
  },
  morning: {
    max_tokens: 280,
    instruction: `Write ONE paragraph (4-5 sentences) on the MORNING. Market opening, workers to their posts, children's noise. Name a specific NPC or institution from the data. Present tense. ${HOUSE_STYLE}`,
  },
  midday: {
    max_tokens: 280,
    instruction: `Write ONE paragraph (4-5 sentences) on MIDDAY. Where people gather to eat, who arrives from the road, what the sun does to tempers. Reference the terrain and trade route specifics. ${HOUSE_STYLE}`,
  },
  evening: {
    max_tokens: 280,
    instruction: `Write ONE paragraph (4-5 sentences) on the EVENING. The tavern fills, lamps are lit, news travels. Reference a local stressor or tension if present in the data. ${HOUSE_STYLE}`,
  },
  night: {
    max_tokens: 280,
    instruction: `Write ONE paragraph (4-5 sentences) on the NIGHT. Watch patrols, closed doors, the settlement's overall nighttime mood (quiet? watchful? threatened?). End with a single specific image. ${HOUSE_STYLE}`,
  },
};

function buildDailyLifePrompt(instruction: string, summary: Record<string, unknown>): string {
  return `You are a worldbuilding narrator for tabletop RPGs. ${instruction}

Return ONLY the paragraph. No preamble, no markdown, no heading.

Settlement context:
${JSON.stringify(summary, null, 2)}`;
}

// ── CORS ────────────────────────────────────────────────────────────────────

function getCorsHeaders(req?: Request) {
  const clientUrl = Deno.env.get('CLIENT_URL') || '';
  const allowed = [
    clientUrl,
    'https://settlementforge.com',
    'https://www.settlementforge.com',
    'https://settlementwork.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000',
  ].filter(Boolean);
  const origin = req?.headers?.get('Origin') || '';
  // Allow any http://localhost:<port> origin in addition to the explicit allowlist
  const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin);
  const match = allowed.includes(origin) || isLocalhost || !origin;
  return {
    'Access-Control-Allow-Origin': match ? (origin || '*') : allowed[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    ...(match ? { 'Vary': 'Origin' } : {}),
  };
}

// ── Anthropic call ──────────────────────────────────────────────────────────

async function callAnthropic(prompt: string, maxTokens: number, model: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`AI API error: ${res.status} ${errBody.slice(0, 200)}`);
  }

  const json = await res.json();
  return (json.content?.[0]?.text || '').trim();
}

function safeJsonParse(text: string): any {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`Invalid JSON from model: ${(e as Error).message}`);
  }
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function getByPath(obj: any, path: string): any {
  const keys = path.split('.');
  let ref = obj;
  for (const k of keys) {
    if (ref == null || typeof ref !== 'object') return undefined;
    ref = ref[k];
  }
  return ref;
}

/** Check whether a pass's extracted payload has anything to refine. */
function isEmptyPayload(payload: unknown): boolean {
  if (payload == null) return true;
  if (Array.isArray(payload)) return payload.length === 0;
  if (typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    return Object.keys(obj).length === 0 ||
      Object.values(obj).every((v) =>
        v == null ||
        (typeof v === 'string' && v.length === 0) ||
        (Array.isArray(v) && v.length === 0)
      );
  }
  return false;
}

// ── Main handler ────────────────────────────────────────────────────────────

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const streamHeaders = {
    ...corsHeaders,
    'Content-Type': 'application/x-ndjson',
    'Cache-Control': 'no-cache, no-transform',
    'X-Content-Type-Options': 'nosniff',
  };

  try {
    // Authenticate
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization header');

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) throw new Error('Not authenticated');

    // Parse request
    const {
      type,
      settlement,
      settlementId,
      pinnedNpcIds,
      // Progression-only (AI-4b) — ignored for other types.
      changeType,
      changeLabel,
      priorNarrative,
      priorDailyLife,
    } = await req.json();
    if (!type || !['narrative', 'dailyLife', 'progression'].includes(type)) {
      throw new Error('Invalid type. Must be "narrative", "dailyLife", or "progression"');
    }
    if (!settlement) throw new Error('Missing settlement data');
    if (type === 'progression') {
      if (typeof changeType !== 'string' || !changeType) {
        throw new Error('Progression requires changeType');
      }
      if (!priorNarrative || typeof priorNarrative !== 'object') {
        throw new Error('Progression requires priorNarrative (cannot evolve a never-narrated settlement)');
      }
    }
    // Avoid unused-var lint: priorDailyLife is reserved for a future daily-life
    // progression pass. We accept it now so the client contract doesn't have
    // to change when that ships.
    void priorDailyLife;

    // Normalize pinned NPC ids once, so every pass sees the same stable shape.
    const normalizedPinnedNpcIds: string[] = Array.isArray(pinnedNpcIds)
      ? pinnedNpcIds.filter((x: unknown) => x != null).map((x: unknown) => String(x))
      : [];

    const cost = CREDIT_COSTS[type];

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('credits, role')
      .eq('id', user.id)
      .single();

    const currentCredits = profile?.credits || 0;
    const isElevated = ['developer', 'admin'].includes(profile?.role);

    if (!isElevated) {
      if (currentCredits < cost) {
        throw new Error(`Insufficient credits. Need ${cost}, have ${currentCredits}.`);
      }
      await supabaseAdmin.from('profiles')
        .update({ credits: currentCredits - cost })
        .eq('id', user.id);
      await supabaseAdmin.from('credit_transactions').insert({
        user_id: user.id,
        amount: -cost,
        reason: type,
        settlement_id: settlementId || null,
      });
    }

    const summary = summarizeSettlement(settlement);

    // Streaming NDJSON response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (obj: unknown) => {
          try {
            controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'));
          } catch (_) { /* controller already closed */ }
        };

        const refund = async () => {
          if (isElevated) return;
          try {
            await supabaseAdmin.from('profiles')
              .update({ credits: currentCredits })
              .eq('id', user.id);
            await supabaseAdmin.from('credit_transactions').insert({
              user_id: user.id,
              amount: cost,
              reason: 'refund',
              settlement_id: settlementId || null,
            });
          } catch (refundErr) {
            console.error('[generate-narrative] refund failed:', refundErr);
          }
        };

        try {
          // ── DAILY LIFE: 5 parallel Opus paragraphs ────────────────────────
          if (type === 'dailyLife') {
            const entries = Object.entries(DAILY_LIFE_FIELDS);
            send({ status: 'started', type, totalFields: entries.length });
            const results: Record<string, string> = {};
            let firstError: Error | null = null;

            await Promise.all(entries.map(async ([fieldName, cfg]) => {
              try {
                const prompt = buildDailyLifePrompt(cfg.instruction, summary);
                const value = await callAnthropic(prompt, cfg.max_tokens, DAILY_LIFE_MODEL);
                results[fieldName] = value;
                send({ field: fieldName, value });
              } catch (e) {
                if (!firstError) firstError = e as Error;
                send({ field: fieldName, error: (e as Error).message });
              }
            }));

            if (firstError) {
              await refund();
              send({ error: (firstError as Error).message, refunded: !isElevated });
            } else {
              send({
                done: true,
                result: results,
                creditsRemaining: isElevated ? currentCredits : currentCredits - cost,
                type,
              });
            }
            controller.close();
            return;
          }

          // ── PROGRESSION: thesis + subset of refinement passes ─────────────
          if (type === 'progression') {
            const affectedKeys = PROGRESSION_AFFECTED_FIELDS[changeType] || [];
            // Filter to passes that actually exist (defensive against future
            // changes to either map).
            const affectedEntries = affectedKeys
              .map((k) => [k, REFINEMENT_PASSES[k]] as const)
              .filter(([, spec]) => !!spec);

            send({
              status: 'started',
              type,
              totalFields: 1 + affectedEntries.length,
              phase: 'thesis',
              changeType,
              changeLabel: typeof changeLabel === 'string' ? changeLabel : '',
            });

            // Phase 1: Opus thesis grounded in prior thesis + changeLabel
            let thesis: string;
            try {
              const priorThesis = typeof priorNarrative?.thesis === 'string' ? priorNarrative.thesis : '';
              thesis = await callAnthropic(
                buildProgressionThesisPrompt(
                  priorThesis,
                  typeof changeLabel === 'string' ? changeLabel : '',
                  summary,
                ),
                600,
                THESIS_MODEL,
              );
            } catch (e) {
              await refund();
              send({ error: `Progression thesis failed: ${(e as Error).message}`, refunded: !isElevated });
              controller.close();
              return;
            }

            // Start clone from new settlement, then overlay prior refined prose
            // so non-affected passes keep their text. Affected passes will
            // overwrite the relevant fields with evolved prose.
            const aiClone = deepClone(settlement);
            overlayPriorRefinedProse(aiClone, priorNarrative);
            aiClone.thesis = thesis;
            send({ field: 'thesis', value: thesis });

            // Phase 2: run affected passes with priorValue threading.
            const passCtx: PassContext = { pinnedNpcIds: normalizedPinnedNpcIds };
            send({ status: 'phase', phase: 'refinements', total: affectedEntries.length });
            const failedFields: string[] = [];
            const succeededFields: string[] = [];
            const skippedFields: string[] = [];

            await Promise.all(affectedEntries.map(async ([key, spec]) => {
              try {
                const payload = spec.extract(settlement, passCtx);
                if (isEmptyPayload(payload)) {
                  skippedFields.push(key);
                  return;
                }
                const priorValue = spec.extract(priorNarrative, passCtx);
                const prompt = buildRefinementPrompt(
                  spec.instruction,
                  thesis,
                  summary,
                  payload,
                  isEmptyPayload(priorValue) ? undefined : priorValue,
                  typeof changeLabel === 'string' ? changeLabel : undefined,
                );
                const raw = await callAnthropic(prompt, spec.max_tokens, REFINEMENT_MODEL);
                const parsed = safeJsonParse(raw);
                spec.apply(aiClone, parsed);
                succeededFields.push(key);

                const path = spec.snapshotPath.startsWith('__') ? key : spec.snapshotPath;
                const snapshot = spec.snapshotPath.startsWith('__')
                  ? { ok: true }
                  : getByPath(aiClone, spec.snapshotPath);
                send({ field: path, value: snapshot });
              } catch (e) {
                failedFields.push(key);
                console.error(`[generate-narrative] progression pass '${key}' failed:`, (e as Error).message);
                send({ field: key, error: (e as Error).message });
              }
            }));

            send({
              done: true,
              result: aiClone,
              creditsRemaining: isElevated ? currentCredits : currentCredits - cost,
              type,
              changeType,
              partialFailure: failedFields.length > 0,
              failedFields,
              succeededFields,
              skippedFields,
            });
            controller.close();
            return;
          }

          // ── NARRATIVE: thesis + refinement passes ─────────────────────────
          const passEntries = Object.entries(REFINEMENT_PASSES);
          const totalFields = 1 + passEntries.length; // thesis + 9 passes

          send({ status: 'started', type, totalFields, phase: 'thesis' });

          // Phase 1: Opus thesis
          let thesis: string;
          try {
            thesis = await callAnthropic(
              buildThesisPrompt(summary),
              600,
              THESIS_MODEL,
            );
          } catch (e) {
            await refund();
            send({ error: `Thesis generation failed: ${(e as Error).message}`, refunded: !isElevated });
            controller.close();
            return;
          }

          const aiClone = deepClone(settlement);
          aiClone.thesis = thesis;
          send({ field: 'thesis', value: thesis });

          // Phase 2: run all refinement passes in parallel
          send({ status: 'phase', phase: 'refinements', total: passEntries.length });
          const failedFields: string[] = [];
          const succeededFields: string[] = [];
          const skippedFields: string[] = [];

          const passCtx: PassContext = { pinnedNpcIds: normalizedPinnedNpcIds };
          await Promise.all(passEntries.map(async ([key, spec]) => {
            try {
              const payload = spec.extract(settlement, passCtx);
              if (isEmptyPayload(payload)) {
                skippedFields.push(key);
                return;
              }

              const prompt = buildRefinementPrompt(spec.instruction, thesis, summary, payload);
              const raw = await callAnthropic(prompt, spec.max_tokens, REFINEMENT_MODEL);
              const parsed = safeJsonParse(raw);

              spec.apply(aiClone, parsed);
              succeededFields.push(key);

              // Stream the snapshot. For synthetic paths (starting with '__')
              // we use the pass key as the field name; the client only uses
              // this to drive progress, not to overwrite data (done event is
              // authoritative).
              const path = spec.snapshotPath.startsWith('__') ? key : spec.snapshotPath;
              const snapshot = spec.snapshotPath.startsWith('__')
                ? { ok: true }
                : getByPath(aiClone, spec.snapshotPath);
              send({ field: path, value: snapshot });
            } catch (e) {
              failedFields.push(key);
              console.error(`[generate-narrative] pass '${key}' failed:`, (e as Error).message);
              send({ field: key, error: (e as Error).message });
            }
          }));

          send({
            done: true,
            result: aiClone,
            creditsRemaining: isElevated ? currentCredits : currentCredits - cost,
            type,
            partialFailure: failedFields.length > 0,
            failedFields,
            succeededFields,
            skippedFields,
          });
          controller.close();
        } catch (err) {
          await refund();
          const msg = err instanceof Error ? err.message : 'Unknown error';
          console.error('[generate-narrative] stream error:', msg);
          send({ error: msg, refunded: !isElevated });
          controller.close();
        }
      },
    });

    return new Response(stream, { headers: streamHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const stack = err instanceof Error ? err.stack : undefined;
    console.error('[generate-narrative] error:', message, stack);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
