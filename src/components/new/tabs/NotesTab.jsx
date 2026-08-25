import { useState } from 'react';
import { Save } from 'lucide-react';
import { useStore } from '../../../store/index.js';
import { FS, swatch } from '../../theme.js';
import { sans, TabIntro } from '../Primitives';
import Button from '../../primitives/Button.jsx';

const BORDER = swatch['#E0D0B0'];
const INK = swatch['#1C1409'];
const SECOND = swatch['#6B5340'];
const GOLD = swatch['#A0762A'];

/**
 * NotesTab — owner-private prep notes for a settlement.
 *
 * @param {{ saveId?: string|null, notes?: object, section?: 'dm'|'ai' }} props
 *   section 'dm'        → DM Notes only (private; never sent to AI)
 *           'ai'        → Campaign Context only (shown for confirmation before AI runs)
 *           undefined   → both sections (legacy single-tab layout)
 *
 * Editing is always allowed — this tab is hidden from the public player view
 * upstream, so whoever sees it owns the settlement. Persistence needs a
 * saveId (notes attach to a saved settlement), so a freshly-generated,
 * not-yet-saved settlement shows a "save first" hint instead of silently
 * dropping the text or freezing the textbox.
 */
export default function NotesTab({ saveId, notes, section }) {
  const updateDossierNotes = useStore(s => s.updateDossierNotes);
  const notesSourceKey = `${notes?.dmNotes || ''}\u0000${notes?.aiGuidance || ''}`;
  const [draft, setDraft] = useState(() => ({
    sourceKey: notesSourceKey,
    dmNotes: notes?.dmNotes || '',
    aiGuidance: notes?.aiGuidance || '',
  }));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!saving && draft.sourceKey !== notesSourceKey) {
    setDraft({
      sourceKey: notesSourceKey,
      dmNotes: notes?.dmNotes || '',
      aiGuidance: notes?.aiGuidance || '',
    });
  }

  const dmNotes = draft.dmNotes;
  const aiGuidance = draft.aiGuidance;
  const setDmNotes = (dmNotes) => setDraft(current => ({ ...current, dmNotes }));
  const setAiGuidance = (aiGuidance) => setDraft(current => ({ ...current, aiGuidance }));

  // section undefined → render both (legacy); otherwise the one sub-tab.
  const showDm = section !== 'ai';
  const showAi = section !== 'dm';

  const save = async () => {
    if (!saveId) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateDossierNotes(saveId, { dmNotes, aiGuidance });
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } finally {
      setSaving(false);
    }
  };

  const textareaStyle = {
    width: '100%',
    minHeight: 150,
    resize: 'vertical',
    boxSizing: 'border-box',
    border: `1px solid ${BORDER}`,
    borderRadius: 6,
    padding: '10px 12px',
    fontSize: FS.sm,
    lineHeight: 1.55,
    color: INK,
    background: '#fffbf5',
    fontFamily: 'Nunito, sans-serif',
  };

  return (
    <div style={{ padding: 18 }}>
      <TabIntro tabKey="notes" />
      <div style={{ display: 'grid', gap: 14 }}>
        {showDm && (
          <section style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 14, background: swatch['#FAF8F4'] }}>
            <div style={{ ...sans, fontSize: FS.xxs, fontWeight: 800, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              DM Notes
            </div>
            <textarea
              aria-label="DM Notes"
              value={dmNotes}
              onChange={e => setDmNotes(e.target.value)}
              placeholder="Private prep, table rulings, secrets, reminders."
              style={textareaStyle}
            />
          </section>
        )}

        {showAi && (
          <section style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 14, background: swatch['#F7F0E4'] }}>
            <div style={{ ...sans, fontSize: FS.xxs, fontWeight: 800, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Campaign Context
            </div>
            <textarea
              aria-label="Campaign Context"
              value={aiGuidance}
              onChange={e => setAiGuidance(e.target.value)}
              placeholder="How does this settlement fit your campaign? e.g. an orc warband hold with a militarized culture; the baron here owes the party a debt..."
              style={textareaStyle}
            />
            <p style={{ margin: '8px 0 0', fontSize: FS.xs, color: SECOND, lineHeight: 1.5 }}>
              Woven into AI narration as established campaign flavor — settlement facts still win where they conflict. It may therefore appear in generated prose, including shared narration if you publish it; otherwise it stays DM-private. You confirm it before each AI run, and DM Notes are never included.
            </p>
          </section>
        )}

        {saveId ? (
          <Button
            type="button"
            variant="primary"
            onClick={save}
            disabled={saving}
            icon={<Save size={15} />}
            style={{ justifySelf: 'start' }}
          >
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save notes'}
          </Button>
        ) : (
          <p style={{ margin: 0, fontSize: FS.xs, color: SECOND, fontStyle: 'italic', lineHeight: 1.5 }}>
            Type freely. Save this settlement to keep your notes with it.
          </p>
        )}
      </div>
    </div>
  );
}
