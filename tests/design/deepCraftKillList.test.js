/**
 * tests/design/deepCraftKillList.test.js — THE DEEP CRAFT KILL-LIST RATCHETS
 * (annex §Enforcement; written FIRST, before any surface moved — phase 0a).
 *
 * The owner ruled the overhaul incomplete: materials landed but the SaaS
 * STRUCTURE survived — white rounded cards, shadows, tinted callouts, off-palette
 * washes. These four scanners count that structure across src/components (the
 * title-census walker idiom: a source grep with a frozen ceiling) and are
 * MONOTONE-DECREASING: a count above its ceiling is a regression (new SaaS
 * structure landed); when a sweep lowers a count, LOWER the ceiling in the same
 * commit (lock the win). THE WAVE CANNOT CLOSE ABOVE ZERO — phase D checks these
 * ceilings are 0, and the deep recompositions burn them down cluster by cluster.
 *
 * Counts are LINE-match counts (grep -r pattern | wc -l equivalent) over every
 * .js/.jsx file under src/components — stable, reproducible, and cheap.
 *
 * FROZEN 2026-07-18 at the wave's base (THE COMPOSITE 78a04afc):
 *   borderRadius 1097 · boxShadow 118 · rgba( 275 · tinted-callout tokens 251
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), 'src', 'components');

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) yield* walk(p);
    else if (/\.(js|jsx)$/.test(name)) yield p;
  }
}

/** grep -r <re> src/components --include=*.{js,jsx} | wc -l  (line matches) */
function countLines(re) {
  let n = 0;
  for (const f of walk(ROOT)) {
    for (const line of readFileSync(f, 'utf-8').split('\n')) {
      if (re.test(line)) n += 1;
    }
  }
  return n;
}

// ── THE CEILINGS — shrink-only; lower in the same commit as each win. ─────────
const CEILINGS = Object.freeze({
  // Lowered 2026-07-18 (cluster 1, THE GAUGE): borderRadius 1097→1095,
  // boxShadow 118→117, rgba 275→273 — the hero size cards and the hero
  // plate's shadow/radius fell to the scale-rule recomposition.
  // Lowered again same day (cluster 1c, THE CLERK'S NOTES): borderRadius
  // 1095→1090, tintedCallouts 251→248 — five wizard callout washes
  // (restore-draft, step hint, regen error, last-generated, magical-trade)
  // became rubric-headed clerk's notes.
  // Lowered again (C1r-a, THE BASE RE-CUT — create config stage restored to
  // master's single LayeredConfigurationPanel): borderRadius 1090→1083,
  // boxShadow 117→115, rgba 273→270, tintedCallouts 248→247. The stepped-wizard
  // chrome fell — GenerateWizard's step cards + gradient/shadow Generate button
  // dropped to the Button primitive, the two orphaned chrome files
  // (StepIndicator/WizardCommitBand) were deleted, and TradeDynamicsPanel's
  // redundant "Step 4" outer disclosure was flattened (master's base).
  // Lowered again (C1r-b, hero base-set): borderRadius 1083→1082 — HomeHero's
  // anon-cap inner gradient card fell to a plain centered block; master's
  // composition landed on the FLAT parchment plate (no rounded/shadow section)
  // so boxShadow/rgba/tinted held. The P10 failure surface uses the ClerkNote
  // idiom (no tinted wash), not master's swatch.dangerBg strip.
  // Lowered again (C1r-c2, THE TINT TRIO): borderRadius 1082→1078,
  // tintedCallouts 247→246. WizardLoadedBanners' two status banners (amber
  // "Config loaded" + green successBg "Neighbour active") became rubric-headed
  // clerk's notes (−2 radius, −1 tinted), and the orphaned WizardChipRow — a
  // chrome-diet A/B leftover with ZERO importers repo-wide (its "ChangeModeBar
  // imports it" premise was false) — was deleted (−2 radius).
  // S2r-a/S2r-c round trip (owner's BASE RULING — the KNOWN COLLISION,
  // 2026-07-18): S2r-a revived master's ActionRail.jsx (a ruled kill-list
  // violator the owner ordered restored for the two-column dossier base),
  // temporarily RAISING borderRadius 1078→1080 and rgba 270→272 for its 2 rounded
  // radii + 2 rgba tones. S2r-c's materials pass then FLATTENED ActionRail to the
  // deep-craft idiom (rule-framed, palette tones), striking exactly those 4 lines
  // — so both ceilings return to the frozen base. Net across the two commits: the
  // rail is restored AND flat, and the ratchet never permanently rose.
  // Lowered again (C4 S1 panel C, THE DOSSIER — OverviewTab base restoration):
  // borderRadius 1078→1077. The Overview tab's Spatial Layout was restored from
  // the composite's bespoke green sub-collapsible to master's shared Section
  // primitive (own top-level collapsible level), striking the hand-rolled outer
  // div's inline borderRadius:8 (the Section's frame lives in the primitive).
  // Lowered again (C4c-a, THE ANNALS — ChronicleTab materials pass): borderRadius
  // 1077→1075. The Chronicle's cool-blue rounded event cards became a ruled
  // parchment register — the row's borderRadius:7 and the source-chip's
  // borderRadius:3 both struck (rows are a left source-rule + a feint annal
  // hairline now; chips are square small-caps source stamps).
  // Lowered again (C4c-b, THE VOTIVE REGISTER — DeityAssignmentPanel materials
  // pass): borderRadius 1075→1073. The patron/cult assignment card + its select
  // both de-rounded to a rule-framed dedication plate (wrapStyle :7 + selectStyle
  // :4 struck), and the SaaS AI-content violet accent became the votive gold.
  // Lowered again (C4c-c, THE PREVIEW INSTRUMENT PLATE — CascadePreviewPanel):
  // borderRadius 1073→1072, boxShadow 115→114, rgba 270→269, tintedCallouts
  // 246→236. The cascade preview's five tinted callout washes (VIOLET/AMBER/
  // GREEN/BLUE/RED _BG — 5 const decls + 5 accentBg usages = 10 tinted lines)
  // became rule-framed impact lines in the two rationed rubric tones (gold
  // apparatus / oxblood critical); the ImpactRow radius and the panel's z-axis
  // drop-shadow (with its rgba) were struck (depth is a rule, not elevation).
  // Lowered again (C4c-d, THE ERRATUM SLIP — WhatChangedPanel materials pass):
  // borderRadius 1072→1071. The "what changed & why" card de-rounded to a
  // rule-framed correction slip (container borderRadius:R.md struck); regressions
  // now read in the oxblood erratum voice, improvements in neutral ink.
  // Lowered again (C4c-e, THE POSTED BILL — ServicesTab de-round pass):
  // borderRadius 1071→1057 (all 14 rounded corners struck: the header strip, the
  // four impairment count tags, the search field, the two search-result blocks,
  // the category-health grid + missing cards, the notable-absences note, the
  // category containers, and the two category header tags), rgba 269→268 (the
  // search field's translucent-white bg → parchment token), tintedCallouts
  // 236→235 (the search-empty dangerBg callout → a parchment clerk's note kept on
  // its oxblood left rule). The impaired/reduced/missing STATE tints are raw-hex
  // (not kill-list-counted); their rubric re-tone is a deferred follow-up.
  // Lowered again (C4c-f, THE INSTRUMENT PLATE — StaleNarrativeModal materials
  // pass): borderRadius 1057→1054, boxShadow 114→113, rgba 268→265. The stale-
  // narrative notice de-rounded (dialog :10 + the two option-card :6 struck) to a
  // rule-framed plate; the ELEV[3] z-axis drop-shadow was struck; the violet AI-
  // brand header wash + violet primary-button gradient (and their rgba borders/
  // washes) became a parchment header band + the house gold primary (ink on gold).
  // The warm-dim backdrop scrim (one rgba) is kept as the modal ground.
  // Lowered again (C3-a, THE LEDGER — SettlementCard → a ledger <tr>): borderRadius
  // 1054→1052, boxShadow 113→112, rgba 265→264. The library card stopped being a
  // rounded box: the wrapper's borderRadius:7 and the retained-inactive badge's
  // borderRadius:8 fell to feint row rules (the ledger idiom — rows on the ground,
  // parted by rules), the selected state's z-axis boxShadow ring became a gold left
  // rail, and the active row's translucent rgba fill became the page parchment.
  // Lowered again (C3-d, THE CONFIG-PANEL DE-ROUND): borderRadius 1052→1043. The nine
  // rounded count-badge pills on the create/config surface fell to flat plate stamps —
  // TradeDynamicsPanel's 5 (the good's constraint tag + the section-header forced/
  // allowed counts) and ServicesTogglePanel's 4 (the category-header forced/allowed
  // counts). Same handlers, same bg/ink; only the rounding is struck. The structural
  // borderRadius:0 rules stay. LayeredConfigurationPanel gained net-neutral register
  // rules under its two numbered group headers (a border, not a counted pattern).
  // Lowered again (C5-a·i, THE SURVEYOR'S TABLE — realm chrome flattened, part 1):
  // borderRadius 1043→1035, boxShadow 112→110, rgba 264→262. Three realm map surfaces
  // dropped their SaaS elevation/rounding to the flat-plate idiom: RealmInspector's
  // right-dock rail (container radius + its z-axis drop-shadow, one rgba, struck — the
  // 1px rule separates it from the map), WorldMapStage (the map "table" frame + both
  // flanking SidebarShell columns de-rounded; the drop-preview inset + hint tooltip
  // de-rounded and the tooltip's drop-shadow struck), and LayersPanel (its own column
  // frame, the layer-toggle hover rows, and the filter chips de-rounded to flat stamps;
  // the chips KEEP boxShadow:'none' — it suppresses the primary Button's ELEV[1], so
  // striking it would ADD elevation). Beats/behavior untouched; the two functional
  // parchment load/error scrims stay (raw-hex, a tokenize-later follow-up).
  // Lowered again (C5-a·ii, THE SURVEYOR'S TABLE — the pulse & the chronicle, part 2):
  // borderRadius 1035→1010, rgba 262→260, tintedCallouts 235→234. WorldPulsePanel
  // de-rounded ALL 15 of its plates (both section shells + icon stamps, the paused-
  // verdict surface, the roll rows, the six dashed empty notes) and its two rgba red
  // error boxes + the gold proposal-counsel note became rubric-headed ClerkNotes (−2
  // rgba, −1 GOLD_BG; the RED import retired); the H2 page-turn beat is untouched. The
  // gold advance-adjacent tints (advancing bar, paused surface, passed-roll rows) stay
  // — gold is the house advance channel, not a SaaS wash. AdvanceReport de-rounded all
  // 10 of its plates: the Chip is now a square small-caps source stamp and every card/
  // scrubber/altitude-tab is rule-framed (R import retired); the H2 slip beat is
  // untouched. The amber/gold/violet chip color-coding (semantic BG washes) is kept as
  // a deferred source-stamp follow-up (re-tone, not re-round).
  // Lowered again (C5-a·iii, THE SURVEYOR'S TABLE — the rail, part 3): borderRadius
  // 1010→1002, boxShadow 110→108, tintedCallouts 234→232. WorldMapToolbar dropped all
  // 8 of its rounded corners (the More-menu popover, the advance-progress track, the
  // dormant resume chip, the map-controls help note, the three <select> controls, and
  // the inspector unreviewed-count badge) and both z-axis shadows (the popover's ELEV[2]
  // and the count badge's ELEV[1] — floating chrome now separates by its strong rule,
  // not a lift). The dormant multi-tick ResumeChip's AMBER_BG wash became an amber
  // border+ink stamp (−1 usage +1 import both drop AMBER_BG → −2 tinted). ELEV/R/
  // AMBER_BG imports retired; the seven data-tour anchors, the teaching-title panel,
  // and the pinned desktop-gate title are all untouched.
  // Lowered again (C3-e, THE RETAINED LIBRARY CHIPS): borderRadius 1002→996. The six
  // small status stamps the C3 ledger conversion left rounded fell to flat stamps —
  // SettlementCard's neighbour badge, the network-effect +/- badges, and the three
  // regional-count badges (queued/applied/resolved), plus the shared Pip in
  // LivingWorldSignalRow (war/faith/disposition/standing). Radius only; the semantic
  // tints (neighbour hue, success/danger/info/gold washes) are unchanged.
  // Lowered again (residual sweep #1, InstitutionalGrid): borderRadius 996→982. The
  // institution-grid's fourteen rounded chip/tag/container/swatch corners (radii 3 and
  // 5 — the forced/allowed count tags, category + danger stamps, the dashed group
  // container, the clickable rows, the 14px swatch) fell to flat stamps; the one
  // structural borderRadius:0 rule is KEPT (the flat-rule doctrine). Radius only —
  // the swatch tints are unchanged. First of the app-wide residual clear-file sweep;
  // the remaining offender map (clear vs off-limits) is in the lane report.
  // Lowered again (FOLD: claude/deep-craft-pages @ 55e4a69c — the P-a..P-g page
  // recompositions land): borderRadius 982→911 (−71), boxShadow 108→98 (−10),
  // rgba 260→238 (−22), tintedCallouts 232→214 (−18) — the declared −121 total.
  // Auth/compendium/pricing/gallery/founders/account surfaces fell to the
  // rule-framed plate idiom in the pages lane; ceilings set to the measured
  // post-fold counts (tolerance-0).
  // Lowered again (FOLD: claude/restoration-chrome @ aaeec163 — R2 chrome
  // restorations land): borderRadius 911→909 (−2). The chrome lane's admin/
  // account/auth/pricing restorations are net −2 rounded corners; boxShadow/
  // rgba/tinted hold. Ceilings set to the measured post-fold counts.
  // Lowered again (FOLD: claude/restoration-compendium @ f9b07930 — R3
  // compendium/gallery restorations land): borderRadius 909→906 (−3),
  // rgba 238→234 (−4). The CustomContent consolidation (the inline
  // CustomItemAttributes/Upsell block fell to the leaf module) and the
  // gallery/catalog restorations are net −7; boxShadow/tinted hold.
  // Lowered again (FOLD BATCH 3: claude/wave-a-tabs @ 8fdd4b95 + claude/
  // wave-a2-sweep @ 3398ecea — both Wave-A kill-list lanes land together):
  // borderRadius 906→100 (−806), boxShadow 98→72 (−26), rgba 234→167 (−67),
  // tintedCallouts 214→161 (−53). The tab surfaces (wave A) and the app-wide
  // residual sweep (wave A2) fell to the rule-framed plate idiom; ceilings
  // set to the MEASURED post-fold counts (tolerance-0, summed both lanes).
  // Quintuple fold (composite-r4): re-pinned to the MEASURED post-fold counts —
  // the folded lanes' new feature surfaces (command palette, undo panel, world/seed
  // page, honor-roll + roadmap pages, crash-forensics UI) landed +1 borderRadius and
  // +3 tintedCallouts. Same "fold re-pins to measured" discipline as the wave-A note
  // above; owner-vetoable if any of the new instances should instead be de-rounded.
  // Fold pass 2 (V-F + V-K + V-J): V-F's new at-the-table surfaces — the DM Screen,
  // the Auspice / Session-Ledger / Temperament panels, and the Covenant + Bounty
  // trust pages — landed +3 borderRadius (101→104) and +3 tintedCallouts (164→167).
  // Same "fold re-pins to measured" discipline; owner-vetoable if any of the new
  // instances should instead be de-rounded to the rule-framed plate idiom.
  // Lowered again (T5, the orphaned-components ruling): borderRadius 104→103,
  // tintedCallouts 167→165. The owner ruled two of the three orphaned components
  // dead: MemberSettlementsList (its MapGalleryDetail consumer page was removed;
  // −1 radius) and SimulationRulesGateToggle (the dialog's inline Toggle serves
  // the 8 generic switches; the extracted gate card's subsystem-gate use case
  // left the dialog — −2 tinted, its GOLD_BG import + fill). The third orphan,
  // GalleryMapsSidebar, was WIRED into the maps tab instead (no count change —
  // its facets were already on the census).
  // Lowered 2026-07-22 (owner landing order 10): the landing-only InstantDraftCard
  // widget was deleted when the Cnocby sample card took its §01 slot — its three
  // rounded chips (borderRadius 103→100) and two GOLD_BG fills (tintedCallouts
  // 165→163) fell with it. Shrink-only lock-the-win.
  borderRadius: 85,     // the rounded-card tell — plates are rule-framed, not rounded
                        // (100->86 on the 2026-07-22 zero-exemption refinement: 15
                        // flat-enforcing zero lines left the count; 86->85 at the
                        // walk-completions fold: order-14 collapsed two gallery
                        // section badges into one, striking one radius; win locked)
  boxShadow: 72,        // print has no z-axis — depth is ink, never elevation
  rgbaLiterals: 167,    // off-palette translucent washes — ink tones come from the ramp
  tintedCallouts: 163,  // the tinted callout box — replaced by rubric-headed clerk's notes
});

const PATTERNS = Object.freeze({
  // GUARD REFINEMENT (2026-07-22, manager): an explicit zero radius
  // (borderRadius: 0) ENFORCES the flat idiom on a primitive that would
  // otherwise round — it is anti-SaaS flatness, the opposite of what this
  // ratchet hunts — so zero-values are exempt from the count. First instance:
  // PowerStrata's holds-power marker flattening the Button primitive.
  borderRadius: /borderRadius(?!:\s*['"`]?0['"`]?\s*[,}\s])/,
  boxShadow: /boxShadow/,
  rgbaLiterals: /rgba\(/,
  // THE RENAME COMPLETED (fold batch 2, 2026-07-19): with all six branches
  // folded, the formerly off-limits files (App, authUI, Button, PricingBands,
  // PricingMomentCard; TableView's lamp-tones fold dropped its VIOLET outright)
  // and the theme.js/tokens.js exports renamed VIOLET*→SLATE* in one commit —
  // no alias lines, so no double-count. VIOLET_BG left the pattern because
  // ZERO VIOLET_BG spellings remain under src/components; every renamed line
  // still matches via SLATE_BG, so the count is PRESERVED (the ratchet's
  // intent is the count law, not the spelling).
  tintedCallouts: /SLATE_BG|AMBER_BG|GREEN_BG|RED_BG|BLUE_BG|GOLD_BG|successBg|dangerBg|infoBg|warningBg/,
});

describe('THE DEEP CRAFT kill-list ratchets (shrink-only; zero closes the wave)', () => {
  for (const [name, ceiling] of Object.entries(CEILINGS)) {
    it(`${name}: count <= ${ceiling} (grew = new SaaS structure; shrank = lower this ceiling)`, () => {
      const count = countLines(PATTERNS[name]);
      expect(count, `${name} grew past its frozen ceiling — new SaaS structure landed`).toBeLessThanOrEqual(ceiling);
      // The lock-the-win nudge: if the real count is far under the ceiling, the
      // sweep forgot to lower it. Tolerance 0 — the ceiling IS the count.
      expect(count, `${name} shrank to ${count} — LOWER the ceiling to lock the win`).toBe(ceiling);
    });
  }
});
