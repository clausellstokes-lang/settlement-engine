/**
 * pdf/variants.js — Chapter-inclusion rules per export variant.
 *
 * Audit's recommendation: a single PDF blob isn't enough. DMs want
 * three different artifacts depending on what the table needs:
 *   - Draft Brief    → quick prep doc, no timeline, no canon-only chapters
 *   - Canon Dossier  → full campaign-ready document (current behavior)
 *   - Timeline Packet→ lean recap — cover, current state, timeline only
 *
 * Three variants share the same chapter components, gated by this
 * inclusion map. Adding a variant = one entry here + one option in
 * ExportSheet. Adding a chapter = one row across all variants.
 *
 * Values per chapter:
 *   true            — always include
 *   false           — never include
 *   'if-canon'      — include only when phase === 'canon'
 *   'if-narrated'   — include only when AI narrative is present
 *   'if-events'     — include only when eventLog has entries
 */

/** @typedef {'draft_brief' | 'canon_dossier' | 'timeline_packet' | 'campaign_state'} PdfVariant */

export const PDF_VARIANTS = {
  draft_brief: {
    label: 'Draft Brief',
    description: 'Quick prep doc — no timeline, no canon-only sections.',
    chapters: {
      cover: true,
      toc: true,
      overview: true,
      systemState: true,
      timeline: false,
      // The Faith & War chapter is canon-only AND self-gates on dormant
      // live-world state — a draft brief never carries live war/faith.
      faithWar: false,
      tonightAtTheTable: true,
      npcQuickRef: true,
      notableNpcs: true,
      plotHooks: true,
      powerStructure: true,
      identityDailyLife: true,
      services: true,
      institutions: true,
      economicsTrade: true,
      resourcesProduction: true,
      defenseSecurity: true,
      historyFounding: true,
      viabilityAssessment: true,
      relationships: true,
      aiAppendix: 'if-narrated',
    },
  },

  canon_dossier: {
    label: 'Canon Dossier',
    description: 'Full campaign-ready document with current state and timeline.',
    chapters: {
      cover: true,
      toc: true,
      overview: true,
      systemState: true,
      timeline: 'if-canon',
      // Live "Faith & War" chapter — canon-only (the campaign artifact), and
      // self-gates to nothing when the live-world slice is dormant ⇒ a
      // peaceful / deity-free canon save is byte-identical.
      faithWar: 'if-canon',
      tonightAtTheTable: true,
      npcQuickRef: true,
      notableNpcs: true,
      plotHooks: true,
      powerStructure: true,
      identityDailyLife: true,
      services: true,
      institutions: true,
      economicsTrade: true,
      resourcesProduction: true,
      defenseSecurity: true,
      historyFounding: true,
      viabilityAssessment: true,
      relationships: true,
      aiAppendix: 'if-narrated',
    },
  },

  timeline_packet: {
    label: 'Timeline Packet',
    description: 'Lean recap — cover, current state, timeline only. For reviewing what changed.',
    chapters: {
      cover: true,
      toc: true,
      overview: false,
      systemState: true,
      timeline: 'if-canon',
      faithWar: false,
      tonightAtTheTable: false,
      npcQuickRef: false,
      notableNpcs: false,
      plotHooks: false,
      powerStructure: false,
      identityDailyLife: false,
      services: false,
      institutions: false,
      economicsTrade: false,
      resourcesProduction: false,
      defenseSecurity: false,
      historyFounding: false,
      viabilityAssessment: false,
      relationships: false,
      aiAppendix: false,
    },
  },

  // Campaign State / War Room — the premium living-world artifact. Leads with
  // the current State chapter (causal-detail enabled), the live Faith & War
  // chapter, and the Timeline; drops the static reference chapters a DM already
  // has from the dossier. Self-gates exactly like canon: with a dormant
  // live-world slice the Faith & War chapter renders nothing, so a no-campaign
  // export of this variant degrades gracefully to the state-of-the-settlement
  // chapters.
  campaign_state: {
    label: 'Campaign State / War Room',
    description: 'The living-world snapshot — state, the war front & pantheon, and the timeline.',
    chapters: {
      cover: true,
      toc: true,
      overview: true,
      systemState: true,
      timeline: 'if-canon',
      faithWar: 'if-canon',
      tonightAtTheTable: true,
      npcQuickRef: false,
      notableNpcs: false,
      plotHooks: true,
      powerStructure: true,
      identityDailyLife: false,
      services: false,
      institutions: false,
      economicsTrade: false,
      resourcesProduction: false,
      defenseSecurity: true,
      historyFounding: false,
      viabilityAssessment: false,
      relationships: true,
      aiAppendix: false,
    },
  },
};

/**
 * Resolve a chapter inclusion rule against the current run context.
 * Returns true/false; never the conditional sentinel string.
 *
 * @param {true|false|'if-canon'|'if-narrated'|'if-events'} rule
 * @param {{ phase?:string, narrated?:boolean, eventCount?:number }} ctx
 */
export function shouldInclude(rule, ctx) {
  if (rule === true)  return true;
  if (rule === false || rule == null) return false;
  if (rule === 'if-canon')    return ctx.phase === 'canon';
  if (rule === 'if-narrated') return !!ctx.narrated;
  if (rule === 'if-events')   return (ctx.eventCount ?? 0) > 0;
  return !!rule;
}
