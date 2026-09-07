/** @vitest-environment jsdom */
/**
 * tests/components/narrativeArchivePanel.test.jsx — Wave R-2 Lane A
 * (atlas A20 / VI.2 #39b): the eventNarrativeSnapshots archive has a READER.
 *
 * R-1 disclosed the archive's silent FIFO cap at the write surface
 * (staleNarrative.body, pinned by tests/copy/narrativeArchiveDisclosure).
 * This wave builds the read side. Pins:
 *
 *   • ARCHIVE RENDERS: a save with stamps lists them newest-first — event
 *     label (resolved from the canon log), timestamp, archived thesis.
 *   • HONEST EMPTY STATE: a narrated save with no stamps yet says so and
 *     explains when stamps happen — no fabricated content.
 *   • FIFO CAP REFLECTED: after an 11th event, exactly 10 entries render and
 *     the oldest is gone — the reader shows the record's real retention.
 *   • RETENTION NOTE ↔ CONSTANT: the "holds only the last N" sentence is
 *     coupled to the live MAX_EVENT_NARRATIVE_SNAPSHOTS (same coupling shape
 *     as the R-1 write-side disclosure pin).
 *   • PRODUCTION MOUNT: SettlementDetail lazy-imports and mounts the panel —
 *     the production-importer guard, so this reader can never regress to the
 *     built-but-unmounted fate the atlas found for ChronicleScrollback.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

import NarrativeArchivePanel, { eventLabelFor } from '../../src/components/settlement/NarrativeArchivePanel.jsx';
import {
  appendEventNarrativeSnapshot,
  MAX_EVENT_NARRATIVE_SNAPSHOTS,
} from '../../src/store/eventNarrativeSnapshots.js';

afterEach(() => cleanup());

/** Stamp `count` events exactly the way both writers do (shared helper). */
function stampedAiData(count) {
  let aiData = { aiSettlement: { thesis: 'The town endures.' } };
  for (let i = 1; i <= count; i += 1) {
    aiData = appendEventNarrativeSnapshot(aiData, {
      eventId: `e${i}`,
      aiSettlement: { thesis: `Before event ${i}, the town stood thus.` },
      ts: `2026-07-${String(i).padStart(2, '0')}T12:00:00.000Z`,
    });
  }
  return aiData;
}

function eventLogFor(count) {
  const log = [];
  for (let i = 1; i <= count; i += 1) {
    log.push({ event: { id: `e${i}`, type: 'DAMAGE_INSTITUTION' }, narrativeSummary: `Calamity ${i} strikes` });
  }
  return log;
}

function openPanel() {
  fireEvent.click(screen.getByRole('button', { name: /narrative archive/i }));
}

describe('NarrativeArchivePanel — the archive renders (atlas A20)', () => {
  test('lists stamped snapshots newest-first with event label, timestamp, and archived thesis', () => {
    const save = { aiData: stampedAiData(3), campaignState: { eventLog: eventLogFor(3) } };
    render(<NarrativeArchivePanel save={save} />);
    openPanel();

    const entries = screen.getAllByTestId('narrative-archive-entry');
    expect(entries).toHaveLength(3);
    // Newest first: e3's stamp leads.
    expect(entries[0].textContent).toContain('Calamity 3 strikes');
    expect(entries[0].textContent).toContain('Before event 3, the town stood thus.');
    expect(entries[0].textContent).toContain('2026');
    expect(entries[2].textContent).toContain('Calamity 1 strikes');
  });

  test('a stamp whose event left the log gets an honest generic label, never a fabricated one', () => {
    expect(eventLabelFor('ghost', eventLogFor(2))).toBe('Canon event (no longer in the log)');
    // And the normal path translates the type when no narrativeSummary exists.
    expect(eventLabelFor('e1', [{ event: { id: 'e1', type: 'DAMAGE_INSTITUTION' } }])).toBe('DAMAGE INSTITUTION');
  });

  test('HONEST EMPTY STATE: narrated save, no stamps yet', () => {
    const save = { aiData: { aiSettlement: { thesis: 'The town endures.' } }, campaignState: { eventLog: [] } };
    render(<NarrativeArchivePanel save={save} />);
    openPanel();
    expect(screen.getByText('No archived versions yet.')).toBeTruthy();
    expect(screen.queryAllByTestId('narrative-archive-entry')).toHaveLength(0);
  });
});

describe('NarrativeArchivePanel — retention truth', () => {
  test(`FIFO CAP REFLECTED: the 11th event shows ${MAX_EVENT_NARRATIVE_SNAPSHOTS}, oldest rotated out`, () => {
    const save = { aiData: stampedAiData(11), campaignState: { eventLog: eventLogFor(11) } };
    render(<NarrativeArchivePanel save={save} />);
    openPanel();

    const entries = screen.getAllByTestId('narrative-archive-entry');
    expect(entries).toHaveLength(MAX_EVENT_NARRATIVE_SNAPSHOTS);
    expect(entries[0].textContent).toContain('Calamity 11 strikes');
    // e1 rotated out — its stamp is gone from the reader because it is gone
    // from the record; the reader never resurrects dropped data.
    expect(screen.queryByText(/Before event 1, the town stood thus/)).toBeNull();
    expect(screen.getByText(/Narrative Archive \(10\)/)).toBeTruthy();
  });

  test('the retention note carries the R-1 disclosure with the LIVE cap constant', () => {
    const save = { aiData: stampedAiData(2), campaignState: { eventLog: eventLogFor(2) } };
    render(<NarrativeArchivePanel save={save} />);
    openPanel();
    // Same coupling as tests/copy/narrativeArchiveDisclosure.test.js: the
    // number in the sentence IS the constant, so neither can drift alone.
    expect(
      screen.getByText(new RegExp(`holds only the last ${MAX_EVENT_NARRATIVE_SNAPSHOTS}`)),
    ).toBeTruthy();
  });
});

describe('NarrativeArchivePanel — production mount (the importer guard)', () => {
  test('SettlementDetail lazy-imports and mounts the panel beside the narrative-lineage cluster', () => {
    // process.cwd() is the repo root under vitest (jsdom rewrites
    // import.meta.url to an http: URL, so path resolution goes through cwd).
    const source = readFileSync(
      resolve(process.cwd(), 'src/components/SettlementDetail.jsx'),
      'utf8',
    );
    expect(source).toContain("lazy(() => import('./settlement/NarrativeArchivePanel.jsx'))");
    expect(source).toContain('<NarrativeArchivePanel save={liveSaveEntry} />');
  });

  test('the archive boundary narrates its wait, never a silent fallback (witnessed-wait doctrine)', () => {
    // R-2 MUST-FIX: the mount first shipped as fallback={null}, the 41st silent
    // boundary against tests/lint/loadingNarrationRatchet's pin of 40. That
    // ratchet is a global debt meter, so a regression HERE could hide behind a
    // narration added elsewhere; this pin holds the site itself. The copy is one
    // string, vetoable; a veto rewrites both sides of this coupling.
    const source = readFileSync(
      resolve(process.cwd(), 'src/components/SettlementDetail.jsx'),
      'utf8',
    );
    expect(source).toContain(
      'fallback={<span role="status">Opening the narrative archive…</span>}',
    );
  });
});

describe('NarrativeArchivePanel — the stamp id is addressable, never announced', () => {
  // Wave R-3 (the R-2 escape): the entry heading shipped with a native `title`
  // attribute carrying the raw eventId, which put the panel one over the
  // shrink-only native-tooltip census in tests/domain/guidanceRegistry.walker
  // (488 vs 487; baselines are only ever LOWERED). The id was not re-homed as
  // visible text or as an aria-label — a stamped eventId is a machine key
  // (`event:<ns>:<hash>`) that no surface lets a reader look up, so visible it
  // fails the legibility law and as an aria-label it would REPLACE the heading's
  // accessible name with a hash. These pins hold that shape from both sides.

  test('the entry exposes data-event-id and no native tooltip or accessible-name override', () => {
    const save = { aiData: stampedAiData(2), campaignState: { eventLog: eventLogFor(2) } };
    const { container } = render(<NarrativeArchivePanel save={save} />);
    openPanel();

    // No hover-only affordance anywhere in the rendered panel.
    expect(container.querySelectorAll('[title]')).toHaveLength(0);

    const entries = screen.getAllByTestId('narrative-archive-entry');
    // Newest-first, and each stamp stays machine-addressable by its real id.
    expect(entries.map((el) => el.getAttribute('data-event-id'))).toEqual(['e2', 'e1']);
    // The reader still gets the human label; nothing overrides it for AT.
    expect(entries[0].textContent).toContain('Calamity 2 strikes');
    expect(entries[0].querySelectorAll('[aria-label]')).toHaveLength(0);
  });

  test('SOURCE PIN: the panel never adds a native tooltip back (the census is global, this holds the site)', () => {
    // The census is a whole-src debt meter, so a regression HERE could hide
    // behind a migration that removed a tooltip elsewhere. Same regex the walker
    // uses, applied to this file alone. (The walker scans src/ only, so this
    // file's own copy of the pattern is not itself counted.)
    const NATIVE_TOOLTIP = /title=(\{|")/g;
    const source = readFileSync(
      resolve(process.cwd(), 'src/components/settlement/NarrativeArchivePanel.jsx'),
      'utf8',
    );
    expect(source.match(NATIVE_TOOLTIP)).toBeNull();
  });
});
