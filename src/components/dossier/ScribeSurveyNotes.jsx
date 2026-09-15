/**
 * components/dossier/ScribeSurveyNotes.jsx — THE DM'S SURVEY NOTES (chair ruling 6; W4 car 4).
 *
 * ⛔ THE RULING THIS IMPLEMENTS, AND THE HALF OF IT THAT IS A REFUSAL. "Refused units are SILENTLY
 * THE CORPUS on the player page; on the DM page the artefact's per-unit verdicts are readable in
 * the notebook register as a REPORT." And the sentence after it is the one this panel obeys
 * hardest: "the archiver's hand vs the survey's is NOT printed — the reader is not told which line
 * a model wrote." So this panel never marks a LINE. It lists the POOLS something happened to, on
 * their own, in a collapsed drawer the reader has to open, and the dossier itself reads as one
 * archiver either way.
 *
 * ⛔ NEVER ON THE PLAYER PAGE AND NEVER ON THE PUBLIC PROJECTION. The verdicts are the render's
 * working: which instrument refused which pool and on which arm. A player reading that would be
 * reading the machinery of their own game master's notes.
 *
 * ⛔ NO EM DASH IN ANY STRING THIS FILE RENDERS. The E2 ratchet holds every rendered face at hard
 * zero on the mark, and a report about prose keeps the same bar as the prose it reports on.
 *
 * ⛔ IT IMPORTS NO SCRIBE MODULE BUT THE ARTEFACT READER, which has no imports of its own, and it
 * is reached by a lazy element the caller only creates when `FLAGS.scribe` is lit.
 */
import { useMemo, useState } from 'react';
import { FS, SP, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { flag } from '../../lib/flags.js';
import { proseOf, surveyNotesOf } from '../../lib/scribeArtefact.js';
import { useStore } from '../../store/index.js';

/** The tab ids the card renders under, in the reader's own words. */
const TAB_LABELS = Object.freeze({
  daily_life: 'Daily life',
  defense: 'Defense',
  economics: 'Economics',
  faith: 'Faith',
  history: 'History',
  overview: 'Overview',
  plot_hooks: 'Plot hooks',
  power: 'Power',
  relationships: 'Relationships',
  resources: 'Resources',
  services: 'Services',
  viability: 'Viability',
  war: 'War',
});

/** What each verdict means, in plain words and with no em dash. */
const VERDICT_WORDS = Object.freeze({
  FAIL: 'fell to the written corpus',
  PATCHED: 'kept, with a line replaced by the written corpus',
  WITHHELD: 'kept, with a reading the instruments would not license',
});

/**
 * @param {{playerView?: boolean, publicDossier?: boolean}} props
 */
export default function ScribeSurveyNotes({ playerView = false, publicDossier = false }) {
  const [open, setOpen] = useState(false);
  // ⛔ THE SELECTOR RETURNS THE ARTEFACT ITSELF, NOT THE NOTES. A selector that built a new object
  // on every call would fail zustand's identity compare on every unrelated store write and
  // re-render this panel for each of them. `proseOf` hands back the settlement's own key, whose
  // identity moves exactly when a render lands, and the grouping is memoised on it.
  const prose = useStore((s) => proseOf(s.settlement));
  const notes = useMemo(() => surveyNotesOf(prose), [prose]);

  if (!flag('scribe')) return null;
  if (playerView || publicDossier) return null;
  if (!notes || notes.total === 0) return null;

  const { counts } = notes;
  const summary = [
    counts.failed ? `${counts.failed} drawn from the written corpus` : '',
    counts.patched ? `${counts.patched} with one line replaced` : '',
    counts.withheld ? `${counts.withheld} with a reading withheld` : '',
  ].filter(Boolean).join(', ');

  return (
    <div
      style={{
        padding: '6px 0 6px 10px',
        background: 'rgba(90,110,130,0.06)',
        borderLeft: '3px solid rgba(90,110,130,0.55)',
        fontSize: FS.xs,
        color: swatch['#5A6E82'],
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      {/* The house primitive, in its quietest variant: this is a drawer handle on a notice band,
          not an action, and the estate's raw-button rule is not waived for a new file. */}
      <Button
        variant="ghost"
        size="sm"
        aria-expanded={open}
        onClick={() => setOpen((was) => !was)}
        style={{ padding: 0, minHeight: 0, color: 'inherit', fontWeight: 700, justifyContent: 'flex-start' }}
      >
        {`Survey notes (${summary})`}
      </Button>
      {open && (
        <div style={{ marginTop: SP.xs }}>
          <div style={{ marginBottom: SP.xs, lineHeight: 1.5 }}>
            Every line on this dossier is the archiver&apos;s. These are the places the survey drew
            on the written corpus instead of its own words, and what the instruments said.
          </div>
          {notes.tabs.map((group) => (
            <div key={group.tab} style={{ marginBottom: SP.xs }}>
              <div style={{
                fontSize: FS['8.5'],
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>{TAB_LABELS[group.tab] || group.tab}</div>
              {group.rows.map((row) => (
                <div key={`${row.blockId}::${row.poolKey}::${row.vid}`} style={{ lineHeight: 1.5 }}>
                  {`${row.poolKey}: ${VERDICT_WORDS[row.verdict] || row.verdict}`}
                  {row.patched.length > 0 ? ` at ${row.patched.join(', ')}` : ''}
                  {row.arms.length > 0 ? ` (${row.arms.join(', ')})` : ''}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
