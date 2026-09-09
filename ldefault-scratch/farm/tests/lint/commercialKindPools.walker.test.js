/**
 * commercialKindPools.walker.test.js — TR-1's phrased-kind census: the exact twenty-kind
 * corpus, re-derived from the content annex on every run.
 *
 * THE ANNEX-READ POLICY, DECIDED UP FRONT: TRADE-VOLUME-ONLY. The one-kind-one-pool merge
 * (2026-08-03) forwarded twenty-three older pools into RECEIPT_POOLS_LEGACY.md; NONE of
 * the TR-1 pools took that forward, and this walker asserts that POSITIVELY (every kind
 * resolves `from === 'trade'`) rather than leaving it to be discovered when a future merge
 * relocates one and the pin goes quietly stale.
 *
 * WHY THIS RE-DERIVES INSTEAD OF SNAPSHOTTING. src/domain/worldPulse/commercialReceiptPools.js
 * was EXTRACTED from the annex by script, never transcribed. The value of that is only
 * realised if something keeps re-checking it: otherwise the first hand edit to either side
 * forks the engine's prose from the content program's corpus silently, and the two drift
 * for as long as nobody diffs them. Every assertion below reads the document.
 *
 * THE READER IS THE ONE READER. tests/helpers/receiptAnnex.js, extended with
 * TRADE_ANNEX_URL rather than forked — the address-lie and first-match defects live in the
 * EXTRACTOR, so a per-volume copy would re-open both once per volume.
 *
 * THE FIVE JOINS PER KIND (L6) are checked here for the nineteen HERALD kinds: annex pool
 * verbatim, registry row with requiredSlots, WHAT_PHRASES, section authority, and — in
 * tests/domain/commercialReasons.test.js — the address chain. The twentieth kind,
 * commercial_relation_line, is the town dossier's relations-panel row; its ABSENCE from the
 * Herald surfaces is asserted here as a decision rather than left to read as an omission.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import { TRADE_ANNEX_URL, anchoredOnce, receiptAnnexPool } from '../helpers/receiptAnnex.js';
import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { SECTION_OF, isExplicitlyRouted } from '../../src/domain/realm/heraldRouting.js';
import {
  COMMERCIAL_RECEIPTS,
  COMMERCIAL_RECEIPT_SLOTS,
} from '../../src/domain/worldPulse/commercialReceiptPools.js';
import {
  COMMERCIAL_HERALD_KINDS,
  COMMERCIAL_KINDS,
  COMMERCIAL_KIND_REGISTRY,
  commercialReceipt,
} from '../../src/domain/worldPulse/commercialReasonsNews.js';

const ANNEX_SOURCE = readFileSync(TRADE_ANNEX_URL, 'utf8');
const SECTION = '# TR-1';
const UNTIL = '# TR-2';

/**
 * THE ANNEX-ID ↔ ENGINE-TOKEN TABLE. The content program spells a kind `cc.<type>`; the
 * engine spells it `commercial_<type>`. One authored table, pinned here, so neither side
 * can drift without reddening — deriving the token from the id in code would make the join
 * a naming convention instead of a decision.
 */
const KIND_OF = Object.freeze({
  'cc.contract_default': 'commercial_contract_default',
  'cc.contract_honored': 'commercial_contract_honored',
  'cc.toll_extortion': 'commercial_toll_extortion',
  'cc.toll_relief': 'commercial_toll_relief',
  'cc.market_exclusion': 'commercial_market_exclusion',
  'cc.market_opened': 'commercial_market_opened',
  'cc.cornering': 'commercial_cornering',
  'cc.provision': 'commercial_provision',
  'cc.famine_profiteering': 'commercial_famine_profiteering',
  'cc.famine_relief': 'commercial_famine_relief',
  'cc.dependency_fear': 'commercial_dependency_fear',
  'cc.dependency_comfort': 'commercial_dependency_comfort',
  'cc.contraband_injury': 'commercial_contraband_injury',
  'cc.honest_gates': 'commercial_honest_gates',
  'cc.route_predation': 'commercial_route_predation',
  'cc.route_wardenship': 'commercial_route_wardenship',
  'cc.suppressed': 'commercial_casus_suppressed',
  'cc.severance_crossing': 'commercial_severance_crossing',
  'cc.partnership_crossing': 'commercial_partnership_crossing',
  'dossier.trade_relation_line': 'commercial_relation_line',
});

/** The ONE dossier-surface kind, named so its Herald absence is a decision. */
const DOSSIER_ONLY_KIND = 'commercial_relation_line';

/** SP-6a's frequency-scaled floor (spine §2 amendment 2026-08-03). */
const FLOOR_BY_SIGNIFICANCE = Object.freeze({ routine: 8, notable: 6, major: 4 });

/** Fixed slot values covering the whole TR-1 slot vocabulary. */
const INTERP = Object.freeze({
  settlement: 'Aldenmoor',
  counterpart: 'Thornwall',
  house: 'House Rowan',
  band: 'deeply',
  reason: 'the sealed ordinance',
  good: 'wool',
  route: 'the North Road',
});

/** The annex's editorial exemplar markers — the same strip the extractor applied. */
const stripEditorial = (line) => line.replace(/\s*\*\([^)]*\)\*\s*$/, '');

/** The slots a rendered-from-template variant actually interpolates. */
const slotsOf = (row) => [...new Set([...row.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))].sort();

/** Render one code-side pool with INTERP, exactly as the projector would. */
function renderedPool(kind) {
  return COMMERCIAL_RECEIPTS[kind].map((variant) => (
    typeof variant === 'function' ? String(variant(INTERP)) : String(variant)
  ));
}

/** The annex block for one kind, through the ONE reader. */
function annexPool(annexId) {
  return receiptAnnexPool(annexId, {
    source: ANNEX_SOURCE, section: SECTION, until: UNTIL, interp: INTERP,
    strip: stripEditorial, annex: 'trade',
  });
}

/** The annex's raw (uninterpolated) rows for one kind, for the slot witness. */
function annexRawRows(annexId) {
  const open = anchoredOnce(ANNEX_SOURCE, new RegExp(`^### ${annexId.replace('.', '\\.')} `, 'gm'), annexId);
  const rest = ANNEX_SOURCE.slice(ANNEX_SOURCE.indexOf('\n', open.index) + 1);
  const next = rest.search(/^#{1,3} /m);
  const block = next >= 0 ? rest.slice(0, next) : rest;
  return [...block.matchAll(/^\d+\. (.+)$/gm)].map((m) => stripEditorial(m[1]));
}

describe('TR-1 kind pools — anti-vacuity anchors', () => {
  test('the annex, the registry and the reader are all live', () => {
    // Every claim below is worthless if the document emptied, the registry collapsed, or
    // the reader stopped finding blocks. All three are proved before anything is trusted.
    expect(ANNEX_SOURCE.length).toBeGreaterThan(20000);
    expect(COMMERCIAL_KIND_REGISTRY.length).toBe(20);
    expect(COMMERCIAL_KINDS).toHaveLength(20);
    expect(Object.keys(KIND_OF)).toHaveLength(20);
    expect(new Set(Object.values(KIND_OF))).toEqual(new Set(COMMERCIAL_KINDS));
    // The reader THROWS on a bad address rather than returning an empty pool — the whole
    // point of routing through it. Proven here so the greens below cannot be emptiness.
    expect(() => annexPool('cc.not_a_kind')).toThrow(/heading/);
  });
});

describe('TR-1 kind pools — the corpus is the annex, re-derived', () => {
  test('every pool is byte-identical to its authored annex block, and none was forwarded', () => {
    for (const [annexId, kind] of Object.entries(KIND_OF)) {
      const authored = annexPool(annexId);
      // POSITIVE: this volume carries its own pools. A future one-kind-one-pool merge that
      // relocated a TR-1 block would flip `from` and red here instead of silently
      // re-pointing the corpus.
      expect(authored.from, `${kind}: pool was forwarded out of the trade annex`).toBe('trade');
      expect(authored.requiredSlots, `${kind}: unexpected legacy requiredSlots block`).toBeNull();
      expect(renderedPool(kind), `${kind}: engine prose has forked from the annex`)
        .toEqual(authored.lines);
    }
  });

  test('the requiredSlots table is the annex\'s own slot witness, row for row', () => {
    // THE ORTHOGONAL WITNESS (LEG-3 in its value-bearing form). Comparing rendered prose
    // alone would pass a pool whose slot table had drifted, because a variant that
    // interpolates nothing renders the same either way. This compares the SLOTS.
    for (const [annexId, kind] of Object.entries(KIND_OF)) {
      const declared = COMMERCIAL_RECEIPT_SLOTS[kind];
      const measured = annexRawRows(annexId).map(slotsOf);
      expect(declared.map((slots) => [...slots]), `${kind}: slot witness`).toEqual(measured);
      expect(declared.length, `${kind}: slot arity`).toBe(COMMERCIAL_RECEIPTS[kind].length);
    }
  });

  test('every pool meets SP-6a\'s frequency-scaled floor for its OWN significance class', () => {
    // Never a hard-coded five (the Class-B lesson): the floor is read from each kind's own
    // declared class, which is itself read off the annex two tests below.
    for (const row of COMMERCIAL_KIND_REGISTRY) {
      const floor = FLOOR_BY_SIGNIFICANCE[row.significance];
      expect(floor, `${row.kind}: unknown significance ${row.significance}`).toBeGreaterThan(0);
      expect(row.pool.length, `${row.kind} (${row.significance}) is under its floor`)
        .toBeGreaterThanOrEqual(floor);
    }
  });

  test('significance and audience are the ANNEX\'s declarations, not the registry\'s opinion', () => {
    for (const [annexId, kind] of Object.entries(KIND_OF)) {
      const heading = anchoredOnce(
        ANNEX_SOURCE, new RegExp(`^### ${annexId.replace('.', '\\.')} .*$`, 'gm'), `${annexId} heading`,
      )[0];
      const significance = /significance: (\w+)/.exec(heading)?.[1];
      const rest = ANNEX_SOURCE.slice(ANNEX_SOURCE.indexOf(heading));
      const audience = /^AUDIENCE: (\S+)$/m.exec(rest)?.[1];
      const row = COMMERCIAL_KIND_REGISTRY.find((entry) => entry.kind === kind);
      expect(row.significance, `${kind}: significance`).toBe(significance);
      expect(row.audience, `${kind}: audience`).toBe(audience);
    }
    // Non-vacuity in both fields: the registry is NOT uniform, so neither comparison can
    // be green because every row happens to carry the same value.
    expect(new Set(COMMERCIAL_KIND_REGISTRY.map((row) => row.significance)))
      .toEqual(new Set(['major', 'notable', 'routine']));
    expect(new Set(COMMERCIAL_KIND_REGISTRY.map((row) => row.audience)))
      .toEqual(new Set(['public', 'dm-only']));
  });
});

describe('TR-1 kind pools — the pair-only fallback floor', () => {
  test('every pool can be rendered from the directed pair\'s two names alone', () => {
    // ⚠ THE MEASURED CORRECTION. The sovereignty pools each carry a wholly SLOTLESS
    // variant; ELEVEN of these twenty do not, because a commercial receipt that named no
    // town would not be an address. The honest floor is therefore PAIR-ONLY: at least one
    // variant whose slots are a subset of {settlement, counterpart}, the two names a
    // directed pair always has. Without this, a pair with no known good or route would
    // render nothing at all and the ledger row would carry an empty receipt.
    const HARD = new Set(['settlement', 'counterpart']);
    /** @type {Record<string, number>} */
    const fallbacks = {};
    for (const kind of COMMERCIAL_KINDS) {
      fallbacks[kind] = COMMERCIAL_RECEIPT_SLOTS[kind]
        .filter((slots) => slots.every((slot) => HARD.has(slot))).length;
      expect(fallbacks[kind], `${kind}: no variant renderable from the pair alone`)
        .toBeGreaterThanOrEqual(1);
      // EXECUTED, not merely counted: the picker really does return a line with nothing
      // but the two town names supplied.
      const picked = commercialReceipt(kind, `floor:${kind}`, {
        settlement: INTERP.settlement, counterpart: INTERP.counterpart,
      });
      expect(picked, `${kind}: picker returned nothing on a pair-only interp`).toBeTruthy();
      expect(picked.line).not.toMatch(/\{|\}|undefined/);
    }
    // The floor is stated as a MEASUREMENT, not a comfortable margin: cornering sits at
    // exactly one, so an annex edit that removed it reds instead of eating the margin.
    expect(fallbacks.commercial_cornering).toBe(1);
  });

  test('with NOTHING supplied, exactly the nine slotless-bearing pools still speak', () => {
    // ⚠ THIS SET IS A MEASUREMENT, AND WRITING IT DOWN CORRECTED A WRONG ASSERTION. The
    // first draft of this walker claimed every pool returns null on an empty interp; nine
    // of them do not, because the annex authored a wholly slotless variant for them. The
    // engine was right and the pin was wrong. Frozen exactly so both arms stay honest: a
    // pool that GAINS a slotless variant reds here (the picker would start speaking with
    // no address at all), and one that LOSES its last one reds too (a kind that used to
    // have an unaddressed voice quietly went silent).
    const SPEAK_WITH_NOTHING = [
      'commercial_casus_suppressed',
      'commercial_contract_default',
      'commercial_dependency_fear',
      'commercial_market_exclusion',
      'commercial_partnership_crossing',
      'commercial_route_predation',
      'commercial_severance_crossing',
      'commercial_toll_extortion',
      'commercial_toll_relief',
    ];
    const speaking = COMMERCIAL_KINDS
      .filter((kind) => commercialReceipt(kind, 'empty', {}) !== null).sort();
    expect(speaking).toEqual(SPEAK_WITH_NOTHING);
    // The other eleven refuse rather than rendering a hole — the arm that matters most.
    for (const kind of COMMERCIAL_KINDS.filter((k) => !SPEAK_WITH_NOTHING.includes(k))) {
      expect(commercialReceipt(kind, 'empty', {}), `${kind}: rendered with no identity`).toBeNull();
    }
    // anchored: the same eleven DO return a line once the pair is supplied (proved in the
    // test above), so this cannot be green because the picker started refusing everything.
    expect(commercialReceipt('commercial_cornering', 'empty', INTERP)).toBeTruthy();
  });
});

describe('TR-1 kind pools — the Herald joins', () => {
  test('every Herald kind is phrased and explicitly routed to the commerce desk', () => {
    expect(COMMERCIAL_HERALD_KINDS).toHaveLength(19);
    for (const kind of COMMERCIAL_HERALD_KINDS) {
      expect(WHAT_PHRASES[kind], `${kind}: no authored reader phrase`).toBeTruthy();
      // A phrase must be a NOUN PHRASE a townsperson would say — and above all NOT the
      // token de-underscored, which is precisely the fallback these rows exist to
      // prevent ('commercial famine profiteering' is not something anyone says). The
      // word "commercial" itself is ordinary English and is not banned: one authored
      // phrase legitimately uses it, which is why this pins the de-underscored TOKEN
      // rather than a substring.
      expect(WHAT_PHRASES[kind]).not.toContain('_');
      expect(WHAT_PHRASES[kind], `${kind}: phrase is the token in disguise`)
        .not.toBe(kind.replace(/_/g, ' '));
      expect(SECTION_OF(kind), `${kind}: desk`).toBe('trade');
      // Explicitly routed, not agreeing by falling through the events catch-all.
      expect(isExplicitlyRouted(kind), `${kind}: routes only by catch-all`).toBe(true);
    }
  });

  test('the dossier relations-panel kind is DELIBERATELY absent from both Herald surfaces', () => {
    // Stated, not omitted. A panel line is not an event to file, so it has no desk and no
    // reader phrase; if a later wave makes it an event, this reds and the decision must be
    // re-argued rather than drifting.
    expect(COMMERCIAL_KINDS).toContain(DOSSIER_ONLY_KIND);
    expect(COMMERCIAL_HERALD_KINDS).not.toContain(DOSSIER_ONLY_KIND);
    expect(WHAT_PHRASES[DOSSIER_ONLY_KIND]).toBeUndefined();
    expect(isExplicitlyRouted(DOSSIER_ONLY_KIND)).toBe(false);
    // anchored: its sibling crossing kind IS routed and phrased one test above, so this
    // absence cannot be green because the two surfaces stopped answering at all.
    expect(isExplicitlyRouted('commercial_severance_crossing')).toBe(true);
    expect(WHAT_PHRASES.commercial_severance_crossing).toBeTruthy();
  });
});
