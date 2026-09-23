/** @vitest-environment jsdom */
/**
 * tests/components/advanceReportDecrees.test.jsx — EM-E3, THE ADVANCE REPORT'S
 * DECREE SURFACES (charter EDIT-MODE-TRAIN wave 3 row EM-E3; ARCH §6; design §2.6
 * and §14).
 *
 * Two surfaces, two sources, one report:
 *   · AdvanceReport reads the TICK'S OWN RECEIPT — `decreeCauses`, the key EM-E1's
 *     `applyDecreesAtTick` produces and `pulseKernel` spreads onto the pulse record
 *     ONLY when the cause list is non-empty — and renders one row per applied
 *     decree, in `orderIndex` order, each carrying the chronicle link its mount
 *     supplies.
 *   · RegenerationDeltaCard renders the FIELD-LEVEL DM SECTIONS from EM-B2b's
 *     `dmFields`, which partitions the layer's roots by the declaration's own
 *     `provenance` into exactly two groups: `roots` and `worldFacts`.
 *
 * ⛔ THE OFF-STATE IS THE FIRST ARM AND IT CANNOT BE RED-FIRST. An advance that
 * applied no decree must render what it rendered before this feature existed, to
 * the node — the lighting witness and every reader downstream of this surface
 * assume the no-decree report is untouched. E3-1 executes that directly: the
 * report for a record with NO `decreeCauses` key and the report for one with an
 * EMPTY list are compared as whole DOM trees, and the section is proven absent.
 * The byte-equality against the PRE-CHANGE component itself was executed at build
 * time by planting `git show <BASE>:src/components/map/AdvanceReport.jsx` beside
 * the new one and comparing rendered `innerHTML` — the two shas are quoted in the
 * commit body, which is where a one-shot measurement belongs; freezing that HTML
 * here would mint a golden over every inline style in the report.
 *
 * ⛔ EVERY TARGET BELOW IS WHOLE ON ITS OWN LINE. `tests/docs/enforcedByExists.test.js`
 * reads the marker's line AND each continuation line that OPENS with a path token, so a
 * path wrapped mid-way leaves its basename alone at the head of the next line and is
 * read as a repo-relative path that resolves to nothing. This tag's first cut wrapped
 * after `src/components/map/` and dangled `AdvanceReport.jsx`; never wrap a target.
 *
 * @enforced-by tests/components/advanceReportDecrees.test.jsx (this file's own arms),
 *   src/components/map/AdvanceReport.jsx
 *   src/components/primitives/RegenerationDeltaCard.jsx
 *   being the two surfaces those arms govern.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';

const setSelectedSettlementId = vi.fn();
const STORE = { setSelectedSettlementId };
vi.mock('../../src/store/index.js', () => ({ useStore: selector => selector(STORE) }));

import AdvanceReport from '../../src/components/map/AdvanceReport.jsx';
import { RegenerationDeltaCard } from '../../src/components/primitives/RegenerationDeltaCard.jsx';

afterEach(() => { cleanup(); });

/** One advance record with a single ordinary outcome, plus whatever decree receipt
 *  the arm is about. `extra` is spread LAST so an arm can omit the key entirely,
 *  which is the shape the kernel actually writes at zero decrees. */
function campaignWith(extra) {
  return {
    id: 'c-e3',
    settlementIds: ['A'],
    worldState: {
      pulseHistory: [{
        tick: 4,
        selectedOutcomes: [
          { id: 'o1', headline: 'A stirs', summary: 'Something moved.', targetSaveId: 'A', settlementIds: ['A'], severity: 0.4 },
        ],
        impactDigest: [],
        ...extra,
      }],
    },
  };
}

/** One cause in `decreeHook.js`'s own `DecreeCause` form — nothing invented. */
function cause(decreeId, orderIndex, opType, over = {}) {
  return { decreeId, saveId: 'A', opType, cause: 'table', tickRef: 'tick-4', orderIndex, ...over };
}

const nameFor = (id) => (id === 'A' ? 'Aldermoor' : `Town ${id}`);

describe('EM-E3 · the advance report at ZERO applied decrees', () => {
  test('E3-1: a tick that applied no decree renders the report it rendered before — no section, no wrapper, no node', () => {
    // ⛔ WARM THE MODULE'S ONE-SHOT FIRST. `reportSlipShown` is module-scoped
    // session memory: the FIRST report viewed with a chronicle present wears the
    // `oc-m-slipin` class and no later one does. Two renders compared without this
    // differ on that class alone — the arm caught it on its own red-first run, and
    // it is a property of the slip, not of anything EM-E3 touched.
    render(<AdvanceReport campaign={campaignWith({})} nameFor={nameFor} />);
    cleanup();

    const bare = render(<AdvanceReport campaign={campaignWith({})} nameFor={nameFor} />);
    const absentKeyHtml = bare.container.innerHTML;
    const absentKeyNodes = bare.container.querySelectorAll('*').length;
    // The section is not merely empty: it does not exist, so nothing it could
    // contribute — a border, a gap, a heading — reaches the no-decree reader.
    expect(bare.queryByTestId('chronicle-decree-causes')).toBeNull();
    // The report itself is live, or every absence above is vacuous.
    expect(bare.getByTestId('advance-report')).toBeTruthy();
    expect(absentKeyNodes).toBeGreaterThan(20);
    cleanup();

    // A record whose list is EMPTY rather than absent reads as the same zero. The
    // kernel never writes that shape (it spreads the key only for a non-empty list),
    // and this arm is why a future writer that does cannot move the off-state.
    const empty = render(<AdvanceReport campaign={campaignWith({ decreeCauses: [] })} nameFor={nameFor} />);
    expect(empty.container.innerHTML).toBe(absentKeyHtml);
    expect(empty.container.querySelectorAll('*').length).toBe(absentKeyNodes);

    // THE DECREE TRACKER (§5) is untouched by EM-E3 and stays always-present.
    expect(empty.getByTestId('chronicle-decree-section')).toBeTruthy();
  });
});

describe('EM-E3 · the advance report at N applied decrees', () => {
  test('E3-2: N decrees render N cause rows in orderIndex order, each with its chronicle link', () => {
    // Handed in SCRAMBLED, so the order below can only come from `orderIndex`.
    const causes = [
      cause('d-third', 2, 'set-field'),
      cause('d-first', 0, 'rename-faction'),
      cause('d-second', 1, 'seat-holder'),
    ];
    render(
      <AdvanceReport
        campaign={campaignWith({ decreeCauses: causes })}
        nameFor={nameFor}
        chronicleHref={(c) => `#chronicle/${c.decreeId}`}
      />,
    );

    const section = screen.getByTestId('chronicle-decree-causes');
    const rows = within(section).getAllByTestId('chronicle-decree-cause');
    expect(rows).toHaveLength(3);

    // The op in reader words (humanizeToken, the estate's one chokepoint), in the
    // sequence the guards judged and the tick applied — never the scrambled input's.
    expect(within(rows[0]).getByText('rename faction')).toBeTruthy();
    expect(within(rows[1]).getByText('seat holder')).toBeTruthy();
    expect(within(rows[2]).getByText('set field')).toBeTruthy();

    // The chronicle link is the mount's, one per row, in the same order.
    const links = within(section).getAllByTestId('decree-chronicle-link');
    expect(links.map((a) => a.getAttribute('href')))
      .toEqual(['#chronicle/d-first', '#chronicle/d-second', '#chronicle/d-third']);
    expect(links.map((a) => a.textContent)).toEqual([
      'Read its chronicle line', 'Read its chronicle line', 'Read its chronicle line',
    ]);

    // The settlement the order landed on is NAMED, never shown as its save id.
    // anchored: the three rows and their three hrefs are asserted live above, so this absence is measured against a populated section rather than one that drifted away.
    expect(section.textContent).not.toMatch(/\bd-first\b|\bsaveId\b/);
    expect(within(section).getAllByText('Aldermoor')).toHaveLength(3);
  });

  test('E3-3: a mount with no chronicle routing reports the cause and offers no dead link', () => {
    render(<AdvanceReport campaign={campaignWith({ decreeCauses: [cause('d1', 0, 'set-field')] })} nameFor={nameFor} />);
    const section = screen.getByTestId('chronicle-decree-causes');
    expect(within(section).getAllByTestId('chronicle-decree-cause')).toHaveLength(1);
    expect(within(section).queryByTestId('decree-chronicle-link')).toBeNull();
  });

  test('E3-4: an off-stage cause wears its marker and a cause with no save names nobody', () => {
    const causes = [
      cause('d-off', 0, 'send-envoy', { offStage: true }),
      cause('d-nowhere', 1, 'set-field', { saveId: '' }),
    ];
    render(<AdvanceReport campaign={campaignWith({ decreeCauses: causes })} nameFor={nameFor} />);
    const rows = within(screen.getByTestId('chronicle-decree-causes')).getAllByTestId('chronicle-decree-cause');
    expect(rows).toHaveLength(2);
    expect(rows[0].textContent).toMatch(/off the map/);
    expect(rows[0].textContent).toMatch(/Aldermoor/);
    // anchored: row 0's own name and marker are asserted live on the two lines above, so a partyless row proves "nobody invented" rather than "nothing rendered".
    expect(rows[1].textContent).not.toMatch(/Aldermoor|Town /);
    expect(rows[1].textContent).toMatch(/set field/);
  });
});

describe('EM-E3 · the regeneration card\'s field-level DM sections', () => {
  /** The card is opened by a change the WORLD made; the DM's fields are reported
   *  inside it. See the section's own note for the judgment and its reversal. */
  function worldlyDelta(over = {}) {
    return {
      directEffects: [{ label: 'food_security', before: 'adequate', after: 'strained' }],
      rippleEffects: [], capacityShifts: [], dailyLifeShifts: [], preservedCanon: [],
      brokenDependencies: [], newEntities: [], removedEntities: [],
      newOpportunities: [], newRisks: [], summary: [],
      ...over,
    };
  }

  test('E3-5: each provenance group in dmFields renders with its own count, name and transition', () => {
    render(<RegenerationDeltaCard delta={worldlyDelta({
      dmFields: {
        roots: [
          { key: 'institution:Granary:name', cardShape: 'institution', entityId: 'Granary', field: 'name', dmValue: 'The Long Granary', engineValue: 'Granary' },
          { key: 'npc:n7:role', cardShape: 'npc', entityId: 'n7', field: 'role', dmValue: 'harbourmaster', engineValue: 'reeve' },
        ],
        worldFacts: [
          { configKey: 'culture', dmValue: 'norse', engineValue: 'germanic' },
        ],
      },
    })} />);

    expect(screen.getByText("The DM's fields (2)")).toBeTruthy();
    expect(screen.getByText('institution Granary: name')).toBeTruthy();
    expect(screen.getByText('Granary → The Long Granary')).toBeTruthy();
    expect(screen.getByText('npc n7: role')).toBeTruthy();
    expect(screen.getByText('reeve → harbourmaster')).toBeTruthy();

    // A world fact is named by the key the ENGINE reads — the derivation's own rule.
    expect(screen.getByText('World facts the DM set (1)')).toBeTruthy();
    expect(screen.getByText('culture')).toBeTruthy();
    expect(screen.getByText('germanic → norse')).toBeTruthy();
  });

  test('E3-6: an empty partition renders neither section, and an absent one is the same silence', () => {
    const empty = render(<RegenerationDeltaCard delta={worldlyDelta({ dmFields: { roots: [], worldFacts: [] } })} />);
    expect(empty.getByText('Direct effects (1)')).toBeTruthy();
    expect(empty.queryByText(/The DM's fields/)).toBeNull();
    expect(empty.queryByText(/World facts the DM set/)).toBeNull();
    const emptyHtml = empty.container.innerHTML;
    cleanup();

    // A delta from a caller that never passed the declaration consult carries the
    // key with both arrays empty; one from before EM-B2b carries no key at all.
    // The reader must not tell the two apart.
    const absent = render(<RegenerationDeltaCard delta={worldlyDelta()} />);
    expect(absent.container.innerHTML).toBe(emptyHtml);
  });

  test('E3-7: a DM field is not a change the world made, so it does not open the card by itself', () => {
    const { container } = render(<RegenerationDeltaCard delta={worldlyDelta({
      directEffects: [],
      dmFields: { roots: [{ key: 'npc:n7:role', cardShape: 'npc', entityId: 'n7', field: 'role', dmValue: 'harbourmaster', engineValue: 'reeve' }], worldFacts: [] },
    })} />);
    // The card's own size rule mirrors `regenerationDeltaSize`, which the domain
    // pins to exclude `dmFields` (tests/domain/regenerationDelta.test.js, A6).
    expect(container.firstChild).toBeNull();
  });
});
