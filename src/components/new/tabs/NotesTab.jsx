import { useState } from 'react';
import { Save } from 'lucide-react';
import { useStore } from '../../../store/index.js';
import { FS, swatch } from '../../theme.js';
import { sans, TabIntro } from '../Primitives';

const BORDER = '#e0d0b0';
const INK = '#1c1409';
const SECOND = '#6b5340';
const GOLD = '#a0762a';

export default function NotesTab({ saveId, notes, readOnly = false }) {
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

  const save = async () => {
    if (!saveId || readOnly) return;
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
        <section style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 14, background: swatch['#FAF8F4'] }}>
          <div style={{ ...sans, fontSize: FS.xxs, fontWeight: 800, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            DM Notes
          </div>
          <textarea
            value={dmNotes}
            onChange={e => setDmNotes(e.target.value)}
            disabled={readOnly || !saveId}
            placeholder="Private prep, table rulings, secrets, reminders."
            style={textareaStyle}
          />
        </section>

        <section style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 14, background: swatch['#F7F0E4'] }}>
          <div style={{ ...sans, fontSize: FS.xxs, fontWeight: 800, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            AI Guidance
          </div>
          <textarea
            value={aiGuidance}
            onChange={e => setAiGuidance(e.target.value)}
            disabled={readOnly || !saveId}
            placeholder="Optional direction for future AI polish or Daily Life runs."
            style={textareaStyle}
          />
          <p style={{ margin: '8px 0 0', fontSize: FS.xs, color: SECOND, lineHeight: 1.5 }}>
            This field is shown for confirmation before it is sent to AI. DM Notes are never included.
          </p>
        </section>

        {!readOnly && (
          <button
            type="button"
            onClick={save}
            disabled={!saveId || saving}
            style={{
              justifySelf: 'start',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              border: 'none',
              borderRadius: 6,
              background: GOLD,
              color: swatch.white,
              padding: '9px 14px',
              cursor: saving ? 'wait' : 'pointer',
              fontWeight: 800,
              fontSize: FS.sm,
            }}
          >
            <Save size={15} />
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save notes'}
          </button>
        )}
      </div>
    </div>
  );
}
